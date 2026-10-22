# PROMPT6 — Ejercicio 6 únicamente (copiar y pegar al orquestador)

> Pegá el bloque `text` de abajo tal cual al orquestador active-stack. Ya tiene todos los `{{...}}` de la plantilla reemplazados. Solo Ejercicio 6.

```text
@docs/Repaso Primer Parcial.pdf

## Rol

Actuá como arquitecto frontend senior, con experiencia en JavaScript nativo, persistencia con `localStorage`, verificación manual de aplicaciones web, documentación técnica de entregas y SDD, y responsabilidad sobre definir la especificación completa del Ejercicio 6, su plan de tareas y, solo tras mi aprobación, su implementación en JavaScript nativo y `README.md`.

## Metodología

- Metodología a utilizar: SDD con framework active-stack (flujo SPEC → PLAN → IMPLEMENTACIÓN, con openspec: `openspec/changes/<change>/proposal.md` + `tasks.md` + specs).
- Herramientas y convenciones: openspec CLI, convenciones del orquestador active-stack, JavaScript nativo (ES2020+, sin transpilación), scripts clásicos cargados con `defer`, archivos JS externos, `localStorage` del navegador, `README.md` en Markdown, apertura directa de los HTML en navegador sin npm ni servidor.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a la metodología elegida.
- No escribas código, README definitivo ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles, informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: ProgIII-FrontEnd-PrimerParcial — TPI frontend de una librería "El Tintero" (UTN, Programación III).
- Propósito y usuarios: librería que presenta su catálogo y registra libros, clientes y ventas. Usuarios: docente evaluador y estudiantes que maquetan el frontend. Solo frontend simulado en navegador.
- Ubicación o repositorio: repo actual de `ProgIII-FrontEnd-PrimerParcial`.
- Estado actual verificado: Ejercicios 1 a 5 completados y archivados en `openspec/changes/archive/` (`2026-10-19-ejercicio-1-estructura-pantallas-html`, `2026-10-19-ejercicio-2-presentacion-css-adaptable`, `2026-10-20-ejercicio-3-datos-locales-catalogo-filtro`, `2026-10-20-ejercicio-4-altas-libros-clientes`, `2026-10-22-ejercicio-5-venta-simulada-historial`). Existen `index.html`, `catalogo.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `css/styles.css` y `js/data.js`, `js/catalogo.js`, `js/altas.js`, `js/ventas.js`, `js/historial.js`. Cada HTML carga `<script defer src="js/data.js">` antes que el script de su vista; `index.html` no carga scripts y `assets/` solo contiene `.gitkeep`.
- Modelo verificado en `js/data.js`: `ElTintero.datos` contiene `editoriales` (3), `generos` (3), `autores` (5), `libros` (6), `clientes` (3) y `ventas` (2 ventas de ejemplo ficticias con fecha `2026-10-01` y `2026-10-02`). `ElTintero.consultas` expone `obtenerLibros`, `obtenerClientes`, `buscarEditorialPorId`, `buscarGeneroPorId`, `buscarAutoresPorIds`, `buscarLibroPorId`, `buscarClientePorId`, `buscarVentaPorId`, `normalizarIsbn`, `normalizarEmail`, `existeLibroConIsbn`, `existeClienteConEmail`, `formatearPrecio` (sin decimales), `formatearImporte` (dos decimales) y `verificarIntegridad`. `ElTintero.registros` expone `generarIdLibro`, `generarIdCliente`, `generarIdVenta`, `registrarLibro`, `registrarCliente` y `registrarVenta`. `registrarVenta` valida cliente existente, renglones con libro existente, cantidades enteras mayores que cero y libros no repetidos; al confirmar copia `tituloLibro`, `precioUnitario` y `subtotal` históricos y calcula `total` con `redondear2`. El modelo está declarado explícitamente como "en memoria y sin persistencia".
- Lo que falta: **no hay `localStorage` ni `sessionStorage`**, no existe `README.md` en la raíz, no hay casos manuales registrados, no hay carpeta de documentación de pruebas y no existe ningún mecanismo de carga inicial ni de recuperación entre recargas. Las vistas (`catalogo.js`, `altas.js`, `ventas.js`, `historial.js`) leen `ElTintero.datos` al inicializar y se ejecutan inmediatamente con `defer`, después de `data.js`; por eso la carga desde `localStorage` debe ocurrir dentro de `js/data.js` antes de que esas vistas rendericen.
- Fuentes de requisitos: `docs/Repaso Primer Parcial.pdf` — obligatorias para este change: sección "Ejercicio 6 · 6. Persistencia, verificación y documentación" (p. 5-6), "Contexto y alcance" (p. 1), "Organización del trabajo — Etapa 2" (p. 2), "Criterios de evaluación — 6. Cierre: 10 = persistencia 4 + pruebas manuales registradas 3 + documentación y entrega 3" (p. 7) y "Formato de entrega" (p. 7). Como dependencia, se toman el modelo, las consultas, las altas y las ventas de los Ejercicios 3, 4 y 5 ya implementados. Si hay conflicto entre tu propuesta y el PDF, vale el PDF.
- Tecnologías y dependencias permitidas: JavaScript nativo (ES2020+), `localStorage`, `JSON.stringify`/`JSON.parse`, `try/catch`, `ElTintero.datos`/`ElTintero.consultas`/`ElTintero.registros` existentes, archivos externos en `js/`, `defer`, Markdown para `README.md`.
- Tecnologías y dependencias excluidas: librerías, frameworks y CDNs de JavaScript o CSS; `fetch`/AJAX; API, base de datos, servidor, backend; `sessionStorage`, IndexedDB y cookies; service workers; módulos ES (`type="module"`) por incompatibilidad con `file://`; herramientas de build o test automatizado; `innerHTML`, `insertAdjacentHTML`, `eval` o `document.write` con datos; cualquier pantalla nueva de edición de precios o de administración del almacenamiento.
- Punto de entrada o componente afectado: `js/data.js` (carga inicial, hidratación y guardado), `js/altas.js`, `js/ventas.js` y `js/historial.js` (puntos de guardado después de mutar), `README.md` nuevo en la raíz y, si hace falta, ajustes mínimos de HTML justificados en el SPEC. No se rediseña CSS ni se modifican vistas fuera de lo imprescindible.
- Condiciones del entorno: apertura directa con doble clic (`file://`), sin npm, sin build, sin servidor. El almacenamiento es por navegador, perfil y ubicación de apertura (incluido el origen `file://`); no se comparte entre usuarios ni entre equipos.

