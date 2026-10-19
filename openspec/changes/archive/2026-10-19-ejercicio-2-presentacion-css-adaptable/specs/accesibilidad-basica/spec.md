# Spec Delta — accesibilidad-basica

## Purpose

Garantiza que el frontend de la librería sea recorrible por teclado con foco
visible, que sus mensajes comuniquen su significado con texto además de color y
que las imágenes se describan correctamente para tecnologías de asistencia.

## ADDED Requirements

### Requirement: Foco visible en controles interactivos (R-06)

Todo control interactivo (`a`, `button`, `input`, `select`, `textarea`) SHALL
mostrar un foco visible al recibirlo, con un estilo distinguible del estado
normal, preferentemente mediante `:focus-visible`.

#### Scenario: Foco visible al recorrer con teclado

- **WHEN** se recorre una vista con la tecla Tab
- **THEN** cada control enfocado muestra un indicador de foco (outline o
  equivalente) distinguible del estado sin foco

#### Scenario: Foco visible en enlaces

- **WHEN** el foco llega a un enlace (p. ej. del nav, «Ver detalle» o «Volver al
  listado»)
- **THEN** el enlace muestra un indicador de foco visible

### Requirement: Mensajes con texto, no solo color (R-07)

Los mensajes de error y de éxito SHALL expresar su significado con texto (p. ej.
«El título es obligatorio»); el color SHALL ser complementario y nunca el único
indicador.

#### Scenario: Error legible sin depender del color

- **WHEN** se presenta un mensaje de error
- **THEN** contiene texto descriptivo que explica el problema sin depender del
  color

#### Scenario: Distinción entre error y éxito por texto

- **WHEN** se comparan un mensaje de error y uno de éxito
- **THEN** se distinguen por su texto, no únicamente por su color

### Requirement: Texto alternativo en imágenes (R-08)

Las imágenes informativas SHALL tener un atributo `alt` descriptivo; las
decorativas SHALL tener `alt=""`; el `alt` NO SHALL repetir información
innecesaria.

> Estado verificado: las vistas actuales no contienen elementos `img`; el
> requisito aplica de forma condicional si se incorporan imágenes.

#### Scenario: Imagen informativa descrita

- **WHEN** existe una imagen que aporta información
- **THEN** su atributo `alt` la describe de forma concisa

#### Scenario: Imagen decorativa sin ruido

- **WHEN** existe una imagen meramente decorativa
- **THEN** su atributo `alt` es `""`

#### Scenario: Vistas sin imágenes (estado actual)

- **WHEN** se inspeccionan las vistas actuales
- **THEN** no hay elementos `img` y, por lo tanto, no hay `alt` que verificar
  todavía
