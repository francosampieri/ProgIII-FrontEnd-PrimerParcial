# El Tintero — Frontend de una librería

Trabajo Práctico Integrador (TPI) de **Programación III**, comisión **2Prog1**.
Es el frontend de una librería llamada **El Tintero**: permite consultar el
catálogo, registrar libros y clientes, simular ventas y consultar el historial,
todo con HTML, CSS y JavaScript nativos.

## Integrantes

Comisión **2Prog1**.

- Mauro Di Pietro
- Renzo Victoria
- Franco Sampieri
- Tomas Gonzales

## Cómo abrir el proyecto

No hace falta instalar nada: no se usa npm, no hay build ni servidor.

1. Descargar o descomprimir la carpeta del proyecto.
2. Hacer **doble clic en `index.html`** para abrirlo en el navegador.
3. Navegar con el menú superior entre **Catálogo**, **Libros**, **Clientes**,
   **Ventas** e **Historial**.

La aplicación también funciona abriendo cualquier otra vista directamente
(`catalogo.html`, `libros.html`, `clientes.html`, `ventas.html`,
`historial.html`) mediante `file://`.

## Funcionalidades implementadas

- **Catálogo** con búsqueda por título que ignora mayúsculas y minúsculas,
  acepta coincidencias parciales y recorta espacios; muestra un mensaje cuando
  no hay resultados.
- **Alta de libros** con título, ISBN, precio, editorial, género opcional y
  autores, con validación de campos, ISBN duplicado y referencias existentes.
- **Alta de clientes** con nombre y email, con validación de formato y de email
  duplicado (sin distinguir mayúsculas).
- **Venta simulada** con selección de cliente, renglones de libro y cantidad,
  cálculo de subtotales y total, y rechazo de ventas sin cliente, sin renglones
  o con cantidades inválidas o libros repetidos.
- **Historial inmutable**: las ventas confirmadas se listan con identificador,
  fecha, cliente y total, y su detalle conserva el precio unitario y los
  importes del momento de la confirmación.
- **Persistencia con `localStorage`**: los libros, clientes y ventas se
  recuperan al volver a abrir el sitio sin duplicar los ejemplos iniciales.

### Funcionalidades pendientes

No queda ninguna funcionalidad pendiente del alcance del PDF. Las limitaciones
son las propias del alcance: no hay backend, base de datos, autenticación,
gestión de stock, cobros ni facturación; los datos viven en el almacenamiento
local del navegador.

## Datos iniciales

Los datos de ejemplo están en **`js/data.js`**:

- 3 editoriales, 3 géneros y 5 autores reales.
- 6 libros reales. Los ISBN de los libros 4 a 6 son placeholders no verificados
  y los precios son valores de ejemplo.
- 3 clientes ficticios.
- 2 ventas de ejemplo, con fechas ficticias.

Las editoriales, los autores y los libros corresponden a obras y datos
bibliográficos reales; los clientes, las ventas y las fechas son ficticios.

## Funcionamiento y límites de `localStorage`

Al abrir la aplicación por primera vez, si no hay datos guardados, se siembran
los ejemplos de `js/data.js`. En las siguientes aperturas se recuperan los
registros guardados; si una colección falta o es inválida, se restauran solo sus
ejemplos y se registra un aviso controlado en la consola.

Límites reales:

- Depende del **navegador**, del **perfil** usado y de la **ubicación de
  apertura** (`file://`). Otro navegador, otro perfil u otra ruta pueden tener
  otro almacenamiento.
- **No se comparte** entre usuarios ni entre equipos y **no se sincroniza**.
- Se **pierde** al limpiar los datos del navegador o al borrar las claves.
- **No hay backend** ni validación en servidor: la persistencia es local y sirve
  para la práctica, no como garantía de integridad.

## Ubicación y estructura de los datos guardados

Se usan tres claves independientes de `localStorage`, cada una con un **array
JSON** como valor:

| Clave | Contenido |
| --- | --- |
| `eltintero.libros.v1` | Array de libros |
| `eltintero.clientes.v1` | Array de clientes |
| `eltintero.ventas.v1` | Array de ventas |

Campos de cada registro:

- **Libro**: `id` (entero), `titulo` (texto), `isbn` (texto), `precio` (número),
  `editorialId` (entero), `generoId` (entero o `null`) y `autoresIds` (array no
  vacío de enteros).
- **Cliente**: `id` (entero), `nombre` (texto) y `email` (texto).
- **Venta**: `id` (entero), `fecha` (`YYYY-MM-DD`), `clienteId` (entero),
  `clienteNombre` (texto), `renglones` (array no vacío) y `total` (número).
- **Renglón**: `libroId` (entero), `tituloLibro` (texto), `cantidad` (entero
  mayor que cero), `precioUnitario` (número) y `subtotal` (número).

### Cómo reproducir la comprobación del precio histórico

El historial no recalcula los importes desde el catálogo: cada venta guarda su
`precioUnitario`, sus subtotales y su total. Para comprobarlo:

1. Abrir DevTools del navegador (F12) y entrar en **Application/Storage →
   Local Storage**.
2. Ubicar la clave `eltintero.libros.v1`.
3. Modificar **solo** el campo `precio` de un libro, dejando el JSON válido
   (sin tocar ni borrar `eltintero.ventas.v1`).
4. Recargar `historial.html` y abrir el detalle de la venta.
5. Comprobar que el detalle conserva el `precioUnitario`, los subtotales y el
   total confirmados, aunque el catálogo muestre el precio nuevo.

No existe una pantalla de edición de precios: esta edición se hace a mano sobre
el almacenamiento y conviene realizarla sobre una copia del proyecto o con datos
de prueba.

## Pruebas manuales

El registro completo, con entorno y resultados observados, está en
[`docs/pruebas-manuales.md`](docs/pruebas-manuales.md).

Resumen: **8 de 8 casos del PDF aprobados**. Los casos 5 (venta válida 2 × 1500
+ 1 × 2000) y 6 (precio histórico) se ejecutaron con datos de prueba, porque el
catálogo definitivo no tiene esos precios. Además se registraron diez
comprobaciones adicionales de persistencia, todas aprobadas; las de
almacenamiento no disponible y cuota excedida se simularon de forma controlada y
así se declaran.

## Imágenes

**No se usan imágenes ajenas.** La carpeta `assets/` solo contiene `.gitkeep`,
por lo que la interfaz no depende de recursos gráficos externos.

## Estructura de archivos de la entrega

```text
.
├── index.html
├── catalogo.html
├── libros.html
├── clientes.html
├── ventas.html
├── historial.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   ├── catalogo.js
│   ├── altas.js
│   ├── ventas.js
│   └── historial.js
├── assets/
│   └── .gitkeep
├── docs/
│   ├── pruebas-manuales.md
│   └── prompts/
└── README.md
```

No se incluyen `node_modules`, `package.json` ni herramientas de compilación.
Las carpetas `docs/prompts/` y `openspec/` contienen material de planificación y
no son necesarias para ejecutar la aplicación.
