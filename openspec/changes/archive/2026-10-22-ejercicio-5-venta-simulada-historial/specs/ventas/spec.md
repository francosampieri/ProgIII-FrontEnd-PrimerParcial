# Spec Delta — ventas

## MODIFIED Requirements

### Requirement: Selección de cliente y renglones (R-05 parcial)

La vista SHALL poblar `select#ventas-cliente` desde `ElTintero.datos.clientes`
(3 registros) y `select#ventas-libro` desde `ElTintero.datos.libros` (6
registros) al cargar `ventas.html`, con una opción inicial vacía «Seleccionar
cliente» / «Seleccionar libro», el `id` numérico como `value` y el nombre o
título como texto visible. La vista MUST NOT conservar las opciones
hardcodeadas. La vista SHALL conservar `input#ventas-cantidad[type=number]` con
su `label` y el botón «Agregar renglón», que SHALL incorporar a la tabla el
renglón compuesto con el libro y la cantidad elegidos. La tabla
`table#venta-renglones` SHALL conservar su `thead` con
las columnas exactas Libro, Cantidad, Precio unitario, Subtotal, Acciones
(`th scope="col"`) y SHALL renderizarse desde la composición en memoria, sin
filas estáticas de ejemplo. Cada renglón MUST mostrar libro, cantidad, precio
unitario y subtotal, y MUST ofrecer controles para cambiar la cantidad y quitar
el renglón antes de confirmar (Ej. 5 R-01).

#### Scenario: Controles de composición presentes

- **WHEN** se abre `ventas.html` con doble clic
- **THEN** `#ventas-cliente` contiene una opción vacía y las 3 opciones de los
  clientes del modelo (`value` `1`, `2` y `3`), y `#ventas-libro` contiene una
  opción vacía y las 6 opciones de los libros del modelo (`value` `1` a `6`)

#### Scenario: Sin opciones hardcodeadas

- **WHEN** se inspeccionan las opciones de ambos selectores
- **THEN** los `value` son exactamente la cadena vacía y los `id` numéricos del
  modelo, sin valores ni textos ajenos a `ElTintero.datos`

#### Scenario: Renglón agregado con sus cuatro datos

- **WHEN** se selecciona un cliente existente, el libro `id` 1 y cantidad `2`, y
  se activa «Agregar renglón»
- **THEN** la tabla muestra una fila con «Cien años de soledad», cantidad `2`,
  precio unitario `$18.500,00` y subtotal `$37.000,00`

#### Scenario: Venta sin renglones

- **WHEN** la composición no tiene renglones
- **THEN** el `<tbody>` de `#venta-renglones` no tiene filas, el total es
  `$0,00` y el estado de composición vacía es visible junto a la tabla

### Requirement: Resumen y confirmación (R-05 parcial)

El bloque `#ventas-resumen` SHALL conservar `#ventas-total` y el botón
«Confirmar venta», y SHALL mostrar el total de la composición como la suma de
los subtotales de los renglones. El total y cada subtotal MUST recalcularse al
agregar un renglón, al cambiar su cantidad y al quitarlo. Los importes de venta
MUST presentarse con exactamente dos decimales mediante
`ElTintero.consultas.formatearImporte`, sin modificar `formatearPrecio` (que
sigue sin decimales para catálogo y libros). El total con la composición vacía
MUST mostrarse como `$0,00`. (Ej. 5 R-03)

#### Scenario: Resumen inspeccionable

- **WHEN** se revisa `#ventas-resumen` sin renglones
- **THEN** el total visible en `#ventas-total` es `$0,00` y el botón «Confirmar
  venta» describe su acción

#### Scenario: Total como suma de subtotales

- **WHEN** la composición tiene 2 unidades de un libro a 14.300 y 1 unidad de
  otro a 15.900
- **THEN** los subtotales son `$28.600,00` y `$15.900,00`, y el total es
  `$44.500,00`

#### Scenario: Recálculo al cambiar la cantidad

- **WHEN** se cambia la cantidad de un renglón de `2` a `3`
- **THEN** su subtotal y el total de la venta se actualizan en el mismo
  renderizado

#### Scenario: Recálculo al quitar un renglón

