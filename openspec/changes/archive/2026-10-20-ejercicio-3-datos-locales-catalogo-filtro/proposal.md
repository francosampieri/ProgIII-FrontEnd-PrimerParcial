# Proposal — ejercicio-3-datos-locales-catalogo-filtro

> Fase: SPEC ONLY (Fase 1 de PROMPT3). No incluye `tasks.md` (Fase 2 — PLAN)
> ni implementación (Fase 3). No se escribe código ni se modifican
> `catalogo.html`, `css/` ni `js/`.
> Norma de precedencia: ante cualquier conflicto entre esta propuesta y
> `docs/Repaso Primer Parcial.pdf`, vale el PDF, salvo las **decisiones
> explícitas del usuario** registradas en §9 (en particular, el uso de obras
> reales con ISBN de ejemplo en lugar de datos enteramente ficticios), que
> prevalecen por instrucción directa.

## Why

Las 5 vistas ya tienen estructura HTML (Ej. 1) y presentación CSS (Ej. 2), pero
el catálogo sigue siendo una maqueta: `js/` solo contiene `.gitkeep`, ningún
HTML tiene `<script>` y las 3 tarjetas de `#catalogo-lista` están hardcodeadas.
Sin un modelo de datos en memoria ni renderizado dinámico no hay filtro real,
no existen estados controlados y los Ej. 4–6 no tienen de dónde leer libros,
editoriales, géneros, autores ni clientes. Este change define ese contrato
(Ej. 3: modelo y ejemplos 5 + renderizado 5 + filtro y estados 5, PDF p. 7).

## What Changes

- Se especifica (sin implementar) el **modelo de datos local en memoria** con 5
  entidades (`libros`, `editoriales`, `generos`, `autores`, `clientes`), ids
  numéricos estables y relaciones por id (R-01, R-02).
- Se especifican **datos de ejemplo** (6 libros, 3 editoriales, 3 géneros,
  5 autores, 3 clientes), conservando los 3 libros actuales del catálogo. Los
  6 libros son obras reales (autor/editorial reales); los ISBN de los libros
  4–6 son placeholders `978-84-0000-…` y los precios son valores de ejemplo
  (R-01). Decisión explícita del usuario, ver §9.
- Se especifica una **comprobación de integridad referencial** ejecutable que
  informa errores sin romper la vista (R-02).
- Se especifica el **renderizado dinámico** del catálogo desde el array de
  libros, reutilizando `.grilla-tarjetas`, `.card`, `.libro-tarjeta` y
  `data-libro-id`, con los 6 datos por tarjeta (R-03).
- Se especifica el **filtro por título** (parcial, sin distinguir
  mayúsculas/minúsculas, `trim`), aplicado **solo al enviar el formulario**
  (no en vivo con `input`), y los **estados** vacío / sin resultados /
  restauración, alternando `hidden` y respetando `aria-live` (R-04, R-05).
- Se especifican los **eventos** `submit` con `preventDefault` y `reset` con
  restauración del catálogo; Enter y el botón «Buscar por título» recorren el
  mismo camino (R-06).
- Se especifica la **inserción segura** con `textContent`/`createElement` y la
  prohibición de `innerHTML` con datos (R-07).
- Se documenta la **interfaz pública mínima** reutilizable por los Ej. 4–6
  (R-09) y las 5 decisiones de diseño ya **cerradas por el usuario** (§9), sin
  implementarlo.
- Edición futura mínima de producto (solo especificada): retirar las 3
  tarjetas estáticas de `catalogo.html` y agregar 2 `<script defer>` al final
  del `body`; crear `js/data.js` y `js/catalogo.js`. CSS sin cambios.

## Capabilities

### New Capabilities

- `datos-locales`: modelo de datos local en memoria de las 5 entidades, ids
  estables, relaciones por id, datos de ejemplo, comprobación de integridad
  referencial e interfaz pública de consulta reutilizable por los Ej. 4–6
  (cubre R-01, R-02, R-09).

### Modified Capabilities

- `catalogo`: el catálogo deja de ser markup estático. Cambian el requisito de
  contenido (renderizado desde el modelo), el de estados (pasan a ser
  controlados por JavaScript) y el de calidad/convenciones (se incorpora
  comportamiento JS externo, eventos y filtro). Se agregan requisitos de
  renderizado, filtro, eventos y seguridad de inserción (cubre R-03..R-08).

## Impact

- Archivos de producto afectados en Fase 3 (solo especificados ahora):
  `catalogo.html` (retiro del markup estático del catálogo + 2 `<script defer>`),
  `js/data.js` y `js/catalogo.js` nuevos. No se toca `css/styles.css`.
