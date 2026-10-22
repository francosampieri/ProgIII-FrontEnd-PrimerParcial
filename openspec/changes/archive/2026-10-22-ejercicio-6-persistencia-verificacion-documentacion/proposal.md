# Proposal

## Why

El TPI "El Tintero" conserva hoy libros, clientes y ventas solo en memoria: al
recargar o navegar entre páginas se pierden las altas y las ventas confirmadas.
El Ejercicio 6 del PDF exige usar `localStorage` para persistir esas colecciones,
recuperarlas sin duplicar los ejemplos, documentar el almacenamiento y registrar
la ejecución real de 8 casos manuales. Sin este cierre, la entrega queda
incompleta en el 10 % de la nota y el historial inmutable del Ejercicio 5 no
puede comprobarse entre recargas.

## What Changes

- Agregar una capa de persistencia centralizada en `js/data.js`
  (`ElTintero.persistencia`) que lea y escriba `localStorage` con claves
  versionadas por colección.
- Sembrar los datos de ejemplo solo en el primer inicio de cada colección; en
  aperturas posteriores recuperar exactamente lo guardado, sin volver a agregar
  ejemplos ni duplicar ventas.
- Guardar el estado después de cada mutación existente: `registrarLibro`,
  `registrarCliente` y `registrarVenta` dejan persistida la colección afectada.
- Definir y aplicar una política controlada ante JSON inválido, claves ausentes,
  esquema inválido, almacenamiento no disponible o cuota excedida.
- Conservar el historial inmutable: los renglones persistidos mantienen
  `precioUnitario`, `subtotal` y `total` confirmados aunque cambie el precio del
  libro en el catálogo guardado.
- Crear `README.md` en la raíz con integrantes, apertura sin npm, navegación,
  funcionalidades y pendientes, datos iniciales, límites de `localStorage`,
  ubicación y estructura de los datos guardados, procedencia de imágenes y
  resultados de los casos manuales.
- Registrar los 8 casos manuales con resultado esperado, resultado observado y
  estado, sin marcar como aprobado ningún caso no ejecutado.
- **No hay cambios de diseño, CSS, navegación ni lógica de negocio** fuera de los
  puntos de carga y guardado.

## Capabilities

### New Capabilities

- `persistencia`: carga inicial, siembra única, hidratación, guardado de
  mutaciones, claves versionadas, política ante datos inválidos, integridad y
  restablecimiento para pruebas con `localStorage`.
- `documentacion`: contenido obligatorio del `README.md`, documentación del
  esquema de almacenamiento, registro verificable de los 8 casos manuales y
  condiciones de entrega sin dependencias ni build.

### Modified Capabilities

- `datos-locales`: el modelo deja de ser "sin persistencia"; se hidrata desde
  `localStorage` y se persiste tras cada alta. Se retira la preparación futura
  de persistencia y se actualiza la interfaz pública.
- `historial`: las ventas confirmadas sobreviven a la recarga y a la navegación;
  el detalle conserva los valores históricos persistidos.
- `ventas`: la inmutabilidad se mantiene, pero deja de reiniciarse al recargar;
  `registrarVenta` persiste la venta confirmada.

## Impact

- `js/data.js`: capa `ElTintero.persistencia`, hidratación al cargar, guardado en
  los tres puntos de mutación y `verificarIntegridad()` ejecutada después de
  hidratar.
- `README.md`: archivo nuevo en la raíz.
- `docs/pruebas-manuales.md` (según D-08 confirmada): registro de los 8 casos
  manuales, enlazado desde el README.
- Sin cambios en HTML, CSS, navegación ni contratos públicos existentes. No se
  agregan dependencias, servidor, backend, `fetch`, `sessionStorage`, IndexedDB,
  cookies ni tests automatizados.

## Contexto verificado y fuentes

### Fuentes

- `docs/prompts/PROMPT6.md` (leído completo): rol, alcance incluido/excluido,
  R-01..R-10, CA-01..CA-10 y decisiones esperadas.
