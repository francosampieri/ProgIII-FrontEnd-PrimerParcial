# Proposal — ejercicio-1-estructura-pantallas-html

> Fase: SPEC ONLY (Fase 1 de PROMPT1). No incluye `tasks.md` ni implementación.
> Norma de precedencia: ante cualquier conflicto entre esta propuesta y
> `docs/Repaso Primer Parcial.pdf`, vale el PDF.

## Why

El repositorio no tiene ninguna pantalla implementada (estado verificado:
solo existen `docs/Repaso Primer Parcial.pdf`, `PROMPT1.md` y `.git/`; no hay
`index.html`, ni carpetas CSS/JS, ni README). El Ejercicio 1 exige la
estructura HTML completa de las 5 vistas de la librería como base de todo el
TPI, y sin esa especificación no se puede planificar ni implementar nada de
las Etapas 1–2. Este change define ese contrato estructural.

## What Changes

- Se especifica (sin implementar) la estructura HTML de las 5 vistas:
  Catálogo, Libros, Clientes, Ventas e Historial, en modo **multi-página**
  (decidido): `index.html` como entrada + un HTML por vista (`catalogo.html`,
  `libros.html`, `clientes.html`, `ventas.html`, `historial.html`), con el
  mismo `nav` repetido idéntico en cada archivo.
- Se especifican semántica (`header`/`nav`/`main`/`section`/`article`/`footer`),
  formularios con `label for` + `id`, tablas con `thead`/`th scope`, botones con
  texto de acción y contenedores de estado en el DOM con `id` estable y
  `aria-live="polite"` donde corresponda.
- Se especifican datos estáticos de ejemplo hardcodeados (3 libros —uno con
  «Sin clasificar»—, 2 clientes, 2 ventas), marcados como ejemplos, no datos
  reales.
- Se especifican ganchos estables (`id` formato `vista-elemento`, `name`,
  `data-*`) para que los Ej. 3–5 usen el HTML sin modificarlo.
- No se crea `tasks.md`, no se escribe `index.html` ni ningún código producto.

## Capabilities

### New Capabilities

- `catalogo`: vista Catálogo — título de la librería, buscador por título y
  listado de libros con sus 6 datos + navegación global desde `index.html`.
- `libros`: vista Libros — formulario de alta (título, ISBN, precio, editorial,
  género, autores) + tabla de registrados.
- `clientes`: vista Clientes — formulario de alta (nombre completo, email) +
  tabla de registrados.
- `ventas`: vista Ventas — selección de cliente, renglones (libro + cantidad +
  agregar/quitar) y resumen con total + confirmación.
- `historial`: vista Historial — tabla de ventas (identificador, fecha, cliente,
  total) con columna «Detalle» (enlace por venta) + sección aparte de detalle
  por venta con tabla de renglones.

### Modified Capabilities

- Ninguna (inventario de specs verificado vacío: `openspec list --specs`
  devuelve `[]`; no hay capabilities existentes que modificar).

## Impact

- Archivos futuros afectados (solo especificados, no creados): `index.html`
  como entrada + 5 HTML por vista (`catalogo.html`, `libros.html`,
  `clientes.html`, `ventas.html`, `historial.html`) con `nav` repetido
  idéntico; carpetas locales `css/`, `js/`, `assets/` mínimas o con
  placeholder en este change.
- Sin impacto en APIs, dependencias o sistemas: prohibidos por alcance
  (sin npm, sin servidor, sin backend, sin CDNs).
- Los Ej. 3–5 consumirán los `id`/`name`/`data-*` aquí especificados; cambiarlos
  después requeriría enmendar esta especificación.

---

## 1. Problema, objetivo y resultado esperado

**Problema (hecho verificado):** el repo está vacío de producto —solo PDF de
consigna + `PROMPT1.md`— y el Ejercicio 1 (20 puntos: vistas y navegación 10 +
semántica/formularios/estados 10, según PDF p. 7) es la base sobre la que se
montan los Ej. 2–6. Sin SPEC aprobado no hay PLAN ni implementación autorizada.

**Objetivo:** especificar por completo la estructura HTML de las 5 vistas del
Ejercicio 1 con navegación, semántica, formularios, tablas y estados/mensajes
en el DOM, usando datos estáticos de ejemplo.

