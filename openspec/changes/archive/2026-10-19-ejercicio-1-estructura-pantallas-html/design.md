# Design — ejercicio-1-estructura-pantallas-html

> Fase: SPEC ONLY. Documento de diseño del cambio; no implementa código.
> Precedencia: ante conflicto con `docs/Repaso Primer Parcial.pdf`, vale el PDF.

## Why

El repo no tiene ninguna pantalla implementada y el Ejercicio 1 (20 puntos) es
la base de los Ej. 2–6. Este diseño traduce los 5 delta specs y el
`proposal.md` en un contrato estructural concreto (archivos, semántica,
ganchos `id`/`name`/`data-*`, estados) para que la implementación sea
verificable y los Ej. 3–5 consuman el HTML sin modificarlo.

## Components / Structure

```
index.html            entrada mínima: header + nav + main con bienvenida
catalogo.html         título librería + buscador + listado de libros
libros.html           formulario de alta + tabla de registrados
clientes.html         formulario de alta + tabla de registrados
ventas.html           cliente + renglones + resumen/confirmación
historial.html        tabla de ventas + secciones de detalle
css/  js/  assets/    carpetas mínimas (placeholder) — sin contenido en este change
```

Nav repetido idéntico en los 6 archivos:

```html
<nav>
  <a href="catalogo.html">Catálogo</a>
  <a href="libros.html">Libros</a>
  <a href="clientes.html">Clientes</a>
  <a href="ventas.html">Ventas</a>
  <a href="historial.html">Historial</a>
</nav>
```

**index.html (propuesta clara):** portada mínima — `header` con nombre de la
librería, el mismo `nav`, y un `main` con un párrafo de bienvenida que enlaza
a `catalogo.html`. No duplica contenido de las vistas; solo cumple el rol de
entrada y de prueba de R-01.

## HTML Semantics & Conventions

- Cada página: `header` (título + `nav`) → `main` (una `section` por vista) →
  `footer`; encabezados sin saltos (`h1` por página, `h2`/`h3` dentro).
- Todo `input`/`select` con `label for` ↔ `id` coincidente; autores en
  `fieldset`/`legend`.
- Toda `table` con `thead` y `th scope="col"`.
- Botones con texto de acción (verbo + objeto): «Registrar libro»,
  «Agregar renglón», «Confirmar venta».
- Mensajes en contenedores con `id` estable y `aria-live="polite"`.
- `id` en formato `vista-elemento` (ej. `catalogo-buscador`); únicos por
  documento (multi-página: la unicidad es por archivo).
- Atributos en minúsculas; indentación de 2 espacios; nombres de archivo en
  minúsculas con guiones.

## View Contracts

| Vista | ids / names mínimos (spec origen) |
| --- | --- |
| index | `nav` con los 5 `href` a `.html` (R-01) |
| catalogo | `catalogo-titulo` (input search), botones Buscar/Limpiar, `catalogo-lista`, `catalogo-vacio`, `catalogo-sin-resultados`; cada libro `data-libro-id` (R-02, R-07) |
| libros | `form#libros-form`: `libros-titulo`, `libros-isbn`, `libros-precio`, `libros-editorial`, `libros-genero`; checkboxes `name="autores"` con `id` `libros-autor-1`, `libros-autor-2`, `libros-autor-3` (+ label c/u); `table#libros-tabla`; `libros-vacio`, `libros-mensaje-ok`, `libros-mensaje-error` (R-03, R-07, R-10) |
| clientes | `form#clientes-form`: `clientes-nombre`, `clientes-email`; `table#clientes-tabla`; `clientes-vacio`, `clientes-mensaje-ok`, `clientes-mensaje-error` (R-04, R-07) |
| ventas | `ventas-cliente` (select), `ventas-libro` (select), `ventas-cantidad` (number), `table#venta-renglones` (cada renglón: `data-libro-id`, `data-cantidad`), `ventas-resumen`, `ventas-total`, `ventas-mensaje-ok`, `ventas-mensaje-error` (R-05, R-07, R-10) |
| historial | `table#historial-tabla` (filas con `data-venta-id` y enlace `#historial-detalle-<id>`), `section#historial-detalle-<id>` por venta, `historial-vacio` (R-06, R-07, R-10) |

