# Spec Delta — libros

## MODIFIED Requirements

### Requirement: Formulario de alta de libros (R-03 parcial)

La vista SHALL contener `form#libros-form` con el atributo `novalidate` y los
campos título (`input#libros-titulo`), ISBN (`input#libros-isbn`), precio
(`input#libros-precio[type=number]`), editorial (`select#libros-editorial`),
género (`select#libros-genero` con opción «Sin clasificar») y autores como
grupo de checkboxes dentro de `<fieldset><legend>Autores</legend>`, con un
`input[type=checkbox] name="autores"` por autor, cada uno con `id`
`libros-autor-<id>` y su `label` asociado, cada campo con su `label for`, más un
botón con texto de acción («Registrar libro»). El atributo `novalidate` MUST
estar presente para que la validación nativa del navegador no bloquee el
`submit` y la validación propia sea la única que decide el alta (decisión
aprobada 2026-10-20). Las opciones de editorial y de género y los checkboxes de
autores MUST generarse desde `ElTintero.datos` al cargar la vista, reemplazando
las opciones y los checkboxes hardcodeados; MUST existir exactamente un checkbox
por cada autor del modelo y ninguno con `checked` por defecto. La opción «Sin
clasificar» MUST representar la ausencia de género y MUST enviar un valor vacío
que la vista interprete como `generoId: null`; MUST NOT ser un registro de
`ElTintero.datos.generos`.

#### Scenario: Todos los campos etiquetados

- **WHEN** se recorre el formulario solo mediante lectura del DOM
- **THEN** cada `input`/`select` tiene un `label` cuyo `for` coincide con su
  `id`, el selector de género incluye la opción «Sin clasificar», el grupo de
  autores está dentro de un `<fieldset>` con `<legend>Autores</legend>` donde
  todos los checkboxes comparten `name="autores"`, y el botón describe su
  acción

#### Scenario: Validación nativa desactivada

- **WHEN** se inspecciona `#libros-form`
- **THEN** el formulario tiene el atributo `novalidate`

#### Scenario: Opciones de editorial generadas desde el modelo

- **WHEN** se abre `libros.html` con el modelo de ejemplo (3 editoriales)
- **THEN** `#libros-editorial` contiene una opción por cada editorial del
  modelo, con el `id` numérico como `value` y el `nombre` como texto, además de
  la opción inicial para no seleccionar

#### Scenario: Opciones de género generadas desde el modelo

- **WHEN** se abre `libros.html` con el modelo de ejemplo (3 géneros)
- **THEN** `#libros-genero` contiene una opción por cada género del modelo, con
  el `id` numérico como `value`, más la opción «Sin clasificar» con valor vacío

#### Scenario: Un checkbox por autor existente

- **WHEN** se abre `libros.html` con el modelo de ejemplo (5 autores)
- **THEN** existen exactamente los checkboxes `libros-autor-1` a
  `libros-autor-5`, cada uno con `name="autores"`, `value` igual al `id` del
  autor y `label` con el nombre correcto del autor; no queda ningún checkbox
  hardcodeado con un nombre desalineado

#### Scenario: Sin autores preseleccionados

- **WHEN** se abre `libros.html` por primera vez
- **THEN** ningún checkbox de autores está marcado por defecto

### Requirement: Tabla de libros registrados (R-03 parcial)

La vista SHALL contener `table#libros-tabla` con `thead` y columnas exactas
Título, ISBN, Editorial, Género, Autores, Precio (`th scope="col"`). El
`tbody` MUST renderizarse desde `ElTintero.datos.libros` al cargar y después de
cada alta, MUST NOT conservar filas estáticas y MUST resolver editorial, género
y autores por id; el género MUST mostrarse como «Sin clasificar» cuando
`generoId` sea `null` y el precio MUST formatearse con
`ElTintero.consultas.formatearPrecio`. Con los datos de ejemplo MUST mostrar 6
filas (los 6 libros del modelo), no las 3 filas estáticas anteriores.

#### Scenario: Columnas y encabezados