**Resultado esperado de esta fase:** este `proposal.md` + 5 delta specs
(`specs/catalogo|libros|clientes|ventas|historial/spec.md`) listos para revisión
del usuario. Quedan expresamente fuera de esta fase `tasks.md` (Fase 2) y
cualquier código (Fase 3).

## 2. Contexto verificado y referencias a fuentes

Fuentes efectivamente leídas en esta sesión:

- `docs/Repaso Primer Parcial.pdf` (7 páginas, texto extraído y leído
  íntegramente; norma: si hay conflicto, vale el PDF):
  - p. 1 — «Contexto y alcance»: librería que presenta su catálogo y registra
    libros, clientes y ventas; **exclusivamente el frontend**, datos y
    operaciones simulados en el navegador; solo HTML/CSS/JS nativos; **sin
    librerías, frameworks ni CDNs**; sin API/BD/servidor/backend; sin login
    real; datos ficticios; la venta registra cantidades y precios para un total
    simulado, **sin stock, cobros ni facturación**. «Organización del trabajo»
    Etapa 1: pantallas del Ej. 1 + presentación del Ej. 2 con ejemplos
    estáticos; controles pendientes identificados como maqueta.
  - p. 2 — «Ejercicio 1 · 1. Estructura y pantallas HTML»: `index.html` como
    entrada; **multi-página o secciones de una misma página con navegación
    clara**; Catálogo (título librería, buscador por título, listado con
    título/ISBN/editorial/género/autores/precio; sin género = «Sin
    clasificar»); Libros (alta + listado); Clientes (alta + listado); Ventas
    (cliente + renglones + resumen); Historial (ventas + detalles);
    encabezado/navegación/contenido principal semánticos; cada campo con
    etiqueta; botones descriptivos; tablas con encabezados; **mensajes de
    listas vacías, búsquedas sin resultados y operaciones correctas o
    rechazadas**; listados e historial con datos estáticos en la Etapa 1; la
    estructura contempla campos y estados que luego usa JavaScript.
  - p. 7 — «Criterios de evaluación»: Ej. 1 HTML 20 = vistas y navegación 10 +
    semántica, formularios y estados 10. «Formato de entrega»: carpeta con
    `index.html` (+ demás HTML), carpetas CSS/JS/recursos locales y README.md;
    sin dependencias ni build. En avance de Etapa 1 se identifica qué es
    maqueta y qué interacción ya funciona.
- `PROMPT1.md` (155 líneas, leído íntegramente): define R-01..R-10, CA-01..CA-06,
  inclusiones/exclusiones, convenciones (`id` formato `vista-elemento`,
  indentación 2 espacios, minúsculas, `aria-live`) y las 3 decisiones abiertas.
- Estado del repo verificado por listado de directorio + `git`: solo
  `docs/Repaso Primer Parcial.pdf`, `PROMPT1.md`, `.git/` (más `openspec/`
  creado por CLI en esta sesión). **Hecho verificado:** no existe `index.html`,
  ni `css/`/`js/`/`assets/`, ni README, ni código alguno del Ejercicio 1.

**Supuestos explícitos (no hechos):** el nombre de la librería, los valores
concretos de editoriales/géneros/autores/precios de ejemplo y los textos
exactos de mensajes son propuestas marcadas como ejemplos, no datos del PDF.

## 3. Alcance incluido y exclusiones explícitas

### Incluido

- Entrada `index.html` + navegación clara entre Catálogo, Libros, Clientes,
  Ventas, Historial (multi-página decidido: un HTML por vista + `nav` repetido
  idéntico en cada archivo).
- Catálogo: título de la librería, buscador por título, listado con título,
  ISBN, editorial, género, autores y precio por libro; al menos un ejemplo
  «Sin clasificar».
- Libros: formulario de alta (título, ISBN, precio, editorial, género, autores)
  + tabla de registrados.
- Clientes: formulario de alta (nombre completo, email) + tabla de registrados.
- Ventas: `select` de cliente, renglones (libro + cantidad + agregar/quitar) y
  resumen con total + confirmación.
- Historial: tabla de ventas (identificador, fecha, cliente, total) + acceso a
  detalle/renglones.
