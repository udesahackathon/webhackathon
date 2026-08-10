# Subsistemas

Tamaño de cada subpaquete de `dimos/` (archivos `.py` y líneas):

| Paquete | Archivos | LOC | Qué es |
|---|---|---|---|
| `robot` | 183 | 23.5k | implementaciones de plataformas |
| `manipulation` | 82 | 33.8k | planificación y control de brazos |
| `navigation` | 89 | 16.1k | planificación de rutas y exploración |
| `perception` | 86 | 16.4k | detección, tracking, memoria visual |
| `core` | 78 | 17.0k | el runtime (ver 01) |
| `control` | 61 | 17.2k | loops de control por tareas |
| `msgs` | 81 | 14.6k | tipos de mensaje (ver 02) |
| `protocol` | 69 | 14.9k | pubsub/rpc/tf (ver 02) |
| `memory2` | 73 | 13.0k | memoria espacio-temporal |
| `cli` | 29 | 10.9k | CLI y TUIs (ver 05) |
| `hardware` | 62 | 10.6k | adapters de drivers |
| `experimental` | 34 | 10.2k | cosas tempranas |
| `mapping` | 65 | 9.8k | mapas, voxels, occupancy |
| `simulation` | 36 | 9.2k | motores de simulación |
| `utils` | 47 | 8.8k | logging, datos, reactive, timeseries |
| `teleop` | 31 | 6.2k | teleoperación |
| `agents` | 44 | 6.6k | agentes y MCP (ver 03) |
| `web` | 23 | 6.3k | interfaces web |
| `models` | 24 | 3.3k | modelos de ML |
| `types` | 12 | 2.9k | tipos compartidos |
| `imitation` | 16 | 2.9k | imitation learning |
| `stream` | 16 | 2.5k | streams de audio y otros |
| `visualization` | 13 | 2.1k | puente Rerun |
| `skills` | 12 | 2.0k | skills generales |
| `e2e_tests` | 17 | 1.7k | tests end to end |
| `porcelain` | 11 | 1.5k | API programática de alto nivel |
| `codebase_checks` | 9 | 0.9k | lint arquitectónico (ver 06) |
| `spec` | 5 | 0.4k | utilidades de Spec |

---

## robot/

Implementaciones concretas de plataformas.

```
robot/
├── all_blueprints.py        # registro AUTOGENERADO (no editar a mano)
├── unitree/
│   ├── go2/                 # blueprints (basic, smart, navigation, agentic), connection,
│   │                        # dds/, zenoh/, cli/
│   ├── g1/                  # blueprints (basic, primitive, perceptive, navigation, agentic),
│   │                        # connection, sim, skills, effectors/high_level, assets, debug
│   ├── b1/
│   ├── unitree_skill_container.py
│   ├── params/ testing/ type/
├── unitree_webrtc/          # camino WebRTC para Unitree
├── drone/                   # MAVLink + DJI: connection_module, camera_module,
│                            # drone_tracking_module, drone_visual_servoing_controller
├── manipulators/            # xarm, piper, openarm, a1z, a750, openyam, common
├── diy/alfred/              # robot casero
└── assembly/
```

### Ejemplo de composición real (Go2)

La cadena de blueprints del Go2 muestra el patrón de composición en capas:

```python
# unitree_go2_basic  →  unitree_go2  →  unitree_go2_spatial  →  unitree_go2_agentic

unitree_go2 = autoconnect(
    unitree_go2_basic,
    VoxelGridMapper.blueprint(emit_every=5),
    CostMapper.blueprint(),
    ReplanningAStarPlanner.blueprint(),
    WavefrontFrontierExplorer.blueprint(),
    PatrollingModule.blueprint(),
    MovementManager.blueprint(),
).global_config(n_workers=10, robot_model="unitree_go2")

_common_agentic = autoconnect(
    NavigationSkillContainer.blueprint(),
    PersonFollowSkillContainer.blueprint(camera_info=GO2Connection.camera_info_static),
    UnitreeSkillContainer.blueprint(),
    WebInput.blueprint(),
    SpeakSkill.blueprint(),
)

unitree_go2_agentic = autoconnect(
    unitree_go2_spatial,
    McpServer.blueprint(),
    McpClient.blueprint(),
    _common_agentic,
)
```

