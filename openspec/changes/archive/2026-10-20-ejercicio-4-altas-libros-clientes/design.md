# Design

## Context

Este change implementa el Ejercicio 4 sobre el modelo local ya existente. El
"por qué" y el alcance están en `proposal.md`; los requisitos normativos, en
`specs/libros/spec.md`, `specs/clientes/spec.md` y
`specs/datos-locales/spec.md`.

Restricciones reales verificadas que condicionan el diseño:

- Apertura directa por `file://` (doble clic), sin npm, sin build y sin
  servidor.
- Solo scripts clásicos externos cargados con `defer`; prohibido
  `type="module"` por incompatibilidad con `file://`.
- Sin `fetch`/AJAX, sin API/backend, sin librerías, frameworks ni CDNs.
- Sin `localStorage`, `sessionStorage` ni IndexedDB: los datos viven en memoria
  y se pierden al recargar.
- Patrón existente: IIFE + `"use strict"` + namespace `window.ElTintero`
  (`js/data.js:1-4`, `js/catalogo.js:1-6`), JavaScript ES2020+ nativo.
- `js/data.js` ya expone `ElTintero.datos` (3 editoriales, 3 géneros, 5 autores,
  6 libros y 3 clientes) y `ElTintero.consultas` con resolución por id,
  `formatearPrecio` y `verificarIntegridad`.
- `libros.html` y `clientes.html` no cargan scripts, no usan `novalidate`, tienen
  opciones/checkboxes/filas hardcodeadas y contenedores de estado con
  `aria-live="polite"`.
- `catalogo.html` es el patrón de carga: `data.js` antes que el script de vista,
  ambos con `defer`, sin `DOMContentLoaded` (`catalogo.html:41-42`).

## Goals / Non-Goals

**Goals:**

- Dar de alta libros y clientes desde sus formularios, poblando selectores y
  checkboxes de libros desde `ElTintero.datos`.
- Validar con código propio (formularios con `novalidate`), sin depender de la
  validación nativa del navegador.
- Garantizar unicidad de ISBN y email con normalización explícita.
- Renderizar ambos listados desde el modelo al cargar y tras cada alta, sin
  recargar la página.
- Centralizar ids y mutaciones en `js/data.js`, dejando la vista sin `push`.
- Entregar mensajes y accesibilidad consistentes: resumen único, `aria-invalid`
  y `aria-describedby`.

**Non-Goals:**

- Ejercicios 5 y 6: ventas, historial dinámico, persistencia y README.
- Persistencia entre recargas o entre páginas.
- Edición o borrado de libros/clientes.
- CRUD de editoriales, géneros o autores.
- Cambios de CSS, de estructura semántica o de navegación.
- Renderizado dinámico de `ventas.html`, `historial.html`, `#ventas-cliente` o
  `#ventas-libro`.
- Tests automatizados, runners, npm o servidor.

## Decisions

### D1 — Un único `js/altas.js` con detección de vista

- **Contexto:** ambas vistas comparten validación, mensajes y render, pero son
  documentos HTML distintos.
- **Opciones:** (a) `libros.js` + `clientes.js` + módulo de validaciones;
  (b) un único `altas.js`; (c) helpers duplicados por vista.
- **Elegida:** (b), decisión aprobada §9-a de `proposal.md`.
- **Consecuencias:** el archivo detecta la página por la existencia de
  `#libros-form` y/o `#clientes-form`; si no existe ninguno, `iniciar()` no hace
  nada y no produce errores. Se evita duplicar validadores y mensajes. Un solo
  archivo concentra la vista, por lo que debe mantenerse acotado y organizado por
  bloques (libros, clientes, helpers compartidos).

### D2 — Namespaces sin colisión

- **Contexto:** el modelo público ya usa `ElTintero.datos` y
  `ElTintero.consultas`; la vista necesita un espacio propio.
- **Opciones:** mezclar mutaciones en `ElTintero.consultas`; crear un global
  nuevo; separar por responsabilidad dentro de `ElTintero`.
