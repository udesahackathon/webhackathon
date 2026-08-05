# Créditos de AWS: qué pedir y cómo

Estado: **nada pedido todavía.** Investigación hecha el 2026-08-03 contra la
documentación oficial de AWS vigente a esa fecha. Los precios y la disponibilidad
de servicios cambian, reconfirmar antes de mandar el pedido.

La pregunta que responde este doc: si pedimos créditos de AWS para los
participantes, ¿para qué servicio y cuánto?

## Respuesta corta

**Amazon Bedrock.** Es acceso a modelos (Claude, Amazon Nova, y otros
proveedores) por API, pago por uso. Le sirve a todos los equipos del hackathon,
no solo a los del track de robótica, que es justamente lo que hace que el pedido
se sostenga.

| Servicio | Prioridad | Por qué |
|---|---|---|
| **Amazon Bedrock** | Principal | Acceso a LLMs para todos los equipos. Pago por uso, ningún equipo necesita infra propia |
| **S3** | Trivial | Datasets compartidos, grabaciones. Costo despreciable, se suma al mismo pedido |
| **EC2 con GPU (G5/G6)** | Secundaria | Solo si algún equipo quiere simulación de alta fidelidad. Pedir un pool chico y compartido, no per cápita |
| ~~AWS RoboMaker~~ | Descartado | Discontinuado el 10/9/2025 |
| ~~SageMaker Studio Lab~~ | Descartado | Cerrado a usuarios nuevos desde el 30/7/2026 |
| ~~Bedrock Knowledge Bases~~ | Descartado | Redundante con la memoria que ya trae DimOS |
| ~~AWS Activate~~ | Descartado | Es un programa para startups, no un mecanismo de créditos para eventos |

## Por qué Bedrock y no otra cosa

**Sirve para todo el evento, no solo para robótica.** Es un hackathon de IA:
todos los equipos van a querer llamar a un modelo. Un crédito de Bedrock es útil
para el 100% de los participantes.

**Se conecta con DimOS casi sin trabajo.** El agente de DimOS está construido
sobre LangChain/LangGraph, que soporta Bedrock de forma nativa. Hoy le falta una
sola dependencia (`langchain-aws`) para que funcione. Es un gap chico y bien
delimitado: alguien lo puede dejar resuelto antes del evento así los equipos no
pierden tiempo, o puede ser un hack en sí mismo.

**Está en São Paulo** (`sa-east-1`), así que la latencia desde Buenos Aires es
razonable.

**Hay modelos multimodales** (Nova Pro y Nova Lite procesan imagen y video), que
es lo que hace falta si alguien quiere que el robot "vea".

## Cuánto pedir

Estimación ilustrativa, **no es una cotización**. Confirmar con la calculadora
oficial de precios antes de poner un número en el pedido.

Supuestos: 15 equipos, 24 horas, uso intensivo del agente.

| Modelo | Costo estimado del evento entero |
|---|---|
| Amazon Nova Pro | del orden de las decenas de dólares |
| Claude Sonnet | del orden de los cientos |
| Claude Opus | ~$1.000 |

Conclusión: **pedir del orden de $1.000 a $2.000 en créditos de Bedrock cubre el
evento con holgura**, incluso si los equipos usan los modelos más caros. Es un
pedido chico, lo cual juega a favor: es más fácil que lo aprueben.

### Un riesgo de costo concreto

El cliente del agente de DimOS acumula todo el historial de la conversación y lo
reenvía completo en cada turno, sin recorte ni resumen. O sea que **el costo por
llamada crece con la duración de la sesión**, no es plano. Una demo que queda
corriendo horas puede salir mucho más cara de lo que nadie espera.

Mitigación: **alarma de presupuesto dura por equipo** (AWS Budgets), con una
credencial por equipo etiquetada para poder atribuir el gasto. No confiar en que
se autorregulen, no es mala fe, es que no se nota.

## Qué NO pedir

