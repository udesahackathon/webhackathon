# Ingeniería y estructura del repo

Lo que más llama la atención de este repo es cuánta infraestructura de calidad tiene para un
proyecto en beta.

## Estructura de la raíz

```
dimos/                  # el paquete Python (28 subpaquetes, ~266k LOC)
docs/                   # 67 archivos .md
examples/               # ejemplos: interop de lenguajes, native modules, simplerobot
experimental/           # docs de nav y cmu_nav
native/                 # implementaciones Rust y C++
web/                    # cockpit (React SPA) + relay (Deno) + shared
misc/                   # DimSim, auto-fixes, fresh-ubuntu-tests, optimize_patrol
docker/                 # dev, python, ros, ros-dev-pin
scripts/                # install.sh, g1_replay.py
bin/                    # helpers (cuda, hooks, pytest-slow)
stubs/                  # type stubs propios
assets/ data/           # imágenes del readme, datos LFS
.agents/skills/         # skills para agentes de código
.github/                # 11 workflows + actions + scripts + issue templates
```

Archivos de raíz notables:

| Archivo | Qué es |
|---|---|
| `AGENTS.md` (16k) | documentación escrita **para agentes de código**. Muy buena, es el mejor punto de entrada |
| `CONTEXT.md` | glosario del dominio de manipulation planning (ubiquitous language) |
| `AI_POLICY.md` | política explícita sobre contribuciones generadas por IA |
| `CLA.md` | Contributor License Agreement |
| `CONTRIBUTING.md` | guía de contribución |
| `flake.nix` (17.7k) | Nix flakes, soporte NixOS completo |
| `pyproject.toml` (21k) | packaging, extras, config de todas las herramientas |
| `uv.lock` (1.4M) | lockfile de uv |
| `.pre-commit-config.yaml` | ruff format/check, license headers, checks de LFS |

---

## Tests

**336 archivos `test_*.py`** dentro de `dimos/`, conviviendo con el código (no en un `tests/`
aparte).

```bash
uv run pytest                                          # tests rápidos (default)
./bin/pytest-slow                                      # incluye los lentos (CI)
uv run pytest dimos/core/coordination/test_blueprints.py -v
uv run mypy dimos/
```

`uv run pytest` excluye los markers `self_hosted` y `mujoco`, y nunca colecta archivos
`tool_*.py`. CI corre los `self_hosted` solo en el runner self-hosted.

Convenciones: los scripts de test manual llevan prefijo `demo_` para quedar fuera de la
colección de pytest. Los `tool_*.py` son herramientas, no tests.

`dimos/e2e_tests/` tiene los tests end to end.

## codebase_checks: lint arquitectónico

`dimos/codebase_checks/` es lo más interesante del setup de calidad: son **tests que hacen
cumplir convenciones de estilo como reglas ejecutables**, no lint cosmético.

| Check | Qué prohíbe o verifica |
|---|---|
| `test_no_all.py` | prohíbe `__all__` |
| `test_no_dunder_new.py` | prohíbe `__new__` |
| `test_no_init_files.py` | prohíbe archivos `__init__.py` (el repo no tiene ninguno) |
| `test_inline_heavy_imports.py` | prohíbe imports pesados inline |
| `test_no_underscore_assign.py` | prohíbe asignaciones con guion bajo |
| `test_no_sections.py` | prohíbe comentarios de sección |
| `test_import_from_source.py` | verifica que se importe desde la fuente |
| `test_blueprint_kwargs.py` | valida los kwargs de blueprints |
| `test_get_logger.py` | valida el uso del logger |

Que no haya `__init__.py` explica la configuración cuidadosa de `package-data` en el
`pyproject.toml`: los data files se atan al paquete top-level `dimos` con globs recursivos `**`
basados en ruta relativa, porque `include-package-data` mapearía los datos al wheel de forma
no determinística.

## Estilo de código

De `AGENTS.md` y `docs/coding-agents/`:

- Imports arriba del archivo. Nada de imports inline salvo dependencia circular.
- `requests` para HTTP (no `urllib`). `Any` (no `object`) para valores JSON.
- No hardcodear puertos ni URLs: usar constantes de `GlobalConfig`.
- Anotaciones de tipo obligatorias. **Mypy en modo estricto.**
- Todos los archivos llevan header de licencia Apache (lo chequea pre-commit).

