# Pruebas manuales — El Tintero

Registro de los casos manuales del PDF (Ejercicio 6) y de las comprobaciones
adicionales de persistencia.

## Entorno de ejecución

- **Navegador:** Chromium 151.0.7922.173 (headless, automatizado con Playwright).
- **Sistema operativo:** Arch Linux, kernel Linux 7.2.2-arch1-1.
- **Fecha de ejecución:** 2026-10-22.
- **Apertura:** `file://` directa, sin servidor.
- **Herramienta:** Playwright sobre Chromium.

## Casos del PDF

| Caso | Resultado esperado | Resultado observado | Estado |
| --- | --- | --- | --- |
| 1. Búsqueda con una parte del título en mayúsculas; luego búsqueda vacía y texto inexistente | Coincidencias sin distinguir mayúsculas; catálogo completo; mensaje sin resultados. | Catálogo inicial: 6 tarjetas. «ALEPH»: 1 coincidencia (incluye «El Aleph»). Búsqueda vacía: 6. «zzzz-no-existe»: 0 y mensaje «No se encontraron libros para «zzzz-no-existe».» | APROBADO |
| 2. Alta de libro con ISBN existente y luego con ISBN nuevo | El duplicado se rechaza; el válido aparece en catálogo y selección de venta. | ISBN duplicado rechazado («Ya existe un libro con ese ISBN.»), filas 6 → 6. ISBN nuevo aceptado («Libro registrado correctamente.»), filas 7, 7 persistidos, visible en catálogo y en el selector de ventas. | APROBADO |
| 3. Alta de cliente con email inválido, email existente en mayúsculas y email nuevo | Se rechazan los dos primeros; el nuevo aparece en listado y selección. | Email inválido: «El email no tiene un formato válido.». Email duplicado: «Ya existe un cliente con ese email.». Email nuevo: «Cliente registrado correctamente.», filas 3 → 4, 4 persistidos, visible en el selector. | APROBADO |
| 4. Venta sin cliente, cantidad cero, negativa o decimal; libro repetido | No se confirma; el duplicado no crea otro renglón. | Sin cliente: «Seleccioná un cliente. Agregá al menos un renglón.». Cantidad 0 y negativa: «La cantidad debe ser mayor que cero.» (0 filas). Decimal: «La cantidad debe ser un número entero.» (0 filas). Libro repetido: «Ese libro ya está en la venta.» (1 fila). Ventas persistidas 2 → 2. | APROBADO |
| 5. Venta válida: dos unidades a 1500 y una a 2000 | Subtotales 3000 y 2000; total 5000; detalle conservado en el historial. | 2 renglones: «Cien años de soledad» 2 × $1.500,00 = $3.000,00 y «Antología de la literatura fantástica» 1 × $2.000,00 = $2.000,00. Total $5.000,00. Confirmación «Venta registrada correctamente.»; 3 ventas persistidas; fila 3 del historial («3 — 22/10/2026 — Ana Pérez — $5.000,00 — Ver detalle») y detalle con precios unitarios y subtotales. | APROBADO (con datos de prueba) |
| 6. Venta confirmada y cambio exclusivo del precio de catálogo guardado, en un perfil de prueba | Al recargar el historial, el precio unitario, los subtotales y el total de esa venta conservan los valores confirmados. | Se modificó solo el `precio` del libro 1 en `eltintero.libros.v1` (a 9999); `eltintero.ventas.v1` no cambió. Tras recargar, el catálogo muestra «Precio: $9.999» y el detalle de la venta 3 conserva $1.500,00, $3.000,00, $2.000,00 y total $5.000,00. | APROBADO (con datos de prueba) |
| 7. Recarga después de altas y venta | Se recuperan datos sin duplicar ejemplos ni ventas. | Antes y después de 5 recargas: libros/clientes/ventas = 7/4/3; títulos idénticos; ids de ventas únicos; integridad `[]`. | APROBADO |
| 8. Navegación por teclado y anchos de 320 px y 1280 px | Foco visible, controles utilizables y tabla con desplazamiento propio si lo necesita. | Primer foco: «A Catálogo», con `outline: solid 3px` visible. A 320 px: sin desborde de página y tabla con desplazamiento propio (576 px de contenido en 286 px visibles, `overflow-x: auto`). A 1280 px: sin desborde (`pageScrollWidth` = viewport = 1280). | APROBADO |

