# Proposal — ejercicio-2-presentacion-css-adaptable

> Fase: SPEC ONLY (Fase 1 de PROMPT2). No incluye `tasks.md` (Fase 2 — PLAN)
> ni implementación (Fase 3). No se escribe CSS ni se editan los HTML.
> Norma de precedencia: ante cualquier conflicto entre esta propuesta y
> `docs/Repaso Primer Parcial.pdf`, vale el PDF.

## Why

Las 5 vistas del frontend ya existen como HTML semántico estático (Ejercicio 1
archivado), pero no tienen ninguna hoja de estilos enlazada: sin CSS no hay
identidad visual, ni layout adaptable, ni foco visible, y el Ejercicio 2
(20 puntos: coherencia y organización 8 + adaptación 8 + accesibilidad básica 4,
PDF p. 7) es requisito de la Etapa 1. Este change define el contrato de
presentación (CSS externo, responsive y accesibilidad básica) que la Fase 3
implementará, sin tocar la estructura semántica existente salvo ajustes mínimos
de clases/atributos.

## What Changes

- Se especifica (sin implementar) la **identidad visual** de la librería con
  custom properties CSS (`:root`) para color, tipografía y espaciado (R-01).
- Se especifica el **CSS en archivo(s) externo(s)** dentro de `css/`, enlazados
  desde cada HTML, con clases reutilizables (`.btn`, `.card`,
  `.tabla-contenedor`, `.form-group`, `.mensaje-error`, `.mensaje-exito`) y sin
  estilos inline significativos (R-02, R-09).
- Se especifica el **layout adaptable** con Flexbox/Grid (nav, grilla de
  tarjetas, formularios, resumen de venta) a 320 px y 1280 px, con tablas de
  scroll interno (R-03, R-04, R-05).
- Se especifica la **accesibilidad básica**: foco visible en todos los controles
  (`:focus-visible`), mensajes expresados con texto y no solo color, e imágenes
  con `alt` adecuado (R-06, R-07, R-08).
- Se documentan las **3 decisiones que requieren respuesta del usuario** con
  `{{DATO_PENDIENTE: ...}}` y un default propuesto, sin implementarlo.
- No se crea `tasks.md`; no se escribe CSS; no se editan los HTML.

## Capabilities

### New Capabilities

- `identidad-visual`: identidad visual propia (tokens de color, tipografía y
  espaciado), organización del CSS en archivos externos y clases reutilizables
  con nomenclatura consistente (cubre R-01, R-02, R-09).
- `diseno-adaptable`: layout con Flexbox/Grid y comportamiento adaptable a
  320 px y 1280 px, incluido el scroll interno de tablas (cubre R-03, R-04,
  R-05).
- `accesibilidad-basica`: foco visible recorrible por teclado, mensajes con
  texto (no solo color) y texto alternativo en imágenes (cubre R-06, R-07,
  R-08).

### Modified Capabilities

- Ninguna. Las capabilities existentes (`catalogo`, `libros`, `clientes`,
  `ventas`, `historial`) describen estructura DOM y no cambian de
  comportamiento: el Ejercicio 2 agrega una capa de presentación transversal.
  Inventario verificado con `openspec list --specs`: `catalogo`, `clientes`,
  `historial`, `libros`, `ventas` (4 requisitos cada una).

## Impact

- Archivos futuros afectados (solo especificados, no creados/modificados):
  nuevo(s) archivo(s) en `css/` (hoy la carpeta solo contiene `.gitkeep`) y
  `<link rel="stylesheet">` agregado al `<head>` de los 6 HTML
  (`index.html`, `catalogo.html`, `libros.html`, `clientes.html`,
  `ventas.html`, `historial.html`). Ajustes mínimos de `class`/atributos en los
  HTML existentes si el CSS los requiere (p. ej. contenedor `.tabla-contenedor`
  alrededor de las tablas).
- Sin impacto en APIs, dependencias o backend: prohibidos por alcance (sin npm,
  sin build, sin servidor, sin CDNs, sin frameworks).
