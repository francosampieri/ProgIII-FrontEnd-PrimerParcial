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
las cinco colecciones y helpers de consulta, de render y de **mutación de altas**,
de modo que los Ejercicios 4 a 6 puedan poblar selectores, listados y formularios
sin modificar la estructura de datos ni los `id` del HTML. La interfaz MUST
incluir al menos: acceso a libros y clientes, búsqueda de editorial, género,
autores, libros y clientes por id, formateo de precio, verificación de
integridad, filtro por título, renderizado del catálogo, normalización de ISBN y
email, consultas de unicidad, generación de identificadores y registro de un
libro o de un cliente. Las consultas de normalización, unicidad y búsqueda por
id MUST exponerse bajo `ElTintero.consultas`; la generación de identificadores y
las mutaciones MUST exponerse bajo `ElTintero.registros` y centralizarse en
`js/data.js`, y MUST ser el único camino por el que la capa de vista agrega
registros; la vista de los formularios MUST exponerse bajo `ElTintero.altas` en
el único archivo `js/altas.js` y MUST NOT modificar los arrays directamente. La
interfaz MUST NOT implementar edición, eliminación ni persistencia en el
navegador.

#### Scenario: Consulta de entidades relacionadas

- **WHEN** se solicita la editorial, el género o los autores de un libro por sus
  ids
- **THEN** la interfaz devuelve los registros correspondientes, o `undefined`
  para un id inexistente, sin lanzar una excepción

#### Scenario: Consulta de libro o cliente por id

- **WHEN** se solicita un libro o un cliente por `id`
- **THEN** la interfaz devuelve el registro correspondiente o `undefined` si no
  existe, sin lanzar una excepción

#### Scenario: Reutilización sin tocar el HTML

- **WHEN** un ejercicio futuro necesita la lista de clientes o de libros, o
  registrar un alta
- **THEN** puede obtenerla o ejecutarla desde la interfaz pública sin agregar ni
  cambiar elementos del HTML del catálogo ni de las vistas

#### Scenario: Mutaciones centralizadas

- **WHEN** la vista Libros o Clientes necesita agregar un registro
- **THEN** invoca `ElTintero.registros.registrarLibro` o
  `ElTintero.registros.registrarCliente` y no ejecuta `push` ni asigna ids sobre
  `ElTintero.datos` directamente

#### Scenario: Sin altas ni persistencia en esta entrega

- **WHEN** se revisa la interfaz pública
- **THEN** no expone funciones de edición ni de eliminación, ni almacenamiento
  en el navegador; las altas del Ej. 4 solo viven en memoria durante la sesión

### Requirement: Normalización de ISBN y email para comparación (R-03, R-04)

El sistema SHALL ofrecer una normalización determinista para comparar ISBN y
email, expuesta bajo `ElTintero.consultas`. La normalización de ISBN MUST
recortar espacios exteriores y quitar todos los espacios interiores y guiones,
**sin** cambiar mayúsculas/minúsculas (decisión aprobada 2026-10-20: la `x`
final se conserva como `x`); MUST NOT validar el dígito de control. La
normalización de email MUST recortar espacios exteriores y convertir a
minúsculas, sin modificar espacios interiores. Ambas funciones MUST ser puras
(no mutan el modelo) y MUST devolver una cadena (posiblemente vacía) sin lanzar
excepciones.

#### Scenario: ISBN equivalente con guiones y espacios

- **WHEN** se normalizan `978-84-376-0494-7`, `9788437604947` y
  ` 978 84 376 0494 7 `
- **THEN** las tres producen la misma cadena normalizada

#### Scenario: ISBN con X final en minúscula

- **WHEN** se normaliza un ISBN que termina en `x` y el mismo ISBN con `X` final
- **THEN** cada normalización conserva la caja original, de modo que ambas
  cadenas difieren: la comparación de unicidad no equipara `x` con `X`

#### Scenario: ISBN que queda vacío

- **WHEN** se normaliza un valor compuesto solo por espacios y guiones
- **THEN** devuelve `""` y no lanza una excepción

#### Scenario: Email con espacios exteriores y mayúsculas

- **WHEN** se normaliza ` Ana.Perez@Example.com `
- **THEN** devuelve `ana.perez@example.com`

#### Scenario: Espacios internos conservados

- **WHEN** se normaliza un email con un espacio interior
- **THEN** el espacio interior se conserva, de modo que la validación de formato
  pueda rechazarlo

### Requirement: Consultas de unicidad y generación de identificadores (R-07, R-10)

El sistema SHALL ofrecer consultas de unicidad, expuestas bajo
`ElTintero.consultas`, que indiquen si un ISBN o un email ya existen, comparando
siempre con la normalización definida y sin lanzar excepciones. El sistema SHALL
generar identificadores enteros únicos para libros y clientes, expuestos bajo
`ElTintero.registros`: `1` si la colección está vacía y, en caso contrario, el
máximo `id` existente más uno. La generación MUST NOT mutar la colección ni
reutilizar ids de registros existentes.

#### Scenario: ISBN duplicado detectado en cualquier formato

- **WHEN** el modelo contiene el libro con ISBN `978-84-376-0494-7` y se consulta
  `9788437604947` o ` 978 84 376 0494 7 `
- **THEN** la consulta de unicidad devuelve `true`

#### Scenario: ISBN nuevo

- **WHEN** se consulta un ISBN que no coincide con ningún libro existente
- **THEN** la consulta de unicidad devuelve `false`

#### Scenario: Email duplicado con mayúsculas y espacios

- **WHEN** el modelo contiene `ana.perez@example.com` y se consulta
  ` Ana.Perez@Example.com `