Herramientas: ruff (0.14.3 pineado), yapf config, editorconfig, mypy estricto, stubs propios
para `chromadb`, `mujoco`, `onnxruntime`, `pygame`, `pymavlink`.

**Siempre activar el venv antes de commitear:** `source .venv/bin/activate` (pre-commit corre
en el commit).

---

## Docs para agentes de código

El repo trata a los agentes de código como usuarios de primera clase:

- `AGENTS.md` en la raíz, y el README explícitamente dice de apuntar tu agente ahí.
- `docs/coding-agents/`: index, code-quality-rules, style, testing, worktrees, y docs sobre
  codeblocks y doclinks.
- `.agents/skills/python-unit-tests/SKILL.md`: una skill instalable para agentes.
- `dimos/cli/doclinks.py`: valida los links de la documentación.
- Los code blocks de las docs llevan anotaciones (`skip`, `session=mem`, `output=none`,
  `title=`) porque se ejecutan como tests de documentación.

---

## Git y CI

Workflow de git:

- Prefijos de rama: `feat/`, `fix/`, `refactor/`, `docs/`, `test/`, `chore/`, `perf/`
- **Los PRs van a `main`**, que es la rama inestable de desarrollo. Nunca pushear directo.
- No force-pushear salvo después de un rebase con conflictos.
- **Minimizar pushes**: cada push dispara CI (~1 hora en runners self-hosted). Batchear commits
  localmente y pushear una vez.

11 workflows en `.github/workflows/`:

`ci.yml`, `autofix.yml`, `auto-merge.yml`, `backport.yml`, `dimsim-check.yml`,
`docker-build.yml`, `_docker-build-template.yml`, `release.yml`, `release-build-check.yml`,
`pr-labels.yml`, `stale.yml`.

Más `.github/actions/build-cockpit` y `.github/actions/docker-build`.

---

## Distribución

Triple:

1. **pip / uv** con extras granulares (ver [05-cli-y-uso.md](05-cli-y-uso.md)).
2. **Nix flakes** (`flake.nix`, 17.7k líneas), con soporte NixOS declarado.
3. **Docker**: `docker/dev` (con docker-compose, variante CUDA, tmux config),
   `docker/python`, `docker/ros`, `docker/ros-dev-pin`. Más `.devcontainer/`.

Releases: v0.0.14b1 (2026-07-21), v0.0.13.post1, v0.0.13, v0.0.12, v0.0.11.
Cadencia de aproximadamente un release cada 1-2 meses.

### Dependencias core notables

| Dep | Para qué |
|---|---|
| `dimos-lcm` | bindings LCM propios |
| `eclipse-zenoh` | transporte Zenoh |
| `pin` (Pinocchio) | cinemática |
| `reactivex` | los streams observables |
| `plum-dispatch` | multi-dispatch. **Ya no se usa en los constructores de mensajes**: `016405b` los pasó a `typing.overload` por performance. Sigue como dependencia por otros usos |
| `pin-pink` + `qpsolvers[proxqp]` | IK con Pink en las tareas de control. Pasaron del extra `manipulation` a core en 2026-08 |
| `numba` + `llvmlite` | cálculo de occupancy |
| `open3d` | voxels y point clouds |
| `opencv-contrib-python` | trackers CSRT de `cv2.legacy` (solo están en contrib) |
| `sqlite-vec` | vector store de memory2 |
| `rerun-sdk` + `dimos-viewer` | visualización (hay TODO para hacerla opcional) |
| `textual` + `typer` + `plotext` | CLI y TUIs |
| `structlog` | logging |
| `pydantic` + `pydantic-settings` | config y schemas |
| `PyTurboJPEG` + `imagecodecs` | JPEG y JPEG-XL |

Los comentarios del `pyproject.toml` son inusualmente informativos: explican por qué cada pin
existe (el wheel de `sqlite-vec` 0.1.6 para aarch64 traía un `.so` armv7 de 32 bits;
`opencv-contrib` porque los trackers CSRT son contrib-only; `cmeel-tinyxml2` v11 porque
Pinocchio 4.1 requiere ese ABI).

