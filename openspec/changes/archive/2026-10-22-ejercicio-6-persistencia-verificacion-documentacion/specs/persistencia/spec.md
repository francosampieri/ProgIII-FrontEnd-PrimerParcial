# Spec Delta

## Purpose

Conserva libros, clientes y ventas en `localStorage` entre recargas y
navegaciones, con siembra única de los ejemplos, recuperación sin duplicados y
manejo controlado de datos inválidos.

## ADDED Requirements

### Requirement: Claves versionadas por colección y esquema documentado (R-03)

El sistema SHALL persistir `libros`, `clientes` y `ventas` en claves separadas
de `localStorage`, cada una con nombre explícito y versión en el sufijo. Las
claves MUST ser `eltintero.libros.v1`, `eltintero.clientes.v1` y
`eltintero.ventas.v1`, y cada valor MUST ser un array JSON con los registros de
esa colección. Las colecciones `editoriales`, `generos` y `autores` MUST NOT
persistirse y MUST seguir obteniéndose del catálogo fijo definido en
`js/data.js`. El esquema de cada registro MUST quedar documentado en el README,
incluyendo los campos de `Venta` y de cada renglón.

#### Scenario: Tres claves independientes

- **WHEN** se inspecciona `localStorage` después de la carga inicial
- **THEN** existen exactamente las claves `eltintero.libros.v1`,
  `eltintero.clientes.v1` y `eltintero.ventas.v1`, y cada valor es un array JSON

#### Scenario: Catálogo de referencia no persistido

- **WHEN** se revisan las claves de `localStorage`
- **THEN** no existen claves para editoriales, géneros ni autores, y esos datos
  siguen disponibles desde el modelo fijo al recargar

#### Scenario: Esquema de venta y renglón documentado

- **WHEN** se consulta el README
- **THEN** describe los campos de una venta (`id`, `fecha`, `clienteId`,
  `clienteNombre`, `renglones`, `total`) y de cada renglón (`libroId`,
  `tituloLibro`, `cantidad`, `precioUnitario`, `subtotal`)

### Requirement: Carga inicial con siembra única de los ejemplos (R-01)

En la primera apertura de un navegador y perfil sin datos guardados, el sistema
SHALL inicializar `ElTintero.datos` con los ejemplos actuales —6 libros, 3
clientes y 2 ventas— y MUST persistirlos. El sistema MUST considerar primer
inicio de una colección a la ausencia de su clave; un array vacío guardado MUST
respetarse como colección vacía y MUST NOT provocar una nueva siembra. Una vez
sembrada una colección, las aperturas posteriores MUST NOT volver a agregar los
ejemplos.

#### Scenario: Primer inicio sin claves

- **WHEN** se abre `index.html` o cualquier vista por `file://` en un perfil sin
  datos guardados
- **THEN** el modelo contiene 6 libros, 3 clientes y 2 ventas de ejemplo, y las
  tres claves quedan escritas con esos registros

#### Scenario: Segundo inicio recupera lo guardado

- **WHEN** se cierra y se vuelve a abrir la página en el mismo navegador,
  perfil y ubicación
- **THEN** el modelo contiene exactamente los registros guardados y no se
  agregan copias adicionales de los ejemplos

#### Scenario: Colección vacía respetada

- **WHEN** una clave contiene un array vacío guardado
- **THEN** el modelo conserva esa colección vacía en lugar de volver a sembrar
  los ejemplos

#### Scenario: Clave ausente aislada

- **WHEN** falta solo una de las tres claves y las otras contienen datos válidos
- **THEN** se siembra únicamente la colección faltante y se conservan intactas
  las demás

### Requirement: Recuperación entre recargas y navegación sin duplicados (R-01, R-02)

Al cargar cualquier vista, el sistema SHALL hidratar `ElTintero.datos` desde
`localStorage` antes de que los scripts de vista rendericen. La hidratación MUST
reemplazar el contenido de cada colección, no concatenarlo, de modo que
recargar repetidamente o navegar entre `catalogo.html`, `libros.html`,
`clientes.html`, `ventas.html` e `historial.html` MUST NOT duplicar libros,
clientes, ventas ni ejemplos.

#### Scenario: Recarga repetida sin duplicados

- **WHEN** se recarga la misma página cinco veces seguidas
- **THEN** la cantidad de libros, clientes y ventas es la misma en cada carga

#### Scenario: Navegación entre vistas