- **WHEN** se quita un renglón de una composición con dos o más renglones
- **THEN** ese renglón desaparece, el total se reduce en su subtotal y los demás
  renglones conservan sus valores

### Requirement: Estados de la venta (R-07 parcial)

La vista SHALL incluir `#ventas-mensaje-ok` y `#ventas-mensaje-error` con
`aria-live="polite"`, visibles solo cuando corresponda y controlados únicamente
con el atributo `hidden`. Los mensajes MUST ser de texto y MUST NOT mostrarse
simultáneamente: al mostrar el éxito MUST ocultarse el error y viceversa. Ante
un rechazo, la composición ya cargada MUST conservarse para corregirla. La
composición sin renglones MUST distinguirse del estado de historial vacío de la
vista Historial. (Ej. 5 R-06)

#### Scenario: Mensajes de resultado direccionables

- **WHEN** el formulario de venta está en su estado inicial
- **THEN** ambos contenedores existen en el DOM con `aria-live="polite"` y
  ocultos

#### Scenario: Éxito y error excluyentes

- **WHEN** se produce un rechazo después de un éxito, o un éxito después de un
  rechazo
- **THEN** queda visible solo el mensaje del último resultado y el otro queda
  oculto

#### Scenario: Rechazo conserva la composición

- **WHEN** se intenta agregar un renglón inválido o se rechaza la confirmación
- **THEN** los renglones y el cliente ya cargados se mantienen y solo se agrega
  el mensaje de error

### Requirement: Ganchos para cálculos futuros (R-10 parcial)

Los controles SHALL conservar `id`/`name` estables (`ventas-cliente`,
`ventas-libro`, `ventas-cantidad`, `ventas-total`) y cada renglón MUST exponer
`data-libro-id` y `data-cantidad`, de modo que la composición sea direccionable
sin cambiar el HTML. Los controles de cambio de cantidad y de quitar renglón
MUST tener nombre accesible y ser utilizables con teclado. No MUST existir `id`
duplicados en el documento. (Ej. 5 R-09, R-10)

#### Scenario: Renglones direccionables por libro

- **WHEN** se lista un renglón de la composición
- **THEN** expone `data-libro-id` coincidente con un libro del catálogo y
  `data-cantidad` con la cantidad actual, sin `id` duplicados en el documento

#### Scenario: Controles de renglón accesibles

- **WHEN** se recorre la tabla de renglones con el teclado
- **THEN** el control de cantidad y el botón de quitar de cada renglón reciben
  foco visible y anuncian su acción (incluido el libro al que pertenecen)

## ADDED Requirements

### Requirement: Validación de la composición de renglones (R-02)

La vista SHALL rechazar la incorporación de un renglón cuando el libro no esté
seleccionado, el `value` no corresponda a un libro existente, o la cantidad no
sea un número entero mayor que cero (vacía, no numérica, decimal, cero o
negativa). En todos los casos MUST NOT agregarse ni modificarse ningún renglón,
MUST mostrarse un mensaje de texto en `#ventas-mensaje-error` y MUST conservarse
la composición válida y la selección de cliente ya cargada.

#### Scenario: Cantidad vacía

- **WHEN** se intenta agregar un libro con la cantidad vacía
- **THEN** no se agrega el renglón y se muestra un mensaje de cantidad inválida

#### Scenario: Cantidad no numérica

- **WHEN** se intenta agregar un libro con una cantidad que no es un número
- **THEN** no se agrega el renglón y se muestra un mensaje de cantidad inválida

#### Scenario: Cantidad decimal

- **WHEN** se intenta agregar un libro con cantidad `1.5`
- **THEN** no se agrega el renglón y se muestra un mensaje que exige un número
  entero

#### Scenario: Cantidad cero o negativa

- **WHEN** se intenta agregar un libro con cantidad `0` o `-2`
- **THEN** no se agrega el renglón y se muestra un mensaje que exige una
  cantidad mayor que cero

#### Scenario: Libro no seleccionado

- **WHEN** se activa «Agregar renglón» con la opción vacía de `#ventas-libro`
- **THEN** no se agrega el renglón y se muestra un mensaje que pide seleccionar
  un libro

