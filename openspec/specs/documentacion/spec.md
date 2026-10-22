# documentacion Specification

## Purpose
Define el contenido verificable de la documentación de entrega: `README.md`
completo, esquema del almacenamiento y registro honesto de los casos manuales
exigidos por el PDF.

## Requirements

### Requirement: README en la raíz con contenido obligatorio (R-06)

El proyecto SHALL incluir `README.md` en la raíz con, como mínimo, los
siguientes apartados: integrantes del trabajo, pasos para abrir `index.html` en
el navegador sin npm ni servidor, navegación entre las cinco vistas,
funcionalidades implementadas y pendientes, ubicación de los datos iniciales,
funcionamiento y límites de `localStorage`, ubicación y estructura de los datos
guardados, procedencia de imágenes ajenas y resultados de los casos manuales. Los
apartados MUST estar identificables con títulos propios y MUST ser coherentes con
el estado real del proyecto.

#### Scenario: Apertura sin npm

- **WHEN** se lee la sección de apertura del README
- **THEN** indica abrir `index.html` con doble clic o desde el navegador, sin
  `npm install`, sin build y sin servidor local

#### Scenario: Navegación documentada

- **WHEN** se lee la sección de navegación
- **THEN** se nombran Catálogo, Libros, Clientes, Ventas e Historial y cómo se
  llega a cada una desde la navegación global

#### Scenario: Funcionalidades implementadas y pendientes

- **WHEN** se lee esa sección
- **THEN** distingue lo que funciona (catálogo, filtro, altas, venta, historial,
  persistencia) de lo que queda pendiente o fuera de alcance, sin presentar
  maquetas o pendientes como funcionalidad terminada

#### Scenario: Datos iniciales

- **WHEN** se lee la sección de datos iniciales
- **THEN** indica que viven en `js/data.js` y que son ficticios (6 libros, 3
  clientes y 2 ventas)

### Requirement: Funcionamiento y límites de `localStorage` documentados (R-06)

El README SHALL explicar que la persistencia usa `localStorage`, que depende del
navegador, del perfil y de la ubicación de apertura (incluido el origen
`file://`), que no se comparte entre usuarios ni equipos y que puede borrarse al
limpiar los datos del navegador. MUST indicar que no hay backend ni
sincronización y que el almacenamiento no garantiza seguridad ni integridad.

#### Scenario: Límites explícitos

- **WHEN** se lee la sección de `localStorage`
- **THEN** se enumeran dependencia del navegador, del perfil y de la ubicación,
  falta de sincronización entre usuarios y posibilidad de pérdida al limpiar
  datos

#### Scenario: Sin promesas de backend

- **WHEN** se revisa el README
- **THEN** no se afirma que los datos se comparten, se respaldan o se validan en
  un servidor

### Requirement: Ubicación y estructura de los datos guardados (R-03, R-06)

El README SHALL documentar el nombre exacto de las claves
`eltintero.libros.v1`, `eltintero.clientes.v1` y `eltintero.ventas.v1`, el tipo
de valor de cada una y los campos de sus registros. MUST incluir un instructivo
para reproducir la comprobación del PDF: abrir las herramientas del navegador,
ubicar `eltintero.libros.v1`, modificar únicamente el `precio` de un libro,
recargar y verificar en el historial que la venta conserva sus importes.

#### Scenario: Claves y esquema

- **WHEN** se lee la sección de datos guardados
- **THEN** aparecen las tres claves, el hecho de que el valor es un array JSON y
  los campos de libro, cliente, venta y renglón

#### Scenario: Instructivo de precio histórico

- **WHEN** se sigue el instructivo del README en una copia de prueba
- **THEN** se puede modificar solo el precio del libro en
  `eltintero.libros.v1` y comprobar que `eltintero.ventas.v1` no se altera

#### Scenario: Advertencia sobre edición manual

- **WHEN** se lee el instructivo
- **THEN** advierte que la edición manual debe respetar el JSON válido y que no
  existe una pantalla para editar precios

### Requirement: Registro de los 8 casos manuales con resultado observado (R-07)

El proyecto SHALL registrar los 8 casos manuales del PDF con, al menos, caso,
resultado esperado, resultado observado y estado (aprobado, fallido o pendiente).
El registro MUST estar en el README o en un documento enlazado desde el README.
Cada caso MUST haberse ejecutado realmente antes de marcarse como aprobado; un
caso no ejecutado MUST registrarse como pendiente y uno fallido MUST registrar el
comportamiento real observado.

#### Scenario: Los 8 casos enumerados

- **WHEN** se lee el registro de pruebas
- **THEN** están los 8 casos del PDF: búsqueda por título; alta de libro
  duplicado y nuevo; alta de cliente con email inválido, existente en mayúsculas
  y nuevo; venta inválida y libro repetido; venta válida de 2 × 1500 + 1 × 2000;
  cambio exclusivo del precio guardado y recarga; recarga después de altas y
  venta; navegación por teclado y anchos de 320 px y 1280 px

#### Scenario: Resultado esperado del caso de venta

- **WHEN** se lee el caso de venta válida
- **THEN** el resultado esperado indica subtotales 3000 y 2000, total 5000 y
  detalle conservado en el historial, e identifica si se usaron datos de prueba
  con precios 1500 y 2000 porque el catálogo definitivo no tiene esos importes

#### Scenario: Honestidad del registro

- **WHEN** un caso no se ejecutó o falló
- **THEN** figura como pendiente o fallido con el comportamiento real, y no como
  aprobado

#### Scenario: Enlace desde el README

- **WHEN** el registro vive en un archivo separado
- **THEN** el README enlaza ese archivo de forma explícita

### Requirement: Integrantes y procedencia de imágenes (R-06)

El README SHALL identificar a quienes realizan el trabajo. Si no se usan
imágenes ajenas, MUST declararlo explícitamente; si se usan, MUST indicar su
procedencia y autoría. MUST NOT inventar nombres, legajos ni fuentes.

#### Scenario: Integrantes identificados

- **WHEN** se lee la sección de autoría
- **THEN** figuran los nombres Mauro Di Pietro, Renzo Victoria, Franco Sampieri y
  Tomas Gonzales, junto con la comisión 2Prog1
- **AND** no se inventan datos personales

#### Scenario: Imágenes declaradas

- **WHEN** se revisan los recursos del proyecto y el README
- **THEN** la declaración sobre imágenes coincide con lo que realmente se usa

### Requirement: Entrega sin dependencias ni herramientas de compilación (R-10)

La estructura del proyecto SHALL permitir entregar una carpeta o archivo
comprimido con `index.html`, los demás HTML, CSS, JavaScript, recursos locales y
`README.md`, sin dependencias instaladas ni herramientas de build. El README MUST
declarar las funcionalidades pendientes y MUST NOT exigir pasos de instalación
para ejecutar la entrega.

#### Scenario: Comprimido autosuficiente

- **WHEN** se descomprime la entrega en otra carpeta y se abre `index.html`
- **THEN** la aplicación funciona sin instalar nada ni ejecutar comandos

#### Scenario: Pendientes declarados

- **WHEN** se lee la sección de pendientes
- **THEN** los pendientes y límites conocidos están enumerados y no se ocultan

#### Scenario: Sin referencias a herramientas de build

- **WHEN** se revisa el README y los HTML
- **THEN** no se indican `npm`, bundlers, servidores ni instalaciones
  obligatorias para abrir la entrega
