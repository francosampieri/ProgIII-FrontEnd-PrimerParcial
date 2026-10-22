# Proposal — ejercicio-5-venta-simulada-historial

> **Fase: SPEC + PLAN** (Fases 1 y 2 de `docs/prompts/PROMPT5.md`). Entregables:
> este documento, los tres delta specs, `design.md` y `tasks.md`. **No** se
> escribe código de producto, no se modifican `js/`, `*.html`, `css/`,
> `openspec/specs/` ni `openspec/changes/archive/`.
> Norma de precedencia: ante conflicto entre esta propuesta y
> `docs/Repaso Primer Parcial.pdf`, vale el PDF (`docs/prompts/PROMPT5.md:26`).
> Decisiones **APROBADAS** por el usuario el 2026-10-21, todas según el default
> propuesto (ver §9).
>
> Nota de numeración: los requisitos `R-01..R-10` de este change son los de
> `docs/prompts/PROMPT5.md:72-83`. Los delta specs reutilizan los encabezados
> `(R-xx parcial)` **existentes** en `openspec/specs/` porque OpenSpec exige que
> un `### Requirement:` bajo `## MODIFIED Requirements` coincida exactamente con
> el vigente; esa numeración pertenece al Ej. 1 y se conserva como identificador
> del requisito, no como vínculo con `R-xx` de este change.

## Why

`ventas.html` e `historial.html` siguen siendo maquetas: `ventas.html` no carga
scripts, tiene dos selectores y una fila de renglón hardcodeados y un total fijo
`$18.500`; `historial.html` muestra dos ventas estáticas sin JavaScript.
`ElTintero.datos` no tiene colección `ventas` (verificado: 0 coincidencias de
«venta» en `js/*.js`) y no existe ninguna función de ventas. El Ejercicio 5
(20 puntos: composición y validaciones 8 + cálculos 5 + confirmación e historial
inmutable 7, PDF p. 7) exige componer una venta con cliente y libros existentes,
calcular subtotales/total con dos decimales, confirmarla copiando el precio
unitario como valor histórico y consultarla en un historial no editable. Sin
este change, el modelo local no puede registrar ventas y el Ej. 6 no tendrá
colección ni contrato que persistir.

## What Changes

- Se especifica (sin implementar) la **población desde `ElTintero.datos`** de
  `#ventas-cliente` (3 clientes + opción vacía) y `#ventas-libro` (6 libros +
  opción vacía), con el `id` numérico como `value` y el nombre/título como
  texto, retirando las opciones hardcodeadas (`ventas.html:27-28`, `35-37`).
- Se especifica la **composición de una venta en memoria**: agregar renglones
  con libro existente y cantidad entera mayor que cero, mostrar libro, cantidad,
  precio unitario y subtotal, cambiar la cantidad y quitar renglones antes de
  confirmar (R-01, R-02).
- Se especifican las **validaciones de composición**: libro vacío o inexistente,
  cantidad vacía/no numérica/no entera/cero/negativa y libro repetido (política
  default en §9-D1), sin agregar el renglón, con mensaje de texto y conservando
  la composición válida (R-02, R-06).
- Se especifica el **cálculo** de `subtotal = cantidad × precioUnitario` y
  `total = Σ subtotales`, recalculados al agregar, cambiar cantidad o quitar, con
  redondeo a dos decimales y presentación `$1.234,56` sin alterar
  `formatearPrecio` (0 decimales) del catálogo (R-03).
- Se especifica la **confirmación**: rechazo sin cliente, sin renglones o con
  cantidades inválidas; alta en `ElTintero.datos.ventas` con id único, fecha,
  `clienteId`, `clienteNombre`, renglones (`libroId`, `tituloLibro`, `cantidad`,
  `precioUnitario` histórico, `subtotal`) y `total`; limpieza del formulario y
  mensaje de éxito (R-04).
- Se especifica el **historial dinámico** desde `ElTintero.datos.ventas`, sin
  filas estáticas, con identificador, fecha, cliente, total y detalle por venta
  que usa los valores almacenados; estado vacío en `#historial-vacio`; sin
  editar ni eliminar ventas (R-05).
- Se centraliza en `js/data.js` la colección `ventas`, `generarIdVenta`,
  `buscarVentaPorId` y `registrarVenta`, con la vista sin mutar arrays; se
  documenta el contrato y los ganchos del Ej. 6 (R-09).
- Se especifican los **cambios mínimos futuros de producto** (solo Fase 3):
  `<script defer>` en `ventas.html` e `historial.html`; `id` en los botones
  «Agregar renglón» y «Confirmar venta»; control de cantidad por renglón;
  contenedor `#ventas-renglones-vacio`; `<tbody>` de renglones e historial
  vaciados y generados por JS; `js/data.js` ampliado con ventas; archivo(s) JS
  de vista nuevos. CSS sin cambios.
- **No** se implementan: persistencia (Ej. 6), edición/anulación/eliminación de
  ventas, stock, cobros, facturación, impuestos, descuentos, CRUD de otras
  entidades, `fetch`, backend, frameworks, librerías, módulos ES ni tests
  automatizados.

## Capabilities

### New Capabilities

- Ninguna. El Ej. 5 extiende capacidades existentes (`ventas`, `historial`,
  `datos-locales`) en lugar de introducir un dominio nuevo.

### Modified Capabilities

- `ventas`: la vista deja de ser una maqueta sin lógica y pasa a poblar
  selectores desde el modelo, componer renglones con validaciones, calcular
  subtotales/total con dos decimales, confirmar la venta y limpiar el
  formulario; se agregan requisitos de política de duplicados, estados de
  composición vacía, inmutabilidad e inserción segura (R-01..R-04, R-06, R-07,
  R-09, R-10).
- `historial`: la tabla y los detalles dejan de ser estáticos y se renderizan
  desde `ElTintero.datos.ventas`, con detalle construido a partir de los valores
  históricos almacenados, estado vacío dinámico y sin controles de edición ni
  eliminación (R-05, R-06, R-07, R-09).
- `datos-locales`: se agrega la colección `ventas` (incluidas 2 ventas de
  ejemplo), la generación de id, la búsqueda por id, la mutación `registrarVenta`
  y la verificación de integridad de las ventas, además del formateo monetario
  con dos decimales; se amplía el contrato público reutilizable por el Ej. 6
  (R-03, R-05, R-07, R-09).

## Impact

- Archivos de producto afectados **solo en Fase 3** (aquí solo se especifican):
  `ventas.html` (`<script defer>`, `id` en botones, control de cantidad por
  renglón, `#ventas-renglones-vacio`, `<tbody>` sin fila estática),
  `historial.html` (`<script defer>`, `<tbody>` y secciones de detalle sin
  contenido estático), `js/data.js` (colección `ventas`, consultas, ids,
  `registrarVenta`, `formatearImporte`, integridad de ventas) y archivos JS de
  vista nuevos en `js/` (D12: `js/ventas.js` y `js/historial.js`).
