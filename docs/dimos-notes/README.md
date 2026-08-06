# DimOS: notas de exploración

Notas sobre el repo [dimensionalOS/dimos](https://github.com/dimensionalOS/dimos).
Exploración hecha el 2026-08-03 sobre el commit `0f9b161` ("feat: rust transform support").

## Índice

| Archivo | Contenido |
|---|---|
| [01-arquitectura-core.md](01-arquitectura-core.md) | Modules, Streams, Blueprints, Specs, runtime y coordinación |
| [02-transportes-y-mensajes.md](02-transportes-y-mensajes.md) | Capa de transporte intercambiable y tipos de mensaje |
| [03-capa-agentica.md](03-capa-agentica.md) | Skills, MCP server/client, agentes LLM |
| [04-subsistemas.md](04-subsistemas.md) | Navegación, percepción, mapping, memoria, manipulación, control, simulación, teleop |
| [05-cli-y-uso.md](05-cli-y-uso.md) | CLI, configuración, blueprints, modos de ejecución, instalación |
| [06-ingenieria-y-repo.md](06-ingenieria-y-repo.md) | Estructura del repo, tests, CI, packaging, multi-lenguaje |
| [07-hackathon-aws-credits.md](07-hackathon-aws-credits.md) | Análisis de créditos de AWS a pedir para el hackathon: Bedrock, GPU EC2, qué descartar y cómo conseguirlos |

## Resumen en una frase

DimOS es esencialmente **"ROS reescrito para la era de los LLMs"**: se queda con las buenas
ideas de ROS (pub/sub tipado, mensajes estándar, TF, composición de nodos) y tira el resto
(colcon, XML, C++ obligatorio, el ecosistema de build), reemplazándolo por Python con tipos,
procesos forkserver, autoconexión declarativa por nombre y tipo, transporte intercambiable,
y un agente LLM que ve todo el stack como herramientas MCP.

## Qué es

Un sistema operativo / SDK para robótica generalista, "agent native". La idea central:
controlar humanoides, cuadrúpedos, drones y brazos desde Python puro, sin ROS, y con LLMs
como ciudadanos de primera clase del runtime.

Se puede "vibecodear" un robot en lenguaje natural: los agentes corren como módulos nativos,
suscritos a cualquier stream embebido, desde percepción (lidar, cámara) y memoria espacial
hasta loops de control y drivers de motores.

## Datos del proyecto

| | |
|---|---|
| Organización | Dimensional Inc. |
| Licencia | Apache-2.0 |
| Versión | 0.0.14b1 (pre-release beta) |
| Python | >=3.10, <3.13 |
| Stars / forks | ~3.8k / ~782 |
| Contributors | 41 |
| Issues abiertos | ~483 |
| Docs | docs.dimensionalos.com |
| Discord | discord.gg/dimos |
| Teleop hosted | teleop.dimensionalos.com |

## Tamaño y composición

~266k líneas de Python en `dimos/`, más Rust, TypeScript y C++.

| Lenguaje | Bytes |
|---|---|
| Python | 9.7M |
| Rust | 434k |
| TypeScript | 418k |
| JavaScript | 262k |
| C++ | 173k |
| Shell | 112k |
| HTML | 76k |
| Nix | 38k |
| CSS | 31k |
| Svelte | 18k |
| CMake | 13k |
| Dockerfile | 9k |

## Hardware soportado

| Categoría | Plataformas | Madurez |
|---|---|---|
| Cuadrúpedo | Unitree Go2 pro/air | estable |
| Cuadrúpedo | Unitree B1 | experimental |
| Humanoide | Unitree G1 | beta |
| Brazo | xArm, AgileX Piper | beta |
| Brazo | OpenArm, A1Z, A750, OpenYAM | varía |
| Drone | MAVLink, DJI Mavic | alpha |
| Misc | Force Torque Sensor (repo aparte: openFT-sensor) | experimental |

## Observaciones honestas

- Es beta de verdad: ~483 issues abiertos.
- El soporte de hardware es desparejo. Solo el Go2 está marcado estable.
- La superficie es enorme (28 subpaquetes, 274 blueprints) para 41 contributors, así que la
  profundidad varía bastante entre subsistemas.
- `manipulation/` y `navigation/` se ven muy desarrollados. `imitation/` y varias cosas en
  `experimental/` son claramente tempranas.
- Lo más llamativo del repo es cuánta infraestructura de calidad tiene para estar en beta:
  ver [06-ingenieria-y-repo.md](06-ingenieria-y-repo.md).
