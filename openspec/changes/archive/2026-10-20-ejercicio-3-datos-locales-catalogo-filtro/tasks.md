# Tasks — ejercicio-3-datos-locales-catalogo-filtro

> Fase 2 — PLAN. Orden de ejecución: modelo → consultas → catálogo → HTML →
> verificaciones funcionales → verificación integral. Sin tests automatizados,
> sin servidor, sin npm. Fuera de alcance: Ej. 4 (altas), Ej. 5 (ventas) y
> Ej. 6 (persistencia); no se planifica ninguna tarea de esas etapas.

## 1. Modelo de datos en `js/data.js`

- [x] 1.1 **Resultado:** `js/data.js` creado con una IIFE y `"use strict"`, que crea/reutiliza `window.ElTintero` y declara dentro `ElTintero.datos` con las 5 colecciones vacías y un comentario que las identifica como datos de ejemplo. — **R/CA:** R-01, R-08, CA-01 · **Archivos:** `js/data.js` (nuevo) · **Depende de:** — · **Verificación:** abrir el archivo y confirmar IIFE + `"use strict"` + un único global (`window.ElTintero`); buscar declaraciones `const`/`let`/`var` fuera de la IIFE (0 coincidencias) y confirmar las 5 claves en `ElTintero.datos`.

- [x] 1.2 **Resultado:** cargadas las 3 editoriales (1 Sudamericana, 2 Losada, 3 Emecé), los 3 géneros (1 Novela, 2 Antología, 3 Cuento) y los 5 autores (1 Gabriel García Márquez, 2 Jorge Luis Borges, 3 Adolfo Bioy Casares, 4 Silvina Ocampo, 5 Julio Cortázar), con ids numéricos exactos. — **R/CA:** R-01, CA-01 · **Archivos:** `js/data.js` · **Depende de:** 1.1 · **Verificación:** comparar nombre por nombre e id por id contra `proposal.md` §5.4; contar 3/3/5 registros; confirmar que `generos` **no** contiene «Sin clasificar».

- [x] 1.3 **Resultado:** cargados los 6 libros con los valores exactos de §5.4: ids 1–6, títulos, ISBN, `precio` numérico sin símbolo, `editorialId`, `generoId` (`null` en el libro 3 «El Aleph») y `autoresIds` (libro 2 con `[2, 3, 4]`), en ese orden. — **R/CA:** R-01, R-02, CA-01 · **Archivos:** `js/data.js` · **Depende de:** 1.2 · **Verificación:** contar 6 objetos; comprobar que `libros[2].generoId === null`; confirmar que cada `editorialId` ∈ {1,2,3} y cada id de `autoresIds` ∈ {1..5}; precios `18500`, `21400`, `15900`, `24500`, `14300`, `19900`.

- [x] 1.4 **Resultado:** cargados los 3 clientes: 1 Ana Pérez `ana.perez@example.com`, 2 Bruno Díaz `bruno.diaz@example.com`, 3 Carla Gómez `carla.gomez@example.com`, marcados como datos de ejemplo. — **R/CA:** R-01, CA-01 · **Archivos:** `js/data.js` · **Depende de:** 1.1 · **Verificación:** contar 3 registros y comparar id/nombre/email contra §5.4; confirmar que no hay persistencia (`localStorage`, `sessionStorage`, `indexedDB` con 0 coincidencias).

## 2. Consultas, formato e integridad en `js/data.js`

- [x] 2.1 **Resultado:** `ElTintero.consultas` expone `obtenerLibros()`, `obtenerClientes()`, `buscarEditorialPorId(id)`, `buscarGeneroPorId(id)` y `buscarAutoresPorIds(ids)` con las firmas de `design.md` §3; los buscadores devuelven el objeto o `undefined` y `buscarAutoresPorIds` respeta el orden de `ids` y omite los inexistentes. — **R/CA:** R-09, CA-07 · **Archivos:** `js/data.js` · **Depende de:** 1.4 · **Verificación:** revisar que cada función use `find`/`map` sin lanzar excepciones; comprobar que `obtenerLibros()` y `obtenerClientes()` devuelven la referencia del array del modelo (no una copia) y que `buscarAutoresPorIds([2,3,4])` conserva ese orden.