- No se modifica `css/styles.css`, `index.html`, `catalogo.html`, `libros.html`,
  `clientes.html` ni `js/catalogo.js`/`js/altas.js`.
- Capabilities `catalogo`, `clientes`, `libros`, `identidad-visual`,
  `diseno-adaptable` y `accesibilidad-basica` no cambian sus requisitos.
- Sin impacto en APIs, backend, dependencias ni build: prohibidos por alcance
  (sin npm, sin servidor, sin `fetch`, sin `localStorage`, sin librerías, sin
  módulos ES).
- Los `id`, `name`, `label`, clases y contenedores de estado existentes se
  conservan (`venta-renglones`, `ventas-total`, `ventas-cliente`,
  `ventas-libro`, `ventas-cantidad`, `ventas-resumen`, `ventas-mensaje-ok`,
  `ventas-mensaje-error`, `historial-tabla`, `historial-vacio`,
  `historial-detalle-<id>`).

---

## 1. Problema, objetivo y resultado esperado

**Problema (hecho verificado):** `ventas.html` no contiene ninguna etiqueta
`<script>` ni un `<form>`; `#ventas-cliente` tiene 2 clientes hardcodeados
(`ventas.html:27-28`) y `#ventas-libro` 3 libros hardcodeados
(`ventas.html:35-37`), que no se corresponden con los 3 clientes y 6 libros del
modelo; el `<tbody>` de `#venta-renglones` tiene una fila estática
(`ventas.html:59-68`) y `#ventas-total` está fijado en `$18.500`
(`ventas.html:73`). `historial.html` no contiene `<script>`: su tabla tiene 2
filas estáticas (`historial.html:36-49`) y dos secciones de detalle estáticas
(`historial.html:54-107`), por lo que ninguna venta nueva puede verse ni
consultarse. `ElTintero.datos` no incluye `ventas` ni existe lógica de ventas en
`js/` (0 coincidencias de «venta» en `js/*.js`).

**Objetivo:** especificar la composición de una venta simulada en memoria, el
cálculo de importes con dos decimales, la confirmación con precio unitario
histórico y el historial de solo lectura, centralizando el modelo y las
mutaciones en `js/data.js` para que el Ej. 6 pueda persistir sin cambiar el HTML
ni los contratos.

**Resultado esperado de esta fase:** este `proposal.md` + los delta specs
`specs/ventas/spec.md`, `specs/historial/spec.md` y
`specs/datos-locales/spec.md`, listos para revisión. Quedan fuera de esta fase
`design.md`, `tasks.md` y todo código de producto.

## 2. Contexto verificado y referencias concretas

### 2.1 Fuentes leídas en esta sesión

- `docs/prompts/PROMPT5.md` (170 líneas, leído íntegramente): rol, metodología,
  contexto, alcance incluido/excluido, requisitos `R-01..R-10`
  (PROMPT5.md:72-83), datos de ejemplo (PROMPT5.md:85), Fase 1 con sus 9 puntos
  y decisiones esperadas (PROMPT5.md:87-105), criterios `CA-01..CA-10`
  (PROMPT5.md:138-149) y restricciones anti-alucinación (PROMPT5.md:156-165).
- `docs/Repaso Primer Parcial.pdf` (7 páginas). **La herramienta `read` no pudo
  interpretarlo** (`this model does not support pdf input`); se extrajo el texto
  con PyMuPDF (`fitz`) desde Python 3.14 y se leyó el texto resultante. La capa
  de texto del PDF se extrae con mojibake de acentos («Pßgina» por «Página»);
  en las citas se restituye la acentuación sin cambiar palabras.
- `js/data.js` (416 líneas), `ventas.html` (86), `historial.html` (113),
  `js/altas.js`, `js/catalogo.js` y `css/styles.css` (nombres de clases).
- `openspec/specs/{ventas,historial,datos-locales}/spec.md` completos;
  `openspec/specs/{clientes,libros}/spec.md` como referencia de estilo;
  `openspec/changes/archive/2026-10-20-ejercicio-4-altas-libros-clientes/proposal.md`
  y su `specs/datos-locales/spec.md`.
- `openspec/config.yaml` (artefactos en español; headings OpenSpec y
  `SHALL`/`MUST` en inglés) y `openspec/changes/ejercicio-5-.../.openspec.yaml`
  (`schema: spec-driven`, `created: 2026-10-21`).

**Citas del PDF (verificadas página por página):**

- **p. 5 — «Ejercicio 5 · 5. Venta simulada e historial»** (verificada):
  «Se selecciona un cliente existente y se agrega al menos un renglón con un
  libro existente y una cantidad entera mayor que cero. No se admiten libros
  repetidos dentro de la misma venta: se modifica la cantidad del renglón
  existente o se informa el duplicado. Antes de confirmar, se permite cambiar
  cantidades y quitar renglones.» / «Cada renglón muestra libro, cantidad,
  precio unitario y subtotal. Se calcula subtotal como cantidad por precio y
  total como suma de subtotales; los importes se presentan con dos decimales. Se
  impide confirmar una venta sin cliente, sin renglones o con cantidades
  inválidas.» / «Al confirmar, se registra un identificador, fecha, cliente,
  renglones y total. El precio unitario se copia al renglón como valor
  histórico, de modo que no se obtiene nuevamente desde el precio actual del
  catálogo al consultar el historial. Se conservan también los datos
  descriptivos necesarios para leer esa venta.» / «El historial muestra
  identificador, fecha, cliente y total, y permite consultar los renglones. Las
  ventas confirmadas no se editan ni eliminan desde la interfaz. La confirmación
  limpia el formulario para una nueva venta y muestra un mensaje de resultado.»
- **p. 1 — «Contexto y alcance»** (verificada): «El proyecto representa una
  librería que presenta su catálogo y registra libros, clientes y ventas.» /
  «Se utilizan únicamente HTML, CSS y JavaScript nativos. […] No se utilizan
  librerías, frameworks ni CDNs de CSS o JavaScript. No se requiere API, base de
  datos, servidor ni conexión con el backend.» / «Los datos son ficticios. […]
  La venta registra cantidades y precios para obtener un total simulado, sin
  gestionar stock, cobros ni facturación fiscal.»
- **p. 2 — «Organización del trabajo — Etapa 2»** (verificada): «Etapa 2:
  desarrollo del TPI completo. Se conectan las pantallas con datos locales y se
  completan los ejercicios 3 a 6, incluidas las validaciones, las ventas y la
  persistencia.»
- **p. 7 — «Criterios de evaluación», ítem 5** (verificada): «5. Ventas: 20 —
  Composición y validaciones: 8; cálculos: 5; confirmación e historial
  inmutable: 7.»
