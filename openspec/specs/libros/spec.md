# libros Specification

## Purpose

Define la estructura observable de la vista Libros: formulario de alta con
todos sus campos etiquetados y tabla de libros registrados, con estados en el
DOM y ganchos estables para los Ej. 3–5, usando datos estáticos de ejemplo.

## Requirements

### Requirement: Formulario de alta de libros (R-03 parcial)

La vista SHALL contener `form#libros-form` con los campos título
(`input#libros-titulo`), ISBN (`input#libros-isbn`), precio
(`input#libros-precio[type=number]`), editorial (`select#libros-editorial`),
género (`select#libros-genero` con opción «Sin clasificar») y autores como
grupo de checkboxes dentro de `<fieldset><legend>Autores</legend>`, con un
`input[type=checkbox] name="autores"` por autor, cada uno con `id`
`libros-autor-<id>` y su `label` asociado (al menos un ejemplo marcado), cada
campo con su `label for`, más un botón con texto de acción («Registrar
libro»).

#### Scenario: Todos los campos etiquetados

- **WHEN** se recorre el formulario solo mediante lectura del DOM
- **THEN** cada `input`/`select` tiene un `label` cuyo `for` coincide con su
  `id`, el selector de género incluye la opción «Sin clasificar», el grupo de
  autores está dentro de un `<fieldset>` con `<legend>Autores</legend>` donde
  todos los checkboxes comparten `name="autores"`, y el botón describe su
  acción

### Requirement: Tabla de libros registrados (R-03 parcial)

La vista SHALL contener `table#libros-tabla` con `thead` y columnas exactas
Título, ISBN, Editorial, Género, Autores, Precio (`th scope="col"`), con filas
estáticas de ejemplo (3 libros, uno «Sin clasificar»).

#### Scenario: Columnas y encabezados

- **WHEN** se inspecciona `libros-tabla`
- **THEN** el `thead` presenta las seis columnas exigidas con `th scope="col"`
  y las filas de ejemplo muestran valores coherentes con el catálogo

### Requirement: Estados de altas de libros (R-07 parcial)

La vista SHALL incluir `libros-vacio`, `libros-mensaje-ok` y
`libros-mensaje-error` en el DOM con `id` estable y `aria-live="polite"`,
vacíos por defecto o con texto de ejemplo marcado como «(ejemplo)».

#### Scenario: Mensajes de operación direccionables

- **WHEN** la tabla muestra los libros de ejemplo
- **THEN** los tres contenedores existen en el DOM con `aria-live="polite"`
  aunque estén ocultos o vacíos

### Requirement: Ganchos para validaciones futuras (R-10 parcial)

Cada campo del formulario SHALL llevar `id` y `name` estables
(`libros-titulo`, `libros-isbn`, `libros-precio`, `libros-editorial`,
`libros-genero`) documentados para que el Ej. 4 los use sin cambiar el HTML;
los checkboxes de autores SHALL usar `name="autores"` compartido y `id`
estables `libros-autor-<id>` por autor (ejemplo con 3 autores:
`libros-autor-1`, `libros-autor-2`, `libros-autor-3`, cada uno con su `label`
asociado); no se implementa validación ni `preventDefault`.

#### Scenario: Diccionario de ganchos completo

- **WHEN** se lista el conjunto `id`/`name` de la vista Libros
- **THEN** cubre los seis campos exigidos por el PDF p. 4 (título, ISBN,
  precio, editorial, género, autores) —con los autores como checkboxes
  `libros-autor-<id>` de `name` compartido `autores`— sin duplicar ningún
  `id` del documento