Variantes derivadas: `unitree_go2_markers` (fiduciales), `unitree_go2_relocalization`,
`unitree_go2_memory`, `unitree_go2_agentic_ollama`, `unitree_go2_agentic_huggingface`,
`unitree_go2_security`, `unitree_go2_temporal_memory`.

---

## navigation/ (16k LOC)

| Módulo | Qué hace |
|---|---|
| `replanning_a_star/` | A* con replanificación continua |
| `frontier_exploration/wavefront_frontier_goal_selector.py` | exploración autónoma por frontera |
| `patrolling/` | patrullaje con routers: base, coverage, frontier |
| `basic_path_follower/` | seguidor de path simple |
| `movement_manager/` | árbitro central de movimiento |
| `cmu_nav/` | stack de CMU: FAR planner, TARE planner, local planner, terrain analysis, terrain map ext, PGO, path follower, nav record, click start/goal router |
| `dannav/` | control holonómico: holonomic tracking controller, path controller, command limits, local planner, perfiles de velocidad |
| `nav_3d/` | MLS planner (nativo y Python), goal relay, evaluator con escenarios y mesh loader |
| `visual_servoing/`, `visual/` | navegación guiada por visión |
| `bbox_navigation.py` | navegar hacia un bounding box detectado |

Estrategia de mapping del Go2: **column carving** sobre voxel map. Cada frame de LiDAR
reemplaza por completo la región correspondiente del mapa global, así el mapa siempre refleja
las últimas observaciones. Rápido y reactivo, pero la odometría drifta en distancias largas.

Para espacios que se revisitan: grabar una vez, correr PGO offline, y relocalizar contra el
premap exportado en runtime (`unitree-go2-relocalization`).

---

## perception/ (16.4k LOC)

| Área | Contenido |
|---|---|
| `detection/detectors/` | YOLO, YOLOE, detector de personas |
| `detection/module2D.py`, `module3D.py` | módulos de detección 2D y 3D |
| `detection/person_tracker.py` | tracking de personas |
| `detection/reid/` | re-identificación por embeddings (`embedding_id_system.py`) |
| `detection/type/` | jerarquía de tipos: detection2d (bbox, seg, point, person), detection3d (bbox, marker, pointcloud, filtros) |
| `fiducial/` | AprilTag: stream de detección de markers y módulo TF |
| `experimental/temporal_memory/` | memoria temporal con filtro CLIP, entity graph DB |
| `experimental/object_tracker*.py` | tracking de objetos 2D/3D |
| `experimental/object_scene_registration.py` | registración objeto-escena |
| `experimental/spatial_vector_db.py`, `spatial_perception.py` | percepción espacial |
| `experimental/objectDB.py`, `moduleDB.py`, `image_embedding.py` | bases de objetos y embeddings |
| `experimental/perceive_loop_skill.py` | skill de loop de percepción |
| `detection/project.py` | `ProjectDepthTo3D` y `sees()`: proyecta a 3D streams de detecciones 2D **grabados**. Se engancha como `Transformer` de memory2, o sea que corre sobre pipelines lazy |
| `memory/tool_localize.py` | script ejecutable: busca un objeto por texto en una grabación, lo localiza en 3D con depth y lo renderiza en Rerun |

`96b7aff` ("kickstart for scene reconstruction") sumó las dos últimas piezas. `tool_localize`
encadena CLIP + EdgeTAM + Moondream sobre un `SqliteStore` de memory2, y sirve como ejemplo
completo de cómo se combinan percepción y memoria:

```bash
uv run python -m dimos.perception.memory.tool_localize "plant" out.rrd
```

