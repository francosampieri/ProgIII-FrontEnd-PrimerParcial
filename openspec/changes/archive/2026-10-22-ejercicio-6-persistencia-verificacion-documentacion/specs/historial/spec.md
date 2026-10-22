# Spec Delta

## REMOVED Requirements

### Requirement: Historial sin persistencia entre páginas (R-09)

**Reason**: El Ejercicio 6 persiste las ventas en `localStorage`; el requisito
anterior describía la limitación que este change elimina.

**Migration**: Reemplazado por «Historial persistente entre páginas (R-09)» y
por los requisitos de persistencia de la capability `persistencia`.

## ADDED Requirements

### Requirement: Historial persistente entre páginas (R-09)

El historial SHALL renderizarse desde `ElTintero.datos.ventas` después de que
`js/data.js` hidrate la colección desde `localStorage`. Una venta confirmada en
`ventas.html` MUST aparecer en `historial.html` al navegar y MUST sobrevivir a
la recarga, sin duplicarse. Si la colección persistida es un array vacío, el
historial MUST mostrar su estado vacío y MUST NOT volver a sembrar las ventas de
ejemplo.

#### Scenario: Venta confirmada visible en el historial

- **WHEN** se confirma una venta válida en `ventas.html` y se navega a
  `historial.html`
- **THEN** la tabla incluye la venta recién confirmada con su id, fecha, cliente
  y total

#### Scenario: Recarga conserva las ventas

- **WHEN** se recarga `historial.html` después de confirmar una venta
- **THEN** la venta sigue apareciendo y no se duplica ni se agregan ventas de
  ejemplo adicionales

#### Scenario: Historial vacío persistido

- **WHEN** `eltintero.ventas.v1` contiene `[]`
- **THEN** la tabla no tiene filas, `#historial-vacio` está visible y no se
  siembran ventas de ejemplo

### Requirement: Detalle histórico recuperado tras recarga (R-05)

El detalle de una venta recuperada desde `localStorage` SHALL construirse con
los valores almacenados en ese registro (`tituloLibro`, `cantidad`,
`precioUnitario`, `subtotal` y `total`). Si el precio actual del libro en
`eltintero.libros.v1` se modifica después de la confirmación y la página se
recarga, el detalle MUST seguir mostrando los importes confirmados y MUST NOT
recalcularlos desde el catálogo actual.

#### Scenario: Precio modificado y recarga

- **WHEN** se confirma una venta, se cambia solo el `precio` del libro en
  `eltintero.libros.v1` y se recarga `historial.html`
- **THEN** el detalle conserva el `precioUnitario`, el `subtotal` y el `total`
  confirmados, sin reflejar el precio nuevo

#### Scenario: Coherencia tras recuperar la venta

- **WHEN** se consulta el detalle de una venta recuperada con dos renglones
- **THEN** la suma de los subtotales mostrados coincide con el total confirmado
  de la venta

#### Scenario: Sin recálculo desde el catálogo

- **WHEN** se inspecciona el detalle de una venta persistida
- **THEN** sus importes provienen del registro de la venta y no de
  `ElTintero.datos.libros`