- **p. 7 — «Formato de entrega»** (verificada): «Se entrega una carpeta o
  archivo comprimido con index.html, los demás HTML si corresponden, carpetas de
  CSS, JavaScript y recursos locales, y un README.md. No se incluyen
  dependencias instaladas ni herramientas de compilación.»

### 2.2 Estado real del producto (inspección directa)

| # | Hecho verificado | Fuente |
| --- | --- | --- |
| F-01 | `ElTintero.datos` tiene `editoriales` (3), `generos` (3), `autores` (5), `libros` (6) y `clientes` (3), todos con `id` numérico; **no existe `ventas`** | `js/data.js:11-90`; grep de «venta» en `js/*.js` = 0 coincidencias |
| F-02 | Libros id 1–6 con precio: 1 «Cien años de soledad» 18500; 2 «Antología de la literatura fantástica» 21400; 3 «El Aleph» 15900; 4 «Rayuela» 24500; 5 «La invención de Morel» 14300; 6 «El informe de Brodie» 19900 | `js/data.js:29-84` |
| F-03 | Clientes id 1–3: Ana Pérez, Bruno Díaz, Carla Gómez | `js/data.js:85-89` |
| F-04 | `buscarLibroPorId(id)` usa `Array.prototype.find` y devuelve el libro o **`undefined`** | `js/data.js:122-126` |
| F-05 | `formatearPrecio` usa `Intl.NumberFormat("es-AR", {minimumFractionDigits: 0, maximumFractionDigits: 0})` y antepone `"$"` | `js/data.js:140-147` |
| F-06 | `generarIdSiguiente` devuelve `max(id) + 1` (reduce con semilla `0`, por lo que una colección vacía da `1`); `generarIdLibro`/`generarIdCliente` lo reutilizan | `js/data.js:258-271` |
| F-07 | `registrarLibro` valida todo antes del `push` y devuelve `{ exito: false, errores: [{campo, mensaje}] }` o `{ exito: true, libro }` | `js/data.js:273-359` (345, 358) |
| F-08 | `registrarCliente` tiene el mismo contrato: `{ exito, cliente }` / `{ exito: false, errores }` | `js/data.js:361-390` |
| F-09 | `verificarIntegridad()` recorre `["editoriales","generos","autores","libros","clientes"]` (ids duplicados), valida referencias y precio de libros, reporta con `console.error` y devuelve `errores`; se ejecuta al cargar | `js/data.js:195-237`, `415` |
| F-10 | `ElTintero.consultas` y `ElTintero.registros` se construyen al final del IIFE | `js/data.js:392-413` |
| F-11 | `ventas.html` no tiene `<script>` ni `<form>`; `#ventas-cliente` tiene 2 opciones hardcodeadas y `#ventas-libro` 3; `#ventas-cantidad` es `type="number" min="1" value="1"`; botón «Agregar renglón» sin `id`; `<tbody>` con 1 fila estática; `#ventas-total` = `$18.500`; botón «Confirmar venta» sin `id`; mensajes ok/error ocultos con `aria-live="polite"` | `ventas.html:21-80` (27-28, 35-37, 42, 45, 59-68, 73, 75, 78-79) |
| F-12 | `historial.html` no tiene `<script>`; `#historial-tabla` tiene 2 filas estáticas con `data-venta-id` 1 y 2, totales `$18.500` y `$37.300`; existe `#historial-vacio` oculto; hay `section#historial-detalle-1` y `#historial-detalle-2` estáticas | `historial.html:23-107` |
| F-13 | Los totales estáticos son coherentes con el modelo: venta 1 = 1 × 18500 = 18500; venta 2 = 21400 + 15900 = 37300 | `historial.html:40,47` vs `js/data.js:34,43,52` |
| F-14 | No hay `localStorage`, `sessionStorage` ni IndexedDB en HTML ni `js/` (0 coincidencias) | grep en `*.html` y `js/*.js` |
| F-15 | No existe `README.md` en la raíz | listado del directorio |
| F-16 | Patrón de scripts: `<script defer src="js/data.js">` y luego el script de vista, en ese orden | `catalogo.html:41-42`, `libros.html:74-75`, `clientes.html:55-56` |
| F-17 | Patrón de vista: IIFE con `"use strict"`, `window.ElTintero = window.ElTintero || {}`, helpers privados (`crearOpcion`, `vaciarElemento`, `alternarVacio`), namespace público y auto-inicio al final | `js/altas.js:1-4,26-47` y cierre; `js/catalogo.js` cierre |
| F-18 | Existen las clases reutilizables `.btn`, `.btn--secundario`, `.btn--peligro`, `.form-group`, `.form-acciones`, `.venta-resumen`, `.tabla-contenedor`, `.tabla`, `.mensaje`, `.mensaje-exito`, `.mensaje-error`, `.mensaje-vacio` | `css/styles.css:149,167,178,220,249,282,305,313,342,351,357,369` |

### 2.3 Precisión sobre los importes y las fechas

Verificado con Node.js en esta sesión (no forma parte del producto):

- `new Intl.NumberFormat("es-AR", {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(18500)`
  produce `18.500,00`; con el prefijo `"$"` → `$18.500,00`.
- Los artefactos de coma flotante existen si un precio tiene decimales (posible
  porque `#libros-precio` usa `step="0.01"`): `3 × 18500.05` da
  `55500.149999999994`; `7 × 0.1` da `0.7000000000000001`. `Math.round(v * 100) / 100`
  los normaliza a `55500.15` y `0.7`.
- Formatear una fecha con `Intl.DateTimeFormat("es-AR")` **sin** `timeZone`
  sobre `Date.UTC(2026, 9, 1)` devuelve `30/09/2026` en Argentina (UTC−3); con
  `timeZone: "UTC"` devuelve `01/10/2026`. Es un riesgo real de corrimiento de
  día que el contrato de §5 debe evitar.

### 2.4 Supuestos declarados (no hechos)

- Los literales de mensajes VN-xx de §5.6 están **aprobados** (§9-D10).
- Las fechas `2026-10-01` y `2026-10-02` de las ventas de ejemplo se toman de las
  filas estáticas actuales y se declaran ficticias; no son fechas reales.
- Los nombres de archivos JS de vista y la organización de §5.1 están
  **aprobados** (§9-D12): `js/ventas.js` y `js/historial.js`.

## 3. Alcance incluido y exclusiones explícitas

### Incluido

- Población de `#ventas-cliente` y `#ventas-libro` desde `ElTintero.datos` al
  cargar, con opción inicial vacía e `id` numérico como `value`; retiro de las
  opciones hardcodeadas (R-01).
- Composición en memoria con al menos un renglón por venta; renglón con libro,
  cantidad, precio unitario, subtotal y acciones de cambiar cantidad y quitar
  (R-01, R-02).
- Validación de libro vacío/inexistente y de cantidad vacía, no numérica, no
  entera, cero o negativa; política de libro repetido según §9-D1 (R-02).