Datasets nuevos en LFS: `sf_office_stairs.db` (stereo D455) y `spot_small_loop.db` (primer
dataset de Spot del repo).

---

## mapping/ (9.8k LOC)

| Área | Contenido |
|---|---|
| `occupancy/` | occupancy grids: inflation, gradient, path map, path mask, resampling, extrusión, operaciones, visualizaciones |
| `voxels/` | voxel grids con dos backends: `impl/o3d.py` (Open3D) y `impl/packed.py` |
| `costmapper.py` | genera costmaps |
| `pointclouds/` | acumuladores de nubes de puntos, conversión a occupancy |
| `ray_tracing/` | módulo de raytracing, voxel map, transformer |
| `loop_closure/` | PGO (manual y automático), evaluación, markers rerun |
| `relocalization/` | relocalización contra premap |
| `google_maps/`, `osm/` | integración con mapas externos y OpenStreetMap |
| `cli/` | herramientas: map, replay, replay_marker, pose_fill, rename |

Usa **numba** para el cálculo de occupancy (por eso numba y llvmlite son dependencias core).

---

## memory2/ (13k LOC)

Memoria espacio-temporal. Es el "spatio-temporal RAG" del README.

Arquitectura por capas, cada una con interfaz `base.py` e implementaciones:

| Capa | Implementaciones |
|---|---|
| `store/` | `sqlite.py`, `mcap.py`, `memory.py`, `null.py` |
| `blobstore/` | `file.py`, `sqlite.py` |
| `vectorstore/` | `sqlite.py` (con `sqlite-vec`), `memory.py` |
| `observationstore/` | `sqlite.py`, `memory.py` |
| `codecs/` | `jpeg.py`, `lz4.py`, `pickle.py`, `lcm.py` |
| `notifier/` | `subject.py` |

Piezas clave: `module.py` (el `Recorder`), `stream.py`, `buffer.py`, `replay.py`, `embed.py`,
`transform.py`, `tf.py`, `registry.py`, `backend.py`, `type/observation.py`, `type/filter.py`,
`vis/` (visualización a SVG).

### Pipelines lazy

La API es un pipeline perezoso de transformaciones sobre streams grabados:

```python
store = SqliteStore(path=get_data("go2_bigoffice.db"))

for name, stream in store.streams.items():
    print(stream.summary())
# Stream("color_image"): 4164 items, 292.5s
# Stream("lidar"): 2251 items
# Stream("odom"): 5465 items

pipeline = (
    store.streams.color_image
    .filter(lambda obs: obs.data.brightness > 0.1)
    .transform(QualityWindow(lambda img: img.sharpness, window=0.5))
    .transform(EmbedImages(clip))
    .save(embedded)
)
# lazy: se ejecuta al iterar o al llamar .drain()
```

Transforms disponibles: `downsample`, `throttle`, `speed`, `smooth`, `QualityWindow`,
`EmbedImages`.

Las observaciones solo guardan posición y timestamp; `observation.data` dispara otra query a la
DB para traer los datos reales. Eso permite recorrer streams enteros sin cargar imágenes.

### Visualización

`vis/space/` dibuja cualquier stream sobre un mapa global y exporta a SVG, con esquema de
color turbo aplicado a los timestamps por defecto. Sirve para mapear velocidad, brillo de las
habitaciones, o cualquier cosa derivable de las observaciones.

### Recorder

`Recorder` es el módulo que graba. Se subclasea declarando los streams a grabar y decorando
métodos con `@pose_setter_for("nombre_stream")` para asociar cada observación a una pose:

```python
class Go2Memory(Recorder):
    color_image: In[Image]
    lidar: In[PointCloud2]
    odom: In[PoseStamped]
    config: Go2MemoryConfig

    @pose_setter_for("odom")
    async def _odom_pose(self, msg: PoseStamped) -> Pose | None:
        self._last_odom_pose = msg
        return self._last_odom_pose
```

---

## manipulation/ (33.8k LOC, el paquete más grande)

