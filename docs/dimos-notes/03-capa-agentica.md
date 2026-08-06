# La capa agéntica

El flujo completo:

```
LLM ↔ McpClient ↔ HTTP/JSON-RPC ↔ McpServer ↔ RPC ↔ métodos @skill en módulos ↔ hardware
```

## El decorador @skill

`dimos/agents/annotation.py` (153 líneas)

Marca un método como herramienta invocable por el LLM. Setea `__rpc__ = True` y
`__skill__ = True`.

- `@rpc` solo: llamable por RPC, **no** expuesto al LLM.
- `@skill`: implica `@rpc` **y** expone el método al LLM como tool. **No apilar los dos.**

```python
from dimos.agents.annotation import skill

class MySkillContainer(Module):
    @skill
    def move(self, x: float, duration: float = 2.0) -> str:
        """Move the robot forward or backward.

        Args:
            x: Forward velocity in m/s. Positive = forward, negative = backward.
            duration: How long to move in seconds.
        """
        return f"Moving at {x} m/s for {duration}s"

my_skill_container = MySkillContainer.blueprint
```

### Reglas de generación de schema

| Regla | Qué pasa si la rompés |
|---|---|
| **Docstring obligatorio** | `ValueError` al arrancar: el módulo no registra y **todas** las skills desaparecen |
| **Anotar el tipo de cada param** | sin anotación no hay `"type"` en el schema, el LLM no tiene info de tipo |
| **Devolver `str`** (o algo con `agent_encode()`, ej. `SkillResult`) | otros valores se `str()`-ifican; un `None` le llega al agente como el string literal `"None"` |
| **El docstring va verbatim en `description`** | mantené el bloque `Args:` conciso, aparece en cada prompt de tool-call |

Tipos preferidos: `str`, `int`, `float`, `bool`, `list[str]`, `list[float]`. Los anidados
funcionan (el schema sale de pydantic) pero conviene mantenerlos chatos.

### Parámetros del decorador

```python
@skill(uses=["movement"], lifecycle="background")
```

- **`uses`**: declara capabilities que la skill necesita. El servidor MCP **rechaza la llamada**
  si otra skill ya tiene tomada una capability requerida. Es un sistema de locks sobre recursos
  físicos, para que dos skills no peleen por las patas del robot.
- **`lifecycle`**: `"instant"` (default, termina el trabajo antes de retornar) o `"background"`
  (arranca trabajo en background y retorna temprano). Las background deben usar
  `start_tool`/`stop_tool` para que el frame de stop libere sus capabilities.

### Instrumentación interna

El wrapper (sync y async) hace:

1. Extrae `_mcp_context` de los kwargs y lo pone en un `threading.local` (`_SKILL_CONTEXT`),
   accesible con `current_skill_context()`. El servidor MCP mete ahí
   `{"progress_token": <token>}` cuando el caller mandó `params._meta.progressToken`.
   La distinción `None` vs `{}` sirve para saber "fuera de toda skill" vs "dentro de una skill
   que no recibió token".
2. Cronometra la llamada.
3. Si el resultado es un `SkillResult`, le adosa `duration_ms` y loguea el código
   (`OK` / `FAILED` / el `error_code`). Si no lo es, loguea `UNKNOWN` (no puede verificar el
   resultado, así que no afirma "OK"). Si tira excepción, loguea `EXCEPTION`.

## McpServer

`dimos/agents/mcp/mcp_server.py`

Servidor MCP en `http://localhost:9990/mcp` (`GlobalConfig.mcp_port`), JSON-RPC 2.0.

- En `on_system_modules()` descubre todos los `@skill` de los módulos del sistema.
- Genera JSON Schema desde las anotaciones de tipo con pydantic.
- Los expone como tools MCP (`initialize`, `tools/list`, `tools/call`).
- Tiene canal **SSE** (`GET /mcp`) para streaming de progreso, con fan-out a colas por cliente.
- RPCs propios: `server_status`, `list_modules`, `agent_send`.
- **Cualquier cliente MCP externo puede conectarse**, incluido Claude Code.

## McpClient

`dimos/agents/mcp/mcp_client.py` (367 líneas). Es el agente.

```python
class McpClientConfig(ModuleConfig):
    system_prompt: str | None = SYSTEM_PROMPT
    model: str = "gpt-5.6-luna"
    model_fixture: str | None = None
    mcp_server_url: str = "http://localhost:9990/mcp"

class McpClient(Module):
    agent: Out[BaseMessage]      # cada mensaje del agente se publica al stream
    human_input: In[str]
    agent_idle: Out[bool]
```

- Usa **LangChain / LangGraph** (`create_agent`, `CompiledStateGraph`).
- Modelo default `gpt-5.6-luna`. Para modelos de razonamiento (prefijos `gpt-5`, `o1`, `o3`,
  `o4`) usa `ChatOpenAI` con Responses API y `reasoning={"effort": "medium", "summary": "auto"}`.
  Para el resto usa `init_chat_model` y preserva la resolución de provider de LangChain.
