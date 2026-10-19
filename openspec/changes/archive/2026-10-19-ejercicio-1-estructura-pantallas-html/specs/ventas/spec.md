# Spec Delta — ventas

## Purpose

Define la estructura observable de la vista Ventas: selección de cliente,
composición de renglones con agregar/quitar y resumen con total y confirmación,
con estados en el DOM y ganchos estables, sin implementar cálculos ni lógica.

## ADDED Requirements

### Requirement: Selección de cliente y renglones (R-05 parcial)

La vista SHALL contener `label` + `select#ventas-cliente` (opciones de ejemplo
coherentes con la vista Clientes), `select#ventas-libro` +
`input#ventas-cantidad[type=number]` + botón «Agregar renglón», y
`table#venta-renglones` con `thead` y columnas exactas Libro, Cantidad, Precio
unitario, Subtotal, Acciones (`th scope="col"`), con al menos un renglón de
ejemplo con controles de quitar/cambiar.

#### Scenario: Controles de composición presentes

- **WHEN** se inspecciona la vista Ventas
- **THEN** existen el selector de cliente etiquetado, el trío libro + cantidad
  + «Agregar renglón», y la tabla de renglones con las cinco columnas exigidas

#### Scenario: Venta sin renglones

- **WHEN** la tabla de renglones no tiene filas de ejemplo activas
- **THEN** el resumen muestra total en cero o el mensaje correspondiente, sin
  lógica de confirmación (excluida: pertenece al Ej. 5)

### Requirement: Resumen y confirmación (R-05 parcial)

La vista SHALL contener el bloque `ventas-resumen` con `ventas-total` y botón
«Confirmar venta». No se implementan cálculos (subtotal = cantidad × precio,
total = suma de subtotales) ni confirmación lógica; solo la estructura.

#### Scenario: Resumen inspeccionable

- **WHEN** se revisa `ventas-resumen` con el renglón de ejemplo
- **THEN** el total es visible en el DOM con `id` estable `ventas-total` y el
  botón «Confirmar venta» describe su acción

### Requirement: Estados de la venta (R-07 parcial)

La vista SHALL incluir `ventas-mensaje-ok` y `ventas-mensaje-error` en el DOM
con `id` estable y `aria-live="polite"`, vacíos por defecto o con texto de
ejemplo marcado como «(ejemplo)».

#### Scenario: Mensajes de resultado direccionables

- **WHEN** el formulario de venta está en su estado inicial con ejemplos
- **THEN** ambos contenedores existen en el DOM con `aria-live="polite"`
  aunque estén ocultos o vacíos

### Requirement: Ganchos para cálculos futuros (R-10 parcial)

Los controles SHALL llevar `id`/`name` estables (`ventas-cliente`,
`ventas-libro`, `ventas-cantidad`, `ventas-total`) y cada renglón
`data-libro-id` + `data-cantidad`, documentados para que el Ej. 5 los use sin
cambiar el HTML.

#### Scenario: Renglones direccionables por libro

- **WHEN** se lista el renglón de ejemplo
- **THEN** expone `data-libro-id` coincidente con un libro del catálogo y
  `data-cantidad`, sin `id` duplicados en el documento
