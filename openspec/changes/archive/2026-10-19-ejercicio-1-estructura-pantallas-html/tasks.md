# Tasks — ejercicio-1-estructura-pantallas-html

> Fase: PLAN (Fase 2 de PROMPT1 §Fase 2). Checklist de tareas atómicas.
> Estado: implementadas y verificadas en Fase 3 (T-08 y T-09 PASS).
> Base normativa: `proposal.md`, `design.md`, `specs/{catalogo,libros,clientes,ventas,historial}/spec.md`.
> Decisiones cerradas: multi-página (6 HTMLs), autores con checkboxes
> (`fieldset`/`legend`, `name="autores"`, `id` `libros-autor-<id>`), historial
> con detalle en sección aparte por venta.

## Convenciones comunes a todas las tareas de HTML

- HTML5 semántico nativo; atributos en minúsculas; indentación de 2 espacios.
- Estructura por página: `header` (título + `nav`) → `main` (`section` de la
  vista) → `footer`; `h1` por página, sin saltos de nivel.
- `nav` idéntico en los 6 archivos: enlaces a `catalogo.html`, `libros.html`,
  `clientes.html`, `ventas.html`, `historial.html`.
- `id` en formato `vista-elemento`, únicos dentro de cada archivo.
- Sin JS, sin CDNs, sin servidor, sin build; solo HTML5 (+ carpetas
  placeholder). Datos estáticos marcados como ejemplo.

---

## T-01 — Estructura de carpetas locales

- [x] **T-01**
- **Resultado esperado:** carpetas `css/`, `js/` y `assets/` existen en la
  raíz del proyecto, cada una con un archivo placeholder (p. ej.
  `.gitkeep` o `placeholder.txt`) para que no queden vacías.
- **Requisito / CA cubiertos:** R-09 (carpetas mínimas o con placeholder).
- **Archivos / componentes:** crear directorios `css/`, `js/`, `assets/` y un
  placeholder en cada uno. No se crea CSS/JS real (excluido del alcance).
- **Dependencias y orden:** ninguna. Es la tarea 1 de 9.
- **Comprobación concreta:** explorar el árbol de carpetas en el explorador de
  archivos o con `dir`/`ls` y verificar que las 3 carpetas existen y no están
  vacías (contienen el placeholder).
- **Evidencia:** `dir /b css js assets` → `.gitkeep` en las tres carpetas.

## T-02 — Página de entrada `index.html`

- [x] **T-02**
- **Resultado esperado:** `index.html` en la raíz con `header` (nombre de la
  librería en `h1`, p. ej. «El Tintero» — ejemplo), el `nav` idéntico con los
  5 enlaces, `main` con un párrafo de bienvenida que enlace a
  `catalogo.html`, y `footer`.
- **Requisito / CA cubiertos:** R-01 (nav con 5 href válidos), R-08
  (semántica header/nav/main/footer), R-09 (entrada + multi-página).
- **Archivos / componentes:** crear `index.html`.
- **Dependencias y orden:** después de T-01. Los destinos de los enlaces se
  crean en T-03…T-07.
- **Comprobación concreta:** abrir `index.html` con doble clic (`file://`);
  inspeccionar el DOM: existen `header`, `nav` con exactamente 5 `a[href]`
  apuntando a los 5 `.html`, `main` y `footer`; el enlace de bienvenida apunta
  a `catalogo.html`.
- **Evidencia:** `index.html` creado; nav con 5 enlaces y bienvenida a
  `catalogo.html`; render verificado por T-09.

## T-03 — Vista Catálogo (`catalogo.html`)

- [x] **T-03**
- **Resultado esperado:** vista Catálogo con `h1`/`h2` del título de la
  librería; formulario buscador con `label for="catalogo-titulo"` +
  `input#catalogo-titulo[type=search]` + botones «Buscar por título» y
  «Limpiar búsqueda»; contenedor `catalogo-lista` con 3 `article` de libros de
  ejemplo (cada uno con título, ISBN, editorial, género, autores, precio y
  `data-libro-id`; uno con género literal «Sin clasificar» y otro con varios
  autores); contenedores `catalogo-vacio` y `catalogo-sin-resultados` con
  `aria-live="polite"`; `nav` idéntico + `footer`.
