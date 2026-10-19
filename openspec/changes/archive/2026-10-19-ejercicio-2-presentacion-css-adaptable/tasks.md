# Tasks

> Fase 2 (PLAN) del change. Solo planificación: este archivo no implementa
> código. La implementación (Fase 3) se ejecuta solo con autorización del
> usuario.
>
> Decisiones cerradas por el usuario (tratadas como decididas, no como
> pendientes):
> **D1** un único `css/styles.css` organizado por banners de comentario;
> **D8** paleta papel/tinta/vino (fondo `#FBFAF7`, texto `#1F1B16`, acento
> `#6B2737`, error `#B3261E`, éxito `#1E7A3C`) vía custom properties en
> `:root`; **D9** solo texto, sin iconos Unicode/emoji.
>
> Restricciones transversales de todos los grupos: CSS3 nativo únicamente; sin
> librerías, frameworks, CDNs, preprocesadores ni build; rutas `<link>`
> relativas (`css/styles.css`); no romper `id`/`name`/`data-*` ni la semántica
> del Ejercicio 1 (solo agregar `class` y contenedores de presentación);
> preservar `aria-live` y `hidden` de los contenedores de estado; nada del
> Ejercicio 3–6 (JS, validaciones, cálculos, localStorage). Verificación manual
> en todas las tareas: doble clic en el HTML (sin servidor), redimensionar a
> 320 px y 1280 px y recorrer controles con teclado donde corresponda. Sin
> tests automatizados.

## 1. Tokens y enlaces

- [x] 1.1 Crear `css/styles.css` con los banners de sección y el bloque `:root`
  de tokens de identidad. **Resultado esperado:** un único archivo con las
  secciones en orden — `1) tokens (:root)` → `2) reset/base` → `3) layout` →
  `4) componentes` → `5) utilidades/estados` → `6) media queries` — y un
  bloque `:root` que declara al menos: `--color-fondo: #FBFAF7`,
  `--color-superficie: #FFFFFF`, `--color-texto: #1F1B16`,
  `--color-texto-suave`, `--color-borde`, `--color-acento: #6B2737`,
  `--color-acento-suave`, `--color-error: #B3261E`, `--color-error-suave`,
  `--color-exito: #1E7A3C`, `--color-exito-suave`, familia tipográfica de
  sistema (`--fuente-titulo` serif, `--fuente-base` system-ui/sans), escala de
  espaciado (`--espacio-1`..`--espacio-6`), `--radio`, `--sombra`,
  `--ancho-contenido`. Sin `@import` ni fuentes externas. **Requisitos:**
  R-01, R-02, R-09. **Archivos:** crear `css/styles.css` (la carpeta `css/`
  ya existe). **Depende de:** — (primera tarea). **Verificación:** leer el
  archivo y constatar los banners y las custom properties con valores de la
  paleta aprobada; ninguna vista cambia aún porque todavía no hay `<link>`.

- [x] 1.2 Agregar `<link rel="stylesheet" href="css/styles.css">` al `<head>`
  de los 6 HTML. **Resultado esperado:** `index.html`, `catalogo.html`,
  `libros.html`, `clientes.html`, `ventas.html` e `historial.html` enlazan la
  hoja con ruta relativa; sin atributos `style="..."` ni bloques `<style>`
  en ningún documento. **Requisitos:** R-02; CA-01 (parcial: enlaces). **Archivos:**
  modificar los 6 HTML (solo el `<head>`). **Depende de:** 1.1. **Verificación:**
  doble clic en cada uno de los 6 HTML → la página se renderiza con la
  tipografía/color base de `styles.css` (fondo papel, texto tinta) y no con
  los estilos por defecto del navegador; buscar `style=` y `<style` en los 6
  archivos → sin coincidencias.

## 2. Reset, base y layout (Flexbox/Grid)