#### Scenario: Libro inexistente por id manipulado

- **WHEN** se fuerza en consola un `value` de `#ventas-libro` que no corresponde
  a ningún libro y se activa «Agregar renglón»
- **THEN** no se agrega el renglón y se muestra un mensaje de libro inexistente

#### Scenario: Composición válida conservada tras el rechazo

- **WHEN** ya hay renglones válidos y se rechaza uno nuevo
- **THEN** los renglones previos, el cliente seleccionado y el total permanecen
  sin cambios

### Requirement: Política de libro repetido (R-02)

La composición SHALL admitir como máximo un renglón por libro (decisión D1
aprobada el 2026-10-21). Al intentar agregar un libro ya presente MUST NOT
crearse un segundo renglón, MUST conservarse intacto el renglón existente —sin
modificar su cantidad ni su subtotal— y MUST mostrarse un mensaje de duplicado.

#### Scenario: Libro repetido rechazado

- **WHEN** se intenta agregar un libro que ya tiene un renglón en la composición
- **THEN** la tabla conserva un único renglón para ese libro, con la cantidad
  anterior, y se muestra un mensaje de duplicado

### Requirement: Presentación de importes de venta con dos decimales (R-03)

La vista SHALL presentar cada subtotal y el total con
`ElTintero.consultas.formatearImporte(valor)`, cuyo contrato se define en el
delta de `datos-locales`, de modo que ambos importes muestren exactamente dos
decimales. El cálculo de subtotales y del total MUST redondearse a dos
decimales con `Math.round(valor * 100) / 100` para evitar artefactos de coma
flotante. `formatearPrecio` MUST conservarse sin decimales para catálogo y
libros, y MUST NOT usarse para los importes de venta.

#### Scenario: Importe con dos decimales

- **WHEN** se formatea el número `18500`
- **THEN** se obtiene `$18.500,00`

#### Scenario: Sin artefactos de coma flotante

- **WHEN** se calcula el subtotal de `3` unidades a `18500.05`
- **THEN** el subtotal guardado y mostrado es `$55.500,15`, no un valor con
  dígitos residuales

#### Scenario: Catálogo sin cambios de formato

- **WHEN** se abre el catálogo o la tabla de libros
- **THEN** los precios siguen mostrándose con `formatearPrecio`, sin decimales

### Requirement: Confirmación y registro de la venta (R-04)

La confirmación SHALL rechazarse si no hay cliente seleccionado, si el
`clienteId` no existe, si no hay renglones o si algún renglón tiene cantidad
inválida; en esos casos MUST NOT registrarse nada y MUST mostrarse un mensaje de
texto. Una confirmación válida MUST agregar a `ElTintero.datos.ventas` una venta
con `id` único, `fecha`, `clienteId`, `clienteNombre`, `renglones` y `total`,
usando `ElTintero.registros.registrarVenta`. Cada renglón confirmado MUST
guardar `libroId`, `tituloLibro`, `cantidad`, `precioUnitario` copiado del
precio vigente en ese momento y `subtotal` redondeado a dos decimales; el
`total` MUST ser la suma de los subtotales. La operación MUST NOT producir
registros parciales y MUST NOT lanzar excepciones por datos inválidos.

#### Scenario: Confirmación válida

- **WHEN** se confirma una venta con cliente existente y al menos un renglón
  válido
- **THEN** se agrega una venta a `ElTintero.datos.ventas` con id único, fecha,
  cliente, renglones con precio unitario histórico, subtotal y total, y la
  operación informa éxito

#### Scenario: Confirmar sin cliente

- **WHEN** se intenta confirmar con la opción vacía de `#ventas-cliente`
- **THEN** no se agrega ninguna venta y se muestra un mensaje que pide
  seleccionar un cliente

#### Scenario: Confirmar sin renglones

- **WHEN** se intenta confirmar una composición sin renglones
- **THEN** no se agrega ninguna venta y se muestra un mensaje que pide agregar
  al menos un renglón

#### Scenario: Cliente inexistente por id manipulado

