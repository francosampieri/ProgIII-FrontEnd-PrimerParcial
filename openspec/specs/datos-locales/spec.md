# datos-locales Specification

## Purpose
Define el modelo de datos local en memoria de la librería (libros, editoriales,
géneros, autores y clientes) con identificadores estables, relaciones por id,
datos de ejemplo e integridad referencial verificable, reutilizable por los
Ejercicios 4 a 6 sin persistencia ni altas.

## Requirements

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
lanzar excepciones por datos inválidos y MUST NOT producir altas parciales. Tras
un alta válida, el cliente MUST quedar persistido en la colección
correspondiente de `localStorage`.

#### Scenario: Alta válida de cliente

- **WHEN** se registra un cliente con nombre completo y un email nuevo con
  formato válido
- **THEN** la operación devuelve éxito, la colección crece en uno, el cliente
  creado tiene id único, nombre y email, y queda persistido

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

- **WHEN** se ejecutan varias altas válidas de clientes y se recarga la página
- **THEN** todos los ids son únicos, se conservan los clientes persistidos y no
  se duplica ningún ejemplo

### Requirement: Ventas de ejemplo en el modelo (R-05)

La colección `ElTintero.datos.ventas` SHALL incluir 2 ventas de ejemplo
ficticias, con `id` 1 y 2, coherentes con los libros y clientes existentes y
marcadas como datos de ejemplo, no reales. La venta 1 MUST referenciar al
cliente 1, la venta 2 al cliente 2; sus renglones MUST referenciar libros
existentes y sus `precioUnitario` y `subtotal` MUST coincidir con los precios de
ejemplo del catálogo. Las fechas MUST declararse ficticias.

#### Scenario: Cantidad y coherencia de las ventas de ejemplo

- **WHEN** se inspecciona `ElTintero.datos.ventas` al cargar la página
- **THEN** contiene 2 ventas con ids 1 y 2, clientes existentes y renglones con
  libros existentes

#### Scenario: Precios de ejemplo tomados del catálogo actual

- **WHEN** se revisan los renglones de la venta 1 y de la venta 2
- **THEN** la venta 1 usa el libro 1 a `18500` y totaliza `18500`, y la venta 2
  usa los libros 2 y 3 a `21400` y `15900` y totaliza `37300`

#### Scenario: Marcadas como ficticias

- **WHEN** se revisa la documentación del código de las ventas de ejemplo
- **THEN** se declara que los datos y las fechas son ficticios y no provienen de
  ventas reales

### Requirement: Búsqueda de venta por identificador (R-09)

El sistema SHALL exponer `ElTintero.consultas.buscarVentaPorId(id)`, que MUST
devolver la venta cuyo `id` coincide o `undefined` si no existe, siguiendo el
comportamiento de `buscarLibroPorId` y `buscarClientePorId`. La función MUST ser
pura y MUST NOT lanzar excepciones por ids inválidos o inexistentes.

#### Scenario: Venta existente

- **WHEN** se busca la venta con id `1`
- **THEN** devuelve el registro de esa venta con sus renglones y total

#### Scenario: Venta inexistente

- **WHEN** se busca una venta con un id que no existe
- **THEN** devuelve `undefined` sin lanzar una excepción

#### Scenario: Entrada inválida

- **WHEN** se busca una venta con `null`, `undefined` o una cadena no numérica
- **THEN** devuelve `undefined` sin lanzar una excepción

### Requirement: Generación del identificador de venta (R-09)

El sistema SHALL exponer `ElTintero.registros.generarIdVenta()`, que MUST
devolver un entero único: `1` si `ventas` está vacía y, en caso contrario, el
máximo `id` existente más uno. La función MUST NOT mutar la colección ni
reutilizar ids de ventas existentes.

#### Scenario: Id siguiente al máximo

- **WHEN** `ventas` contiene ids 1 y 2 y se genera un id de venta
- **THEN** se obtiene `3`, sin modificar la colección

#### Scenario: Primer id de la colección de ventas

- **WHEN** `ventas` está vacía y se genera un id de venta
- **THEN** se obtiene `1`