## Static examples

Hardcodeados y marcados como ejemplo (comentario HTML y/o texto «(ejemplo)» /
«Datos de ejemplo»), coherentes entre vistas:

- 3 libros (uno con género «Sin clasificar» literal, uno con varios autores);
  ids `libros-autor-1..3` con al menos uno marcado.
- 2 clientes (nombre, email).
- 2 ventas (`data-venta-id` 1 y 2) cuyos renglones referencian libros y
  clientes de ejemplo.

## Messages / States

| Estado | Contenedores | Regla |
| --- | --- | --- |
| Lista vacía | `catalogo-vacio`, `libros-vacio`, `clientes-vacio`, `historial-vacio` | en el DOM con `aria-live="polite"`; ocultos/vacíos con ejemplos presentes |
| Sin resultados | `catalogo-sin-resultados` | en el DOM con `aria-live="polite"` |
| Operación ok | `libros-mensaje-ok`, `clientes-mensaje-ok`, `ventas-mensaje-ok` | `aria-live="polite"`, vacíos por defecto |
| Operación rechazada | `libros-mensaje-error`, `clientes-mensaje-error`, `ventas-mensaje-error` | `aria-live="polite"`; texto jamás depende solo del color |

Si un mensaje lleva texto de ejemplo, este incluye «(ejemplo)» para no
confundirlo con un estado real. Sin validación ni `preventDefault` (Ej. 4).

## Navigation

Multi-página: `href` siempre a archivos `.html` (no anclas entre vistas). Sin
JS: el navegador resuelve la navegación. El `nav` es idéntico en los 6
archivos; cada `href` coincide con un archivo existente.

## Historial detail (DOM-only, sin JS)

Anclas puras del navegador:

1. En la columna Detalle de cada fila: `<a href="#historial-detalle-<id>">Ver detalle</a>`.
2. Debajo de `historial-tabla`, una `section#historial-detalle-<id>` por venta
   con `<h3>Detalle <ID></h3>`, tabla de renglones (Libro, Cantidad, Precio
   unitario, Subtotal) y `<a href="#historial-tabla">Volver al listado</a>`.
3. Activar el enlace desplaza/visibiliza la sección destino (fragment
   identifier nativo). Sin JavaScript, sin mostrar/ocultar lógico.

## Non-functional

- Apertura directa con doble clic de `index.html`; funciona con `file://`.
- Sin npm, sin servidor, sin build, sin CDNs, sin dependencias externas.
- Solo HTML5 nativo (+ carpetas `css/`/`js/`/`assets/` placeholder).
- Legible con lectura del DOM (CA-05): labels, th, textos de acción.

## Future-proofing notes (Ej. 3–5)

- Los ganchos del contrato (`id`/`name`/`data-libro-id`/`data-cantidad`/
  `data-venta-id`/mensajes `aria-live`) son el API de los Ej. 3–5: JS
  poblará/filtrará/validará/calculará sobre estos nodos sin tocar el HTML.
- Ej. 3: render y filtro sobre `catalogo-lista`, `libros-tabla`,
  `clientes-tabla` usando `data-libro-id`.
- Ej. 4: validaciones sobre `libros-form`/`clientes-form` y mensajes
  `-mensaje-ok`/`-mensaje-error`.
- Ej. 5: subtotales/total sobre `venta-renglones` (`data-libro-id`,
  `data-cantidad`) y `ventas-total`; precio histórico desde
  `historial-detalle-<id>`.
- Cambiar cualquier `id`/`name`/`data-*` aquí especificado requeriría enmendar
  esta especificación.