- Los `id`/`name`/`data-*` especificados por el Ejercicio 1 no deben romperse;
  solo se agregan `class` y contenedores de presentación.

---

## 1. Problema, objetivo y resultado esperado

**Problema (hecho verificado):** las 6 páginas HTML (`index.html` + 5 vistas)
tienen estructura semántica y contenido estático, pero **ningún `<link>`
stylesheet ni estilo**: se renderizan con la tipografía y colores por defecto
del navegador. Sin una capa de presentación no se cumplen los 20 puntos del
Ejercicio 2 y la interfaz no es legible ni utilizable a 320 px.

**Objetivo:** especificar por completo la identidad visual, el layout adaptable
y la accesibilidad básica del frontend de la librería mediante CSS3 nativo
externo, con Flexbox/Grid, foco visible y mensajes con texto.

**Resultado esperado de esta fase:** este `proposal.md` + 3 delta specs
(`specs/identidad-visual`, `specs/diseno-adaptable`,
`specs/accesibilidad-basica`) listos para revisión del usuario. Quedan fuera de
esta fase `tasks.md` (Fase 2 — PLAN) y cualquier código CSS o edición de HTML
(Fase 3).

## 2. Contexto verificado y referencias concretas a las fuentes

### Fuentes leídas en esta sesión

- `docs/Repaso Primer Parcial.pdf` (7 páginas, extraído con pdfplumber y leído
  íntegramente; norma: si hay conflicto, vale el PDF):
  - **p. 3 — «Ejercicio 2 · 2. Presentación con CSS y uso adaptable»:** identidad
    visual propia y coherente (colores, tipografía, espaciado, tarjetas,
    formularios, botones); CSS en archivos externos con clases reutilizables;
    Flexbox o Grid; comprobación a **320 px y 1280 px** con textos y controles
    legibles y **sin desplazamiento horizontal de toda la página**; tabla que
    necesita más espacio **se desplaza dentro de su propio contenedor**; foco
    visible y recorrido por teclado; mensajes de error **con texto, no solo
    color**; imágenes informativas con texto alternativo, decorativas sin
    repetir información.
  - **p. 1 — «Contexto y alcance»:** frontend simulado; solo HTML/CSS/JS
    nativos; **sin librerías, frameworks ni CDNs**; sin API/BD/servidor/backend;
    datos ficticios. **«Organización del trabajo» Etapa 1:** se priorizan las
    pantallas del Ej. 1 y su presentación del Ej. 2; los controles pendientes se
    identifican como maqueta.
  - **p. 7 — «Criterios de evaluación»:** **2. CSS: 20 puntos = coherencia y
    organización 8 + adaptación 8 + accesibilidad básica 4**. Se valora
    separación entre estructura, estilos y comportamiento. **«Formato de
    entrega»:** carpeta con `index.html`, demás HTML, carpetas CSS/JS/recursos
    locales y README; sin dependencias ni build.
- `docs/prompts/PROMPT2.md` (113 líneas, leído íntegramente): define R-01..R-09,
  CA-01..CA-05, alcance incluido/excluido, convenciones y las 3 decisiones
  abiertas (organización del CSS, paleta exacta, iconos Unicode/emoji).
- `openspec/specs/{catalogo,libros,clientes,ventas,historial}/spec.md`
  (inventario vía `openspec list --specs`): 5 capabilities existentes, 4
  requisitos cada una, sobre estructura DOM.

### Estado del producto verificado (inspección directa)

- **Hecho verificado:** en la raíz hay **6 archivos HTML**, no 5: `index.html`
  (portada) más las 5 vistas `catalogo.html`, `libros.html`, `clientes.html`,
  `ventas.html`, `historial.html`. Diferencia con el dato recibido del
  orquestador («5 vistas»): el sexto archivo es la portada `index.html`.
- **Hecho verificado:** **ningún HTML enlaza CSS** (no hay `<link
  rel="stylesheet">`) y **no hay atributos `style` ni bloques `<style>`**.
