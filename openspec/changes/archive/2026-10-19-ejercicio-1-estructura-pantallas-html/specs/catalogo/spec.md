# Spec Delta — catalogo

## Purpose

Define la estructura observable de la vista Catálogo y la navegación global:
título de la librería, buscador por título y listado de libros con sus seis
datos, alcanzable desde el `nav` de `index.html` con datos estáticos de ejemplo.

## ADDED Requirements

### Requirement: Navegación global a las 5 vistas (R-01)

El documento de entrada `index.html` SHALL exponer un elemento `nav` con
enlaces visibles a las 5 vistas (Catálogo, Libros, Clientes, Ventas,
Historial), cada uno con `href` válido hacia su destino (ancla de sección o
archivo HTML según {{DATO_PENDIENTE: multi-página vs. secciones en una página
con anclas}}; default propuesto: página única con anclas).

#### Scenario: Alcanzar cada vista desde el nav

- **WHEN** se abre `index.html` con doble clic (sin servidor) y se activa cada
  enlace del `nav`
- **THEN** la vista correspondiente (Catálogo, Libros, Clientes, Ventas,
  Historial) queda visible y muestra su contenido esperado

#### Scenario: Hrefs válidos sin JS

- **WHEN** se inspecciona cada enlace del `nav`
- **THEN** su `href` apunta a un `id` de sección existente o a un archivo HTML
  existente, sin depender de JavaScript para resolver el destino

### Requirement: Contenido del catálogo (R-02)

La vista Catálogo SHALL contener un encabezado con el título de la librería
({{DATO_PENDIENTE: nombre de la librería}}; default propuesto: «El Tintero»
como ejemplo), un formulario buscador con `label` asociado a
`input#catalogo-titulo[type=search]` y botones «Buscar por título» y «Limpiar
búsqueda», y un listado `catalogo-lista` donde cada libro expone título, ISBN,
editorial, género, autores y precio; al menos un libro de ejemplo muestra el
literal «Sin clasificar» como género.

#### Scenario: Cada libro expone los seis datos

- **WHEN** se inspecciona el DOM de `catalogo-lista` con sus 3 libros de
  ejemplo
- **THEN** cada libro presenta título, ISBN, editorial, género, autores y
  precio visibles, y al menos uno presenta el literal exacto «Sin clasificar»

#### Scenario: Buscador etiquetado

- **WHEN** se recorre el formulario `catalogo-buscador`
- **THEN** el campo de búsqueda tiene `label for="catalogo-titulo"` y existen
  botones con los textos «Buscar por título» y «Limpiar búsqueda»

#### Scenario: Libro con varios autores y libro sin género

- **WHEN** se revisan los ejemplos límite (un libro con más de un autor, un
  libro sin género asignado)
- **THEN** los autores se presentan como lista legible y la ausencia de género
  se presenta con el literal «Sin clasificar», nunca como celda vacía

### Requirement: Estados del catálogo en el DOM (R-07 parcial)

La vista SHALL incluir los contenedores `catalogo-vacio` (lista vacía) y
`catalogo-sin-resultados` (búsqueda sin resultados) en el DOM, con `id`
estable y `aria-live="polite"`; vacíos por defecto o con texto de ejemplo
claramente marcado como «(ejemplo)».

#### Scenario: Contenedores de estado direccionables

- **WHEN** el catálogo muestra los libros de ejemplo
- **THEN** `catalogo-vacio` y `catalogo-sin-resultados` existen en el DOM con
  `aria-live="polite"`, aunque estén ocultos o vacíos

### Requirement: Calidad y convenciones del catálogo (R-08, R-09, R-10 parcial)

La vista SHALL usar `header`/`nav`/`main`/`section`/`article`/`footer` con
jerarquía de encabezados sin saltos, `id` en formato `vista-elemento`, y cada
libro SHALL llevar un gancho estable `data-libro-id` documentado para uso de
los Ej. 3–5, sin implementar comportamiento JS.

#### Scenario: Semántica e identificadores

- **WHEN** se inspecciona la estructura del documento
- **THEN** existen `header`, `nav`, `main` y `footer`, los encabezados no
  saltan niveles, todo `id` cumple el patrón `vista-elemento` y cada libro
  expone `data-libro-id` único