- **Requisito / CA cubiertos:** R-02 (contenido del catálogo), R-07 (estados
  vacío / sin resultados en el DOM), R-08 (calidad semántica), R-10 parcial
  (`data-libro-id`).
- **Archivos / componentes:** crear `catalogo.html`.
- **Dependencias y orden:** después de T-02.
- **Comprobación concreta:** doble clic sobre `catalogo.html` + inspección
  DOM: el formulario tiene `label for="catalogo-titulo"` y los 2 botones con
  texto de acción; los 3 libros muestran los 6 datos y al menos uno muestra
  «Sin clasificar» literal; existen en el DOM `catalogo-vacio` y
  `catalogo-sin-resultados` con `aria-live="polite"`; cada libro tiene
  `data-libro-id` único.
- **Evidencia:** `catalogo.html` creado; `catalogo-vacio` y
  `catalogo-sin-resultados` con `aria-live="polite"` verificados en el DOM;
  «Sin clasificar» presente; T-08 PASS para ganchos.

## T-04 — Vista Libros (`libros.html`)

- [x] **T-04**
- **Resultado esperado:** vista Libros con `form#libros-form` conteniendo
  `libros-titulo`, `libros-isbn`, `libros-precio[type=number]`,
  `libros-editorial` (select), `libros-genero` (select con opción «Sin
  clasificar»), cada campo con `label for`; autores como
  `<fieldset><legend>Autores</legend>` con 3 checkboxes
  `name="autores"` con `id` `libros-autor-1`, `libros-autor-2`,
  `libros-autor-3` y su `label` asociado (al menos uno marcado); botón
  «Registrar libro»; `table#libros-tabla` con `thead` (`th scope="col"`:
  Título, ISBN, Editorial, Género, Autores, Precio) y filas de ejemplo
  coherentes con el catálogo; contenedores `libros-vacio`,
  `libros-mensaje-ok`, `libros-mensaje-error` con `aria-live="polite"`;
  `nav` idéntico + `footer`.
- **Requisito / CA cubiertos:** R-03 (formulario + tabla), R-07 (mensajes
  vacío/ok/error), R-08 (labels, thead, botón descriptivo), R-10 (ganchos
  `id`/`name` estables).
- **Archivos / componentes:** crear `libros.html`.
- **Dependencias y orden:** después de T-02.
- **Comprobación concreta:** doble clic + inspección DOM: recorrer el
  formulario solo con lectura del DOM — cada control tiene `label for` que
  coincide con su `id`; los 3 checkboxes comparten `name="autores"` y tienen
  ids únicos `libros-autor-1..3`; el select de género contiene la opción
  «Sin clasificar»; la tabla tiene las 6 columnas con `th scope="col"`; los
  contenedores `libros-vacio`, `libros-mensaje-ok`, `libros-mensaje-error`
  existen en el DOM con `aria-live="polite"`.
- **Evidencia:** `libros.html` creado; `fieldset`/`legend` «Autores» con
  checkboxes `libros-autor-1..3` y `name="autores"` verificados; T-08 PASS.

## T-05 — Vista Clientes (`clientes.html`)

- [x] **T-05**
- **Resultado esperado:** vista Clientes con `form#clientes-form` conteniendo
  `clientes-nombre` (text) y `clientes-email` (type=email), ambos con
  `label for`; botón «Registrar cliente»; `table#clientes-tabla` con `thead`
  (`th scope="col"`: Nombre completo, Email) y 2 filas de ejemplo; los 3
  mensajes `clientes-vacio`, `clientes-mensaje-ok`, `clientes-mensaje-error`
  con `aria-live="polite"`; `nav` idéntico + `footer`.
- **Requisito / CA cubiertos:** R-04 (formulario + tabla), R-07 (mensajes),
  R-08 (calidad), R-10 parcial (ganchos `clientes-nombre`, `clientes-email`).
- **Archivos / componentes:** crear `clientes.html`.
- **Dependencias y orden:** después de T-02.
- **Comprobación concreta:** doble clic + inspección DOM: `label for`
  coincide con `id` en ambos campos; el email usa `type="email"`; la tabla
  tiene exactamente las dos columnas con `th scope="col"` y 2 filas de
  ejemplo; los 3 contenedores de mensaje existen con `aria-live="polite"`.
