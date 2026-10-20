# PROMPT4 — Ejercicio 4 únicamente (copiar y pegar al orquestador)

> Pegá el bloque `text` de abajo tal cual al orquestador active-stack. Ya tiene todos los `{{...}}` de la plantilla reemplazados. Solo Ejercicio 4.

```text
@docs/Repaso Primer Parcial.pdf

## Rol

Actuá como arquitecto frontend senior, con experiencia en JavaScript nativo, formularios HTML, validación de datos en cliente, manipulación del DOM y SDD, y responsabilidad sobre definir la especificación completa del Ejercicio 4, su plan de tareas y, solo tras mi aprobación, su implementación en JavaScript nativo.

## Metodología

- Metodología a utilizar: SDD con framework active-stack (flujo SPEC → PLAN → IMPLEMENTACIÓN, con openspec: `openspec/changes/<change>/proposal.md` + `tasks.md` + specs).
- Herramientas y convenciones: openspec CLI, convenciones del orquestador active-stack, JavaScript nativo (ES2020+, sin transpilación), scripts clásicos cargados con `defer`, archivos JS externos, apertura directa de los HTML en navegador sin npm ni servidor.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a la metodología elegida.
- No escribas código ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles, informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: ProgIII-FrontEnd-PrimerParcial — TPI frontend de una librería "El Tintero" (UTN, Programación III).
- Propósito y usuarios: librería que presenta su catálogo y registra libros, clientes y ventas. Usuarios: docente evaluador y estudiantes que maquetan el frontend. Solo frontend simulado en navegador.
- Ubicación o repositorio: repo actual de `ProgIII-FrontEnd-PrimerParcial`.
- Estado actual verificado: Ejercicios 1, 2 y 3 completados y archivados en `openspec/changes/archive/`. Existe `js/data.js` con `ElTintero.datos` (3 editoriales, 3 géneros, 5 autores, 6 libros y 3 clientes, todos con id numérico) y `ElTintero.consultas` (`obtenerLibros`, `obtenerClientes`, `buscarEditorialPorId`, `buscarGeneroPorId`, `buscarAutoresPorIds`, `formatearPrecio` con `Intl.NumberFormat('es-AR')` sin decimales y `verificarIntegridad`, que se ejecuta al cargar y reporta por consola). Existe `js/catalogo.js` (render y filtro del catálogo); `catalogo.html` carga `data.js` y `catalogo.js` con `defer`. `libros.html` tiene `#libros-form` con `#libros-titulo`, `#libros-isbn`, `#libros-precio` (`type="number" min="0" step="0.01"`), `#libros-editorial` y `#libros-genero` con opciones hardcodeadas (valores slug: `sudamericana`, `losada`, `emece`, `novela`, `cuento`, `antologia`, `sin-clasificar`) y 3 checkboxes `#libros-autor-1` a `#libros-autor-3` con `name="autores"` (solo 3 de los 5 autores existentes). Su tabla `#libros-tabla` tiene 3 filas estáticas y existen `#libros-vacio`, `#libros-mensaje-ok` y `#libros-mensaje-error` ocultos con `aria-live="polite"`. `clientes.html` tiene `#clientes-form` con `#clientes-nombre` y `#clientes-email` (`type="email"`), tabla `#clientes-tabla` con 2 filas estáticas y los contenedores `#clientes-vacio`, `#clientes-mensaje-ok` y `#clientes-mensaje-error` ocultos con `aria-live="polite"`. Ninguno de esos dos HTML carga scripts todavía y ningún formulario tiene `novalidate`. `ventas.html` e `historial.html` siguen siendo maquetas estáticas (Ej. 5). No hay README ni `localStorage`. Verificar el estado real antes de especificar; si difiere, informalo.
- Fuentes de requisitos: `docs/Repaso Primer Parcial.pdf` — obligatorias para este change: sección "Ejercicio 4 · 4. Alta de libros y clientes" (p. 4), "Contexto y alcance", "Organización del trabajo Etapa 2", "Criterios de evaluación" (4. Altas: 15 = Libros y selectores 6 + clientes 4 + validación y actualización 5) y "Formato de entrega". Como dependencia, se toma el modelo y las consultas del Ejercicio 3 ya implementados. Si hay conflicto entre tu propuesta y el PDF, vale el PDF.
- Tecnologías y dependencias permitidas: JavaScript nativo (ES2020+), `ElTintero.datos` y `ElTintero.consultas` existentes, arrays/objetos, `Set`, expresiones regulares simples, funciones, `addEventListener`, `preventDefault`, `createElement`, `textContent`, `hidden`, `aria-live`, `novalidate`, `form.elements`, `Intl.NumberFormat`, archivos externos en `js/`, `defer`.
- Tecnologías y dependencias excluidas: librerías, frameworks y CDNs de JavaScript (jQuery, React, Vue, etc.) o CSS; `fetch`/AJAX; API, base de datos, servidor, backend; `localStorage`, `sessionStorage` e IndexedDB (Ej. 6); composición y cálculo de ventas, renglones e historial (Ej. 5); edición o eliminación de registros; administración/altas de editoriales, géneros o autores; módulos ES (`type="module"`) por incompatibilidad con `file://`; `innerHTML`, `insertAdjacentHTML`, `eval` o `document.write` con datos.
- Punto de entrada o componente afectado: `libros.html` y `clientes.html` (se les agregan etiquetas `<script defer>` y, si hace falta, `novalidate` y contenedores de error); `js/data.js` (se amplía con las mutaciones y consultas del Ej. 4); archivos JS nuevos de vista en `js/`. No se rediseña CSS ni se modifican las demás vistas más allá de lo estrictamente necesario.
- Condiciones del entorno: apertura directa de `libros.html`, `clientes.html` y `catalogo.html` con doble clic (`file://`), sin npm, sin build, sin servidor.