- **WHEN** se inspecciona `libros-tabla`
- **THEN** el `thead` presenta las seis columnas exigidas con `th scope="col"`

#### Scenario: Render inicial desde el modelo

- **WHEN** se abre `libros.html` con los datos de ejemplo
- **THEN** el `tbody` contiene 6 filas, una por cada libro del modelo, sin filas
  estáticas duplicadas

#### Scenario: Relaciones resueltas por id

- **WHEN** se inspecciona una fila de un libro con editorial, género y autores
- **THEN** la fila muestra el nombre de la editorial, el nombre del género o
  «Sin clasificar» y los nombres de los autores resueltos

#### Scenario: Precio formateado

- **WHEN** se inspecciona la celda de precio de un libro de precio `18500`
- **THEN** muestra el resultado de
  `ElTintero.consultas.formatearPrecio(18500)` (formato sin decimales,
  coherente con el catálogo), no un número crudo

### Requirement: Estados de altas de libros (R-07 parcial)

La vista SHALL incluir `libros-vacio`, `libros-mensaje-ok` y
`libros-mensaje-error` en el DOM con `id` estable y `aria-live="polite"`. Los
tres MUST controlarse por JavaScript con el atributo `hidden`: `libros-vacio`
MUST mostrarse solo si la colección de libros no tiene registros;
`libros-mensaje-ok` MUST mostrarse solo tras un alta válida;
`libros-mensaje-error` MUST mostrarse solo tras un rechazo. El mensaje de éxito
y el de error MUST NOT estar visibles al mismo tiempo. Los textos MUST
escribirse con `textContent` como texto plano. Tras un rechazo, los controles
afectados MUST marcarse con `aria-invalid="true"` y con
`aria-describedby="libros-mensaje-error"`, y los errores MUST presentarse como
un único resumen dentro de `#libros-mensaje-error` (decisiones aprobadas
2026-10-20); tras un alta válida MUST quitarse **ambos** atributos.

#### Scenario: Mensajes de operación direccionables

- **WHEN** la tabla muestra los libros del modelo
- **THEN** los tres contenedores existen en el DOM con `aria-live="polite"` y
  `libros-vacio` está oculto

#### Scenario: Éxito y error excluyentes

- **WHEN** se produce un alta válida después de haber mostrado un error
- **THEN** `#libros-mensaje-ok` queda visible y `#libros-mensaje-error` vuelve a
  ocultarse, sin que ambos se muestren a la vez

#### Scenario: Error resumido con aria-invalid

- **WHEN** se envía el formulario con `#libros-titulo` vacío y `#libros-precio`
  con `0`
- **THEN** `#libros-mensaje-error` muestra un único resumen de texto escrito con
  `textContent`, `#libros-titulo` y `#libros-precio` tienen
  `aria-invalid="true"` y `aria-describedby="libros-mensaje-error"`, y no se
  agrega ningún libro

#### Scenario: aria-describedby apunta al resumen

- **WHEN** se envía el formulario con `#libros-titulo` vacío
- **THEN** `#libros-titulo` tiene `aria-describedby="libros-mensaje-error"` y el
  resumen visible contiene «Ingresá el título del libro.»

#### Scenario: aria-invalid y aria-describedby limpios tras un alta válida

- **WHEN** se corrige el formulario y se envía un alta válida
- **THEN** los controles dejan de tener `aria-invalid="true"` y
  `aria-describedby`, y el formulario queda limpio

#### Scenario: Lista vacía

- **WHEN** la colección `libros` tiene longitud 0
- **THEN** `#libros-vacio` se muestra con un texto que indica que no hay libros
  registrados y el `tbody` no contiene filas

### Requirement: Ganchos para validaciones futuras (R-10 parcial)