- Semántica completa, `label for` + `id`, `thead`/`th scope`, botones con texto
  de acción, contenedores de estado con `id` estable + `aria-live`.
- Datos estáticos de ejemplo y ganchos `id`/`name`/`data-*` documentados.

### Exclusiones explícitas (no especificar en detalle ni implementar)

- Ej. 2 (CSS definitivo, Flexbox/Grid, responsive, foco visible), Ej. 3
  (arrays/objetos, render, filtro JS), Ej. 4 (validaciones, `preventDefault`,
  duplicados), Ej. 5 (subtotal/total, precio histórico, confirmación lógica),
  Ej. 6 (`localStorage`, casos manuales, README definitivo).
- Editar/eliminar registros, gestión de stock, cobros, facturación,
  editoriales/géneros/autores administrables, backend/API/login real, CDNs y
  frameworks.
- Si se detecta una necesidad fuera de alcance, se registra como propuesta
  pendiente; no se implementa sin autorización.

## 4. Requisitos (R-01..R-10) con escenarios observables y casos límite

> Los escenarios usan comportamiento DOM observable con apertura directa de
> `index.html` (doble clic, sin servidor). Los delta specs en `specs/` son la
> versión normativa testable; aquí el resumen vinculado.

- **R-01 Navegación** — Desde `index.html` se alcanza cada una de las 5 vistas
  mediante `nav` con enlaces visibles y `href` válido (multi-página:
  `catalogo.html`, `libros.html`, `clientes.html`, `ventas.html`,
  `historial.html`; el `nav` se repite idéntico en cada archivo).
  Escenario: abrir `index.html`, activar cada enlace del `nav` → se abre el
  HTML de la vista correspondiente. Límite: sin JS; el `href` debe coincidir
  con un archivo existente.
- **R-02 Catálogo** — `h1/h2` con título de la librería; buscador (`label` +
  `input[type=search]` + botones «Buscar por título»/«Limpiar búsqueda»);
  cada libro expone título, ISBN, editorial, género, autores y precio; al menos
  un ejemplo muestra «Sin clasificar».
  Escenario: inspeccionar el DOM → cada libro tiene los 6 datos y existe un
  «Sin clasificar» literal. Límite: libro con varios autores (lista legible) y
  libro sin género (literal exacto, no celda vacía).
- **R-03 Libros** — Formulario con título, ISBN, precio, editorial (`select`),
  género (`select` con «Sin clasificar») y autores (grupo de checkboxes dentro
  de `<fieldset><legend>Autores</legend>`, cada uno con `id`
  `libros-autor-<id>` y su `label` asociado), cada campo con `label`; tabla
  con `thead` (Título, ISBN, Editorial, Género, Autores, Precio).
  Escenario: recorrer el formulario solo con lectura del DOM → todo control
  tiene `label for` válido y los checkboxes comparten `name="autores"`.
  Límite: al menos un checkbox de ejemplo marcado.
- **R-04 Clientes** — Formulario con nombre completo y email (ambos con
  `label`); tabla (Nombre completo, Email) con `thead`.
  Escenario: verificar `label`↔`id` en ambos campos y columnas exactas.
  Límite: sin campo de apellido separado (PDF p. 4: no se requiere).
- **R-05 Ventas** — `select` de cliente con `label`; controles de renglón
  (libro + cantidad + «Agregar renglón»); tabla (Libro, Cantidad, Precio
  unitario, Subtotal, Acciones quitar/cambiar); resumen con total + «Confirmar
  venta».
  Escenario: con datos de ejemplo, la tabla de renglones y el resumen son
  inspeccionables en el DOM. Límite: venta sin renglones (resumen en cero /
  mensaje, sin confirmación lógica —la lógica es del Ej. 5, excluida).
- **R-06 Historial** — Tabla con `thead` (Identificador, Fecha, Cliente, Total)
  y columna «Detalle» con enlace por venta a `#historial-detalle-<id>`; debajo
  de la tabla, una `section#historial-detalle-<id>` por venta con `h3`
  «Detalle <ID>», tabla de renglones (Libro, Cantidad, Precio unitario,
  Subtotal) y enlace «Volver al listado» a `#historial-tabla`.
  Escenario: activar el enlace «Ver detalle» de una venta → su sección de
  detalle con renglones queda visible. Límite: historial vacío (mensaje de
  lista vacía, R-07).