- **Evidencia:** `clientes.html` creado; labels y tabla de 2 columnas
  verificadas; T-08 PASS.

## T-06 — Vista Ventas (`ventas.html`)

- [x] **T-06**
- **Resultado esperado:** vista Ventas con `label` + `select#ventas-cliente`
  (opciones coherentes con los clientes de ejemplo), `select#ventas-libro` +
  `input#ventas-cantidad[type=number]` + botón «Agregar renglón»;
  `table#venta-renglones` con `thead` (`th scope="col"`: Libro, Cantidad,
  Precio unitario, Subtotal, Acciones) y al menos un renglón de ejemplo con
  `data-libro-id` y `data-cantidad` y control de quitar/cambiar; bloque
  `ventas-resumen` con `ventas-total` y botón «Confirmar venta»; mensajes
  `ventas-mensaje-ok` y `ventas-mensaje-error` con `aria-live="polite"`;
  `nav` idéntico + `footer`. Sin lógica de cálculo ni confirmación (Ej. 5,
  excluido).
- **Requisito / CA cubiertos:** R-05 (cliente + renglones + resumen), R-07
  (mensajes), R-08 (calidad), R-10 (`data-libro-id`, `data-cantidad`,
  `ventas-total`).
- **Archivos / componentes:** crear `ventas.html`.
- **Dependencias y orden:** después de T-02.
- **Comprobación concreta:** doble clic + inspección DOM: selector de cliente
  etiquetado; trío libro + cantidad + «Agregar renglón» presentes; la tabla
  tiene las 5 columnas con `th scope="col"` y el renglón de ejemplo expone
  `data-libro-id` coincidente con un libro del catálogo y `data-cantidad`;
  `ventas-total` y «Confirmar venta» visibles en `ventas-resumen`; los 2
  contenedores de mensaje existen con `aria-live="polite"`.
- **Evidencia:** `ventas.html` creado; renglón de ejemplo con
  `data-libro-id="1"` y `data-cantidad="1"` verificado; T-08 PASS.

## T-07 — Vista Historial (`historial.html`)

- [x] **T-07**
- **Resultado esperado:** vista Historial con `table#historial-tabla`
  (`thead` con `th scope="col"`: Identificador, Fecha, Cliente, Total,
  Detalle) y 2 ventas de ejemplo (`data-venta-id` únicos, coherentes con
  clientes y libros); cada fila con `<a href="#historial-detalle-<id>">Ver
  detalle</a>` en la columna Detalle; debajo de la tabla, una
  `section#historial-detalle-<id>` por venta con `<h3>Detalle <ID></h3>`,
  tabla de renglones (Libro, Cantidad, Precio unitario, Subtotal) y enlace
  `<a href="#historial-tabla">Volver al listado</a>`; contenedor
  `historial-vacio` con `aria-live="polite"`; `nav` idéntico + `footer`.
- **Requisito / CA cubiertos:** R-06 (tabla + detalle por venta), R-07
  (lista vacía), R-08 (calidad), R-10 (`data-venta-id`,
  `historial-detalle-<id>`).
- **Archivos / componentes:** crear `historial.html`.
- **Dependencias y orden:** después de T-02.
- **Comprobación concreta:** doble clic + inspección DOM: la tabla tiene las
  5 columnas y cada fila su enlace a `#historial-detalle-<id>`; cada
  `section#historial-detalle-<id>` existe con su `h3`, tabla de renglones y
  «Volver al listado» a `#historial-tabla`; activar «Ver detalle» de una
  venta desplaza/visibiliza su sección sin JavaScript; `historial-vacio`
  existe con `aria-live="polite"`.
- **Evidencia:** `historial.html` creado; columna «Detalle», enlaces
  `#historial-detalle-1/2`, `section#historial-detalle-1` y
  `section#historial-detalle-2`, y «Volver al listado» verificados; T-08 PASS.

## T-08 — Verificación de ganchos y unicidad

