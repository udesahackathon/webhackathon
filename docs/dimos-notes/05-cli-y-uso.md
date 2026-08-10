# CLI y uso

## Instalación

### Instalador interactivo

```sh
curl -fsSL https://raw.githubusercontent.com/dimensionalOS/dimos/main/scripts/install.sh | bash
```

`scripts/install.sh --help` tiene opciones no interactivas y avanzadas.

### Manual

Guías por sistema: `docs/installation/ubuntu.md` (Ubuntu 22.04/24.04, estable),
`docs/installation/nix.md` (NixOS / Linux general, estable), `docs/installation/osx.md`
(macOS, alpha). Requisitos completos y tiers de dependencias en `docs/requirements.md`.

### Python

```bash
uv venv --python "3.12"
source .venv/bin/activate
uv pip install 'dimos[base,unitree]'

# Replay de una sesión grabada de cuadrúpedo, sin hardware
# (la primera vez la ventana de rerun queda negra mientras bajan ~75 MB de LFS)
dimos --replay run unitree-go2
```

Extras disponibles: `base`, `misc`, `visualization`, `learning`, `agents`, `web`, `perception`,
`unitree`, `unitree-dds`, `manipulation`, `cpu`, `cuda`, `sim`, `mapping`, `drone`, `dds`,
`webrtc`, `apriltag`, `scene`, `graspgenx`, `all`. Más grupos de dev: `autofix`, `project-deps`,
`tests`, `browser-tests`, `lint`, `tests-self-hosted`.

### Cuidado con las dependencias (estado al 2026-08-08)

- `pin-pink` y `qpsolvers[proxqp]` **pasaron del extra `manipulation` a dependencias core**, así
  que ahora los instala cualquier `pip install dimos`. Es porque las tareas de IK del control
  loop usan Pink y `control/` no es un extra.
- `roboplan` está **pineado exacto** a `0.5.1` (antes `>=0.5.1`): la integración de TOPP-RA está
  validada solo contra esa versión.
- `graspgenx` **no entra en `all`**, se instala desde un revision fijo de git de NVlabs (no de
  PyPI) y pisa siete dependencias del stack con `override-dependencies`. Es la instalación más
  frágil del repo, tratarla aparte.

### Desarrollo

```sh
export GIT_LFS_SKIP_SMUDGE=1
git clone https://github.com/dimensionalOS/dimos.git
cd dimos
uv run pytest --numprocesses=auto dimos
```

`GIT_LFS_SKIP_SMUDGE=1` es importante: sin eso el clone se va a varios GB de grabaciones.

---

## Los tres modos de ejecución

El mismo blueprint corre en los tres, sin cambiar código:

| Modo | Flag | Qué hace |
|---|---|---|
| **Replay** | `--replay` | reproduce datos grabados, sin hardware |
| **Simulación** | `--simulation` | MuJoCo, DimSim, Genesis o Isaac |
| **Real** | (default) | hardware real, con `ROBOT_IP` o `--robot-ip` |

```bash
dimos --replay run unitree-go2
dimos --simulation run unitree-go2
export ROBOT_IP=<IP>; dimos run unitree-go2
```

---

## Comandos

`dimos` es un CLI **Typer** de ~1000 líneas (`dimos/cli/dimos.py`).

### Ciclo de vida

```bash
dimos run <blueprint> [--daemon]   # arrancar, opcionalmente en background
dimos status                       # run ID, PID, blueprint, uptime, ruta de log
dimos stop [--force]               # SIGTERM → SIGKILL a los 5s; --force = SIGKILL directo
dimos restart [--force]            # stop + re-exec con los args originales
dimos list                         # lista los blueprints no-demo (279 registrados)
dimos show-config                  # imprime el GlobalConfig resuelto
dimos cache clean [--yes]          # borra caches regenerables
```

### Inspección

```bash
dimos shell                        # IPython attacheado a todos los RPCs de módulos
dimos log [-f] [-n N] [--json] [-r <run-id>]
dimos top                          # TUI de recursos por módulo
dimos spy / lcmspy / agentspy / humancli   # TUIs de diagnóstico (Textual)
dimos topic echo <topic>
dimos topic send <topic> <expr>
```

`dimos shell` es notable: abre una sesión IPython attacheada, con descubrimiento y llamada de
RPCs en vivo, **sin necesitar MCP**.

### Agente y MCP

```bash
dimos agent-send "explorá la sala"          # manda texto al agente por LCM (no necesita McpServer)
dimos mcp list-tools                         # todas las skills como JSON
dimos mcp call move --arg x=0.5 --arg duration=2.0
dimos mcp call move --json-args '{"x": 0.5, "duration": 2.0}'
dimos mcp status                             # PID, lista de módulos, lista de skills
dimos mcp modules                            # mapeo módulo → skills
```

**MCP solo funciona si el blueprint incluye `McpServer`.** Todos los blueprints agénticos que
vienen de fábrica usan `McpServer` + `McpClient`.

### Herramientas

```bash
dimos cameracalibrate      # calibración de cámara
dimos apriltag             # detección de AprilTags (hay apriltag3d.py también)
dimos rerun-bridge         # lanza la visualización Rerun standalone
dimos dataprep build       # construye datasets de imitation learning
dimos dataprep inspect
```

### Hardware (nuevo en `a6d65f0`)

`dimos hardware` agrupa diagnóstico y configuración de hardware. Por ahora solo cuelga el A1Z:

```bash
dimos hardware a1z doctor --software-only   # chequea la instalación sin tocar el host
dimos hardware a1z configure-can            # configura la interfaz CAN (pide confirmación, usa sudo)
bin/hardware/a1z/setup                      # setup guiado del checkout, muestra el plan antes de aplicarlo
```

