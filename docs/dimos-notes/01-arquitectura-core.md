# Arquitectura core

Todo el repo se apoya en tres abstracciones. Si entendés estas tres, entendés DimOS:
**Modules → Blueprints → Skills**.

## Modules

`dimos/core/module.py` (890 líneas), `dimos/core/stream.py` (323 líneas)

Un `Module` es un subsistema autónomo que declara puertos tipados como anotaciones de clase:

```python
from dimos.core.module import Module
from dimos.core.stream import In, Out
from dimos.core.core import rpc
from dimos.msgs.sensor_msgs import Image

class MyModule(Module):
    color_image: In[Image]      # entrada
    processed: Out[Image]       # salida
    tf: IO[TFMessage]           # bidireccional

    @rpc
    def start(self) -> None:
        super().start()
        self.color_image.subscribe(self._process)

    def _process(self, img: Image) -> None:
        self.processed.publish(do_something(img))
```

Características:

- Cada módulo corre en un **proceso worker forkserver** separado.
- Expone métodos vía `@rpc`.
- Ciclo de vida: `build()` → `start()` → `stop()`.
  - `build()` es para trabajo pesado de una sola vez (docker builds, descargas LFS). Tiene
    timeout larguísimo (24h) para que no falle. Por defecto es no-op.
- `deployment: ClassVar` = `"python"` o `"docker"`. El coordinator rutea según eso.
- `dedicated_worker: ClassVar[bool]` fuerza que el módulo sea el único en su worker, para
  módulos pesados que si no compiten por CPU y GIL.
- `ModuleConfig` (pydantic) controla transporte RPC, timeouts, `frame_id`, `frame_id_prefix`,
  `instance_name` y una referencia al `GlobalConfig`.
- `__getstate__` / `__setstate__` excluyen lo no picklable (locks, event loop, RPC, TF) para
  que la instancia pueda cruzar el límite de proceso.

### Streams: In / Out / IO

`In[T]`, `Out[T]` e `IO[T]` son streams genéricos respaldados por un `Transport`.

| Clase | Rol |
|---|---|
| `Out[T]` | publica; mantiene lista de subscribers locales además del transporte |
| `In[T]` | consume; se conecta a un `Out` remoto |
| `IO[T]` | bidireccional, ve el topic entero incluyendo sus propias publicaciones (loopback) |
| `RemoteOut` / `RemoteIn` / `RemoteIO` | proxies que viajan por pickle cuando el stream cruza procesos |

El truco: `__reduce__` en `Out`/`In`/`IO` convierte el stream local en su proxy remoto al
serializar. Requiere que el owner tenga un `ref`, si no tira `ValueError`.

Encima hay un `ObservableMixin` que expone todo como observables de **RxPy**:

- `observable()` devuelve el stream con **backpressure por defecto** (la mayoría de los casos
  lo quiere así).
- `pure_observable()` sin backpressure.
- `get_next(timeout=10.0)` bloquea hasta el primer valor.
- `hot_latest()` devuelve un getter del último valor.

Estados de un stream (`State` enum): `UNBOUND` (descriptor definido, sin bind) → `READY`
(bindeado al owner) → `CONNECTED` (input atado a un output) → `FLOWING` (datos observados).
Se colorean distinto en el output de la CLI.

## Blueprints

`dimos/core/coordination/blueprints.py` (417 líneas)

Un `Blueprint` es una **descripción declarativa e inmutable** (frozen dataclass) de qué
módulos instanciar y cómo cablearlos. Nada se construye en tiempo de definición.

```python
from dimos.core.coordination.blueprints import autoconnect

my_blueprint = autoconnect(module_a(), module_b(), module_c())
my_blueprint.build().loop()   # build() despliega a workers, loop() bloquea
```

### autoconnect

La pieza clave. Conecta streams automáticamente por matching de **`(nombre, tipo)`**. Si el
módulo A publica `Out[Image]` llamado `color_image` y B consume `In[Image]` llamado
`color_image`, quedan conectados sin escribir una línea de cableado.

Internamente hace merge de: átomos (con `_eliminate_duplicates`, donde los blueprints más
nuevos pisan a los viejos), transport maps, config overrides, remappings, requirement checks
y configurator checks.

### API fluida