- **WHEN** se fuerza en consola un `clienteId` inexistente y se confirma
- **THEN** no se agrega ninguna venta y se muestra un mensaje de cliente
  inexistente

#### Scenario: Precio unitario copiado al confirmar

- **WHEN** se compone una venta y, justo antes de confirmar, cambia el precio del
  libro en el catálogo
- **THEN** la venta registrada guarda el precio vigente al momento de la
  confirmación, no el que se mostraba al agregar el renglón

### Requirement: Limpieza del formulario y mensaje de resultado (R-04, R-06)

Después de una confirmación válida, la vista SHALL limpiar la composición:
`#ventas-cliente` y `#ventas-libro` vuelven a su opción vacía, `#ventas-cantidad`
vuelve a su valor inicial, la tabla queda sin renglones, el total vuelve a
`$0,00` y el estado de composición vacía se muestra. La vista MUST mostrar el
mensaje de éxito en `#ventas-mensaje-ok` y MUST ocultar `#ventas-mensaje-error`.

#### Scenario: Limpieza tras confirmar

- **WHEN** se confirma una venta válida
- **THEN** los selectores quedan en su opción vacía, no hay renglones, el total
  es `$0,00` y el mensaje de éxito es el único visible

#### Scenario: Mensaje sin contradicción

- **WHEN** se confirma una venta válida después de un rechazo
- **THEN** el error anterior ya no está visible

### Requirement: Inmutabilidad de ventas confirmadas (R-05)

La interfaz SHALL NOT ofrecer controles para editar, anular ni eliminar ventas
confirmadas, y la interfaz pública del modelo MUST NOT exponer funciones de
actualización o eliminación de ventas. Una venta confirmada MUST permanecer
inalterada en memoria durante la sesión de la página, salvo que se recargue el
documento (sin persistencia).

#### Scenario: Sin controles de edición ni eliminación

- **WHEN** se inspecciona `ventas.html` o `historial.html` con ventas
  registradas
- **THEN** no existen botones, formularios ni enlaces para editar, anular o
  eliminar una venta

#### Scenario: Venta confirmada intacta

- **WHEN** se agrega una nueva venta después de otra ya confirmada
- **THEN** la venta anterior conserva id, fecha, cliente, renglones y total

### Requirement: Inserción segura y consola limpia (R-07)

La vista SHALL insertar títulos, nombres, mensajes e importes con
`textContent`/`createElement` y MUST NOT usar `innerHTML`, `insertAdjacentHTML`,
`eval` ni `document.write` con datos del modelo o del usuario. La apertura y la
operación de la vista MUST NOT producir errores en consola, y ningún dato
inválido MUST agregarse al modelo.

#### Scenario: Título con markup se muestra como texto

- **WHEN** un libro cuyo título contiene `<b>prueba</b>` se agrega a la
  composición
- **THEN** la tabla muestra el texto literal y no interpreta el marcado

#### Scenario: Consola limpia

- **WHEN** se abre `ventas.html` y se opera la composición con datos válidos e
  inválidos
- **THEN** no se registran errores en consola

### Requirement: Conservación de etiquetas, encabezados y accesibilidad (R-10)

La vista SHALL conservar los `label` asociados a `#ventas-cliente`,
`#ventas-libro` y `#ventas-cantidad`, el `thead` con `th scope="col"` de la tabla
de renglones y el total dentro de `#ventas-resumen`. Los controles de cambio de
cantidad y de quitar renglón MUST tener nombre accesible, foco visible y
operación por teclado, y el diseño adaptable existente MUST NOT romperse.

#### Scenario: Etiquetas y encabezados conservados

- **WHEN** se inspecciona la vista Ventas
- **THEN** los tres campos tienen `label for` correcto y la tabla conserva sus
  cinco `th` con `scope="col"`

#### Scenario: Total anunciado en el resumen

- **WHEN** cambia el total de la composición
- **THEN** el nuevo importe se lee dentro de `#ventas-resumen` en
  `#ventas-total`

#### Scenario: Mensajes no simultáneos

- **WHEN** se muestra un resultado de éxito o de rechazo
- **THEN** nunca quedan visibles a la vez `#ventas-mensaje-ok` y
  `#ventas-mensaje-error`
