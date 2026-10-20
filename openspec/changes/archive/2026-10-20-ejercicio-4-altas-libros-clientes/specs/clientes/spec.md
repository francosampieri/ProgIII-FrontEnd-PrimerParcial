# Spec Delta — clientes

## MODIFIED Requirements

### Requirement: Formulario de alta de clientes (R-04 parcial)

La vista SHALL contener `form#clientes-form` con el atributo `novalidate` y los
campos nombre completo (`input#clientes-nombre`) y email
(`input#clientes-email[type=email]`), ambos con `label for`, más un botón con
texto de acción («Registrar cliente»). No se exige campo de apellido separado
(PDF p. 4). Los `id`, `name` y `label` existentes MUST conservarse. El atributo
`novalidate` MUST estar presente para que la validación nativa del navegador no
bloquee el `submit` y la validación propia sea la única que decide el alta
(decisión aprobada 2026-10-20). En esta entrega la vista MUST implementar
validación propia y control del `submit` con `preventDefault`, según los
requisitos de validación y alta de este delta.

#### Scenario: Campos etiquetados y botón descriptivo

- **WHEN** se recorre el formulario mediante lectura del DOM
- **THEN** ambos campos tienen `label` asociado a su `id`, el email usa
  `type="email"` y el botón describe su acción

#### Scenario: Validación nativa desactivada

- **WHEN** se inspecciona `#clientes-form`
- **THEN** el formulario tiene el atributo `novalidate`

#### Scenario: Sin campo de apellido

- **WHEN** se inspecciona el formulario
- **THEN** solo existen los campos nombre completo y email; el nombre completo
  se captura en un único control

### Requirement: Tabla de clientes registrados (R-04 parcial)

La vista SHALL contener `table#clientes-tabla` con `thead` y columnas exactas
Nombre completo y Email (`th scope="col"`). El `tbody` MUST renderizarse desde
`ElTintero.datos.clientes` al cargar y después de cada alta, MUST NOT conservar
filas estáticas y MUST mostrar nombre y email de cada cliente. Con los datos de
ejemplo MUST mostrar 3 filas (los 3 clientes del modelo), no las 2 filas
estáticas anteriores.

#### Scenario: Columnas exactas

- **WHEN** se inspecciona `clientes-tabla`
- **THEN** el `thead` presenta exactamente «Nombre completo» y «Email» con
  `th scope="col"`

#### Scenario: Render inicial desde el modelo

- **WHEN** se abre `clientes.html` con los datos de ejemplo
- **THEN** el `tbody` contiene 3 filas, una por cada cliente del modelo, sin
  filas estáticas duplicadas

#### Scenario: Datos del cliente

- **WHEN** se inspecciona una fila
- **THEN** muestra el nombre completo y el email tal como están almacenados en
  el modelo, insertados como texto

### Requirement: Estados de altas de clientes (R-07 parcial)

La vista SHALL incluir `clientes-vacio`, `clientes-mensaje-ok` y
`clientes-mensaje-error` en el DOM con `id` estable y `aria-live="polite"`. Los
tres MUST controlarse por JavaScript con el atributo `hidden`: `clientes-vacio`
MUST mostrarse solo si la colección de clientes no tiene registros;
`clientes-mensaje-ok` MUST mostrarse solo tras un alta válida;
`clientes-mensaje-error` MUST mostrarse solo tras un rechazo. El mensaje de
éxito y el de error MUST NOT estar visibles al mismo tiempo. Los textos MUST
escribirse con `textContent` como texto plano. Tras un rechazo, los controles
afectados MUST marcarse con `aria-invalid="true"` y con
`aria-describedby="clientes-mensaje-error"`, y los errores MUST presentarse como
un único resumen dentro de `#clientes-mensaje-error` (decisiones aprobadas
2026-10-20); tras un alta válida MUST quitarse **ambos** atributos.

#### Scenario: Mensajes de operación direccionables

- **WHEN** la tabla muestra los clientes del modelo
- **THEN** los tres contenedores existen en el DOM con `aria-live="polite"` y
  `clientes-vacio` está oculto

#### Scenario: Éxito y error excluyentes

- **WHEN** se produce un alta válida después de haber mostrado un error
- **THEN** `#clientes-mensaje-ok` queda visible y `#clientes-mensaje-error`
  vuelve a ocultarse, sin que ambos se muestren a la vez

#### Scenario: Error resumido con aria-invalid

- **WHEN** se envía el formulario con `#clientes-nombre` vacío y
  `#clientes-email` con formato inválido
- **THEN** `#clientes-mensaje-error` muestra un único resumen de texto escrito
  con `textContent`, `#clientes-nombre` y `#clientes-email` tienen
  `aria-invalid="true"` y `aria-describedby="clientes-mensaje-error"`, y no se
  agrega ningún cliente

#### Scenario: aria-describedby apunta al resumen

- **WHEN** se envía el formulario con `#clientes-nombre` vacío
- **THEN** `#clientes-nombre` tiene `aria-describedby="clientes-mensaje-error"` y
  el resumen visible contiene «Ingresá el nombre completo del cliente.»