- [x] 2.1 Escribir la sección reset/base consumiendo tokens. **Resultado
  esperado:** `box-sizing: border-box` global; `body` con
  `background: var(--color-fondo)`, `color: var(--color-texto)`,
  `font-family: var(--fuente-base)`, `line-height: var(--interlineado)`;
  tipografía base legible a 320 px (≈16 px); títulos con
  `var(--fuente-titulo)`; ningún color ni familia literal fuera de `:root` en
  los componentes principales. **Requisitos:** R-01, R-09. **Archivos:**
  `css/styles.css`. **Depende de:** 1.2 (ya se ve el efecto al abrir). **Verificación:**
  abrir `index.html` → fondo papel y texto tinta en todo el documento;
  inspeccionar la sección → usa `var(--...)`, sin valores literales de color
  repetidos.

- [x] 2.2 Estilizar el layout general: `.contenedor` y `.nav-principal`.
  **Resultado esperado:** `header`, `main` y `footer` de cada vista dentro o
  estilizados como `.contenedor` (ancho máximo `var(--ancho-contenido)`,
  centrado, padding); el `nav` de 5 enlaces usa `display: flex` con
  `flex-wrap: wrap` (`.nav-principal`), sin `position: absolute/fixed`. Cada
  HTML recibe solo las clases/contenedores mínimos necesarios. **Requisitos:**
  R-02, R-03. **Archivos:** `css/styles.css` + ajustes mínimos de `class` en
  los 6 HTML (header/main/footer/nav). **Depende de:** 2.1. **Verificación:**
  abrir `index.html` a 320 px → los 5 enlaces del nav envuelven en varias
  filas sin provocar scroll horizontal de la página; a 1280 px → el contenido
  queda centrado con márgenes; inspeccionar el CSS del nav → `display: flex`
  y sin posicionamiento absoluto.

- [x] 2.3 Construir la grilla de tarjetas del catálogo y sus tarjetas.
  **Resultado esperado:** `#catalogo-lista` en `index.html` (portada/catálogo)
  con clase `.grilla-tarjetas` (`display: grid`, 1 columna en base); cada
  `article` de libro con `.card` y `.libro-tarjeta` (borde, padding y sombra
  con tokens); a 320 px las tarjetas se apilan en una columna legible. **Requisitos:**
  R-02, R-03. **Archivos:** `css/styles.css` + clases en los `article` de
  `index.html`. **Depende de:** 2.2. **Verificación:** abrir `index.html` a
  320 px → tarjetas en una columna, sin scroll horizontal, textos legibles;
  inspeccionar `.grilla-tarjetas` → `display: grid`.

- [x] 2.4 Estilizar formularios con `.form-group` y `.form-acciones`.
  **Resultado esperado:** los formularios de `libros.html` y `clientes.html`
  (y los bloques de controles de `ventas.html`, que no usa `<form>`) reciben
  `.form-group` por campo (label + control apilados, espacio con tokens) y
  `.form-acciones` en las barras de botones (`display: flex`, gap); controles
  con ancho máximo legible, sin estirarse a todo el viewport. **Requisitos:**
  R-02, R-03. **Archivos:** `css/styles.css` + clases en los campos de
  `libros.html`, `clientes.html`, `ventas.html`. **Depende de:** 2.2.
  **Verificación:** abrir las 3 vistas a 320 px → campos apilados, utilizables,
  sin scroll horizontal; a 1280 px → los campos no quedan estirados a todo el
  ancho de la página; inspeccionar → organización con Flexbox, sin tablas de
  maquetación.

- [x] 2.5 Estilizar el resumen de venta (`.venta-resumen`). **Resultado
  esperado:** `#ventas-resumen` en `ventas.html` con `.venta-resumen`
  (Flexbox/Grid con tokens de borde, fondo y espaciado) presentando totales de
  forma clara a 320 y 1280 px. **Requisitos:** R-02, R-03. **Archivos:**
  `css/styles.css` + clase en `#ventas-resumen` de `ventas.html`. **Depende
  de:** 2.4. **Verificación:** abrir `ventas.html` en ambos anchos → el bloque
  de resumen se lee correctamente, sin desbordes ni scroll horizontal.