| Área | Contenido |
|---|---|
| `planning/kinematics/` | IK con 4 backends: `drake_optimization_ik.py`, `pinocchio_ik.py`, `pink_ik.py`, `jacobian_ik.py` |
| `planning/planners/` | `rrt_planner.py`, `roboplan_planner.py`, `selected_joint_space.py`, config |
| `planning/world/` | `drake_world.py`, `roboplan_world.py`, `roboplan_model.py` |
| `planning/groups/` | planning groups: discovery, identifiers, models, registry |
| `planning/monitor/` | `robot_state_monitor.py`, `world_monitor.py`, `world_obstacle_monitor.py` |
| `planning/spec/` | config, enums, models, protocols, validation |
| `planning/trajectory_generator/` | parametrización de paths a trayectorias con tiempo (ver abajo) |
| `control/servo_control/` | `cartesian_motion_controller.py` |
| `control/trajectory_controller/` | `joint_trajectory_controller.py` |
| `grasping/` | generación y visualización de grasps, más el provider GraspGenX |
| `pick_and_place_module.py`, `manipulation_module.py`, `execution_manager.py` | orquestación |

Había un `CONTEXT.md` en la raíz del repo que definía el vocabulario del dominio (Cartesian
Waypoint, Cartesian Target absoluto vs relativo, Bounded Speed Mode vs Time-Optimal Speed Mode,
Custom Planner Components). Se **borró** en `d6cf473` y no se reubicó en ningún lado: ese
glosario ya no existe en el repo.

### La frontera path → trayectoria

Cambio de diseño de `d6cf473`, la parte más importante de este subsistema hoy.

Un planner de joint space devuelve un **path geométrico sin tiempo**. Antes de que DimOS acepte
un `GeneratedPlan`, un backend de parametrización lo convierte en un `JointTrajectory` con
tiempos, y se valida orden de joints, dimensiones, valores finitos, tiempo estrictamente
creciente, y que se preserven start y goal.

| Backend | Default con | Qué hace |
|---|---|---|
| `simple_trapezoid` | `DrakeWorld` | trapezoidal por segmentos (comportamiento previo) |
| `roboplan_toppra` | `RoboPlanWorld` | TOPP-RA, timing continuo sobre el path entero |

```python
ManipulationModuleConfig(
    world_backend="roboplan",
    trajectory_parametrization={"backend": "roboplan_toppra",
                                "output_period": 0.01,
                                "velocity_scale": 0.8},
)
```

Reglas que conviene tener presentes:

- **No hay fallback.** Si el parametrizador elegido falla, no se intenta otro y no queda plan
  ejecutable cacheado.
- Si el planner ya devuelve timestamps y velocidades, se saltea la parametrización y se respeta
  su timing, pero pasa igual la validación estructural.
- `roboplan_toppra` solo corre con `world_backend="roboplan"`; con otro world falla al arrancar.
  Y la integración está pineada a RoboPlan `0.5.1` exacto.
- Cada joint movible necesita límite de velocidad finito y positivo en el URDF. Si no hay
  aceleración autorada, se inserta un fallback global de `2.0 rad/s²`, explícitamente temporal.
- El slider "Next plan speed" de Viser (0.05 a 1.0) afecta al **próximo** plan, no al ya
  aceptado.

La frontera se expone como `TrajectoryParametrizerSpec`, al lado de `PlannerSpec` y `WorldSpec`.
`manipulation_module.py` adelgazó fuerte (+82/-201) al perder esa lógica.

### RoboPlan como planner propio

`roboplan_planner.py` (681 líneas) saca la planificación de `roboplan_world.py` (que perdió 565).
Suma shortcutting y split planner. El fix `2b6ff61` hace que planifique contra el estado del
robot **capturado** al inicio y no releído a mitad de camino.

### GraspGenX

