# Design

## Context

Este change implementa el Ejercicio 5 sobre el modelo local ya existente. El
"por qué" y el alcance están en `proposal.md` (§1 y §3); los requisitos
normativos, en `specs/ventas/spec.md`, `specs/historial/spec.md` y
`specs/datos-locales/spec.md`. Las 13 decisiones de producto están aprobadas y
registradas en `proposal.md` §9.

Estado actual y restricciones verificadas que condicionan el diseño:

- `ventas.html` (86 líneas) e `historial.html` (113 líneas) son maquetas sin
  `<script>`: opciones y filas hardcodeadas, total fijo `$18.500` y dos
  `section#historial-detalle-<id>` estáticas.
- `ElTintero.datos` (`js/data.js:11-90`) tiene `editoriales`, `generos`,
  `autores`, `libros` (6) y `clientes` (3); **no tiene `ventas`** y no existe
  lógica de ventas en `js/` (0 coincidencias de «venta»).
- `js/data.js` es la única fuente de datos y de mutaciones: expone
  `ElTintero.datos`, `ElTintero.consultas` (`js/data.js:392-406`),
  `ElTintero.registros` (`js/data.js:408-413`) y ejecuta
  `verificarIntegridad()` al cargar (`js/data.js:415`). No toca el DOM.
- `registrarLibro`/`registrarCliente` validan todo antes del `push` y devuelven
  `{ exito, ... }` o `{ exito: false, errores: [{ campo, mensaje }] }`
  (`js/data.js:344-346, 358, 379-381, 389`); `registrarVenta` MUST seguir ese
  contrato (proposal §5.4, C-2).
- `generarIdSiguiente` (`js/data.js:258-263`) devuelve `max(id) + 1` y `1` con la
  colección vacía.
- Patrón de vista vigente: IIFE + `"use strict"` + `window.ElTintero`, helpers
  privados (`crearOpcion`, `vaciarElemento`, `alternarVacio`) y auto-inicio
  (`js/altas.js:1-50`); carga con `<script defer src="js/data.js">` y luego el
  script de vista (`catalogo.html:41-42`).
- Apertura directa por `file://`, sin build, sin servidor, sin módulos ES, sin
  librerías, sin `fetch` y sin persistencia (proposal §7).

## Goals / Non-Goals

**Goals:**

- Mantener `js/data.js` como único dueño del esquema, los ids, las consultas y
  la mutación; las vistas solo leen y renderizan.
- Separar la composición de una venta (estado en memoria en la vista) del
  registro confirmado (modelo inmutable).
- Dejar contratos estables que el Ej. 6 pueda persistir sin cambiar `id` de HTML
  ni firmas: `ElTintero.datos.ventas`, `generarIdVenta`, `buscarVentaPorId`,
  `registrarVenta`, `formatearImporte` y los hooks de render.
- Reutilizar los `id`, clases y patrones existentes (`crearElemento` +
  `textContent`, `alternarVacio`, formateo por `ElTintero.consultas`).

**Non-Goals:**

- Persistencia entre páginas o recargas, edición/anulación/eliminación de ventas.
- Stock, cobros, facturación, impuestos, descuentos.
- CRUD de libros/clientes ni cambios en Catálogo, Libros o Clientes.
- Cambios de CSS, de estructura semántica de las páginas o de navegación.
- Tests automatizados, npm, bundler o servidor.

## Decisions

### D1 — Libro repetido: rechazo con mensaje

- **Elegida:** un `libroId` ya presente en la composición se rechaza con VN-09;
  no se crea un segundo renglón ni se modifica el existente.
- **Descartada:** sumar la cantidad al renglón existente. Obligaría a recalcular
  su subtotal y a cambiar el escenario de CA-02 y la semántica de R-02.

### D2 — Cambio de cantidad por renglón

- **Elegida:** `input[type=number]` por fila con `min="1"`, `step="1"` y
  `aria-label` que incluye el título, más un botón «Quitar renglón» con nombre
  accesible.
- **Descartadas:** `prompt()` (rompe accesibilidad y diseño adaptable); reutilizar
  `#ventas-cantidad` con un estado de «renglón seleccionado» (agrega estado y un
  botón extra).

### D3 — Snapshot de `precioUnitario` al confirmar

- **Elegida:** la composición muestra el precio vigente; `registrarVenta` copia
  `precio` y `titulo` del catálogo en el momento de la confirmación (PDF p. 5).
- **Descartada:** copiar al agregar el renglón. Congelaría un precio que puede
  haber cambiado antes de confirmar y contradiría el PDF.

### D4 — `formatearImporte` sin tocar `formatearPrecio`