### Requirement: Registro de venta en el modelo en memoria (R-04, R-09)

El sistema SHALL registrar una venta en `ElTintero.datos.ventas`, mediante
`ElTintero.registros.registrarVenta({ clienteId, renglones })`, solo si el
`clienteId` corresponde a un cliente existente, hay al menos un renglón y cada
renglón tiene un `libroId` existente y una `cantidad` entera mayor que cero, sin
libros repetidos según la política del delta de `ventas`. La venta MUST crearse
con `{ id, fecha, clienteId, clienteNombre, renglones, total }`; cada renglón
MUST guardar `{ libroId, tituloLibro, cantidad, precioUnitario, subtotal }`,
copiando `tituloLibro` y `precioUnitario` del catálogo **en el momento de la
confirmación** y calculando `subtotal = cantidad × precioUnitario` y
`total = Σ subtotal`, ambos redondeados a dos decimales. La operación MUST
devolver `{ exito: true, venta }` o `{ exito: false, errores }`, donde `errores`
es una lista de `{ campo, mensaje }` con `campo` en `clienteId`, `renglones`,
`libroId` o `cantidad`; MUST NOT lanzar excepciones por datos inválidos y MUST
NOT producir altas parciales: si falla cualquier comprobación, `ventas` MUST
conservar su longitud y contenido.

#### Scenario: Alta válida de venta

- **WHEN** se registra una venta con un cliente existente y un renglón de 2
  unidades de un libro existente
- **THEN** la operación devuelve éxito, `ventas` crece en uno y la venta creada
  tiene id único, fecha, cliente, renglón con precio unitario histórico,
  subtotal y total

#### Scenario: Venta sin renglones

- **WHEN** se registra una venta con `renglones: []`
- **THEN** devuelve fracaso con un error para `renglones` y `ventas` no cambia

#### Scenario: Cliente inexistente

- **WHEN** se registra una venta con un `clienteId` que no existe
- **THEN** devuelve fracaso con un error para `clienteId` y no se agrega nada

#### Scenario: Libro inexistente en un renglón

- **WHEN** se registra una venta con un renglón cuyo `libroId` no existe
- **THEN** devuelve fracaso con un error para `libroId` y no se agrega nada

#### Scenario: Cantidad inválida en un renglón

- **WHEN** se registra una venta con un renglón de cantidad `0`, negativa,
  decimal o no numérica
- **THEN** devuelve fracaso con un error para `cantidad` y no se agrega nada

#### Scenario: Snapshot del precio al confirmar

- **WHEN** se registra una venta y, antes de llamar a `registrarVenta`, cambia
  el `precio` del libro en el catálogo
- **THEN** el renglón guarda el precio vigente al confirmar, y el título y el
  total correspondientes

#### Scenario: Sin alta parcial

- **WHEN** una venta tiene un renglón válido y otro inválido
- **THEN** la operación devuelve fracaso y `ventas` conserva su longitud y
  contenido

### Requirement: Integridad de las ventas en la verificación del modelo (R-07)

`ElTintero.consultas.verificarIntegridad()` SHALL ampliarse para validar la
colección `ventas` además de las colecciones existentes: `id` único, `clienteId`
existente, `renglones` no vacíos, cada `libroId` existente, cada `cantidad`
entera mayor que cero, cada `precioUnitario` finito no negativo, cada `subtotal`
igual a `cantidad × precioUnitario` redondeado a dos decimales y `total` igual a
la suma de los subtotales. La verificación MUST reportar los errores sin lanzar
excepciones que interrumpan el renderizado y MUST devolver una lista vacía con
los datos de ejemplo y después de ventas válidas.

#### Scenario: Integridad con los datos de ejemplo

- **WHEN** se ejecuta la verificación sobre el modelo inicial con las 2 ventas
  de ejemplo
- **THEN** devuelve `[]` y no registra errores en consola

#### Scenario: Integridad después de ventas válidas

- **WHEN** se registran una o más ventas válidas y se ejecuta la verificación
- **THEN** devuelve `[]`

#### Scenario: Venta con libro inexistente detectada