- **THEN** la consulta de unicidad devuelve `true`

#### Scenario: Id siguiente al máximo

- **WHEN** la colección de libros tiene ids 1 a 6 y se genera un id de libro
- **THEN** se obtiene `7`, sin modificar la colección

#### Scenario: Primer id de una colección vacía

- **WHEN** la colección de clientes está vacía y se genera un id de cliente
- **THEN** se obtiene `1`

### Requirement: Alta de libro en el modelo en memoria (R-02, R-10)

El sistema SHALL registrar un libro en `ElTintero.datos.libros`, mediante
`ElTintero.registros.registrarLibro`, solo si todas las comprobaciones de R-03
pasan: `titulo` recortado no vacío, `isbn` recortado no vacío y no duplicado
comparando normalizado, `precio` numérico finito mayor que cero, `editorialId`
existente, al menos un `autoresIds` y todos existentes sin duplicados, y
`generoId` `null` o existente. El registro MUST crearse con
`{ id, titulo, isbn, precio, editorialId, generoId, autoresIds }`, usando un id
único generado por el sistema, `generoId: null` cuando no se informa género, y
el `isbn` recortado tal como se ingresó (decisión aprobada 2026-10-20). La
operación MUST devolver un resultado explícito de éxito con el libro creado o de
fracaso con la lista de errores por campo, MUST NOT lanzar excepciones por datos
inválidos y MUST NOT producir altas parciales: si falla cualquier comprobación,
la colección MUST conservar su longitud y contenido.

#### Scenario: Alta válida de libro con género

- **WHEN** se registra un libro con título e ISBN nuevos, precio `18500`,
  editorial existente, género existente y un autor existente
- **THEN** la operación devuelve éxito, la colección crece en uno y el libro
  creado tiene id único, precio numérico y las relaciones indicadas

#### Scenario: Alta válida sin género

- **WHEN** se registra un libro con el género «Sin clasificar»
- **THEN** el libro creado tiene `generoId: null` y no se crea ningún registro
  nuevo en la colección `generos`

#### Scenario: Alta con varios autores

- **WHEN** se registra un libro seleccionando tres autores existentes
- **THEN** `autoresIds` contiene exactamente esos tres ids, sin duplicados

#### Scenario: ISBN guardado recortado

- **WHEN** se registra un libro con el ISBN ` 978-99999-0000-1 `
- **THEN** el libro creado guarda `isbn: "978-99999-0000-1"` (recortado) y un
  segundo intento con `9789999900001` se rechaza por duplicado

#### Scenario: Alta parcial rechazada

- **WHEN** se intenta registrar un libro con título válido pero sin autores
- **THEN** la operación devuelve fracaso con un error para `autoresIds` y la
  colección no cambia

#### Scenario: Referencias inexistentes

- **WHEN** se intenta registrar un libro con una editorial, un género o un autor
  cuyo id no existe
- **THEN** la operación devuelve fracaso con el error correspondiente y no se
  agrega ningún libro

#### Scenario: ISBN duplicado

- **WHEN** se intenta registrar un libro cuyo ISBN normalizado coincide con uno
  existente
- **THEN** la operación devuelve fracaso con un error para `isbn` y la colección
  no cambia

#### Scenario: Integridad posterior a las altas

- **WHEN** se ejecuta la comprobación de integridad después de una o más altas
  válidas
- **THEN** devuelve una lista vacía de errores

### Requirement: Alta de cliente en el modelo en memoria (R-04, R-10)

El sistema SHALL registrar un cliente en `ElTintero.datos.clientes`, mediante
`ElTintero.registros.registrarCliente`, solo si el nombre completo recortado no
está vacío y el email recortado no está vacío, tiene formato válido y no está
duplicado comparando normalizado (case-insensitive). El registro MUST crearse
con `{ id, nombre, email }`, con `id` único generado por el sistema, sin campo
de apellido y con `nombre` y `email` recortados tal como se ingresaron (decisión
aprobada 2026-10-20). La operación MUST devolver un resultado explícito de éxito
con el cliente creado o de fracaso con la lista de errores por campo, MUST NOT
lanzar excepciones por datos inválidos y MUST NOT producir altas parciales.

#### Scenario: Alta válida de cliente

- **WHEN** se registra un cliente con nombre completo y un email nuevo con
  formato válido
- **THEN** la operación devuelve éxito, la colección crece en uno y el cliente
  creado tiene id único, nombre y email

#### Scenario: Email duplicado en otro formato

- **WHEN** el modelo contiene `ana.perez@example.com` y se intenta registrar
  ` Ana.Perez@Example.com `
- **THEN** la operación devuelve fracaso con un error para `email` y la
  colección no cambia

#### Scenario: Nombre solo con espacios

- **WHEN** se intenta registrar un cliente con nombre compuesto solo por
  espacios
- **THEN** la operación devuelve fracaso con un error para `nombre` y la
  colección no cambia

#### Scenario: Email con formato inválido

- **WHEN** se intenta registrar un cliente con un email sin `@`, con dos `@`, sin
  punto en el dominio, con un espacio interior o con una sola letra después del
  último punto
- **THEN** la operación devuelve fracaso con un error para `email` y la
  colección no cambia

#### Scenario: Alta parcial rechazada

- **WHEN** se intenta registrar un cliente con email válido y nombre vacío
- **THEN** la operación devuelve fracaso y la colección conserva su longitud y
  contenido

#### Scenario: Integridad de clientes posterior

- **WHEN** se ejecutan varias altas válidas de clientes
- **THEN** todos los ids son únicos y el modelo sigue sin persistencia