Cada campo del formulario SHALL llevar `id` y `name` estables
(`libros-titulo`, `libros-isbn`, `libros-precio`, `libros-editorial`,
`libros-genero`) y los checkboxes de autores SHALL usar `name="autores"`
compartido e `id` estables `libros-autor-<id>`. Estos `id` MUST conservarse en
esta entrega. A diferencia del Ej. 3, la vista SÍ MUST implementar validación
propia y control del `submit` con `preventDefault`, según los requisitos de
validación y alta de este delta. La lógica de vista MUST vivir en el único
archivo `js/altas.js`, expuesta como `ElTintero.altas`, que detecta la página
por la existencia de `#libros-form` y MUST NOT producir errores en consola
cuando los controles de la vista Clientes no existen.

#### Scenario: Diccionario de ganchos completo

- **WHEN** se lista el conjunto `id`/`name` de la vista Libros
- **THEN** cubre los seis campos exigidos por el PDF p. 4 (título, ISBN,
  precio, editorial, género, autores) —con los autores como checkboxes
  `libros-autor-<id>` de `name` compartido `autores`— sin duplicar ningún `id`
  del documento

#### Scenario: Ganchos conservados tras la implementación

- **WHEN** se compara el formulario antes y después de este change
- **THEN** los `id`, `name`, `label for` y contenedores de estado existentes se
  mantienen; solo se completa el contenido de los selectores y del `fieldset`

## ADDED Requirements

### Requirement: Validación del alta de libro (R-03)

El sistema SHALL validar el alta de libro antes de modificar el modelo. MUST
rechazar: título vacío o compuesto solo por espacios; ISBN vacío o que queda
vacío al quitarle espacios y guiones; ISBN duplicado comparando normalizado sin
espacios ni guiones y **sin** cambiar mayúsculas/minúsculas (decisión aprobada
2026-10-20: la `x` final no se pasa a mayúsculas); precio vacío, no numérico, no
finito, cero o negativo; editorial vacía o inexistente; ningún autor
seleccionado; autor inexistente; género informado que no existe. MUST aceptar
«Sin clasificar» como género ausente (`generoId: null`). MUST NOT validar el
dígito de control del ISBN. Cada error MUST expresarse como mensaje de texto
cercano al formulario y MUST NOT agregarse ningún registro si falla cualquier
comprobación. Los valores ya ingresados MUST conservarse para su corrección.

#### Scenario: Título vacío o solo espacios

- **WHEN** se envía el formulario con `#libros-titulo` vacío o con solo espacios
- **THEN** se muestra un mensaje de error, no se agrega ningún libro y los demás
  valores del formulario se conservan

#### Scenario: ISBN vacío o solo con separadores

- **WHEN** se envía el formulario con `#libros-isbn` vacío o con un valor como
  ` - - ` que queda vacío al normalizar
- **THEN** se muestra un mensaje de error y no se agrega ningún libro

#### Scenario: ISBN duplicado con y sin guiones

- **WHEN** existe el libro con ISBN `978-84-376-0494-7` y se intenta dar de alta
  un libro con `9788437604947` o con ` 978 84 376 0494 7 `
- **THEN** el alta se rechaza por ISBN duplicado y no se agrega ningún libro

#### Scenario: ISBN nuevo

- **WHEN** se envía un ISBN que no coincide con ninguno existente
- **THEN** el alta puede completarse si el resto de las comprobaciones pasa

#### Scenario: Precio inválido

- **WHEN** se envía el formulario con precio vacío, `abc`, `0`, un valor
  negativo, `NaN` o `Infinity`
- **THEN** se muestra un mensaje de error de precio y no se agrega ningún libro

#### Scenario: Editorial vacía o inexistente

- **WHEN** se envía el formulario sin editorial o con un `editorialId` que no
  existe en el modelo
- **THEN** se muestra un mensaje de error y no se agrega ningún libro

#### Scenario: Género inexistente

- **WHEN** se envía el formulario con un `generoId` que no existe en el modelo
- **THEN** se muestra un mensaje de error y no se agrega ningún libro

#### Scenario: Género ausente válido

- **WHEN** se selecciona «Sin clasificar»
- **THEN** la validación acepta el alta con `generoId: null`

#### Scenario: Sin autores