- Cálculo de subtotal y total con dos decimales, recalculado al agregar, cambiar
  cantidad o quitar; redondeo a dos decimales (R-03).
- Rechazo de confirmación sin cliente, sin renglones o con cantidades inválidas,
  con mensaje y sin mutación (R-04, R-06).
- Confirmación válida: alta en `ElTintero.datos.ventas` con `id` único, `fecha`,
  `clienteId`, `clienteNombre`, renglones con `precioUnitario` histórico y
  `total`; limpieza del formulario; mensaje de éxito (R-04).
- Historial renderizado desde el modelo, con identificador, fecha, cliente y
  total; detalle por venta con valores almacenados; `#historial-vacio` cuando no
  hay ventas; sin controles de edición ni eliminación (R-05).
- Mensajes de texto con `hidden` y `aria-live="polite"` alternados; distinción
  entre composición vacía e historial vacío (R-06).
- Centralización en `js/data.js` de `ventas`, `generarIdVenta`,
  `buscarVentaPorId`, `registrarVenta`, `formatearImporte` y la verificación de
  integridad ampliada; la vista no muta arrays (R-07, R-09).
- Documentación del contrato y de los ganchos del Ej. 6 (R-09).
- Inserción con `textContent`/`createElement`; sin `innerHTML` con datos (R-07).
- Conservación de `label`, `thead`/`th scope`, `#ventas-total` en
  `#ventas-resumen` y del diseño adaptable (R-10).

### Excluido

- Todo el Ejercicio 6: `localStorage`/`sessionStorage`/IndexedDB, persistencia
  entre recargas o entre páginas, recuperación/duplicación de datos, README
  definitivo, casos manuales y comprobación guiada con almacenamiento.
- Persistencia de una venta confirmada al navegar de `ventas.html` a
  `historial.html`: sin Ej. 6 cada carga reinicia los datos en memoria. La
  limitación se documenta; no se simula con almacenamiento.
- Editar, anular, eliminar o reprocesar ventas confirmadas; editar precios desde
  el historial.
- Stock, disponibilidad, cobros, pagos, facturación fiscal, impuestos,
  descuentos, recargos o envíos.
- Altas, bajas o modificaciones de libros, clientes, editoriales, géneros o
  autores; CRUD de cualquier entidad (Ej. 4 cerrado).
- Renderizado dinámico de Catálogo, Libros y Clientes más allá de lo existente.
- `fetch`/AJAX, APIs, backend, frameworks, librerías, CDNs o módulos ES.
- Cambios de diseño/CSS, de estructura semántica o de navegación ajenos a esta
  entrega; solo los ajustes mínimos de HTML justificados en §5.5.
- Tests automatizados; la verificación del Ej. 5 es manual por `file://`.

## 4. Requisitos identificados y escenarios observables

> Resumen vinculado; la versión normativa y testable está en los delta specs.
> Todo se observa abriendo `ventas.html` e `historial.html` con doble clic
> (`file://`), sin servidor.

- **R-01 Selección y renglones** — `#ventas-cliente` y `#ventas-libro` se
  generan desde el modelo (3 y 6 opciones + vacía), sin opciones hardcodeadas;
  un renglón válido exige libro existente y cantidad entera > 0 y muestra libro,
  cantidad, precio unitario y subtotal.
- **R-02 Validación de composición** — se rechazan sin agregar: libro vacío o
  inexistente, cantidad vacía, no numérica, decimal, cero o negativa, y libro
  repetido según §9-D1; mensaje de texto y conservación de lo ya compuesto.
- **R-03 Cálculos** — `subtotal = cantidad × precioUnitario`, `total = Σ
  subtotales`, recalculados al agregar/cambiar/quitar; importes con exactamente
  dos decimales y redondeo `Math.round(v * 100) / 100`; `formatearPrecio` del
  catálogo no cambia.
- **R-04 Confirmación** — rechazo sin cliente, sin renglones o con cantidades
  inválidas, sin registrar nada; confirmación válida crea la venta con
  `precioUnitario` histórico, limpia el formulario y muestra éxito.
- **R-05 Historial** — render desde `ElTintero.datos.ventas` sin filas estáticas,
  con identificador, fecha, cliente y total, detalle con valores almacenados,
  `#historial-vacio` si no hay ventas y sin editar ni eliminar.
- **R-06 Mensajes y estados** — mensajes de texto con `hidden` y
  `aria-live="polite"`, nunca éxito y error simultáneos; se conserva la
  composición ante rechazo; composición sin renglones ≠ historial vacío.
- **R-07 Calidad y seguridad** — `textContent`/`createElement`, sin `innerHTML`
  con datos, consola limpia, datos inválidos nunca en el modelo,
  `verificarIntegridad()` devuelve `[]` con los datos de ejemplo y tras ventas
  válidas.
- **R-08 Convenciones** — JS externo con `<script defer>` en orden de
  dependencia; sin inline, sin `type="module"`, sin librerías; IIFE con
  `"use strict"` y namespace `ElTintero`; nombres de dominio en español; `id`
  existentes conservados.
- **R-09 Separación y preparación futura** — `ventas`, ids, búsqueda y
  `registrarVenta` centralizados en `js/data.js`; la vista no muta arrays; el
  contrato y los ganchos del Ej. 6 quedan documentados; sin persistencia.
- **R-10 Interfaz y accesibilidad** — `label` conservados, botones descriptivos,
  `thead`/`th scope` conservados, controles de renglón usables con teclado con
  nombre accesible, total anunciado en `#ventas-total` dentro de
  `#ventas-resumen`, diseño adaptable intacto.

### Casos límite exigidos

| Caso | Resultado observable |
| --- | --- |
| Cantidad vacía / solo espacios | Rechazo con mensaje; no se agrega renglón; la composición previa se conserva |
| Cantidad no numérica (`abc`) | Rechazo con mensaje; sin renglón |
| Cantidad decimal (`1.5`) | Rechazo por no entera (`Number.isInteger`); sin renglón |
| Cantidad `0` | Rechazo por «mayor que cero»; sin renglón |
| Cantidad negativa (`-2`) | Rechazo por «mayor que cero»; sin renglón |
| Libro sin seleccionar o `value` inexistente (id manipulado) | Rechazo; sin renglón |
| Libro repetido | Según §9-D1 (default: rechazo con mensaje, sin segundo renglón) |
| Cliente sin seleccionar al confirmar | Rechazo; no se registra nada |
| Confirmar sin renglones | Rechazo; no se registra nada |
| Cliente inexistente por id manipulado | Rechazo; no se registra nada |
| Libro inexistente en un renglón manipulado | Rechazo; no se registra nada |
| Venta confirmada y luego cambia el precio del libro en el catálogo | El historial conserva `precioUnitario`, `subtotal` y `total` confirmados |
| Historial vacío (`ElTintero.datos.ventas` sin registros) | Tabla sin filas y `#historial-vacio` visible |
| Importes con decimales | Sin artefactos: `3 × 18500,05` → `$55.500,15`; `7 × 0,10` → `$0,70` |
| Venta confirmada y navegación a `historial.html` | Sin Ej. 6 la venta no aparece (limitación documentada) |