- [x] 2.2 **Resultado:** `ElTintero.consultas.formatearPrecio(precio)` devuelve `"$"` + `Intl.NumberFormat("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })`, sin `style: "currency"` y sin decimales. — **R/CA:** R-03, CA-02 · **Archivos:** `js/data.js` · **Depende de:** 2.1 · **Verificación:** revisar que no se use `style: "currency"` y que el prefijo `$` sea literal; la comprobación en ejecución de `formatearPrecio(18500) === "$18.500"` se registra en 4.3 y 6.2.

- [x] 2.3 **Resultado:** `ElTintero.consultas.verificarIntegridad()` devuelve `string[]` (vacío si todo resuelve), registra cada error con `console.error` y no lanza excepciones; valida ids duplicados, `editorialId` inexistente, `generoId` no `null` inexistente, `autoresIds` vacío o con ids inexistentes y `precio` no finito. `generoId: null` no es error. — **R/CA:** R-02, CA-01 · **Archivos:** `js/data.js` · **Depende de:** 1.4, 2.1 · **Verificación:** revisar que cada rama de error haga `push` al array y `console.error`, y que la función siempre retorne el array (sin `throw`); el resultado `[]` con los datos de ejemplo se comprueba en 4.3 y la alteración en consola en 5.6.

- [x] 2.4 **Resultado:** `data.js` invoca `verificarIntegridad()` una vez al final de la IIFE, sin asignar su resultado ni condicionar el resto de la carga (no interrumpe el render). — **R/CA:** R-02, R-07, CA-01 · **Archivos:** `js/data.js` · **Depende de:** 2.3 · **Verificación:** confirmar una única llamada al final del archivo y que no hay `if`/`throw` que dependa de su resultado; con los datos de ejemplo no debe producir `console.error` (se observa en 4.3).

## 3. Catálogo: filtro, render y estados en `js/catalogo.js`

- [x] 3.1 **Resultado:** `js/catalogo.js` creado con IIFE, `"use strict"`, reutilización de `window.ElTintero` (sin recrearlo), helpers privados y `ElTintero.catalogo` con `filtrarLibrosPorTitulo`, `renderizarCatalogo` e `iniciarCatalogo`; sin `DOMContentLoaded` ni `load`. — **R/CA:** R-08, R-09, CA-06, CA-07 · **Archivos:** `js/catalogo.js` (nuevo) · **Depende de:** 2.4 · **Verificación:** buscar declaraciones globales fuera de la IIFE (0), confirmar que solo se exportan las 3 funciones del contrato y que no aparecen `DOMContentLoaded` ni `window.addEventListener("load")`.

- [x] 3.2 **Resultado:** `filtrarLibrosPorTitulo(libros, termino)` recorta con `trim`, compara en `toLowerCase` por coincidencia parcial (`includes`) y devuelve un array nuevo sin mutar la entrada; término vacío o solo espacios devuelve el catálogo completo. — **R/CA:** R-04, CA-03 · **Archivos:** `js/catalogo.js` · **Depende de:** 3.1 · **Verificación:** revisar `termino.trim().toLowerCase()` y `titulo.toLowerCase().includes(...)`; confirmar que retorna `libros.slice()` cuando el término queda vacío y que no hay `sort`/`splice`/asignaciones al array recibido.

