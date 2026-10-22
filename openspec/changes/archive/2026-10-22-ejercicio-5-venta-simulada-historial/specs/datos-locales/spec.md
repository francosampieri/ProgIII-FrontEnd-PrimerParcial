# Spec Delta — datos-locales

## MODIFIED Requirements

### Requirement: Modelo en memoria con identificadores estables (R-01)

El sistema SHALL exponer seis colecciones locales en memoria —`libros`,
`editoriales`, `generos`, `autores`, `clientes` y `ventas`— construidas con
arrays y objetos literales. Cada registro MUST tener un `id` numérico entero
único dentro de su colección, estable durante toda la sesión de la página, y
MUST estar marcado en la documentación del código como dato de ejemplo. El
modelo MUST existir antes de ejecutarse cualquier lógica de catálogo, ventas o
historial y MUST NOT persistirse en el navegador.

#### Scenario: Colecciones disponibles con ids únicos

- **WHEN** se abre `catalogo.html` o `ventas.html` con doble clic y se
  inspecciona el modelo en la consola
- **THEN** existen las seis colecciones y, en cada una, todos los `id` son
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

### Requirement: Interfaz pública reutilizable para los Ejercicios 4 a 6 (R-09)

El sistema SHALL exponer un único punto de acceso global documentado que ofrezca
las seis colecciones y helpers de consulta, de render y de **mutación de altas y
ventas**, de modo que los Ejercicios 4 a 6 puedan poblar selectores, listados,
formularios e historial sin modificar la estructura de datos ni los `id` del
HTML. La interfaz MUST incluir al menos: acceso a libros y clientes, búsqueda de
editorial, género, autores, libros, clientes y ventas por id, formateo de precio
y de importes con dos decimales, verificación de integridad, filtro por título,
renderizado del catálogo, normalización de ISBN y email, consultas de unicidad,
generación de identificadores y registro de un libro, de un cliente o de una
venta. Las consultas de normalización, unicidad, búsqueda por id y formateo MUST
exponerse bajo `ElTintero.consultas`; la generación de identificadores y las
mutaciones MUST exponerse bajo `ElTintero.registros` y centralizarse en
`js/data.js`, y MUST ser el único camino por el que la capa de vista agrega
registros; la vista de los formularios de alta MUST exponerse bajo
`ElTintero.altas` en el archivo `js/altas.js`, y las vistas de venta e historial
bajo sus propios namespaces en archivos externos de `js/`, sin modificar los
arrays directamente. La interfaz MUST NOT implementar edición, eliminación ni
persistencia en el navegador.

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

#### Scenario: Sin altas ni persistencia en esta entrega

- **WHEN** se revisa la interfaz pública
- **THEN** no expone funciones de edición ni de eliminación de libros, clientes
  o ventas, ni almacenamiento en el navegador; los registros creados solo viven
  en memoria durante la sesión

## ADDED Requirements

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

### Requirement: Preparación de la persistencia futura (R-09)

El contrato de ventas SHALL documentar que el Ejercicio 6 persistirá y
recuperará las ventas leyendo y escribiendo `ElTintero.datos.ventas` y volviendo
a invocar las funciones públicas de render del historial, sin cambiar los `id`
del HTML ni las firmas descritas. En esta entrega MUST NOT implementarse
persistencia ni simularse con almacenamiento del navegador.

#### Scenario: Ganchos documentados

- **WHEN** se revisa la documentación del contrato en `js/data.js` o en los
  delta specs
- **THEN** se identifican `ElTintero.datos.ventas`,
  `ElTintero.registros.registrarVenta`, `ElTintero.consultas.buscarVentaPorId` y
  las funciones de render del historial como puntos de extensión del Ej. 6

#### Scenario: Sin persistencia adelantada

- **WHEN** se busca almacenamiento en el código de ventas
- **THEN** no hay `localStorage`, `sessionStorage`, IndexedDB ni cookies