## 5. Estructura, interfaces y datos

> Todo lo siguiente es **especificación aprobada**, no implementación. Las
> decisiones se registran, ya aprobadas, en §9.

### 5.1 Organización de archivos (D12 aprobada)

- `js/data.js` (existente, se amplía): colección `ventas`, consultas y
  mutaciones, sin DOM.
- `js/ventas.js` y `js/historial.js` (D12): un archivo de vista por página, cada
  uno con IIFE, detección de la página por la presencia de sus `id` raíz y
  auto-inicio; `ElTintero.ventas` / `ElTintero.historial`.
  *Descartado:* un único `js/ventas.js` que detectara ambas páginas, como
  `js/altas.js`.
- Orden de carga en Fase 3: `data.js` y luego el script de vista, con `defer`
  (`ventas.html`, `historial.html`), igual que `catalogo.html:41-42`.

### 5.2 Esquema de venta

| Campo | Tipo | Obligatorio | Regla |
| --- | --- | --- | --- |
| `id` | `number` | sí | entero único, `generarIdVenta()`; incremental (`max + 1`) |
| `fecha` | `string` | sí | default `'YYYY-MM-DD'` (§9-D5); fecha del momento de confirmación |
| `clienteId` | `number` | sí | debe existir en `clientes` |
| `clienteNombre` | `string` | sí | copia del `nombre` del cliente al confirmar |
| `renglones` | `Renglon[]` | sí | al menos 1; libros existentes; sin repetir `libroId` |
| `total` | `number` | sí | `Σ subtotal`, redondeado a 2 decimales |

### 5.3 Esquema de renglón

| Campo | Tipo | Obligatorio | Regla |
| --- | --- | --- | --- |
| `libroId` | `number` | sí | existente en `libros` |
| `tituloLibro` | `string` | sí | copia del `titulo` del libro al confirmar |
| `cantidad` | `number` | sí | entero `> 0` (`Number.isInteger`) |
| `precioUnitario` | `number` | sí | copia del `precio` vigente **al confirmar** (§9-D3) |
| `subtotal` | `number` | sí | `cantidad × precioUnitario`, redondeado a 2 decimales |

Ejemplo (datos ficticios tomados del modelo actual):

```js
{
  id: 1,
  fecha: "2026-10-01",
  clienteId: 1,
  clienteNombre: "Ana Pérez",
  renglones: [
    { libroId: 1, tituloLibro: "Cien años de soledad", cantidad: 1,
      precioUnitario: 18500, subtotal: 18500 }
  ],
  total: 18500
}
```

### 5.4 Contrato de funciones (aprobado)

| Función | Parámetros | Devuelve | Errores |
| --- | --- | --- | --- |
| `ElTintero.registros.generarIdVenta()` | — | `number` (`max(id) + 1`; `1` si `ventas` está vacía) | No muta; sin excepciones |
| `ElTintero.consultas.buscarVentaPorId(id)` | `id: number` | `Venta \| undefined` | Igual que `buscarLibroPorId` (`js/data.js:122-126`): `undefined` si no existe |
| `ElTintero.registros.registrarVenta({ clienteId, renglones })` | objeto con `clienteId` y `renglones` (`Renglon[]` con `libroId` y `cantidad`) | `{ exito: true, venta }` \| `{ exito: false, errores: [{ campo, mensaje }] }` | Valida todo antes del `push`; no lanza; sin alta parcial |
| `ElTintero.consultas.formatearImporte(valor)` | `valor: number` | `string` (`$1.234,56`) | Dos decimales fijos; no muta |
| `ElTintero.datos.ventas` | — | `Venta[]` | Incluye las 2 ventas de ejemplo (§5.7) |

**Alineación de retorno (decisión de coherencia, no de producto):** el brief de
esta tarea sugería `{ ok, venta }` / `{ ok, errores: string[] }`; **el código
vigente usa `exito` y `errores` como objetos `{campo, mensaje}`**
(`js/data.js:279, 345, 358, 367, 380, 389`). Se adopta el contrato existente por
consistencia con `registrarLibro`/`registrarCliente`; `registrarVenta` MUST
seguirlo. Los `campo` previstos: `clienteId`, `renglones`, `libroId`,
`cantidad`.

**Redondeo:** `redondear2(v) = Math.round(v * 100) / 100` se aplica al
`subtotal` de cada renglón y al `total` (suma de subtotales ya redondeados).
`verificarIntegridad()` MUST comprobar la coherencia con el mismo criterio.

**Fecha:** el default guarda `'YYYY-MM-DD'` construido con las partes locales
(`getFullYear`/`getMonth`+1/`getDate` con `padStart(2, "0")`), **no** con
`toISOString().slice(0, 10)`, para evitar el corrimiento de día en UTC−3. La
presentación usa `Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit",
year: "numeric", timeZone: "UTC" })` sobre la fecha parseada por partes
(verificado en §2.3).

### 5.5 Cambios mínimos futuros de HTML (solo especificados)

1. `ventas.html`: agregar `id="ventas-agregar"` al botón «Agregar renglón» e
   `id="ventas-confirmar"` al botón «Confirmar venta»; agregar
   `#ventas-renglones-vacio` (oculto, junto a la tabla); vaciar el `<tbody>` de
   `#venta-renglones`; agregar el control de cantidad por renglón generado por
   JS; agregar los `<script defer>` de `js/data.js` y del script de vista.
   Se conservan `label`, `thead`, `th scope`, `#ventas-resumen`,
   `#ventas-total`, `#ventas-mensaje-ok`, `#ventas-mensaje-error` y la
   `section` actual (sin `form`, §9-D9).
2. `historial.html`: vaciar el `<tbody>` de `#historial-tabla` y retirar las dos
   `section` estáticas `#historial-detalle-1`/`-2` (se generan por venta); los
   `id` `historial-detalle-<id>` se conservan como contrato; agregar los
   `<script defer>`.
3. Sin cambios de CSS ni de navegación.

### 5.6 Mensajes (D10 aprobada)

| Código | Condición | Literal propuesto |
| --- | --- | --- |
| VN-01 | cliente sin seleccionar | «Seleccioná un cliente.» |
| VN-02 | `clienteId` inexistente | «El cliente seleccionado no existe.» |
| VN-03 | sin renglones al confirmar | «Agregá al menos un renglón.» |
| VN-04 | libro sin seleccionar | «Seleccioná un libro.» |
| VN-05 | libro inexistente | «El libro seleccionado no existe.» |
| VN-06 | cantidad vacía o no numérica | «Ingresá una cantidad válida.» |
| VN-07 | cantidad no entera | «La cantidad debe ser un número entero.» |
| VN-08 | cantidad `<= 0` | «La cantidad debe ser mayor que cero.» |
| VN-09 | libro repetido (default §9-D1) | «Ese libro ya está en la venta.» |
| VN-OK | venta confirmada | «Venta registrada correctamente.» |