- `docs/Repaso Primer Parcial.pdf`, texto extraído con `pdftotext -layout`
  (leído): "Contexto y alcance" (p. 1), "Organización del trabajo — Etapa 2"
  (p. 2), "Ejercicio 6 · 6. Persistencia, verificación y documentación"
  (pp. 5-6), "Criterios de evaluación — 6. Cierre" (p. 7, persistencia 4 +
  pruebas manuales 3 + documentación y entrega 3) y "Formato de entrega" (p. 7).
- `openspec/config.yaml`: `schema: spec-driven`, artefactos en español,
  headings estructurales y SHALL/MUST en inglés.
- Inspección directa del repositorio (solo lectura), detallada abajo.

### Hechos verificados del producto

| # | Hecho | Fuente |
| --- | --- | --- |
| F-01 | `ElTintero.datos` contiene `editoriales` (3), `generos` (3), `autores` (5), `libros` (6), `clientes` (3) y `ventas` (2 ficticias, fechas `2026-10-01` y `2026-10-02`) | `js/data.js` |
| F-02 | El modelo está declarado como "en memoria y sin persistencia" | comentario en `js/data.js` |
| F-03 | `ElTintero.consultas` expone búsquedas, normalizaciones, unicidad, `formatearPrecio`, `formatearImporte` y `verificarIntegridad` | `js/data.js` |
| F-04 | `ElTintero.registros` expone `generarIdLibro`, `generarIdCliente`, `generarIdVenta`, `registrarLibro`, `registrarCliente` y `registrarVenta` | `js/data.js` |
| F-05 | Los puntos de alta son `ElTintero.datos.libros.push(libro)` (`js/data.js:469`), `ElTintero.datos.clientes.push(cliente)` (`js/data.js:500`) y `ElTintero.datos.ventas.push(venta)` (`js/data.js:600`) | `js/data.js` |
| F-06 | `verificarIntegridad()` se ejecuta al final del IIFE (`js/data.js:631`) y reporta con `console.error` sin lanzar | `js/data.js` |
| F-07 | No existe `localStorage`, `sessionStorage` ni IndexedDB en `js/` ni en los HTML | búsqueda en el repositorio |
| F-08 | No existe `README.md` en la raíz | listado del directorio |
| F-09 | Las vistas se auto-inician al cargar con `<script defer>` después de `js/data.js`; `index.html` no carga scripts | `catalogo.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `index.html` |
| F-10 | `registrarVenta` copia `tituloLibro`, `precioUnitario` y `subtotal` históricos al confirmar | `js/data.js` |
| F-11 | Los specs vigentes `datos-locales`, `historial` y `ventas` afirman explícitamente que no hay persistencia | `openspec/specs/` |
| F-12 | El PDF exige que la estructura guardada permita modificar **solo** el precio de un libro sin tocar las ventas, y documentar su ubicación en el README | PDF p. 6 |
| F-13 | El PDF exige registrar en el README el resultado observado de 8 casos manuales, sin marcar como aprobado lo no ejecutado | PDF p. 6 |

### Restricción detectada

- `file://` es un origen opaco: `localStorage` funciona en la mayoría de los
  navegadores de escritorio, pero el almacenamiento queda aislado por navegador,
  perfil y ubicación de apertura (incluida la ruta del archivo). No se comparte
  entre usuarios, equipos ni copias del proyecto. El README MUST declararlo.

## Alcance

### Incluido

- Persistencia de `libros`, `clientes` y `ventas` (con renglones y precios
  históricos).
- Editoriales, géneros y autores como catálogo fijo de referencia (no
  persistidos), salvo decisión contraria aprobada.
- Siembra inicial, hidratación sin duplicados y guardado después de cada alta o
  venta.
- Claves versionadas, esquema documentado y reproducibilidad del cambio aislado
  de precio.
- Política ante datos ausentes, corruptos, incompletos o de otra versión.
- Verificación de integridad después de cargar y de guardar.
- `README.md` completo y registro de los 8 casos manuales.
- Ajustes mínimos de HTML solo si el SPEC los justifica (por ahora, ninguno
  previsto).