## Alcance estricto

### Objetivo de esta entrega

Especificar (Fase 1), planificar (Fase 2 tras aprobación) e implementar solo tras autorización la persistencia de libros, clientes y ventas en `localStorage`, con carga de los datos de ejemplo solo en el primer inicio y recuperación de los registros guardados sin duplicarlos, junto con un `README.md` que documente la entrega, el funcionamiento y los límites del almacenamiento, la ubicación y estructura de los datos guardados y el resultado observado de los casos manuales exigidos.

### Incluido

- Persistencia en `localStorage` de `libros`, `clientes` y `ventas` (con sus renglones y precios históricos). Editoriales, géneros y autores se conservan como catálogo de referencia fijo salvo que el SPEC justifique otra cosa.
- Carga inicial: si no hay datos guardados, se usan los ejemplos actuales de `js/data.js` y se guardan; si hay datos guardados, se recuperan y **no** se vuelven a agregar los ejemplos ni se duplican ventas.
- Guardado después de cada mutación existente: `registrarLibro`, `registrarCliente` y `registrarVenta` deben dejar el estado persistido coherente con `ElTintero.datos`, sin que la capa de vista llame a `localStorage`.
- Manejo de datos guardados inválidos, incompletos o de una versión anterior: el SPEC define la política (por ejemplo, ignorar y volver a los ejemplos, o descartar solo la colección inválida), siempre sin romper la aplicación, sin errores de consola no controlados y sin duplicar registros.
- Clave(s) de almacenamiento versionada(s), con nombre y estructura documentados en el README y en el SPEC. El PDF exige poder modificar **solo** el precio de un libro dentro del catálogo guardado sin tocar las ventas guardadas: la estructura debe permitirlo y quedar documentada.
- `README.md` en la raíz con: integrantes del trabajo; pasos para abrir `index.html` sin npm; navegación entre vistas; funcionalidades implementadas y pendientes; ubicación de los datos iniciales; funcionamiento y límites de `localStorage` (depende del navegador, del perfil y de la ubicación de apertura, no se comparte entre usuarios); resultados de los casos manuales; procedencia de imágenes ajenas (si no se usan imágenes, debe decirlo explícitamente).
- Registro de los 8 casos manuales exigidos por el PDF, con resultado esperado y resultado observado, ejecutados realmente:
  1. Búsqueda con parte del título en mayúsculas; luego búsqueda vacía y texto inexistente → coincidencias sin distinguir mayúsculas, catálogo completo y mensaje sin resultados.
  2. Alta de libro con ISBN existente y luego con ISBN nuevo → el duplicado se rechaza; el válido aparece en catálogo y en la selección de venta.
  3. Alta de cliente con email inválido, email existente en mayúsculas y email nuevo → se rechazan los dos primeros; el nuevo aparece en el listado y en la selección de venta.
  4. Venta sin cliente, cantidad cero, negativa o decimal y libro repetido → no se confirma; el duplicado no crea otro renglón.
  5. Venta válida de dos unidades a 1500 y una a 2000 → subtotales 3000 y 2000, total 5000, detalle conservado en el historial.
  6. Venta confirmada y cambio exclusivo del precio de catálogo guardado en una copia de prueba del proyecto → tras recargar, el historial conserva precio unitario, subtotales y total confirmados.
  7. Recarga después de altas y venta → se recuperan los datos sin duplicar ejemplos ni ventas.
  8. Navegación por teclado y anchos de 320 px y 1280 px → foco visible, controles utilizables y tabla con desplazamiento propio si lo necesita.