- **Elegida:** `ElTintero.registros` (mutaciones e ids) y
  `ElTintero.consultas` (normalización, unicidad y búsqueda por id) en
  `js/data.js`; `ElTintero.altas` (vista) en `js/altas.js`.
- **Consecuencias:** la vista solo lee resultados y llama a
  `ElTintero.registros`; nunca ejecuta `push` ni asigna ids. `js/data.js` no
  toca el DOM. Los ganchos quedan disponibles para los Ej. 5–6.

### D3 — Orden de `<script defer>` y ausencia de `DOMContentLoaded`

- **Contexto:** `altas.js` necesita que `ElTintero.datos` y
  `ElTintero.consultas` existan antes de inicializar.
- **Opciones:** `data.js` + `altas.js` con `defer`; `DOMContentLoaded` explícito;
  scripts sin `defer` al final del `body`.
- **Elegida:** `data.js` antes que `altas.js`, ambos con `defer`, replicando
  `catalogo.html:41-42`; sin `DOMContentLoaded`.
- **Consecuencias:** con `defer` el orden de ejecución respeta el orden de
  aparición y el DOM ya está disponible. Cargar `altas.js` en una página sin los
  formularios es inocuo.

### D4 — `novalidate` + validación propia en el handler de `submit`

- **Contexto:** la validación nativa bloquea el `submit` y muestra mensajes
  inconsistentes con el resumen propio; además `min="0"` permite `0`, que la
  regla de negocio rechaza.
- **Opciones:** confiar en la validación nativa; combinar nativa y propia; usar
  `novalidate` y validar todo en el handler.
- **Elegida:** `novalidate` en ambos formularios (decisión §9-b) y validación
  propia dentro del handler de `submit`, con `preventDefault`.
- **Consecuencias:** el código es la única fuente de verdad. Se valida todo
  antes de mutar: si falla cualquier comprobación, no hay alta parcial. El
  formulario conserva los valores ante un rechazo y se limpia ante un éxito.

### D5 — Contrato de `registrarLibro` / `registrarCliente`

- **Contexto:** la vista no debe mutar el modelo ni decidir la validez final.
- **Opciones:** funciones que lancen excepciones; funciones que devuelvan
  booleanos; resultado explícito con datos o errores.
- **Elegida:** reciben datos crudos del formulario y devuelven
  `{ exito: true, libro | cliente }` o
  `{ exito: false, errores: [{ campo, mensaje }] }`. Nunca lanzan por datos
  inválidos y no mutan si hay cualquier error.
- **Consecuencias:** la vista puede mapear `campo` a controles para
  `aria-invalid`/`aria-describedby` y componer el resumen con los literales
  LN/CN. Los errores quedan desacoplados del DOM y son reutilizables por los
  Ej. 5–6.

### D6 — Normalización y unicidad

- **Contexto:** el PDF exige comparar ISBN sin espacios ni guiones y email sin
  espacios exteriores ni mayúsculas; el valor guardado debe ser el ingresado.
- **Opciones:** guardar normalizado; guardar recortado y comparar normalizado;
  no normalizar.
- **Elegida:** `normalizarIsbn` = `trim` + quitar todos los espacios y guiones,
  sin cambiar caja; `normalizarEmail` = `trim` + `toLowerCase`; comparación
  contra todas las entidades. El dato guardado es el recortado original
  (decisión §9-e).
- **Consecuencias:** `978-84-376-0494-7`, `9788437604947` y
  ` 978 84 376 0494 7 ` se detectan como el mismo ISBN. Riesgo aceptado: un ISBN
  que difiere solo en la caja de la `X` final no se detecta como duplicado
  (decisión §9-d). El email se compara sin distinguir mayúsculas, pero no se
  normalizan puntos ni sufijos `+`.

### D7 — Generación de ids

- **Contexto:** los ids deben ser únicos y compatibles con
  `verificarIntegridad()`.
- **Opciones:** contador global; `Date.now()`; `max(id) + 1`.
- **Elegida:** `max(id) + 1` sobre la colección, `1` si está vacía, sin reutilizar
  ids.