### Excluido

- Backend, API, base de datos, servidor, login real, sincronización, cuentas,
  exportación/importación.
- `sessionStorage`, IndexedDB, cookies, Cache API, service workers.
- Edición, anulación o eliminación de ventas; edición de precios desde la UI;
  administración del almacenamiento desde la interfaz; botón visible de
  restablecimiento.
- Corrección de precios históricos, recálculo retroactivo o migraciones reales.
- Cambios de diseño, CSS, semántica, navegación o lógica de negocio de los
  Ejercicios 1 a 5.
- Tests automatizados, npm, build, frameworks, CI.
- Documentación ajena al README y al registro de pruebas.

## Requisitos y escenarios observables (resumen)

> La versión normativa y testable está en los delta specs. Este resumen vincula
> cada requisito del brief con su comportamiento observable.

- **R-01 Carga inicial y siembra** — En un perfil sin datos, la primera apertura
  muestra los ejemplos (6 libros, 3 clientes, 2 ventas) y los guarda. Las
  aperturas y recargas posteriores recuperan exactamente lo guardado, sin
  volver a sembrar ni duplicar ventas.
- **R-02 Persistencia de mutaciones** — `registrarLibro`, `registrarCliente` y
  `registrarVenta` persisten la colección afectada; las altas y ventas
  sobreviven a la recarga y a la navegación. La capa de vista no toca
  `localStorage`.
- **R-03 Estructura y versionado** — Claves con nombre y versión explícitos;
  esquema documentado en el SPEC y el README; modificar solo el precio de un
  libro en el catálogo guardado no altera ni borra las ventas.
- **R-04 Integridad y recuperación** — Ante JSON inválido, clave ausente,
  colección vacía o esquema inválido, la aplicación no rompe, registra el
  problema de forma controlada, aplica la política aprobada y no duplica
  registros. `verificarIntegridad()` devuelve `[]` con los ejemplos y tras altas
  y ventas válidas.
- **R-05 Historial inmutable** — Una venta recuperada conserva `precioUnitario`,
  `subtotal` y `total` aunque cambie el precio del libro y se recargue.
- **R-06 README** — Contiene todos los apartados del "Formato de entrega".
- **R-07 Casos manuales** — Los 8 casos se ejecutan y se registran con resultado
  esperado, observado y estado.
- **R-08 Calidad y seguridad** — Inserción con `textContent`/`createElement`,
  consola limpia, sin persistir datos inválidos, datos ficticios.
- **R-09 Convenciones** — JS externo clásico con `defer`, IIFE con
  `"use strict"`, namespace `ElTintero`, nombres de dominio en español, 2
  espacios, `id` y contratos conservados.
- **R-10 Entrega** — Estructura apta para comprimir HTML, CSS, JS, recursos y
  `README.md`, sin dependencias ni build; pendientes declarados.

### Casos límite exigidos

| Caso | Resultado observable esperado |
| --- | --- |
| Primer inicio sin claves | Se siembran los ejemplos y se escriben las tres claves |
| Segunda apertura / recarga repetida | Se recuperan los registros guardados; no se agregan ejemplos ni se duplican ventas |
| Clave ausente con las otras presentes | Se siembra solo la colección faltante; las demás se conservan |
| Colección guardada como `[]` | Se respeta como colección vacía; no se vuelve a sembrar |
| JSON inválido en una clave | Se descarta esa colección, se registra el problema y se vuelve a los ejemplos de esa colección |
| JSON válido pero esquema inválido | Igual que el caso anterior, sin romper la vista |
| `localStorage` no disponible | La aplicación funciona en memoria con los ejemplos y registra el problema |
| Cuota excedida al guardar | La operación en memoria no se pierde; se registra el fallo de escritura |
| Alta y venta antes de recargar | Tras recargar y navegar, aparecen en catálogo, libros, clientes, ventas e historial |
| Precio del libro modificado después de la venta | El historial conserva los importes confirmados |
| Venta con renglones persistidos y libro ya inexistente | La integridad reporta el problema sin romper el render |