- **Hecho verificado:** los HTML **no usan atributos `class`**; identifican
  elementos por `id`, tipo de elemento y `data-*` (`data-libro-id`,
  `data-cantidad`, `data-venta-id`).
- **Hecho verificado:** **no existen imágenes** en las vistas (no hay `img`); la
  carpeta `assets/` contiene solo `.gitkeep`. Por lo tanto R-08 no tiene objetos
  que verificar todavía y CA-05 es condicional.
- **Hecho verificado:** `css/`, `js/`, `assets/` existen pero contienen solo
  `.gitkeep` (carpeta `css/` ya creada; no hace falta crearla).
- **Hecho verificado:** existen contenedores de estado con `id` estable y
  `aria-live="polite"`, `hidden` por defecto: `catalogo-vacio`,
  `catalogo-sin-resultados`, `libros-vacio`, `libros-mensaje-ok`,
  `libros-mensaje-error`, `clientes-vacio`, `clientes-mensaje-ok`,
  `clientes-mensaje-error`, `ventas-mensaje-ok`, `ventas-mensaje-error`,
  `historial-vacio`.
- **Hecho verificado:** las tablas son `libros-tabla`, `clientes-tabla`,
  `venta-renglones`, `historial-tabla` más 2 tablas de detalle de historial sin
  `id`, todas con `thead`/`th scope="col"` y **sin contenedor de scroll**.
- **Hecho verificado:** `ventas.html` **no envuelve sus controles en un
  `<form>`** (usa bloques `<p>`); relevante para el CSS y para la semántica.
- **Hecho verificado:** los 6 archivos repiten un `nav` idéntico con 5 enlaces
  (`Catálogo`, `Libros`, `Clientes`, `Ventas`, `Historial`) y un pie con el
  texto «Datos de ejemplo para el Primer Parcial de ProgIII».

### Supuestos explícitos (no hechos)

- La paleta de colores, las familias tipográficas, la escala de espaciado y los
  nombres concretos de clases son **propuestas** (marcadas como tales en §5),
  no datos del PDF.
- El orden exacto de estilos a 1280 px (nº de columnas) es una propuesta
  sujeta a confirmación.

## 3. Alcance incluido y exclusiones explícitas

### Incluido

- Identidad visual coherente: paleta, tipografía, espaciado, tarjetas,
  formularios y botones con estilos propios (R-01).
- CSS en archivo(s) externo(s) en `css/` con clases reutilizables para
  elementos equivalentes y sin estilos inline (R-02).
- Organización del contenido con Flexbox o Grid (R-03).
- Diseño adaptable a 320 px y 1280 px sin scroll horizontal de la página (R-04,
  R-05).
- Tablas con `overflow-x` en su contenedor cuando necesitan más espacio (R-04).
- Foco visible en todos los controles interactivos, recorribles con teclado
  (R-06).
- Mensajes de error/éxito expresados con texto, no solo color (R-07).
- Imágenes informativas con `alt` descriptivo y decorativas con `alt=""` (R-08,
  condicional: hoy no hay imágenes).
- Ajustes mínimos de `class`/atributos y contenedores de presentación en los
  HTML existentes, si el CSS los requiere.

### Excluido

- Ejercicio 1 (estructura HTML): ya existe; solo se ajustan clases/atributos si
  el CSS lo requiere.
- Ejercicio 3 (arrays/objetos, renderizado de catálogo, filtro).
- Ejercicio 4 (validaciones de alta, `preventDefault`, duplicados).
- Ejercicio 5 (cálculos de venta, historial dinámico, precio histórico).
- Ejercicio 6 (`localStorage`, casos manuales, README definitivo).
- Agregar imágenes decorativas nuevas, iconos de librerías externas, librerías,
  frameworks, CDNs (CSS/JS), preprocesadores (Sass/Less), CSS-in-JS.
