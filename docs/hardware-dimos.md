# Hardware DimOS (dimensionalOS)

Estado: **oferta abierta, nada confirmado.** Investigación del repo hecha el
2026-08-03 sobre el commit `0f9b161`, versión 0.0.14b1.

dimensionalOS nos ofreció hardware de robótica para el hackathon. Este doc es
para decidir con información si lo tomamos y cómo lo encuadramos.

## Qué es DimOS

Un sistema operativo / SDK para robótica, open source (Apache-2.0), de
Dimensional Inc. La forma corta de explicarlo: **es ROS reescrito para la era de
los LLMs**. Se queda con las buenas ideas de ROS (pub/sub tipado, mensajes
estándar, transformadas, composición de nodos) y tira el resto (colcon, XML, C++
obligatorio), reemplazándolo por Python con tipos y autoconexión declarativa.

- Repo: https://github.com/dimensionalOS/dimos (~3.8k stars, 41 contributors)
- Docs: https://docs.dimensionalos.com
- Discord: https://discord.gg/dimos

Lo relevante para nosotras: **los agentes LLM son ciudadanos de primera clase del
runtime**, no un agregado. Cualquier función se expone como herramienta del
agente con un decorador `@skill`, y el agente las consume por MCP. El repo trae
alrededor de 105 skills ya hechas. O sea que un equipo puede escribir una skill
nueva en Python y que el robot la use desde lenguaje natural, sin pelearse con la
plomería.

Eso hace que encaje bastante bien con un hackathon de IA y no solo de robótica:
el laburo interesante está en la capa agéntica, no en los drivers.

## Hardware que soporta

| Categoría | Plataformas | Madurez |
|---|---|---|
| Cuadrúpedo | Unitree Go2 pro/air | estable |
| Cuadrúpedo | Unitree B1 | experimental |
| Humanoide | Unitree G1 | beta |
| Brazo | xArm, AgileX Piper | beta |
| Brazo | OpenArm, A1Z, A750, OpenYAM | varía |
| Drone | MAVLink, DJI Mavic | alpha |

**Solo el Go2 está marcado como estable.** Si nos ofrecen otra cosa, asumir que
va a haber fricción.

## Los equipos sin robot físico también pueden competir

Importante para el formato: DimOS corre en tres modos, y dos no necesitan
hardware.

1. **Replay**: se reproducen grabaciones reales que vienen en el repo.
2. **Simulación**: MuJoCo (el motor principal) o DimSim (el simulador propio,
   corre en el browser).
3. **Real**: contra el robot.

Los dos simuladores **no necesitan GPU**: MuJoCo corre en CPU y DimSim corre del
lado del cliente. Esto significa que se puede armar el track sin que el número de
robots limite el número de equipos: todos desarrollan en simulación y los robots
se usan por turnos para probar y para la demo final. Vale la pena diseñar el
cronograma así desde el principio.

## Qué necesitan los participantes

- Python >=3.10 y <3.13 (no anda en 3.13).
- Linux es el camino feliz. Hay instalación para Ubuntu, Nix y macOS, más
  imágenes de Docker.
- Se instala con pip o uv, con extras granulares (`agents`, `sim`, etc.).
- Mejor punto de entrada para leer el código: el archivo `AGENTS.md` del repo,
  que está escrito específicamente para agentes de código. Si los participantes
  usan Claude Code o Cursor, apuntarlos ahí directamente.

Recomendación fuerte: **pedir que instalen y corran el modo replay antes de
llegar**, con un canal de soporte previo. Si 15 equipos instalan por primera vez
el viernes a las 18, perdemos las primeras horas del evento en entornos rotos.

## Riesgos honestos

Esto es un beta de verdad, no un producto terminado:

- Versión 0.0.14b1, con alrededor de 483 issues abiertos.
- La superficie es enorme (28 subpaquetes, ~266k líneas de Python) para 41
  contributors, así que la profundidad varía mucho entre subsistemas.
  `manipulation/` y `navigation/` se ven muy desarrollados. `imitation/` y varias
  cosas en `experimental/` son claramente tempranas.
- El soporte de hardware es desparejo (ver tabla arriba).

Nada de esto es un impedimento para un hackathon, donde romper cosas es parte del
juego. Pero sí quiere decir que **no conviene prometerles a los participantes que
va a funcionar todo**, y que necesitamos a alguien que conozca el stack disponible
durante el evento.

## Qué falta preguntarle a dimensionalOS

Antes de anunciar nada:

- [ ] Cuántas unidades y de qué modelos exactamente.
- [ ] Quién las opera y quién se hace cargo si se rompe algo (seguro, depósito,
      responsabilidad).
- [ ] ¿Mandan a alguien al evento? Un contacto técnico presente cambia
      completamente la viabilidad del track.
- [ ] ¿Hay un canal de soporte para los participantes durante las 24 horas?
- [ ] ¿Ellos quieren aparecer como sponsor del evento? (Ver
      [creditos-aws.md](creditos-aws.md): si ya tienen relación con AWS, nos
      sirve para el pedido de créditos.)
- [ ] ¿Ponen algún premio para el track de robótica?
- [ ] Logística: cuándo llegan los robots, dónde se guardan, qué espacio físico
      necesitan para operar con seguridad.

## Cómo lo encuadraría en el evento

Un **track de robótica dentro del hackathon de IA**, no el eje central del
evento. Razones: el hardware es limitado y beta, no todos los equipos van a
querer meterse, y el resto del hackathon no debería depender de que los robots
funcionen. Como track opcional con premio propio, suma mucho y no arriesga nada.

## Notas más largas

Notas completas de la arquitectura del repo (core, transportes, capa agéntica,
subsistemas, CLI, ingeniería, más el análisis de créditos de AWS) en
[`/docs/dimos-notes`](dimos-notes). Escritas el 2026-08-03 sobre el commit
`0f9b161`. Si hace falta profundizar en algo puntual del código de DimOS,
arrancar ahí antes de volver a leer el repo de cero.
