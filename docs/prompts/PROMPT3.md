# PROMPT3 — Ejercicio 3 únicamente (copiar y pegar al orquestador)

> Pegá el bloque `text` de abajo tal cual al orquestador active-stack. Ya tiene todos los `{{...}}` de la plantilla reemplazados. Solo Ejercicio 3.

```text
@docs/Repaso Primer Parcial.pdf

## Rol

Actuá como arquitecto frontend senior, con experiencia en JavaScript nativo, modelado de datos en memoria, manipulación del DOM y SDD, y responsabilidad sobre definir la especificación completa del Ejercicio 3, su plan de tareas y, solo tras mi aprobación, su implementación en JavaScript nativo.

## Metodología

- Metodología a utilizar: SDD con framework active-stack (flujo SPEC → PLAN → IMPLEMENTACIÓN, con openspec: `openspec/changes/<change>/proposal.md` + `tasks.md` + specs).
- Herramientas y convenciones: openspec CLI, convenciones del orquestador active-stack, JavaScript nativo (ES2020+, sin transpilación), scripts clásicos cargados con `defer`, archivos JS externos, apertura directa de `index.html` en navegador sin npm ni servidor.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a la metodología elegida.
- No escribas código ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles, informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: ProgIII-FrontEnd-PrimerParcial — TPI frontend de una librería "El Tintero" (UTN, Programación III).
- Propósito y usuarios: librería que presenta su catálogo y registra libros, clientes y ventas. Usuarios: docente evaluador y estudiantes que maquetan el frontend. Solo frontend simulado en navegador.
- Ubicación o repositorio: repo actual de `ProgIII-FrontEnd-PrimerParcial`.
- Estado actual verificado: Ejercicio 1 (estructura HTML) y Ejercicio 2 (CSS externo y adaptable) completados. Existen `index.html`, `catalogo.html`, `libros.html`, `clientes.html`, `ventas.html` e `historial.html`, más `css/styles.css`. La carpeta `js/` solo contiene `.gitkeep`: no hay JavaScript ni etiquetas `<script>` en ningún HTML. El catálogo tiene 3 tarjetas estáticas hardcodeadas (`#catalogo-lista`, `data-libro-id` 1 a 3) con editoriales Sudamericana, Losada y Emecé; géneros Novela, Antología y «Sin clasificar». Ya existen los contenedores `#catalogo-buscador`, `#catalogo-titulo`, `#catalogo-vacio`, `#catalogo-sin-resultados` y `#catalogo-lista`. No hay README ni `localStorage`. Verificar el estado real antes de especificar; si difiere, informalo.
- Fuentes de requisitos: `docs/Repaso Primer Parcial.pdf` — obligatorias para este change: sección "Ejercicio 3 · 3. Datos locales, catálogo y filtro" (p. 3), "Contexto y alcance", "Organización del trabajo Etapa 2", "Criterios de evaluación" (3. Datos y catálogo: modelo y ejemplos 5 + renderizado 5 + filtro y estados 5) y "Formato de entrega". Si hay conflicto entre tu propuesta y el PDF, vale el PDF.
- Tecnologías y dependencias permitidas: JavaScript nativo (ES2020+), arrays y objetos literales, funciones, `addEventListener`, `createElement`, `textContent`, `Intl.NumberFormat`, archivos externos en `js/`, `defer`.
- Tecnologías y dependencias excluidas: librerías, frameworks y CDNs de JavaScript (jQuery, React, Vue, etc.) o CSS; `fetch`/AJAX; API, base de datos, servidor, backend; `localStorage`, `sessionStorage` e IndexedDB (Ej. 6); validaciones y altas (Ej. 4); cálculos de venta (Ej. 5); edición/eliminación de registros; administración de editoriales, géneros o autores; módulos ES (`type="module"`) por incompatibilidad con `file://`.
- Punto de entrada o componente afectado: `catalogo.html` (se le agregan etiquetas `<script>` al final del `body`) y archivos JS nuevos en `js/`. No se rediseña CSS ni se modifican las demás vistas más allá de lo estrictamente necesario.
- Condiciones del entorno: apertura directa de `catalogo.html`/`index.html` con doble clic (`file://`), sin npm, sin build, sin servidor.

