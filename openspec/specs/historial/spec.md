# historial Specification

## Purpose

Define la estructura observable de la vista Historial: tabla de ventas con
identificador, fecha, cliente y total, con acceso al detalle de renglones por
venta y estado de lista vacía, usando datos estáticos de ejemplo.

## Requirements

### Requirement: Tabla de ventas (R-06 parcial)

La vista SHALL contener `table#historial-tabla` con `thead` y columnas exactas
Identificador, Fecha, Cliente, Total, Detalle (`th scope="col"`), con 2 ventas
estáticas de ejemplo coherentes con clientes y libros de ejemplo; la columna
Detalle de cada fila SHALL contener un enlace
`<a href="#historial-detalle-<id>">Ver detalle</a>`.

#### Scenario: Columnas y ejemplos coherentes

- **WHEN** se inspecciona `historial-tabla`
- **THEN** el `thead` presenta las cinco columnas exigidas con
  `th scope="col"`, las 2 ventas referencian clientes y libros existentes en
  los ejemplos, y cada fila incluye su enlace de detalle a
  `#historial-detalle-<id>`

### Requirement: Detalle de renglones por venta (R-06 parcial)

Debajo de `historial-tabla`, la vista SHALL incluir una
`section#historial-detalle-<id>` por venta de ejemplo, con
`<h3>Detalle <ID></h3>`, una tabla de renglones (Libro, Cantidad, Precio
unitario, Subtotal) y un enlace `<a href="#historial-tabla">Volver al
listado</a>`; los `id` `historial-detalle-<id>` son estables.

#### Scenario: Renglones consultables por venta

- **WHEN** se activa el enlace «Ver detalle» de una venta de ejemplo en la
  columna Detalle de `historial-tabla`
- **THEN** la `section#historial-detalle-<id>` correspondiente queda visible
  con su `h3` y sus renglones (Libro, Cantidad, Precio unitario, Subtotal),
  sin JavaScript y sin editar ni eliminar la venta

### Requirement: Estado de historial vacío (R-07 parcial)

La vista SHALL incluir `historial-vacio` en el DOM con `id` estable y
`aria-live="polite"`, oculto o vacío mientras haya ventas de ejemplo.

#### Scenario: Contenedor de lista vacía direccionable

- **WHEN** el historial muestra las ventas de ejemplo
- **THEN** `historial-vacio` existe en el DOM con `aria-live="polite"` aunque
  esté oculto o vacío

### Requirement: Ganchos para precio histórico futuro (R-10 parcial)

Cada venta y su detalle SHALL llevar identificadores estables
(`data-venta-id`, `historial-detalle-<id>`) documentados para que el Ej. 5
conserve precio unitario histórico sin cambiar el HTML; no se implementa
persistencia ni inmutabilidad lógica.

#### Scenario: Ventas identificables de forma estable

- **WHEN** se listan las ventas de ejemplo
- **THEN** cada una expone `data-venta-id` único y su detalle es direccionable
  vía `historial-detalle-<id>`
