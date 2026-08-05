# Créditos de AWS para el hackathon: análisis

Contexto: dimensionalOS ofreció hardware DimOS (Go2/G1, brazos, drones) para un hackathon.
Pregunta a responder: si conviene pedir créditos de AWS, para qué servicio(s) en concreto, con
foco en acceso a LLMs para los participantes. Investigación hecha el 2026-08-03 contra la
documentación oficial de AWS vigente en esa fecha, cruzada con el código real de DimOS (no
solo con las notas de exploración de los archivos 01-06).

## Recomendación en una tabla

| Servicio | Prioridad | Por qué |
|---|---|---|
| **Amazon Bedrock** | Principal | Responde directo a "acceso a LLMs"; se conecta al agente de DimOS con una dependencia chica; pago por uso, ningún equipo necesita GPU propia para esto |
| **EC2 GPU (G5/G6/G6e)** | Secundaria / opcional | Solo la necesitan equipos sin robot físico que quieran simulación de alta fidelidad (Isaac Sim, Genesis); el motor principal de DimOS (MuJoCo) corre en CPU |
| **S3** | Trivial | Datasets compartidos, grabaciones de episodios; costo despreciable, se puede sumar al mismo pedido sin pitch dedicado |
| **Bedrock AgentCore** | Stretch / track de premio | No pedir como infra de base; buena idea para una categoría especial del hackathon |
| ~~AWS RoboMaker~~ | Descartado | Discontinuado el 10/9/2025 |
| ~~SageMaker Studio Lab~~ | Descartado | Cerrado a usuarios nuevos desde el 30/7/2026 |
| ~~Bedrock Knowledge Bases / OpenSearch~~ | Descartado | Redundante con la memoria propia de DimOS (`memory2/`, sqlite-vec) |
| ~~AWS Activate~~ | Descartado (para este uso) | Es un programa para startups pre-Series B, no un mecanismo de crédito para eventos |

## Amazon Bedrock: por qué es el pedido principal

### Ya hay un punto de integración concreto

El agente de DimOS (`dimos/agents/mcp/mcp_client.py`, clase `McpClient`) usa LangChain/LangGraph
y arranca el modelo con `init_chat_model(model=...)` (ver `_init_model` en ese mismo archivo).
`init_chat_model` soporta Bedrock nativamente con un string tipo:

```
"bedrock_converse:anthropic.claude-sonnet-..."
"bedrock_converse:amazon.nova-pro-v1:0"
```

Lo que falta: revisando `pyproject.toml`, el extra `agents` trae `langchain-openai`,
`langchain-huggingface` y `langchain-ollama`, pero **no** `langchain-aws`. Es decir, Bedrock no
anda de fábrica hoy, pero el gap es una sola dependencia (`langchain-aws` + `boto3` con
credenciales AWS). Es chico a propósito: es un buen hack en sí mismo, alguien podría dejarlo
resuelto como PR antes del evento para que los equipos no pierdan tiempo en eso.

### También sirve para percepción (VLM)

`dimos/models/vl/base.py` define la interfaz `VlModel`, con un único método abstracto:

```python
def query(self, image: Image, query: str, **kwargs) -> str: ...
```

`dimos/models/vl/openai.py` la implementa en ~100 líneas: codifica la imagen a base64, arma el
payload de chat con imagen + texto, llama a la API, devuelve el texto. Un adaptador de
Bedrock/Nova seguiría exactamente el mismo patrón (Nova Pro y Nova Lite son multimodales: texto,
imagen, video, documentos). Es otro hack-track concreto y acotado, no solo infraestructura.

### Región

Bedrock está disponible en `sa-east-1` (São Paulo) desde junio de 2024, con Claude, Nova y otros
proveedores. Latencia razonable desde Argentina.

### Riesgo de costo a avisarle a los equipos