- **WHEN** se envía el formulario sin ningún checkbox de autores marcado
- **THEN** se muestra un mensaje de error que pide al menos un autor y no se
  agrega ningún libro

#### Scenario: Autor inexistente

- **WHEN** el formulario envía un id de autor que no existe en el modelo
- **THEN** se muestra un mensaje de error y no se agrega ningún libro

#### Scenario: Múltiples errores a la vez

- **WHEN** se envía un formulario con título vacío, precio `0` y sin autores
- **THEN** se informan los tres errores como texto y no se agrega ningún libro

### Requirement: Mensajes de validación del alta de libro (R-03, R-06)

El sistema SHALL emitir los literales definitivos de la tabla siguiente
(decisión j, 2026-10-20), sin variantes ni sinónimos:

| Código | Condición | Literal |
| --- | --- | --- |
| LN-01 | título vacío o solo espacios | «Ingresá el título del libro.» |
| LN-02 | ISBN vacío o solo espacios | «Ingresá el ISBN del libro.» |
| LN-03 | ISBN sin caracteres útiles al quitar espacios y guiones | «El ISBN no puede contener solo espacios o guiones.» |
| LN-04 | ISBN duplicado (comparado normalizado) | «Ya existe un libro con ese ISBN.» |
| LN-05 | precio vacío | «Ingresá el precio del libro.» |
| LN-06 | precio no numérico o no finito | «El precio debe ser un número.» |
| LN-07 | precio menor o igual a cero | «El precio debe ser mayor que cero.» |
| LN-08 | editorial sin seleccionar | «Seleccioná una editorial.» |
| LN-09 | editorial inexistente | «La editorial seleccionada no existe.» |
| LN-10 | género inexistente | «El género seleccionado no existe.» |
| LN-11 | ningún autor seleccionado | «Seleccioná al menos un autor.» |
| LN-12 | autor inexistente | «Uno de los autores seleccionados no existe.» |
| LN-OK | alta válida | «Libro registrado correctamente.» |

Si hay más de un error, los mensajes MUST concatenarse en un único
`textContent`, separados por un espacio y en el orden de los campos del
formulario (título → ISBN → precio → editorial → género → autores). LN-12 MUST
informarse una sola vez aunque varios autores sean inválidos. El mensaje de
error MUST escribirse en `#libros-mensaje-error` y el de éxito en
`#libros-mensaje-ok`; MUST NOT mostrarse ambos a la vez.

#### Scenario: Título vacío cita el literal LN-01

- **WHEN** se envía el formulario con `#libros-titulo` vacío
- **THEN** `#libros-mensaje-error` muestra exactamente «Ingresá el título del
  libro.» y no se agrega ningún libro

#### Scenario: ISBN solo con separadores cita el literal LN-03

- **WHEN** se envía el formulario con `#libros-isbn` igual a ` - - `
- **THEN** `#libros-mensaje-error` muestra «El ISBN no puede contener solo
  espacios o guiones.» y no se agrega ningún libro

#### Scenario: Precio cero cita el literal LN-07

- **WHEN** se envía el formulario con `#libros-precio` igual a `0`
- **THEN** `#libros-mensaje-error` muestra «El precio debe ser mayor que cero.»
  y no se agrega ningún libro

#### Scenario: Varios errores se concatenan en orden

- **WHEN** se envía el formulario con título vacío y precio `0`
- **THEN** `#libros-mensaje-error` muestra exactamente «Ingresá el título del
  libro. El precio debe ser mayor que cero.» y no se agrega ningún libro

#### Scenario: LN-12 no se repite

- **WHEN** se envían dos ids de autor inexistentes
- **THEN** el resumen contiene «Uno de los autores seleccionados no existe.» una
  sola vez y no se agrega ningún libro

#### Scenario: Éxito con literal LN-OK

- **WHEN** se envía un alta válida
- **THEN** `#libros-mensaje-ok` muestra «Libro registrado correctamente.» y
  `#libros-mensaje-error` queda oculto

### Requirement: Alta de libro y actualización del listado (R-02, R-06, R-07)