- [x] 3.3 **Resultado:** helper `crearTarjetaLibro(libro)` construye `article.card.libro-tarjeta` con `dataset.libroId = String(libro.id)`, `h3` (título), párrafos «ISBN: », «Editorial: », «Género: », «Autores:» + `ul`/`li` por autor y «Precio: » formateado, todo con `createElement`/`textContent`; aplica los fallbacks «Sin clasificar», «Editorial no disponible» y omisión informada de autores inexistentes. — **R/CA:** R-02, R-03, R-07, CA-02, CA-05 · **Archivos:** `js/catalogo.js` · **Depende de:** 3.1 · **Verificación:** buscar `innerHTML`, `insertAdjacentHTML`, `eval`, `document.write` en el archivo (0 coincidencias); comparar la estructura generada contra el markup retirado de `catalogo.html`; confirmar que usa `buscarAutoresPorIds` y que el número de `li` depende de los autores resueltos.

- [x] 3.4 **Resultado:** `renderizarCatalogo(libros)` vacía `#catalogo-lista` con `removeChild` en bucle, agrega una tarjeta por libro, oculta ambos mensajes (`hidden = true`) y, si el modelo está vacío (`ElTintero.datos.libros.length === 0`), muestra `#catalogo-vacio`; nunca aplica `hidden` a `#catalogo-lista`. — **R/CA:** R-03, R-05, CA-02, CA-04 · **Archivos:** `js/catalogo.js` · **Depende de:** 3.3 · **Verificación:** revisar el bucle de limpieza y que no haya `lista.hidden`; confirmar que con 6 libros crea 6 tarjetas y que `catalogo-vacio`/`catalogo-sin-resultados` quedan con `hidden`.

- [x] 3.5 **Resultado:** helper `mostrarSinResultados(termino)` escribe con `textContent` el literal `No se encontraron libros para «{término}».` usando el término recortado, muestra `#catalogo-sin-resultados` y oculta `#catalogo-vacio`; ningún otro estado queda visible. — **R/CA:** R-05, R-07, CA-03, CA-05 · **Archivos:** `js/catalogo.js` · **Depende de:** 3.4 · **Verificación:** comparar el literal exacto (incluidas las comillas angulares `«»` y el punto final) y confirmar que el término se concatena antes de asignarlo a `textContent`, sin `innerHTML`.

- [x] 3.6 **Resultado:** `iniciarCatalogo()` renderiza el catálogo completo al cargar y registra en `form#catalogo-buscador` un listener `submit` con `preventDefault()` (filtra y decide normal/vacío/sin resultados) y un listener `reset` que re-renderiza el catálogo completo sin leer `input.value`; no registra ningún listener `input`. — **R/CA:** R-04, R-05, R-06, CA-03, CA-04 · **Archivos:** `js/catalogo.js` · **Depende de:** 3.4, 3.5 · **Verificación:** revisar que existan exactamente un `submit` y un `reset`, que el `submit` llame a `preventDefault`, que no haya `addEventListener("input"...)` y que el `reset` llame a `renderizarCatalogo(ElTintero.datos.libros)`; el comportamiento se comprueba en 5.1–5.4.

## 4. Integración mínima en `catalogo.html`

- [x] 4.1 **Resultado:** retirados los 3 `article.card.libro-tarjeta` estáticos (`data-libro-id` 1, 2 y 3) de `#catalogo-lista`; el contenedor queda vacío conservando `id="catalogo-lista"` y `class="grilla-tarjetas"`. Ningún otro elemento, `id`, clase, `name` o texto cambia. — **R/CA:** R-03, CA-02 · **Archivos:** `catalogo.html` · **Depende de:** 3.6 · **Verificación:** contar 0 `article` y 0 `data-libro-id` en el HTML; confirmar que siguen existiendo `form#catalogo-buscador`, `input#catalogo-titulo`, `#catalogo-vacio` y `#catalogo-sin-resultados`; `git diff catalogo.html` debe mostrar solo la eliminación de los 3 bloques y, en 4.2, las 2 líneas de script.

- [x] 4.2 **Resultado:** agregadas al final del `body`, después del `footer` y en este orden, las etiquetas `<script defer src="js/data.js"></script>` y `<script defer src="js/catalogo.js"></script>`; sin `type="module"`, sin JS inline y sin otros scripts. — **R/CA:** R-08, CA-06 · **Archivos:** `catalogo.html` · **Depende de:** 4.1 · **Verificación:** confirmar el orden data.js → catalogo.js, `defer` en ambas, ausencia de `type="module"` y de contenido entre etiquetas; `git diff` solo con esas 2 líneas agregadas.