- API, base de datos, servidor, backend, login real, JS funcional.
- Modificar la estructura semántica HTML existente más allá de ajustes mínimos
  de clases/atributos y contenedores de presentación.
- Tests automatizados (la verificación del PDF es manual: doble clic, 320/1280
  px, teclado).

> Necesidad detectada fuera de alcance (se registra, no se implementa): el
> contraste mínimo AA de la paleta y las utilidades tipográficas fluidas
> (`clamp()`) podrían exceder «accesibilidad básica»; quedan como propuesta
> pendiente en §9.

## 4. Requisitos (R-01..R-09) con escenarios observables y casos límite

> Escenarios de comportamiento observable con apertura directa de los HTML
> (doble clic, sin servidor). Los delta specs en `specs/` son la versión
> normativa testable; aquí el resumen vinculado.

- **R-01 Tokens de identidad visual** — Custom properties CSS en `:root` para
  color, tipografía y espaciado; al menos una paleta coherente (fondo, texto,
  acento, error, éxito) y una familia tipográfica propia sin CDNs.
  Escenario: inspeccionar el CSS → existe `:root` con esos tokens y los
  componentes los referencian con `var(--...)`. Límite: no debe quedar
  tipografía ni color del navegador sin definir en los componentes principales.
- **R-02 CSS externo + clases reutilizables** — CSS en archivo(s) externo(s) en
  `css/`, enlazados desde cada HTML; clases reutilizables (`.btn`, `.card`,
  `.tabla-contenedor`, `.form-group`, `.mensaje-error`, `.mensaje-exito`); sin
  estilos inline significativos.
  Escenario: revisar `<head>` y atributos `style` → cada vista enlaza
  `css/...` y no hay `style="..."`. Límite: elementos equivalentes (dos
  botones, dos tablas) comparten la misma clase base.
- **R-03 Layout con Flexbox/Grid** — Nav, grilla de tarjetas del catálogo,
  formularios y resumen de venta usan Flexbox o Grid; sin
  `position: absolute/fixed` para el layout principal.
  Escenario: inspeccionar el CSS del nav y de la grilla → `display: flex|grid`,
  sin posicionamiento absoluto estructural. Límite: el layout funciona sin CSS
  de posicionamiento heredado de las tablas de detalle del historial.
- **R-04 320 px sin scroll horizontal** — Textos legibles (sin cortarse),
  controles utilizables, sin scroll horizontal de la página; tablas con
  `overflow-x: auto` en su contenedor.
  Escenario: abrir cada vista a 320 px → sin barra horizontal de página y las
  tablas se desplazan dentro de `.tabla-contenedor`. Límite: cadenas largas sin
  espacios (email, ISBN) deben envolverse o partirse dentro de su celda; `nav`
  con 5 enlaces debe envolver o desplazarse sin desbordar la página.
- **R-05 1280 px aprovechado** — Layout cómodo, tarjetas en grilla
  multi-columna, formularios con espacio suficiente, sin desaprovechar el ancho.
  Escenario: abrir el catálogo a 1280 px → las tarjetas aparecen en más de una
  columna. Límite: el formulario no debe quedar estirado a todo el ancho de
  forma ilegible.
- **R-06 Foco visible** — Todo control (`a`, `button`, `input`, `select`,
  `textarea`) muestra foco visible (`outline` o equivalente con
  `:focus-visible`), distinguible del estado normal.
  Escenario: recorrer con Tab → cada control enfocado muestra indicador
  visible. Límite: enlaces del `nav` y enlaces «Ver detalle»/«Volver al
  listado» también deben mostrar foco.
- **R-07 Mensajes con texto** — Error y éxito se expresan con texto (p. ej. «El
  título es obligatorio»); el color es complementario, no el único indicador.
  Escenario: presentar un error → incluye texto descriptivo. Límite: error y
  éxito se distinguen por texto, no solo por color (relevante para daltonismo).