## Alcance estricto

### Objetivo de esta entrega

Especificar (Fase 1), planificar (Fase 2 tras aprobación) e implementar solo tras autorización el alta de libros y de clientes desde sus formularios, con opciones de editorial, género y autores generadas desde los datos locales, validaciones completas, control del envío con `preventDefault` y actualización de los listados sin recargar la página.

### Incluido

- Generación desde `ElTintero.datos` de las opciones de `#libros-editorial`, de `#libros-genero` y de los checkboxes de autores, reemplazando las opciones y checkboxes hardcodeados; un checkbox por cada autor existente con `id="libros-autor-<id>"` y `name="autores"`.
- La opción «Sin clasificar» del selector de género representa la ausencia de género (no un género del arreglo) y se guarda como `generoId: null`.
- Alta de libro desde `#libros-form`: título, ISBN, precio, editorial, género opcional y uno o más autores; el nuevo libro se agrega al modelo en memoria con un id único y aparece en `#libros-tabla` sin recargar.
- Validaciones del alta de libro: título e ISBN no vacíos (recortando espacios), precio numérico finito y mayor que cero, editorial existente, al menos un autor seleccionado y todos los autores existentes, género ausente o existente.
- Unicidad de ISBN dentro de `ElTintero.datos.libros`, comparando sin espacios ni guiones y sin distinguir mayúsculas/minúsculas (sin implementar dígito de control).
- Alta de cliente desde `#clientes-form`: nombre completo (sin campo de apellido separado) y email; el nuevo cliente se agrega al modelo con id único y aparece en `#clientes-tabla` sin recargar.
- Validaciones del alta de cliente: nombre completo no vacío (sin contar solo espacios), email no vacío, con formato válido y no duplicado; la comparación de email ignora espacios exteriores y mayúsculas/minúsculas.
- Control del `submit` de ambos formularios con `preventDefault`; la validación se ejecuta en el handler y solo se agrega el registro si todas las comprobaciones pasan (sin altas parciales).
- Mensajes de error en texto, cercanos al formulario o al campo que corresponda, y mensaje de éxito tras el alta; alternancia correcta de `hidden` y respeto de `aria-live`; nunca se muestran mensajes contradictorios a la vez.
- Limpieza del formulario tras un alta correcta, conservando los valores si el alta se rechaza para que el usuario pueda corregirlos.
- Renderizado de `#libros-tabla` y `#clientes-tabla` desde el modelo al cargar y después de cada alta, retirando las filas estáticas; editorial, género y autores se resuelven por id y el precio se formatea con `ElTintero.consultas.formatearPrecio`.
- Estado de lista vacía (`#libros-vacio`, `#clientes-vacio`) si la colección correspondiente no tiene registros.
- Centralización de las mutaciones del modelo y de las consultas de unicidad/generación de id en `js/data.js`, sin mutar los arrays directamente desde la capa de vista.
- Funciones/API documentadas en el SPEC para que los Ejercicios 5 y 6 reutilicen el modelo y las altas sin volver a cambiar la estructura de los formularios.