## Alcance estricto

### Objetivo de esta entrega

Especificar (Fase 1), planificar (Fase 2 tras aprobación) e implementar solo tras autorización el modelo de datos locales (libros, editoriales, géneros, autores y clientes) y el renderizado dinámico del catálogo con filtro por título tolerante a mayúsculas/minúsculas y espacios, incluyendo estados de catálogo vacío y búsqueda sin resultados.

### Incluido

- Modelo en memoria con arrays/objetos e identificadores estables: `libros`, `editoriales`, `generos`, `autores`, `clientes`.
- Conjunto inicial: al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios.
- Relaciones por identificador: cada libro referencia una editorial existente, uno o más autores existentes y, opcionalmente, un género existente. «Sin clasificar» representa ausencia de género (`generoId: null`), no un género del arreglo.
- Al menos un libro sin género para que el catálogo muestre el literal «Sin clasificar».
- Renderizado del catálogo desde el array de libros, reemplazando las tarjetas estáticas, reutilizando las clases existentes (`.grilla-tarjetas`, `.card`, `.libro-tarjeta`) y `data-libro-id`.
- Cada tarjeta muestra título, ISBN, editorial resuelta por id, género resuelto por id o «Sin clasificar», autores resueltos por id y precio con formato consistente.
- Filtro por título: coincidencia parcial, sin distinguir mayúsculas/minúsculas y eliminando espacios en los extremos. Búsqueda vacía = catálogo completo; sin coincidencias = mensaje claro.
- Estados: catálogo vacío (`#catalogo-vacio`), búsqueda sin resultados (`#catalogo-sin-resultados`, incluyendo el término buscado como texto) y restauración con el botón «Limpiar búsqueda».
- Eventos con `preventDefault` en el submit del buscador y manejo del reset; funciones con responsabilidades reconocibles y separación entre datos, consultas, filtro, render y mensajes.
- Inserción de datos y del término de búsqueda como texto (`textContent`/`createElement`), sin `innerHTML` con datos.
- Funciones/API documentadas en el SPEC para reutilizar el modelo en los Ejercicios 4 a 6 sin volver a cambiar el HTML del catálogo.

### Excluido

- Todo el Ejercicio 4 (altas de libros y clientes, `preventDefault` de altas, ISBN/email duplicados, generación de opciones de selectores, actualización de listados tras alta).
- Todo el Ejercicio 5 (composición de venta, renglones, subtotales, total, confirmación, precio histórico, historial dinámico).
- Todo el Ejercicio 6 (`localStorage`, recuperación/duplicación de datos, casos manuales, README definitivo).
- Renderizado dinámico de Libros, Clientes, Ventas e Historial: siguen siendo maquetas estáticas.
- Altas, bajas o modificaciones de editoriales, géneros y autores; CRUD de cualquier entidad; edición de libros/clientes.
- Uso de `fetch`, APIs, backend, frameworks, librerías, CDNs o módulos ES.
- Cambios de diseño/CSS, de estructura semántica o de navegación ajenos a esta entrega (solo se agregan `<script>` y se retira el markup estático del catálogo).

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

