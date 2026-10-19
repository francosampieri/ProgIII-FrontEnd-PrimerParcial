# Spec Delta — diseno-adaptable

## Purpose

Define el layout adaptable del frontend de la librería mediante Flexbox y Grid:
organización del contenido, ausencia de desplazamiento horizontal de la página a
320 px con tablas de scroll interno, y aprovechamiento del ancho a 1280 px.

## ADDED Requirements

### Requirement: Organización con Flexbox o Grid (R-03)

Los bloques principales del layout (nav, grilla de tarjetas del catálogo,
formularios y resumen de venta) SHALL organizarse con Flexbox o Grid; el layout
principal NO SHALL depender de `position: absolute/fixed`.

#### Scenario: Nav y grilla con Flexbox o Grid

- **WHEN** se inspecciona el CSS del nav y de la grilla de tarjetas del catálogo
- **THEN** usan `display: flex` o `display: grid`, y no hay `position:
  absolute` ni `position: fixed` aplicado al layout principal

#### Scenario: Formularios y resumen organizados

- **WHEN** se revisan los formularios de Libros/Clientes y el bloque de resumen
  de Ventas
- **THEN** su organización usa Flexbox o Grid en lugar de tablas de maquetación

### Requirement: Sin desplazamiento horizontal de la página a 320 px (R-04)

Con un ancho de viewport de 320 px, el contenido SHALL ser legible y utilizable
y la página NO SHALL provocar desplazamiento horizontal; los textos largos
(títulos, ISBN, emails) SHALL envolverse o partirse dentro de su contenedor.

#### Scenario: 320 px sin scroll horizontal

- **WHEN** se abre cualquier vista con el viewport a 320 px de ancho
- **THEN** el documento no presenta barra de desplazamiento horizontal y los
  textos y controles se mantienen legibles y utilizables

#### Scenario: Cadena larga sin espacios

- **WHEN** una celda o bloque muestra un valor largo sin espacios (p. ej. un
  email o un ISBN)
- **THEN** el valor envuelve o se parte dentro de su contenedor sin desbordar la
  página

#### Scenario: Nav de 5 enlaces a 320 px

- **WHEN** el `nav` con sus 5 enlaces se muestra a 320 px
- **THEN** los enlaces envuelven o se desplazan dentro del nav sin generar scroll
  horizontal de la página

### Requirement: Tablas con desplazamiento interno (R-04)

Cuando una tabla necesita más ancho que el disponible, el desplazamiento SHALL
ocurrir en su contenedor con `overflow-x: auto`, no en la página.

#### Scenario: Tabla ancha a 320 px

- **WHEN** una tabla excede el ancho del viewport
- **THEN** aparece desplazamiento horizontal dentro de `.tabla-contenedor` y la
  página permanece sin desplazamiento horizontal

### Requirement: Aprovechamiento del ancho a 1280 px (R-05)

Con un ancho de viewport de 1280 px, el layout SHALL ser cómodo: las tarjetas
del catálogo en grilla multi-columna y los formularios con espacio suficiente,
sin desaprovechar el ancho disponible.

#### Scenario: Grilla multi-columna a 1280 px

- **WHEN** se abre el catálogo con el viewport a 1280 px de ancho
- **THEN** las tarjetas de libros se muestran en más de una columna

#### Scenario: Formularios legibles a 1280 px

- **WHEN** se abren los formularios a 1280 px
- **THEN** sus campos mantienen un ancho legible y no se estiran de forma
  desproporcionada a todo el ancho de la página