- **Consecuencias:** funciona con los ids 1–6 y 1–3 existentes y sigue siendo
  válido si se vacía la colección. No modifica la colección al generar el id.

### D8 — Render de tablas

- **Contexto:** las tablas tienen filas estáticas y deben reflejar el modelo.
- **Opciones:** `innerHTML`; clonar plantillas; vaciar y reconstruir con
  `createElement`/`textContent`.
- **Elegida:** vaciar el `<tbody>` y reconstruirlo con `createElement` y
  `textContent`; precio con `formatearPrecio`; «Sin clasificar» cuando
  `generoId === null`; autores resueltos por id y unidos por coma en el orden de
  `autoresIds`; filas nuevas al final; `#*-vacio` con `hidden` según longitud.
- **Consecuencias:** se eliminan las filas estáticas y cualquier dato del usuario
  se inserta como texto (sin XSS). El orden de inserción se conserva y el render
  inicial muestra 6 libros y 3 clientes.

### D9 — Mensajes y accesibilidad

- **Contexto:** se necesita un resumen único por formulario, con literales
  definitivos y atributos accesibles coherentes.
- **Opciones:** contenedores por campo; resumen único + `aria-invalid`; resumen
  único + `aria-invalid` + `aria-describedby`.
- **Elegida:** resumen único + `aria-invalid` + `aria-describedby` (decisiones
  §9-c y §9-k). Catálogo LN/CN de `proposal.md` §5.6; composición con un espacio
  en el orden de los campos; LN-12 una sola vez; alternancia estricta ok/error
  (nunca ambos visibles); `hidden` como único mecanismo de visibilidad, sin tocar
  CSS.
- **Consecuencias:** el control afectado apunta al contenedor
  `#libros-mensaje-error` o `#clientes-mensaje-error`; al alta válida se retiran
  ambos atributos. No se agrega `role="alert"` ni contenedores nuevos. Los
  literales quedan centralizados en la capa de datos y la vista solo compone.

### D10 — Estado del formulario tras el alta

- **Contexto:** el usuario debe poder corregir un rechazo sin volver a cargar
  datos, y el alta válida debe dejar el formulario listo para otra carga.
- **Opciones:** limpiar siempre; conservar siempre; limpiar solo si fue válida.
- **Elegida:** limpieza total (valores, checkboxes y selectores al estado
  inicial) si fue válida; conservación íntegra de valores si fue rechazada.
- **Consecuencias:** un rechazo no pierde trabajo del usuario y un éxito no deja
  restos del alta anterior. Los checkboxes generados vuelven a quedar sin marcar
  y los selectores a su opción inicial.

### D11 — Verificación manual

- **Contexto:** el brief prohíbe tests automatizados, servidor y build para este
  change.
- **Opciones:** TDD con runner; verificación manual documentada.
- **Elegida:** verificación manual sobre `file://`, sin runner, sin npm y sin
  servidor (decisión §9-i).
- **Consecuencias:** cada requisito y CA se comprueba con una matriz observable
  (ver Testing Strategy). Ningún control se reporta como aprobado sin haberse
  ejecutado; los omitidos se informan como omitidos.

## Risks / Trade-offs

- **Sin persistencia** → recargar restablece los datos iniciales y las altas no
  cruzan a `catalogo.html` ni a `ventas.html`. Es el alcance del Ej. 4; se
  documenta como limitación, no como defecto.
- **ISBN sin case-folding** → un ISBN que difiere solo en la caja de la `X` final
  no se detecta como duplicado. Decisión del usuario (§9-d); se acepta y se
  informa en la verificación.
- **`novalidate` deja toda la validación al código** → si una comprobación se
  omite, el navegador no la cubre. Mitigación: catálogo LN/CN completo, contrato
  de errores por campo y matriz manual que recorre cada caso.
- **Modelo público y mutable** → la vista podría hacer `push` por error.
  Mitigación: `ElTintero.registros` es el único camino de mutación y la revisión
  manual busca `push`/asignación de ids fuera de `js/data.js`.
