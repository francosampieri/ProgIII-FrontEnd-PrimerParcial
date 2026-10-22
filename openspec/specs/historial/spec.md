# historial Specification

## Purpose

Define la estructura observable de la vista Historial: tabla de ventas con
identificador, fecha, cliente y total, con acceso al detalle de renglones por
venta y estado de lista vacía, usando datos estáticos de ejemplo.

## Requirements

### Requirement: Tabla de ventas (R-06 parcial)

La vista SHALL conservar `table#historial-tabla` con `thead` y las columnas
exactas Identificador, Fecha, Cliente, Total, Detalle (`th scope="col"`), pero
su `<tbody>` MUST renderizarse desde `ElTintero.datos.ventas` al cargar
`historial.html`, sin filas estáticas. Cada venta SHALL producir una fila con
`data-venta-id` igual a su `id`, el identificador, la fecha formateada para
lectura, el `clienteNombre` almacenado y el `total` formateado con dos decimales
mediante `ElTintero.consultas.formatearImporte`. La columna Detalle SHALL
contener un enlace al detalle de esa venta. (Ej. 5 R-05)

#### Scenario: Render desde el modelo

- **WHEN** se abre `historial.html` con las 2 ventas de ejemplo del modelo
- **THEN** la tabla muestra exactamente 2 filas generadas por JavaScript, una
  por cada venta de `ElTintero.datos.ventas`, sin filas estáticas remanentes

#### Scenario: Columnas y ejemplos coherentes

- **WHEN** se inspecciona `historial-tabla`
- **THEN** el `thead` conserva las cinco columnas con `th scope="col"` y cada
  fila expone identificador, fecha, cliente y total coherentes con la venta
  correspondiente del modelo

#### Scenario: Total con dos decimales

- **WHEN** se renderiza la venta de ejemplo con total `37300`
- **THEN** la columna Total muestra `$37.300,00`

#### Scenario: Venta registrada aparece al volver a renderizar

- **WHEN** se registra una venta desde consola con
  `ElTintero.registros.registrarVenta` y se vuelve a ejecutar el render del
  historial en la misma página
- **THEN** la tabla incluye una fila nueva con el id, la fecha, el cliente y el
  total de esa venta

### Requirement: Detalle de renglones por venta (R-06 parcial)

Por cada venta SHALL existir un contenedor de detalle direccionable con `id`
estable `historial-detalle-<id>`, generado desde el modelo, con un encabezado
que identifique la venta, una tabla de renglones (Libro, Cantidad, Precio
unitario, Subtotal) y un enlace «Volver al listado». El detalle MUST construirse
exclusivamente con los valores almacenados en la venta (`tituloLibro`,
`cantidad`, `precioUnitario`, `subtotal`), MUST NOT consultar el precio actual
del catálogo y MUST NOT permitir editar ni eliminar la venta. (Ej. 5 R-05)

#### Scenario: Renglones consultables por venta

- **WHEN** se activa el enlace «Ver detalle» de una venta de la tabla
- **THEN** se accede a `#historial-detalle-<id>` con su encabezado y sus
  renglones (Libro, Cantidad, Precio unitario, Subtotal)

#### Scenario: Detalle generado solo para ventas existentes

- **WHEN** el modelo contiene ventas con ids 1 y 2
- **THEN** existen `#historial-detalle-1` y `#historial-detalle-2` generados
  desde el modelo, y no existen detalles para ventas inexistentes

#### Scenario: Importes del detalle con dos decimales

- **WHEN** se renderiza el detalle de la venta de ejemplo con renglones de
  21.400 y 15.900
- **THEN** precio unitario y subtotal se muestran como `$21.400,00` y
  `$15.900,00`

### Requirement: Estado de historial vacío (R-07 parcial)

La vista SHALL incluir `#historial-vacio` con `id` estable y
`aria-live="polite"`, y MUST alternarlo con el atributo `hidden`: visible con un
mensaje de texto cuando `ElTintero.datos.ventas` está vacío, y oculto cuando hay
al menos una venta. (Ej. 5 R-06)

#### Scenario: Contenedor de lista vacía direccionable

- **WHEN** se abre el historial con ventas registradas
- **THEN** `#historial-vacio` existe en el DOM con `aria-live="polite"` y está
  oculto

#### Scenario: Historial vacío visible

- **WHEN** `ElTintero.datos.ventas` no tiene registros (por ejemplo, tras
  vaciarlo en consola, ya que no hay UI de borrado) y se ejecuta el render
- **THEN** la tabla no tiene filas y `#historial-vacio` muestra un mensaje de
  texto