- Capabilities existentes `libros`, `clientes`, `ventas`, `historial`,
  `identidad-visual`, `diseno-adaptable`, `accesibilidad-basica` no cambian sus
  requisitos en este change. El modelo de clientes queda disponible para el
  Ej. 4 sin modificar esas vistas.
- Sin impacto en APIs, dependencias, backend ni build: prohibidos por alcance
  (sin npm, sin servidor, sin `fetch`, sin `localStorage`, sin librerías, sin
  módulos ES).
- Los `id`, clases y `data-*` del Ej. 1 se conservan; solo se retira el markup
  estático del catálogo y se agregan scripts.

---

## 1. Problema, objetivo y resultado esperado

**Problema (hecho verificado):** el catálogo del repo es una maqueta estática.
`catalogo.html` contiene 3 `article.libro-tarjeta` hardcodeados con
`data-libro-id` 1–3; `js/` solo tiene `.gitkeep`; ningún HTML incluye
`<script>`. Por lo tanto no hay modelo de datos, no hay renderizado desde datos,
el formulario de búsqueda no hace nada y los estados `hidden` nunca se
controlan. El Ejercicio 3 (15 puntos: modelo y ejemplos 5, renderizado 5, filtro
y estados 5, PDF p. 7) es requisito de la Etapa 2 y base de los Ej. 4–6.

**Objetivo:** especificar el modelo local de las 5 entidades, su comprobación de
integridad y el renderizado dinámico del catálogo con filtro por título,
incluyendo estados de catálogo vacío y búsqueda sin resultados, en JavaScript
nativo apto para `file://`.

**Resultado esperado de esta fase:** este `proposal.md` + 2 delta specs
(`specs/datos-locales/spec.md` nueva y `specs/catalogo/spec.md` modificada)
listos para revisión. Quedan fuera de esta fase `tasks.md` (Fase 2 — PLAN) y
cualquier código (Fase 3).

## 2. Contexto verificado y referencias concretas

### Fuentes leídas en esta sesión

- `docs/prompts/PROMPT3.md` (leído íntegramente): requisito completo del
  Ejercicio 3 — R-01..R-09, CA-01..CA-07, alcance incluido/excluido,
  restricciones anti-alucinación y las 5 decisiones de diseño del prompt (ya
  cerradas por el usuario, ver §9).
- `docs/Repaso Primer Parcial.pdf` (7 páginas, extraído con `pdftotext -layout`
  y leído íntegramente; norma: si hay conflicto, vale el PDF):
  - **p. 3 — «Ejercicio 3 · 3. Datos locales, catálogo y filtro»** (texto
    extraído, resumido): libros, editoriales, géneros, autores y clientes como
    arrays/objetos con **identificadores estables**; mínimo **6 libros, 2
    editoriales, 2 géneros, 3 autores, 3 clientes ficticios**; cada libro se
    relaciona con **una editorial existente y uno o más autores existentes**;
    el **género es opcional** y, si se asigna, debe existir. JavaScript genera
    el catálogo desde el array de libros; el filtro por título **ignora
    mayúsculas/minúsculas, busca coincidencias parciales y elimina espacios en
    los extremos**; búsqueda vacía = todo el catálogo; sin coincidencias =
    mensaje claro. Eventos y funciones con responsabilidades reconocibles; los
    datos de usuario se insertan **como texto** en el DOM; **no se requiere
    `fetch`** ni administrar editoriales/géneros/autores.
  - **p. 1 — «Contexto y alcance»**: frontend simulado en navegador; solo
    HTML/CSS/JS nativos; **sin librerías, frameworks ni CDNs**; sin
    API/BD/servidor/backend; datos ficticios; sin stock, cobros ni facturación.
    **«Organización del trabajo» Etapa 2**: se conectan las pantallas con datos
    locales y se completan los ejercicios 3 a 6.
  - **p. 7 — «Criterios de evaluación»**: **3. Datos y catálogo: 15 puntos =
    modelo y ejemplos 5 + renderizado 5 + filtro y estados 5**. Se valora código
    legible, nombres comprensibles, funciones acotadas y **separación entre
    estructura, estilos y comportamiento**. **«Formato de entrega»**: carpeta
    con HTML, carpetas de CSS/JavaScript/recursos y README.md; sin dependencias
    ni build.
- Convenciones de changes previos: `openspec/changes/archive/2026-10-19-ejercicio-1-estructura-pantallas-html/proposal.md`
  y `.../2026-10-19-ejercicio-2-presentacion-css-adaptable/proposal.md` + sus
  specs; `openspec/specs/catalogo/spec.md` (capability existente que este change
  modifica).
- `openspec/config.yaml`: artefactos en español, headings estructurales de
  OpenSpec y keywords `SHALL`/`MUST` en inglés.

### Estado real del producto verificado (inspección directa)