- [x] 4.3 **Resultado:** primera carga real por `file://` con el catálogo renderizado desde el modelo: 6 tarjetas, consola limpia, `ElTintero.datos` y `ElTintero.consultas` disponibles. — **R/CA:** R-03, R-07, R-08, CA-02, CA-05, CA-06 · **Archivos:** `catalogo.html`, `js/data.js`, `js/catalogo.js` · **Depende de:** 4.2 · **Verificación:** doble clic en `catalogo.html`; en consola ejecutar `ElTintero.datos.libros.length` (6), `ElTintero.consultas.verificarIntegridad()` (`[]`), `ElTintero.consultas.formatearPrecio(18500)` (`"$18.500"`) y `document.querySelectorAll("#catalogo-lista .libro-tarjeta").length` (6); consola sin errores ni 404.

## 5. Comprobaciones funcionales de filtro y estados

- [x] 5.1 **Resultado:** envío con el campo vacío y con solo espacios muestra los 6 libros y ningún mensaje de estado. — **R/CA:** R-04, R-05, CA-03 · **Archivos:** verificación sobre `catalogo.html` · **Depende de:** 4.3 · **Verificación:** enviar con Enter vacío → 6 tarjetas; escribir `"   "` y enviar → 6 tarjetas; confirmar `#catalogo-vacio` y `#catalogo-sin-resultados` con `hidden`.

- [x] 5.2 **Resultado:** el filtro es parcial y no distingue mayúsculas/minúsculas, y teclear sin enviar no modifica el catálogo. — **R/CA:** R-04, R-06, CA-03 · **Archivos:** verificación sobre `catalogo.html` · **Depende de:** 5.1 · **Verificación:** escribir `"  ciEN  "` **sin** enviar → el catálogo sigue mostrando 6 tarjetas; enviar con Enter o con «Buscar por título» → 1 tarjeta «Cien años de soledad»; repetir con `"años"` → aparece «Cien años de soledad»; la URL no cambia ni recarga.

- [x] 5.3 **Resultado:** una búsqueda sin coincidencias no muestra tarjetas y sí `#catalogo-sin-resultados` con el término recortado; el término con marcado se muestra literal. — **R/CA:** R-04, R-05, R-07, CA-03, CA-05 · **Archivos:** verificación sobre `catalogo.html` · **Depende de:** 5.2 · **Verificación:** enviar `"zzz"` → 0 tarjetas, mensaje visible con `zzz`, `#catalogo-vacio` oculto; enviar `"  <b>cien</b>  "` → el mensaje muestra el texto literal y no se crea ningún `<b>` dentro de `#catalogo-sin-resultados`.

- [x] 5.4 **Resultado:** «Limpiar búsqueda» vacía el campo, restaura las 6 tarjetas y oculta ambos mensajes, tanto después de una búsqueda con resultados como sin resultados. — **R/CA:** R-05, R-06, CA-04 · **Archivos:** verificación sobre `catalogo.html` · **Depende de:** 5.3 · **Verificación:** tras buscar `"cien"` y tras buscar `"zzz"`, pulsar «Limpiar búsqueda» → input vacío, 6 tarjetas, ambos mensajes con `hidden`; comprobar que el foco/URL no cambian y que la consola sigue limpia.

- [x] 5.5 **Resultado:** el estado de catálogo vacío se activa solo si el modelo no tiene libros y es excluyente con «sin resultados». — **R/CA:** R-05, CA-04 · **Archivos:** verificación sobre `catalogo.html` · **Depende de:** 5.4 · **Verificación:** en consola ejecutar `ElTintero.datos.libros.length = 0; ElTintero.catalogo.renderizarCatalogo([])` → 0 tarjetas, solo `#catalogo-vacio` visible con el texto «No hay libros registrados.» y `#catalogo-sin-resultados` oculto; recargar la página y confirmar que vuelven los 6 libros (sin persistencia).

