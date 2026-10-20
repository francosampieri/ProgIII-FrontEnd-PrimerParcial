# Proposal — ejercicio-4-altas-libros-clientes

> Fase 1 — SPEC cerrada con decisiones del usuario (2026-10-20). Decisiones
> a–k resueltas; no quedan datos pendientes. `design.md` y `tasks.md` se
> generan en la Fase 2 — PLAN.
>
> Fase: **SPEC ONLY** (Fase 1 de `docs/prompts/PROMPT4.md`). Este documento no
> contiene implementación (Fase 3). No se escribe código de producto ni se
> modifican `libros.html`, `clientes.html`, `js/`, `css/` ni ningún otro
> archivo del producto.
> Norma de precedencia: ante cualquier conflicto entre esta propuesta y
> `docs/Repaso Primer Parcial.pdf`, vale el PDF (PROMPT4.md:26), salvo las
> decisiones explícitas del usuario registradas en §9.

## Why

Las vistas Libros y Clientes siguen siendo maquetas: sus formularios no tienen
`<script>`, sus tablas muestran filas estáticas y los selectores de editorial,
género y autores contienen opciones hardcodeadas que no provienen del modelo.
El Ejercicio 4 (15 puntos: Libros y selectores 6 + Clientes 4 + validación y
actualización 5, PDF p. 7) exige conectar esos formularios con
`ElTintero.datos`/`ElTintero.consultas` (Ej. 3) para dar de alta registros
válidos en memoria, rechazar duplicados y actualizar los listados sin recargar.
Sin este change, el modelo local existe pero no puede crecer y los Ej. 5–6 no
tienen una interfaz estable de altas para reutilizar.

## What Changes

- Se especifica (sin implementar) la **generación desde `ElTintero.datos`** de
  las opciones de `#libros-editorial`, de `#libros-genero` y de un checkbox por
  cada uno de los 5 autores, reemplazando las opciones y los 3 checkboxes
  hardcodeados (R-01).
- Se especifica que «Sin clasificar» representa la **ausencia de género** y se
  persiste como `generoId: null`, sin crear un género en el arreglo (R-01, R-02).
- Se especifica el **alta de libro** con validaciones completas (título, ISBN
  único normalizado, precio finito > 0, editorial existente, al menos un autor y
  todos existentes, género opcional existente), id único y render inmediato en
  `#libros-tabla` (R-02, R-03, R-07).
- Se especifica el **alta de cliente** (nombre completo y email), con email de
  formato válido y único comparado sin espacios exteriores ni mayúsculas, id
  único y render inmediato en `#clientes-tabla` (R-04, R-05, R-07).
- Se especifica el control del `submit` con `preventDefault`, la alternancia
  correcta de `#*-mensaje-ok` / `#*-mensaje-error` / `#*-vacio`, la limpieza
  tras un alta válida y la conservación de valores tras un rechazo (R-06).
- Se centralizan en `js/data.js` las **mutaciones del modelo**, la generación de
  ids y las consultas de unicidad, sin que la capa de vista mute los arrays
  (R-10). Las mutaciones e ids viven bajo `ElTintero.registros` y las consultas
  de normalización/unicidad/búsqueda bajo `ElTintero.consultas`.
- Se documenta el **contrato de las funciones nuevas de `ElTintero`** (firma,
  parámetros, retorno y errores) y los ganchos reutilizables por los Ej. 5–6
  (R-10, CA-09).
- Cambios mínimos futuros de producto (solo especificados): agregar `<script
  defer src="js/data.js">` y `<script defer src="js/altas.js">` a `libros.html`
  y `clientes.html`, `novalidate` en ambos formularios (decisión §9-b aprobada),
  retirar las filas estáticas de ambas tablas en el render y crear el único
  archivo de vista `js/altas.js` (decisión §9-a). CSS sin cambios.
- **No** se implementan ventas, historial, persistencia, edición ni bajas.

## Capabilities

### New Capabilities

- Ninguna. El Ej. 4 extiende capacidades ya existentes (`libros`, `clientes`,
  `datos-locales`) en lugar de introducir un dominio nuevo.

### Modified Capabilities

- `libros`: el formulario deja de tener selectores/checkboxes estáticos y pasa a
  poblarse desde el modelo; la tabla deja de tener filas estáticas y se renderiza
  desde `ElTintero.datos`; los estados pasan a ser controlados por JavaScript; se
  agregan requisitos de validación, alta y actualización del listado (R-01..R-03,
  R-06, R-07, R-09).
- `clientes`: la tabla deja de ser estática y se renderiza desde el modelo; se
  agregan requisitos de validación de nombre/email, unicidad, alta y
  actualización del listado (R-04..R-07, R-09).
- `datos-locales`: se amplía la interfaz pública con mutaciones de alta,
  generación de ids y consultas de unicidad/normalización, y se modifica el
  requisito que hoy prohíbe expresamente implementar altas (R-07, R-10). Las
  mutaciones e ids se exponen en `ElTintero.registros`, las consultas en
  `ElTintero.consultas` y la vista de los formularios en `ElTintero.altas`
  (`js/altas.js`).

> El brief pide expresamente `specs/libros/`, `specs/clientes/` y
> `specs/datos-locales/` si el flujo lo requiere (PROMPT4.md:90), por lo que se
> emiten **tres delta specs** en las rutas exactas de las capabilities
> existentes. No se renombra ni se mueve ninguna capability y no se tocan
> `openspec/specs/` en esta fase.

## Impact

- Archivos de producto afectados en Fase 3 (solo especificados ahora):
  `libros.html` (scripts + `novalidate` + retiro de opciones/checkboxes/filas
  estáticas), `clientes.html` (scripts + `novalidate` + retiro de filas
  estáticas), `js/data.js` (consultas de normalización/unicidad en
  `ElTintero.consultas` + altas e ids en `ElTintero.registros`) y el archivo JS
  nuevo de vista `js/altas.js` (`ElTintero.altas`, ver §5.1).
- No se modifica `css/styles.css`, `index.html`, `catalogo.html`, `ventas.html`
  ni `historial.html`; tampoco `js/catalogo.js`.
- Capabilities `catalogo`, `ventas`, `historial`, `identidad-visual`,
  `diseno-adaptable` y `accesibilidad-basica` no cambian sus requisitos en este
  change. El catálogo seguirá leyendo el mismo modelo, por lo que las altas
  hechas en Libros se verán en el catálogo **solo dentro de la misma sesión**
  (misma página no: son documentos distintos y sin persistencia).
- Sin impacto en APIs, backend, dependencias ni build: prohibidos por alcance
  (sin npm, sin servidor, sin `fetch`, sin `localStorage`, sin librerías, sin
  módulos ES).
- Los `id`, `name`, clases y contenedores de estado del Ej. 1–3 se conservan.

---

## 1. Problema, objetivo y resultado esperado

**Problema (hecho verificado):** `libros.html` y `clientes.html` no cargan
ningún script (no contienen etiquetas `<script>`); sus tablas tienen 3 y 2 filas
estáticas respectivamente; `#libros-editorial` y `#libros-genero` tienen
opciones hardcodeadas con valores slug (`sudamericana`, `losada`, `emece`,
`novela`, `cuento`, `antologia`, `sin-clasificar`) y solo existen 3 checkboxes
de autores (`#libros-autor-1` a `#libros-autor-3`). En consecuencia, hoy no se
puede dar de alta ningún libro ni cliente, no se valida nada y el modelo
`ElTintero.datos` (6 libros, 3 clientes) nunca crece. El Ej. 4 vale 15 puntos
(Libros y selectores 6 + Clientes 4 + validación y actualización 5, PDF p. 7) y
es prerrequisito de la selección de libros/clientes del Ej. 5.