- **WHEN** se da de alta un libro y se navega a `catalogo.html`, `libros.html` y
  `ventas.html`
- **THEN** el libro aparece en las tres vistas sin duplicarse

#### Scenario: Hidratación previa al render

- **WHEN** se abre una vista con `localStorage` disponible
- **THEN** los datos recuperados están en `ElTintero.datos` antes de que la
  vista genere su contenido y no se observa un render con los ejemplos seguido
  de un reemplazo por los datos guardados

### Requirement: Persistencia centralizada de las mutaciones (R-02, R-09)

El sistema SHALL persistir la colección afectada inmediatamente después de cada
mutación válida: `registrarLibro` después de agregar el libro,
`registrarCliente` después de agregar el cliente y `registrarVenta` después de
agregar la venta. Toda lectura, escritura, serialización y nombre de clave MUST
centralizarse en `js/data.js` bajo `ElTintero.persistencia`; la capa de vista
MUST NOT acceder a `localStorage` ni a las claves directamente. Las mutaciones
MUST conservar sus contratos de retorno existentes.

#### Scenario: Alta de libro persistida

- **WHEN** se registra un libro válido y se recarga `libros.html`
- **THEN** el libro aparece en la tabla y sigue en `eltintero.libros.v1`

#### Scenario: Alta de cliente persistida

- **WHEN** se registra un cliente válido y se navega a `ventas.html`
- **THEN** el cliente aparece en el selector de cliente y sigue en
  `eltintero.clientes.v1`

#### Scenario: Venta confirmada persistida

- **WHEN** se confirma una venta válida y se navega a `historial.html`
- **THEN** la venta aparece en el historial y sigue en `eltintero.ventas.v1`

#### Scenario: Vista sin acceso directo al almacenamiento

- **WHEN** se revisan `js/catalogo.js`, `js/altas.js`, `js/ventas.js` y
  `js/historial.js`
- **THEN** ninguno contiene llamadas a `localStorage` ni nombres de claves

### Requirement: Validación de los datos guardados y política de recuperación (R-04)

Antes de hidratar una colección, el sistema SHALL parsear su JSON y validar que
sea un array de registros con los campos obligatorios y los tipos esperados. Si
el JSON es inválido, el valor no es un array o el esquema no se cumple, el
sistema MUST descartar solo esa colección, restaurar sus ejemplos, persistirlos
y continuar con las demás colecciones válidas. La aplicación MUST NOT romper, MUST
NOT lanzar excepciones hacia la vista y MUST NOT duplicar registros como
consecuencia del fallback.

#### Scenario: JSON inválido en una clave

- **WHEN** `eltintero.libros.v1` contiene texto que no es JSON válido y se
  recarga `catalogo.html`
- **THEN** la vista muestra los 6 libros de ejemplo, la clave se reescribe con
  JSON válido y las claves de clientes y ventas conservan sus datos previos

#### Scenario: Esquema inválido

- **WHEN** `eltintero.clientes.v1` contiene un array con un registro sin `email`
  o con `id` no numérico
- **THEN** esa colección se restaura a los 3 clientes de ejemplo y las demás no
  se modifican

#### Scenario: Valor que no es array

- **WHEN** una clave contiene un objeto o un valor primitivo en lugar de un
  array
- **THEN** la colección se considera inválida y se aplica el mismo fallback

#### Scenario: Datos parciales

- **WHEN** una colección guardada tiene algunos registros válidos y otros
  incompletos
- **THEN** la colección completa se reemplaza por sus ejemplos, sin mezclar
  registros válidos e inválidos

### Requirement: Integridad verificada después de cargar y de guardar (R-04, R-08)

Después de hidratar y después de cada guardado, el sistema SHALL ejecutar
`verificarIntegridad()` y MUST dejar el modelo en un estado en el que devuelva
una lista vacía de errores con los datos de ejemplo y después de altas y ventas
válidas. Si la verificación detecta errores referenciales después de hidratar, el
sistema MUST restablecer a los ejemplos las colecciones implicadas y volver a
verificar; si el problema persiste, MUST restablecer las tres colecciones
persistidas antes de continuar. Los errores MUST informarse de forma controlada y
MUST NOT impedir el render de las vistas.

#### Scenario: Integridad con los ejemplos

- **WHEN** se carga por primera vez el proyecto
- **THEN** `ElTintero.consultas.verificarIntegridad()` devuelve `[]` y no hay
  errores no controlados en consola