- [x] 2.6 Envolver las tablas en `.tabla-contenedor` y estilizar `.tabla`.
  **Resultado esperado:** cada `table` existente está dentro de un `<div
  class="tabla-contenedor">` con `overflow-x: auto`; la tabla usa un
  `min-width` interno que active el scroll solo cuando excede el ancho. Tablas
  a envolver (mínimo, sin tocar `id`/`scope`/contenido): `libros-tabla`
  (`libros.html`), `clientes-tabla` (`clientes.html`), `venta-renglones`
  (`ventas.html`), `historial-tabla` y las 2 tablas de detalle sin `id` de
  `historial.html`. Estilo `.tabla` (bordes, encabezado con tokens, celdas con
  padding). **Requisitos:** R-02, R-04 (tablas de scroll interno).
  **Archivos:** `css/styles.css` + envoltorios `<div>` en `libros.html`,
  `clientes.html`, `ventas.html`, `historial.html`. **Depende de:** 2.2.
  **Verificación:** abrir cada vista con tablas a 320 px → la barra de scroll
  horizontal aparece dentro de `.tabla-contenedor`, no en la página; a 1280 px
  → las tablas caben y no muestran scroll interno innecesario; los `id` y
  `aria-live` originales intactos.

## 3. Componentes reutilizables

- [x] 3.1 Crear la familia de botones `.btn` + modificadores y unificar los
  botones existentes. **Resultado esperado:** `.btn` base (fondo acento,
  texto claro, padding/radio con tokens, hover/focus coherentes),
  `.btn--secundario` y `.btn--peligro`; todas las acciones de las vistas
  («Registrar libro», «Registrar cliente», «Agregar», «Confirmar compra»,
  enlaces-botón, etc.) comparten `.btn` y difieren solo por modificador. Sin
  iconos Unicode/emoji (D9): solo texto. **Requisitos:** R-01, R-02, R-09.
  **Archivos:** `css/styles.css` + clases en los `button`/acciones de
  `libros.html`, `clientes.html`, `ventas.html`, `index.html`,
  `historial.html`. **Depende de:** 2.4. **Verificación:** comparar dos
  botones equivalentes en vistas distintos → ambos con clase base `.btn`;
  abrir las vistas → aspecto coherente entre botones; no hay caracteres
  emoji/Unicode agregados.

- [x] 3.2 Aplicar la familia `.mensaje` a los contenedores de estado
  existentes. **Resultado esperado:** los `div` de estado (que ya tienen
  `aria-live="polite"` e `hidden`) reciben `.mensaje` + modificador según su
  rol, sin eliminar `hidden` ni `aria-live`: vacíos
  (`catalogo-vacio`, `libros-vacio`, `clientes-vacio`, `historial-vacio`) →
  `.mensaje-vacio`; sin resultados (`catalogo-sin-resultados`) →
  `.mensaje-info`; éxito (`libros-mensaje-ok`, `clientes-mensaje-ok`,
  `ventas-mensaje-ok`) → `.mensaje-exito`; error (`libros-mensaje-error`,
  `clientes-mensaje-error`, `ventas-mensaje-error`) → `.mensaje-error`. Cada
  modificador combina borde/fondo/color con tokens; el texto descriptivo ya
  presente en el HTML es el indicador principal (el color es complementario).
  **Requisitos:** R-02, R-07. **Archivos:** `css/styles.css` + clases en los
  divs de estado de `index.html`, `libros.html`, `clientes.html`,
  `ventas.html`, `historial.html`. **Depende de:** 2.1. **Verificación:** por
  inspección, cada mensaje de error contiene texto descriptivo (p. ej. «El
  título es obligatorio») y error/ éxito se distinguen por su texto, no solo
  por el color; quitar temporalmente `hidden` en el navegador → el mensaje se
  ve estilizado y con texto; restaurar `hidden` después.

## 4. Accesibilidad básica