**Objetivo:** especificar el alta de libros y de clientes desde sus formularios,
con opciones generadas desde los datos locales, validaciones completas,
normalización de ISBN/email, unicidad, control del envío con `preventDefault` y
actualización de ambos listados sin recargar, centralizando las mutaciones en
`js/data.js`.

**Resultado esperado de esta fase:** este `proposal.md` + 3 delta specs
(`specs/libros/spec.md`, `specs/clientes/spec.md`, `specs/datos-locales/spec.md`)
listos para revisión del usuario. Quedan fuera de esta fase `design.md`,
`tasks.md` y todo código de producto.

## 2. Contexto verificado y referencias concretas

### Fuentes leídas en esta sesión

- `docs/prompts/PROMPT4.md` (167 líneas, leído íntegramente): rol, metodología
  SDD, contexto, alcance incluido/excluido, requisitos R-01..R-10
  (PROMPT4.md:71-82), Fase 1 — SPEC con sus 9 puntos y decisiones esperadas
  (PROMPT4.md:86-104), criterios CA-01..CA-09 (PROMPT4.md:138-146) y
  restricciones anti-alucinación (PROMPT4.md:153-162).
- `docs/Repaso Primer Parcial.pdf` (7 páginas): **no fue posible leerlo con la
  herramienta Read del modelo** (el modelo no admite entrada PDF); se extrajo el
  texto con `pypdf` desde Python 3.14 y se leyó el texto resultante. Secciones
  citadas:
  - **p. 4 — «Ejercicio 4 · 4. Alta de libros y clientes»**: el formulario de
    libros registra título, ISBN, precio y relaciones con editorial, género y
    autores; opciones generadas desde datos locales; «Sin clasificar»
    representa ausencia de género; se comprueba título/ISBN no vacíos, ISBN
    inexistente (comparado sin espacios ni guiones), precio numérico > 0,
    editorial y todos los autores existentes, al menos un autor, género
    opcional existente; no se implementa dígito de control. El formulario de
    clientes registra nombre completo y email (sin apellido separado), con
    nombre/email no vacíos, email con formato válido y no duplicado comparado
    sin espacios exteriores ni mayúsculas. `preventDefault`, errores cerca del
    formulario, alta solo si pasan todas las comprobaciones, listado y opciones
    relacionadas se actualizan sin recargar. No se exige editar ni eliminar.
  - **p. 1 — «Contexto y alcance»**: frontend simulado en navegador; solo
    HTML/CSS/JS nativos; sin librerías, frameworks ni CDNs; sin API/BD/servidor/
    backend; datos ficticios; sin stock, cobros ni facturación.
  - **p. 2 — «Organización del trabajo» Etapa 2**: se conectan las pantallas con
    datos locales y se completan los ejercicios 3 a 6, incluidas las
    validaciones, las ventas y la persistencia.
  - **p. 7 — «Criterios de evaluación»**: **4. Altas: 15 = Libros y selectores
    6 + clientes 4 + validación y actualización 5**. Se valora código legible,
    nombres comprensibles, funciones acotadas y separación entre estructura,
    estilos y comportamiento.
  - **p. 7 — «Formato de entrega»**: carpeta con HTML, CSS, JavaScript y
    recursos locales + `README.md`; sin dependencias instaladas ni herramientas
    de compilación.
- Convenciones de changes previos:
  `openspec/changes/archive/2026-10-20-ejercicio-3-datos-locales-catalogo-filtro/proposal.md`
  y sus delta specs; `openspec/specs/{libros,clientes,datos-locales}/spec.md`
  (capabilities que este change modifica).
- `openspec/config.yaml`: artefactos en español; headings estructurales de
  OpenSpec y keywords `SHALL`/`MUST` en inglés.

### Estado real del producto verificado (inspección directa)

- **Hecho verificado — `js/`:** contiene `.gitkeep` (0 bytes), `data.js`
  (5.643 bytes) y `catalogo.js` (4.795 bytes).
- **Hecho verificado — `js/data.js`:** `ElTintero.datos` (líneas 11-90) con
  3 editoriales (ids 1–3), 3 géneros (ids 1–3), 5 autores (ids 1–5), 6 libros
  (ids 1–6) y 3 clientes (ids 1–3). `ElTintero.consultas` (líneas 186-194)
  expone `obtenerLibros`, `obtenerClientes`, `buscarEditorialPorId`,
  `buscarGeneroPorId`, `buscarAutoresPorIds`, `formatearPrecio` y
  `verificarIntegridad`. `formatearPrecio` usa `Intl.NumberFormat("es-AR")` con
  `minimumFractionDigits: 0` y `maximumFractionDigits: 0` (líneas 122-129).
  `verificarIntegridad()` se ejecuta al cargar (línea 196) y reporta con
  `console.error` errores de ids duplicados, referencias inexistentes, libro sin
  autores y precio no finito.
- **Hecho verificado — esquema real del libro:** cada libro usa
  `{ id, titulo, isbn, precio, editorialId, generoId, autoresIds }` (por
  ejemplo, líneas 30-38); `generoId` puede ser `null` (libro 3 «El Aleph»,
  línea 54) y `autoresIds` es `number[]`.
- **Hecho verificado — esquema real del cliente:** `{ id, nombre, email }`
  (líneas 85-89); no existe campo de apellido.
- **Hecho verificado — `libros.html`:** `form#libros-form` (líneas 23-73) con
  `#libros-titulo` (`type=text`), `#libros-isbn` (`type=text`), `#libros-precio`
  (`type=number min="0" step="0.01"`), `#libros-editorial` con opciones
  hardcodeadas `sudamericana`/`losada`/`emece` (líneas 38-43), `#libros-genero`
  con `novela`/`cuento`/`antologia`/`sin-clasificar` (líneas 47-53) y
  `<fieldset><legend>Autores</legend>` con 3 checkboxes `#libros-autor-1` a
  `#libros-autor-3`, `name="autores"` (líneas 55-69; el primero con `checked`).
  Existen `#libros-vacio`, `#libros-mensaje-ok` y `#libros-mensaje-error`,
  ocultos y con `aria-live="polite"` (líneas 74-76). `table#libros-tabla` tiene
  6 columnas (Título, ISBN, Editorial, Género, Autores, Precio) y **3 filas
  estáticas** (líneas 78-116).
- **Hecho verificado — `clientes.html`:** `form#clientes-form` (líneas 23-35)
  con `#clientes-nombre` (`type=text`) y `#clientes-email` (`type=email`);
  `#clientes-vacio`, `#clientes-mensaje-ok` y `#clientes-mensaje-error` ocultos
  con `aria-live="polite"` (líneas 36-38); `table#clientes-tabla` con columnas
  Nombre completo y Email y **2 filas estáticas** (líneas 40-57).
- **Hecho verificado — scripts:** solo `catalogo.html` carga scripts, con
  `<script defer src="js/data.js">` y `<script defer src="js/catalogo.js">`
  (líneas 41-42). `libros.html` y `clientes.html` no tienen ninguna etiqueta
  `<script>`.
- **Hecho verificado — validación nativa:** ningún formulario del proyecto usa
  `novalidate`; no hay `localStorage`, `sessionStorage` ni IndexedDB en los
  HTML ni en `js/`.
- **Hecho verificado — ausencia de README:** no existe `README.md` en la raíz.
- **Hecho verificado — maquetas futuras:** `ventas.html` mantiene
  `#ventas-cliente` (líneas 25-29, clientes 1–2 estáticos) y `#ventas-libro`
  (líneas 33-38, libros 1–3 estáticos); `historial.html` sigue siendo maqueta.
- **Hecho verificado — patrón de namespace:** `js/catalogo.js` define una IIFE
  con `"use strict"`, reutiliza `window.ElTintero`, expone
  `ElTintero.catalogo` (líneas 147-151) y se autoinicia al final (línea 153).

### Discrepancias y precisiones detectadas