#### Scenario: Integridad después de altas y venta

- **WHEN** se registran un libro, un cliente y una venta válidos
- **THEN** `verificarIntegridad()` devuelve `[]` y los registros siguen
  persistidos

#### Scenario: Integridad rota detectada al hidratar

- **WHEN** `eltintero.ventas.v1` referencia un `libroId` que no existe en
  `eltintero.libros.v1`
- **THEN** el sistema informa el problema, restablece las colecciones implicadas
  a sus ejemplos y la aplicación sigue renderizando

### Requirement: Almacenamiento no disponible y errores de escritura (R-04, R-08)

Si `localStorage` no está disponible, está bloqueado o rechaza una escritura por
cuota, el sistema SHALL continuar funcionando con el modelo y los ejemplos en
memoria, MUST informar el problema mediante `console.error` o `console.warn`
controlado y MUST NOT interrumpir la navegación ni el render. Un fallo de
escritura MUST NOT descartar la mutación ya aplicada en memoria ni cambiar el
contrato de retorno de las funciones de alta.

#### Scenario: Almacenamiento bloqueado

- **WHEN** el navegador impide el acceso a `localStorage`
- **THEN** las vistas cargan con los ejemplos, las altas funcionan en memoria y
  se registra un aviso controlado en consola

#### Scenario: Cuota excedida

- **WHEN** una escritura de `eltintero.ventas.v1` falla por falta de espacio
- **THEN** la venta permanece en memoria, se informa el fallo por consola y la
  vista muestra el resultado normal de la confirmación

### Requirement: Catálogo de libros aislado de las ventas guardadas (R-03, R-05)

La estructura persistida SHALL permitir modificar únicamente el `precio` de un
libro dentro de `eltintero.libros.v1` sin alterar ni borrar
`eltintero.ventas.v1`. Al recargar, el catálogo MUST reflejar el precio
modificado y las ventas MUST conservar sus `precioUnitario`, `subtotal` y
`total` confirmados, sin recalcularse desde el precio actual.

#### Scenario: Solo se modifica un precio

- **WHEN** se edita el `precio` de un libro en `eltintero.libros.v1` y se
  recarga `catalogo.html`
- **THEN** la tarjeta del libro muestra el precio nuevo y
  `eltintero.ventas.v1` conserva exactamente los mismos registros

#### Scenario: Historial con precio histórico

- **WHEN** después de esa edición se abre `historial.html` y se consulta el
  detalle de una venta que incluía el libro
- **THEN** el detalle muestra el `precioUnitario`, el `subtotal` y el `total`
  confirmados, no los recalculados con el precio nuevo

### Requirement: Restablecimiento controlado para pruebas (R-04)

El sistema SHALL exponer una función de restablecimiento accesible solo por
consola, `ElTintero.persistencia.restablecer()`, que borre las tres claves
versionadas, vuelva a sembrar los ejemplos y devuelva un resultado explícito. La
función MUST NOT exponerse mediante un botón, enlace o control visible en la
interfaz. Su inclusión queda sujeta a la decisión D-06.

#### Scenario: Restablecer desde consola

- **WHEN** se ejecuta `ElTintero.persistencia.restablecer()` en la consola y se
  recarga la página
- **THEN** el modelo vuelve a los 6 libros, 3 clientes y 2 ventas de ejemplo, y
  las claves quedan reescritas con esos datos

#### Scenario: Sin control visible

- **WHEN** se recorren las cinco vistas y su navegación
- **THEN** no existe ningún botón, enlace o formulario de restablecimiento de
  datos

### Requirement: Sin datos sensibles ni persistencia fuera de alcance (R-08)

El sistema SHALL persistir únicamente datos ficticios del dominio de la librería.
MUST NOT usar `sessionStorage`, IndexedDB, cookies, Cache API, service workers,
`fetch` ni backend. MUST NOT guardar credenciales, datos personales reales ni
información ajena al modelo descrito.

#### Scenario: Solo claves del dominio

- **WHEN** se inspecciona `localStorage` después de operar la aplicación
- **THEN** solo existen las tres claves `eltintero.*.v1` con datos ficticios del
  modelo

#### Scenario: Sin tecnologías excluidas

- **WHEN** se busca `sessionStorage`, `indexedDB`, `document.cookie`, `fetch` o
  `serviceWorker` en `js/` y en los HTML
- **THEN** no hay coincidencias