- **Elegida:** nueva `ElTintero.consultas.formatearImporte` con
  `Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })`
  y prefijo `"$"`; `formatearPrecio` (`js/data.js:140-147`) queda intacto.
- **Descartada:** cambiar `formatearPrecio` a dos decimales. Alteraría Catálogo y
  Libros, requisitos fuera de este change.

### D5 — Fecha almacenada `YYYY-MM-DD`, mostrada `DD/MM/AAAA`

- **Elegida:** guardar `"YYYY-MM-DD"` y mostrar con
  `Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit",
  year: "numeric", timeZone: "UTC" })`.
- **Descartada:** timestamp ISO con hora. Cambia el orden y el formato de la
  columna Fecha y agrega una decisión de presentación no pedida.

### D6 — Id numérico incremental

- **Elegida:** `generarIdVenta()` = `generarIdSiguiente(ElTintero.datos.ventas)`
  (`max + 1`, `1` si está vacía), coherente con `generarIdLibro`/`generarIdCliente`.
- **Descartada:** código con prefijo `V-`. Rompe la simetría con
  `buscarVentaPorId(number)`, `data-venta-id` e `verificarIntegridad`.

### D7 — Detalle con secciones y anclas

- **Elegida:** una `section#historial-detalle-<id>` por venta, enlazada desde la
  columna Detalle («Ver detalle») y con «Volver al listado» hacia
  `#historial-tabla`, conservando el patrón y los `id` del HTML actual.
- **Descartados:** `details/summary` (elimina enlaces y `:target`, y `openspec/specs/historial/spec.md`
  ya exige `#historial-detalle-<id>`); diálogo (requiere manejo de foco y cierre,
  fuera de alcance).

### D8 — `#ventas-renglones-vacio` como estado propio

- **Elegida:** agregar `#ventas-renglones-vacio` (oculto, texto informativo),
  igual que `#libros-vacio` con `alternarVacio` (`js/altas.js:43-50`).
- **Descartada:** reutilizar `#ventas-mensaje-error`. Mostraría un estado normal
  como error y competiría con los mensajes de validación.

### D9 — Sin `<form>`: `section` + `addEventListener`

- **Elegida:** mantener la `section` actual; los botones ya son `type="button"` y
  los clics se manejan con `addEventListener`, sin `submit` que cancelar.
- **Descartada:** `form#ventas-form` con `novalidate`. Obligaría a decidir si
  `Enter` compone un renglón o confirma la venta y agrega un contenedor nuevo.

### D10 — Literales VN-01..VN-09 / VN-OK

- **Elegida:** los literales de `proposal.md` §5.6, citados por los escenarios de
  los delta specs.
- **Descartada:** cualquier redacción alternativa; exigiría editar los specs
  antes de archivar.

### D11 — Ventas de ejemplo en el modelo

- **Elegida:** las 2 ventas (ids 1 y 2) viven en `ElTintero.datos.ventas` desde el
  arranque, con fechas ficticias y totales 18500 y 37300.
- **Descartada:** cargarlas aparte solo para la verificación. CA-05 dejaría de
  cumplirse sin pasos manuales y el Ej. 6 tendría que sembrarlas desde otro lado.

### D12 — Un archivo de vista por página

- **Elegida:** `js/ventas.js` y `js/historial.js`, cada uno con IIFE, detección de
  su página por los `id` raíz y auto-inicio; `ElTintero.ventas` y
  `ElTintero.historial`.
- **Descartada:** un único archivo que detecte ambas páginas (como
  `js/altas.js`). Concentra dos estados distintos y no aporta al comportamiento
  observable.

### D13 — Sin persistencia

- **Elegida:** aceptar y documentar que una venta confirmada no sobrevive a la
  navegación ni a la recarga; verificar el historial con las ventas de ejemplo y
  desde consola. No se adelanta `localStorage`.
- **Descartada:** implementar ya la persistencia del Ej. 6 (fuera de alcance).

### T1 — Estado de composición en memoria

- **Elegida:** un array local `renglones` en `js/ventas.js` con objetos
  `{ libroId, cantidad }`, como única fuente de verdad de la composición; el
  precio y el subtotal se derivan al renderizar consultando
  `ElTintero.consultas.buscarLibroPorId`.
- **Descartada:** leer y escribir el DOM como fuente de verdad. Obligaría a
  parsear texto de celdas y valores de `input` en cada operación, mezclaría
  presentación con estado y haría frágil el recálculo.
- **Consecuencias:** agregar, cambiar cantidad y quitar operan sobre el array y
  luego renderizan; el `<tbody>` es siempre una proyección del array.

### T2 — Re-render por reconstrucción del `<tbody>`

- **Elegida:** vaciar `#venta-renglones tbody` y reconstruirlo con
  `createElement`/`textContent` en cada cambio, con `data-libro-id` y
  `data-cantidad` por fila.