### Excluido

- Todo el Ejercicio 5 (composición de venta, renglones, subtotales, total, confirmación, precio histórico, historial dinámico) y todo el Ejercicio 6 (`localStorage`, recuperación/duplicación de datos, casos manuales, README definitivo).
- Persistencia entre páginas o recargas: los datos viven en memoria y se pierden al recargar; que un alta de `libros.html` aparezca luego en `catalogo.html` o en `ventas.html` requiere el Ej. 6 y no forma parte de este change.
- Actualización de los selectores estáticos `#ventas-cliente` y `#ventas-libro` de `ventas.html`, salvo que lo autorices explícitamente como parte de "opciones relacionadas" (ver decisiones pendientes).
- Altas, bajas o modificaciones de editoriales, géneros y autores; CRUD de cualquier entidad; edición o eliminación de libros/clientes; gestión de stock, cobros o facturación.
- Renderizado dinámico de Ventas e Historial: siguen siendo maquetas estáticas.
- Uso de `fetch`, APIs, backend, frameworks, librerías, CDNs o módulos ES.
- Cambios de diseño/CSS, de estructura semántica o de navegación ajenos a esta entrega (solo se agregan `<script>` y los ajustes mínimos de formulario o contenedores de error justificados en el SPEC).

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

Completá únicamente los grupos aplicables y asigná un identificador estable a cada requisito.

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Selectores y datos | Las opciones de `#libros-editorial` y `#libros-genero` y los checkboxes de autores se generan desde `ElTintero.datos` al cargar `libros.html`; se eliminan las opciones y checkboxes hardcodeados; hay un checkbox por cada autor con `id="libros-autor-<id>"` y `name="autores"`; «Sin clasificar» representa la ausencia de género y no un género del arreglo. |
| R-02 | Alta de libros | Un alta válida exige título e ISBN no vacíos, precio numérico mayor que cero, editorial existente, al menos un autor y todos los autores existentes; el género es opcional y, si se informa, debe existir; se agrega un libro con id único, precio numérico y `generoId` `null` cuando no se elige género, y aparece en `#libros-tabla` sin recargar. |
| R-03 | Validación de libros | Se rechazan título/ISBN vacíos o solo con espacios, un ISBN que queda vacío al quitarle espacios y guiones, precio vacío, no numérico, no finito o menor o igual a cero, editorial vacía o inexistente, cero autores, autor inexistente y género inexistente. El ISBN se compara normalizado (sin espacios ni guiones, sin distinguir mayúsculas) y se rechaza si ya existe. Los errores se muestran como texto cerca del formulario y no se agrega nada si falla alguna comprobación. |
| R-04 | Alta de clientes | Un alta válida exige nombre completo no vacío y email no vacío, con formato válido y único; para este TPI, formato válido significa texto sin espacios, un único `@`, con al menos un carácter antes y después, y un dominio con punto y al menos dos letras después del último punto (validación práctica, no RFC completa, documentada en el SPEC). El email se compara recortando espacios exteriores y sin distinguir mayúsculas/minúsculas contra todos los clientes; se agrega un cliente con id único y aparece en `#clientes-tabla` sin recargar. No se exige campo de apellido. |
| R-05 | Validación de clientes | Se rechazan nombre vacío o solo con espacios, email vacío, email con formato inválido y email duplicado sin distinguir mayúsculas ni espacios exteriores; los mensajes son de texto y cercanos al formulario; no se agrega nada si falla alguna comprobación. |
| R-06 | Eventos y mensajes | El `submit` de `#libros-form` y `#clientes-form` se controla con `preventDefault`; una alta correcta limpia el formulario, muestra el mensaje de éxito y oculta los errores; un rechazo muestra el mensaje de error, conserva los valores ingresados y no deja mensajes de éxito contradictorios; se respetan `hidden` y `aria-live="polite"`. |
| R-07 | Actualización y estados | `#libros-tabla tbody` y `#clientes-tabla tbody` se renderizan desde el modelo al cargar y después de cada alta, sin filas estáticas duplicadas, con editorial/género/autores resueltos por id y precio formateado; `#libros-vacio`/`#clientes-vacio` se muestran si la colección está vacía; los ids generados no se repiten y `verificarIntegridad()` sigue sin reportar errores. |
| R-08 | Calidad y seguridad | Título, ISBN, nombre, email y cualquier dato escrito por el usuario se insertan con `textContent`/`createElement`; no se usa `innerHTML`, `insertAdjacentHTML`, `eval` ni `document.write` con datos; no hay errores en consola al abrir ni al operar; los datos inválidos nunca se agregan al modelo. |
| R-09 | Convenciones | JavaScript en archivos externos de `js/`, cargados con `<script defer>` en orden de dependencia (`data.js` antes que el script de la vista); sin JS inline, sin `type="module"`, sin librerías ni frameworks; IIFE con `"use strict"` y namespace `ElTintero`; se reutilizan `ElTintero.consultas` y `formatearPrecio`; nombres en español consistentes con el dominio; se conservan los `id` existentes. |
| R-10 | Separación y preparación futura | Las mutaciones del modelo (alta de libro, alta de cliente, generación de id y consultas de unicidad) se centralizan en `js/data.js` ampliando `ElTintero`, y la capa de vista no muta los arrays directamente; el SPEC documenta la interfaz resultante y los ganchos reutilizables por los Ej. 5-6; no se implementa persistencia, ventas ni edición. |