- Verificación de integridad tras cargar desde `localStorage` y tras cada guardado, registrando evidencia de que `verificarIntegridad()` no reporta errores con los datos de ejemplo ni después de altas y ventas válidas.
- Ganchos/funciones de persistencia documentados y centralizados en `js/data.js`, reutilizables, sin cambiar contratos existentes ni ids del HTML.

### Excluido

- Backend, API, base de datos, servidor, login real, sincronización entre usuarios o entre dispositivos, cuentas, exportación/importación de archivos.
- `sessionStorage`, IndexedDB, cookies, Cache API o service workers.
- Edición, anulación o eliminación de ventas confirmadas; edición de precios desde una pantalla; administración del almacenamiento desde la interfaz; botón de "restablecer datos" visible al usuario salvo que el SPEC lo justifique y se apruebe.
- Corrección de precios históricos ya guardados, recálculo retroactivo de ventas o migraciones de datos reales.
- Cambios de diseño, CSS, semántica, navegación o de la lógica de negocio de los Ejercicios 1 a 5 más allá de los puntos de guardado y carga.
- Tests automatizados, npm, build, frameworks de testing, CI.
- Documentación ajena a la entrega (manual de usuario extenso, docs de arquitectura fuera del README).

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

Completá únicamente los grupos aplicables y asigná un identificador estable a cada requisito.

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Carga inicial | En un navegador/perfil sin datos guardados, `js/data.js` inicializa `ElTintero.datos` con los ejemplos actuales (6 libros, 3 clientes, 2 ventas) y los persiste. En aperturas posteriores, recupera exactamente los registros guardados y no vuelve a agregar los ejemplos ni duplica ventas, aunque la página se recargue varias veces. |
| R-02 | Persistencia de mutaciones | `registrarLibro`, `registrarCliente` y `registrarVenta` persisten el estado resultante en `localStorage` además de mutar `ElTintero.datos`. Las altas y ventas confirmadas sobreviven a la recarga y a la navegación entre `libros.html`, `clientes.html`, `ventas.html` e `historial.html`. La capa de vista no accede a `localStorage` directamente. |
| R-03 | Estructura y versionado | Las claves de `localStorage` tienen nombre explícito y versión, y el SPEC y el README documentan su ubicación y estructura. El catálogo de libros guardado puede modificarse de forma aislada (solo el precio de un libro) sin alterar ni borrar las ventas guardadas, para reproducir la comprobación del PDF. |
| R-04 | Integridad y recuperación | Si los datos guardados faltan, están corruptos, tienen JSON inválido o no cumplen el esquema, la aplicación no rompe, informa o registra el problema de forma controlada y aplica la política aprobada en el SPEC (volver a ejemplos o descartar solo la parte inválida) sin duplicar registros. `verificarIntegridad()` devuelve `[]` con los ejemplos y después de altas y ventas válidas. |
| R-05 | Historial inmutable | El detalle de una venta recuperada desde `localStorage` conserva `precioUnitario`, `subtotal` y `total` confirmados aunque el precio actual del libro guardado se modifique después y la página se recargue. No se recalcula el historial desde el catálogo actual. |
| R-06 | README | `README.md` en la raíz incluye integrantes, pasos para abrir `index.html` sin npm, navegación entre vistas, funcionalidades implementadas y pendientes, ubicación de los datos iniciales, funcionamiento y límites de `localStorage`, ubicación y estructura de los datos guardados, procedencia de imágenes ajenas (o declaración de que no se usan) y los resultados de los casos manuales. |
| R-07 | Casos manuales | Los 8 casos del PDF se ejecutan realmente y se registran con caso, resultado esperado, resultado observado y estado (aprobado/fallido/pendiente). Si un caso falla, se registra el comportamiento real; no se marca como aprobado sin ejecutarlo. |
| R-08 | Calidad y seguridad | Todo dato proveniente de `localStorage` o del modelo se inserta con `textContent`/`createElement`; no se usa `innerHTML`, `insertAdjacentHTML`, `eval` ni `document.write` con datos. No hay errores en consola al abrir ni al operar. No se persisten datos inválidos. No se guardan datos sensibles reales (los datos son ficticios). |
| R-09 | Convenciones | JavaScript en archivos externos de `js/`, cargados con `<script defer>` en orden de dependencia (`data.js` antes que el script de la vista); sin JS inline, sin `type="module"`, sin librerías ni frameworks; IIFE con `"use strict"` y namespace `ElTintero`; nombres en español consistentes con el dominio (`persistencia`, `guardar`, `cargar`, `sembrar`, `venta`, `renglón`); 2 espacios de indentación; se conservan los `id` y contratos existentes. |
| R-10 | Entrega | La estructura de archivos se mantiene apta para entregar un comprimido con `index.html`, los demás HTML, CSS, JS, recursos locales y `README.md`, sin dependencias instaladas ni herramientas de compilación. Las funcionalidades pendientes quedan declaradas en el README. |