### Rutas

```
Logs:            ~/.local/state/dimos/logs/<run-id>/main.jsonl
Registro de run: ~/.local/state/dimos/runs/<run-id>.json
```

---

## Configuración

Cada campo de `GlobalConfig` (~50 campos) se convierte **automáticamente** en flag de CLI, vía
`create_dynamic_callback()`.

Cascada de precedencia:

```
defaults → .env → variables de entorno DIMOS_* → blueprint (.global_config()) → flags de CLI
```

Flags principales: `--robot-ip`, `--simulation/--no-simulation`, `--replay/--no-replay`,
`--replay-db`, `--viewer {rerun|rerun-web|rerun-connect|none}`, `--mcp-port`, `--n-workers`,
`--transport`, `--robot-model`, `--obstacle-avoidance`, `--detection-model`, `--dimsim-scene`.

`default.env` en la raíz tiene los defaults del repo.

---

## Blueprints destacados (runfiles)

| Comando | Qué hace |
|---|---|
| `dimos --replay run unitree-go2` | navegación de cuadrúpedo en replay: SLAM, costmap, planificación A* |
| `dimos --replay --replay-db go2_bigoffice run unitree-go2-memory` | replay de memoria temporal |
| `dimos --simulation run unitree-go2-agentic` | cuadrúpedo agéntico + servidor MCP en simulación |
| `dimos --simulation run unitree-g1-sim` | humanoide en simulación MuJoCo |
| `dimos --simulation run unitree-g1-agentic-sim` | G1 en sim + agente + skills |
| `dimos --replay run drone-basic` | replay de video + telemetría de drone |
| `dimos --replay run drone-agentic` | drone + agente LLM con skills de vuelo |
| `dimos run demo-camera` | demo de webcam, sin hardware |
| `dimos run keyboard-teleop-xarm7` | teleop por teclado con xArm7 mock (extra `manipulation`) |
| `dimos --simulation run unitree-go2-agentic-ollama` | cuadrúpedo agéntico con LLM local (necesita Ollama corriendo) |
| `dimos run unitree-go2-agentic --robot-ip 192.168.123.161` | Go2 real |
| `dimos run unitree-g1-agentic --robot-ip 192.168.123.161` | G1 real |
| `dimos run teleop-hosted-go2-transport` | teleop hosted por browser |

Referencia rápida de agénticos:

| Blueprint | Robot | Hardware | Agente | McpServer |
|---|---|---|---|---|
| `unitree-go2-agentic` | Go2 | real | vía McpClient | sí |
| `unitree-g1-agentic-sim` | G1 | sim | gpt-5.6-luna (prompt G1) | sí |
| `xarm-perception-agent` | xArm | real | gpt-5.6-luna | sí |
| `xarm-perception-sim-agent` | xArm | sim | gpt-5.6-luna | sí |
| `xarm7-planner-coordinator` | xArm7 | real | no | no |
| `teleop-quest-xarm7` | xArm7 | real | no | no |
| `dual-xarm6-planner-coordinator` | xArm6 x2 | mock | no | no |

Hay 279 blueprints registrados en total. `dimos list` da la lista completa.

Los 5 que se sumaron entre el 2026-08-03 y el 2026-08-08:

| Blueprint | Qué es |
|---|---|
| `teleop-quest-hand-xarm7` | teleop de xArm7 con manos de Quest, pinch para enganchar |
| `teleop-quest-a1z` | teleop de A1Z por Quest (`dimos --can-port a1zcan run teleop-quest-a1z` con hardware real) |
| `coordinator-teleop-a1z` | coordinator de teleop para A1Z |
| `grasp-gen-x-module` | provider de grasps GraspGenX (requiere el extra `graspgenx`) |
| `hand-teleop-module` | `HandTeleopModule`, el módulo detrás del teleop por manos |

---

## Usar DimOS como librería

Módulo de conexión mínimo que publica imágenes y un listener que las consume:

```python
import threading, time, numpy as np
from dimos.core.coordination.blueprints import autoconnect
from dimos.core.core import rpc
from dimos.core.module import Module
from dimos.core.stream import In, Out
from dimos.msgs.geometry_msgs import Twist
from dimos.msgs.sensor_msgs import Image, ImageFormat

class RobotConnection(Module):
    cmd_vel: In[Twist]
    color_image: Out[Image]

    @rpc
    def start(self):
        threading.Thread(target=self._image_loop, daemon=True).start()

    def _image_loop(self):
        while True:
            img = Image.from_numpy(
                np.zeros((120, 160, 3), np.uint8),
                format=ImageFormat.RGB,
                frame_id="camera_optical",
            )
            self.color_image.publish(img)
            time.sleep(0.2)

class Listener(Module):
    color_image: In[Image]

    @rpc
    def start(self):
        self.color_image.subscribe(lambda img: print(f"image {img.width}x{img.height}"))

if __name__ == "__main__":
    autoconnect(
        RobotConnection.blueprint(),
        Listener.blueprint(),
    ).build().loop()
```

Hay además una API "porcelain" (`dimos/porcelain/`) que envuelve todo esto para uso
programático: `Dimos`, `ModuleHandle`, `SkillsProxy`, con fuentes de módulo local y remota.

---

## Registrar blueprints propios

**Dentro del repo:** exponer una variable a nivel de módulo para que `dimos run` la encuentre, y
regenerar el registro:

```bash
pytest dimos/robot/test_all_blueprints_generation.py
```

`dimos/robot/all_blueprints.py` es **autogenerado**. CI falla si está desactualizado.

**Desde un paquete externo:** no editar `all_blueprints.py`. Exponer los blueprints como
**entry points** de Python en el grupo `dimos.blueprints`. Se descubren solos.