- [x] 4.1 Definir foco visible con `:focus-visible` para todos los controles.
  **Resultado esperado:** regla común para `a`, `button`, `input`, `select`,
  `textarea` con `outline` de alto contraste (color acento o equivalente con
  tokens) y `outline-offset`; aplicada vía `:focus-visible` (con fallback
  razonable si el navegador no lo soporta), distinguible del estado normal.
  **Requisitos:** R-06. **Archivos:** `css/styles.css`. **Depende de:** 2.2
  (nav estilizado) y 3.1 (botones existentes). **Verificación:** abrir
  `libros.html` y recorrer con Tab desde el nav hasta el último control →
  cada enlace, input, select y botone muestra un indicador de foco visible y
  consistente; repetir en `index.html` (enlaces «Ver detalle» si existen) y
  en el nav de todas las vistas.

- [x] 4.2 Verificar condición de R-08 / CA-05 (texto alternativo). **Resultado
  esperado:** confirmado por inspección que los 6 HTML no contienen elementos
  `img` (hecho ya verificado en SPEC; re-verificar antes de cerrar) y, por lo
  tanto, no hay `alt` que ajustar; si durante la Fase 3 apareciera alguna
  imagen, se le asignaría `alt` descriptivo (informativa) o `alt=""`
  (decorativa). No se agregan imágenes nuevas (fuera de alcance). **Requisitos:**
  R-08. **Archivos:** ninguno (verificación; solo se editaría HTML si
  apareciera una imagen, que no está previsto). **Depende de:** — (puede
  ejecutarse en paralelo con el grupo 3). **Verificación:** buscar `<img` en
  los 6 HTML → sin coincidencias → CA-05 queda satisfecha en su estado
  condicional «vistas sin imágenes».

## 5. Adaptación 320 px / 1280 px (media queries)

- [x] 5.1 Escribir las media queries mobile-first (768 px y 1024 px).
  **Resultado esperado:** en base (≈320 px) todo es de una columna; en
  `@media (min-width: 768px)` la grilla de tarjetas pasa a 2 columnas y
  formularios/tablas ganan aire; en `@media (min-width: 1024px)` la grilla
  pasa a 3 columnas y `.contenedor` usa `max-width` centrado. Solo
  `min-width` (mobile-first), dentro de la sección 6) del archivo. **Requisitos:**
  R-05. **Archivos:** `css/styles.css`. **Depende de:** 2.3, 2.4, 2.6 (los
  bloques que las media queries ajustan). **Verificación:** abrir
  `index.html` a 1280 px → tarjetas en más de una columna (3); a ~800 px →
  2 columnas; a 320 px → 1 columna; sin desaprovechar el ancho a 1280 px.

- [x] 5.2 Reforzar el caso base de 320 px (cadenas largas y nav).
  **Resultado esperado:** reglas de envolvimiento para valores largos sin
  espacios (emails, ISBN) con `overflow-wrap: anywhere`/`word-break`
  aplicados a celdas de tabla y campos relevantes; el nav de 5 enlaces sigue
  envolviendo sin desbordar; ningún `img`/objeto fijo provoca desborde. **Requisitos:**
  R-04. **Archivos:** `css/styles.css`. **Depende de:** 5.1. **Verificación:**
  abrir `libros.html`, `clientes.html`, `historial.html` e `index.html` a
  320 px → ninguna barra de scroll horizontal a nivel de página; las tablas
  se desplazan solo dentro de `.tabla-contenedor`; los emails/ISBN se parten
  dentro de su celda.

## 6. Verificación integral final