- **R-08 Texto alternativo** — Imágenes informativas con `alt` descriptivo,
  decorativas con `alt=""`, sin repetir información innecesaria.
  Escenario: si existe una imagen informativa → `alt` la describe; si es
  decorativa → `alt=""`. Límite: hoy **no hay imágenes** (hecho verificado), por
  lo que el requisito no tiene objetos que verificar todavía.
- **R-09 Nomenclatura CSS** — Clases en kebab-case, nombres descriptivos
  (`.libro-tarjeta`, `.venta-resumen`); selectores simples y específicos; sin
  anidación excesiva ni `!important` innecesario.
  Escenario: listar las clases del CSS → todas en kebab-case y descriptivas.
  Límite: `!important` solo con justificación documentada (idealmente ninguno).

**Datos de ejemplo:** no se agregan datos nuevos; se estilizan los datos
estáticos ya presentes en las vistas del Ejercicio 1.

## 5. Estructura y componentes propuestos

> Todo lo siguiente es **propuesta** sujeta a confirmación (§9), no
> implementación. No se modifica el HTML en esta fase.

### 5.1 Organización del CSS — {{DATO_PENDIENTE: organización del CSS}}

**Default propuesto:** un único `css/styles.css` organizado con banners de
comentario en secciones: `1) tokens (:root)` → `2) reset/base` → `3) layout` →
`4) componentes` → `5) utilidades/estados` → `6) media queries`.

**Alternativa considerada:** archivos por sección (`css/base.css`,
`css/layout.css`, `css/componentes.css`, `css/responsive.css`) enlazados en
orden. Trade-off: más orden para crecer, más `<link>`s y más riesgo de
desincronización. No se elige por defecto (alcance chico).

### 5.2 Tokens de identidad visual (`:root`) — {{DATO_PENDIENTE: paleta exacta}}

Tokens propuestos (nombres y valores **propuestos**, no del PDF):

```css
:root {
  /* Color */
  --color-fondo:        #FBFAF7; /* papel */
  --color-superficie:   #FFFFFF;
  --color-texto:        #1F1B16; /* tinta */
  --color-texto-suave:  #5C554C;
  --color-borde:        #D9D2C5;
  --color-acento:       #6B2737; /* vino */
  --color-acento-suave: #F0E2E4;
  --color-error:        #B3261E;
  --color-error-suave:  #FBE9E7;
  --color-exito:        #1E7A3C;
  --color-exito-suave:  #E7F4EA;
  /* Tipografía (familias propias, sin CDN) */
  --fuente-titulo: Georgia, "Times New Roman", serif;
  --fuente-base: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --tam-base: 1rem;
  --interlineado: 1.5;
  /* Espaciado y forma */
  --espacio-1: 0.25rem; --espacio-2: 0.5rem; --espacio-3: 0.75rem;
  --espacio-4: 1rem;    --espacio-5: 1.5rem; --espacio-6: 2rem;
  --radio: 0.5rem;
  --sombra: 0 1px 3px rgba(0,0,0,.12);
  --ancho-contenido: 72rem;
}
```

### 5.3 Clases reutilizables propuestas

- Botones: `.btn` (base) + modificadores `.btn--secundario`, `.btn--peligro`.
- Tarjetas: `.card` (base) y `.libro-tarjeta` (tarjeta del catálogo).
- Tablas: `.tabla-contenedor { overflow-x: auto; }` envolviendo cada `table`;
  `.tabla` para estilo de la tabla.
- Formularios: `.form-group` (label + control), `.form-acciones`.
- Mensajes/estados: `.mensaje` (base), `.mensaje-error`, `.mensaje-exito`,
  `.mensaje-vacio`, `.mensaje-info`.
- Layout: `.contenedor` (ancho máximo centrado), `.nav-principal`,
  `.grilla-tarjetas`, `.venta-resumen`.

### 5.4 Estructura por vista (ajustes de presentación propuestos)

- **Todas:** `<link rel="stylesheet" href="css/styles.css">` en el `<head>`;
  `body > header/main/footer` envueltos o estilizados con `.contenedor`; `nav`
  con `.nav-principal` (Flexbox + `flex-wrap`).