En `McpClient._process_message`, `self._history` acumula todos los mensajes de la sesión y se
reenvía **completo** en cada turno (`state_graph.stream({"messages": self._history})`), sin
ningún windowing o resumen visible en el código. Una demo que queda "pensando" o corriendo por
horas puede salir cara sin que nadie lo note, porque el costo por llamada crece con la duración
de la sesión, no es plano.

Mitigación recomendada: pedir un `AWS Budget` con alarma dura por equipo/API key, no confiar en
que se autorregulen. Ideal: una IAM key con tag de costo por equipo + alarma que notifique (o
directamente corte) al llegar a un umbral.

### Orden de magnitud del pedido

Estimación ilustrativa, no una cotización — confirmar con la calculadora oficial de precios
antes de poner un número en el pedido:

- Supuestos: 30 equipos, 2 días de hackathon, ~200 llamadas al agente por equipo por día,
  contexto promedio ~5k tokens de entrada (crece por el historial acumulado) y ~300 de salida.
- Total: ~60M tokens de entrada, ~3.6M de salida en todo el evento.
- Con **Nova Pro** ($0.80/M in, $3.20/M out): ≈ $60 total.
- Con **Claude Sonnet** (~$3/M in, ~$15/M out): ≈ $230 total.
- Incluso con **Claude Opus** ($15/M in, $75/M out): ≈ $1.170 total.

Conclusión: incluso en el escenario más caro, es un pedido de cientos a ~$1-2k, mucho más chico
que cualquier pedido de GPU equivalente.

## EC2 GPU: secundario, no protagonista

El motor de simulación principal de DimOS es **MuJoCo, que corre en CPU** (no necesita GPU para
un Go2 o un G1). DimSim (el simulador propio de DimOS) corre del lado del cliente en el browser
(Three.js + Rapier), tampoco necesita GPU de servidor. Es decir: **la mayoría de los equipos no
va a necesitar GPU** para tener un "robot virtual" de respaldo si no tienen hardware físico en
mano.

Donde sí importa: si algún equipo quiere meterse con **Isaac Sim** (NVIDIA lo anunció disponible
sobre EC2 G6e con GPUs L40S, en el marco de AWS re:Invent) o **Genesis**, ahí sí hace falta GPU.

Recomendación: pedir esto como un **pool chico y compartido** de instancias G5/G6, gestionado
por los organizadores, no como crédito per cápita repartido a todos los equipos.

## Explícitamente descartado (para no perder tiempo)

| Servicio | Por qué no |
|---|---|
| **AWS RoboMaker** | Discontinuado el 10/9/2025. Es la respuesta "obvia pero vieja" que aparece al buscar "AWS + robótica" sin fijarse en la fecha. AWS redirige a AWS Batch para simulación en contenedores. |
| **SageMaker Studio Lab** | Cerró el registro de usuarios nuevos el 30/7/2026 (días antes de esta investigación). No sirve para participantes nuevos. |
| **Bedrock Knowledge Bases / OpenSearch Serverless** | Redundante: DimOS ya tiene su propia memoria espacio-temporal (`memory2/`, con `sqlite-vec` local). Pelearse contra esa arquitectura no suma nada. |
| **AWS Activate** | Programa para startups pre-Series B armando una empresa, no un mecanismo de crédito para eventos. Solo aplicaría si una entidad startup real (por ejemplo dimensionalOS) pide y comparte créditos. |

## Bedrock AgentCore: idea de stretch, no infraestructura de base

GA desde octubre 2025. Es agnóstico de framework y modelo, y soporta explícitamente LangGraph
— justo lo que usa `McpClient` (vía `create_agent` de `langchain.agents`). Incluye Runtime
(hosting serverless del agente), Memory, Gateway (para exponer tools) y Observability.

No lo pediría como infraestructura para todos los equipos, pero es un lindo track o premio
especial: "sacá el cerebro del agente del robot y hospedalo en AgentCore Runtime, con memoria y
gateway manejados por AWS en vez de correr en un thread dentro del módulo DimOS". Es coherente
con la arquitectura existente (mismo LangGraph, mismo concepto de tools), no un capricho.