- [x] 6.1 Ejecutar la batería de verificación manual de Fase 3 contra
  CA-01..CA-05 y la rúbrica del PDF. **Resultado esperado:** evidencia
  registrada (por vista) de: **CA-01** — los 6 HTML enlazan `css/styles.css` y
  no hay `style=`/`<style`; **CA-02** — `:root` con tokens de la paleta
  aprobada consumidos por componentes; botones, tarjetas, formularios, tablas
  y mensajes con estilo propio y clases reutilizables en kebab-case, sin
  `!important` injustificado; **CA-03** — nav/grilla/formularios/resumen con
  Flexbox o Grid; a 320 px sin scroll horizontal de página y con scroll
  interno en tablas; a 1280 px grilla multi-columna y formularios legibles;
  **CA-04** — recorrido completo con Tab en al menos `index.html` y
  `libros.html` con foco visible en todos los controles; mensajes de error con
  texto descriptivo; **CA-05** — sin `img` en las vistas (estado condicional
  satisfecho). Cobertura de la rúbrica (PDF p. 7): coherencia/organización
  8 pts (grupos 1–3: tokens, CSS externo, clases consistentes), adaptación 8
  pts (grupos 2 y 5: 320/1280 px, tablas), accesibilidad básica 4 pts (grupo
  4: foco y mensajes con texto). Ningún control se da por aprobado sin
  ejecutarse. **Requisitos:** R-01..R-09; CA-01..CA-05. **Archivos:**
  ninguno nuevo (solo correcciones puntuales si la verificación detecta un
  defecto en los archivos ya modificados). **Depende de:** todos los grupos
  anteriores (1.1–5.2). **Verificación:** doble clic en cada uno de los 6
  HTML; en cada uno: redimensionar a 320 px → sin scroll horizontal de página
  y tablas con scroll propio; redimensionar a 1280 px → layout cómodo y
  multi-columna donde corresponde; recorrer con Tab → foco visible en nav,
  enlaces, inputs, selects y botones; revisar mensajes → texto presente,
  color complementario.

## Workflow follow-up

- Presentar la evidencia de 6.1 al usuario y pedir autorización para cerrar:
  sincronizar los delta specs a los specs principales y archivar el change
  (`openspec archive`) solo cuando el usuario lo indique.

## Evidencia de Fase 3 (implementación)

Estado: 15/15 tareas completadas. La 6.1 se cerró con la **constancia del
usuario** (attestation): verificación visual manual ejecutada en navegador por
el usuario — layout a 320 px y 1280 px, y recorrido con teclado con foco
visible — con resultado satisfactorio y autorización explícita para archivar
el change (2026-10-19).

Verificación estática ejecutada (grep/`Select-String` + inspección):

- **CA-01** — los 6 HTML incluyen `<link rel="stylesheet" href="css/styles.css">`
  (línea 7 de cada archivo); búsqueda de `style=` / `<style` → sin coincidencias.
- **CA-02** — `:root` declara 13 tokens de color de la paleta aprobada + familias,
  espaciado, `--radio`, `--sombra`, `--ancho-contenido`; todos los hex del CSS
  viven solo en `:root` (líneas 13–25). Clases reutilizables kebab-case: `.btn`
  (+`.btn--secundario`/`.btn--peligro`), `.card`, `.libro-tarjeta`,
  `.tabla-contenedor`, `.tabla`, `.form-group`, `.form-acciones`, `.mensaje`
  (+ modificadores), `.grilla-tarjetas`, `.venta-resumen`, `.contenedor`,
  `.nav-principal`. `!important` → 0. Sin `@import`/CDN.
- **CA-03** — `display:flex`/`grid` en nav, grilla, formularios, resumen y
  botones; `position: absolute/fixed` → 0; `overflow-x: auto` en
  `.tabla-contenedor`; 6 contenedores de tabla para 6 tablas; `@media`
  `min-width` 768 px y 1024 px.
- **CA-04** — `:focus-visible` para `a`, `button`, `input`, `select`, `textarea`
  (+ fallback `@supports not selector(:focus-visible)`); contenedores de estado
  conservan `aria-live="polite"` y `hidden`.
- **CA-05** — búsqueda de `<img` en los 6 HTML → sin coincidencias (estado
  condicional «vistas sin imágenes» satisfecho).

Pendiente de verificación manual (requiere navegador): layout real a 320 px y
1280 px, ausencia de scroll horizontal de página, scroll interno de tablas,
recorrido con Tab y aspecto del foco, y aspecto de mensajes al quitar `hidden`.