### 5.7 Datos de ejemplo (ficticios, declarados)

Se incorporan a `ElTintero.datos.ventas` las 2 ventas hoy estáticas, con ids 1 y
2, fechas ficticias y renglones sobre libros/clientes existentes:

- Venta 1: `clienteId: 1` (Ana Pérez), `fecha: "2026-10-01"`, renglón libro 1
  «Cien años de soledad» × 1 a 18500, `total: 18500`.
- Venta 2: `clienteId: 2` (Bruno Díaz), `fecha: "2026-10-02"`, renglones libro 2
  «Antología de la literatura fantástica» × 1 a 21400 y libro 3 «El Aleph» × 1 a
  15900, `total: 37300`.

Los precios coinciden con `js/data.js:34,43,52` y los totales con
`historial.html:40,47`. Son **datos de ejemplo, no reales**; las fechas son
ficticias.

### 5.8 Ganchos para el Ejercicio 6

- Persistencia futura: leer y escribir `ElTintero.datos.ventas` y volver a
  invocar las mismas funciones públicas de render (`renderizarHistorial()` /
  la que exponga `ElTintero.historial`), sin cambiar `id` de HTML ni contratos.
- `registrarVenta` es el único camino de alta de ventas, por lo que el Ej. 6
  puede envolverlo para persistir sin tocar la vista.
- No se expone `actualizarVenta`, `eliminarVenta` ni análogas: la inmutabilidad
  es un contrato de la interfaz, no una validación de formulario.
- Gancho de verificación del histórico: registrar una venta desde consola,
  cambiar `ElTintero.datos.libros[n].precio`, volver a renderizar y comprobar que
  el detalle conserva los valores confirmados. Es verificación de modelo/render,
  **no** un flujo de usuario entre páginas.

## 6. Estados y manejo de errores

| Caso | Resultado esperado | Elemento observable |
| --- | --- | --- |
| Composición sin renglones | Estado informativo, total `$0,00` | `#ventas-renglones-vacio` visible; tabla sin filas |
| Cantidad vacía / no numérica | Rechazo, sin renglón | VN-06 en `#ventas-mensaje-error`; ok oculto |
| Cantidad decimal | Rechazo | VN-07 |
| Cantidad `0` o negativa | Rechazo | VN-08 |
| Libro sin seleccionar | Rechazo | VN-04 |
| Libro inexistente (id manipulado) | Rechazo | VN-05 |
| Libro repetido | Rechazo (default) | VN-09; sin segundo renglón |
| Confirmar sin cliente | Rechazo; sin mutación | VN-01; composición conservada |
| Confirmar sin renglones | Rechazo; sin mutación | VN-03 |
| Cliente inexistente (id manipulado) | Rechazo; sin mutación | VN-02 |
| Venta válida | Se agrega a `ventas`, formulario limpio | VN-OK en `#ventas-mensaje-ok`; error oculto |
| Historial vacío | Tabla sin filas | `#historial-vacio` visible |
| Historial con ventas | Filas generadas desde el modelo | `#historial-vacio` oculto |
| Venta confirmada y recarga/navegación | La venta no persiste | Limitación documentada (Ej. 6) |

Reglas transversales:

- Exactamente uno de {ok, error} visible; la visibilidad se controla solo con
  `hidden`; se respeta `aria-live="polite"`.
- Ante cualquier rechazo, `ElTintero.datos.ventas` conserva longitud y
  contenido, y la composición conserva sus renglones válidos.
- `registrarVenta` no lanza excepciones por datos inválidos: devuelve el objeto
  de resultado.
- El estado de composición vacía es informativo y puede coexistir con un error;
  el historial vacío es independiente.

## 7. Restricciones técnicas y convenciones

- Apertura directa por `file://` (doble clic), sin npm, build ni servidor:
  prohibido `type="module"`; solo scripts clásicos externos con `defer`.
- JavaScript ES2020+ nativo: `const`/`let`, funciones nombradas y acotadas,
  `"use strict"` + IIFE/namespace para no contaminar el global; 2 espacios.
- Sin librerías, frameworks, CDNs, `fetch`/AJAX, API, backend ni módulos ES.
- Sin persistencia: nada de `localStorage`, `sessionStorage` ni IndexedDB.
- Separación estricta: modelo, consultas, formateo, ids y mutaciones en
  `js/data.js` (`ElTintero.datos`, `ElTintero.consultas`,
  `ElTintero.registros`); DOM, eventos y render en `js/ventas.js` /
  `js/historial.js` (`ElTintero.ventas`, `ElTintero.historial`).
- Inserción de datos con `textContent`/`createElement`; prohibido `innerHTML`,
  `insertAdjacentHTML`, `eval` o `document.write` con datos.
- Historial inmutable: no se expone edición, anulación ni eliminación; la vista
  no ofrece controles para ello.
- Nomenclatura: archivos e `id` en kebab-case; variables/funciones en camelCase;
  dominio en español (`venta`, `renglon`, `cliente`, `libro`, `cantidad`,
  `precioUnitario`, `subtotal`, `total`).
- Conservar los `id` existentes de `ventas.html`/`historial.html` y las columnas
  `thead` vigentes; conservar clases del CSS actual (F-18).
- Verificación manual en Fase 3: consola limpia, casos de cantidad, duplicado,
  cambio de cantidad, quitar renglón, confirmación rechazada y válida, totales
  con dos decimales e historial con ventas de ejemplo. Sin tests automatizados.

## 8. Criterios de aceptación

- [ ] **CA-01** — `#ventas-cliente` y `#ventas-libro` se generan desde el modelo
  (3 clientes y 6 libros), con opción inicial vacía y sin opciones
  hardcodeadas; agregar un libro existente con cantidad entera positiva crea un
  renglón con libro, cantidad, precio unitario y subtotal (**R-01, R-08**).
- [ ] **CA-02** — Se rechazan sin agregar renglón: libro sin seleccionar o
  inexistente, cantidad vacía, `0`, negativa, decimal, no numérica y libro
  repetido (política §9-D1); cada caso muestra un mensaje de texto y conserva la
  composición válida (**R-02, R-06, R-07**).
- [ ] **CA-03** — Con dos unidades de un libro a 1.500 y una de otro a 2.000, los
  subtotales son 3.000,00 y 2.000,00 y el total 5.000,00; cambiar una cantidad o
  quitar un renglón actualiza subtotales y total; no aparecen artefactos de coma
  flotante (**R-03**). *Nota: esos importes no existen en el catálogo actual
  (ver §2.3 y contradicción C-1 en «Fuentes consultadas»); la verificación
  equivalente con el modelo es «2 × 14.300 → 28.600,00; 1 × 15.900 → 15.900,00;
  total 44.500,00».*