## Estructura y componentes propuestos

> Todo lo siguiente es **propuesta de diseño**, no implementación. Las decisiones
> de producto ya fueron aprobadas y se registran en "Decisiones aprobadas".

### Claves de `localStorage` y esquema (default recomendado)

| Clave | Contenido | Tipo |
| --- | --- | --- |
| `eltintero.libros.v1` | Array de libros | `Libro[]` |
| `eltintero.clientes.v1` | Array de clientes | `Cliente[]` |
| `eltintero.ventas.v1` | Array de ventas con renglones históricos | `Venta[]` |

- El valor es el JSON del array, sin envoltorio adicional; la versión vive en el
  sufijo `.v1` de la clave.
- `editoriales`, `generos` y `autores` no se guardan: son catálogo fijo del
  código y los libros persistidos los referencian por `id`.
- Esquemas:

```text
Libro   = { id:number, titulo:string, isbn:string, precio:number,
            editorialId:number, generoId:number|null, autoresIds:number[] }
Cliente = { id:number, nombre:string, email:string }
Venta   = { id:number, fecha:"YYYY-MM-DD", clienteId:number,
            clienteNombre:string, renglones:Renglon[], total:number }
Renglon = { libroId:number, tituloLibro:string, cantidad:number,
            precioUnitario:number, subtotal:number }
```

- Para el caso del PDF, el docente abre las herramientas del navegador, ubica
  `eltintero.libros.v1` y edita únicamente el `precio` del libro elegido. Las
  ventas viven en otra clave, por lo que no se alteran ni se borran.

### Funciones de persistencia propuestas (firmas y retornos)

| Función | Parámetros | Devuelve | Responsabilidad |
| --- | --- | --- | --- |
| `ElTintero.persistencia.disponible()` | — | `boolean` | Detección segura de `localStorage` (existencia y escritura de prueba) |
| `ElTintero.persistencia.iniciar()` | — | `void` | Orquesta siembra o hidratación; se invoca dentro de `data.js` antes de las vistas |
| `ElTintero.persistencia.leerColeccion(nombre)` | `nombre: "libros" \| "clientes" \| "ventas"` | `{ ok:true, datos:[] } \| { ok:false, motivo:string }` | Lee, parsea y valida el esquema de una colección |
| `ElTintero.persistencia.guardarColeccion(nombre)` | idem | `{ ok:boolean, error?:string }` | Serializa y escribe `ElTintero.datos[nombre]` |
| `ElTintero.persistencia.guardarTodo()` | — | `{ ok:boolean, errores:string[] }` | Escribe las tres colecciones; usado por la siembra y el restablecimiento |
| `ElTintero.persistencia.sembrar()` | — | `void` | Copia los ejemplos del módulo a `ElTintero.datos` y persiste |
| `ElTintero.persistencia.restablecer()` | — | `{ ok:boolean, errores:string[] }` | Borra las claves y vuelve a sembrar; solo para pruebas por consola |

`ElTintero.persistencia.restablecer()` no se expone en la interfaz visible; se
documenta en el README como ayuda de verificación. Su inclusión está confirmada
por D-06.

### Puntos exactos de guardado

1. `registrarLibro`: después de `ElTintero.datos.libros.push(libro)`
   (`js/data.js:469`) y antes de devolver `{ exito: true, libro }`.
2. `registrarCliente`: después de `ElTintero.datos.clientes.push(cliente)`
   (`js/data.js:500`) y antes de devolver `{ exito: true, cliente }`.
3. `registrarVenta`: después de `ElTintero.datos.ventas.push(venta)`
   (`js/data.js:600`) y antes de devolver `{ exito: true, venta }`.

No se modifica el contrato de retorno existente. Si la escritura falla, se
registra el error de forma controlada y la operación en memoria se conserva
(default D-10).

### Estrategia de siembra y no duplicación