- **Hecho verificado:** `js/` contiene únicamente `.gitkeep` (0 bytes).
- **Hecho verificado:** `grep` de `<script`, `localStorage` y `type="module"`
  sobre los `*.html` no devuelve coincidencias: no hay JavaScript embebido ni
  etiquetas `<script>` en ningún HTML.
- **Hecho verificado:** no existe `README.md` en la raíz.
- **Hecho verificado:** `catalogo.html` contiene exactamente 3
  `article.card.libro-tarjeta` dentro de `#catalogo-lista.grilla-tarjetas`, con
  `data-libro-id` 1, 2 y 3; editoriales Sudamericana, Losada y Emecé; géneros
  Novela, Antología y el literal `Sin clasificar`; precios `$18.500`, `$21.400`
  y `$15.900`; el segundo libro lista 3 autores.
- **Hecho verificado:** existen `form#catalogo-buscador`,
  `input#catalogo-titulo[type=search][name=titulo]`, botones «Buscar por
  título» (`type=submit`) y «Limpiar búsqueda» (`type=reset`), y los
  contenedores `#catalogo-vacio`, `#catalogo-sin-resultados` (ambos
  `aria-live="polite"` y `hidden`) y `#catalogo-lista`.
- **Hecho verificado:** `css/styles.css` ya define `.grilla-tarjetas` (Grid),
  `.card`, `.libro-tarjeta`, `.mensaje*` y las clases de botones; el catálogo
  ya las usa. **No se requiere CSS nuevo** para este change.
- **Hecho verificado:** `clientes.html` tiene 2 filas estáticas (Ana Pérez,
  Bruno Díaz) con emails `@example.com`; se reutilizan como ejemplos del modelo.
- **Diferencia detectada respecto de PROMPT3:** ninguna contradicción de
  estado. Precisiones: (a) PROMPT3 dice «3 tarjetas … editoriales Sudamericana,
  Losada y Emecé», pero el PDF solo exige **2 editoriales**; se conservan las 3
  por coherencia con el catálogo actual. (b) PROMPT3 pide «6 libros ficticios o
  de dominio público» y a la vez «conservar los 3 libros actuales», que son
  obras reales. **Decisión explícita del usuario:** se prioriza la instrucción
  del usuario y se usan 6 obras reales (autor/editorial reales), conservando
  los 3 libros actuales; los ISBN de los libros 4–6 son placeholders de ejemplo
  (`978-84-0000-…`, no verificados bibliográficamente) y los precios son
  valores de ejemplo. No se afirma que el conjunto sea enteramente ficticio
  (§9).

### Supuestos explícitos (no hechos)

- Los libros, autores y editoriales de §5 son **obras y entidades reales**; los
  ISBN de los libros 4–6 son **placeholders inventados/autorizados por el
  usuario** (`978-84-0000-…`) y los precios son **valores de ejemplo**, no
  precios de mercado. No provienen del PDF ni representan stock real.
- Los nombres concretos de funciones/namespace de la interfaz pública son una
  **propuesta** (R-09); el contrato observable es qué consultas existen, no su
  nombre exacto.
- Los literales de los mensajes («No se encontraron…», «Sin clasificar») son
  propuestas salvo «Sin clasificar», que sí exige el PDF.

## 3. Alcance incluido y exclusiones explícitas

### Incluido

- Modelo en memoria con ids estables para `libros`, `editoriales`, `generos`,
  `autores` y `clientes` (R-01).
- Conjunto inicial: 6 libros, 3 editoriales, 3 géneros, 5 autores, 3 clientes
  marcados como datos de ejemplo (R-01).
- Relaciones por id: cada libro referencia una editorial existente, uno o más
  autores existentes y un género existente o `null`; «Sin clasificar» = ausencia
  de género, no un registro del array (R-02).
- Al menos un libro sin género y su render como «Sin clasificar» (R-02, R-03).
- Comprobación de integridad referencial ejecutable que informa sin romper la
  vista (R-02).
- Renderizado del catálogo desde el array de libros, retirando las tarjetas
  estáticas, reutilizando `.grilla-tarjetas`, `.card`, `.libro-tarjeta` y
  `data-libro-id` (R-03).
- Tarjeta con título, ISBN, editorial resuelta, género resuelto o «Sin
  clasificar», autores resueltos y precio formateado (R-03).
- Filtro por título parcial, sin distinguir mayúsculas/minúsculas, con `trim`,
  aplicado **solo en `submit`** del formulario; no se filtra en vivo con `input`
  (R-04).
- Estados de catálogo vacío, sin resultados (con el término) y restauración con
  reset (R-05, R-06).
- `preventDefault` en `submit`, manejo de `reset`, funciones separadas por
  responsabilidad (datos, consulta, filtro, render, mensajes) (R-06).