| # | Afirmación del brief | Realidad verificada | Tratamiento |
| --- | --- | --- | --- |
| D-1 | «3 checkboxes `#libros-autor-1` a `#libros-autor-3` con `name="autores"` (solo 3 de los 5 autores existentes)» | Correcto en cantidad y `name`, pero las **etiquetas no coinciden con los ids del modelo**: `#libros-autor-2` (value 2) dice «Julio Cortázar» cuando el id 2 es «Jorge Luis Borges»; `#libros-autor-3` (value 3) dice «Jorge Luis Borges» cuando el id 3 es «Adolfo Bioy Casares» (`libros.html:62-67` vs `data.js:24-25`). Además, `#libros-autor-1` viene con `checked` por defecto | Se documenta como precisión: el reemplazo por checkboxes generados desde `autores` corrige el desalineamiento y elimina el `checked` por defecto. Se registra que la maqueta no es fuente de verdad de nombres |
| D-2 | «valores slug: `sudamericana`, `losada`, `emece`, `novela`, `cuento`, `antologia`, `sin-clasificar`» | Los valores son exactamente esos; el orden visible del selector de género es Novela, Cuento, Antología, Sin clasificar (distinto del orden del arreglo `generos`: Novela, Antología, Cuento) | Sin contradicción: se reemplazan por `value` numérico del id (o `""` para «Sin clasificar») generado desde el modelo |
| D-3 | «`#libros-precio` (`type="number" min="0" step="0.01"`)» | Correcto en el HTML, pero `min="0"` permite `0` en la validación nativa, mientras el PDF exige precio **mayor que cero** | Se documenta como precisión: la regla de negocio (> 0) prevalece; la validación nativa no alcanza (refuerza la necesidad de `novalidate` o de validación propia) |
| D-4 | «tabla `#libros-tabla` tiene 3 filas estáticas» y «`#clientes-tabla` con 2 filas estáticas» | Correcto. El modelo tiene 6 libros y 3 clientes, por lo que el render inicial mostrará 6 y 3 filas respectivamente (más que las estáticas) | Se documenta para evitar confundir «3 filas estáticas» con «3 libros» |

No se detectaron otras contradicciones: la carga de `data.js`/`catalogo.js` con
`defer` en `catalogo.html`, el contenido de `ElTintero.datos`/`ElTintero.consultas`,
la ausencia de `<script>` en Libros/Clientes, la ausencia de `novalidate`, la
ausencia de `localStorage` y la ausencia de `README.md` coinciden con el brief.

### Supuestos explícitos (no hechos)

- Los nombres de funciones de §5.4: los namespaces y las operaciones son el
  contrato aprobado. Los literales de los mensajes quedaron fijados en §9-j y se
  listan en §5.6.
- Los ejemplos de ISBN y emails usados en los escenarios (`978-84-376-0494-7`,
  `978-99999-0000-1`, `nuevo@example.com`) son **datos ficticios de ejemplo** y
  no se agregan al modelo inicial.
- El orden de las filas (al final, orden de inserción) y el formato de precio
  (sin decimales, `formatearPrecio`) son **decisiones aprobadas** por el usuario
  el 2026-10-20 (§9-g, §9-h), no defaults propuestos.

## 3. Alcance incluido y exclusiones explícitas

### Incluido

- Generación desde `ElTintero.datos` de opciones de `#libros-editorial` y
  `#libros-genero` y de un checkbox por cada autor existente, con
  `id="libros-autor-<id>"` y `name="autores"`, eliminando opciones y checkboxes
  hardcodeados (R-01).
- «Sin clasificar» como ausencia de género (`generoId: null`), no como registro
  del arreglo `generos` (R-01, R-02).
- Alta de libro desde `#libros-form` con id único, precio numérico y render
  inmediato en `#libros-tabla` sin recargar (R-02, R-07).
- Validaciones de libro: título e ISBN no vacíos (con `trim`), ISBN único
  normalizado sin espacios ni guiones (sin cambio de mayúsculas/minúsculas,
  §9-d), precio numérico finito y > 0, editorial existente, uno o más autores y
  todos existentes, género `null` o existente (R-03).
- Alta de cliente desde `#clientes-form` con nombre completo, email de formato
  válido y único (comparado case-insensitive), id único y render inmediato en
  `#clientes-tabla` (R-04, R-05).
- Control del `submit` con `preventDefault`; validación completa antes de mutar
  (sin altas parciales); limpieza tras éxito y conservación de valores tras
  rechazo; éxito y error nunca simultáneos; mensajes con los literales LN/CN de
  §5.6 (R-06).
- Renderizado de ambas tablas desde el modelo al cargar y tras cada alta,
  retirando filas estáticas; resolución de editorial/género/autores por id,
  precio con `formatearPrecio` y filas nuevas al final, en orden de inserción
  (R-07, §9-g, §9-h).
- Estado de lista vacía (`#libros-vacio`, `#clientes-vacio`) si la colección no
  tiene registros (R-07).
- Mutaciones, generación de id y consultas de unicidad/normalización
  centralizadas en `js/data.js` bajo `ElTintero.registros` (mutaciones e ids) y
  `ElTintero.consultas` (lectura/normalización/unicidad); la vista vive en
  `js/altas.js` bajo `ElTintero.altas` y no muta arrays (R-10).
- Documentación del contrato de `ElTintero` y de los ganchos reutilizables por
  los Ej. 5–6 (R-10, CA-09).
- Inserción de datos con `textContent`/`createElement`, sin `innerHTML` con
  datos (R-08).
- Scripts externos clásicos con `defer` en orden de dependencia (`data.js` y
  luego `altas.js`) (R-09).

### Excluido

- Todo el Ejercicio 5 (composición de venta, renglones, subtotales, total,
  confirmación, precio histórico, historial dinámico) y todo el Ejercicio 6
  (`localStorage`, recuperación/duplicación de datos, casos manuales, README
  definitivo).
- Persistencia entre páginas o recargas: los datos viven en memoria y se pierden
  al recargar; que un alta de `libros.html` aparezca luego en `catalogo.html` o
  `ventas.html` requiere el Ej. 6 y no forma parte de este change.
- Actualización de `#ventas-cliente` y `#ventas-libro` (decisión §9-f: no se
  actualizan en este change; es Ej. 5).
- Altas, bajas o modificaciones de editoriales, géneros y autores; CRUD de
  cualquier entidad; edición o eliminación de libros/clientes; stock, cobros o
  facturación.
- Renderizado dinámico de Ventas e Historial: siguen siendo maquetas estáticas.
- `fetch`/AJAX, APIs, backend, frameworks, librerías, CDNs o módulos ES.
- Cambios de diseño/CSS, de estructura semántica o de navegación ajenos a esta
  entrega (solo se agregan `<script>`, `novalidate` ya aprobado y los ajustes
  mínimos de contenedores/atributos de error justificados en este SPEC).
- Tests automatizados y cualquier verificación que requiera servidor o build
  (decisión §9-i: verificación manual).

## 4. Requisitos identificados y escenarios observables

> Resumen vinculado; la versión normativa y testable está en los delta specs de
> `specs/`. Todos los escenarios se observan abriendo `libros.html` y
> `clientes.html` con doble clic (`file://`), sin servidor.

- **R-01 Selectores y datos** — al cargar `libros.html`, las opciones de
  editorial/género y los checkboxes de autores se generan desde
  `ElTintero.datos`; se eliminan las opciones y checkboxes hardcodeados; hay un
  checkbox por los 5 autores con `id="libros-autor-<id>"` y `name="autores"`;
  «Sin clasificar» es la ausencia de género. Escenario: `#libros-editorial`
  tiene 3 opciones + «Seleccionar editorial»; `#libros-genero` tiene 3 géneros +
  «Sin clasificar»; existen `libros-autor-1`..`libros-autor-5`. Límite: ningún
  `id` duplicado; los nombres visibles coinciden con `autores`.
