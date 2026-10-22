# Spec Delta

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Modelo en memoria con identificadores estables (R-01)

**Reason**: El modelo deja de ser solo en memoria: `libros`, `clientes` y
`ventas` se hidratan desde `localStorage` y se persisten. El requisito anterior
prohibía expresamente persistir.

**Migration**: Reemplazado por «Modelo local persistente con identificadores
estables (R-01)».

### Requirement: Interfaz pública reutilizable para los Ejercicios 4 a 6 (R-09)

**Reason**: La interfaz ahora incluye `ElTintero.persistencia`; el requisito
anterior prohibía la persistencia en el navegador.

**Migration**: Reemplazado por «Interfaz pública con persistencia centralizada
(R-09)».

### Requirement: Preparación de la persistencia futura (R-09)

**Reason**: El Ejercicio 6 implementa la persistencia que este requisito dejaba
preparada; mantenerlo en el spec haría contradictorio el comportamiento actual.

**Migration**: El comportamiento pasa a los requisitos de la capability
`persistencia` y a «Interfaz pública con persistencia centralizada (R-09)».

## ADDED Requirements

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