- Inserción con `textContent`/`createElement`, sin `innerHTML` con datos (R-07).
- Scripts externos clásicos con `defer` en orden de dependencia (R-08).
- Interfaz pública documentada para reutilizar el modelo en Ej. 4–6 sin cambios
  de HTML del catálogo (R-09).

### Excluido

- Ejercicio 4 completo: altas de libros/clientes, validaciones, duplicados,
  generación de opciones de selectores, actualización de listados tras alta.
- Ejercicio 5 completo: composición de venta, renglones, subtotales, total,
  confirmación, precio histórico, historial dinámico.
- Ejercicio 6 completo: `localStorage`/`sessionStorage`/IndexedDB, recuperación,
  casos manuales, README definitivo.
- Renderizado dinámico de Libros, Clientes, Ventas e Historial: siguen siendo
  maquetas estáticas (el modelo de clientes solo queda disponible).
- CRUD o administración de cualquier entidad; edición/eliminación de libros o
  clientes.
- `fetch`/AJAX, API, backend, servidor, frameworks, librerías, CDNs, módulos ES.
- Filtrado en vivo mientras se teclea (`input`): el filtro solo se aplica al
  enviar el formulario. Tampoco se conservan tarjetas estáticas como fallback:
  se eliminan y el catálogo se renderiza siempre desde el modelo.
- Cambios de diseño/CSS, de estructura semántica o de navegación; solo se
  retira el markup estático del catálogo y se agregan `<script>`.
- Tests automatizados y cualquier verificación que requiera servidor o build.

## 4. Requisitos identificados y escenarios observables

> Resumen vinculado; la versión normativa testable está en los delta specs de
> `specs/`. Los escenarios se observan abriendo `catalogo.html` con doble clic
> (`file://`), sin servidor.

- **R-01 Modelo y datos** — 5 arrays con ids estables y los mínimos exigidos.
  Escenario: inspeccionar el modelo → 6/3/3/5/3 registros, ids únicos, datos
  marcados como ejemplo. Límite: ids duplicados o faltantes deben ser
  detectables.
- **R-02 Relaciones e integridad** — cada libro resuelve editorial y autores;
  género existente o `null`; al menos uno `null`; comprobación de integridad
  informa errores sin romper el render. Escenario: ejecutar la comprobación →
  sin errores con los datos de ejemplo; al alterar un `editorialId` en consola
  → informa el error y la vista sigue mostrándose. Límite: `generoId: null` no
  es error.
- **R-03 Renderizado** — al cargar, el catálogo se genera desde el modelo, sin
  tarjetas estáticas duplicadas; cada tarjeta conserva clases y
  `data-libro-id` y muestra los 6 datos. Escenario: contar tarjetas = 6 y
  comparar con el modelo. Límite: libro con 3 autores se lista completo; libro
  sin género muestra «Sin clasificar».
- **R-04 Filtro** — parcial, `toLowerCase` + `trim`, aplicado **al enviar el
  formulario**; vacío/espacios = 6 libros; sin coincidencias = 0 tarjetas +
  mensaje. Escenario: enviar `"  ciEN  "` → «Cien años de soledad». Límite:
  término con espacios internos («cien años») coincide; término con acentos no
  se pliega por requisito (solo se ignoran mayúsculas y espacios extremos).
  Teclear sin enviar no modifica el catálogo.
- **R-05 Estados** — `#catalogo-vacio` (array sin libros),
  `#catalogo-sin-resultados` (con término), restauración al limpiar; `hidden`
  alternado y `aria-live` respetado; nunca dos estados a la vez. Escenario:
  forzar `libros` vacío en consola → solo `catalogo-vacio` visible. Límite:
  búsqueda sin resultados no debe mostrar además «catálogo vacío».
- **R-06 Eventos y responsabilidades** — `submit` con `preventDefault` (Enter y
  botón «Buscar por título» son el mismo camino); `reset` limpia, restaura todo
  y oculta mensajes; funciones acotadas. Escenario: enviar con Enter o con el
  botón → no recarga la página; pulsar «Limpiar búsqueda» → 6 tarjetas y
  campos/mensajes limpios. Límite: limpiar después de una búsqueda sin
  resultados restaura el catálogo; teclear no filtra en vivo.
- **R-07 Calidad y seguridad** — todo dato y el término se insertan como texto;
  sin `innerHTML`/`insertAdjacentHTML`/`eval`/`document.write` con datos; sin
  errores en consola. Escenario: buscar `<b>cien</b>` → se muestra el literal
  escapado como texto y no se crea markup. Límite: no hay errores de consola al
  cargar ni al filtrar.