- **R-02 Alta de libros** — un alta válida agrega un libro con id único, precio
  numérico y `generoId: null` si no se elige género, y aparece en la tabla sin
  recargar. Escenario: alta completa → 7 filas y `#libros-mensaje-ok` visible.
  Límite: sin género guarda `null`; con varios autores guarda todos los ids en
  `autoresIds`; sin autores no agrega.
- **R-03 Validación de libros** — se rechazan título/ISBN vacíos o solo con
  espacios, ISBN que queda vacío al normalizar, precio vacío/no numérico/no
  finito/≤ 0, editorial vacía o inexistente, cero autores, autor inexistente y
  género inexistente; ISBN duplicado se rechaza comparando normalizado sin
  espacios ni guiones (sin cambio de caja, §9-d). Los errores son texto cerca
  del formulario (resumen único + `aria-invalid` + `aria-describedby`, §9-c y
  §9-k) y no se agrega nada si
  falla alguna comprobación. Escenarios límite: `978-84-376-0494-7`,
  `9788437604947` y ` 978 84 376 0494 7 ` se detectan como el mismo ISBN
  existente; precio `0`, `-5`, vacío y `abc` se rechazan; `generoId: null` es
  válido. Límite: el dígito de control del ISBN **no** se valida; un ISBN que
  difiera solo en la caja de la `X` final no se detecta como duplicado (§9-d).
- **R-04 Alta de clientes** — un alta válida exige nombre completo no vacío y
  email no vacío, de formato válido y único; formato válido = sin espacios, un
  único `@`, al menos un carácter antes y después, dominio con punto y al menos
  dos letras después del último punto (validación práctica, no RFC completa); el
  email se compara recortando espacios exteriores y sin distinguir mayúsculas.
  Se agrega un cliente con id único y aparece en la tabla sin recargar. No hay
  campo de apellido. Escenario: ` Ana.Perez@Example.com ` se rechaza como
  duplicado de `ana.perez@example.com`. Límite: emails sin `@`, con dos `@`, sin
  punto de dominio, con espacio interno o con TLD de una letra se rechazan.
- **R-05 Validación de clientes** — se rechazan nombre vacío o solo con
  espacios, email vacío, email con formato inválido y email duplicado; los
  mensajes son de texto y cercanos al formulario; no se agrega nada si falla
  alguna comprobación. Límite: la comparación de duplicado ignora mayúsculas y
  espacios exteriores, pero **no** normaliza puntos ni sufijos `+`.
- **R-06 Eventos y mensajes** — `submit` con `preventDefault`; alta correcta
  limpia el formulario, muestra éxito y oculta error; rechazo muestra error,
  conserva valores y oculta éxito; se respetan `hidden` y `aria-live="polite"`.
  Escenario: tras un rechazo el formulario mantiene título/ISBN/precio;
  `#libros-mensaje-ok` está oculto. Límite: éxito y error nunca visibles a la
  vez; el texto de error no depende solo del color.
- **R-07 Actualización y estados** — ambas tablas se renderizan desde el modelo
  al cargar y tras cada alta, sin filas estáticas duplicadas, con
  editorial/género/autores resueltos y precio formateado; `#libros-vacio`/
  `#clientes-vacio` se muestran si la colección está vacía; los ids no se
  repiten y `verificarIntegridad()` sigue sin errores. Escenario: tras varias
  altas, `verificarIntegridad()` devuelve `[]`. Límite: vaciar el modelo en
  consola (no hay UI de borrado) muestra el estado vacío y la tabla sin filas.
- **R-08 Calidad y seguridad** — todo dato del usuario se inserta con
  `textContent`/`createElement`; no se usa `innerHTML`, `insertAdjacentHTML`,
  `eval` ni `document.write` con datos; no hay errores en consola al abrir ni al
  operar; los datos inválidos nunca llegan al modelo. Límite: título
  `<b>prueba</b>` se muestra como texto literal.
- **R-09 Convenciones** — JS externo en `js/`, cargado con `<script defer>` en
  orden de dependencia (`data.js` antes que `js/altas.js`, el único script de
  vista, §9-a); sin JS inline, sin `type="module"`, sin librerías ni frameworks;
  IIFE con `"use strict"` y namespace `ElTintero`; se reutilizan
  `ElTintero.consultas` y `formatearPrecio`; nombres de dominio en español; se
  conservan los `id` existentes. Límite: el orden de scripts debe garantizar que
  el modelo exista antes de poblarse los selectores.
- **R-10 Separación y preparación futura** — las mutaciones (alta de libro,
  alta de cliente y generación de id) y las consultas de normalización/unicidad
  se centralizan en `js/data.js` ampliando `ElTintero` bajo
  `ElTintero.registros` y `ElTintero.consultas` respectivamente; la vista
  (`js/altas.js`, `ElTintero.altas`) no muta los arrays; el SPEC documenta la
  interfaz resultante y los ganchos para los Ej. 5–6; no se implementa
  persistencia, ventas ni edición. Límite: la vista solo lee resultados y llama
  a las altas; no ejecuta `push` ni asigna ids.

## 5. Estructura, componentes, interfaces y datos

> Todo lo siguiente es **especificación para revisión**, no implementación. Las
> secciones marcadas como decisión aprobada reflejan las respuestas del usuario
> del 2026-10-20. No se modifican archivos de producto en esta fase.

### 5.1 Organización de archivos JS (decisión §9-a: un único `js/altas.js`)

**Decisión aprobada (2026-10-20):** un único archivo de vista `js/altas.js` para
ambos formularios, más `js/data.js` ampliado. **No** se crean archivos de vista
separados por formulario ni un archivo aparte de validaciones, y no se duplican
helpers por vista.

```html
<!-- libros.html -->
<script defer src="js/data.js"></script>
<script defer src="js/altas.js"></script>

<!-- clientes.html -->
<script defer src="js/data.js"></script>
<script defer src="js/altas.js"></script>
```

- `js/data.js` (existente, se amplía): modelo inicial sin cambios, consultas
  existentes, más normalización/unicidad en `ElTintero.consultas` y las
  mutaciones de alta y la generación de ids en `ElTintero.registros`.
- `js/altas.js` (nuevo, único archivo de vista): detecta qué página está
  cargada. Si existe `#libros-form`, inicializa la vista de libros (puebla
  selectores y checkboxes, renderiza `#libros-tabla` y registra el `submit`);
  si existe `#clientes-form`, inicializa la vista de clientes (renderiza
  `#clientes-tabla` y registra el `submit`); si no existe ninguno de los dos, no
  hace nada y no produce errores en consola. Los helpers de validación/formato
  (por ejemplo `esEmailValido`, `parsearPrecio`) y los de presentación de
  mensajes (por ejemplo `mostrarErrores`) son funciones privadas del IIFE de
  `js/altas.js`: no se exportan ni se duplican.
- `js/altas.js` expone `ElTintero.altas.iniciar()` y, opcionalmente,
  `renderizarLibros()` / `renderizarClientes()`; no muta los arrays del modelo.

Con `defer`, el orden de ejecución respeta el orden de aparición y el DOM ya
está disponible (no se necesita `DOMContentLoaded`), igual que en
`catalogo.html:41-42`. Cargar `js/altas.js` en una página sin ninguno de los dos
formularios es inocuo.

### 5.2 Namespace y encapsulamiento

- IIFE + `"use strict"` en cada archivo, exponiendo un único global
  `ElTintero` (`window.ElTintero = window.ElTintero || {}`), siguiendo
  `js/data.js:1-4` y `js/catalogo.js:1-6`.
- Contrato de namespaces sin ambigüedad:
  - `ElTintero.datos` — colecciones en memoria (sin cambios de esquema).
  - `ElTintero.consultas` — lectura, formato, normalización, unicidad y
    búsquedas por id; no muta.
  - `ElTintero.registros` — mutaciones de alta y generación de ids; único camino
    por el que la vista agrega registros.
  - `ElTintero.altas` — vista de los formularios de alta (`js/altas.js`);
    inicializa, renderiza y maneja eventos; no muta arrays.