- **R-07 Datos y estados** — Cada vista incluye en el DOM: lista vacía,
  búsqueda sin resultados (catálogo), operación correcta y operación rechazada
  (altas y venta), con `id` estable y `aria-live="polite"` donde corresponda;
  vacíos por defecto o con texto de ejemplo claramente marcado.
  Escenario: con contenido presente, los mensajes existen en el DOM aunque
  estén ocultos/vacíos. Límite: distinguir «vacío real» de «ejemplo visible» —
  ver §6.
- **R-08 Calidad** — Todo `input`/`select` con `label for`; todo `button` con
  texto de acción; toda `table` con `thead` + `th scope`; `header/nav/main/
  footer` y jerarquía de encabezados sin saltos.
  Escenario: inspección manual completa (CA-05). Límite: `th scope` correcto
  (`col` en encabezados de columna).
- **R-09 Convenciones** — `index.html` como entrada + 5 HTML por vista
  (`catalogo.html`, `libros.html`, `clientes.html`, `ventas.html`,
  `historial.html`) con `nav` repetido idéntico; `css/`, `js/`, `assets/`
  mínimas o con placeholder; minúsculas con guiones; `id` formato
  `vista-elemento` (ej. `catalogo-buscador`).
  Escenario: validar nombres e ids contra el patrón. Límite: carpetas vacías
  llevan placeholder porque algunas herramientas/servidores ignoran carpetas
  vacías.
- **R-10 Preparación futura** — Campos, selects y mensajes llevan
  `id`/`name`/`data-*` estables documentados (ej. `data-libro-id`,
  `venta-renglones`, `historial-detalle-<id>`); sin comportamiento JS.
  Escenario: el diccionario de ganchos del §5 cubre todo lo que los Ej. 3–5
  necesitan sin cambiar el HTML. Límite: ningún `id` puede repetirse dentro de
  un mismo documento HTML (en multi-página, los `id` solo deben ser únicos por
  archivo).

## 5. Estructura y componentes propuestos por vista

Decisión tomada (cerrada en §9): **multi-página** — `index.html` como entrada
(+ redirección implícita por el enlace del `nav`) y un HTML por vista
(`catalogo.html`, `libros.html`, `clientes.html`, `ventas.html`,
`historial.html`), cada uno con `header` (título + `nav` con 5 enlaces
repetidos idénticos en todos los archivos), `main` con la `section` de la
vista y `footer`.

- **Catálogo** (`catalogo.html`): `h2` «Catálogo»; formulario
  `catalogo-buscador` (`label for=catalogo-titulo` + `input#catalogo-titulo
  [type=search]` + `button` «Buscar por título» + `button` «Limpiar búsqueda»);
  contenedor `catalogo-lista` con 3 `article` de ejemplo (cada uno con título,
  ISBN, editorial, género, autores, precio; uno con género «Sin clasificar»);
  `data-libro-id` por libro; mensajes `catalogo-vacio` y
  `catalogo-sin-resultados` con `aria-live="polite"`.
- **Libros** (`libros.html`): `form#libros-form` con
  `libros-titulo` (text), `libros-isbn` (text), `libros-precio` (number),
  `libros-editorial` (`select`), `libros-genero` (`select` con opción «Sin
  clasificar»), y autores como `<fieldset>` con `<legend>Autores</legend>` y un
  `input[type=checkbox] name="autores"` por autor, cada uno con `id`
  `libros-autor-<id>` y su `label` asociado (al menos uno marcado de ejemplo);
  `button` «Registrar libro»; tabla `libros-tabla` (`thead`: Título, ISBN,
  Editorial, Género, Autores, Precio) con filas de ejemplo;
  `libros-vacio`, `libros-mensaje-ok`, `libros-mensaje-error` (`aria-live`).
- **Clientes** (`clientes.html`): `form#clientes-form` con
  `clientes-nombre` (text) y `clientes-email` (email); `button` «Registrar
  cliente»; tabla `clientes-tabla` (`thead`: Nombre completo, Email) con 2
  filas de ejemplo; `clientes-vacio`, `clientes-mensaje-ok`,
  `clientes-mensaje-error` (`aria-live`).