- **R-08 Convenciones** — archivos externos en `js/`, clásicos, `defer`, orden
  de dependencia; sin inline, sin `type="module"`; kebab-case en archivos/ids,
  camelCase en variables/funciones; ids existentes intactos. Escenario:
  inspeccionar `catalogo.html` y `js/`. Límite: el orden de los `<script>` debe
  garantizar que el modelo exista antes de usarse.
- **R-09 Preparación futura** — el SPEC documenta esquema y una interfaz mínima
  (acceso al modelo + helpers de consulta/render) sin persistencia ni altas.
  Escenario: el contrato de §5 cubre lo que el Ej. 4 necesita para poblar
  selectores y listar clientes sin tocar `catalogo.html`. Límite: no se
  implementan todavía las funciones del Ej. 4.

## 5. Estructura, componentes, interfaces y datos

> Todo lo siguiente es **propuesta consolidada** con las decisiones del usuario
> ya cerradas (§9), no implementación. No se modifican archivos en esta fase.

### 5.1 Organización de archivos JS — decisión cerrada

**Decisión del usuario (D1):** 2 archivos, cargados con `defer` en este orden:

```html
<script defer src="js/data.js"></script>
<script defer src="js/catalogo.js"></script>
```

- `js/data.js`: arrays de las 5 entidades, comprobación de integridad, helpers
  de consulta y de formato de precio. Se carga primero.
- `js/catalogo.js`: filtro, render del catálogo, mensajes y eventos del
  buscador. Consume lo expuesto por `data.js`.

Con `defer`, el orden de ejecución respeta el orden de aparición y el DOM ya
está disponible (no se necesita `DOMContentLoaded`).

### 5.2 Namespace y encapsulamiento

- IIFE + `"use strict"` en cada archivo, exponiendo **un único** global
  `ElTintero` (`window.ElTintero = window.ElTintero || {}`) para no contaminar
  el global. Nombres de funciones en camelCase y en español.
- Separación exigida por R-06: definición de datos (`data.js`) sin lógica de
  render; `catalogo.js` sin datos hardcodeados.

### 5.3 Esquema de las 5 entidades

Tipos: `number`, `string`, `number[]`, `number | null`. Ids numéricos enteros
únicos por entidad, asignados manualmente y estables.

| Entidad | Campo | Tipo | Obligatorio | Regla |
| --- | --- | --- | --- | --- |
| `libros` | `id` | `number` | sí | único, estable |
| | `titulo` | `string` | sí | no vacío |
| | `isbn` | `string` | sí | no vacío; sin validar dígito de control (Ej. 4) |
| | `precio` | `number` | sí | número en pesos, sin símbolo ni separadores (se formatea solo al renderizar) |
| | `editorialId` | `number` | sí | debe existir en `editoriales` |
| | `generoId` | `number \| null` | sí (puede ser `null`) | si no es `null`, debe existir en `generos` |
| | `autoresIds` | `number[]` | sí | al menos 1; cada id debe existir en `autores` |
| `editoriales` | `id` | `number` | sí | único, estable |
| | `nombre` | `string` | sí | no vacío |
| `generos` | `id` | `number` | sí | único, estable |
| | `nombre` | `string` | sí | no vacío; **no** incluye «Sin clasificar» |
| `autores` | `id` | `number` | sí | único, estable |
| | `nombre` | `string` | sí | no vacío |
| `clientes` | `id` | `number` | sí | único, estable |
| | `nombre` | `string` | sí | nombre completo (no se separa apellido) |
| | `email` | `string` | sí | no vacío; validación de formato queda para Ej. 4 |

### 5.4 Datos de ejemplo

> **Decisión explícita del usuario:** los libros son **obras reales** con
> autor/editorial reales. El PDF pide datos ficticios; se prioriza la
> instrucción del usuario (§9). Los ISBN de los libros 4–6 son **placeholders
> de ejemplo** (`978-84-0000-…`) y los precios son **valores de ejemplo**; el
> conjunto no se presenta como enteramente ficticio ni como dato verificado.

**Editoriales (3, reales):**

| id | nombre |
| --- | --- |
| 1 | Sudamericana |
| 2 | Losada |
| 3 | Emecé |

**Géneros (3):**

| id | nombre |
| --- | --- |
| 1 | Novela |
| 2 | Antología |
| 3 | Cuento |

«Sin clasificar» sigue siendo **ausencia de género** (`generoId: null`), **no**
un registro del array `generos`.

**Autores (5, reales):** 1 Gabriel García Márquez, 2 Jorge Luis Borges,
3 Adolfo Bioy Casares, 4 Silvina Ocampo, 5 Julio Cortázar.

**Libros (6, todos obras reales)** — los 3 primeros conservan los valores
actuales del catálogo:

| id | titulo | isbn | precio | editorialId | generoId | autoresIds |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Cien años de soledad | 978-84-376-0494-7 | 18500 | 1 | 1 | [1] |
| 2 | Antología de la literatura fantástica | 978-84-206-3313-2 | 21400 | 2 | 2 | [2, 3, 4] |
| 3 | El Aleph | 978-84-206-3314-9 | 15900 | 3 | `null` | [2] |
| 4 | Rayuela | 978-84-0000-0007-3 | 24500 | 1 | 1 | [5] |
| 5 | La invención de Morel | 978-84-0000-0008-0 | 14300 | 2 | 1 | [3] |
| 6 | El informe de Brodie | 978-84-0000-0009-7 | 19900 | 3 | 3 | [2] |

Notas sobre los datos:

- El libro 3 (`El Aleph`) mantiene `generoId: null` **a propósito** para
  ejercitar el literal «Sin clasificar» (R-02/R-03).
- Los ISBN de los libros 4–6 son **ISBN de ejemplo (no verificado
  bibliográficamente)**, en el bloque `978-84-0000-…` reservado como
  placeholder. **No** son ISBN reales ni datos verificados.
- Los 3 libros nuevos son obras reales (autor/editorial reales); el dato
  inventado es únicamente el ISBN.
- Los precios son **valores de ejemplo en pesos**; no representan precios
  reales de mercado.

**Clientes (3):** 1 Ana Pérez `ana.perez@example.com`; 2 Bruno Díaz
`bruno.diaz@example.com` (los dos de `clientes.html`); 3 Carla Gómez
`carla.gomez@example.com`. Siguen siendo datos de ejemplo, sin cambio.

### 5.5 Formato de precio — decisión cerrada

**Decisión del usuario (D3):** `Intl.NumberFormat('es-AR')` para el número y prefijo
literal `$`, sin decimales, resultado observable `$18.500`. Nota de
implementación a verificar en Fase 3: `Intl.NumberFormat('es-AR', {style:
'currency', currency: 'ARS', maximumFractionDigits: 0})` puede insertar un
espacio entre `$` y el número; el contrato observable es el separador de miles
`.` y la ausencia de decimales, y el literal debe coincidir con el formato
actual (`$18.500`).

### 5.6 Renderizado propuesto de la tarjeta

Por cada libro, un `article.card.libro-tarjeta` con `data-libro-id` y:
`h3` (título), párrafos «ISBN: …», «Editorial: …» (resuelta por id),
«Género: …» (resuelta por id o «Sin clasificar»), «Autores:» + `ul/li` (uno por
autor resuelto) y «Precio: …» (formateado). Se reutilizan las clases existentes;
no se agrega CSS.

### 5.7 Interfaz pública mínima (R-09) — nombres propuestos

Contrato que los Ej. 4–6 podrán consumir sin cambiar el HTML del catálogo:

- `ElTintero.datos`: `{ libros, editoriales, generos, autores, clientes }`
  (arrays mutables en memoria; sin persistencia).
- `ElTintero.consultas.obtenerLibros()` / `obtenerClientes()` → arrays.
- `ElTintero.consultas.buscarEditorialPorId(id)` →
  `{ id, nombre } | undefined`.
- `ElTintero.consultas.buscarGeneroPorId(id)` → `{ id, nombre } | undefined`.
- `ElTintero.consultas.buscarAutoresPorIds(ids)` → array de autores resueltos.
- `ElTintero.consultas.formatearPrecio(precio)` → `string` formateado.
- `ElTintero.consultas.verificarIntegridad()` → `string[]` de errores (vacío si
  todo resuelve) y registro de cada error con `console.error`.
- `ElTintero.catalogo.filtrarLibrosPorTitulo(libros, termino)` → array filtrado.
- `ElTintero.catalogo.renderizarCatalogo(libros)` → actualiza `#catalogo-lista`
  y los mensajes de estado.
- `ElTintero.catalogo.iniciarCatalogo()` → conecta el modelo con el DOM y los
  eventos (llamada al cargar).

Los nombres son propuesta; el requisito normativo es que exista acceso al
modelo + helpers de consulta/render reutilizables.

### 5.8 Cambios mínimos futuros en `catalogo.html`

1. Retirar los 3 `article` estáticos de `#catalogo-lista` (queda el contenedor
   vacío, con las mismas clases).
2. Agregar al final del `body`, en orden:
   `<script defer src="js/data.js"></script>` y
   `<script defer src="js/catalogo.js"></script>`.
3. No se modifica ningún otro HTML, ni CSS, ni `id`/clases/`name` existentes.

## 6. Estados y manejo de errores