- Nombres de funciones en camelCase y en español; 2 espacios de indentación.
- `js/data.js` no contiene lógica de DOM; `js/altas.js` no contiene datos
  iniciales ni muta arrays.

### 5.3 Esquema del libro y del cliente creados

**Libro** (idéntico al esquema real de `js/data.js:30-38`):

| Campo | Tipo | Obligatorio | Regla |
| --- | --- | --- | --- |
| `id` | `number` | sí | entero único, asignado por el modelo |
| `titulo` | `string` | sí | recortado, no vacío |
| `isbn` | `string` | sí | recortado tal como se ingresó (decisión §9-e); no vacío tras normalizar; único comparando normalizado |
| `precio` | `number` | sí | finito y `> 0` |
| `editorialId` | `number` | sí | debe existir en `editoriales` |
| `generoId` | `number \| null` | sí | `null` = «Sin clasificar»; si no es `null`, debe existir |
| `autoresIds` | `number[]` | sí | al menos 1; todos deben existir; sin duplicados |

No se agregan campos (`fecha`, `stock`, `activo`, etc.).

**Cliente** (idéntico al esquema real de `js/data.js:85-89`):

| Campo | Tipo | Obligatorio | Regla |
| --- | --- | --- | --- |
| `id` | `number` | sí | entero único, asignado por el modelo |
| `nombre` | `string` | sí | recortado, no vacío (nombre completo, sin apellido separado) |
| `email` | `string` | sí | recortado tal como se ingresó (decisión §9-e); formato válido; único comparando normalizado (case-insensitive) |

Los valores `isbn` y `email` se guardan **recortados tal como se ingresaron**; la
comparación de unicidad siempre normaliza y nunca altera el valor almacenado.

### 5.4 Funciones nuevas de `ElTintero` (contrato aprobado)

> Los nombres son el contrato acordado. Ninguna función de datos persiste ni
> modifica el DOM; la vista se limita a leer el modelo y a llamar a
> `ElTintero.registros`.

**`ElTintero.consultas` (ampliación en `js/data.js`)**

| Función | Parámetros | Devuelve | Estados/errores |
| --- | --- | --- | --- |
| `normalizarIsbn(isbn)` | `isbn: string` | `string` | Recorta y quita **todos** los espacios y guiones (decisión §9-d). **No** cambia mayúsculas/minúsculas: una `x` final se conserva como `x`. No valida dígito de control. Si el resultado queda vacío, devuelve `""` |
| `normalizarEmail(email)` | `email: string` | `string` | Recorta espacios exteriores y pasa a minúsculas; no modifica espacios internos |
| `existeLibroConIsbn(isbn)` | `isbn: string` | `boolean` | Compara `normalizarIsbn` contra todos los libros; no lanza excepción |
| `existeClienteConEmail(email)` | `email: string` | `boolean` | Compara `normalizarEmail` contra todos los clientes; no lanza excepción |
| `buscarLibroPorId(id)` | `id: number` | `Libro \| undefined` | Gancho para Ej. 5; `undefined` si no existe |
| `buscarClientePorId(id)` | `id: number` | `Cliente \| undefined` | Gancho para Ej. 5; `undefined` si no existe |

**`ElTintero.registros` (nuevo, en `js/data.js`)**

| Función | Parámetros | Devuelve | Estados/errores |
| --- | --- | --- | --- |
| `generarIdLibro()` | — | `number` | `1` si la colección está vacía; si no, `max(id) + 1`. No muta |
| `generarIdCliente()` | — | `number` | Ídem para clientes |
| `registrarLibro(datosLibro)` | `datosLibro: { titulo, isbn, precio, editorialId, generoId, autoresIds }` | `{ exito: true, libro: Libro } \| { exito: false, errores: ErrorAlta[] }` | Valida todo antes de mutar. No lanza excepción por datos inválidos. Solo hace `push` si todas las comprobaciones pasan (sin alta parcial). Compara ISBN normalizado, guarda `isbn` recortado tal como se ingresó (decisión §9-e) y asigna `id` con `generarIdLibro()` |
| `registrarCliente(datosCliente)` | `datosCliente: { nombre, email }` | `{ exito: true, cliente: Cliente } \| { exito: false, errores: ErrorAlta[] }` | Ídem para clientes: compara email normalizado (case-insensitive) y guarda `email` recortado tal como se ingresó |

`ErrorAlta` es un objeto de la forma `{ campo: string, mensaje: string }`, donde
`campo` identifica el control (`titulo`, `isbn`, `precio`, `editorialId`,
`generoId`, `autoresIds`, `nombre`, `email`). Los textos de `mensaje` son los
literales definitivos LN/CN de §5.6 (decisión §9-j).

**Vista `ElTintero.altas` (nuevo, en `js/altas.js`, patrón de `js/catalogo.js:147-153`)**

| Función | Devuelve | Responsabilidad |
| --- | --- | --- |
| `iniciar()` | `undefined` | Detecta la página: si existe `#libros-form` inicializa libros (selectores, checkboxes, tabla y `submit`); si existe `#clientes-form` inicializa clientes (tabla y `submit`); si no existe ninguno, no hace nada |
| `renderizarLibros()` | `undefined` | Redibuja `#libros-tabla` desde el modelo y alterna `#libros-vacio` (pública opcional) |
| `renderizarClientes()` | `undefined` | Redibuja `#clientes-tabla` y alterna `#clientes-vacio` (pública opcional) |

### 5.5 Reglas de normalización y validación

- **ISBN:** se recorta; para **comparar** se quitan todos los espacios y
  guiones, **sin** cambiar la caja de las letras (decisión §9-d: la `x` final
  **no** se pasa a mayúsculas). No se valida el dígito de control (PDF p. 4).
  El valor que se guarda es el recortado tal como se ingresó (decisión §9-e).
- **Email:** se recorta; para **comparar** se pasa a minúsculas (decisión
  §9-e: el valor guardado es el recortado tal como se ingresó). Formato válido
  (validación práctica, no RFC completa): sin espacios, exactamente un `@`, al
  menos un carácter antes y después, y dominio con al menos un punto y dos o más
  letras después del último punto. Expresión regular propuesta:
  `^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$`.
- **Precio:** se lee el valor del control; se convierte a número con
  `Number(...)`. Válido si el texto no está vacío, el resultado es finito y es
  `> 0`. Se rechazan `0`, negativos, `""`, `"abc"` y `NaN`/`Infinity`.
- **Autores:** se leen todos los checkboxes `name="autores"` con `checked`; se
  exige al menos uno y que cada `value` corresponda a un autor existente. No se
  aceptan ids repetidos.
- **Editorial:** `value` no vacío y `buscarEditorialPorId(Number(value))`
  definido.
- **Género:** `value` vacío ⇒ `generoId: null`; si no, debe existir
  `buscarGeneroPorId(Number(value))`.
- **Mensajes:** cada comprobación fallida produce el literal LN/CN del catálogo
  de §5.6 (decisión §9-j). `ElTintero.registros` devuelve
  `{ campo, mensaje }` y `ElTintero.altas` compone el resumen visible.

### 5.6 Renderizado de tablas y estados

- Ambas tablas se vacían (`while (tbody.firstChild) removeChild`) y se
  reconstruyen con `createElement`/`textContent` al cargar y tras cada alta; no
  quedan filas estáticas.
- Libros: una fila por libro con título, ISBN, nombre de editorial,
  nombre de género o «Sin clasificar» si `generoId` es `null`, nombres de
  autores resueltos (separados por coma) y
  `ElTintero.consultas.formatearPrecio(libro.precio)`.