- **Ventas** (`ventas.html`): `label` + `select#ventas-cliente`;
  `select#ventas-libro` + `input#ventas-cantidad` (number) + `button` «Agregar
  renglón»; tabla `venta-renglones` (`thead`: Libro, Cantidad, Precio unitario,
  Subtotal, Acciones) con renglón de ejemplo (`data-libro-id`,
  `data-cantidad`); bloque `ventas-resumen` con `ventas-total` + `button`
  «Confirmar venta»; `ventas-mensaje-ok`, `ventas-mensaje-error` (`aria-live`).
- **Historial** (`historial.html`): tabla `historial-tabla` (`thead`:
  Identificador, Fecha, Cliente, Total, Detalle) con 2 ventas de ejemplo; cada
  fila incluye en la columna «Detalle» un enlace
  `<a href="#historial-detalle-<id>">Ver detalle</a>`; debajo de la tabla, una
  `section#historial-detalle-<id>` por venta con `h3` «Detalle <ID>», tabla de
  renglones (Libro, Cantidad, Precio unitario, Subtotal) y enlace
  `<a href="#historial-tabla">Volver al listado</a>`;
  `historial-vacio` (`aria-live`).

Datos de ejemplo (marcados como ejemplos en el HTML con comentarios y/o texto
«Datos de ejemplo»): 3 libros (uno con género asignado, uno «Sin clasificar»;
campos: título, ISBN, editorial, autores, precio), 2 clientes (nombre, email),
2 ventas (identificador, fecha, cliente, renglones, total). Valores concretos:
{{DATO_PENDIENTE: nombre de la librería y valores de ejemplo de
editoriales/géneros/autores/precios}} — default propuesto: librería
«El Tintero» (ejemplo), editoriales/autores ficticios en español.

## 6. Estados y manejo de errores

Sin lógica JS (excluida), todos los estados existen como contenedores en el DOM:

| Estado | Contenedores (`id`) | Regla |
| --- | --- | --- |
| Lista vacía | `catalogo-vacio`, `libros-vacio`, `clientes-vacio`, `historial-vacio` | Presentes en el DOM; ocultos o vacíos cuando hay ejemplos; `aria-live="polite"` |
| Búsqueda sin resultados | `catalogo-sin-resultados` | En el DOM con `aria-live="polite"`; texto de ejemplo marcado |
| Operación correcta | `libros-mensaje-ok`, `clientes-mensaje-ok`, `ventas-mensaje-ok` | `aria-live="polite"`, vacíos por defecto |
| Operación rechazada | `libros-mensaje-error`, `clientes-mensaje-error`, `ventas-mensaje-error` | `aria-live="polite"`, vacíos por defecto; el texto nunca depende solo del color (preparación Ej. 2) |

**Manejo de errores en esta fase (solo estructura):** los mensajes de error
existen como contenedores direccionables; no se implementa validación,
`preventDefault`, ni visualización condicional (Ej. 3–4, excluidos). Los textos
de ejemplo —si se incluyen— llevan marca visible «(ejemplo)» para no
confundirlos con estados reales.

## 7. Restricciones técnicas y convenciones

- HTML5 semántico nativo únicamente; atributos en minúsculas; indentación de
  2 espacios (PROMPT1 Fase 3, anticipado como convención de SPEC para no
  reescribir).
- `id` en formato `vista-elemento` (ej. `catalogo-buscador`,
  `libros-mensaje`); nombres de archivo en minúsculas con guiones.
- `label for` ↔ `id` en cada campo; `thead` + `th scope="col"`; botones con
  texto de acción (verbo + objeto: «Registrar libro», «Confirmar venta»).
- `aria-live="polite"` en zonas de mensajes para preparación futura.
- Datos estáticos hardcodeados; apertura directa con doble clic, sin npm, sin
  build, sin servidor; ningún recurso externo (sin CDNs).
- Tablas: si una necesita más espacio, el desplazamiento será dentro de su
  contenedor (nota para Ej. 2; en este change solo se prevé el contenedor).

## 8. Criterios de aceptación (CA-01..CA-06)

- [ ] **CA-01** — Las 5 vistas son alcanzables desde el `nav` de `index.html`
  y cada una muestra su contenido esperado (R-01 a R-06).