| Estado | Contenedor | Regla propuesta |
| --- | --- | --- |
| Normal | `#catalogo-lista` | Muestra las tarjetas del catálogo completo; el filtro se recalcula **solo al enviar** el formulario; ambos mensajes con `hidden` |
| Catálogo vacío | `#catalogo-vacio` | Visible solo si el array de libros está vacío: texto fijado «No hay libros registrados.» (decisión cerrada; ver `design.md` §5), lista sin tarjetas y `#catalogo-sin-resultados` oculto |
| Sin resultados | `#catalogo-sin-resultados` | Visible solo si hay libros pero el filtro devuelve 0; texto fijado `No se encontraron libros para «{término}».` con el término recortado insertado mediante `textContent` (decisión cerrada; ver `design.md` §5), sin tarjetas y `#catalogo-vacio` oculto |
| Restauración | ambos | Al `reset` o con término vacío/espacios: 6 tarjetas, ambos mensajes ocultos |
| Integridad referencial inválida | consola + render | `verificarIntegridad()` devuelve/registra los errores con `console.error`; **no** interrumpe el render. Reemplazos propuestos: género `null` o inexistente → «Sin clasificar»; editorial inexistente → «Editorial no disponible»; autor inexistente → se omite y se informa en consola |

Reglas transversales:

- Exactamente uno de {normal, vacío, sin resultados} visible; nunca dos
  mensajes contradictorios a la vez.
- Visibilidad solo por atributo `hidden` (no se toca el CSS ni `display`).
- Se respeta `aria-live="polite"` ya presente; el texto de los mensajes se
  escribe con `textContent`.
- Si el array de libros se vacía en caliente (consola), `renderizarCatalogo`
  debe mostrar el estado vacío en el siguiente render.
- Teclear en `#catalogo-titulo` **no** cambia el catálogo: el filtro se aplica
  únicamente al `submit`; `reset` limpia y restaura.

## 7. Restricciones técnicas y convenciones

- Apertura directa por `file://` (doble clic), sin npm, build ni servidor:
  prohibido `type="module"`; solo scripts clásicos externos con `defer`.
- JavaScript ES2020+ nativo: `const`/`let`, funciones nombradas y acotadas,
  `"use strict"` + IIFE/namespace para no contaminar el global.
- Sin librerías, frameworks, CDNs, `fetch`/AJAX, API, backend ni módulos ES.
- Sin persistencia: nada de `localStorage`, `sessionStorage` ni IndexedDB.
- Separación estricta: datos en `js/data.js`; DOM/filtro/eventos en
  `js/catalogo.js`; sin lógica de render dentro de la definición de datos.
- Inserción de datos con `textContent`/`createElement`; prohibido
  `innerHTML`/`insertAdjacentHTML`/`eval`/`document.write` con datos de usuario
  o del modelo.
- Nomenclatura: archivos e `id` en kebab-case; variables/funciones en
  camelCase; nombres de dominio en español (`libro`, `editorial`, `genero`,
  `autor`, `cliente`); 2 espacios de indentación.
- Conservar `id` de contenedores existentes (`catalogo-buscador`,
  `catalogo-titulo`, `catalogo-vacio`, `catalogo-sin-resultados`,
  `catalogo-lista`) y clases/`data-libro-id`.
- **Filtro solo por `submit`:** un único listener en `form#catalogo-buscador`
  con `preventDefault()`; Enter y el botón «Buscar por título» son el mismo
  camino. No se agrega listener `input` ni se filtra en vivo. `reset`/«Limpiar
  búsqueda» limpia el campo, restaura el catálogo completo y oculta mensajes.
- Verificación manual en Fase 3 (PDF): doble clic, consola limpia, envío con
  Enter y con «Buscar por título», búsqueda vacía / con espacios / mayúsculas /
  inexistente / limpiar; comprobar que teclear no filtra. Sin tests
  automatizados.

## 8. Criterios de aceptación vinculados a requisitos

- [ ] **CA-01** — Existen las 5 entidades con ids estables y los mínimos
  exigidos (6 libros, 3 editoriales, 3 géneros, 5 autores, 3 clientes); todas
  las referencias de cada libro resuelven y al menos uno tiene `generoId: null`
  (**R-01, R-02**).
- [ ] **CA-02** — El catálogo se renderiza desde el modelo (sin tarjetas
  estáticas duplicadas) y cada tarjeta muestra los 6 datos exigidos, con «Sin
  clasificar» cuando corresponde y clases/`data-libro-id` conservados
  (**R-03**).
- [ ] **CA-03** — Al **enviar el formulario** con `"  ciEN  "` se encuentra
  «Cien años de soledad»; envío vacío o con espacios muestra los 6 libros;
  envío inexistente muestra `#catalogo-sin-resultados` con el término y ninguna
  tarjeta; teclear sin enviar no filtra (**R-04, R-05**).