- Clientes: una fila por cliente con nombre y email.
- Las filas nuevas se agregan **al final** de la tabla, en orden de inserción
  (decisión §9-h aprobada).
- `#libros-vacio` / `#clientes-vacio`: visibles solo si la colección
  correspondiente tiene longitud 0; en ese caso la tabla no tiene filas.
- `#libros-mensaje-ok` / `#clientes-mensaje-ok`: visibles solo tras un alta
  válida; `#libros-mensaje-error` / `#clientes-mensaje-error`: visibles solo
  tras un rechazo. Nunca ok y error a la vez.
- El texto de éxito y de error se escribe con `textContent`. Los errores se
  agrupan en un **único resumen** en `#libros-mensaje-error` /
  `#clientes-mensaje-error` (decisión §9-c aprobada). No se agregan contenedores
  de error por campo.
- En cada control afectado por un error se aplican `aria-invalid="true"` **y**
  `aria-describedby="libros-mensaje-error"` (o
  `aria-describedby="clientes-mensaje-error"` según la vista). Cuando no hay
  error (alta válida o mensajes ocultos) se retiran **ambos** atributos del
  control (decisión §9-k). Los contenedores mantienen su `aria-live="polite"`;
  no se agrega `role="alert"` ni contenedores nuevos por campo.

#### Catálogo de literales definitivos (decisión §9-j)

Alta de libro — errores (LN-xx):

| Código | Condición | Literal |
| --- | --- | --- |
| LN-01 | título vacío o solo espacios | «Ingresá el título del libro.» |
| LN-02 | ISBN vacío o solo espacios | «Ingresá el ISBN del libro.» |
| LN-03 | ISBN sin caracteres útiles al quitar espacios y guiones | «El ISBN no puede contener solo espacios o guiones.» |
| LN-04 | ISBN duplicado (comparado normalizado) | «Ya existe un libro con ese ISBN.» |
| LN-05 | precio vacío | «Ingresá el precio del libro.» |
| LN-06 | precio no numérico o no finito | «El precio debe ser un número.» |
| LN-07 | precio menor o igual a cero | «El precio debe ser mayor que cero.» |
| LN-08 | editorial sin seleccionar | «Seleccioná una editorial.» |
| LN-09 | editorial inexistente | «La editorial seleccionada no existe.» |
| LN-10 | género inexistente | «El género seleccionado no existe.» |
| LN-11 | ningún autor seleccionado | «Seleccioná al menos un autor.» |
| LN-12 | autor inexistente | «Uno de los autores seleccionados no existe.» |
| LN-OK | alta válida | «Libro registrado correctamente.» |

Alta de cliente — errores (CN-xx):

| Código | Condición | Literal |
| --- | --- | --- |
| CN-01 | nombre vacío o solo espacios | «Ingresá el nombre completo del cliente.» |
| CN-02 | email vacío o solo espacios | «Ingresá el email del cliente.» |
| CN-03 | email con formato inválido | «El email no tiene un formato válido.» |
| CN-04 | email duplicado | «Ya existe un cliente con ese email.» |
| CN-OK | alta válida | «Cliente registrado correctamente.» |

**Composición del resumen (regla obligatoria):** si hay más de un error, los
mensajes se concatenan en un único `textContent`, separados por un espacio y en
el orden de los campos del formulario (libros: título → ISBN → precio →
editorial → género → autores; clientes: nombre → email). Un mismo mensaje no se
repite aunque varios autores sean inválidos: LN-12 se informa una sola vez.

### 5.7 Ganchos reutilizables por los Ej. 5–6

- `ElTintero.datos.libros` y `ElTintero.datos.clientes` ya poblados con los
  registros creados (en memoria) durante la sesión.
- `ElTintero.consultas.obtenerLibros()` / `obtenerClientes()`,
  `buscarLibroPorId(id)` / `buscarClientePorId(id)` para resolver selecciones.
- `ElTintero.registros.registrarLibro` / `registrarCliente` como único camino
  de mutación, reutilizable si el Ej. 6 agrega persistencia envolviendo estas
  funciones.
- `ElTintero.consultas.normalizarIsbn` / `normalizarEmail` para comparaciones
  futuras (por ejemplo, duplicados al recuperar datos persistidos).
- `ElTintero.altas.iniciar()` como punto de entrada de la vista de altas, y
  `renderizarLibros()` / `renderizarClientes()` si se exponen, para que el Ej. 5
  refresque los listados sin duplicar render.
- Los `id` de formulario (`libros-*`, `clientes-*`) se conservan, por lo que el
  Ej. 5 puede leer `#ventas-cliente`/`#ventas-libro` sin cambiar la estructura
  de los formularios de alta.
- **Límite explícito:** sin persistencia, las altas no sobreviven a la recarga
  ni pasan a otras vistas (`catalogo.html`, `ventas.html`); eso es Ej. 6.

### 5.8 Cambios mínimos futuros en HTML

1. `libros.html`: retirar las opciones hardcodeadas de `#libros-editorial` y
   `#libros-genero` (quedan los `<select>` vacíos con su opción inicial
   generada por JS), retirar los 3 checkboxes estáticos del `<fieldset>` (se
   generan los 5), retirar las 3 filas del `<tbody>` de `#libros-tabla`,
   agregar `novalidate` al formulario (decisión §9-b aprobada) y los
   `<script defer>` de `js/data.js` y `js/altas.js` (§5.1).
2. `clientes.html`: retirar las 2 filas del `<tbody>` de `#clientes-tabla`,
   agregar `novalidate` (decisión §9-b aprobada) y los `<script defer>` de
   `js/data.js` y `js/altas.js` (§5.1).
3. No se modifican `id`, clases, `label`, `name` ni contenedores de estado
   existentes, salvo `aria-invalid` y `aria-describedby` en los controles
   afectados (decisiones §9-c y §9-k aprobadas).

## 6. Estados y manejo de errores

| Caso | Resultado esperado | Elemento observable |
| --- | --- | --- |
| Título vacío o solo espacios | Rechazo, sin mutación, valores conservados | «Ingresá el título del libro.» en `#libros-mensaje-error`; `#libros-mensaje-ok` oculto |
| ISBN vacío o solo espacios | Rechazo | «Ingresá el ISBN del libro.» |
| ISBN que queda vacío al quitar espacios y guiones | Rechazo | «El ISBN no puede contener solo espacios o guiones.» |
| ISBN duplicado normalizado (`978-84-376-0494-7` vs `9788437604947` vs ` 978 84 376 0494 7 `) | Rechazo por duplicado | «Ya existe un libro con ese ISBN.» |
| Precio vacío | Rechazo | «Ingresá el precio del libro.» |
| Precio `abc`, `NaN`, `Infinity` | Rechazo | «El precio debe ser un número.» |
| Precio `0` o negativo | Rechazo | «El precio debe ser mayor que cero.» |
| Editorial vacía | Rechazo | «Seleccioná una editorial.» |
| Editorial inexistente | Rechazo | «La editorial seleccionada no existe.» |
| Género inexistente | Rechazo | «El género seleccionado no existe.» |
| «Sin clasificar» (valor vacío) | Aceptado con `generoId: null` | Libro en tabla con «Sin clasificar» |
| Ningún autor seleccionado | Rechazo | «Seleccioná al menos un autor.» |
| Autor inexistente | Rechazo | «Uno de los autores seleccionados no existe.» (una sola vez aunque haya varios) |
| Alta válida de libro | `push` con id único, formulario limpio, tabla actualizada | «Libro registrado correctamente.» en `#libros-mensaje-ok`; `#libros-mensaje-error` oculto |
| Nombre vacío / solo espacios | Rechazo, sin mutación | «Ingresá el nombre completo del cliente.» en `#clientes-mensaje-error`; ok oculto |
| Email vacío o solo espacios | Rechazo | «Ingresá el email del cliente.» |
| Email con formato inválido (sin `@`, dos `@`, sin punto, TLD de 1 letra, espacio interno) | Rechazo | «El email no tiene un formato válido.» |
| Email duplicado (` Ana.Perez@Example.com ` vs `ana.perez@example.com`) | Rechazo | «Ya existe un cliente con ese email.» |
| Alta válida de cliente | `push` con id único, formulario limpio, tabla actualizada | «Cliente registrado correctamente.» en `#clientes-mensaje-ok`; error oculto |
| Lista vacía (`libros`/`clientes` en 0) | Tabla sin filas y mensaje de vacío | `#libros-vacio` / `#clientes-vacio` |
| Alta parcial (algunos campos válidos y otros no) | **No se agrega nada**; el array conserva su longitud | Contadores antes/después iguales |
| Colección con datos | El mensaje de vacío permanece oculto | `hidden` en `#*-vacio` |