Datos de ejemplo, si se necesitan: se conservan los 6 libros y 3 clientes ficticios ya existentes; los registros creados durante las pruebas manuales son datos de ejemplo, no reales, y no se persisten (al recargar vuelven los iniciales). Usá ISBN y emails ficticios y señalalo en el SPEC.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná las fuentes y el estado existente dentro del alcance autorizado antes de definir la solución.

Generá `openspec/changes/ejercicio-4-altas-libros-clientes/proposal.md` (con `specs/libros/`, `specs/clientes/` y `specs/datos-locales/` si el flujo openspec lo requiere) con:

1. Problema, objetivo y resultado esperado.
2. Contexto verificado y referencias concretas a las fuentes consultadas.
3. Alcance incluido y exclusiones explícitas.
4. Requisitos identificados y escenarios observables, incluidos los casos límite relevantes.
5. Estructura o componentes propuestos, interfaces y datos necesarios, con el detalle proporcional al alcance (incluir las funciones nuevas de `ElTintero`, su firma, qué devuelven y el esquema del libro/cliente creado).
6. Estados y manejo de errores aplicables (campos vacíos, ISBN duplicado, precio inválido, referencias inexistentes, email inválido o duplicado, lista vacía, alta parcial).
7. Restricciones técnicas y convenciones que condicionan la solución (`file://`, scripts clásicos, sin `fetch`, sin persistencia, datos en memoria).
8. Criterios de aceptación vinculados a los requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta.

Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta. Decisiones esperadas: organización de archivos JS (`libros.js` + `clientes.js` + un módulo de validaciones compartido vs. un único `altas.js` vs. helpers duplicados); uso de `novalidate` para que la validación propia no sea bloqueada por la validación nativa del navegador; presentación de errores (contenedores estáticos por campo en el HTML vs. un único resumen + `aria-invalid` vs. mensajes creados dinámicamente); normalización del ISBN (quitar solo espacios y guiones vs. además pasar la X final a mayúsculas); si se guarda el ISBN y el email tal como se ingresan (recortados) o normalizados; si se actualizan `#ventas-cliente` y `#ventas-libro` tras un alta (recomendado: no en este change, porque es Ej. 5); formato de precio en la tabla de libros (mantener `Intl.NumberFormat('es-AR')` sin decimales, coherente con el Ej. 3, vs. dos decimales que exige el Ej. 5 para importes de venta); orden de las filas tras un alta (al final, según inserción, vs. más reciente primero). Si no respondo, usá `{{DATO_PENDIENTE: ...}}` y proponé un default sin implementarlo.