---

## Multi-lenguaje

Python es el pegamento y el lenguaje de prototipado, pero no es obligatorio.

### NativeModule

`dimos/core/native_module.py` (504 líneas). Envuelve un ejecutable nativo como si fuera un
módulo Python: declara puertos In/Out/IO para el cableado del blueprint, pero delega todo el
trabajo real a un subproceso manejado.

```python
@dataclass(kw_only=True)
class MyConfig(NativeModuleConfig):
    executable: str = "./build/my_module"
    some_param: float = 1.0

class MyCppModule(NativeModule):
    config: MyConfig
    pointcloud: Out[PointCloud2]
    cmd_vel: In[Twist]

# funciona con autoconnect, remappings, etc.
ModuleCoordinator.build(autoconnect(
    MyCppModule.blueprint(),
    SomeConsumer.blueprint(),
)).loop()
```

El proceso nativo recibe los nombres de topic por argv, o como línea JSON en stdin si se setea
`stdin_config`, y hace pub/sub sobre ellos directamente.

Detalle: en Linux usa `prctl(PR_SET_PDEATHSIG, SIGTERM)` vía ctypes para que el hijo muera
junto con el padre. También maneja build opcional (`_maybe_build`), watch del proceso,
lectura de log streams con formato configurable, y QoS por output.

### native/rust/

Crate `dimos-module` con `dimos-module-macros` (macros procedurales):

```
rust/dimos-module/src/
├── lib.rs
├── module.rs
├── transport.rs
├── lcm.rs
├── zenoh.rs
├── tf.rs
└── log.rs
examples/transport_bench.rs
```

El commit más reciente del repo es justamente "feat: rust transform support" (#2816).

### native/cpp/

Headers header-only en `include/dimos/native/`: `module.hpp`, `transport.hpp`,
`transport_selection.hpp`, `lcm_transport.hpp`, `lcm_codec.hpp`, `config.hpp`, `log.hpp`.
Con suite de tests propia (7 archivos) y CMake.

### Interop de lenguajes

`examples/language-interop/` tiene ejemplos de C++, **Lua** y TypeScript hablando LCM con el
stack Python. `examples/native-modules/` tiene ping-pong en C++ y Rust, más un ejemplo de TF
broadcaster/listener en Rust.

---

## Documentación

67 archivos `.md` en `docs/`, organizados en:

| Sección | Contenido |
|---|---|
| `usage/` | modules, blueprints, configuration, transports, data_streams, sensor_streams, lcm, visualization, transforms, tool_streams, native_modules, cli, camera_calibration, python-api |
| `capabilities/` | agents, navigation (+ deep dive, relocalization), perception, manipulation (5 docs), memory (3 docs), teleoperation |
| `platforms/` | quadruped/go2 (index, setup, simulation), humanoid/g1 |
| `installation/` | ubuntu, nix, osx |
| `development/` | testing, conventions, docker, releasing, profiling, grid_testing, large_file_management, writing_docs |
| `coding-agents/` | index, style, testing, code-quality-rules, worktrees, docs |

Los assets pesados (gifs, svgs) viven en un repo aparte: `dimensionalOS/dimos-docs-assets`.

---

## Notas para reproducir la exploración

```bash
export GIT_LFS_SKIP_SMUDGE=1     # importante, si no baja varios GB
git clone --depth 1 https://github.com/dimensionalOS/dimos.git
```

Sin `GIT_LFS_SKIP_SMUDGE=1` el clone sigue bajando datos LFS (grabaciones `.db`, mapas) mucho
después de que el código ya está en disco. Para esta exploración corté el smudge a los ~550 MB;
todo el código fuente ya estaba checkouteado.

Mejores puntos de entrada para leer el repo, en orden:

1. `AGENTS.md`
2. `dimos/core/stream.py` (corto, define el modelo de datos)
3. `dimos/core/coordination/blueprints.py` (la composición)
4. `dimos/core/module.py`
5. `dimos/robot/unitree/go2/blueprints/` (ejemplo real de composición en capas)
6. `dimos/agents/mcp/mcp_client.py` (el agente)
7. `dimos/core/coordination/module_coordinator.py` (el motor, el más denso)