## Comprobaciones adicionales de persistencia

| Caso | Resultado esperado | Resultado observado | Estado |
| --- | --- | --- | --- |
| P3.4. Colección vacía respetada | Los estados vacíos se muestran y las claves siguen en `[]` (no se resiembra). | Catálogo vacío visible («No hay libros registrados.»), historial vacío, longitudes 0/0/0 y claves `libros`, `clientes` y `ventas` en `[]`. | APROBADO |
| P3.5. Clave ausente aislada | Solo la colección faltante se resiembra; las demás quedan idénticas. | Se borró solo `eltintero.clientes.v1`: antes y después 6/3/2; libros y ventas idénticos; 3 filas de clientes. | APROBADO |
| P4.1. JSON inválido en libros | Se recuperan los 6 ejemplos, la clave se reescribe válida y las demás colecciones no cambian. | 6 tarjetas y 6 libros; clientes 3 → 3; ventas 2 → 2; clave reescrita parseable con 6 registros. | APROBADO |
| P4.2. Esquema inválido en clientes | Vuelven los 3 ejemplos; libros y ventas no se tocan. | 3 filas y 3 clientes; libros 6 → 6; ventas 2 → 2. | APROBADO |
| P4.3. Valor no array en ventas | Vuelven las 2 ventas de ejemplo y el historial renderiza. | 2 filas y 2 ventas; libros 6 → 6; clientes 3 → 3; la clave vuelve a ser un array; integridad `[]`. | APROBADO |
| P4.4. Almacenamiento no disponible | La app funciona en memoria, registra aviso controlado y no bloquea. | Con `localStorage` bloqueado (simulado con `SecurityError`): 6 libros y 6 tarjetas; `disponible()` = `false`; aviso «[ElTintero.persistencia] localStorage no está disponible; se usan los ejemplos en memoria.». | APROBADO (simulado) |
| P4.5. Cuota excedida | La venta permanece en memoria, la UI muestra éxito y se registra el fallo de escritura. | Simulado con `Storage.prototype.setItem` lanzando `QuotaExceededError`: éxito visible, ventas en memoria 2 → 3 y consola «[ElTintero.persistencia] No se pudo escribir eltintero.ventas.v1: Cuota simulada.». | APROBADO (simulado) |
| P4.6. Restablecimiento por consola | Vuelve a 6/3/2 y no existe control visible de restablecimiento. | `restablecer()` devuelve `{ok: true, errores: []}`; longitudes 6/3/2; ningún control visible de restablecimiento. | APROBADO |
| P4.7. Integridad referencial rota | La app renderiza, las colecciones implicadas vuelven a ejemplos e integridad termina en `[]`. | Venta con `libroId` inexistente: historial renderiza 2 filas; colecciones implicadas vuelven a ejemplos; integridad `[]`. | APROBADO |
| P3.6. Consola limpia e integridad | Sin errores no controlados y `verificarIntegridad()` devuelve `[]`. | Sin errores de consola no simulados; integridad `[]`. | APROBADO |
| P7.4. Copia del proyecto en otra ubicación | La entrega funciona sin dependencias al abrirla desde otra carpeta. | Copia en `/tmp` abierta por `file://`: 5 enlaces de navegación, 6 libros, 2 ventas, 3 claves e integridad `[]`, sin errores de consola. | APROBADO |

## Aclaraciones

- **Casos 5 y 6:** se ejecutaron con **datos de prueba** en un perfil de
  navegador nuevo. Se modificaron precios en `eltintero.libros.v1` (libro 1 a
  1500 y libro 2 a 2000; luego libro 1 a 9999 para el caso histórico). No se
  usaron datos reales y el catálogo definitivo no tiene esos precios.
- **P4.4 y P4.5:** son simulaciones controladas (bloqueo de `localStorage` con
  `SecurityError` y `Storage.prototype.setItem` lanzando `QuotaExceededError`) y
  se declaran como tales.
- **Honestidad del registro:** ningún caso se marca como aprobado sin haber sido
  ejecutado. No hubo casos fallidos ni omitidos.
- **Capturas:** durante la verificación se generaron capturas de pantalla, pero
  **no se incluyen en el repositorio**.