Provider de propuestas de grasp basado en el modelo de NVlabs, blueprint `grasp-gen-x-module`.
Suma `GraspCandidate` y `GraspCandidateArray` a `manipulation_msgs`. El adapter es "import-safe":
el runtime pesado vive aparte en `grasp_gen_x_runtime.py`. Requiere el extra `graspgenx`, que
instala desde un revision fijo de git de NVlabs y pisa siete dependencias del stack. Es lo más
frágil de instalar que tiene el repo.

---

## control/ (17.2k LOC)

Loop de control organizado por **tareas** intercambiables, cada una con su `_registry.py`:

| Tarea | Qué controla |
|---|---|
| `cartesian_ik_task` | IK cartesiano (resuelve con Pink desde `1bc1e97`) |
| `eef_twist_task` | twist del end effector (idem, Pink) |
| `servo_task` | servoing |
| `trajectory_task` | ejecución de trayectorias |
| `velocity_task` | control de velocidad |
| `teleop_task` | teleoperación (reescrita sobre Pink en `cee5cdb`) |
| `path_follower_task` | seguimiento de path |
| `rpp_path_follower_task` | Regulated Pure Pursuit |
| `holonomic_pose_follower_task` | seguimiento holonómico de pose |
| `g1_groot_wbc_task` | whole body control del G1 con GR00T |

Más: `coordinator.py`, `tick_loop.py`, `routing.py`, `hardware_interface.py`, `components.py`,
`path_following_coordinator.py`, `velocity_profiler.py`, `velocity_tracking_pid.py`,
`feedforward_gain_compensator.py`.

El refactor de `6580b67` reescribió cómo el coordinator descubre tareas, rutea y publica estado.
`dimos/control/README.md` quedó rehecho y es la fuente actualizada.

### Task cards

Cada tarea publica un manifiesto en `tasks/<task>/_registry.py`. `tasks/registry.py` los descubre
**sin importar la tarea**, así que las deps pesadas (Pinocchio, ONNX Runtime) cargan recién cuando
la tarea se instancia:

```python
TASK_FACTORIES = {"servo": "dimos.control.tasks.servo_task.servo_task:create_task"}
TASK_CONSUMES  = {"servo": {"joint_command": ("on_joint_command", "claim_overlap")}}
TASK_EXPOSES   = {"trajectory": ["execute", "cancel", "get_state"]}
```

`TASK_EXPOSES` define qué puede invocar `task_invoke`, y la firma del método **es** el schema de
argumentos: se bindean kwargs contra ella y un typo revienta del lado del caller.

### Reglas de ruteo

| Regla | Entrega cuando | La usa |
|---|---|---|
| `claim_overlap` | el mensaje nombra un joint que la tarea tiene tomado | `joint_command` |
| `broadcast` | siempre, a todas las tareas del puerto | `teleop_buttons`, `gripper_command` |
| `direct` | siempre, pero el puerto es de una sola tarea (una segunda loguea warning) | `path`, `speed` |
| `by_task_name` | `msg.frame_id == task.name` | comandos cartesianos y twist de EEF |

`by_task_name` usa `frame_id` como dirección y no como frame de coordenadas. El README lo marca
como legacy y pide no sumar bindings nuevos.

### I/O por deployment

Un deployment que necesita puertos extra **subclasea** el coordinator:

```python
class _Go2Coordinator(PathFollowingCoordinator):
    go2_joints: Out[JointState]

blueprint = _Go2Coordinator.blueprint(
    instance_name="ControlCoordinator",   # los clientes RPC lo buscan por nombre de clase
    publish_robot_joint_states=True,
)
```

Esto depende del fix de refs por IS-A en core (ver [01-arquitectura-core.md](01-arquitectura-core.md)):
antes la subclase no satisfacía la ref y quedaba en `None` en silencio. Los puertos de las cards
se validan contra la instancia viva al arrancar, no contra el registry, y si falta uno falla
`add_task()` diciendo qué anotación agregar.

`TaskConfig.stream_bind` remapea una entrada por instancia, así dos tareas del mismo tipo leen
puertos distintos.

### Dos vistas del joint state