Datos de ejemplo, si se necesitan: se reutilizan los ya existentes en `js/data.js` (3 editoriales, 3 géneros, 5 autores, 6 libros, 3 clientes y 2 ventas ficticias con fechas `2026-10-01` y `2026-10-02`). No se inventan datos reales; cualquier dato nuevo para pruebas debe ser ficticio y declararse como tal.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná las fuentes y el estado existente dentro del alcance autorizado antes de definir la solución.

Generá `openspec/changes/ejercicio-6-persistencia-verificacion-documentacion/proposal.md` (con las specs que el flujo openspec requiera, por ejemplo `persistencia`, `documentacion` y una actualización de `datos-locales`/`historial`) con:

1. Problema, objetivo y resultado esperado.
2. Contexto verificado y referencias concretas a las fuentes consultadas.
3. Alcance incluido y exclusiones explícitas.
4. Requisitos identificados y escenarios observables, incluidos los casos límite relevantes (primer inicio sin datos, segunda apertura, recarga repetida, JSON corrupto, clave ausente, colección vacía, venta con precio modificado después, altas y venta antes de recargar).
5. Estructura o componentes propuestos, interfaces y datos necesarios, con el detalle proporcional al alcance. Incluir al menos: claves de `localStorage` y su esquema; funciones de carga inicial, hidratación, guardado y siembra (firmas y retornos); punto exacto del guardado dentro de `registrarLibro`, `registrarCliente` y `registrarVenta`; estrategia para no duplicar ejemplos; política ante datos inválidos; y cómo se documenta la ubicación del catálogo guardado para poder modificar solo un precio.
6. Estados y manejo de errores aplicables (sin almacenamiento, almacenamiento lleno o bloqueado, JSON inválido, esquema inválido, datos parciales, navegación entre páginas).
7. Restricciones técnicas y convenciones que condicionan la solución (`file://`, scripts clásicos, sin `fetch`, sin backend, almacenamiento por navegador/perfil/ubicación).
8. Criterios de aceptación vinculados a los requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta.

Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta. Decisiones esperadas: claves separadas por colección (`eltintero.libros.v1`, `eltintero.clientes.v1`, `eltintero.ventas.v1`) vs. una única clave con todo el estado; qué se persiste (solo libros/clientes/ventas vs. también editoriales/géneros/autores); nombre y esquema exactos de las claves; política ante datos corruptos (volver a ejemplos vs. descartar solo la colección inválida vs. detener la carga con aviso); si se agrega un indicador visible de error de almacenamiento o solo `console.error`; si se expone una función de restablecimiento para pruebas (por consola o `ElTintero.persistencia.restablecer()`) sin botón visible; si los ejemplos se siembran en el primer inicio y cómo se detecta "primer inicio" (clave ausente vs. valor vacío); cómo se registran los resultados de los casos manuales (sección del README vs. `docs/pruebas-manuales.md` enlazado desde el README); y autoría del trabajo para el README (nombres reales). Si no respondo, usá `{{DATO_PENDIENTE: ...}}` y proponé un default sin implementarlo.