Vale la pena dejarlo escrito para no perder tiempo investigando de nuevo:

- **AWS RoboMaker**: es la respuesta obvia si buscás "AWS robótica", y está
  discontinuado desde el 10/9/2025. AWS redirige a AWS Batch para simulación en
  contenedores.
- **SageMaker Studio Lab**: cerró el registro de usuarios nuevos el 30/7/2026, o
  sea que los participantes ni siquiera podrían crearse una cuenta.
- **Bedrock Knowledge Bases / OpenSearch**: DimOS ya trae su propia memoria
  espacio-temporal local. Meter un servicio de RAG encima es pelearse con la
  arquitectura que ya existe.
- **AWS Activate**: es para startups pre-Series B armando una empresa. No aplica
  a un evento. Sí aplicaría si dimensionalOS (que sí es una startup) pide
  créditos por su cuenta y los comparte.

## Cómo se piden en la práctica

Esto es lo que más importa y lo que menos obvio es: **el crédito de "$100 por
participante" que se ve en hackathons patrocinadas por AWS existe solo si AWS ya
es sponsor del evento.** No es algo que un organizador pida suelto y le llegue.

Caminos reales, de más a menos directo:

1. **AWS Event Sponsorship** (https://aws.amazon.com/events/sponsorship/). Es la
   vía principal, y en general se canaliza a través de partners de la AWS Partner
   Network. **Antes de mandar un formulario frío, chequear si dimensionalOS o
   UdeSA ya tienen relación con AWS.** Un contacto tibio ahorra semanas.
2. **AWS Cloud Credit for Research**
   (https://pages.awscloud.com/aws-cloud-credit-for-research.html). Tenemos
   ángulo universitario, así que aplica. El ciclo de revisión suele ser más lento
   que el timing de un hackathon, así que **aplicar temprano y en paralelo**, no
   como último recurso.
3. **AWS Educate** sigue existiendo pero desde 2023 dejó de dar créditos
   institucionales directos: hoy es training gratuito autogestionado. No sirve
   como presupuesto de evento.
4. **Plan B: autofinanciar.** Como Bedrock es pago por uso y los modelos chicos
   son baratos, poner unos cientos de dólares y repartir credenciales con límite
   puede ser más rápido y más predecible que esperar una aprobación formal. Vale
   la pena tenerlo como alternativa real y no como fracaso.

## Próximos pasos

- [ ] Preguntarle a dimensionalOS si tienen relación con AWS (ver
      [hardware-dimos.md](hardware-dimos.md)).
- [ ] Preguntar en UdeSA si la universidad tiene contacto institucional con AWS.
- [ ] Reconfirmar precios de Bedrock con la calculadora oficial y fijar el número
      del pedido.
- [ ] Aplicar a Cloud Credit for Research en paralelo, aunque tarde.
- [ ] Definir el plan de credenciales: una por equipo, con etiqueta de costo y
      alarma de presupuesto.
- [ ] Considerar el mismo pedido a otros proveedores. AWS no tiene por qué ser el
      único: los créditos de LLM son de los sponsorships más fáciles de conseguir
      porque le cuestan poco a quien los da.

## Fuentes

- [Overview de Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html)
- [Disponibilidad de modelos por región](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html)
- [Amazon Nova](https://docs.aws.amazon.com/nova/)
- [Integración de Bedrock con LangChain](https://docs.langchain.com/oss/python/integrations/chat/bedrock)
- [Fin de AWS RoboMaker](https://www.therobotreport.com/aws-robomaker-shuts-down-after-failing-to-gain-traction/)
- [Cierre de SageMaker Studio Lab](https://docs.aws.amazon.com/sagemaker/latest/dg/studio-lab-availability-change.html)
- [AWS Event Sponsorship](https://aws.amazon.com/events/sponsorship/)
- [AWS Cloud Credit for Research](https://pages.awscloud.com/aws-cloud-credit-for-research.html)