- [ ] **CA-04** — «Limpiar búsqueda» limpia el campo, restaura el catálogo
  completo y oculta los mensajes; `#catalogo-vacio` se muestra si el array de
  libros está vacío (**R-05, R-06**).
- [ ] **CA-05** — No se usa `innerHTML` con datos; el término buscado y los
  datos se insertan como texto; no hay errores en consola (**R-07**).
- [ ] **CA-06** — La apertura directa por `file://` funciona sin servidor, npm
  ni librerías; los scripts son externos, clásicos y con `defer` (**R-08**).
- [ ] **CA-07** — El SPEC documenta el esquema y la interfaz reutilizable para
  los Ej. 4–6 sin cambios de HTML (**R-09**).
- [ ] Se cubre todo el alcance aprobado y no se incorpora trabajo excluido.
- [ ] Se respetan las tecnologías, dependencias y convenciones permitidas.
- [ ] Las comprobaciones exigidas se ejecutarán en Fase 3 y sus resultados se
  informarán con evidencia; **ningún control se presenta como aprobado sin
  ejecutarse**.
- [ ] Supuestos, placeholders pendientes y limitaciones quedan identificados
  (§9).

## 9. Supuestos, decisiones cerradas e información pendiente

### Decisiones cerradas por el usuario

1. **D1 — Organización de archivos JS:** `js/data.js` + `js/catalogo.js`,
   ambos `defer` y en ese orden. `data.js` define el modelo y los helpers;
   `catalogo.js` contiene filtro, render, mensajes y eventos.
2. **D2 — Momento del filtro (opción A):** solo en `submit` del
   `form#catalogo-buscador`, con `preventDefault()`; Enter y el botón «Buscar
   por título» son el mismo camino. `reset`/«Limpiar búsqueda» limpia el campo,
   restaura el catálogo completo y oculta mensajes. **No** se filtra en vivo con
   `input` (excluido).
3. **D3 — Formato de precio:** sin decimales, `Intl.NumberFormat('es-AR')` con
   separador de miles y prefijo `$`; resultado `$18.500`.
4. **D4 — Tarjetas estáticas de `catalogo.html`:** se eliminan las 3 tarjetas
   hardcodeadas; el catálogo se renderiza siempre desde el modelo (sin fallback
   estático).
5. **D5 — Ids:** numéricos, estables, `1..n` por entidad.

### Decisión explícita sobre los datos (prevalece sobre el PDF)

El PDF pide datos ficticios; el usuario decidió explícitamente usar **obras
reales**. Se prioriza la instrucción del usuario: los 6 libros son obras reales
(autor/editorial reales), se conservan los 3 actuales y se mantiene la marca de
**datos de ejemplo** para los ISBN de los libros 4–6 (`978-84-0000-…`,
placeholders no verificados) y para los precios (valores de ejemplo, no de
mercado). No se afirma que el conjunto sea enteramente ficticio. Esto **no**
queda como riesgo ni pregunta abierta.

### Supuestos declarados

1. Los libros, autores y editoriales de §5.4 son reales; los ISBN de los libros
   4–6 y los precios son datos de ejemplo inventados/autorizados por el usuario.
2. Los 3 libros actuales se conservan porque PROMPT3 lo permite y el catálogo
   ya los muestra (decisión del usuario, ver más arriba).
3. Se usan 3 editoriales (no 2), 3 géneros (no 2) y 5 autores (no 3) porque los
   libros elegidos los requieren; los mínimos del PDF se cumplen por exceso.
4. Los nombres de la interfaz pública (§5.7) y los literales de mensajes son
   propuestas; el contrato observable es su existencia y comportamiento.
5. El filtro no pliega acentos (el PDF solo exige ignorar mayúsculas y
   espacios extremos); «cien» no encontraría «cién».
6. La comprobación de integridad se ejecuta al iniciar y queda disponible como
   función pública; no bloquea el render.

### Información pendiente

No quedan placeholders pendientes. Los literales de los mensajes quedaron
cerrados en `design.md` §5/§9: «No hay libros registrados.» y
`No se encontraron libros para «{término}».` (término recortado, insertado con
`textContent`).

No quedan pendientes sobre D1–D5 ni sobre el uso de obras reales: son
decisiones cerradas.

### Riesgos y límites

1. **Riesgo de formato `Intl`:** el espacio entre `$` y el número varía según
   implementación; se verificará en Fase 3 contra el literal `$18.500`.
2. **Riesgo de alcance:** exponer el modelo públicamente podría tentar a
   implementar altas (Ej. 4) en este change; queda explícitamente excluido.
3. **Decisión no bloqueante:** el literal «Sin clasificar» ya está fijado por el
   PDF y el HTML actual, por lo que no se trata como pendiente.