| Vista | Stream | Lleva | La habilita |
|---|---|---|---|
| Agregada | `coordinator_joint_state` | todos los joints, `frame_id="coordinator"` | `publish_joint_state` (default on) |
| Por robot | `{hardware_id}_joints` | un robot, `frame_id=hardware_id` | `publish_robot_joint_states` + anotación `Out[JointState]` |

Las dos son permanentes y salen de la misma lectura por tick, con nombres canónicos
`{hardware_id}/{joint}`. Esa es la vista de *control*. Los módulos de conexión (`GO2Connection`,
`G1WholeBodyConnection`) publican la vista de *dispositivo*: estado crudo al rate del device.
Se elige por lo que es el consumidor, no por cuántos robots hay.

`benchmarking/` tiene un harness completo: `benchmark.py`, `plant.py`, `gate.py`, `paths.py`,
`score.py`, `scoring.py`, `tuning.py`, `velocity_profile.py`.

---

## hardware/

Capa de adapters de drivers, con registro por plugin (`_registry.py` en cada uno):

```
hardware/
├── adapter_registry.py
├── drive_trains/     # unitree_go2, flowbase, transport, mock
├── manipulators/     # xarm, piper, openarm (+driver), a750, galaxea_a1z, sim, mock
├── sensors/
│   ├── camera/       # realsense, zed, webcam, gstreamer
│   └── lidar/fastlio2/   # FAST-LIO2, con cpp/ propio, recorder, pcap_to_db
└── whole_body/
```

Cada familia tiene `spec.py` (el protocolo) y `registry.py` (el registro de implementaciones),
así que agregar hardware nuevo es implementar un adapter y registrarlo.

### Galaxea A1Z: hardware real desde 2026-08

`a6d65f0` sacó al A1Z del estado "solo mock". `manipulators/galaxea_a1z/` tiene `adapter.py`
(747 líneas), `gs_usb_bus.py` (bus CAN por USB), `config.py` y `_registry.py`, más 868 líneas de
tests y stubs de tipos del SDK del vendor.

Usa el loop de posición del vendor a 250 Hz, el modelo de gravedad G1Z y el gripper G1Z. El SDK
**no está publicado en PyPI**: se instala desde un revision fijo de git del vendor, así que la
instalación no es un `pip install` limpio. Doc en `docs/capabilities/manipulation/a1z.md`, y CLI
nueva `dimos hardware a1z` (ver [05-cli-y-uso.md](05-cli-y-uso.md)).

---

## simulation/ (9.2k LOC)

| Motor | Estado |
|---|---|
| **MuJoCo** | el principal. `engines/mujoco_engine.py`, `mujoco_shm.py`, `mujoco_sim_module.py`, más `mujoco/` con depth camera, input controller, policy, shared memory, scene package composer, person on track |
| **DimSim** | simulador propio, ver abajo |
| Genesis | `genesis/simulator.py`, `stream.py` |
| Isaac | `isaac/simulator.py`, `stream.py` |
| Unity | `unity/module.py`, `blueprint.py` |

Más `base/simulator_base.py`, `base/stream_base.py`, `engines/registry.py`,
`engines/robot_sim_binding.py`, `adapters/whole_body/g1.py`, `scenes/catalog.py`,
`scene_assets/spec.py`, `utils/xml_parser.py`.

### DimSim (`misc/DimSim/`)

Simulador 3D **en el browser**: Three.js + Rapier, con puente en Deno que habla LCM/WS con
dimos. Estructura: `src/` (motor browser, bundleado con vite), `cli/` (CLI Deno + bridge server
+ launcher headless + vendor LCM), `evals/` (harness de evals en browser + runner Deno +
rúbricas), `scenes/` (escenas de usuario en JS), `public/`, `docs/`.

Se lanza desde dimos: `uv run dimos --simulation dimsim --dimsim-scene=apartment run unitree-go2-agentic`

---

## teleop/ (6.2k LOC): dimTELE