- `data.js` define primero los ejemplos, como hoy.
- `persistencia.iniciar()` decide por colección:
  - clave ausente → copia los ejemplos de esa colección y la guarda;
  - clave presente con JSON válido y esquema correcto → reemplaza
    `ElTintero.datos[nombre]` por los datos guardados (no concatena);
  - clave presente con `[]` → colección vacía válida, sin siembra;
  - clave inválida → descarta esa colección, siembra sus ejemplos y guarda,
    conservando las demás.
- El reemplazo por asignación evita duplicados aunque la página se recargue
  muchas veces.

### Política ante datos inválidos (default)

- JSON inválido, tipo distinto de array, registro no objeto, campos
  obligatorios ausentes o con tipo incorrecto → esa colección se considera
  inválida.
- Se aplica el fallback **solo a la colección inválida** y se registra
  `console.error` con prefijo `[ElTintero.persistencia]`.
- Después de hidratar, se ejecuta `verificarIntegridad()`. Si reporta errores
  referenciales, se restablecen a los ejemplos las colecciones involucradas y se
  vuelve a verificar; si aun así falla, se restablecen las tres colecciones
  persistidas (último recurso) para no dejar la aplicación en un estado roto.
- Nunca se lanza una excepción hacia la vista ni se deja una consola con errores
  no controlados.

### Estados y manejo de errores

| Situación | Comportamiento propuesto |
| --- | --- |
| `localStorage` bloqueado o no disponible | Se usan los ejemplos en memoria; no se escribe; `console.error` controlado; el README lo documenta |
| Cuota excedida o escritura rechazada | La mutación en memoria se conserva; se informa el fallo por consola; la UI no se bloquea |
| JSON inválido o esquema inválido | Fallback por colección a los ejemplos; se informa por consola |
| Clave ausente | Siembra de esa colección |
| Colección vacía `[]` | Se respeta; las vistas muestran sus estados vacíos existentes |
| Navegación entre páginas | Cada página hidrata desde las mismas claves antes de renderizar |
| Datos parciales/incompletos | Se descarta la colección incompleta y se siembra solo ella |

## Restricciones técnicas y convenciones

- Apertura directa por `file://`, sin npm, build ni servidor; prohibido
  `type="module"`.
- JavaScript nativo ES2020+, `const`/`let`, funciones nombradas, IIFE con
  `"use strict"` y namespace `ElTintero`; 2 espacios de indentación.
- Solo `localStorage`; nada de `sessionStorage`, IndexedDB, cookies, `fetch`,
  backend ni librerías.
- Toda lectura/escritura de almacenamiento se centraliza en `js/data.js`; las
  vistas no conocen claves ni serialización.
- `JSON.stringify`/`JSON.parse` con `try/catch`; nunca `eval`.
- Inserción de datos con `textContent`/`createElement`; sin `innerHTML`,
  `insertAdjacentHTML` ni `document.write` con datos.
- Nombres de dominio en español: `persistencia`, `guardar`, `cargar`, `sembrar`,
  `venta`, `renglón`, `precioUnitario`, `subtotal`, `total`.
- Se conservan los `id`, contratos y el orden `data.js` → script de vista.
- El historial no se recalcula desde el catálogo actual.

## Criterios de aceptación (vinculados)

- **CA-01 / R-01** — Primer inicio siembra y guarda los ejemplos; segunda
  apertura y recargas recuperan lo mismo sin duplicar libros, clientes, ventas
  ni ejemplos.
- **CA-02 / R-02** — Un libro, un cliente y una venta sobreviven a la recarga y
  aparecen en `catalogo.html`, `libros.html`, `clientes.html`, `ventas.html` e
  `historial.html` tras navegar.
- **CA-03 / R-03** — Claves y esquema documentados; editar solo el precio de un
  libro en `eltintero.libros.v1` no altera ni borra `eltintero.ventas.v1`.
- **CA-04 / R-04** — Con JSON inválido, clave ausente o esquema inválido no hay
  rotura ni duplicados; se aplica el fallback y `verificarIntegridad()` devuelve
  `[]` con los ejemplos y tras altas y ventas válidas.
- **CA-05 / R-05** — Confirmar venta, modificar el precio guardado, recargar y
  comprobar que el historial conserva `precioUnitario`, subtotales y total.