- **WHEN** se altera en consola el `libroId` de un renglón por un id inexistente
  y se ejecuta la verificación
- **THEN** informa el error correspondiente y no lanza una excepción

#### Scenario: Total incoherente detectado

- **WHEN** se altera en consola el `total` de una venta para que no coincida con
  la suma de subtotales y se ejecuta la verificación
- **THEN** informa el error de total incoherente

### Requirement: Inmutabilidad del contrato de ventas (R-05)

El sistema SHALL exponer únicamente la creación de ventas. La interfaz pública
MUST NOT ofrecer funciones para actualizar, anular o eliminar ventas
confirmadas, ni para modificar sus renglones, precios, subtotales o totales. La
capa de vista MUST NOT mutar `ElTintero.datos.ventas` directamente; toda alta
MUST pasar por `ElTintero.registros.registrarVenta`.

#### Scenario: Sin API de modificación

- **WHEN** se revisa `ElTintero.registros` y `ElTintero.consultas`
- **THEN** no existen funciones de actualización, anulación ni eliminación de
  ventas

#### Scenario: Solo lectura desde el historial

- **WHEN** la vista del historial necesita mostrar ventas
- **THEN** las lee de `ElTintero.datos.ventas` o de `buscarVentaPorId`, sin
  modificar sus registros

### Requirement: Formateo de importes con dos decimales (R-03)

El sistema SHALL exponer `ElTintero.consultas.formatearImporte(valor)`, que MUST
formatear un número con `Intl.NumberFormat("es-AR", { minimumFractionDigits: 2,
maximumFractionDigits: 2 })` y prefijo `"$"`, devolviendo una cadena como
`$1.234,56` sin lanzar excepciones. `ElTintero.consultas.formatearPrecio` MUST
conservarse con cero decimales para el catálogo y la tabla de libros, y MUST NOT
modificarse para las ventas.

#### Scenario: Importe con separador de miles y dos decimales

- **WHEN** se formatea `1234.56`
- **THEN** devuelve `$1.234,56`

#### Scenario: Importe entero con dos decimales

- **WHEN** se formatea `18500`
- **THEN** devuelve `$18.500,00`

#### Scenario: Formateo de catálogo intacto

- **WHEN** se formatea el precio `18500` con `formatearPrecio`
- **THEN** devuelve `$18.500`, sin decimales

### Requirement: Modelo local persistente con identificadores estables (R-01)

El sistema SHALL exponer seis colecciones locales —`libros`, `editoriales`,
`generos`, `autores`, `clientes` y `ventas`— construidas con arrays y objetos
literales. Cada registro MUST tener un `id` numérico entero único dentro de su
colección, estable entre recargas, y los registros sembrados desde los ejemplos
MUST estar marcados en la documentación del código como datos de ejemplo. El
modelo MUST existir antes de ejecutarse cualquier lógica de catálogo, ventas o
historial. Las colecciones `libros`, `clientes` y `ventas` MUST hidratarse desde
`localStorage` dentro de `js/data.js` antes de que rendericen las vistas, y MUST
persistirse después de cada mutación válida. Las colecciones `editoriales`,
`generos` y `autores` MUST permanecer fijas en el código y MUST NOT persistirse.

#### Scenario: Colecciones disponibles con ids únicos

- **WHEN** se abre `catalogo.html` o `ventas.html` con doble clic y se
  inspecciona el modelo en la consola
- **THEN** existen las seis colecciones y, en cada una, todos los `id` son
  numéricos, únicos y estables

#### Scenario: Hidratación previa al render

- **WHEN** se abre una vista con datos previamente guardados
- **THEN** `ElTintero.datos.libros`, `ElTintero.datos.clientes` y
  `ElTintero.datos.ventas` ya contienen los registros recuperados antes de que el
  script de la vista genere su contenido

#### Scenario: Datos marcados como ejemplo

- **WHEN** se revisa la definición de los datos
- **THEN** los registros sembrados están identificados como datos de ejemplo (y
  los ISBN de los libros 4–6 como placeholders no verificados), no como datos
  reales de la librería

#### Scenario: Persistencia entre recargas