Al terminar, presentá la especificación para revisión y detenete. No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar, generá `openspec/changes/ejercicio-6-persistencia-verificacion-documentacion/tasks.md` con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar.

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación y mi autorización para implementar.

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá convenciones: `const`/`let`, funciones nombradas y acotadas, `"use strict"` e IIFE/namespace `ElTintero` para no contaminar el global, 2 espacios de indentación, nombres en español consistentes con el dominio (persistencia, guardar, cargar, sembrar, venta, renglón, precioUnitario, subtotal, total).
- Centralizá toda lectura/escritura de `localStorage` en `js/data.js`, dentro de `ElTintero`; no dupliques claves ni lógica de serialización en las vistas. Reutilizá `ElTintero.consultas` y `ElTintero.registros`; no cambies sus contratos existentes.
- Asegurá el orden de carga: la hidratación desde `localStorage` debe completarse dentro de `data.js`, antes de que `catalogo.js`, `altas.js`, `ventas.js` e `historial.js` rendericen con `defer`.
- Respetá verificación manual en navegador por `file://`: abrir `index.html` con doble clic, revisar consola, recorrer las vistas, ejecutar los 8 casos manuales del PDF y registrar el resultado observado real de cada uno. No hay tests automatizados ni servidor en este change.
- Para el caso del precio histórico: trabajar sobre una copia del proyecto o sobre datos de prueba, confirmar una venta, anotar sus importes, modificar **solo** el precio del libro dentro del catálogo guardado en `localStorage` (sin tocar ni borrar las ventas guardadas), recargar y verificar que el detalle del historial conserva `precioUnitario`, subtotales y total. Documentar en el README cómo reproducir esa comprobación (ubicación y estructura de los datos guardados). No se exige una pantalla para editar precios.
- Verificá explícitamente que tras altas y venta, una recarga no duplica libros, clientes, ventas ni ejemplos, y que `verificarIntegridad()` devuelve `[]`.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá las modificaciones de `js/data.js` (y las mínimas de vistas o HTML justificadas), el `README.md` nuevo y, si se aprobó, el documento de registro de pruebas, junto con un resumen de cambios, comprobaciones realizadas, resultados de los 8 casos, limitaciones y pendientes.

## Criterios de aceptación

Reemplazá los criterios editables por condiciones observables y vinculalas a los requisitos correspondientes.

