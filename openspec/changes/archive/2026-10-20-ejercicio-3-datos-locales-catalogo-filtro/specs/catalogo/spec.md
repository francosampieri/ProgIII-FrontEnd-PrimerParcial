# Spec Delta — catalogo

## MODIFIED Requirements

### Requirement: Contenido del catálogo (R-02)

La vista Catálogo SHALL contener un encabezado con el título de la librería, un
formulario buscador con `label` asociado a `input#catalogo-titulo[type=search]` y
botones «Buscar por título» y «Limpiar búsqueda», y un listado `catalogo-lista`
cuyas tarjetas se generan desde el modelo de datos en memoria. Cada tarjeta MUST
exponer título, ISBN, editorial resuelta por id, género resuelto por id o el
literal exacto «Sin clasificar» cuando `generoId` es `null`, autores resueltos
por id y precio formateado. La vista MUST conservar los contenedores y ganchos
existentes (`catalogo-buscador`, `catalogo-titulo`, `catalogo-lista`,
`data-libro-id`) y MUST NOT contener tarjetas de libros hardcodeadas.

#### Scenario: Cada libro expone los seis datos

- **WHEN** se abre `catalogo.html` con doble clic y se inspecciona
  `catalogo-lista`
- **THEN** cada libro presenta título, ISBN, editorial, género, autores y
  precio, y al menos uno presenta el literal exacto «Sin clasificar»

#### Scenario: Buscador etiquetado

- **WHEN** se recorre el formulario `catalogo-buscador`
- **THEN** el campo de búsqueda tiene `label for="catalogo-titulo"` y existen
  botones con los textos «Buscar por título» y «Limpiar búsqueda»

#### Scenario: Libro con varios autores y libro sin género

- **WHEN** se revisan los ejemplos límite (un libro con más de un autor, un
  libro sin género asignado)
- **THEN** los autores se presentan como lista legible y la ausencia de género
  se presenta con el literal «Sin clasificar», nunca como celda vacía

#### Scenario: Sin tarjetas hardcodeadas

- **WHEN** se inspecciona el HTML servido antes de ejecutarse JavaScript
- **THEN** `catalogo-lista` no contiene tarjetas de libros escritas a mano

### Requirement: Estados del catálogo en el DOM (R-07 parcial)

La vista SHALL mantener los contenedores `catalogo-vacio` (catálogo sin libros)
y `catalogo-sin-resultados` (búsqueda sin coincidencias) en el DOM, con `id`
estable y `aria-live="polite"`. JavaScript MUST controlar su visibilidad
alternando el atributo `hidden` y MUST garantizar que nunca se muestren dos
estados contradictorios a la vez. El texto de `catalogo-sin-resultados` MUST
incluir el término buscado, insertado como texto.

#### Scenario: Contenedores de estado direccionables

- **WHEN** el catálogo muestra los libros de ejemplo
- **THEN** `catalogo-vacio` y `catalogo-sin-resultados` existen en el DOM con
  `aria-live="polite"` y permanecen ocultos

#### Scenario: Estados mutuamente excluyentes

- **WHEN** se realiza una búsqueda sin coincidencias
- **THEN** solo `catalogo-sin-resultados` queda visible, `catalogo-vacio`
  permanece oculto y `catalogo-lista` no muestra tarjetas

#### Scenario: Catálogo vacío

- **WHEN** el array de libros está vacío al renderizar
- **THEN** solo `catalogo-vacio` queda visible, `catalogo-sin-resultados`
  permanece oculto y no se muestran tarjetas

### Requirement: Calidad y convenciones del catálogo (R-08, R-09, R-10 parcial)

La vista SHALL usar `header`/`nav`/`main`/`section`/`article`/`footer` con
jerarquía de encabezados sin saltos, `id` en formato `vista-elemento`, y cada
libro SHALL llevar un gancho estable `data-libro-id` único. El comportamiento JS
MUST vivir en archivos externos de `js/`, cargados como scripts clásicos con
`defer` y en orden de dependencia; MUST NOT haber JavaScript inline, `type=
"module"`, librerías ni frameworks. Los `id` de los contenedores existentes y
las clases `.grilla-tarjetas`, `.card` y `.libro-tarjeta` MUST conservarse.

#### Scenario: Semántica e identificadores

- **WHEN** se inspecciona la estructura del documento
- **THEN** existen `header`, `nav`, `main` y `footer`, los encabezados no
  saltan niveles, todo `id` cumple el patrón `vista-elemento` y cada libro
  expone `data-libro-id` único

#### Scenario: Scripts externos con defer

- **WHEN** se inspecciona el final del `body` de `catalogo.html`
- **THEN** hay etiquetas `<script defer src="js/...">` externas, sin código
  inline ni `type="module"`, y el archivo de datos se carga antes del de
  catálogo

#### Scenario: Clases y estilos reutilizados

- **WHEN** se comparan las tarjetas generadas con el markup previo
- **THEN** usan `article.card.libro-tarjeta`, el contenedor conserva
  `grilla-tarjetas` y no se agregaron estilos inline ni CSS nuevo

## ADDED Requirements

### Requirement: Renderizado dinámico del catálogo (R-03)

