# Design — ejercicio-2-presentacion-css-adaptable

> Fase: SPEC/planificación (Fase 1 de PROMPT2). No implementa código ni edita
> HTML. Precedencia: ante conflicto con `docs/Repaso Primer Parcial.pdf`, vale el
> PDF. Motivación y alcance: ver `proposal.md`.

## Context

Las 6 páginas HTML (`index.html` + 5 vistas) ya tienen estructura semántica,
contenido estático y ganchos `id`/`name`/`data-*` (Ejercicio 1 archivado), pero
**no enlazan ninguna hoja de estilos** (hecho verificado). La carpeta `css/`
existe con solo `.gitkeep`. Las restricciones que condicionan el enfoque son:
CSS3 nativo únicamente; sin npm/build/servidor; apertura directa con doble clic;
verificación manual a 320 px y 1280 px y por teclado; sin librerías, frameworks
ni CDNs.

## Goals / Non-Goals

**Goals:**

- Una capa de presentación externa que dé identidad visual coherente, layout
  adaptable y accesibilidad básica sin tocar la semántica ni los ganchos del
  Ejercicio 1.
- Mantener el cambio mínimo en el HTML: agregar el `<link>` y clases /
  contenedores de presentación donde el CSS lo requiera.

**Non-Goals:**

- Cualquier lógica JS (Ej. 3–6), validaciones, cálculos o persistencia.
- Cambiar `id`/`name`/`data-*`, la estructura de navegación multi-página o el
  contenido de ejemplo.
- Introducir dependencias, preprocesadores, iconos externos o imágenes nuevas.

## Decisions

### D1 — CSS externo en `css/`, un archivo por defecto (pendiente de confirmación)

**Decisión propuesta:** un único `css/styles.css` enlazado desde los 6 HTML,
organizado por secciones con banners de comentario (tokens → base → layout →
componentes → utilidades/estados → media queries).

**Alternativas consideradas:** archivos por sección (`base.css`, `layout.css`,
`componentes.css`, `responsive.css`). *Por qué no por defecto:* el alcance es
chico y un solo archivo reduce `<link>`s y evita problemas de orden de cascada;
la organización por banners conserva la legibilidad. Queda como
`{{DATO_PENDIENTE: organización del CSS}}`.

### D2 — Mobile-first con tokens en `:root` (R-01, R-04, R-05)

**Decisión:** declarar custom properties en `:root` (color, tipografía,
espaciado, forma) y construir mobile-first: base para ≈320 px y media queries
`min-width` para anchos mayores. Los puntos de corte propuestos son 768 px y
1024 px.

**Rationale:** los tokens centralizan la identidad visual y hacen coherente el
estilo entre vistas (coherencia y organización, 8 pts del PDF); mobile-first
garantiza que 320 px es el caso base y no una excepción. Print/`max-width` no se
necesitan. Evaluación en 320 px y 1280 px (extremos exigidos por el PDF).

### D3 — Layout con Flexbox y Grid según el bloque (R-03)

**Decisión:** Grid para la grilla de tarjetas del catálogo (columnas
responsivas con `auto-fit`/`minmax`); Flexbox para el `nav`, barras de acciones
de formulario y el resumen de venta. Sin `position: absolute/fixed` para el
layout.

**Alternativas consideradas:** usar float o tablas de maquetación. *Descartadas:*
obsoletas, no adaptables y prohibidas por el alcance (Grid/Flexbox).

### D4 — Scroll interno de tablas (R-04)

**Decisión:** envolver cada `table` en un contenedor `.tabla-contenedor` con
`overflow-x: auto`; la tabla usa `min-width` interno para activar el scroll sin
desbordar la página.

**Rationale:** es la técnica que el propio PDF exige («la tabla se desplaza
dentro de su propio contenedor»). Requiere un ajuste estructural mínimo: agregar
el `div` contenedor alrededor de tablas que hoy no lo tienen.

### D5 — Foco visible con `:focus-visible` (R-06)

**Decisión:** un `outline` de alto contraste con `outline-offset` aplicado a
`a`, `button`, `input`, `select`, `textarea`; usar `:focus-visible` para mostrar
el foco principalmente a navegación por teclado y no en clic de ratón.

**Alternativas consideradas:** `:focus` siempre (más simple pero muestra foco en
clic). *Trade-off:* `:focus-visible` es más pulido pero tiene que verificarse por
teclado, que es exactamente la comprobación exigida.

### D6 — Mensajes con texto y color complementario (R-07)

**Decisión:** clases `.mensaje` + modificadores `.mensaje-error`,
`.mensaje-exito`, `.mensaje-vacio`, `.mensaje-info`, aplicadas a los `div` de
estado existentes (que ya tienen `aria-live`). El color/borde/fondo acompañan,
pero el texto es obligatorio.

**Rationale:** el PDF exige que el error no dependa solo del color. No se toca
el mecanismo `hidden` ni se agrega lógica.

### D7 — R-08 condicional (sin imágenes)

**Decisión:** no se agregan imágenes. Se deja documentada la regla `alt`
descriptivo / `alt=""` para el futuro; CA-05 se marca condicional.

**Rationale:** hecho verificado: hoy no hay `img`; inventar imágenes estaría
fuera de alcance.

### Pendientes que requieren respuesta del usuario

- **D1** — organización del CSS (default: un archivo). `{{DATO_PENDIENTE}}`.
- **D8** — paleta exacta (default: paleta papel/tinta/vino de `proposal.md`
  §5.2). `{{DATO_PENDIENTE}}`.
- **D9** — iconos Unicode/emoji vs. solo texto (default: solo texto).
  `{{DATO_PENDIENTE}}`.

## Risks / Trade-offs

- **[Ajuste estructural requerido] Agregar `.tabla-contenedor` alrededor de las
  tablas** (y posiblemente `.contenedor` en `body`) es una edición mínima de
  HTML, no solo CSS → Mitigación: limitar a envoltorios con `class`, sin tocar
  `id`/`data-*`/semántica; documentar cada ajuste en `tasks.md` (Fase 2).
- **[Contraste] Una paleta «cálida» (vino sobre papel) puede no alcanzar
  contraste AA para texto pequeño** → Mitigación: validar contraste en Fase 3 y
  ajustar tokens si hace falta; el PDF solo exige accesibilidad básica.
- **[`:focus-visible`] Soporte y verificación** → Mitigación: probar recorrido
  real por teclado en 320/1280 px; `outline` visible aunque `:focus-visible` no
  aplique.
- **[Scroll interno de tablas] Envoltura extra puede romper selección de texto
  o el ancho a 1280 px** → Mitigación: `overflow-x: auto` solo cuando excede;
  a 1280 px las tablas caben sin scroll.
- **[Cascada con archivo único] Un solo archivo puede volverse largo** →
  Mitigación: banners de sección y orden estable; se revisa si el usuario
  prefiere varios archivos (D1).
- **[Fuera de alcance] Contraste AA formal y tipografía fluida (`clamp()`)** →
  Mitigación: registrar como propuesta pendiente; no implementar sin
  autorización.

## Open Questions

- Confirmar D1, D8 y D9 (organización del CSS, paleta exacta e iconos). Son
  decisiones del usuario; no cambian los requisitos del PDF pero sí el aspecto y
  la estructura de archivos, por eso se aplican como **default propuesto sin
  implementar** hasta su respuesta.