- **CA-06 / R-06** — El README contiene todos los apartados exigidos.
- **CA-07 / R-07** — Los 8 casos están ejecutados y registrados con resultado
  esperado, observado y estado.
- **CA-08 / R-08** — Sin `innerHTML` con datos, sin errores en consola y sin
  persistir datos inválidos.
- **CA-09 / R-09** — `file://` funciona sin servidor ni dependencias; scripts
  externos clásicos con `defer`; contratos e `id` conservados.
- **CA-10 / R-10** — Comprimido con HTML, CSS, JS, recursos y `README.md`, sin
  dependencias ni build; pendientes declarados.

## Supuestos e información pendiente

- Los 8 casos manuales se ejecutarán recién en la Fase 3; en esta fase no hay
  resultados observados y MUST NOT declararse ninguno como aprobado.
- Los integrantes del trabajo son Mauro Di Pietro, Renzo Victoria, Franco
  Sampieri y Tomas Gonzales. El trabajo no lleva legajos: el README los omite a
  propósito y no se inventan números.
- Los datos de ejemplo siguen siendo ficticios; las fechas `2026-10-01` y
  `2026-10-02` son ficticias.
- La comprobación del precio histórico se hará sobre una copia del proyecto o
  datos de prueba, como pide el PDF.
- Los importes del caso manual «dos unidades a 1500 y una a 2000» **no existen**
  en el catálogo actual (los precios van de 14.300 a 24.500); el caso se
  ejecutará con datos de prueba o en una copia con esos precios, y se registrará
  el resultado real observado. Ver D-11.
- No se releyó el repositorio git ni el historial de commits: el estado se
  verificó por inspección de archivos.
- No se ejecutó ninguna prueba en navegador en esta fase.

## Decisiones aprobadas

> Las decisiones D-01 a D-11 fueron confirmadas por el usuario. Se conserva el
> contexto de cada una y la alternativa que se había propuesto como default,
> ahora registrada como decisión confirmada.

### D-01. Claves separadas vs. una única clave

- **Pregunta:** ¿una clave por colección o una única clave con todo el estado?
- **Decisión confirmada:** claves separadas por colección, para poder modificar
  solo el catálogo de libros sin tocar ventas y para aislar fallos.
- **Impacto si se elige única:** habría que reescribir todo el estado en cada
  guardado y el cambio aislado de precio exigiría editar el objeto completo.

### D-02. Qué colecciones se persisten

- **Pregunta:** ¿solo `libros`, `clientes` y `ventas`, o también `editoriales`,
  `generos` y `autores`?
- **Decisión confirmada:** solo las tres primeras; editoriales, géneros y autores
  quedan fijos en `js/data.js` como catálogo de referencia.
- **Impacto si se persisten todas:** aumenta el esquema, la validación y el
  tamaño guardado; no lo pide el PDF.

### D-03. Nombre y esquema exactos de las claves

- **Pregunta:** ¿se aprueban `eltintero.libros.v1`, `eltintero.clientes.v1` y
  `eltintero.ventas.v1` con un array JSON como valor?
- **Decisión confirmada:** sí, con el esquema de la sección "Claves de
  `localStorage` y esquema".
- **Impacto si se prefiere un envoltorio:** cada valor pasaría a
  `{ version, actualizado, registros }`; cambia la validación y el instructivo
  de edición manual del README.

### D-04. Política ante datos corruptos

- **Pregunta:** ¿volver a los ejemplos completos, descartar solo la colección
  inválida o detener la carga con aviso?
- **Decisión confirmada:** descartar solo la colección inválida, sembrar sus
  ejemplos, conservar las demás y registrar el problema. Si la integridad
  referencial sigue fallando, restablecer las colecciones implicadas.
- **Impacto si se vuelve todo a ejemplos:** se pierden altas válidas de las
  otras colecciones; si se detiene la carga, la aplicación queda inutilizable.

### D-05. Indicador visible vs. `console.error`

- **Pregunta:** ¿se muestra un aviso visible de error de almacenamiento o solo
  se registra en consola?
