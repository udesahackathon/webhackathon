# Transportes y mensajes

Esta es probablemente la parte más notable de la arquitectura de DimOS.

## La idea

DimOS abstrae el transporte del stream. **El mismo módulo funciona sobre LCM, memoria
compartida, ROS 2, DDS, Zenoh o WebRTC solo cambiando el mapa de transportes**, sin tocar el
código del módulo.

```python
blueprint = autoconnect(
    go2_connection(),
    McpServer.blueprint(),
    McpClient.blueprint(),
).transports({("color_image", Image): LCMTransport("/color_image", Image)})
```

## Los transportes

`dimos/core/transport.py` (692 líneas). 17 clases:

| Transporte | Uso |
|---|---|
| `PubSubTransport` | clase base de casi todos |
| `LCMTransport` | **default**, UDP multicast |
| `pLCMTransport` | LCM pickled, para objetos Python complejos |
| `SHMTransport` | memoria compartida, para imágenes y point clouds |
| `pSHMTransport` | SHM pickled |
| `JpegLcmTransport` | video comprimido sobre LCM |
| `JpegShmTransport` | video comprimido sobre SHM |
| `ROSTransport` | puente a topics ROS 2, interop con nodos ROS |
| `DDSTransport` | pub/sub DDS (requiere `uv sync --extra dds`) |
| `ZenohTransport` / `pZenohTransport` | Zenoh |
| `WebRTCTransport` | teleoperación remota |
| `CloudflareTransport` | WebRTC vía broker de Cloudflare |
| `_ProviderTransport` | base de los transportes con provider |
| `WebRTCVideoTransport` / `CloudflareVideoTransport` | pistas de video |
| `WebRTCAudioTransport` / `CloudflareAudioTransport` | pistas de audio |

Regla práctica: LCM para todo lo chico, SHM para imágenes y nubes de puntos, `p*` para objetos
Python que no tienen representación LCM.

Los transportes que exponen config sobreescribible declaran `_config_cls` (una clase pydantic);
el flujo de config de blueprint los detecta automáticamente. `None` significa "sin config
sobreescribible" (LCM y SHM).

### Interfaz de un Transport

```python
class Transport(Resource, ObservableMixin[T]):
    _config_cls: type[BaseModel] | None = None

    def broadcast(self, selfstream: Stream[T] | None, value: T) -> None: ...
    def subscribe(self, callback, selfstream=None) -> Callable[[], None]: ...
    def publish(self, msg: T) -> None:   # = broadcast(None, msg)
```

## La capa protocol

`dimos/protocol/` (69 archivos, ~15k LOC). Debajo de los transportes hay implementaciones
intercambiables:

### pubsub (`protocol/pubsub/impl/`)

`lcmpubsub.py`, `ddspubsub.py`, `zenohpubsub.py`, `redispubsub.py`, `rospubsub.py`,
`rospubsub_conversion.py`, `shmpubsub.py`, `memory.py`, `jpeg_lcm.py`, `jpeg_shm.py`,
más un subpaquete `webrtc/`.

### rpc (`protocol/rpc/`)

`pubsubrpc.py` (RPC sobre cualquier pubsub), `redisrpc.py`, `zenohrpc.py`, `rpc_utils.py`,
`spec.py` (define `RPCSpec`, `DEFAULT_RPC_TIMEOUT`, `DEFAULT_RPC_TIMEOUTS`).

### tf (`protocol/tf/`)

Árbol de transformadas, equivalente a tf2 de ROS. Los módulos acceden a un buffer perezoso vía
la propiedad `tfbuffer`, construida sobre el puerto `tf` declarado del módulo.
`frame_id` y `frame_id_prefix` en `ModuleConfig` controlan los nombres de frame, y `.namespace()`
los prefija automáticamente.

### service (`protocol/service/`)

`spec.py` define `BaseConfig` y `Configurable`, la base del patrón de configuración de módulos.
`system_configurator/` maneja configuradores de sistema que corren antes del build.

## Mensajes

`dimos/msgs/` (81 archivos, ~14.5k LOC)

Reimplementa **nativamente** las familias de mensajes de ROS:

| Familia | Ejemplos |
|---|---|
| `geometry_msgs` | Point, Pose, PoseStamped, PoseArray, Quaternion, Transform, Twist, TwistStamped, Vector3, Wrench, WrenchStamped, PoseWithCovariance |
| `sensor_msgs` | Image, CompressedImage, CameraInfo, PointCloud2, Imu, JointState, JointCommand, MotorCommandArray, Joy, RobotState |
| `nav_msgs` | odometría, paths, occupancy grids |
| `vision_msgs` | Detection2DArray, Detection3DArray |
| `tf2_msgs` | TFMessage |
| `visualization_msgs` | markers |
| `trajectory_msgs` | trayectorias articulares |
| `foxglove_msgs` | interop con Foxglove |
| `std_msgs` | tipos básicos |

### Cómo están construidos

Cada tipo **hereda del binding LCM** (`dimos_lcm`) y le agrega ergonomía Python encima:

- Constructores **sobrecargados**: el mismo tipo acepta varias formas de llamada. Por ejemplo
  `Pose` acepta nada, `(x,y,z)`, `(x,y,z,qx,qy,qz,qw)`, una posición sola, posición +
  orientación, un par, un dict, otro `Pose` o un `LCMPose`.
- Operadores: `+`, `-`, `__eq__`, `__bool__`, `__repr__`, `__str__`.
- Helpers: `Twist.zero()`, `.is_zero()`, `Image.from_numpy(...)`, `img.brightness`, `img.sharpness`.

Ejemplo real (`msgs/geometry_msgs/Pose.py`):

```python
class Pose(LCMPose):
    position: Vector3
    orientation: Quaternion
    msg_name = "geometry_msgs.Pose"

    @overload
    def __init__(self) -> None: ...
    @overload
    def __init__(self, x: int | float, y: int | float, z: int | float) -> None: ...
    @overload
    def __init__(self, position=..., orientation=...) -> None: ...
    @overload
    def __init__(self, value: PoseConvertable | Pose, /) -> None: ...

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        ...   # discrimina a mano las formas de arriba
```

### Se fue plum-dispatch (2026-08-08)

Hasta `016405b` estos constructores estaban implementados con `@dispatch` de **plum-dispatch**,
que resuelve el overload por tipos en runtime. Se reemplazó por `@typing.overload` más un
`__init__(*args, **kwargs)` que discrimina a mano, por performance: estos mensajes se construyen
dentro de loops de control y plum pagaba resolución de tipos en cada construcción.

**La API pública no cambió**: las mismas formas de llamada siguen andando, y el commit sumó
`test_msg_construction.py` (785 líneas) que las fija todas. Lo que sí cambió es la robustez
interna: aparecieron helpers de desambiguación como `_is_position_orientation_pair`, que
distinguen un par `(posición, orientación)` de una posición 2D mirando si los elementos son
numéricos. Es más frágil que el dispatch por tipos.

Alcanzó a `Pose`, `Quaternion`, `Twist`, `JointState`, `Joy`, los `*Stamped` y los
`*WithCovariance`. `plum` sigue listado en el pyproject (queda uso en otros lados).

`Wrench` y `WrenchStamped` sumaron encode/decode LCM propios en `7a5a844`; antes no serializaban
sobre el transporte.

`msgs/sensor_msgs/image_impls/` tiene implementaciones alternativas del backend de imagen.
`msgs/protocol.py` define `DimosMsg`, el protocolo común. `msgs/helpers.py` tiene utilidades.

Casi cada tipo de mensaje tiene su `test_*.py` al lado.