- [x] **T-08**
- **Resultado esperado:** diccionario completo de ganchos verificado en los 6
  archivos según la tabla View Contracts de `design.md`: ids
  `vista-elemento`, names estables, `data-libro-id` / `data-cantidad` /
  `data-venta-id` / `historial-detalle-<id>`, mensajes `aria-live`; sin
  ningún `id` repetido dentro de un mismo archivo.
- **Requisito / CA cubiertos:** R-10 (preparación futura Ej. 3–5), R-09
  (formato de ids), R-07 parcial (unicidad de contenedores de estado).
- **Archivos / componentes:** verificar (no modificar salvo corrección)
  `index.html`, `catalogo.html`, `libros.html`, `clientes.html`,
  `ventas.html`, `historial.html`.
- **Dependencias y orden:** después de T-02…T-07 (todos los HTML creados).
- **Comprobación concreta:** por archivo, listar todos los atributos `id`
  (búsqueda en el editor o inspección DOM) y comprobar que no hay
  duplicados; verificar presencia de los ganchos mínimos: en catálogo
  `catalogo-titulo`, `catalogo-lista`, `catalogo-vacio`,
  `catalogo-sin-resultados`, `data-libro-id`×3; en libros `libros-form`,
  `libros-titulo`, `libros-isbn`, `libros-precio`, `libros-editorial`,
  `libros-genero`, `libros-autor-1..3` con `name="autores"`, `libros-tabla`,
  `libros-vacio`, `libros-mensaje-ok`, `libros-mensaje-error`; en clientes
  `clientes-form`, `clientes-nombre`, `clientes-email`, `clientes-tabla`,
  `clientes-vacio`, `clientes-mensaje-ok`, `clientes-mensaje-error`; en
  ventas `ventas-cliente`, `ventas-libro`, `ventas-cantidad`,
  `venta-renglones`, `ventas-resumen`, `ventas-total`,
  `ventas-mensaje-ok`, `ventas-mensaje-error`, `data-libro-id` y
  `data-cantidad` en el renglón; en historial `historial-tabla`,
  `data-venta-id`×2, `historial-detalle-<id>`×2, `historial-vacio`.
- **Evidencia:** PASS — ids únicos por archivo, ganchos `id`/`name`/`data-*`
  completos, labels asociados, `thead` + `th scope="col"` y `nav` idéntico en
  los 6 archivos.

## T-09 — Verificación manual final

- [x] **T-09**
- **Resultado esperado:** recorrido manual completo con evidencia: abrir
  `index.html` con doble clic (`file://`, sin servidor ni npm) y navegar por
  las 5 vistas desde el `nav`, comprobando en cada una su contenido de
  ejemplo, semántica, labels, tablas y mensajes.
- **Requisito / CA cubiertos:** CA-01 (5 vistas alcanzables con contenido
  esperado), CA-06 (apertura directa sin servidor), CA-02, CA-03, CA-04,
  CA-05 (inspección manual completa); R-01, R-08.
- **Archivos / componentes:** verificar los 6 HTML sin modificar (salvo
  corrección de defectos detectados).
- **Dependencias y orden:** última tarea; después de T-08.
- **Comprobación concreta:** (1) doble clic en `index.html` → carga sin
  errores de consola y muestra bienvenida; (2) activar cada uno de los 5
  enlaces del `nav` → se abre el `.html` correspondiente y cada vista
  muestra su contenido de ejemplo; (3) por página: existen
  `header`/`nav`/`main`/`footer`, todo `input`/`select` tiene `label`, toda
  `table` tiene `thead` con `th scope="col"`, los botones describen su
  acción (verbo + objeto); (4) registrar la evidencia (capturas o notas) y
  marcar CA-01…CA-06 solo si se ejecutaron.
- **Evidencia:** PASS — todos los `href` resuelven; renderizado real con Edge
  headless vía `file://` de `index.html` y de las 5 vistas con su contenido
  esperado. Sin `<script>`, `<link>` ni URLs externas.

---

## Orden de ejecución resumido

T-01 → T-02 → (T-03, T-04, T-05, T-06, T-07 en cualquier orden entre sí) →
T-08 → T-09.

## Fuera de alcance (no incluido en este plan)

CSS definitivo, JS (render/filtro/validaciones/cálculos/localStorage),
edit-eliminar, stock, backend, CDNs, README definitivo — pertenecen a los
Ej. 2–6.
