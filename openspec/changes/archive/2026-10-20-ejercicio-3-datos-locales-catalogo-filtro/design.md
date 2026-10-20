# Design — ejercicio-3-datos-locales-catalogo-filtro

## Context

Ver `proposal.md` — Why y §5. Estado real del producto al planificar:

- `catalogo.html` contiene `form#catalogo-buscador`, `input#catalogo-titulo`
  (`type=search`, `name=titulo`), botones `type=submit` («Buscar por título») y
  `type=reset` («Limpiar búsqueda»), y los contenedores
  `#catalogo-vacio.mensaje.mensaje-vacio[aria-live=polite][hidden]`,
  `#catalogo-sin-resultados.mensaje.mensaje-info[aria-live=polite][hidden]` y
  `#catalogo-lista.grilla-tarjetas`. No hay `<script>` en ningún HTML.
- `#catalogo-lista` contiene **3** `article.card.libro-tarjeta` estáticos con
  `data-libro-id` 1, 2 y 3 (el libro 3 muestra «Sin clasificar»; el libro 2
  lista 3 autores). Esos son los únicos datos de libros fuera del modelo.
- `css/styles.css` ya define `.grilla-tarjetas` (`display: grid`), `.card`,
  `.libro-tarjeta` y `.mensaje*`. **No se requiere CSS nuevo** y el plan no lo
  toca.
- `js/` solo contiene `.gitkeep`. Sin npm, sin build, sin servidor; apertura
  por `file://`.

Restricciones que condicionan el diseño: scripts clásicos externos con
`defer`, sin módulos ES (bloqueados por CORS en `file://`), sin librerías ni
`fetch`, sin persistencia, y separación datos / consultas / filtro / render /
eventos.

## Goals / Non-Goals

**Goals:**

- Un modelo en memoria con 5 colecciones, ids numéricos estables y relaciones
  por id, con comprobación de integridad no bloqueante.
- Un namespace único `ElTintero` que exponga el contrato de `proposal.md` §5.7
  sin contaminar el global.
- Render determinista del catálogo desde el modelo, con los 6 datos por
  tarjeta y sin markup de libros en el HTML.
- Filtro por título aplicado **solo** en `submit`, y máquina de estados
  normal / vacío / sin resultados mutuamente excluyente.
- Inserción de todo dato y del término con `createElement`/`textContent`.

**Non-Goals (nivel diseño):**

- Altas, bajas, edición, validaciones de alta, selectores poblados (Ej. 4).
- Ventas, subtotales, totales, historial (Ej. 5).
- Persistencia, recuperación y README definitivo (Ej. 6).
- Render dinámico de Libros, Clientes, Ventas e Historial.
- Cambios de CSS, de estructura semántica o de navegación.
- Tests automatizados, servidor, build o dependencias.

## Decisions

### 1. Arquitectura de archivos y encapsulamiento

Dos archivos, un solo global:

| Archivo | Responsabilidad | Expone |
| --- | --- | --- |
| `js/data.js` | Colecciones, `verificarIntegridad`, consultas, `formatearPrecio` | `ElTintero.datos`, `ElTintero.consultas` |
| `js/catalogo.js` | Filtro, render, mensajes de estado, eventos del buscador | `ElTintero.catalogo` |

Cada archivo es una IIFE con `"use strict"`:

```js
(function () {
  "use strict";
  window.ElTintero = window.ElTintero || {};
  // ...
}());
```

`data.js` **crea** el namespace; `catalogo.js` lo **reutiliza** (se carga
después). No se declaran variables sueltas en el global: solo
`window.ElTintero`. Los helpers internos (`crearTarjetaLibro`,
`mostrarCatalogoVacio`, `mostrarSinResultados`, `ocultarMensajes`,
`crearParrafo`) quedan privados dentro de la IIFE de `catalogo.js` y **no**
forman parte del contrato público; los Ej. 4–6 consumen el contrato de §5.7.

### 2. Orden de carga y garantías de `defer`

Al final del `body`, en este orden:

```html
<script defer src="js/data.js"></script>
<script defer src="js/catalogo.js"></script>
```

- Los scripts clásicos con `defer` se ejecutan **en orden de aparición**,
  después de parsear el documento y **antes** de `DOMContentLoaded`. Por eso
  `data.js` define el modelo antes de que `catalogo.js` lo consuma, y ambos
  encuentran el DOM completo: **MUST NOT** usarse `DOMContentLoaded` ni
  listeners de `load`.