#### Scenario: Vuelve a ocultarse al registrarse una venta

- **WHEN** se registra una venta y se vuelve a renderizar el historial sobre un
  estado previamente vacío
- **THEN** la tabla muestra la nueva fila y `#historial-vacio` queda oculto

### Requirement: Ganchos para precio histórico futuro (R-10 parcial)

Cada fila de venta y su detalle SHALL conservar identificadores estables
(`data-venta-id`, `historial-detalle-<id>`) y los `id` de la vista
(`historial-tabla`, `historial-vacio`), de modo que el Ej. 6 pueda persistir y
volver a renderizar sin cambiar el HTML ni el contrato. Los `data-venta-id` MUST
ser únicos en el documento. (Ej. 5 R-09)

#### Scenario: Ventas identificables de forma estable

- **WHEN** se listan las ventas renderizadas
- **THEN** cada fila expone un `data-venta-id` único igual al `id` del modelo y
  su detalle es direccionable vía `historial-detalle-<id>`

#### Scenario: Contrato reutilizable por el Ej. 6

- **WHEN** el Ej. 6 recupere ventas persistidas y vuelva a invocar el render
- **THEN** el historial se reconstruye desde `ElTintero.datos.ventas` sin
  requerir cambios en los `id` del HTML

### Requirement: Detalle con valores históricos confirmados (R-05)

El detalle de cada venta SHALL mostrar el `precioUnitario`, el `subtotal` y el
`total` almacenados al confirmar la venta. Si el precio actual del libro en el
catálogo cambia después de la confirmación, el detalle MUST seguir mostrando los
valores históricos y MUST NOT recalcularlos con el precio vigente.

#### Scenario: Precio de catálogo modificado después de confirmar

- **WHEN** se registra una venta, se cambia en el modelo el `precio` del libro
  vendido y se vuelve a renderizar el historial
- **THEN** el detalle conserva el precio unitario, el subtotal y el total
  confirmados, sin reflejar el precio nuevo

#### Scenario: Coherencia entre subtotal y total históricos

- **WHEN** se consulta el detalle de una venta confirmada con dos renglones
- **THEN** la suma de los subtotales mostrados coincide con el total mostrado en
  la fila de la tabla

### Requirement: Historial de solo lectura (R-05)

El historial SHALL NOT ofrecer controles, formularios ni enlaces para editar,
anular o eliminar ventas confirmadas, ni para modificar precios, cantidades,
subtotales o totales. La interfaz pública del modelo MUST NOT exponer funciones
de actualización o eliminación de ventas.

#### Scenario: Sin controles de mutación

- **WHEN** se inspecciona la tabla y los detalles del historial
- **THEN** no existen botones ni formularios de edición, anulación o eliminación

#### Scenario: Detalle sin campos editables

- **WHEN** se revisa el detalle de una venta
- **THEN** sus datos se muestran como texto, sin `input`, `select` ni
  `textarea` para modificarlos

### Requirement: Historial sin persistencia entre páginas (R-09)

El historial SHALL renderizarse exclusivamente desde la colección en memoria
`ElTintero.datos.ventas` de la página actual. Sin el Ejercicio 6, una venta
confirmada en `ventas.html` MUST NOT aparecer al navegar a `historial.html` ni
sobrevivir a una recarga; esta limitación MUST quedar documentada y MUST NOT
simularse con almacenamiento del navegador.

#### Scenario: Venta confirmada en otra página no aparece

- **WHEN** se confirma una venta en `ventas.html` y se navega a `historial.html`
- **THEN** el historial muestra solo las ventas de ejemplo iniciales de esa
  carga y no la venta recién confirmada

#### Scenario: Recarga restablece el modelo

- **WHEN** se registra una venta desde consola en `historial.html` y se recarga
  la página
- **THEN** el modelo vuelve a las 2 ventas de ejemplo y no se usa
  `localStorage`, `sessionStorage` ni IndexedDB

### Requirement: Inserción segura en el historial (R-07)

El historial SHALL insertar identificadores, fechas, nombres de cliente,
títulos de libro e importes con `textContent`/`createElement` y MUST NOT usar
`innerHTML`, `insertAdjacentHTML`, `eval` ni `document.write` con datos del
modelo. La apertura del historial y el render MUST NOT producir errores en
consola.

#### Scenario: Título con markup se muestra como texto

- **WHEN** una venta contiene un `tituloLibro` con caracteres de marcado
- **THEN** el detalle muestra el texto literal

#### Scenario: Consola limpia

- **WHEN** se abre `historial.html` con ventas y sin ventas
- **THEN** no se registran errores en consola