#### Scenario: aria-invalid y aria-describedby limpios tras un alta válida

- **WHEN** se corrige el formulario y se envía un alta válida
- **THEN** los controles dejan de tener `aria-invalid="true"` y
  `aria-describedby`, y el formulario queda limpio

#### Scenario: Lista vacía

- **WHEN** la colección `clientes` tiene longitud 0
- **THEN** `#clientes-vacio` se muestra con un texto que indica que no hay
  clientes registrados y el `tbody` no contiene filas

### Requirement: Ganchos para validaciones futuras (R-10 parcial)

Cada campo SHALL llevar `id` y `name` estables (`clientes-nombre`,
`clientes-email`) y estos MUST conservarse en esta entrega. A diferencia del
Ej. 3, la vista SÍ MUST implementar validación de formato, de duplicados y de
campos vacíos, con control del `submit` mediante `preventDefault`. La lógica de
vista MUST vivir en el único archivo `js/altas.js`, expuesta como
`ElTintero.altas`, que detecta la página por la existencia de `#clientes-form`
y MUST NOT producir errores en consola cuando los controles de la vista Libros
no existen.

#### Scenario: Diccionario de ganchos completo

- **WHEN** se lista el conjunto `id`/`name` de la vista Clientes
- **THEN** cubre nombre completo y email sin duplicar ningún `id` del documento

#### Scenario: Ganchos conservados tras la implementación

- **WHEN** se compara el formulario antes y después de este change
- **THEN** los `id`, `name`, `label for` y contenedores de estado existentes se
  mantienen

## ADDED Requirements

### Requirement: Validación del alta de cliente (R-05)

El sistema SHALL validar el alta de cliente antes de modificar el modelo. MUST
rechazar: nombre vacío o compuesto solo por espacios; email vacío; email con
formato inválido; email duplicado comparando sin espacios exteriores y sin
distinguir mayúsculas de minúsculas. Para este TPI, formato válido MUST
significar: texto sin espacios, exactamente un `@`, al menos un carácter antes y
después, y un dominio con al menos un punto y dos o más letras después del
último punto (validación práctica, no RFC completa). Cada error MUST expresarse
como mensaje de texto cercano al formulario y MUST NOT agregarse ningún registro
si falla cualquier comprobación. Los valores ya ingresados MUST conservarse para
su corrección.

#### Scenario: Nombre vacío o solo espacios

- **WHEN** se envía el formulario con `#clientes-nombre` vacío o con solo
  espacios
- **THEN** se muestra un mensaje de error, no se agrega ningún cliente y el
  email ingresado se conserva

#### Scenario: Email vacío

- **WHEN** se envía el formulario con `#clientes-email` vacío
- **THEN** se muestra un mensaje de error y no se agrega ningún cliente

#### Scenario: Email con formato inválido

- **WHEN** se envía un email sin `@`, con dos `@`, sin punto en el dominio, con
  un espacio interior o con una sola letra después del último punto
- **THEN** se muestra un mensaje de error de formato y no se agrega ningún
  cliente

#### Scenario: Email válido

- **WHEN** se envía un email como `nuevo.cliente@example.com`
- **THEN** la validación de formato lo acepta

#### Scenario: Email duplicado con mayúsculas y espacios

- **WHEN** existe `ana.perez@example.com` y se intenta dar de alta
  ` Ana.Perez@Example.com `
- **THEN** el alta se rechaza por email duplicado y no se agrega ningún cliente

#### Scenario: Email nuevo con distinto dominio

- **WHEN** se envía un email con formato válido cuyo dominio no coincide con
  ningún cliente existente
- **THEN** el alta puede completarse si el nombre es válido

#### Scenario: Múltiples errores a la vez

- **WHEN** se envía un formulario con nombre vacío y email con formato inválido
- **THEN** se informan ambos errores como texto y no se agrega ningún cliente

#### Scenario: Nombres distintos, mismo email

- **WHEN** se intenta registrar un cliente con un nombre distinto pero un email
  que ya existe (en cualquier combinación de mayúsculas)
- **THEN** se rechaza por email duplicado

### Requirement: Mensajes de validación del alta de cliente (R-05, R-06)

El sistema SHALL emitir los literales definitivos de la tabla siguiente
(decisión j, 2026-10-20), sin variantes ni sinónimos:

| Código | Condición | Literal |
| --- | --- | --- |
| CN-01 | nombre vacío o solo espacios | «Ingresá el nombre completo del cliente.» |
| CN-02 | email vacío o solo espacios | «Ingresá el email del cliente.» |
| CN-03 | email con formato inválido | «El email no tiene un formato válido.» |
| CN-04 | email duplicado | «Ya existe un cliente con ese email.» |
| CN-OK | alta válida | «Cliente registrado correctamente.» |

Si hay más de un error, los mensajes MUST concatenarse en un único
`textContent`, separados por un espacio y en el orden de los campos del
formulario (nombre → email). El mensaje de error MUST escribirse en
`#clientes-mensaje-error` y el de éxito en `#clientes-mensaje-ok`; MUST NOT
mostrarse ambos a la vez.

#### Scenario: Nombre vacío cita el literal CN-01