- `catalogo.js` invoca `ElTintero.catalogo.iniciarCatalogo()` al final de su
  IIFE (una sola vez, en carga).
- **No se usan módulos ES** (`type="module"`): bajo `file://` el origen es
  `null` y el navegador bloquea la carga de módulos por CORS. Los scripts
  clásicos comparten el objeto global, que es justamente el canal del
  namespace.

### 3. Contrato de la interfaz pública (proposal §5.7)

Sin nombres nuevos en el contrato. Todas las funciones son síncronas y no
lanzan excepciones con los datos de ejemplo.

| Firma | Parámetros | Retorno | Efecto |
| --- | --- | --- | --- |
| `ElTintero.datos` | — | `{ libros, editoriales, generos, autores, clientes }` | Objeto con las 5 colecciones mutables en memoria (referencias directas, sin copia), listas para el Ej. 4 |
| `consultas.obtenerLibros()` | — | `Array<Libro>` (referencia al array del modelo) | Ninguno |
| `consultas.obtenerClientes()` | — | `Array<Cliente>` (referencia al array del modelo) | Ninguno |
| `consultas.buscarEditorialPorId(id)` | `id: number` | `Editorial \| undefined` | Ninguno; `undefined` si no existe, sin excepción |
| `consultas.buscarGeneroPorId(id)` | `id: number` | `Genero \| undefined` | Ninguno; `undefined` si no existe, sin excepción |
| `consultas.buscarAutoresPorIds(ids)` | `ids: number[]` | `Array<Autor>` resueltos, en el orden de `ids` | Ninguno; omite ids inexistentes (el render los informa) |
| `consultas.formatearPrecio(precio)` | `precio: number` | `string` (`"$18.500"`) | Ninguno |
| `consultas.verificarIntegridad()` | — | `string[]` (vacío si todo resuelve) | Registra **cada** error con `console.error`; no interrumpe el render |
| `catalogo.filtrarLibrosPorTitulo(libros, termino)` | `libros: Libro[]`, `termino: string` | `Libro[]` nuevo (no muta la entrada) | Ninguno |
| `catalogo.renderizarCatalogo(libros)` | `libros: Libro[]` | `undefined` | Vacía y repuebla `#catalogo-lista`; ajusta mensajes de estado |
| `catalogo.iniciarCatalogo()` | — | `undefined` | Render inicial + registro de listeners `submit` y `reset` |

**`verificarIntegridad()` — reglas y contrato:**

- Devuelve un array de mensajes legibles (`string[]`), vacío si no hay errores.
- Registra cada mensaje con `console.error` (uno por error) y **no** lanza ni
  corta el render: `iniciarCatalogo()` continúa siempre.
- Comprueba: ids duplicados en cada colección; `editorialId` inexistente;
  `generoId` no `null` e inexistente; `autoresIds` vacío o con ids
  inexistentes; `precio` que no sea número finito.
- `generoId: null` **no** es error.
- Se ejecuta una vez al final de `data.js` (con los datos de ejemplo debe dar
  `[]` y consola limpia) y queda disponible para re-ejecutarla en consola.

**Fallbacks de datos inválidos en el render (no rompen la tarjeta):**

| Caso | Comportamiento |
| --- | --- |
| `generoId === null` o género inexistente | Muestra el literal exacto «Sin clasificar» |
| Editorial inexistente | Muestra «Editorial no disponible» |
| Autor inexistente en `autoresIds` | Se omite ese `li` y se informa el faltante por `console.error`; se listan los autores que sí resuelven |
| `autoresIds` vacío | No se agrega ningún `li`; se informa por `console.error` |

Los fallbacks son de render; la fuente de verdad de los errores sigue siendo
`verificarIntegridad()`.

### 4. Flujo de datos end-to-end

```
data.js (IIFE)
  define datos.libros/editoriales/generos/autores/clientes
  define consultas.*
  verificarIntegridad()          → string[] + console.error por error (no corta)
        │
catalogo.js (IIFE)
  iniciarCatalogo()
    ├─ renderizarCatalogo(ElTintero.datos.libros)      ← carga inicial
    └─ registra submit y reset en form#catalogo-buscador

submit (Enter o botón «Buscar por título»)
  preventDefault()
  termino = input#catalogo-titulo.value
  filtrados = filtrarLibrosPorTitulo(datos.libros, termino)
  renderizarCatalogo(filtrados)
  si datos.libros.length === 0        → estado vacío (ya resuelto por render)
  si filtrados.length === 0           → mostrarSinResultados(termino.trim())
  si filtrados.length > 0             → ambos mensajes ocultos

reset («Limpiar búsqueda»)
  renderizarCatalogo(datos.libros)    ← catálogo completo + mensajes ocultos
  (el navegador vacía el campo como acción por defecto del reset)
```