- [x] 5.6 **Resultado:** la comprobación de integridad informa referencias inválidas sin romper la vista. — **R/CA:** R-02, CA-01 · **Archivos:** verificación sobre `catalogo.html` · **Depende de:** 4.3 · **Verificación:** en consola, `ElTintero.consultas.verificarIntegridad()` → `[]`; luego `ElTintero.datos.libros[0].editorialId = 99` y repetir → al menos un error en el retorno y un `console.error`, con las 6 tarjetas todavía visibles y sin excepción; recargar para restaurar los datos.

## 6. Verificación integral y evidencia

- [x] 6.1 **Resultado:** revisión estática de convenciones y seguridad completada sobre los 3 archivos. — **R/CA:** R-07, R-08, CA-05, CA-06 · **Archivos:** `catalogo.html`, `js/data.js`, `js/catalogo.js` · **Depende de:** 5.6 · **Verificación:** buscar en `js/` `innerHTML`, `insertAdjacentHTML`, `eval`, `document.write`, `fetch`, `localStorage`, `type="module"` y `addEventListener("input"` (0 coincidencias cada uno); confirmar en `catalogo.html` 0 tarjetas estáticas y exactamente 2 `<script defer>` en orden; `git status`/`git diff` limitados a `catalogo.html` + `js/data.js` + `js/catalogo.js`, con `css/` y el resto de HTML sin cambios.

- [x] 6.2 **Resultado:** verificación integral end-to-end por `file://` con evidencia registrada; ningún control se declara aprobado sin ejecutarse. — **R/CA:** R-01, R-02, R-03, R-04, R-05, R-06, R-07, R-08, R-09, CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07 · **Archivos:** `catalogo.html`, `js/data.js`, `js/catalogo.js` · **Depende de:** 5.1–5.6, 6.1 · **Verificación:** doble clic en `catalogo.html`; registrar en la evidencia: (1) 6 tarjetas con `data-libro-id` 1–6 y consola limpia; (2) los 6 datos por tarjeta; (3) libro 2 con 3 autores y libro 3 con «Sin clasificar»; (4) precio del libro 1 exactamente `$18.500`; (5) búsqueda vacía/espacios → 6, `"  ciEN  "` → «Cien años de soledad», `"años"` → coincidencia parcial, teclear no filtra, inexistente → 0 tarjetas + mensaje con el término, `<b>` literal como texto; (6) limpiar restaura las 6 y oculta mensajes; (7) `verificarIntegridad()` → `[]` y alteración de `editorialId` informada sin romper el render; (8) ambos mensajes con `aria-live="polite"` y visibilidad solo por `hidden`; (9) `css/styles.css` sin cambios y ausencia de errores en consola. Anotar resultados obtenidos, omitidos y pendientes con su motivo.

## Evidencia de implementación (Fase 3)

**Fecha:** 2026-10-20 · **Entorno:** Node v26.8.1, Chromium 151.0.7922.173 (Linux), apertura por `file://` (sin servidor, sin npm).

### Verificación estática

- `node --check js/data.js` → sin salida, exit 0 (`data.js OK`).
- `node --check js/catalogo.js` → sin salida, exit 0 (`catalogo.js OK`).
- Greps en `js/` + `catalogo.html`, coincidencias: `innerHTML` 0, `insertAdjacentHTML` 0, `eval` 0, `document.write` 0, `fetch` 0, `localStorage` 0, `sessionStorage` 0, `indexedDB` 0, `type="module"` 0, `addEventListener("input"` 0, `DOMContentLoaded` 0.
- `catalogo.html`: 0 `article`, 0 `data-libro-id`, 2 `<script>` (`defer`, orden `data.js` → `catalogo.js`).
- `git status`: solo `catalogo.html` modificado; `js/data.js`, `js/catalogo.js` y este `tasks.md` nuevos. `css/` y los demás HTML sin cambios. `git diff --stat`: `catalogo.html | 40 +++----` (3 inserciones, 37 eliminaciones).

