# clientes Specification

## Purpose

Define la estructura observable de la vista Clientes: formulario de alta de
nombre completo y email con etiquetas asociadas y tabla de registrados, con
estados en el DOM y ganchos estables, usando datos estáticos de ejemplo.

## Requirements

### Requirement: Formulario de alta de clientes (R-04 parcial)

La vista SHALL contener `form#clientes-form` con nombre completo
(`input#clientes-nombre`) y email (`input#clientes-email[type=email]`), ambos
con `label for`, más un botón con texto de acción («Registrar cliente»). No
se exige campo de apellido separado (PDF p. 4).

#### Scenario: Campos etiquetados y botón descriptivo

- **WHEN** se recorre el formulario mediante lectura del DOM
- **THEN** ambos campos tienen `label` asociado a su `id`, el email usa
  `type="email"` y el botón describe su acción

### Requirement: Tabla de clientes registrados (R-04 parcial)

La vista SHALL contener `table#clientes-tabla` con `thead` y columnas exactas
Nombre completo y Email (`th scope="col"`), con 2 filas estáticas de ejemplo.

#### Scenario: Columnas exactas

- **WHEN** se inspecciona `clientes-tabla`
- **THEN** el `thead` presenta exactamente «Nombre completo» y «Email» con
  `th scope="col"` y existen 2 filas de ejemplo

### Requirement: Estados de altas de clientes (R-07 parcial)

La vista SHALL incluir `clientes-vacio`, `clientes-mensaje-ok` y
`clientes-mensaje-error` en el DOM con `id` estable y `aria-live="polite"`,
vacíos por defecto o con texto de ejemplo marcado como «(ejemplo)».

#### Scenario: Mensajes de operación direccionables

- **WHEN** la tabla muestra los clientes de ejemplo
- **THEN** los tres contenedores existen en el DOM con `aria-live="polite"`
  aunque estén ocultos o vacíos

### Requirement: Ganchos para validaciones futuras (R-10 parcial)

Cada campo SHALL llevar `id` y `name` estables (`clientes-nombre`,
`clientes-email`) documentados para que el Ej. 4 los use sin cambiar el HTML;
no se implementa validación de formato ni de duplicados.

#### Scenario: Diccionario de ganchos completo

- **WHEN** se lista el conjunto `id`/`name` de la vista Clientes
- **THEN** cubre nombre completo y email sin duplicar ningún `id` del
  documento