- [ ] **CA-04** — Confirmar sin cliente, sin renglones o con cantidad inválida no
  registra nada y muestra error; una confirmación válida agrega a
  `ElTintero.datos.ventas` una venta con id único, fecha, cliente, renglones con
  `precioUnitario` histórico, subtotal y total; limpia el formulario y muestra el
  mensaje de éxito; no hay edición ni eliminación desde la interfaz (**R-04,
  R-05, R-06**).
- [ ] **CA-05** — En `historial.html`, el render desde el modelo muestra las 2
  ventas de ejemplo con identificador, fecha, cliente y total, y permite
  consultar sus renglones; no quedan filas estáticas; `#historial-vacio` aparece
  si el arreglo está vacío (**R-05**).
- [ ] **CA-06** — El detalle usa `precioUnitario`, subtotal y total almacenados:
  tras registrar una venta y modificar el precio del libro en el modelo, el
  render del historial conserva los valores confirmados (**R-05**).
- [ ] **CA-07** — No se usa `innerHTML` con datos; los valores se insertan como
  texto; no hay errores en consola al abrir ni al operar; `verificarIntegridad()`
  devuelve `[]` con los datos de ejemplo y después de ventas válidas (**R-07**).
- [ ] **CA-08** — Apertura directa por `file://` funciona sin servidor, npm ni
  librerías; los scripts nuevos son externos, clásicos, con `defer` y cargan
  después de `data.js` (**R-08**).
- [ ] **CA-09** — El SPEC documenta esquema, funciones nuevas, contrato y ganchos
  del Ej. 6, y deja explícito que sin persistencia las ventas no sobreviven a la
  recarga ni a la navegación entre páginas (**R-09**).
- [ ] **CA-10** — Se conservan `label`, `thead`/`th scope`, el total en
  `#ventas-resumen` y el diseño adaptable; los controles de cantidad/quitar son
  accesibles por teclado y no se muestran éxito y error a la vez (**R-06,
  R-10**).

## 9. Supuestos y registro de decisiones aprobadas

> Ninguna decisión queda abierta: las **13 están APROBADAS** por el usuario el
> 2026-10-21, todas según el default propuesto. Este apartado se conserva como
> registro de cada decisión (pregunta, default e impacto) y **no se implementa
> nada** en esta fase.
>
> `PROMPT5.md:103` enumera **10** decisiones (D1–D9 y D13); esta tarea pidió
> «12». Para no inventar, se listan las 10 del brief y **3 adicionales detectadas
> en esta fase** (D10, D11 y D12), marcadas como tales. Total surfaceado: 13.

### D1. Política de libro repetido

- **Pregunta:** ¿un libro repetido en la misma venta se rechaza con mensaje o se
  suma la cantidad al renglón existente? (PDF p. 5 admite ambas).
- **Default propuesto:** rechazar con mensaje **VN-09** y no crear un segundo
  renglón.
- **Impacto si se elige «sumar»:** cambia el escenario de CA-02 (el duplicado
  deja de ser rechazo), el mensaje VN-09 desaparece y se agrega una regla de
  recálculo del renglón existente; `R-02` cambia de «rechazo» a «actualización».
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

### D2. Interfaz para cambiar cantidades

- **Pregunta:** ¿input numérico por renglón, seleccionar el renglón y reutilizar
  el campo superior, o `prompt()`?
- **Default propuesto:** `input[type=number]` por renglón con `min="1"` y
  `step="1"`, con `aria-label` que incluya el título del libro.
- **Impacto:** `prompt()` rompe la accesibilidad y el diseño adaptable; reutilizar
  el campo superior obliga a un estado de «renglón seleccionado» y a un botón
  extra. Cambia CA-10 y los escenarios de recálculo.
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

### D3. Momento del snapshot del precio unitario

- **Pregunta:** ¿se copia al agregar el renglón o al confirmar?
- **Default propuesto:** **al confirmar**, porque el PDF p. 5 dice «Al confirmar
  […] El precio unitario se copia al renglón como valor histórico» (precedencia
  del PDF, PROMPT5.md:26). La composición muestra el precio vigente; la
  confirmación lo congela.
- **Impacto si se elige «al agregar»:** una venta compuesta y confirmada después
  de un cambio de precio guardaría el precio viejo; cambia CA-06 y el escenario
  de snapshot.
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

### D4. Formateo monetario

- **Pregunta:** ¿agregar `formatearImporte` con dos decimales para ventas o
  cambiar `formatearPrecio` globalmente?
- **Default propuesto:** agregar `ElTintero.consultas.formatearImporte`
  (`Intl.NumberFormat("es-AR", {minimumFractionDigits: 2,
  maximumFractionDigits: 2})`, prefijo `"$"`) y **no tocar** `formatearPrecio`
  (`js/data.js:140-147`), que el catálogo, Libros y el historial de precios de
  catálogo seguirían usando sin decimales.
- **Impacto si se cambia globalmente:** las 6 tarjetas del catálogo y la tabla de
  Libros pasarían a mostrar `$18.500,00`; cambia CA-03/CA-10 y afecta requisitos
  de `catalogo`/`libros` fuera de este change.
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

### D5. Formato de fecha

- **Pregunta:** ¿guardar `'YYYY-MM-DD'` y mostrar `DD/MM/AAAA`, o guardar un
  timestamp ISO y mostrar fecha y hora?
- **Default propuesto:** guardar `'YYYY-MM-DD'` (coincide con las fechas
  estáticas actuales `historial.html:38,45`) y mostrar `DD/MM/AAAA` con
  `Intl.DateTimeFormat("es-AR", {…, timeZone: "UTC"})`.
- **Impacto si se usa ISO completo:** el orden y la columna Fecha cambian; hay
  que decidir si se muestra la hora; el test de corrimiento de día de §2.3 sigue
  aplicando.
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

### D6. Formato del identificador

- **Pregunta:** ¿id numérico incremental como las demás entidades o código con
  prefijo `V-`?
- **Default propuesto:** numérico incremental con `generarIdVenta()` (`max + 1`),
  reutilizando el criterio de `js/data.js:258-263`; el historial lo muestra tal
  cual.
- **Impacto si se usa `V-1`:** `id` deja de ser `number`, se rompe la simetría con
  `buscarVentaPorId(number)` y el `data-venta-id`; hay que especificar parsing y
  unicidad de la cadena.
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

### D7. Presentación del detalle del historial

- **Pregunta:** ¿`details/summary` por venta, secciones con anclas como el HTML
  actual, o diálogo?
- **Default propuesto:** secciones con anclas generadas dinámicamente
  (`section#historial-detalle-<id>`, enlace «Ver detalle», «Volver al listado»),
  conservando el patrón y los `id` ya exigidos por
  `openspec/specs/historial/spec.md:27-41`.