- [ ] **CA-02** — Catálogo muestra por libro título, ISBN, editorial, género,
  autores y precio, con al menos un caso «Sin clasificar» y buscador
  etiquetado (R-02).
- [ ] **CA-03** — Formularios de Libros y Clientes tienen todos sus campos con
  `label`, tablas con `thead`/`th`, y Ventas/Historial tienen los controles y
  columnas exigidos (R-03 a R-06).
- [ ] **CA-04** — Existen contenedores de lista vacía, búsqueda sin resultados
  y mensajes de operación correcta/rechazada con `id` estable (R-07).
- [ ] **CA-05** — Inspección manual: cada `input`/`select` tiene `label`, cada
  tabla tiene `th`, hay `header/nav/main/footer` y los botones describen su
  acción (R-08).
- [ ] **CA-06** — Apertura directa de `index.html` sin servidor ni npm muestra
  las 5 vistas navegables y los ejemplos estáticos (entorno).
- [ ] Se cubre todo el alcance aprobado y no se incorpora trabajo excluido.
- [ ] Se respetan tecnologías, dependencias y convenciones permitidas.
- [ ] Las comprobaciones se ejecutarán en Fase 3 y sus resultados se informarán
  con evidencia; **ningún control se presenta como aprobado sin ejecutarse**.
- [ ] Supuestos, placeholders pendientes y limitaciones quedan identificados
  (§9).

## 9. Supuestos, información pendiente y decisiones que requieren respuesta

### Supuestos declarados

1. Los valores de ejemplo (nombres, ISBN, precios, fechas) son ficticios y se
   marcarán como ejemplos en el HTML y en los specs.
2. En multi-página, el `nav` se repite idéntico en cada archivo; los `id` solo
   deben ser únicos dentro de cada documento.
3. Las carpetas `css/`, `js/`, `assets/` quedarán mínimas o con placeholder en
   este change (el Formato de entrega del PDF p. 7 las contempla para la
   entrega completa).

### Información pendiente (`{{DATO_PENDIENTE:...}}`)

- {{DATO_PENDIENTE: nombre de la librería para el título del catálogo}} —
  default propuesto: «El Tintero» (ejemplo, reemplazable).
- {{DATO_PENDIENTE: valores de ejemplo de editoriales, géneros, autores,
  precios, emails y fechas}} — default propuesto: 2 editoriales ficticias, 1–2
  géneros + «Sin clasificar», 3 autores ficticios, precios con 2 decimales.

### Decisiones cerradas con estas definiciones

- **Multi-página (cerrado):** `index.html` como entrada + un HTML por vista
  (`catalogo.html`, `libros.html`, `clientes.html`, `ventas.html`,
  `historial.html`), con `nav` repetido idéntico en cada archivo.
- **Autores en Libros (cerrado):** grupo de checkboxes dentro de
  `<fieldset><legend>Autores</legend>`, cada autor con
  `input[type=checkbox] name="autores"`, `id` `libros-autor-<id>` y su `label`
  asociado; al menos un ejemplo marcado.
- **Detalle de venta en Historial (cerrado):** sección aparte por venta —
  debajo de `historial-tabla`, una `section#historial-detalle-<id>` con
  `<h3>Detalle <ID></h3>`, tabla de renglones (Libro, Cantidad, Precio
  unitario, Subtotal) y enlace «Volver al listado» a `#historial-tabla`; en la
  tabla de ventas, columna «Detalle» con enlace a `#historial-detalle-<id>`.

### Preguntas concretas para el usuario (cerradas con estas decisiones)

1. **Q1 — Estructura de página:** multi-página (un HTML por vista + `nav`
   repetido idéntico) — **decidido**.
2. **Q2 — Selector de autores:** checkboxes en `<fieldset>/<legend>`, `name`
   `autores`, `id` `libros-autor-<id>` — **decidido**.
3. **Q3 — Detalle de venta en Historial:** sección aparte por venta
   (`section#historial-detalle-<id>`) con enlace en la tabla y «Volver al
   listado» — **decidido**.

> Los valores de ejemplo restantes (§ Información pendiente) se aplican como
> propuesta sin implementar, y la aprobación final de la SPEC queda registrada
> en Fase 2/3.