Detalle: en el handler de `reset` **no** se lee `input.value`, porque el evento
`reset` se dispara antes de que el navegador aplique la limpieza por defecto.
Solo se re-renderiza el catálogo completo; el campo se vacía solo.

### 5. Máquina de estados de visibilidad

Tres estados, mutuamente excluyentes. La visibilidad de los **mensajes** se
controla únicamente con el atributo `hidden`; no se toca CSS ni `display`.

| Estado | Condición | `#catalogo-lista` | `#catalogo-vacio` | `#catalogo-sin-resultados` |
| --- | --- | --- | --- | --- |
| Normal | `datos.libros.length > 0` y `filtrados.length > 0` | N tarjetas | `hidden` | `hidden` |
| Vacío | `datos.libros.length === 0` | 0 hijos | visible | `hidden` |
| Sin resultados | `datos.libros.length > 0` y `filtrados.length === 0` | 0 hijos | `hidden` | visible con el término |

- `renderizarCatalogo(libros)` vacía `#catalogo-lista` y oculta ambos mensajes;
  si `libros.length === 0` y el modelo también está vacío, muestra
  `#catalogo-vacio`. El estado «sin resultados» lo activa el handler de
  `submit` con el texto del término (que `renderizarCatalogo` no conoce).
- **Decisión técnica:** `#catalogo-lista` **MUST NOT** ocultarse con `hidden`.
  La regla de autor `.grilla-tarjetas { display: grid }` de `styles.css`
  prevalece sobre el `[hidden] { display: none }` de la hoja del navegador, así
  que `hidden` no la ocultaría visualmente. Se deja **sin hijos** (0 tarjetas),
  lo que satisface «no se muestran tarjetas» sin CSS nuevo. Los contenedores
  `#catalogo-vacio` y `#catalogo-sin-resultados` usan `.mensaje`, que no fija
  `display`, por lo que `hidden` sí funciona.
- `aria-live="polite"` ya está en ambos contenedores: se conserva y solo se
  reescribe su `textContent` cuando corresponde.
- Invariante verificable: nunca hay dos mensajes visibles a la vez; en estado
  normal ambos están ocultos.

### 6. Reglas de render de la tarjeta

Estructura generada por libro, idéntica a la del markup actual reemplazado:

```
article.card.libro-tarjeta[data-libro-id="<id>"]
  h3                       → titulo
  p                        → "ISBN: " + isbn
  p                        → "Editorial: " + nombre resuelto
  p                        → "Género: " + nombre resuelto | "Sin clasificar"
  p                        → "Autores:"
  ul
    li (uno por autor resuelto)
  p                        → "Precio: " + formatearPrecio(precio)
```

- Todo con `document.createElement` y `textContent` (o `document.createTextNode`);
  `data-libro-id` se asigna con `article.dataset.libroId = String(libro.id)`.
- **MUST NOT** usarse `innerHTML`, `insertAdjacentHTML`, `eval` ni
  `document.write` con datos del modelo o del usuario, ni siquiera para
  limpiar la lista (se usa `while (lista.firstChild) lista.removeChild(...)`).
- Los prefijos («ISBN: », «Editorial: », «Género: », «Autores:», «Precio: ») son
  literales fijos; los valores se concatenan con `textContent` como un único
  nodo de texto, de modo que un título o término con `<b>` se muestra literal.
- El número de `li` es exactamente el de autores resueltos; no se omite ninguno
  de los válidos (caso del libro 2, con 3 autores).

### 7. Formato de precio

`formatearPrecio(precio)` compone **prefijo literal `$` + número formateado**:

```js
"$" + new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(precio)
```

- Resultado esperado para `18500`: `"$18.500"` (separador de miles `.`, sin
  decimales, sin espacio intermedio).
- **No** se usa `style: "currency"`: en varias implementaciones ICU inserta un
  espacio duro/no separable entre `$` y el número, y el literal contractual es
  `$18.500`.