- **Descartada:** actualización quirúrgica de filas. Exige mantener índices y
  listeners por fila, con más ramas y riesgo de desincronización.
- **Costo aceptado:** el re-render destruye el `input` de cantidad y se pierde el
  foco. **Mitigación concreta:** los eventos se delegan en el `<tbody>`
  (`change`/`input` y `click` con `data-accion`), de modo que no hay listeners que
  reconectar; tras reconstruir, se vuelve a enfocar el `input` de la fila con el
  mismo `libroId` si el cambio provino de ese control.
- **Consecuencias:** los datos se insertan siempre como texto (sin `innerHTML`),
  y la tabla no arrastra filas estáticas.

### T3 — Cálculo y redondeo

- **Elegida:** `redondear2(v) = Math.round(v * 100) / 100` sobre el `subtotal` de
  cada renglón y sobre el `total`; el total se obtiene sumando los subtotales **ya
  redondeados**.
- **Descartada:** sumar primero los productos sin redondear y redondear solo al
  final. Puede diferir del subtotal mostrado y romper la coherencia que exige
  `verificarIntegridad()`.
- **Consecuencias:** `3 × 18500.05` guarda `55500.15` y no `55500.149999999994`;
  `7 × 0.1` guarda `0.7`. `formatearImporte` solo presenta, no corrige.

### T4 — Fechas sin corrimiento de día

- **Elegida:** construir `"YYYY-MM-DD"` con `getFullYear()`, `getMonth() + 1` y
  `getDate()` de la fecha local, con `padStart(2, "0")`; al mostrar, parsear por
  partes con `Date.UTC(...)` y formatear con `timeZone: "UTC"`.
- **Descartado:** `toISOString().slice(0, 10)`. Convierte a UTC y en UTC−3 cambia
  el día; formatear sin `timeZone` también corre un día (verificado en proposal
  §2.3: `Date.UTC(2026, 9, 1)` se muestra `30/09/2026`).
- **Consecuencias:** la fecha guardada y la mostrada representan el mismo día
  calendario local, sin depender de la zona horaria del equipo.

### T5 — Reparto de validaciones entre modelo y vista

- **Elegida:** `registrarVenta` valida **todo** antes del `push` y es la
  autoridad: `clienteId` existente, al menos un renglón, cada `libroId` existente,
  cada `cantidad` entera `> 0`, sin `libroId` repetido, y no muta si hay un solo
  error. La vista valida solo para dar feedback inmediato: selección vacía de
  cliente/libro, cantidad vacía/no numérica/no entera/`<= 0`, duplicado en la
  composición y composición sin renglones antes de confirmar.
- **Descartada:** validar solo en la vista (los datos manipulados desde consola
  llegarían al modelo) o solo en el modelo (el usuario no recibiría feedback al
  agregar un renglón).
- **Consecuencias:** la vista muestra VN-01..VN-09 y, ante la confirmación,
  traduce los `errores[{ campo, mensaje }]` del modelo; ningún dato inválido
  llega a `ElTintero.datos.ventas`.

### T6 — Mensajes, estados vacíos y exclusión mutua

- **Elegida:** un helper único en `js/ventas.js` que recibe el resultado
  (`"ok"`/`"error"`) y el texto, escribe el literal con `textContent` y alterna
  `hidden` entre `#ventas-mensaje-ok` y `#ventas-mensaje-error`.
- **Descartada:** manejar la visibilidad desde varios handlers. Duplica reglas y
  permite que ambos queden visibles.
- **Consecuencias:** `#ventas-renglones-vacio` es estado informativo (composición
  vacía) y puede coexistir con un error; `#historial-vacio` es independiente y se
  controla con `alternarVacio`.

### T7 — Inmutabilidad del contrato de ventas

- **Elegida:** `ElTintero.registros` expone solo `registrarVenta`; no se agregan
  `actualizarVenta`, `eliminarVenta` ni equivalentes. El historial lee
  `ElTintero.datos.ventas` o `buscarVentaPorId` y no modifica registros.
- **Descartada:** exponer mutaciones genéricas para "futuras necesidades". La
  inmutabilidad es un contrato de la interfaz (R-05), no una validación de
  formulario.
- **Consecuencias:** la única vía de alta es `registrarVenta`, lo que da al Ej. 6
  un punto único para persistir.

### T8 — Separación modelo / vista

- **Elegida:** `js/data.js` no referencia `document` ni `window` para render;
  `js/ventas.js` y `js/historial.js` no ejecutan `push`, no asignan ids ni
  reordenan arrays; solo leen por `ElTintero.consultas`/`ElTintero.datos` y, para
  confirmar, llaman a `ElTintero.registros.registrarVenta`.