Los blueprints son composables y transformables. Todos los métodos devuelven un blueprint nuevo
(`dataclasses.replace`), nunca mutan:

| Método | Qué hace |
|---|---|
| `.transports({(nombre, tipo): TransportSpec})` | fija un transporte concreto por stream |
| `.remappings([(módulo, viejo, nuevo)])` | resuelve colisiones de nombres o dirige refs |
| `.namespace(prefix, expose={...})` | aísla un sub-stack bajo un prefijo |
| `.global_config(**kwargs)` | overrides del config global |
| `.disabled_modules(*clases)` | apaga módulos sin sacarlos del blueprint |
| `.requirements(*checks)` | validaciones previas al build |
| `.configurators(*checks)` | configuradores de sistema |

### namespace: cómo se arman flotas

`.namespace("robot1", expose={"pointcloud"})` prefija instance names, nombres de stream (y por
lo tanto topics), TF frame ids y topics RPC. Eso desconecta el sub-stack de todo lo de afuera.
Los streams listados en `expose` quedan sin prefijo, y son por donde los datos cruzan la
frontera del namespace:

```python
fleet = autoconnect(
    AggregateMapper.blueprint(),  # compartido: ve el pointcloud de cada robot
    *[
        GO2Connection.blueprint(ip=ip).namespace(f"robot{i}", expose={"pointcloud"})
        for i, ip in enumerate(ips)
    ],
)
```

El prefijo debe matchear `[A-Za-z0-9_]+`. Los namespaces se anidan por composición, no con `/`.

### TransportSpec: construcción diferida

`TransportSpec` guarda clase de transporte + args del constructor sin construir nada. Los
autores de blueprints declaran transportes con `Cls.spec(...)`. El coordinator los materializa
en tiempo de build, una vez que los overrides de CLI/env/config se resolvieron.

### BlueprintAtom

Cada módulo dentro de un blueprint es un `BlueprintAtom` que guarda: la clase del módulo, sus
kwargs, sus `StreamRef` (nombre, tipo, dirección) y sus `ModuleRef` (referencias a otros
módulos vía Spec).

La extracción de anotaciones es más sutil de lo que parece: recorre el MRO **al revés** para
que el namespace de la clase más específica gane cuando módulos padres ensombrecen nombres
(por ejemplo `spec.perception.Image` vs `sensor_msgs.Image`), y usa `get_type_hints` con
fallback a `__annotations__` crudas para soportar `from __future__ import annotations` más
`TYPE_CHECKING`.

## Specs: RPC tipado entre módulos

`dimos/spec/utils.py`

Para que un módulo llame RPCs de otro sin acoplarse a la clase concreta, se declara un
`Protocol` que hereda de `Spec` y se anota un atributo con él. El coordinator inyecta el módulo
que satisface el protocolo en tiempo de build, con tipado completo, sin strings, y fallando en
build time (no en runtime) si no hay match.

```python
# my_module_spec.py
from typing import Protocol
from dimos.spec.utils import Spec

class NavigatorSpec(Spec, Protocol):
    def set_goal(self, goal: PoseStamped) -> bool: ...
    def cancel_goal(self) -> bool: ...

# my_skill_container.py
class MySkillContainer(Module):
    _navigator: NavigatorSpec   # inyectado por el blueprint en build time

    @skill
    def go_to(self, x: float, y: float) -> str:
        """Navigate to a position."""
        self._navigator.set_goal(make_pose(x, y))
        return "Navigating"
```

También soporta refs opcionales (`SomeSpec | None`) y refs a clases de módulo concretas.
Si varios módulos matchean el spec, se resuelve con `.remappings()`.
Si un módulo está deshabilitado, se inyecta un `DisabledModuleProxy` que loguea y devuelve
`None` en cualquier método (no-op).

### Las refs a clase matchean por IS-A

Desde `8fac510` (2026-08-08), una ref a clase concreta la satisface **cualquier subclase**, no
solo la clase exacta:

```python
def satisfies(cls: type) -> bool:
    if is_class_ref:
        return isinstance(cls, type) and issubclass(cls, spec)
    return spec_structural_compliance(cls, spec)
```

