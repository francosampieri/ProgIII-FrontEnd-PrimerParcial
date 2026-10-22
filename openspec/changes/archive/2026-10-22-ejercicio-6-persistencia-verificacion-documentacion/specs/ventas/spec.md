# Spec Delta

## MODIFIED Requirements

### Requirement: Inmutabilidad de ventas confirmadas (R-05)

La interfaz SHALL NOT ofrecer controles para editar, anular ni eliminar ventas
confirmadas, y la interfaz pública del modelo MUST NOT exponer funciones de
actualización o eliminación de ventas. Una venta confirmada MUST permanecer
inalterada en memoria y en `localStorage` durante la sesión y entre recargas,
salvo que se ejecute el restablecimiento de pruebas aprobado. Cambiar el precio
de un libro en el catálogo MUST NOT modificar los renglones, subtotales ni total
de una venta ya confirmada.

#### Scenario: Sin controles de edición ni eliminación

- **WHEN** se inspecciona `ventas.html` o `historial.html` con ventas
  registradas
- **THEN** no existen botones, formularios ni enlaces para editar, anular o
  eliminar una venta

#### Scenario: Venta confirmada intacta

- **WHEN** se agrega una nueva venta después de otra ya confirmada
- **THEN** la venta anterior conserva id, fecha, cliente, renglones y total

#### Scenario: Venta confirmada tras recargar

- **WHEN** se confirma una venta y se recarga la página
- **THEN** la venta sigue presente con los mismos renglones, precios
  unitarios, subtotales y total

#### Scenario: Cambio de precio posterior

- **WHEN** se modifica el precio del libro vendido después de confirmar la venta
- **THEN** la venta conserva los importes confirmados y no se recalcula

## ADDED Requirements

### Requirement: Persistencia de la venta confirmada (R-02)

Al confirmar una venta válida, el sistema SHALL persistir la colección
`ventas` en `eltintero.ventas.v1` además de agregarla a
`ElTintero.datos.ventas`. Una venta rechazada MUST NOT modificar ni reescribir
la colección persistida. La capa de vista MUST NOT escribir en `localStorage`
por su cuenta.

#### Scenario: Venta válida persistida

- **WHEN** se confirma una venta con cliente y renglones válidos
- **THEN** la venta queda en `ElTintero.datos.ventas` y en
  `eltintero.ventas.v1` con los mismos datos

#### Scenario: Venta rechazada sin escritura

- **WHEN** se intenta confirmar una venta sin cliente o con cantidades
  inválidas
- **THEN** no se agrega ninguna venta y el contenido persistido no cambia

#### Scenario: Persistencia centralizada

- **WHEN** se revisa `js/ventas.js`
- **THEN** no contiene llamadas a `localStorage` ni nombres de claves, y delega
  el guardado en `ElTintero.registros.registrarVenta`