Al cargar `catalogo.html`, el sistema SHALL generar las tarjetas del catálogo a
partir del array de libros del modelo, reemplazando cualquier contenido previo
de `catalogo-lista`. Cada tarjeta MUST mostrar título, ISBN, editorial, género
(o «Sin clasificar»), autores y precio formateado, y MUST conservar la clase
`libro-tarjeta` y un `data-libro-id` igual al `id` del libro. Los datos de los
libros MUST existir solo en el modelo y MUST NOT duplicarse en el HTML.

#### Scenario: Catálogo generado desde el modelo

- **WHEN** se abre `catalogo.html` con los 6 libros de ejemplo
- **THEN** se muestran exactamente 6 tarjetas cuyos `data-libro-id` coinciden
  con los ids del modelo

#### Scenario: Libro sin género

- **WHEN** se renderiza un libro con `generoId: null`
- **THEN** su tarjeta muestra «Sin clasificar» en el género

#### Scenario: Relaciones resueltas

- **WHEN** se renderiza una tarjeta
- **THEN** la editorial y los autores mostrados corresponden a los nombres de
  los registros referenciados por sus ids, y el precio aparece formateado con
  separador de miles

#### Scenario: Libro con varios autores

- **WHEN** se renderiza un libro con más de un autor
- **THEN** todos sus autores aparecen listados, sin omitir ninguno

### Requirement: Filtro por título (R-04)

El sistema SHALL filtrar los libros por coincidencia parcial en el título,
ignorando diferencias entre mayúsculas y minúsculas y eliminando los espacios
sobrantes en los extremos del término. El filtro MUST aplicarse **solo al
enviar el formulario** `catalogo-buscador`; el sistema MUST NOT filtrar en vivo
con el evento `input`. Un término vacío o compuesto solo por espacios MUST
mostrar el catálogo completo; una búsqueda sin coincidencias MUST no mostrar
tarjetas y MUST mostrar el mensaje de sin resultados con el término.

#### Scenario: Búsqueda con mayúsculas y espacios extremos

- **WHEN** se envía el formulario con `"  ciEN  "`
- **THEN** el catálogo muestra «Cien años de soledad»

#### Scenario: Búsqueda vacía o con espacios

- **WHEN** se envía el formulario con el campo vacío o con solo espacios
- **THEN** se muestran los 6 libros y ningún mensaje de estado

#### Scenario: Coincidencia parcial

- **WHEN** se envía el formulario con una parte del título, por ejemplo «años»
- **THEN** se muestran todos los libros cuyo título contiene esa parte, sin
  distinguir mayúsculas y minúsculas

#### Scenario: Sin coincidencias

- **WHEN** se envía el formulario con un término que no aparece en ningún título
- **THEN** no se muestra ninguna tarjeta y `catalogo-sin-resultados` queda
  visible con el término buscado en su texto

### Requirement: Eventos del buscador y restauración del catálogo (R-06)

El formulario del buscador SHALL controlar el evento `submit` con
`preventDefault`, de modo que la búsqueda no recargue la página; enviar con
Enter y pulsar «Buscar por título» MUST ser el mismo camino. El sistema MUST NOT
escuchar el evento `input` para filtrar. El evento `reset` MUST limpiar el
campo, restaurar el catálogo completo y ocultar los mensajes de estado. Las
responsabilidades MUST estar separadas entre definición de datos, consultas,
filtro, renderizado y mensajes.

#### Scenario: Envío sin recargar

- **WHEN** se envía el buscador con Enter o con el botón «Buscar por título»
- **THEN** la página no se recarga y el catálogo se actualiza según el término

#### Scenario: Sin filtrado en vivo

- **WHEN** se escribe en `catalogo-titulo` sin enviar el formulario
- **THEN** el catálogo no cambia y se siguen mostrando las tarjetas previas al
  envío

#### Scenario: Limpiar búsqueda

- **WHEN** se activa «Limpiar búsqueda» después de una búsqueda
- **THEN** el campo queda vacío, se muestran los 6 libros y ambos mensajes de
  estado quedan ocultos

#### Scenario: Limpiar después de una búsqueda sin resultados

- **WHEN** se activa «Limpiar búsqueda» estando visible el mensaje de sin
  resultados
- **THEN** el mensaje se oculta y se restaura el catálogo completo

### Requirement: Inserción segura de datos en el DOM (R-07)

Todo título, ISBN, nombre de editorial, género o autor, precio y término
buscado SHALL insertarse mediante `textContent` y/o `createElement`. El sistema
MUST NOT usar `innerHTML`, `insertAdjacentHTML`, `eval` ni `document.write` con
datos del modelo o del usuario, y MUST NOT producir errores en consola al cargar
ni al filtrar con datos válidos.

#### Scenario: Término con caracteres de marcado

- **WHEN** se busca un término que contiene etiquetas o caracteres especiales,
  por ejemplo `<b>cien</b>`
- **THEN** el término se muestra como texto literal y no se crea ningún
  elemento HTML a partir de él

#### Scenario: Consola limpia

- **WHEN** se abre la página y se realizan búsquedas válidas
- **THEN** la consola no registra errores de JavaScript

#### Scenario: Sin APIs de HTML crudo

- **WHEN** se revisan los archivos JS
- **THEN** no aparecen `innerHTML`, `insertAdjacentHTML`, `eval` ni
  `document.write` aplicados a datos