- `model_fixture` inyecta un `MockModel` que lee de un JSON, para tests deterministas.
- Corre un loop en thread propio consumiendo una cola de mensajes (`_thread_loop`).
- Al arrancar, hace polling del MCP server hasta 60s esperando que levante (`_try_fetch_tools`).
- Convierte cada tool MCP en un `StructuredTool` de LangChain.
- Publica **cada** mensaje al stream `agent: Out[BaseMessage]`, así que todo el razonamiento
  del agente es observable desde cualquier otro módulo o desde `dimos agentspy`.

### Dos detalles de implementación que valen la pena

**Imágenes en tool results.** Las imágenes que devuelve una tool no pueden ir en el tool
response de OpenAI (ni de varios otros). Solución: el texto que vuelve dice "Tool call started
with UUID: X, you will be updated soon", y la imagen se inyecta al historial como un
`HumanMessage` separado con ese UUID de correlación.

**Suscripción por LCM, no por SSE.** El cliente se suscribe al tool stream directamente por LCM
en lugar de usar el canal SSE `GET /mcp` del servidor. HTTP agregaría una race de arranque: los
primeros updates de un stream corto pueden dispararse antes de que la conexión SSE esté
establecida. Los clientes externos (Claude Code) sí usan `GET /mcp`, y el servidor hace fan-out
desde el mismo topic LCM.

### dispatch_continuation

Permite que una tool "trigger" (como `look_out_for`) dispare otra tool **directamente** cuando
se detecta algo, sin esperar a que el LLM razone el siguiente paso.

```python
continuation = {"tool": "follow_object", "args": {"bbox": "$bbox"}}
continuation_context = {"bbox": [x1, y1, x2, y2], "label": "person"}
```

Los valores string que empiezan con `$` se resuelven contra el `continuation_context`. Después
le informa al LLM qué pasó automáticamente, para que el historial quede coherente.

## Skills disponibles

~105 `@skill` en el repo. Contenedores principales:

| Contenedor | Archivo |
|---|---|
| `UnitreeSkillContainer` | `robot/unitree/unitree_skill_container.py` |
| `NavigationSkillContainer` | `agents/skills/navigation.py` |
| `PersonFollowSkillContainer` | `agents/skills/person_follow.py` |
| `SpeakSkill` | `agents/skills/speak_skill.py` |
| `GoogleMapsSkillContainer` | `agents/skills/google_maps_skill_container.py` |
| `GpsNavSkill` | `agents/skills/gps_nav_skill.py` |
| skills de manipulación | `skills/manipulation/` |
| skills de drone | `robot/drone/` |

Lista de nombres de skill (extraída del repo):

```
add agent_send arm ask_vlm begin_exploration boom capture_photo
clear_perception_obstacles close_gripper current_time detect disarm do_a_lap drop_on echo
end_exploration execute_arm_command execute_mode_command execute_sport_command fly_to
follow_object follow_person generate_grasps get_battery_soc get_gps_position_for_queries
get_robot_state get_scene_info go_home go_init go_to_location is_flying_to_target land
list_modules locate_person look look_out_for map_query move move_to_joints move_to_pose
move_velocity navigate_with_text nav_vlm observe open_gripper pick pick_and_place ping place
place_back query read_battery read_temperature recall register_person register_user
relative_move reset scan scan_objects search secure_payload select server_status
set_gps_travel_points set_gripper set_mode speak start_environment_scan start_patrol
start_security_patrol start_streaming stop_environment_scan stop_following stop_looking_out
stop_navigation stop_patrol stop_security_patrol tag_location take_a_picture takeoff
turn_in_place wait weigh_payload where_am_i
```

## System prompts

| Robot | Archivo | Variable |
|---|---|---|
| Go2 (default) | `dimos/agents/system_prompt.py` | `SYSTEM_PROMPT` |
| G1 humanoide | `dimos/robot/unitree/g1/system_prompt.py` | `G1_SYSTEM_PROMPT` |

Se pasa con `McpClient.blueprint(system_prompt=G1_SYSTEM_PROMPT)`. **El prompt default es
específico del Go2**; usarlo en el G1 causa skills alucinadas.

## Otros archivos de agents/

| Archivo | Qué hace |
|---|---|
| `capabilities.py` | sistema de locks de capabilities físicas |
| `skill_result.py` | `SkillResult`: resultado estructurado con success, error_code, duration_ms |
| `vlm_agent.py` | agente basado en visión |
| `ollama_agent.py` | agente contra Ollama local |
| `web_human_input.py` | `WebInput`, entrada humana desde la web |
| `mcp/tool_stream.py` | stream de progreso de tools sobre LCM |
| `mcp/mcp_adapter.py` | adapter que usa la CLI (`dimos mcp ...`) |
| `testing/mock_model.py` | modelo mock que lee fixtures JSON |
| `testing/agent_test_runner.py` | runner de tests de agente |
| `testing/vlm_stream_tester.py` | tester de streams VLM |

## Cómo agregar una skill

1. Elegir el contenedor correcto (específico del robot, o `dimos/agents/skills/`).
2. `@skill` + docstring obligatorio + anotaciones de tipo en todos los params.
3. Si necesita el RPC de otro módulo, usar el patrón Spec.
4. Devolver un `str` descriptivo, o un `SkillResult`.
5. Actualizar el system prompt si la skill necesita guía de uso.
6. Exponer como `my_container = MySkillContainer.blueprint` e incluirlo en el blueprint agéntico.