Reglas transversales:

- Exactamente uno de {ok, error} visible por formulario; el estado de vacío es
  independiente y puede coexistir con un error (la colección vacía no es un
  error de alta).
- La visibilidad se controla solo con el atributo `hidden`; no se toca CSS.
- Se respeta `aria-live="polite"` ya presente en los tres contenedores.
- En cada rechazo se marcan `aria-invalid="true"` y
  `aria-describedby="libros-mensaje-error"` / `"clientes-mensaje-error"` en los
  controles afectados; en el alta válida siguiente se retiran ambos atributos y
  el formulario queda limpio (decisión §9-k).
- Si hay varios errores, el resumen es la concatenación de los literales en el
  orden de los campos, separados por un espacio; LN-12 no se repite (decisión
  §9-j).
- Ante cualquier rechazo, el array no cambia y el formulario conserva los
  valores para corregirlos.
- No se lanzan excepciones por datos inválidos: `registrarLibro` y
  `registrarCliente` devuelven el objeto de resultado.

## 7. Restricciones técnicas y convenciones

- Apertura directa por `file://` (doble clic), sin npm, build ni servidor:
  prohibido `type="module"`; solo scripts clásicos externos con `defer`.
- JavaScript ES2020+ nativo: `const`/`let`, funciones nombradas y acotadas,
  `"use strict"` + IIFE/namespace para no contaminar el global.
- Sin librerías, frameworks, CDNs, `fetch`/AJAX, API, backend ni módulos ES.
- Sin persistencia: nada de `localStorage`, `sessionStorage` ni IndexedDB.
- Separación estricta: modelo, consultas, normalización y mutaciones en
  `js/data.js` (`ElTintero.datos`, `ElTintero.consultas` y
  `ElTintero.registros`); DOM, lectura de formularios, eventos, render y
  helpers internos en `js/altas.js` (`ElTintero.altas`).
- Inserción de datos con `textContent`/`createElement`; prohibido
  `innerHTML`/`insertAdjacentHTML`/`eval`/`document.write` con datos de usuario
  o del modelo.
- Nomenclatura: archivos e `id` en kebab-case; variables/funciones en
  camelCase; nombres de dominio en español (`libro`, `editorial`, `genero`,
  `autor`, `cliente`, `isbn`, `email`, `precio`); 2 espacios de indentación.
- Conservar los `id` y `name` existentes de los formularios y contenedores de
  estado; conservar las 6 columnas de `#libros-tabla` y las 2 de
  `#clientes-tabla`.
- Verificación **manual** en Fase 3 (decisión §9-i: sin TDD, sin runner, sin
  tests automatizados; PDF p. 6–7 y PROMPT4.md:125): doble clic sobre `file://`,
  consola limpia, altas válidas e inválidas, ISBN duplicado con y sin guiones,
  email duplicado con mayúsculas y espacios, precio cero/negativo/no numérico,
  sin autor, referencias inexistentes, listas y mensajes (incluidos los
  literales LN/CN, `aria-invalid` y `aria-describedby`), y recarga para
  comprobar que los datos iniciales se restablecen. La evidencia de cada
  comprobación (incluida la recarga) se documenta en la Fase 3. Sin tests
  automatizados ni servidor.

## 8. Criterios de aceptación vinculados a requisitos

- [ ] **CA-01** — Las opciones de editorial y género y los checkboxes de autores
  se generan desde `ElTintero.datos`; existe un checkbox por cada uno de los 5
  autores con `id="libros-autor-<id>"`; «Sin clasificar» se guarda como
  `generoId: null` (**R-01, R-02**).
- [ ] **CA-02** — Un alta de libro válida agrega el registro con id único, lo
  muestra en `#libros-tabla` sin recargar, limpia el formulario y muestra
  `#libros-mensaje-ok`; la tabla resuelve editorial, género y autores y formatea
  el precio con `formatearPrecio` (**R-02, R-07**).
- [ ] **CA-03** — Se rechazan sin agregar registros: título o ISBN vacíos/solo
  espacios, precio `0`, negativo, vacío o no numérico, editorial vacía o
  inexistente, género inexistente, ningún autor y autor inexistente; cada caso
  muestra el literal LN correspondiente (§5.6), marca `aria-invalid` y
  `aria-describedby` y conserva lo ingresado (**R-03, R-06**).
- [ ] **CA-04** — El ISBN `978-84-376-0494-7` y sus variantes `9788437604947` y
  ` 978 84 376 0494 7 ` se detectan como duplicado del libro existente; un ISBN
  nuevo se acepta (**R-03**).
- [ ] **CA-05** — Un alta de cliente válida agrega el registro, lo muestra en
  `#clientes-tabla` sin recargar y muestra `#clientes-mensaje-ok`; se rechazan
  nombre vacío, email vacío, email con formato inválido y email duplicado
  comparado con espacios exteriores y mayúsculas (por ejemplo
  ` Ana.Perez@Example.com ` contra `ana.perez@example.com`); cada rechazo
  muestra el literal CN correspondiente (§5.6) y marca `aria-invalid` y
  `aria-describedby` (**R-04, R-05, R-06**).
- [ ] **CA-06** — Si se vacía el modelo a propósito, se muestra `#libros-vacio`/
  `#clientes-vacio`; los mensajes de éxito y error nunca se muestran a la vez;
  `verificarIntegridad()` sigue sin reportar errores después de las altas
  (**R-06, R-07**).
- [ ] **CA-07** — No se usa `innerHTML` con datos; los valores se insertan como
  texto; no hay errores en consola al abrir ni al operar (**R-08**).
- [ ] **CA-08** — Apertura directa por `file://` funciona sin servidor, npm ni
  librerías; los scripts nuevos son externos, clásicos, con `defer` y cargan
  después de `data.js` (**R-09**).
- [ ] **CA-09** — El SPEC documenta las funciones nuevas de `ElTintero`
  (`ElTintero.consultas` para búsquedas/normalización/unicidad,
  `ElTintero.registros` para ids y altas, `ElTintero.altas` para la vista de
  `js/altas.js`), su contrato y los ganchos para los Ej. 5–6, y deja explícito
  que sin persistencia las altas no sobreviven a la recarga ni pasan a otras
  vistas (**R-10**).
- [ ] Se cubre todo el alcance aprobado y no se incorpora trabajo excluido.
- [ ] Se respetan las tecnologías, dependencias y convenciones permitidas.
- [ ] Las comprobaciones exigidas se ejecutarán en Fase 3 y sus resultados se
  informarán con evidencia; **ningún control se presenta como aprobado sin
  ejecutarse**.
- [ ] Supuestos y limitaciones quedan identificados (§9); no quedan placeholders
  pendientes (decisiones a–k resueltas).

## 9. Decisiones resueltas por el usuario y supuestos

### Decisiones resueltas por el usuario (2026-10-20)

Las decisiones a–k fueron respondidas por el usuario o por el orquestador el
2026-10-20 y se aplican tal cual en este SPEC. No quedan decisiones ni datos
pendientes.