- **Impacto si se usa `details/summary`:** desaparecen los enlaces y el
  `:target`; el `id` se mueve al `<details>`; cambia el escenario de detalle y el
  contrato de ganchos. Un diálogo agrega manejo de foco y cierre, fuera de
  alcance.
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

### D8. Contenedor de estado para venta sin renglones

- **Pregunta:** ¿agregar `#ventas-renglones-vacio` o reutilizar
  `#ventas-mensaje-error`?
- **Default propuesto:** agregar `#ventas-renglones-vacio` (oculto por defecto,
  texto informativo) para no mezclar estado vacío con error, siguiendo el patrón
  `#libros-vacio` de `js/altas.js` (`alternarVacio`).
- **Impacto si se reutiliza el error:** un estado normal (composición vacía)
  aparecería como error y competiría con los mensajes de validación; cambia R-06
  y CA-10.
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

### D9. Envoltorio `form#ventas-form` con `novalidate`

- **Pregunta:** ¿se envuelve la composición en un `form` con `novalidate` o se
  mantiene la `section` actual y se manejan clics?
- **Default propuesto:** mantener la `section` actual y manejar clics con
  `addEventListener` (los botones ya son `type="button"`), evitando que `Enter`
  en el campo de cantidad dispare una confirmación accidental. Dado que no hay
  `form`, no hay `submit` que cancelar.
- **Impacto si se usa `form`:** se gana el envío con `Enter` y el patrón de
  `js/altas.js`, pero hay que decidir si `Enter` compone un renglón o confirma la
  venta; cambia el escenario de eventos y el HTML.
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

### D10. Literales de los mensajes (adicional detectada)

- **Pregunta:** ¿se aprueban los literales VN-01..VN-09/VN-OK de §5.6?
- **Default propuesto:** los de §5.6.
- **Impacto:** los escenarios citan los literales; cambiarlos exige editar los
  delta specs antes de archivar.
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

### D11. Ventas de ejemplo en el modelo (adicional detectada)

- **Pregunta:** ¿las 2 ventas de ejemplo viven en `ElTintero.datos.ventas` desde
  el arranque (el historial nunca está vacío salvo que se vacíe en consola), o se
  cargan aparte solo para la verificación?
- **Default propuesto:** incluirlas en el modelo inicial, como pide PROMPT5.md:85,
  con ids 1 y 2, fechas ficticias y renglones del modelo actual (§5.7).
- **Impacto si se cargan aparte:** el estado vacío se vería al abrir el historial,
  pero CA-05 («muestra las 2 ventas de ejemplo») no se cumpliría sin pasos
  manuales; además el Ej. 6 tendría que sembrar datos desde otro lugar.
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

### D12. Organización de los archivos de vista (adicional detectada)

- **Pregunta:** ¿un archivo por página (`js/ventas.js` + `js/historial.js`) o un
  único archivo que detecte ambas páginas?
- **Default propuesto:** un archivo por página, porque las vistas tienen
  responsabilidades y estados distintos; cada uno se auto-inicia si encuentra
  sus `id`.
- **Impacto si se usa un único archivo:** menos `<script>` por página, pero un
  archivo con dos inicializaciones y más ramas; no cambia el comportamiento
  observable, solo la estructura de `js/`.
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

### D13. Limitación de persistencia (decisión del brief, sin default alternativo)

- **Pregunta:** ¿se acepta y documenta que una venta confirmada en `ventas.html`
  no sobrevive a la navegación a `historial.html` sin el Ej. 6?
- **Default propuesto:** aceptar y documentar; verificar el historial con las
  ventas de ejemplo y, desde consola, registrar una venta y llamar al render.
  No se adelanta `localStorage`.
- **Impacto:** cualquier otra opción implica implementar el Ej. 6, fuera de
  alcance.
- **Estado:** APROBADO (default propuesto) — 2026-10-21.

> D13 corresponde a la décima decisión de PROMPT5.md:103; D10, D11 y D12 son
> adicionales. Total surfaceado: **13** (10 del brief + 3 detectadas).

---

## Fuentes consultadas

- `docs/prompts/PROMPT5.md` (íntegro; citas por línea).
- `docs/Repaso Primer Parcial.pdf` — p. 1, 2, 5 y 7 (texto extraído con PyMuPDF;
  `read` no admite PDF en este modelo). Las 7 páginas fueron extraídas y
  revisadas; las citas de §2.1 se verificaron contra las páginas 1, 2, 5 y 7.
- `js/data.js`, `js/altas.js`, `js/catalogo.js`, `ventas.html`, `historial.html`,
  `catalogo.html`, `libros.html`, `clientes.html`, `css/styles.css`.
- `openspec/specs/{ventas,historial,datos-locales,clientes,libros}/spec.md`.
- `openspec/changes/archive/2026-10-20-ejercicio-4-altas-libros-clientes/proposal.md`
  y `specs/datos-locales/spec.md`.
- `openspec/config.yaml`; `openspec list --specs`; `openspec --version` (1.13.2).

### Conflictos y contradicciones detectados

- **C-1 (importes de CA-03):** `PROMPT5.md:142` y la tabla de casos del PDF
  (p. 6) usan «dos unidades a 1500 y una a 2000», pero **ningún libro del modelo
  tiene esos precios** (`js/data.js:29-84`). Es un caso aritmético de la consigna,
  no un dato del catálogo. Se documenta la verificación equivalente con precios
  reales del modelo (2 × 14.300 + 15.900 = 44.500,00) y se deja CA-03 con la nota
  correspondiente.
- **C-2 (forma de retorno):** el brief de la tarea sugería `{ ok, venta }` y
  `errores: string[]`; el código vigente usa `{ exito, venta }` y
  `errores: [{campo, mensaje}]` (`js/data.js:345,358`). Se adopta el contrato del
  código (§5.4) y se explicita el cambio.
- **C-3 (conteo de decisiones):** `PROMPT5.md:103` enumera 10 decisiones; la
  tarea pidió 12. Se listan las 10 y se agregan D10/D11/D12, marcadas como
  adicionales; no se inventan preguntas del brief.
- **C-4 (encabezados de requisitos):** no se puede renombrar un
  `### Requirement:` bajo `## MODIFIED Requirements` (OpenSpec exige coincidencia
  exacta). Por eso los delta specs conservan la numeración `(R-xx parcial)` del
  Ej. 1 y los `R-01..R-10` del Ej. 5 se referencian en el cuerpo y en este
  proposal.
- **C-5 (estado vacío vs. datos de ejemplo):** con las 2 ventas de ejemplo en
  `ElTintero.datos.ventas`, `#historial-vacio` no se ve al abrir el historial; su
  verificación requiere vaciar el arreglo en consola (no hay UI de borrado). Se
  documenta en CA-05 y en el delta de `historial`.