Al terminar, presentá la especificación para revisión y detenete. No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar, generá `openspec/changes/ejercicio-4-altas-libros-clientes/tasks.md` con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar.

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación y mi autorización para implementar.

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá convenciones: `const`/`let`, funciones nombradas y acotadas, `"use strict"` e IIFE/namespace `ElTintero` para no contaminar el global, 2 espacios de indentación, nombres en español consistentes con el dominio (libro, editorial, genero, autor, cliente, isbn, email).
- Reutilizá las consultas existentes de `js/data.js` y agregá allí solo lo necesario para las altas; no dupliques la resolución de editorial/género/autores ni el formateo de precio.
- Respetá verificación manual: abrir `libros.html` y `clientes.html` con doble clic, revisar consola, probar altas válidas e inválidas, ISBN duplicado con y sin guiones, email duplicado con mayúsculas y espacios, precio cero/negativo/no numérico, sin autor, referencias inexistentes, listas y mensajes; sin tests automatizados ni servidor en este change.
- Comprobá explícitamente que recargar la página restablece los datos iniciales (sin persistencia) y documentá esa limitación; no la presentes como un defecto ni como funcionalidad terminada.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá los archivos JS creados y las modificaciones mínimas de `libros.html`, `clientes.html` y `js/data.js` junto con un resumen de cambios, comprobaciones realizadas, limitaciones y pendientes.

## Criterios de aceptación

Reemplazá los criterios editables por condiciones observables y vinculalas a los requisitos correspondientes.

- [ ] CA-01 — Las opciones de editorial y género y los checkboxes de autores se generan desde `ElTintero.datos`; existe un checkbox por cada uno de los 5 autores con `id="libros-autor-<id>"`; «Sin clasificar» se guarda como `generoId: null` (R-01, R-02).
- [ ] CA-02 — Un alta de libro válida agrega el registro con id único, lo muestra en `#libros-tabla` sin recargar, limpia el formulario y muestra `#libros-mensaje-ok`; la tabla resuelve editorial, género y autores y formatea el precio con `formatearPrecio` (R-02, R-07).
- [ ] CA-03 — Se rechazan sin agregar registros: título o ISBN vacíos/solo espacios, precio `0`, negativo, vacío o no numérico, editorial vacía o inexistente, género inexistente, ningún autor y autor inexistente; cada caso muestra un mensaje de texto y conserva lo ingresado (R-03, R-06).
- [ ] CA-04 — El ISBN `978-84-376-0494-7` y sus variantes `9788437604947` y ` 978 84 376 0494 7 ` se detectan como duplicado del libro existente; un ISBN nuevo se acepta (R-03).
- [ ] CA-05 — Un alta de cliente válida agrega el registro, lo muestra en `#clientes-tabla` sin recargar y muestra `#clientes-mensaje-ok`; se rechazan nombre vacío, email vacío, email con formato inválido y email duplicado comparado con espacios exteriores y mayúsculas (por ejemplo ` Ana.Perez@Example.com ` contra `ana.perez@example.com`) (R-04, R-05, R-06).
- [ ] CA-06 — Si se vacía el modelo a propósito, se muestra `#libros-vacio`/`#clientes-vacio`; los mensajes de éxito y error nunca se muestran a la vez; `verificarIntegridad()` sigue sin reportar errores después de las altas (R-06, R-07).
- [ ] CA-07 — No se usa `innerHTML` con datos; los valores se insertan como texto; no hay errores en consola al abrir ni al operar (R-08).
- [ ] CA-08 — Apertura directa por `file://` funciona sin servidor, npm ni librerías; los scripts nuevos son externos, clásicos, con `defer` y cargan después de `data.js` (R-09).
- [ ] CA-09 — El SPEC documenta las funciones nuevas de `ElTintero`, su contrato y los ganchos para los Ej. 5-6, y deja explícito que sin persistencia las altas no sobreviven a la recarga ni pasan a otras vistas (R-10).
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