- **Descartada:** mutar el array desde la vista y "avisar" al modelo. Duplicaría
  la generación de ids y la validación, y rompería el gancho del Ej. 6.
- **Consecuencias:** los archivos de vista se pueden re-renderizar en cualquier
  momento a partir del modelo; el modelo se puede probar en consola sin DOM.

### T9 — Detalle del historial generado con anclas

- **Elegida:** tras renderizar la tabla, generar un `section` por venta con
  `id="historial-detalle-<id>"`, `<h3>`, tabla de renglones (Libro, Cantidad,
  Precio unitario, Subtotal), valores almacenados y «Volver al listado»; los
  `section` se agregan a `main.contenedor`, después del listado. En cada render se
  eliminan los `section[id^="historial-detalle-"]` previos para no duplicar.
- **Descartada:** `details/summary`. `openspec/specs/historial/spec.md:27-41` ya
  exige `#historial-detalle-<id>` y enlaces; el cambio de mecanismo rompería ese
  contrato y el `:target` del CSS actual.
- **Consecuencias:** no se agrega un contenedor nuevo al HTML; el detalle se
  reconstruye desde el modelo en cada render y no consulta precios actuales.

## Risks / Trade-offs

- **Pérdida de foco al re-renderizar** (el `input` de cantidad se destruye) →
  delegación de eventos en el `<tbody>` y re-enfoque del `input` del mismo
  `libroId` tras el render; el botón «Quitar renglón» no necesita foco propio
  para operar.
- **Venta perdida al navegar** (sin persistencia) → el historial se verifica con
  las 2 ventas de ejemplo y con altas desde consola en la misma página; la
  limitación se documenta explícitamente y no se simula con almacenamiento (D13,
  CA-09).
- **`#historial-vacio` no visible con datos de ejemplo** → se verifica vaciando
  `ElTintero.datos.ventas` en consola y ejecutando el render; se documenta en
  CA-05 y en el delta de `historial` (C-5), sin agregar UI de borrado.
- **Artefactos de coma flotante** con precios decimales (`#libros-precio` usa
  `step="0.01"`) → `redondear2` en subtotal y total, coherencia verificada por
  `verificarIntegridad()`, y casos `3 × 18500.05 → 55500.15` y `7 × 0.1 → 0.7`.
- **Ids manipulados desde consola** (`#ventas-libro`, `#ventas-cliente`) →
  `registrarVenta` revalida existencia, enteros y duplicados antes del `push`; la
  vista nunca es la autoridad.
- **Divergencia futura si el Ej. 6 cambia `data.js`** → el esquema, las firmas,
  los retornos y los hooks de render quedan documentados (proposal §5.4 y §5.8) y
  `verificarIntegridad()` detecta ventas incoherentes; las vistas solo usan
  `ElTintero.consultas`/`ElTintero.registros`.
- **Detalles duplicados al re-renderizar** → cada render elimina los
  `section[id^="historial-detalle-"]` generados antes de reconstruirlos.
- **Crecimiento de `js/data.js`** → se mantiene la separación existente entre
  `ElTintero.consultas` (lecturas y formateo), `ElTintero.registros` (ids y
  mutación) y helpers privados (`redondear2`, validaciones de venta).

## Migration Plan

No hay migración de datos: la colección `ventas` vive en memoria y se recrea en
cada carga. Sin build, sin npm y sin servidor.

Orden de aplicación (Fase 3):

1. `js/data.js`: colección `ventas` con las 2 ventas de ejemplo, `generarIdVenta`,
   `buscarVentaPorId`, `formatearImporte`, `registrarVenta` y la ampliación de
   `verificarIntegridad()`.
2. `ventas.html`: `<script defer>` de `js/data.js` y `js/ventas.js`; `id` en los
   botones; `<tbody>` sin fila estática; `#ventas-renglones-vacio`.
3. `historial.html`: `<script defer>` de `js/data.js` y `js/historial.js`;
   `<tbody>` sin filas y retiro de las dos `section` de detalle estáticas.
4. `js/ventas.js`: población de selectores, composición, recálculo, confirmación y
   mensajes.
5. `js/historial.js`: tabla, detalles y estado vacío.
6. Verificación manual por `file://` (Fase 3, con autorización explícita).

Rollback: revertir los cinco archivos con `git checkout` (o borrar
`js/ventas.js`/`js/historial.js`, quitar los `<script>` y restaurar las filas,
opciones y secciones estáticas). El modelo inicial de libros y clientes no se
modifica, por lo que el rollback no requiere limpiar datos.

## Open Questions

Ninguna: las 13 decisiones de producto (D1–D13) y las 9 decisiones técnicas
(T1–T9) quedaron cerradas el 2026-10-21.