- **Catálogo:** `#catalogo-lista` como `.grilla-tarjetas` (Grid, 1 columna en
  móvil, multi-columna ≥ 768 px); cada `article` con clase `.card`/`.libro-tarjeta`.
- **Libros/Clientes:** `form` con `.form-group` por campo; `table` envuelta en
  `.tabla-contenedor`.
- **Ventas:** selects/inputs con `.form-group`; `table#venta-renglones` envuelta
  en `.tabla-contenedor`; `#ventas-resumen` con `.venta-resumen`.
- **Historial:** ambas tablas (listado y detalle) envueltas en
  `.tabla-contenedor`.
- **Estados:** los `div` de mensajes (ids existentes) reciben `.mensaje` +
  modificador y `hidden` sigue controlando su visibilidad.

### 5.5 Interfaces y datos

- **No hay interfaces de datos nuevas.** La capa CSS no cambia el DOM
  funcional: consume los ganchos existentes (`id`, `data-*`, `aria-live`). No se
  agregan `id`/`name`/`data-*`; solo `class` y contenedores de presentación.

### 5.6 Media queries propuestas (mobile-first, R-04/R-05)

- Base (≈320 px): una columna; `nav` con `flex-wrap`; tablas con scroll interno.
- `@media (min-width: 768px)`: grilla de tarjetas a 2 columnas; formularios y
  tablas con más aire.
- `@media (min-width: 1024px)`: grilla de tarjetas a 3 columnas; contenedor
  centrado con `max-width`.

Puntos de corte **propuestos**; el requisito del PDF es verificar en los
extremos 320 px y 1280 px.

## 6. Estados y manejo de errores aplicables

Sin lógica JS (excluida), los estados existen como contenedores en el DOM
(Ejercicio 1) y esta fase solo les da estilo:

| Estado | Contenedores (`id`) | Estilo/regla propuestos |
| --- | --- | --- |
| Lista vacía | `catalogo-vacio`, `libros-vacio`, `clientes-vacio`, `historial-vacio` | `.mensaje .mensaje-vacio`; texto visible, sin depender del color |
| Búsqueda sin resultados | `catalogo-sin-resultados` | `.mensaje .mensaje-info`; `aria-live` ya presente |
| Operación correcta | `libros-mensaje-ok`, `clientes-mensaje-ok`, `ventas-mensaje-ok` | `.mensaje .mensaje-exito`; icono/color complementario, texto obligatorio (R-07) |
| Operación rechazada | `libros-mensaje-error`, `clientes-mensaje-error`, `ventas-mensaje-error` | `.mensaje .mensaje-error`; borde/fondo/color **más** texto descriptivo (R-07) |

**Manejo de errores en esta fase:** solo presentación. No se implementa
validación, `preventDefault` ni mostrar/ocultar condicional (Ej. 3–6,
excluidos). Los estados siguen controlados por `hidden`; el CSS no debe romper
el mecanismo `hidden`.

## 7. Restricciones técnicas y convenciones

- CSS3 nativo: Flexbox, Grid, media queries, custom properties. Sin
  preprocesadores ni CSS-in-JS.
- CSS en archivos externos dentro de `css/`; prohibido `style="..."` y
  `<style>` en el HTML (R-02).
- Sin librerías, frameworks ni CDNs (ni Tailwind/Bootstrap/Font Awesome/Google
  Fonts). Tipografía del sistema/propia.
- Sin npm, sin build, sin servidor: apertura directa con doble clic
  (`file://`). Los `<link>` deben ser rutas **relativas** (`css/styles.css`).
- Nomenclatura: clases kebab-case descriptivas (`.libro-tarjeta`); `!important`
  innecesario prohibido (R-09).
- No romper la semántica ni los ganchos del Ejercicio 1: `id`/`name`/`data-*`
  intactos; solo se agregan `class` y contenedores de presentación.