## Cómo conseguir el crédito en la práctica

El mecanismo de "$100 de crédito por participante" que se ve en hackathons patrocinadas por AWS
(vía Devpost, etc.) **existe solo si AWS ya es sponsor del evento** — no es algo que un
organizador pida suelto y le llegue. Caminos reales, de más a menos directo:

1. **AWS Event Sponsorship** (`aws.amazon.com/events/sponsorship`) — mayormente canalizado a
   través de partners de la AWS Partner Network (APN). Vale la pena chequear primero si
   dimensionalOS (el partner de hardware) o la institución organizadora ya tienen alguna
   relación con AWS. Un contacto tibio ahorra mucho tiempo contra un formulario frío.
2. **AWS Cloud Credit for Research** (`pages.awscloud.com/aws-cloud-credit-for-research.html`)
   — si hay ángulo universitario/de investigación. El ciclo de revisión suele ser más lento que
   el timing de un hackathon, así que conviene aplicar en paralelo y temprano, no como último
   recurso.
3. **AWS Educate** — sigue viva pero desde 2023 dejó de dar créditos institucionales directos;
   hoy es training gratuito autogestionado. No es un canal confiable para presupuesto real de
   evento.
4. **Plan B si el crédito no llega a tiempo**: como Bedrock es pago por uso y los modelos chicos
   (Nova Micro/Lite) son baratos (ver estimación arriba, ronda cientos de dólares para todo el
   evento), autofinanciar directamente y repartir API keys con scope + budget alarm puede ser
   más rápido que esperar una aprobación formal de AWS.

## Fuentes

- [Overview - Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html)
- [Request access to models - Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html)
- [Amazon Bedrock Model Choice - AWS](https://aws.amazon.com/bedrock/model-choice/)
- [Regional availability by models - Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html)
- [Amazon Nova Documentation](https://docs.aws.amazon.com/nova/)
- [ChatBedrock integration - Docs by LangChain](https://docs.langchain.com/oss/python/integrations/chat/bedrock)
- [AWS RoboMaker shuts down after failing to gain traction - The Robot Report](https://www.therobotreport.com/aws-robomaker-shuts-down-after-failing-to-gain-traction/)
- [AWS RoboMaker: Understanding the Pricing Model (And Its End)](https://www.oreateai.com/blog/aws-robomaker-understanding-the-pricing-model-and-its-end/f2a57b73462a34f4e70feb5a761ab9d7)
- [NVIDIA Advances Physical AI With Accelerated Robotics Simulation on AWS](https://blogs.nvidia.com/blog/physical-ai-robotics-isaac-sim-aws)
- [GPU-Accelerated Robotic Simulation Training with NVIDIA Isaac Lab in VAMS | AWS Physical AI Blog](https://aws.amazon.com/blogs/physical-ai/gpu-accelerated-robotic-simulation-training-with-nvidia-isaac-lab-in-vams/)
- [Amazon Bedrock AgentCore Documentation](https://docs.aws.amazon.com/bedrock-agentcore/)
- [Amazon Bedrock AgentCore is now generally available](https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-bedrock-agentcore-available)
- [Studio Lab availability change - Amazon SageMaker AI](https://docs.aws.amazon.com/sagemaker/latest/dg/studio-lab-availability-change.html)
- [Apply for AWS Activate Credits today | AWS Startups](https://aws.amazon.com/startups/lp/aws-activate-credits?lang=en-US)
- [AWS Event Sponsorship Terms and Conditions](https://aws.amazon.com/events/sponsorship/)
- [AWS Cloud Credit for Research](https://pages.awscloud.com/aws-cloud-credit-for-research.html)
- [AWS Educate - Cloud Skills for Education](https://aws.amazon.com/education/awseducate/)
- [AWS IoT Greengrass v2.17 release notes](https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-release-2026-04-16.html)
