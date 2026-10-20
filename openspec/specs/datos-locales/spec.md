# datos-locales Specification

## Purpose
Define el modelo de datos local en memoria de la librería (libros, editoriales,
géneros, autores y clientes) con identificadores estables, relaciones por id,
datos de ejemplo e integridad referencial verificable, reutilizable por los
Ejercicios 4 a 6 sin persistencia ni altas.

## Requirements

### Requirement: Modelo en memoria con identificadores estables (R-01)

El sistema SHALL exponer cinco colecciones locales en memoria —`libros`,
`editoriales`, `generos`, `autores` y `clientes`— construidas con arrays y
objetos literales. Cada registro MUST tener un `id` numérico entero único dentro
de su colección, estable durante toda la sesión de la página, y MUST estar
marcado en la documentación del código como dato de ejemplo. El modelo
MUST existir antes de ejecutarse cualquier lógica de catálogo y MUST NOT
persistirse en el navegador.

#### Scenario: Colecciones disponibles con ids únicos

- **WHEN** se abre `catalogo.html` con doble clic y se inspecciona el modelo en
  la consola
- **THEN** existen las cinco colecciones y, en cada una, todos los `id` son
  numéricos, únicos y estables

#### Scenario: Sin persistencia

- **WHEN** se recarga la página después de modificar una colección en consola
- **THEN** el modelo vuelve a los datos de ejemplo iniciales, porque no se usa
  `localStorage`, `sessionStorage` ni IndexedDB

#### Scenario: Datos marcados como ejemplo

- **WHEN** se revisa la definición de los datos
- **THEN** los registros están identificados como datos de ejemplo (y los ISBN
  de los libros 4–6 como placeholders no verificados), no como datos reales de
  la librería

### Requirement: Conjunto inicial mínimo de datos de ejemplo (R-01)

El modelo SHALL incluir 6 libros, 3 editoriales, 3 géneros, 5 autores y 3
clientes marcados como datos de ejemplo. Los libros MUST ser obras reales con
autor y editorial reales; los ISBN de los libros 4–6 MUST ser placeholders de
ejemplo del bloque `978-84-0000-…`, presentados como no verificados
bibliográficamente, y MUST NOT presentarse como ISBN reales. Los precios MUST
almacenarse como números (sin símbolo de moneda ni separadores de miles) y MUST
formatearse solo al renderizarse; son valores de ejemplo, no precios de
mercado.

#### Scenario: Mínimos exigidos

- **WHEN** se cuentan los registros de cada colección
- **THEN** hay 6 libros, 3 editoriales, 3 géneros, 5 autores y 3 clientes

#### Scenario: Precio numérico en el modelo

- **WHEN** se inspecciona el campo `precio` de cualquier libro
- **THEN** su valor es un número (por ejemplo `18500`), no una cadena con `$` ni
  con puntos de miles

#### Scenario: Libros actuales conservados

- **WHEN** se comparan los datos de ejemplo con el catálogo previo
- **THEN** los libros con `id` 1, 2 y 3 conservan título, ISBN, editorial,
  género, autores y precio equivalentes a las tarjetas estáticas reemplazadas

#### Scenario: Obras reales con ISBN de ejemplo

- **WHEN** se revisan los libros con `id` 4, 5 y 6 y sus ISBN
- **THEN** sus títulos, autores y editoriales son obras o entidades reales y sus
  ISBN pertenecen al bloque placeholder `978-84-0000-…`, documentados como no
  verificados bibliográficamente

#### Scenario: Géneros de ejemplo

- **WHEN** se inspecciona la colección `generos`
- **THEN** contiene exactamente Novela, Antología y Cuento, con ids 1, 2 y 3

### Requirement: Relaciones por identificador e integridad referencial (R-02)

Cada libro SHALL referenciar mediante `editorialId` una editorial existente,
mediante `autoresIds` uno o más autores existentes y mediante `generoId` un
género existente o `null`. El valor `null` en `generoId` MUST representar la
ausencia de género y MUST NOT existir un registro «Sin clasificar» dentro de
`generos`. Al menos un libro MUST tener `generoId: null`. El sistema MUST ofrecer
una comprobación de integridad ejecutable que devuelva e informe los errores
referenciales sin interrumpir el renderizado del catálogo.

#### Scenario: Referencias válidas en los datos de ejemplo

- **WHEN** se ejecuta la comprobación de integridad sobre los datos iniciales
- **THEN** devuelve una lista vacía de errores y no registra errores en consola

#### Scenario: Género ausente válido

- **WHEN** la comprobación evalúa un libro con `generoId: null`
- **THEN** no lo informa como error, porque la ausencia de género es válida

#### Scenario: Libro sin género a propósito

- **WHEN** se inspecciona el libro «El Aleph» (`id` 3)
- **THEN** tiene `generoId: null` de forma deliberada para ejercitar el literal
  «Sin clasificar», y la comprobación no lo marca como error

#### Scenario: Referencia inexistente detectada sin romper la vista

- **WHEN** se altera en consola el `editorialId` de un libro por un id
  inexistente y se vuelve a ejecutar la comprobación
- **THEN** la comprobación informa el error con `console.error` y el catálogo
  sigue mostrando tarjetas, sin lanzar una excepción que detenga la página

#### Scenario: «Sin clasificar» no es un género del arreglo

- **WHEN** se inspecciona la colección `generos`
- **THEN** ninguno de sus registros se llama «Sin clasificar»

### Requirement: Interfaz pública reutilizable para los Ejercicios 4 a 6 (R-09)

El sistema SHALL exponer un único punto de acceso global documentado que ofrezca
las cinco colecciones y helpers de consulta y de render, de modo que los
Ejercicios 4 a 6 puedan poblar selectores y listados sin modificar el HTML del
catálogo. La interfaz MUST incluir al menos: acceso a libros y clientes,
búsqueda de editorial, género y autores por id, formateo de precio,
verificación de integridad, filtro por título y renderizado del catálogo. Esta
interfaz MUST NOT implementar altas, bajas, modificaciones ni persistencia.

#### Scenario: Consulta de entidades relacionadas

- **WHEN** se solicita la editorial, el género o los autores de un libro por sus
  ids
- **THEN** la interfaz devuelve los registros correspondientes, o `undefined`
  para un id inexistente, sin lanzar una excepción

#### Scenario: Reutilización sin tocar el HTML

- **WHEN** un ejercicio futuro necesita la lista de clientes o de libros
- **THEN** puede obtenerla desde la interfaz pública sin agregar ni cambiar
  elementos del HTML del catálogo

#### Scenario: Sin altas ni persistencia en esta entrega

- **WHEN** se revisa la interfaz pública
- **THEN** no expone funciones de alta, edición, eliminación ni almacenamiento
  en el navegador