- **WHEN** se recarga la página después de una alta o una venta válida
- **THEN** el modelo conserva los registros persistidos en lugar de volver a los
  ejemplos iniciales

### Requirement: Interfaz pública con persistencia centralizada (R-09)

El sistema SHALL exponer un único punto de acceso global documentado que ofrezca
las seis colecciones y helpers de consulta, de render, de **mutación de altas y
ventas** y de **persistencia**, de modo que los Ejercicios 4 a 6 puedan poblar
selectores, listados, formularios e historial sin modificar la estructura de
datos ni los `id` del HTML. La interfaz MUST incluir al menos: acceso a libros y
clientes, búsqueda de editorial, género, autores, libros, clientes y ventas por
id, formateo de precio y de importes con dos decimales, verificación de
integridad, filtro por título, renderizado del catálogo, normalización de ISBN y
email, consultas de unicidad, generación de identificadores y registro de un
libro, de un cliente o de una venta. Las consultas de normalización, unicidad,
búsqueda por id y formateo MUST exponerse bajo `ElTintero.consultas`; la
generación de identificadores y las mutaciones MUST exponerse bajo
`ElTintero.registros`; la carga, siembra, guardado y restablecimiento MUST
exponerse bajo `ElTintero.persistencia`; todas MUST centralizarse en
`js/data.js`, y las mutaciones MUST ser el único camino por el que la capa de
vista agrega registros. La vista de los formularios de alta MUST exponerse bajo
`ElTintero.altas` en el archivo `js/altas.js`, y las vistas de venta e historial
bajo sus propios namespaces en archivos externos de `js/`, sin modificar los
arrays directamente ni acceder a `localStorage`. La interfaz MUST NOT implementar
edición ni eliminación de registros, ni administración del almacenamiento desde
la interfaz visible.

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

- **WHEN** un ejercicio futuro necesita la lista de clientes, de libros o de
  ventas, o registrar un alta o una venta
- **THEN** puede obtenerla o ejecutarla desde la interfaz pública sin agregar ni
  cambiar elementos del HTML del catálogo ni de las vistas

#### Scenario: Mutaciones centralizadas

- **WHEN** la vista Libros, Clientes o Ventas necesita agregar un registro
- **THEN** invoca `ElTintero.registros.registrarLibro`,
  `ElTintero.registros.registrarCliente` o
  `ElTintero.registros.registrarVenta` y no ejecuta `push` ni asigna ids sobre
  `ElTintero.datos` directamente

#### Scenario: Persistencia centralizada

- **WHEN** una vista necesita leer o escribir datos persistidos
- **THEN** lo hace a través de `ElTintero.persistencia` y no contiene claves de
  `localStorage` ni llamadas directas al almacenamiento

#### Scenario: Sin edición ni eliminación

- **WHEN** se revisa la interfaz pública
- **THEN** no expone funciones de edición ni de eliminación de libros, clientes
  o ventas, ni controles visibles de administración del almacenamiento

### Requirement: Persistencia de las altas de libros y clientes (R-02)

El sistema SHALL persistir `ElTintero.datos.libros` y `ElTintero.datos.clientes`
inmediatamente después de un alta válida, de modo que las altas sobrevivan a la
recarga y a la navegación entre `catalogo.html`, `libros.html`, `clientes.html` y
`ventas.html`. Las altas MUST seguir siendo rechazadas sin mutación ni escritura
cuando no cumplen las validaciones existentes.

#### Scenario: Libro persistido y visible en el catálogo

- **WHEN** se registra un libro válido y se navega a `catalogo.html`
- **THEN** el libro aparece en el catálogo y sigue presente después de recargar

#### Scenario: Cliente persistido y visible en ventas

- **WHEN** se registra un cliente válido y se abre `ventas.html`
- **THEN** el cliente aparece en el selector y sigue presente después de recargar

#### Scenario: Alta rechazada sin escritura

- **WHEN** se intenta registrar un libro con ISBN duplicado
- **THEN** el alta se rechaza, la colección no cambia y el contenido persistido
  conserva exactamente los mismos registros