- **`altas.js` cargado en páginas sin los formularios** → referencias nulas si no
  se detecta la vista. Mitigación: `iniciar()` comprueba `#libros-form` y
  `#clientes-form` y retorna sin efectos; consola limpia en `catalogo.html`,
  `ventas.html` e `historial.html`.
- **Crecimiento de `js/data.js`** → mezclar consultas y mutaciones puede volverlo
  difícil de leer. Mitigación: separación estricta `ElTintero.consultas` vs.
  `ElTintero.registros`, funciones pequeñas y nombres en español.
- **Mensajes concatenados largos** → un resumen único puede ser extenso.
  Mitigación: orden fijo por campo, literales breves y LN-12 sin repetición.

## Migration Plan

No aplica. Es una funcionalidad nueva sobre archivos nuevos (`js/altas.js`) y
una ampliación aditiva de `js/data.js`; los cambios de HTML son mínimos
(`novalidate`, scripts, retiro de contenido estático). No hay datos persistidos
ni usuarios existentes que migrar. Rollback: quitar los `<script defer>`, el
`novalidate` y restaurar las filas/opciones estáticas; el modelo inicial no se
modifica.

## Testing Strategy

Verificación manual documentada, sin runner, sin npm y sin servidor. Se abre
`libros.html` y `clientes.html` con doble clic (`file://`) y se registra el
resultado de cada control como aprobado, fallido u omitido.

| # | Comprobación | Resultado esperado |
| --- | --- | --- |
| T-01 | Abrir ambas vistas por `file://` | Cargan sin servidor; consola limpia |
| T-02 | Render inicial de libros | 6 filas desde el modelo, sin filas estáticas |
| T-03 | Render inicial de clientes | 3 filas desde el modelo, sin filas estáticas |
| T-04 | Selectores y checkboxes de libros | 3 editoriales + inicial, 3 géneros + «Sin clasificar», 5 checkboxes `libros-autor-1..5` sin `checked` |
| T-05 | Alta válida de libro | 7.ª fila al final, éxito LN-OK, formulario limpio |
| T-06 | Alta válida de cliente | 4.ª fila al final, éxito CN-OK, formulario limpio |
| T-07 | Errores LN-01..LN-12, uno por vez | Literal exacto, sin mutación, valores conservados |
| T-08 | Errores CN-01..CN-04, uno por vez | Literal exacto, sin mutación, valores conservados |
| T-09 | ISBN duplicado con guiones | `978-84-376-0494-7` rechazado con LN-04 |
| T-10 | ISBN duplicado sin guiones | `9788437604947` rechazado con LN-04 |
| T-11 | ISBN duplicado con espacios | ` 978 84 376 0494 7 ` rechazado con LN-04 |
| T-12 | Email duplicado con mayúsculas y espacios | ` Ana.Perez@Example.com ` rechazado con CN-04 |
| T-13 | Precio `0`, negativo, vacío y texto | LN-07, LN-07, LN-05 y LN-06 respectivamente |
| T-14 | Sin autor seleccionado | LN-11 y sin alta |
| T-15 | Referencias inexistentes inyectadas desde consola | LN-09/LN-10/LN-12 y sin alta |
| T-16 | Lista vacía vaciando el modelo desde consola | `#*-vacio` visible y `<tbody>` sin filas |
| T-17 | Éxito y error | Nunca visibles a la vez |
| T-18 | `aria-invalid` / `aria-describedby` | Presentes en controles afectados; retirados tras alta válida |
| T-19 | Múltiples errores | Resumen concatenado con un espacio, en orden de campos; LN-12 una vez |
| T-20 | Recarga de ambas vistas | Datos iniciales restablecidos; sin persistencia |
| T-21 | `verificarIntegridad()` tras varias altas | Devuelve `[]` |
| T-22 | Inocuidad en otras vistas | `catalogo.html`, `ventas.html` e `historial.html` sin errores de consola por `altas.js` |
| T-23 | Inserción segura | Título/nombre con markup se muestra como texto literal |

## Open Questions

Ninguna: las decisiones a–k están resueltas (2026-10-20).