Completá únicamente los grupos aplicables y asigná un identificador estable a cada requisito.

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Modelo y datos | Existen arrays/objetos con identificadores estables para `libros`, `editoriales`, `generos`, `autores` y `clientes`, con al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios, identificados como datos de ejemplo. |
| R-02 | Modelo y datos | Cada libro referencia por id una editorial existente, uno o más autores existentes y un género existente o `null`; al menos un libro tiene género `null` y se muestra como «Sin clasificar»; existe una comprobación de integridad referencial ejecutable (consola o función) que informa errores sin romper la vista. |
| R-03 | Renderizado | El catálogo se genera desde el array de libros al cargar la página: no quedan tarjetas estáticas duplicadas en `catalogo.html` ni datos de libros repetidos fuera del modelo; cada tarjeta muestra título, ISBN, editorial, género (o «Sin clasificar»), autores y precio, reutilizando las clases y `data-libro-id` existentes. |
| R-04 | Funcional | El filtro por título usa coincidencia parcial, ignora mayúsculas/minúsculas y recorta espacios en los extremos; una búsqueda vacía o solo con espacios muestra los 6 libros; una búsqueda sin coincidencias no muestra tarjetas y sí un mensaje claro. |
| R-05 | Estados | Se controlan `#catalogo-vacio` (modelo sin libros), `#catalogo-sin-resultados` (con el término buscado en el texto) y la restauración del catálogo completo al limpiar la búsqueda, alternando `hidden` y respetando `aria-live`; nunca se muestran estados contradictorios a la vez. |
| R-06 | Funcional | El submit del buscador se controla con `preventDefault`; el evento de reset limpia el campo, restaura el catálogo completo y oculta mensajes; las funciones tienen responsabilidades acotadas y nombres comprensibles (datos, búsqueda, filtro, render, mensajes), sin lógica de render mezclada con la definición de datos. |
| R-07 | Calidad y seguridad | Título, ISBN, nombres de editorial/género/autores y término de búsqueda se insertan con `textContent`/`createElement`; no se usa `innerHTML`, `insertAdjacentHTML`, `eval` ni `document.write` con datos; no hay errores en consola al abrir la página. |
| R-08 | Convenciones | JavaScript en archivos externos de `js/`, cargados con `<script defer>` en orden de dependencia; sin JS inline, sin `type="module"` (por `file://`), sin librerías ni frameworks; nombres en kebab-case para archivos e ids, camelCase para variables/funciones; `id` de contenedores existentes se conservan. |
| R-09 | Preparación futura | El SPEC documenta la estructura de cada entidad, sus campos e ids y una interfaz mínima reutilizable por los Ej. 4-6 (acceso al modelo y helpers de consulta/render) sin requerir cambios en el HTML del catálogo; no se implementa persistencia ni altas. |

Datos de ejemplo, si se necesitan: los 6 libros deben ser ficticios o de dominio público claramente marcados como ejemplo; se conservan los 3 libros actuales del catálogo si encajan en el modelo y se agregan al menos 3 más; los precios deben ser números en el modelo y formatearse solo al renderizar.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná las fuentes y el estado existente dentro del alcance autorizado antes de definir la solución.

Generá `openspec/changes/ejercicio-3-datos-locales-catalogo-filtro/proposal.md` (con `specs/catalogo/` y `specs/datos-locales/` si el flujo openspec lo requiere) con:

1. Problema, objetivo y resultado esperado.
2. Contexto verificado y referencias concretas a las fuentes consultadas.
3. Alcance incluido y exclusiones explícitas.
4. Requisitos identificados y escenarios observables, incluidos los casos límite relevantes.
5. Estructura o componentes propuestos, interfaces y datos necesarios, con el detalle proporcional al alcance (incluir el esquema de las 5 entidades con campos, tipos e ids).
6. Estados y manejo de errores aplicables (catálogo vacío, sin resultados, término con espacios, datos referencialmente inválidos).
7. Restricciones técnicas y convenciones que condicionan la solución (`file://`, scripts clásicos, sin `fetch`, sin persistencia).
8. Criterios de aceptación vinculados a los requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta.

Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta. Decisiones esperadas: organización de archivos JS (uno solo vs. `data.js` + `catalogo.js`); filtro al enviar el formulario vs. en vivo con `input`; formato de precio (mantener `$18.500` con `Intl.NumberFormat('es-AR')` sin decimales vs. dos decimales); eliminar las 3 tarjetas estáticas del HTML vs. conservarlas como fallback; ids numéricos vs. slugs. Si no respondo, usá `{{DATO_PENDIENTE: ...}}` y proponé un default sin implementarlo.