- El número vive en el modelo (`precio: 18500`); el símbolo y el separador solo
  existen en la salida de render.
- Verificación en Fase 3: el nodo de precio del libro 1 debe ser exactamente
  `Precio: $18.500` (se comparará el texto renderizado, no solo el número).

### 8. Cambios exactos en `catalogo.html`

Solo dos cambios; ningún otro HTML, CSS, `id`, clase, `name` ni estructura:

1. En `#catalogo-lista.grilla-tarjetas`, retirar los **3** `article.card.libro-tarjeta`
   estáticos (`data-libro-id` 1, 2 y 3). El contenedor queda vacío, conservando
   `id="catalogo-lista"` y `class="grilla-tarjetas"`.
2. Antes de `</body>` (después del `footer`), agregar en orden:
   `<script defer src="js/data.js"></script>` y
   `<script defer src="js/catalogo.js"></script>`.

No se agrega `type="module"`, ni JS inline, ni atributos nuevos a los
contenedores de estado o al formulario.

### 9. Alternativas descartadas

| Alternativa | Por qué se descarta |
| --- | --- |
| Filtro en vivo con `input` | No lo pide el PDF; dispararía estados y renders por tecla, y complicaría la exclusividad de estados. El usuario fijó filtro solo en `submit`. |
| Conservar las 3 tarjetas como fallback | Duplicaría los datos fuera del modelo (viola R-03 y la fuente única de verdad) y podría divergir del render. Se eliminan. |
| Un solo archivo JS | Mezcla definición de datos con render y eventos; incumple la separación exigida por R-06 y la reutilización de R-09. |
| Módulos ES (`type="module"`) | Bajo `file://` el navegador bloquea la carga por CORS (origen `null`). |
| `Intl` con `style: "currency"` | Puede insertar espacio entre símbolo y número; no garantiza el literal `$18.500`. |
| Ocultar `#catalogo-lista` con `hidden` | `.grilla-tarjetas { display: grid }` (hoja de autor) anula `[hidden]`; requeriría CSS nuevo. Se vacía la lista. |
| Literales de mensajes dejados como placeholder | Decisión cerrada: «No hay libros registrados.» y «No se encontraron libros para «{término}».» con el término recortado insertado por `textContent`. No quedan pendientes. |

## Risks / Trade-offs

- **Formato `Intl` variable según motor/ICU** → se verifica el literal
  `$18.500` en Fase 3; si el separador difiere, se ajusta solo
  `formatearPrecio` sin cambiar el contrato ni el modelo.
- **`hidden` anulado por `display: grid`** → mitigado no ocultando
  `#catalogo-lista`; los mensajes usan `.mensaje` (sin `display`) y sí
  respetan `hidden`.
- **`reset` limpia el campo después del handler** → el handler no lee el valor;
  solo re-renderiza. No hay estado intermedio visible.
- **Arrays públicos mutables** → un cambio en consola o en el Ej. 4 puede
  dejar referencias colgando; `verificarIntegridad()` las detecta y el render
  degrada con fallbacks sin romper la página.
- **`console.error` de integridad con datos alterados** → es el comportamiento
  esperado (R-02); con los datos de ejemplo la consola debe quedar limpia.
- **Sin plegado de acentos** → el requisito solo exige mayúsculas/minúsculas y
  `trim`; «cien» no encuentra «cién». Se documenta como límite aceptado.
- **Sin tests automatizados** → la verificación es manual y su evidencia queda
  en el checklist de `tasks.md`; no se declara aprobado ningún control no
  ejecutado.

## Migration Plan

1. Crear `js/data.js` (modelo + consultas + integridad) y comprobarlo en
   consola antes de tocar el HTML.
2. Crear `js/catalogo.js` (filtro, render, estados, eventos).
3. Editar `catalogo.html`: quitar las 3 tarjetas y agregar los 2 scripts.
4. Verificación manual integral por `file://` (checklist de `tasks.md`).
5. Rollback: `git checkout -- catalogo.html` y borrar `js/data.js` y
   `js/catalogo.js`; al no haber persistencia ni cambios de CSS, el estado
   previo se recupera por completo.

## Open Questions

Ninguna bloqueante. Las 5 decisiones de diseño, los datos de §5.4 y ambos
literales de mensaje están cerrados; cualquier ajuste futuro de spec se
propone por separado, no se aplica en esta fase.