Antes comparaba con `cls is spec`. Eso rompía el patrón de "sustituir el provider por una
subclase que agrega puertos": la ref quedaba en `None` sin error al cablear, y explotaba con
`AttributeError` recién en el primer uso. Es el fix que habilita subclasear el
`ControlCoordinator` para declarar I/O por deployment (ver [04-subsistemas.md](04-subsistemas.md)).

## Runtime y coordinación

### ModuleCoordinator

`dimos/core/coordination/module_coordinator.py` (1150 líneas). Es el motor. La secuencia de
`build()`:

1. Validar el blueprint: conflictos de nombres (`_verify_no_name_conflicts`), conflictos con
   módulos ya corriendo, `requirements`, `configurators`.
2. Resolver la config del blueprint (cascada de fuentes).
3. Materializar transports (`_materialize_transports`), coercionando al backend elegido.
4. Desplegar módulos en paralelo a workers (`deploy_parallel`).
5. Conectar streams (`_connect_streams`).
6. Resolver module refs / Specs (`_connect_module_refs`), con resolución por niveles de
   namespace.
7. `build_all_modules()`.
8. `start_all_modules()` y `_send_on_system_modules()`.
9. `loop()`.

También expone operaciones en caliente: `load_module`, `unload_module`, `restart_module`,
`restart_module_by_name`, `list_modules`, `health_check`, `get_instance`.

Loguea el grafo del blueprint al arrancar (`_log_blueprint_graph`), y hay renderers a DOT en
`core/introspection/blueprint/dot.py` y `core/introspection/module/dot.py`.

### PythonWorker y el patrón Actor

`dimos/core/coordination/python_worker.py` (438 líneas)

Maneja pools de procesos vía **forkserver**, con un patrón Actor sobre pipes:

| Pieza | Rol |
|---|---|
| `Actor` | handle al módulo remoto; `__getattr__` convierte accesos en requests |
| `MethodCallProxy` | proxy de llamada de método, serializable |
| `ActorFuture` | resultado con `.result(timeout)` |
| `PythonWorker` | maneja un proceso: `reserve_slot`, `start_process`, `deploy_module`, `undeploy_module`, `shutdown` |
| `_worker_entrypoint` / `_worker_loop` / `_handle_request` | el lado del worker |

Soporta deploy, undeploy y restart de módulos individuales en caliente, y `suppress_console`
para silenciar output de workers.

`worker_manager_python.py` implementa el protocolo de pool; `worker_manager*.py` define la
interfaz genérica para que existan otros backends (docker).

## GlobalConfig

`dimos/core/global_config.py` (148 líneas)

Singleton pydantic-settings. La cascada es:

```
defaults → .env → variables de entorno DIMOS_* → blueprint (.global_config()) → flags de CLI
```

~50 campos. Los principales: `robot_ip`, `robot_ips`, `simulation`, `replay`, `replay_db`,
`viewer`, `n_workers`, `mcp_port`, `transport`, `robot_model`, `robot_width`,
`obstacle_avoidance`, `detection_model`, `dimsim_scene`, `dimsim_port`, `build_native`,
`memory_limit`, más un bloque de config de MuJoCo y otro de Rerun.

Cada campo se convierte automáticamente en flag de CLI (ver [05-cli-y-uso.md](05-cli-y-uso.md)).

## Otras piezas de core

| Archivo | Qué hace |
|---|---|
| `core/core.py` | el decorador `@rpc` |
| `core/native_module.py` | `NativeModule`, ver [06-ingenieria-y-repo.md](06-ingenieria-y-repo.md). El flag `build_native` se lee de `self.config.g`, no del singleton global (fix `7a0a970`) |
| `core/rpc_client.py` | `RPCClient`, `RpcCall` |
| `core/run_registry.py` | tracking por run + rutas de logs |
| `core/resource.py` | `Resource` y `CompositeResource` (base de módulos y transportes) |
| `core/resource_monitor/` | stats de CPU/memoria por módulo, alimenta `dimos top` |
| `core/introspection/` | extracción de info de módulos y blueprints, render a texto y DOT |
| `core/coordination/blueprint_config/` | parser, schema, merging y fuentes de config de blueprint |
| `core/coordination/process_lifecycle.py` | manejo de señales y shutdown ordenado |
| `core/transport_factory.py` | elige el backend RPC según config |