El sistema SHALL controlar el evento `submit` de `#libros-form` con
`preventDefault`, ejecutar la validación y, solo si todas las comprobaciones
pasan, registrar el libro en el modelo mediante la interfaz pública de altas
(`ElTintero.registros.registrarLibro`). Tras un alta válida MUST limpiar el
formulario, MUST mostrar `#libros-mensaje-ok`, MUST ocultar
`#libros-mensaje-error` y MUST actualizar `#libros-tabla` sin recargar la
página, ubicando la fila nueva **al final**, en orden de inserción (decisión
aprobada 2026-10-20). El libro MUST tener id único, `precio` numérico y
`generoId: null` cuando no se eligió género. El `isbn` MUST guardarse recortado
tal como se ingresó y la unicidad MUST compararse siempre normalizada. Tras un
rechazo MUST conservar los valores ingresados y MUST NOT modificar la tabla ni
el modelo.

#### Scenario: Alta válida de libro

- **WHEN** se completa el formulario con título e ISBN nuevos, precio válido,
  editorial existente, género existente y al menos un autor, y se envía
- **THEN** el formulario no recarga la página, el libro aparece en
  `#libros-tabla`, el formulario queda limpio y `#libros-mensaje-ok` se muestra

#### Scenario: Alta válida sin género

- **WHEN** se envía un alta válida con «Sin clasificar»
- **THEN** el libro aparece en la tabla con «Sin clasificar» y en el modelo tiene
  `generoId: null`

#### Scenario: Alta válida con varios autores

- **WHEN** se envían tres autores seleccionados
- **THEN** la fila nueva muestra los tres nombres y el modelo guarda los tres
  ids

#### Scenario: Alta rechazada conserva valores

- **WHEN** se envía el formulario con un ISBN duplicado
- **THEN** el formulario conserva título, ISBN, precio, editorial, género y
  autores, la tabla no cambia y `#libros-mensaje-ok` permanece oculto

#### Scenario: Sin alta parcial

- **WHEN** se envía un formulario con algunos campos válidos y otros inválidos
- **THEN** la longitud de `ElTintero.datos.libros` no cambia

#### Scenario: ISBN guardado tal como se ingresó

- **WHEN** se registra un libro con un ISBN nuevo escrito como
  ` 978-99999-0000-1 `
- **THEN** el modelo guarda `978-99999-0000-1` (recortado, sin alterar espacios
  ni guiones internos) y una consulta de unicidad con `9789999900001` lo
  detecta como existente

#### Scenario: Fila nueva al final

- **WHEN** se registra un libro válido con el modelo de ejemplo (6 libros)
- **THEN** la fila nueva aparece en la séptima posición de `#libros-tabla`, en
  orden de inserción

#### Scenario: Enter y botón recorren el mismo camino

- **WHEN** se envía el formulario con Enter o con el botón «Registrar libro»
- **THEN** se ejecuta la misma validación y el mismo control de `preventDefault`

#### Scenario: Integridad después de las altas

- **WHEN** se ejecutan varias altas válidas y se llama a
  `verificarIntegridad()`
- **THEN** devuelve una lista vacía de errores e informa ids únicos

### Requirement: Inserción segura y sin errores de consola (R-08)

El sistema SHALL insertar el título, ISBN, nombres de editorial, género y
autores del libro con `textContent` y `createElement`. MUST NOT usar
`innerHTML`, `insertAdjacentHTML`, `eval` ni `document.write` con datos del
usuario o del modelo. La vista MUST NOT producir errores en consola al cargar ni
al operar con altas válidas o rechazadas.

#### Scenario: Título con markup

- **WHEN** se registra un libro con título `<b>prueba</b>`
- **THEN** la tabla muestra el texto literal `<b>prueba</b>` y no se crea ningún
  elemento `b`

#### Scenario: Consola limpia

- **WHEN** se abre `libros.html`, se realizan altas válidas e inválidas y se
  recarga
- **THEN** no aparecen errores en la consola del navegador