Teleoperación hosted por **WebRTC**. El robot **marca hacia afuera** hacia un broker hosted, así
que no hace falta abrir puertos entrantes en la red del robot. Funciona detrás de un router
casero, en Wi-Fi, LAN cableada o celular.

Flujo:
1. Abrir teleop.dimensionalos.com, loguearse, sacar API key.
2. Correr un blueprint de teleop en el robot con `TRANSPORTS__BROKER__API_KEY=<key>`.
3. El robot aparece bajo "Available Robots", se hace Connect y se maneja desde el browser.

| Blueprint | Qué da |
|---|---|
| `teleop-hosted-go2-transport` | drive + cámara + minimapa + click-to-nav (recomendado) |
| `teleop-hosted-go2-multicam` | agrega una segunda RealSense, seleccionable por el operador, muxeada en un track de video |

### Quest: control por manos

Desde `eeae9a2` el Quest se puede teleoperar **sin controllers**, con hand tracking. Pinch de
pulgar + índice engancha la mano y el brazo sigue la muñeca, pinch de nuevo lo suelta. Pinch de
pulgar + mayor cierra el gripper y soltar lo abre. Hay que habilitar hand tracking en el browser
del Quest. Blueprint `teleop-quest-hand-xarm7`, módulo `HandTeleopModule` en `quest_extensions.py`.

Otros modos: `quest/` (VR Meta Quest), `keyboard/`, `phone/`. Utilidades: `recorder.py`,
`report.py`, `stream_stats.py`, `video_stats.py`, `teleop_transforms.py`.
`hosted/` tiene `camera_mux.py`, `command_executor.py`, `map_compress.py`, `hosted_stats.py`,
`go2_audio_bridge.py`, `go2_command.py`, `arm_command.py`.

---

## models/ (3.3k LOC)

| Categoría | Modelos |
|---|---|
| `embedding/` | CLIP, DINO, MobileCLIP, TReID |
| `segmentation/` | EdgeTAM |
| `vl/` (vision-language) | Moondream (local y hosted), Florence, Qwen, OpenAI |
| `qwen/` | bbox, video query |

---

## imitation/ (2.9k LOC)

| Área | Contenido |
|---|---|
| `collection/` | `recorder.py`, `episode_monitor.py`, blueprint de recolección |
| `dataprep/` | build, core, CLI |
| `dataprep/formats/lerobot/` | reader y writer formato LeRobot |
| `dataprep/formats/hdf5/` | reader y writer HDF5 |

Se usa desde la CLI: `dimos dataprep build` / `dimos dataprep inspect`.

---

## web/

| Pieza | Qué es |
|---|---|
| `dimos/web/dimos_interface/api/server.py` | servidor de la interfaz del robot |
| `dimos/web/websocket_vis/` | visualización por websocket, con `optimized_costmap.py` |
| `dimos/web/relay_bridge/` | puente al relay: protocol, manifest, locate, wt_client, sesión WebTransport |
| `web/cockpit/` (raíz) | SPA React + TypeScript: decoders, transport, store, session, ChannelList, StatusBar |
| `web/relay/` (raíz) | relay en **Deno** con WebTransport: cert, forward, registry, session, server |
| `web/shared/` | fixtures compartidos (control frames, data frames, datagrams) |

## visualization/

Puente a **Rerun** (`visualization/rerun/`). Es tan central que `rerun-sdk` y `dimos-viewer` son
dependencias core, no opcionales (hay un TODO en el pyproject reconociendo que debería ser
opcional).

Opciones de viewer vía `--viewer`: `rerun`, `rerun-web`, `rerun-connect`, `none`.

## experimental/

`dimos/experimental/`:
- `scene_cooking/`: preparación de escenas (coacd, planning, sidecar, package config), con
  ARCHITECTURE.md propio
- `world_belief/`: modelo de creencias del mundo (absence, identity_features, recall,
  scene_scan, recorder), con blueprint xarm6
- `security_demo/`: módulo de seguridad con depth estimator

`experimental/` en la raíz: docs de nav y cmu_nav.