- **WHEN** se envía el formulario con `#clientes-nombre` vacío
- **THEN** `#clientes-mensaje-error` muestra exactamente «Ingresá el nombre
  completo del cliente.» y no se agrega ningún cliente

#### Scenario: Email vacío cita el literal CN-02

- **WHEN** se envía el formulario con `#clientes-email` vacío
- **THEN** `#clientes-mensaje-error` muestra «Ingresá el email del cliente.» y no
  se agrega ningún cliente

#### Scenario: Email inválido cita el literal CN-03

- **WHEN** se envía el formulario con `#clientes-email` igual a `correo-sin-arroba`
- **THEN** `#clientes-mensaje-error` muestra «El email no tiene un formato
  válido.» y no se agrega ningún cliente

#### Scenario: Email duplicado cita el literal CN-04

- **WHEN** se intenta registrar ` Ana.Perez@Example.com ` y ya existe
  `ana.perez@example.com`
- **THEN** `#clientes-mensaje-error` muestra «Ya existe un cliente con ese
  email.» y no se agrega ningún cliente

#### Scenario: Varios errores se concatenan en orden

- **WHEN** se envía el formulario con nombre vacío y email con formato inválido
- **THEN** `#clientes-mensaje-error` muestra exactamente «Ingresá el nombre
  completo del cliente. El email no tiene un formato válido.» y no se agrega
  ningún cliente

#### Scenario: Éxito con literal CN-OK

- **WHEN** se envía un alta válida
- **THEN** `#clientes-mensaje-ok` muestra «Cliente registrado correctamente.» y
  `#clientes-mensaje-error` queda oculto

### Requirement: Alta de cliente y actualización del listado (R-04, R-06, R-07)

El sistema SHALL controlar el evento `submit` de `#clientes-form` con
`preventDefault`, ejecutar la validación y, solo si todas las comprobaciones
pasan, registrar el cliente en el modelo mediante la interfaz pública de altas
(`ElTintero.registros.registrarCliente`). Tras un alta válida MUST limpiar el
formulario, MUST mostrar `#clientes-mensaje-ok`, MUST ocultar
`#clientes-mensaje-error` y MUST actualizar `#clientes-tabla` sin recargar la
página, ubicando la fila nueva **al final**, en orden de inserción (decisión
aprobada 2026-10-20). El cliente MUST tener id único y MUST guardar el nombre
completo y el email **recortados tal como se ingresaron** (decisión aprobada
2026-10-20), comparando el email siempre normalizado. Tras un rechazo MUST
conservar los valores ingresados y MUST NOT modificar la tabla ni el modelo.

#### Scenario: Alta válida de cliente

- **WHEN** se completa el formulario con un nombre completo y un email nuevo
  válido, y se envía
- **THEN** el formulario no recarga la página, el cliente aparece en
  `#clientes-tabla`, el formulario queda limpio y `#clientes-mensaje-ok` se
  muestra

#### Scenario: Alta rechazada conserva valores

- **WHEN** se envía el formulario con un email duplicado
- **THEN** el formulario conserva nombre y email, la tabla no cambia y
  `#clientes-mensaje-ok` permanece oculto

#### Scenario: Email guardado tal como se ingresó

- **WHEN** se registra un cliente nuevo con el email
  ` Nuevo.Cliente@Example.com `
- **THEN** el modelo guarda `Nuevo.Cliente@Example.com` (recortado) y una
  consulta de unicidad con `nuevo.cliente@example.com` lo detecta como
  existente

#### Scenario: Fila nueva al final

- **WHEN** se registra un cliente válido con el modelo de ejemplo (3 clientes)
- **THEN** la fila nueva aparece en la cuarta posición de `#clientes-tabla`, en
  orden de inserción

#### Scenario: Sin alta parcial

- **WHEN** se envía un formulario con nombre válido y email inválido
- **THEN** la longitud de `ElTintero.datos.clientes` no cambia

#### Scenario: Enter y botón recorren el mismo camino

- **WHEN** se envía el formulario con Enter o con el botón «Registrar cliente»
- **THEN** se ejecuta la misma validación y el mismo control de `preventDefault`

#### Scenario: Ids únicos después de varias altas

- **WHEN** se registran varios clientes válidos en la misma sesión
- **THEN** todos los ids generados son distintos y la tabla muestra una fila por
  cliente

### Requirement: Inserción segura y sin errores de consola (R-08)

El sistema SHALL insertar el nombre y el email del cliente con `textContent` y
`createElement`. MUST NOT usar `innerHTML`, `insertAdjacentHTML`, `eval` ni
`document.write` con datos del usuario o del modelo. La vista MUST NOT producir
errores en consola al cargar ni al operar con altas válidas o rechazadas.

#### Scenario: Nombre con markup

- **WHEN** se registra un cliente con nombre `<i>Prueba</i>`
- **THEN** la tabla muestra el texto literal `<i>Prueba</i>` y no se crea ningún
  elemento `i`

#### Scenario: Consola limpia

- **WHEN** se abre `clientes.html`, se realizan altas válidas e inválidas y se
  recarga
- **THEN** no aparecen errores en la consola del navegador