### Render por `file://` (Chromium headless, `--dump-dom`)

Comando: `chromium --headless=new --disable-gpu --no-sandbox --virtual-time-budget=3000 --dump-dom "file:///home/mauro/.../catalogo.html"`.

- 6 `article.card.libro-tarjeta`; `data-libro-id` 1, 2, 3, 4, 5, 6 (sin duplicados).
- Libro 2: 3 `<li>` (Borges, Bioy Casares, Ocampo). Libro 3: «Género: Sin clasificar».
- Libro 1: `Precio: $18.500`.
- `#catalogo-vacio` y `#catalogo-sin-resultados` con `hidden`.
- `/tmp/opencode/chromium.log`: solo un aviso de Mojo/headless (`blink.mojom.WidgetHost`); sin errores de JavaScript.

### Interacciones (CDP, Chromium real sobre `file://`, `--remote-debugging-port=9222`)

Script temporal `/tmp/opencode/cdp-test.js` (WebSocket global de Node); resultados en `/tmp/opencode/cdp-results.json`.

- Carga inicial: 6 tarjetas, ids 1–6, `lista.hidden === false`; ambos mensajes `hidden`; `aria-live="polite"` en ambos. 0 errores de consola al cargar; 0 excepciones.
- Modelo: 6 libros, 3 editoriales, 3 géneros, 5 autores, 3 clientes; `libros[2].generoId === null`; `libros[1].autoresIds = [2,3,4]`; `buscarAutoresPorIds([2,3,4])` conserva el orden; `obtenerLibros()`/`obtenerClientes()` devuelven la referencia del modelo; `verificarIntegridad()` → `[]`; `formatearPrecio(18500)` → `"$18.500"`.
- Integridad alterada: `libros[0].editorialId = 99` → `verificarIntegridad()` devuelve el error «Integridad: el libro 1 referencia una editorial inexistente (99).», se registra `console.error` y las 6 tarjetas siguen visibles; sin excepciones. Dato restaurado.
- Submit vacío → 6 tarjetas, mensajes ocultos. Submit con `"   "` → 6 tarjetas, mensajes ocultos.
- Tecleo `"  ciEN  "` + evento `input` sin enviar → siguen 6 tarjetas (no hay filtro en vivo). Submit → 1 tarjeta «Cien años de soledad». Submit `"años"` → 1 tarjeta «Cien años de soledad». URL sin cambios.
- Submit `"zzz"` → 0 tarjetas, `#catalogo-vacio` oculto, `#catalogo-sin-resultados` visible con `No se encontraron libros para «zzz».`.
- Submit `"  <b>cien</b>  "` → 0 tarjetas; mensaje literal `No se encontraron libros para «<b>cien</b>».`; `mensaje.querySelector("b") === null`.
- Reset tras «sin resultados» → campo `""`, 6 tarjetas, ambos mensajes ocultos. Reset tras búsqueda con resultados (`"cien"`) → campo `""`, 6 tarjetas, ambos mensajes ocultos.
- Catálogo vacío: `ElTintero.datos.libros.length = 0; renderizarCatalogo([])` → 0 tarjetas, solo `#catalogo-vacio` visible con `No hay libros registrados.`, `#catalogo-sin-resultados` oculto.
- Recarga posterior → modelo con 6 libros y 6 tarjetas (sin persistencia).
- Consola: el único `console.error` registrado en toda la sesión es el provocado a propósito al alterar `editorialId`; ninguna excepción.

### Controles no ejecutados

Ninguno. No quedan controles `PENDIENTE`. La verificación se hizo con Chromium real sobre la URL `file://` (headless + CDP) en lugar de doble clic con mouse; el camino de carga y eventos es el mismo. `openspec archive` no se ejecutó: queda a cargo del usuario.