#### a. Organización de archivos JS — RESUELTA (2026-10-20)

- **Respuesta del usuario:** un único `js/altas.js` para ambos formularios
  (descartada la opción de separar vistas por formulario y la de un módulo de
  validaciones aparte, así como los helpers duplicados por vista).
- **Consecuencia aplicada:** §5.1 y §5.2 describen un solo archivo de vista que
  detecta qué formulario existe en la página; los helpers de validación/formato
  y de presentación de mensajes son funciones privadas del IIFE de
  `js/altas.js`. El namespace se reorganiza sin colisión: `js/data.js` expone
  mutaciones e ids en `ElTintero.registros` y consultas en `ElTintero.consultas`;
  `js/altas.js` expone la vista en `ElTintero.altas`.

#### b. Uso de `novalidate` — RESUELTA (2026-10-20)

- **Respuesta del usuario:** sí, agregar `novalidate` a `#libros-form` y a
  `#clientes-form`.
- **Consecuencia aplicada:** el requisito deja de ser condicional (§3, §5.8, §7
  y delta specs). El atributo se agrega al HTML en Fase 3; la validación propia
  queda a cargo del handler de `submit`.

#### c. Presentación de errores — RESUELTA (2026-10-20)

- **Respuesta del usuario:** un único resumen en `#libros-mensaje-error` /
  `#clientes-mensaje-error` más `aria-invalid="true"` en los controles
  afectados.
- **Consecuencia aplicada:** aprobado sin condición en §5.6 y §6; los delta
  specs incluyen escenarios observables de `aria-invalid` y `aria-describedby`
  (decisión k) y el mensaje se escribe con `textContent`. No se agregan
  contenedores de error por campo.

#### d. Normalización del ISBN — RESUELTA (2026-10-20)

- **Respuesta del usuario:** solo quitar espacios y guiones, como dice la
  consigna; **no** pasar la `X` final a mayúsculas.
- **Consecuencia aplicada:** §5.5 y los delta specs definen `normalizarIsbn` =
  recortar + quitar todos los espacios y guiones, sin cambio de caja. El email
  sigue comparándose case-insensitive. Se registra el riesgo en «Riesgos y
  límites»: un ISBN que difiera solo en la caja de la `X` final no se detecta
  como duplicado. Es una decisión del usuario, no un default técnico.

#### e. Persistencia del valor ingresado — RESUELTA (2026-10-20)

- **Respuesta del usuario:** guardar ISBN y email recortados tal como se
  ingresan.
- **Consecuencia aplicada:** §5.3 y los delta specs fijan que el dato guardado
  es el recortado original; la unicidad siempre compara normalizado.

#### f. `#ventas-cliente` / `#ventas-libro` — RESUELTA (2026-10-20)

- **Respuesta del usuario:** no actualizarlos en este change (es Ej. 5).
- **Consecuencia aplicada:** se mantiene la exclusión (§3, §5.7) sin
  condicionalidad.

#### g. Formato de precio en `#libros-tabla` — RESUELTA (2026-10-20)

- **Respuesta del usuario:** sin decimales, con `formatearPrecio` del Ej. 3.
- **Consecuencia aplicada:** aprobado; §5.6 y los delta specs exigen
  `ElTintero.consultas.formatearPrecio`.

#### h. Orden de las filas tras un alta — RESUELTA (2026-10-20)

- **Respuesta del usuario:** al final, en orden de inserción.
- **Consecuencia aplicada:** aprobado; las filas nuevas se agregan al final en
  §5.6 y en los delta specs.

#### i. TDD vs. verificación manual — RESUELTA (2026-10-20)

- **Respuesta del usuario:** sin TDD; verificación manual según el brief.
- **Consecuencia aplicada:** no se agrega runner, dependencia ni test
  automatizado. La verificación es manual en navegador sobre `file://` y su
  evidencia (incluida la recarga que restablece los datos iniciales) se
  documenta en la Fase 3 (§7).

#### j. Literales de mensajes — RESUELTA (2026-10-20)

- **Decisión:** se fijan los literales LN/CN del catálogo de §5.6, en español
  rioplatense, en el orden de los campos del formulario. No se admiten variantes
  ni sinónimos.
- **Consecuencia aplicada:** `registrarLibro`/`registrarCliente` devuelven
  `errores` con `campo` y el literal correspondiente; la vista concatena los
  mensajes en un único `textContent` separado por un espacio, en el orden de los
  campos (libros: título → ISBN → precio → editorial → género → autores;
  clientes: nombre → email). Un mismo mensaje no se repite aunque varios autores
  sean inválidos: LN-12 se informa una sola vez.

#### k. `aria-describedby` — RESUELTA (2026-10-20): sí

- **Decisión:** además de `aria-invalid="true"`, cada control afectado por un
  error lleva `aria-describedby="libros-mensaje-error"` o
  `aria-describedby="clientes-mensaje-error"` según la vista.
- **Consecuencia aplicada:** cuando no hay error (alta válida o mensajes
  ocultos) se retiran **ambos** atributos del control. Los contenedores
  `#libros-mensaje-error` / `#clientes-mensaje-error` conservan su
  `aria-live="polite"`; no se agrega `role="alert"` ni contenedores nuevos por
  campo.

### Información pendiente

Ninguna: las decisiones a–k están resueltas (2026-10-20). El modelo, los `id` y
los contenedores están verificados en el código real.

### Supuestos declarados

1. Los nombres de archivo (§5.1) y de funciones (§5.4) son el contrato
   acordado; el comportamiento observable es la operación y su resultado.
2. Los ejemplos de ISBN/email de los escenarios son ficticios y no se agregan
   al modelo inicial.
3. La tabla de libros mostrará 6 filas al cargar (no 3) porque el modelo tiene
   6 libros, aunque el HTML actual tenga 3 filas estáticas.
4. El estado de lista vacía se prueba vaciando el modelo en consola, porque no
   existe UI de edición/borrado (excluida). No se implementa un botón para
   vaciar.
5. `verificarIntegridad()` se ejecuta al cargar `data.js`; las altas no la
   vuelven a ejecutar automáticamente, pero el criterio CA-06 se comprueba
   llamándola manualmente desde consola o en el render.
6. La inserción de autores en la tabla se muestra como lista separada por
   comas, sin ordenar alfabéticamente: se respeta el orden de `autoresIds`.
7. No se agrega ordenamiento, paginación ni búsqueda a las tablas de Libros/
   Clientes: no están en el alcance.

### Riesgos y límites

1. **Riesgo de validación nativa — mitigado:** `novalidate` está aprobado en
   ambos formularios (decisión §9-b), por lo que el navegador no bloquea el
   `submit` antes del handler y los mensajes propios se muestran siempre.
2. **Riesgo de alcance:** el modelo es público y mutable; la capa de vista debe
   limitarse a llamar a `ElTintero.registros` y no hacer `push` directo (R-10).
3. **Límite de persistencia:** recargar restablece los datos iniciales; las
   altas no pasan a `catalogo.html` ni a `ventas.html` (Ej. 6). No es un defecto
   de este change.
4. **Límite del ISBN — dígito de control:** no se valida dígito de control; un
   ISBN con formato normalizado pero dígito incorrecto se acepta si no está
   duplicado (PDF p. 4).
5. **Límite del ISBN — caja de la `X` final:** R-03 del brief pedía comparar el
   ISBN «sin distinguir mayúsculas», pero la decisión del usuario (2026-10-20,
   §9-d) es aplicar **solo** la regla de la consigna (quitar espacios y
   guiones). Consecuencia aceptada: un ISBN que difiera únicamente en la caja de
   la `X` final **no** se detecta como duplicado. Es una decisión del usuario,
   no un default técnico.
6. **Límite del email:** la validación es práctica, no RFC completa; un email
   con formato aceptable pero no entregable se acepta (R-04).