Al terminar, presentá la especificación para revisión y detenete. No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar, generá `openspec/changes/ejercicio-3-datos-locales-catalogo-filtro/tasks.md` con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar.

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación y mi autorización para implementar.

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá convenciones: `const`/`let`, funciones nombradas y acotadas, `"use strict"` o IIFE/namespace para no contaminar el global, 2 espacios de indentación, nombres en español consistentes con el dominio (libro, editorial, genero, autor, cliente).
- Respetá verificación manual: abrir `catalogo.html` con doble clic, revisar consola, probar búsqueda vacía, con espacios, en mayúsculas y sin coincidencias, y limpiar; sin tests automatizados ni servidor en este change.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá los archivos JS creados y las modificaciones mínimas de `catalogo.html` junto con un resumen de cambios, comprobaciones realizadas, limitaciones y pendientes.

## Criterios de aceptación

Reemplazá los criterios editables por condiciones observables y vinculalas a los requisitos correspondientes.

- [ ] CA-01 — Existen las 5 entidades con ids estables y los mínimos exigidos (6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes); todas las referencias de cada libro resuelven y al menos uno no tiene género (R-01, R-02).
- [ ] CA-02 — El catálogo se renderiza desde el modelo (no hay tarjetas estáticas duplicadas) y cada tarjeta muestra los 6 datos exigidos, con «Sin clasificar» cuando corresponde y clases/`data-libro-id` conservados (R-03).
- [ ] CA-03 — Búsqueda `"  ciEN  "` encuentra «Cien años de soledad»; búsqueda vacía o con espacios muestra los 6 libros; búsqueda inexistente muestra `#catalogo-sin-resultados` con el término y ninguna tarjeta (R-04, R-05).
- [ ] CA-04 — El botón «Limpiar búsqueda» limpia el campo, restaura el catálogo completo y oculta los mensajes; `#catalogo-vacio` se muestra si el array de libros está vacío (R-05).
- [ ] CA-05 — No se usa `innerHTML` con datos; el término buscado y los datos se insertan como texto; no hay errores en consola (R-07).
- [ ] CA-06 — Apertura directa por `file://` funciona sin servidor, npm ni librerías; los scripts son externos, clásicos y con `defer` (R-08).
- [ ] CA-07 — El SPEC documenta el esquema y la interfaz reutilizable para los Ej. 4-6 sin cambios de HTML (R-09).
- [ ] Se cubre todo el alcance aprobado y no se incorpora trabajo excluido.
- [ ] Se respetan las tecnologías, dependencias y convenciones permitidas.
- [ ] Las comprobaciones exigidas se ejecutaron y sus resultados se informan con evidencia.
- [ ] Se distinguen los controles aprobados, fallidos, omitidos y pendientes; ningún control no ejecutado se presenta como aprobado.
- [ ] Los supuestos, placeholders pendientes y limitaciones quedan identificados.

## Restricciones anti-alucinación

- No inventes requisitos, funcionalidades, archivos existentes, APIs, contratos, credenciales, datos reales ni resultados de comprobaciones.
- Diferenciá los hechos verificados, los supuestos y las propuestas. Atribuí los hechos a las fuentes consultadas cuando corresponda.
- Si falta un dato no bloqueante, usá `{{DATO_PENDIENTE: descripción}}` y declaralo como pendiente. No lo reemplaces con un valor que parezca real.
- Si el dato faltante afecta el alcance, una decisión esencial o la validez de la solución, preguntá antes de avanzar con el trabajo afectado.
- No afirmes haber leído una fuente, ejecutado una herramienta o validado un resultado si no ocurrió. Si no tenés acceso, informalo.
- Usá datos ficticios solo cuando estén autorizados y señalalos como ejemplos.
- Ante requisitos contradictorios, señalá la contradicción y pedí una decisión; no elijas silenciosamente.
- No declares completa la entrega si quedan criterios sin verificar. Enumerá los pendientes y sus motivos.

## Instrucción de inicio

Empezá ahora únicamente por la **Fase 1 — SPEC**. Generá el documento de especificación indicado, presentalo para revisión y esperá mi respuesta. No avances automáticamente a PLAN ni IMPLEMENTACIÓN. Antes de implementar, solicitá mi aprobación explícita de la especificación y mi autorización para iniciar la Fase 3.
```