- Preservar `aria-live` y `hidden` de los contenedores de estado.
- Verificación **manual** (PDF): doble clic, redimensionar a 320 px y 1280 px,
  recorrer controles con teclado y comprobar foco visible. Sin tests
  automatizados.
- Prioridad de contenido sobre decoración: el diseño no reemplaza validaciones
  (PDF p. 7).

## 8. Criterios de aceptación (CA-01..CA-05) vinculados a requisitos

- [ ] **CA-01** — Los archivos CSS externos están enlazados desde los HTML y no
  hay estilos inline significativos (**R-02**).
- [ ] **CA-02** — La identidad visual es coherente: custom properties para
  colores/tipografía/espaciado; botones, tarjetas, formularios y tablas con
  estilo propio y clases reutilizables (**R-01, R-02, R-09**).
- [ ] **CA-03** — El layout usa Flexbox o Grid; a 320 px no hay scroll
  horizontal de la página y las tablas se desplazan dentro de su contenedor; a
  1280 px el layout es cómodo y multi-columna donde corresponde (**R-03, R-04,
  R-05**).
- [ ] **CA-04** — Al recorrer con teclado, todos los controles muestran foco
  visible y distinguible; los mensajes de error incluyen texto descriptivo, no
  solo color (**R-06, R-07**).
- [ ] **CA-05** — Si hay imágenes, las informativas tienen `alt` descriptivo y
  las decorativas `alt=""` (**R-08**; condicional: hoy no hay imágenes).
- [ ] Se cubre todo el alcance aprobado y no se incorpora trabajo excluido.
- [ ] Se respetan las tecnologías, dependencias y convenciones permitidas.
- [ ] Las comprobaciones exigidas se ejecutarán en Fase 3 y sus resultados se
  informarán con evidencia; **ningún control se presenta como aprobado sin
  ejecutarse**.
- [ ] Supuestos, placeholders pendientes y limitaciones quedan identificados
  (§9).

## 9. Supuestos declarados, información pendiente y decisiones que requieren respuesta

### Supuestos declarados

1. La paleta, las familias tipográficas, la escala de espaciado y los nombres de
   clase de §5 son **propuestas** (ejemplos), no datos del PDF.
2. Los puntos de corte (768/1024 px) son propuestos; el PDF solo exige verificar
   320 px y 1280 px.
3. Se permiten ajustes mínimos de `class` y contenedores de presentación en los
   HTML, sin tocar `id`/`name`/`data-*` ni la semántica.
4. No se agregan imágenes ni datos nuevos; R-08/CA-05 son condicionales porque
   hoy no hay imágenes.

### Información pendiente (`{{DATO_PENDIENTE:...}}`)

- {{DATO_PENDIENTE: organización del CSS (un archivo vs. varios por sección)}} —
  default propuesto: **un solo `css/styles.css`** organizado por secciones (§5.1).
- {{DATO_PENDIENTE: paleta de colores exacta}} — default propuesto: la paleta de
  §5.2 (fondo papel, texto tinta, acento vino, error rojo, éxito verde).
- {{DATO_PENDIENTE: si se permiten iconos Unicode/emoji o solo texto}} — default
  propuesto: **solo texto**, sin emoji ni iconos Unicode (evita ruido para
  lectores de pantalla y dependencias; los iconos de librerías están excluidos).

### Decisiones que requieren respuesta del usuario (no cerradas)

1. **Q1 — Organización del CSS:** un archivo único vs. varios por sección
   (default propuesto: archivo único).
2. **Q2 — Paleta exacta:** confirmar o reemplazar la paleta de §5.2.
3. **Q3 — Iconos:** solo texto vs. permitir Unicode/emoji (default propuesto:
   solo texto).

> Estas tres decisiones se marcan con `{{DATO_PENDIENTE:...}}`, se proponen con
> un default **sin implementarlo** y se cierran con la respuesta del usuario, tal
> como indica PROMPT2 Fase 1.