- **Decisión confirmada:** solo `console.error`/`console.warn` controlado, sin
  banner visible; el README documenta el comportamiento.
- **Impacto si se agrega aviso visible:** requiere HTML/CSS nuevo y escapa al
  alcance de "sin cambios de diseño".

### D-06. Función de restablecimiento para pruebas

- **Pregunta:** ¿se expone `ElTintero.persistencia.restablecer()` por consola,
  sin botón visible?
- **Decisión confirmada:** sí, borra las claves y vuelve a sembrar; se documenta en
  el README para pruebas.
- **Impacto si se omite:** las pruebas de "primer inicio" y de datos corruptos
  requieren borrar las claves manualmente desde el navegador.

### D-07. Detección de "primer inicio"

- **Pregunta:** ¿la siembra se decide por clave ausente o por valor vacío?
- **Decisión confirmada:** por clave ausente; un `[]` guardado se respeta como
  colección vacía.
- **Impacto si se usa valor vacío:** borrar todos los libros desde consola
  volvería a sembrar ejemplos en la siguiente recarga, alterando el estado
  guardado.

### D-08. Dónde se registran los casos manuales

- **Pregunta:** ¿sección del README o `docs/pruebas-manuales.md` enlazado?
- **Decisión confirmada:** `docs/pruebas-manuales.md` con la tabla de los 8 casos,
  enlazado desde el README, que además incluye un resumen.
- **Impacto si va solo en el README:** el README crece; no se pierde ningún
  requisito.

### D-09. Autoría del trabajo

- **Decisión confirmada:** los integrantes son Mauro Di Pietro, Renzo Victoria,
  Franco Sampieri y Tomas Gonzales. No se usan legajos aunque el formato los
  mencione: el README incluye solo los nombres y aclara que el trabajo no lleva
  legajo.
- **Impacto:** el README cumple el "Formato de entrega" sin inventar datos.

### D-10. Fallo de escritura en `localStorage`

- **Pregunta:** si la escritura falla (cuota, modo privado, bloqueo), ¿se
  rechaza la mutación o se conserva en memoria?
- **Decisión confirmada:** conservar la mutación en memoria, registrar el error
  controlado y no bloquear la operación; el README lo documenta.
- **Impacto si se rechaza:** una venta válida podría perderse por un problema
  del navegador; además cambiaría el contrato de retorno existente.

### D-11. Ejecución del caso manual de venta 1500 / 2000

- **Pregunta:** el PDF exige una venta de 2 unidades a 1500 y 1 a 2000, pero
  ningún libro del catálogo tiene esos precios. ¿Cómo se ejecuta el caso?
- **Decisión confirmada:** en una copia de prueba del proyecto, ajustar los precios
  de dos libros de ejemplo a 1500 y 2000 (o sembrar datos de prueba), ejecutar la
  venta, registrar subtotales 3000 y 2000 y total 5000, y anotar el resultado
  real; luego restaurar la copia. No se modifica el catálogo definitivo.
- **Impacto si se usa el catálogo actual:** el caso no daría 3000/2000/5000 y no
  reproduciría el resultado esperado del PDF; habría que registrar la
  equivalencia con precios reales, como se hizo en el Ejercicio 5.

## Fuentes consultadas

- `docs/prompts/PROMPT6.md` (completo).
- `docs/Repaso Primer Parcial.pdf` (texto extraído con `pdftotext -layout`;
  páginas 1, 2, 5, 6 y 7).
- `openspec/config.yaml`; `openspec/specs/{datos-locales,historial,ventas}/spec.md`;
  `openspec/changes/archive/2026-10-22-ejercicio-5-venta-simulada-historial/`
  (`proposal.md`, `tasks.md`, `specs/**`).
- `js/data.js`, `js/catalogo.js`, `js/altas.js`, `js/ventas.js`,
  `js/historial.js`, `catalogo.html`, `libros.html`, `clientes.html`,
  `ventas.html`, `historial.html`, `index.html`.
- `openspec list --specs`; `openspec --version` (1.13.2).