- [ ] CA-01 — En un perfil sin datos, la primera apertura muestra los ejemplos actuales y los guarda; la segunda apertura y las recargas posteriores recuperan los mismos registros sin duplicar libros, clientes, ventas ni ejemplos (R-01).
- [ ] CA-02 — Un libro y un cliente dados de alta, y una venta confirmada, sobreviven a la recarga y aparecen en `catalogo.html`, `libros.html`, `clientes.html` e `historial.html` tras navegar entre páginas (R-02).
- [ ] CA-03 — Las claves y el esquema de `localStorage` están documentados; modificar solo el precio de un libro en el catálogo guardado no altera ni borra las ventas guardadas (R-03).
- [ ] CA-04 — Con JSON inválido, clave ausente o datos que no cumplen el esquema, la aplicación no rompe, no duplica registros y aplica la política aprobada; `verificarIntegridad()` devuelve `[]` con los ejemplos y después de altas y ventas válidas (R-04).
- [ ] CA-05 — Tras confirmar una venta, modificar el precio del libro en el catálogo guardado y recargar, el historial muestra el `precioUnitario`, los subtotales y el total confirmados (R-05).
- [ ] CA-06 — `README.md` contiene integrantes, pasos de apertura sin npm, navegación, funcionalidades implementadas y pendientes, ubicación de los datos iniciales, funcionamiento y límites de `localStorage`, ubicación y estructura de los datos guardados, procedencia de imágenes y resultados de los casos manuales (R-06).
- [ ] CA-07 — Los 8 casos manuales del PDF se ejecutaron y están registrados con resultado esperado, observado y estado; ningún caso se marca aprobado sin evidencia (R-07).
- [ ] CA-08 — No se usa `innerHTML` con datos; no hay errores en consola al abrir ni al operar; no se persisten datos inválidos (R-08).
- [ ] CA-09 — Apertura directa por `file://` funciona sin servidor, npm ni librerías; los scripts siguen siendo externos, clásicos, con `defer` y `data.js` carga antes que la vista; los contratos e ids existentes se conservan (R-09).
- [ ] CA-10 — La estructura permite entregar el comprimido con HTML, CSS, JS, recursos y `README.md`, sin dependencias ni build; los pendientes quedan declarados (R-10).
- [ ] Se cubre todo el alcance aprobado y no se incorpora trabajo excluido.
- [ ] Se respetan las tecnologías, dependencias y convenciones permitidas.
- [ ] Las comprobaciones exigidas se ejecutaron y sus resultados se informan con evidencia.
- [ ] Se distinguen los controles aprobados, fallidos, omitidos y pendientes; ningún control no ejecutado se presenta como aprobado.
- [ ] Los supuestos, placeholders pendientes y limitaciones quedan identificados.

## Restricciones anti-alucinación

- No inventes requisitos, funcionalidades, archivos existentes, APIs, contratos, credenciales, datos reales, integrantes del trabajo ni resultados de comprobaciones.
- Diferenciá los hechos verificados, los supuestos y las propuestas. Atribuí los hechos a las fuentes consultadas cuando corresponda.
- Si falta un dato no bloqueante, usá `{{DATO_PENDIENTE: descripción}}` y declaralo como pendiente. No lo reemplaces con un valor que parezca real.
- Si el dato faltante afecta el alcance, una decisión esencial o la validez de la solución, preguntá antes de avanzar con el trabajo afectado.
- No afirmes haber leído una fuente, ejecutado una herramienta o validado un resultado si no ocurrió. Si no tenés acceso, informalo.
- Usá datos ficticios solo cuando estén autorizados y señalalos como ejemplos.
- Ante requisitos contradictorios, señalá la contradicción y pedí una decisión; no elijas silenciosamente.
- No declares completa la entrega si quedan criterios sin verificar. Enumerá los pendientes y sus motivos.

## Instrucción de inicio

Empezá ahora únicamente por la **Fase 1 — SPEC**. Generá el documento de especificación indicado, presentalo para revisión y esperá mi respuesta. No avances automáticamente a PLAN ni IMPLEMENTACIÓN. Antes de implementar, solicitá mi aprobación explícita de la especificación y mi autorización para iniciar la Fase 3.
```
