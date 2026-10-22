# PROMPT5 — Ejercicio 5 únicamente (copiar y pegar al orquestador)

> Pegá el bloque `text` de abajo tal cual al orquestador active-stack. Ya tiene todos los `{{...}}` de la plantilla reemplazados. Solo Ejercicio 5.

```text
@docs/Repaso Primer Parcial.pdf

## Rol

Actuá como arquitecto frontend senior, con experiencia en JavaScript nativo, composición de ventas, cálculos monetarios, manipulación del DOM, historial inmutable y SDD, y responsabilidad sobre definir la especificación completa del Ejercicio 5, su plan de tareas y, solo tras mi aprobación, su implementación en JavaScript nativo.

## Metodología

- Metodología a utilizar: SDD con framework active-stack (flujo SPEC → PLAN → IMPLEMENTACIÓN, con openspec: `openspec/changes/<change>/proposal.md` + `tasks.md` + specs).
- Herramientas y convenciones: openspec CLI, convenciones del orquestador active-stack, JavaScript nativo (ES2020+, sin transpilación), scripts clásicos cargados con `defer`, archivos JS externos, apertura directa de los HTML en navegador sin npm ni servidor.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a la metodología elegida.
- No escribas código ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles, informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: ProgIII-FrontEnd-PrimerParcial — TPI frontend de una librería "El Tintero" (UTN, Programación III).
- Propósito y usuarios: librería que presenta su catálogo y registra libros, clientes y ventas. Usuarios: docente evaluador y estudiantes que maquetan el frontend. Solo frontend simulado en navegador.
- Ubicación o repositorio: repo actual de `ProgIII-FrontEnd-PrimerParcial`.
- Estado actual verificado: Ejercicios 1 a 4 completados y archivados en `openspec/changes/archive/` (`2026-10-19-ejercicio-1-estructura-pantallas-html`, `2026-10-19-ejercicio-2-presentacion-css-adaptable`, `2026-10-20-ejercicio-3-datos-locales-catalogo-filtro`, `2026-10-20-ejercicio-4-altas-libros-clientes`). Existen `index.html`, `catalogo.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `css/styles.css`, `js/data.js`, `js/catalogo.js` y `js/altas.js`. `js/data.js` expone `ElTintero.datos` con 3 editoriales, 3 géneros, 5 autores, 6 libros y 3 clientes (ids numéricos); **no existe la colección `ventas` ni ninguna lógica de ventas**. `ElTintero.consultas` incluye `obtenerLibros`, `obtenerClientes`, `buscarEditorialPorId`, `buscarGeneroPorId`, `buscarAutoresPorIds`, `buscarLibroPorId`, `buscarClientePorId`, `normalizarIsbn`, `normalizarEmail`, `existeLibroConIsbn`, `existeClienteConEmail`, `formatearPrecio` (`Intl.NumberFormat('es-AR')` sin decimales) y `verificarIntegridad`. `ElTintero.registros` incluye `generarIdLibro`, `generarIdCliente`, `registrarLibro` y `registrarCliente`. `ventas.html` sigue siendo una maqueta estática y no carga scripts: `#ventas-cliente` y `#ventas-libro` tienen opciones hardcodeadas (2 clientes y 3 libros), `#ventas-cantidad` es `type="number" min="1" value="1"`, `#venta-renglones tbody` tiene una fila estática, `#ventas-total` vale `$18.500` hardcodeado, existen `#ventas-mensaje-ok` y `#ventas-mensaje-error` ocultos con `aria-live="polite"`, no hay `<form>`, los botones «Agregar renglón» y «Confirmar venta» no tienen `id` y no existe un contenedor de renglones vacío. `historial.html` tampoco carga scripts: `#historial-tabla` tiene 2 filas estáticas (`data-venta-id` 1 y 2), `#historial-vacio` existe oculto y hay dos secciones estáticas `#historial-detalle-1` y `#historial-detalle-2` con sus tablas de renglones. No hay `localStorage`, `sessionStorage`, README ni casos manuales (Ej. 6). Verificar el estado real antes de especificar; si difiere, informalo.
- Fuentes de requisitos: `docs/Repaso Primer Parcial.pdf` — obligatorias para este change: sección "Ejercicio 5 · 5. Venta simulada e historial" (p. 5), "Contexto y alcance" (p. 1), "Organización del trabajo — Etapa 2" (p. 2), "Criterios de evaluación" (5. Ventas: 20 = composición y validaciones 8 + cálculos 5 + confirmación e historial inmutable 7, p. 7) y "Formato de entrega" (p. 7). Como dependencia, se toman el modelo y las consultas del Ejercicio 3 y las altas del Ejercicio 4 ya implementados. Si hay conflicto entre tu propuesta y el PDF, vale el PDF.
- Tecnologías y dependencias permitidas: JavaScript nativo (ES2020+), `ElTintero.datos`, `ElTintero.consultas` y `ElTintero.registros` existentes, arrays/objetos, `Set`, `Array.prototype.find/some/filter/reduce`, `Number.isInteger`, `Math.round`, `Date`, `Intl.NumberFormat`, `Intl.DateTimeFormat`, `addEventListener`, `preventDefault`, `createElement`, `textContent`, `hidden`, `aria-live`, `form.elements`, archivos externos en `js/`, `defer`.
- Tecnologías y dependencias excluidas: librerías, frameworks y CDNs de JavaScript (jQuery, React, Vue, etc.) o CSS; `fetch`/AJAX; API, base de datos, servidor, backend; `localStorage`, `sessionStorage`, IndexedDB y cookies (Ej. 6); edición, anulación o eliminación de ventas confirmadas desde la interfaz; gestión de stock, cobros, facturación, impuestos o descuentos; altas, edición o borrado de libros y clientes (Ej. 4 ya cerrado); README definitivo y casos manuales del Ej. 6; módulos ES (`type="module"`) por incompatibilidad con `file://`; `innerHTML`, `insertAdjacentHTML`, `eval` o `document.write` con datos.
- Punto de entrada o componente afectado: `ventas.html` e `historial.html` (se les agregan etiquetas `<script defer>` y los ajustes mínimos de controles, ids y contenedores de estado justificados en el SPEC); `js/data.js` (se amplía con la colección `ventas`, sus consultas y la mutación de confirmación); archivos JS nuevos de vista en `js/`. No se rediseña CSS ni se modifican las demás vistas más allá de lo estrictamente necesario.
- Condiciones del entorno: apertura directa de `ventas.html` e `historial.html` con doble clic (`file://`), sin npm, sin build, sin servidor.

## Alcance estricto

### Objetivo de esta entrega

Especificar (Fase 1), planificar (Fase 2 tras aprobación) e implementar solo tras autorización la composición de una venta simulada —cliente existente, renglones con libros existentes y cantidades enteras mayores que cero—, el cálculo de subtotales y total con dos decimales, y la confirmación de la venta con precio unitario histórico, junto con un historial que muestre las ventas registradas y permita consultar sus renglones sin editarlas ni eliminarlas.

### Incluido

- Poblar `#ventas-cliente` desde `ElTintero.datos.clientes` y `#ventas-libro` desde `ElTintero.datos.libros` al cargar `ventas.html`, con el `id` numérico como `value`, el nombre o título como texto y una opción inicial vacía «Seleccionar cliente» / «Seleccionar libro»; se retiran las opciones hardcodeadas.
- Composición de una venta en memoria: seleccionar un cliente existente y agregar al menos un renglón con un libro existente y una cantidad entera mayor que cero.
- Renglones con libro, cantidad, precio unitario, subtotal y acciones para cambiar la cantidad y quitar el renglón antes de confirmar. El precio unitario mostrado en la composición se obtiene del libro actual; al confirmar se copia como valor histórico.
- Rechazo de cantidades inválidas: vacías, no numéricas, no enteras, cero o negativas; el renglón inválido no se agrega y se muestra un mensaje de texto.
- Libros repetidos dentro de la misma venta: no se crea un segundo renglón; se actualiza la cantidad del renglón existente o se informa el duplicado, según la decisión que se apruebe en la Fase 1.
- Cálculo de subtotal como cantidad por precio unitario y de total como suma de subtotales; ambos se recalculan al agregar, cambiar la cantidad o quitar un renglón; los importes de venta se presentan con dos decimales.
- Impedir la confirmación de una venta sin cliente, sin renglones o con cantidades inválidas, con mensaje de texto y sin registrar nada.
- Confirmación: registrar en `ElTintero.datos.ventas` una venta con identificador único, fecha, cliente (id y nombre descriptivo), renglones y total. Cada renglón confirmado guarda `libroId`, título descriptivo, cantidad, `precioUnitario` copiado en ese momento y subtotal; el historial no vuelve a obtener el precio desde el catálogo actual.
- Limpieza del formulario de venta después de una confirmación correcta (cliente, libro, cantidad, renglones y total) y mensaje de resultado.
- Historial renderizado desde `ElTintero.datos.ventas` al cargar `historial.html`, sin filas estáticas, con columnas identificador, fecha, cliente y total, y acceso al detalle de los renglones de cada venta (libro, cantidad, precio unitario y subtotal).
- Estado de historial vacío (`#historial-vacio`) cuando no hay ventas; el historial no ofrece editar ni eliminar ventas confirmadas.
- Mensajes de éxito y de rechazo con texto, alternancia correcta de `hidden`, respeto de `aria-live` y sin mensajes contradictorios simultáneos.
- Centralización en `js/data.js` de la colección `ventas`, la generación de su id, la consulta por id y la mutación `registrarVenta`, sin que la capa de vista mute los arrays directamente.
- Funciones/API documentadas en el SPEC para que el Ejercicio 6 persista ventas y reutilice el historial sin volver a cambiar los contratos ni los `id` del HTML.

### Excluido

- Todo el Ejercicio 6: `localStorage`/`sessionStorage`/IndexedDB, persistencia entre recargas o entre páginas, recuperación/duplicación de datos, README definitivo, casos manuales y comprobación guiada del precio histórico con almacenamiento del navegador.
- Persistencia de la venta confirmada al navegar de `ventas.html` a `historial.html`: sin el Ej. 6, cada carga de página reinicia los datos en memoria. La limitación debe documentarse; no se implementa persistencia ni se simula con almacenamiento del navegador.
- Editar, anular o eliminar ventas confirmadas; editar precios, renglones o totales desde el historial; reprocesar una venta.
- Gestión de stock, disponibilidad, cobros, pagos, facturación fiscal, impuestos, descuentos, recargos o envíos.
- Altas, modificaciones o bajas de libros, clientes, editoriales, géneros o autores (Ej. 4 ya cerrado); CRUD de cualquier entidad.
- Renderizado dinámico de Catálogo, Libros y Clientes más allá de lo ya existente.
- Uso de `fetch`, APIs, backend, frameworks, librerías, CDNs o módulos ES.
- Cambios de diseño/CSS, de estructura semántica o de navegación ajenos a esta entrega (solo se agregan `<script>`, ids de botones, controles de cantidad por renglón, contenedores de estado y, si se aprueba, un `form` de venta con `novalidate`).

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

Completá únicamente los grupos aplicables y asigná un identificador estable a cada requisito.

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Selección y renglones | `#ventas-cliente` y `#ventas-libro` se pueblan desde `ElTintero.datos` al cargar, con el `id` como `value`, el nombre/título como texto y una opción inicial vacía; se eliminan las opciones hardcodeadas. Un renglón válido exige un libro existente y una cantidad entera mayor que cero, y se muestra con libro, cantidad, precio unitario y subtotal. |
| R-02 | Validación de composición | Se rechazan sin agregar renglón: libro vacío o inexistente, cantidad vacía, no numérica, no entera, cero o negativa, y libro ya presente en la venta (según la política aprobada: rechazar con mensaje o actualizar la cantidad existente). Los errores se muestran como texto y no se pierde la selección válida ya cargada. |
| R-03 | Cálculos | El subtotal de cada renglón es cantidad por precio unitario y el total es la suma de los subtotales; ambos se recalculan al agregar, cambiar la cantidad o quitar un renglón. Los importes de venta se presentan con exactamente dos decimales, redondeando a dos decimales para evitar artefactos de coma flotante. |
| R-04 | Confirmación | Se impide confirmar sin cliente, sin renglones o con cantidades inválidas, mostrando un mensaje de texto y sin registrar nada. Una confirmación válida agrega a `ElTintero.datos.ventas` una venta con id único, fecha, `clienteId`, nombre descriptivo del cliente, renglones (con `libroId`, título descriptivo, cantidad, `precioUnitario` histórico y subtotal) y total; luego limpia el formulario, muestra el mensaje de éxito y no deja mensajes de error contradictorios. |
| R-05 | Historial | `historial.html` renderiza `#historial-tabla` desde `ElTintero.datos.ventas` al cargar, sin filas estáticas, con identificador, fecha, cliente y total, y permite consultar los renglones de cada venta (libro, cantidad, precio unitario y subtotal). El detalle usa los valores almacenados en la venta, no el precio actual del catálogo. `#historial-vacio` se muestra si no hay ventas. No existen controles para editar ni eliminar ventas. |
| R-06 | Mensajes y estados | Los mensajes de éxito y de rechazo son de texto, se alternan con `hidden` y `aria-live="polite"`, y nunca se muestran a la vez; ante un rechazo se conservan los datos de la composición para corregirlos. Se distingue el estado de venta sin renglones del historial vacío. |
| R-07 | Calidad y seguridad | Títulos, nombres, fechas, importes y cualquier dato se insertan con `textContent`/`createElement`; no se usa `innerHTML`, `insertAdjacentHTML`, `eval` ni `document.write` con datos; no hay errores en consola al abrir ni al operar; los datos inválidos nunca se agregan al modelo. `verificarIntegridad()` se amplía para validar las ventas y sigue devolviendo `[]` con los datos de ejemplo y después de confirmar ventas válidas. |
| R-08 | Convenciones | JavaScript en archivos externos de `js/`, cargados con `<script defer>` en orden de dependencia (`data.js` antes que el script de la vista); sin JS inline, sin `type="module"`, sin librerías ni frameworks; IIFE con `"use strict"` y namespace `ElTintero`; se reutilizan `ElTintero.consultas`, `formatearPrecio` y las búsquedas por id; nombres en español consistentes con el dominio; se conservan los `id` existentes (`#venta-renglones`, `#ventas-total`, etc.). |
| R-09 | Separación y preparación futura | La colección `ventas`, la generación de id, la búsqueda por id y la mutación `registrarVenta` se centralizan en `js/data.js` ampliando `ElTintero`; la capa de vista no muta los arrays directamente. El SPEC documenta el esquema de venta y renglón, las firmas, los retornos y los ganchos que el Ej. 6 reutilizará para persistir sin cambiar el HTML ni los contratos; no se implementa persistencia ni edición. |
| R-10 | Interfaz y accesibilidad | Se conservan los `label` de cliente, libro y cantidad; los botones describen su acción; la tabla de renglones conserva `thead` y `th scope`; los controles de cambio de cantidad y de quitar renglón son utilizables con teclado y tienen nombre accesible; el total se anuncia en `#ventas-total` dentro de `#ventas-resumen`; no se rompe el diseño adaptable existente. |

Datos de ejemplo, si se necesitan: se incorporan al modelo al menos 2 ventas ficticias coherentes con los datos existentes (por ejemplo, las 2 ventas que hoy están estáticas en `historial.html`: Ana Pérez con 1 unidad de «Cien años de soledad» y Bruno Díaz con 1 unidad de «Antología de la literatura fantástica» más 1 unidad de «El Aleph»), con ids 1 y 2, fechas de ejemplo y renglones que referencian libros y clientes existentes. Son datos de ejemplo, no reales; los precios y fechas deben declararse como ficticios en el SPEC.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná las fuentes y el estado existente dentro del alcance autorizado antes de definir la solución.

Generá `openspec/changes/ejercicio-5-venta-simulada-historial/proposal.md` (con `specs/ventas/`, `specs/historial/` y `specs/datos-locales/` si el flujo openspec lo requiere) con:

1. Problema, objetivo y resultado esperado.
2. Contexto verificado y referencias concretas a las fuentes consultadas.
3. Alcance incluido y exclusiones explícitas.
4. Requisitos identificados y escenarios observables, incluidos los casos límite relevantes (cantidad cero, negativa, decimal, no numérica o vacía; libro repetido; cliente inexistente; confirmación sin cliente o sin renglones; venta confirmada y precio de catálogo posterior distinto; historial vacío).
5. Estructura o componentes propuestos, interfaces y datos necesarios, con el detalle proporcional al alcance. Incluir al menos: esquema de `venta` (`id`, `fecha`, `clienteId`, `clienteNombre`, `renglones`, `total`), esquema de `renglon` (`libroId`, `tituloLibro`, `cantidad`, `precioUnitario`, `subtotal`), firma y retorno de `generarIdVenta`, `buscarVentaPorId` y `registrarVenta`, la existencia de `ElTintero.datos.ventas` y la estrategia de formateo de importes con dos decimales sin alterar el formateo del catálogo.
6. Estados y manejo de errores aplicables (composición vacía, cantidad inválida, duplicado, cliente o libro inexistente, confirmación rechazada, historial vacío, venta parcial).
7. Restricciones técnicas y convenciones que condicionan la solución (`file://`, scripts clásicos, sin `fetch`, sin persistencia, datos en memoria, historial inmutable).
8. Criterios de aceptación vinculados a los requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta.

Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta. Decisiones esperadas: política de libro repetido (rechazar con mensaje vs. sumar la cantidad al renglón existente); interfaz para cambiar cantidades (input numérico por renglón vs. seleccionar el renglón y reutilizar el campo superior vs. `prompt()`); momento del snapshot del precio unitario (al agregar el renglón vs. al confirmar, como dice el PDF); formateo monetario (agregar `formatearImporte` con dos decimales para ventas manteniendo `formatearPrecio` sin decimales para catálogo/libros vs. cambiar `formatearPrecio` globalmente); formato de fecha (guardar `YYYY-MM-DD` y mostrar `DD/MM/AAAA` con `Intl.DateTimeFormat` vs. guardar un timestamp ISO y mostrar fecha y hora); formato del identificador (numérico incremental como las demás entidades vs. código con prefijo `V-`); presentación del detalle del historial (`details/summary` por venta vs. secciones con anclas como el HTML actual vs. diálogo); contenedor de estado para venta sin renglones (agregar `#ventas-renglones-vacio` vs. reutilizar `#ventas-mensaje-error`); si se envuelve la composición en `form#ventas-form` con `novalidate` o se mantiene la `section` actual y se manejan clics; y, sobre todo, la limitación de que una venta confirmada en `ventas.html` no sobrevive a la navegación a `historial.html` sin el Ej. 6 (recomendado: aceptar y documentar la limitación, verificar el render del historial con las ventas de ejemplo y, desde consola, registrar una venta y llamar al render; no adelantar `localStorage`). Si no respondo, usá `{{DATO_PENDIENTE: ...}}` y proponé un default sin implementarlo.

Al terminar, presentá la especificación para revisión y detenete. No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar, generá `openspec/changes/ejercicio-5-venta-simulada-historial/tasks.md` con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar.

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación y mi autorización para implementar.

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá convenciones: `const`/`let`, funciones nombradas y acotadas, `"use strict"` e IIFE/namespace `ElTintero` para no contaminar el global, 2 espacios de indentación, nombres en español consistentes con el dominio (venta, renglón, cliente, libro, cantidad, precioUnitario, subtotal, total).
- Reutilizá `ElTintero.consultas` y `ElTintero.registros`; agregá en `js/data.js` solo lo necesario para ventas. No dupliques la búsqueda de libros/clientes ni el formateo que ya existe; si se requiere un formateador con dos decimales, agregalo sin romper el del catálogo salvo decisión aprobada.
- Respetá verificación manual: abrir `ventas.html` e `historial.html` con doble clic (`file://`), revisar consola, agregar renglones válidos, probar cantidad vacía, cero, negativa, decimal y no numérica, libro repetido, cambio de cantidad, quitar renglón, confirmar sin cliente y sin renglones, confirmar una venta válida y verificar subtotales y total con dos decimales; sin tests automatizados ni servidor en este change.
- Verificá el historial con las ventas de ejemplo y su detalle. Para comprobar el snapshot histórico sin persistencia, en `historial.html` registrá una venta desde consola con `ElTintero.registros.registrarVenta`, cambiá el precio del libro en `ElTintero.datos.libros` y volvé a ejecutar el render del historial: el renglón debe conservar el precio unitario, subtotal y total confirmados. Registrá esa comprobación como verificación de modelo/render, no como flujo de usuario entre páginas.
- Comprobá explícitamente que una venta confirmada en `ventas.html` no aparece en `historial.html` tras navegar, porque no hay persistencia (Ej. 6); documentá esa limitación y no la presentes como funcionalidad terminada.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá los archivos JS creados y las modificaciones mínimas de `ventas.html`, `historial.html` y `js/data.js` junto con un resumen de cambios, comprobaciones realizadas, limitaciones y pendientes.

## Criterios de aceptación

Reemplazá los criterios editables por condiciones observables y vinculalas a los requisitos correspondientes.

- [ ] CA-01 — `#ventas-cliente` y `#ventas-libro` se generan desde el modelo (3 clientes y 6 libros), con opción inicial vacía y sin opciones hardcodeadas; agregar un libro existente con cantidad entera positiva crea un renglón con libro, cantidad, precio unitario y subtotal (R-01, R-08).
- [ ] CA-02 — Se rechazan sin agregar renglón: libro sin seleccionar o inexistente, cantidad vacía, `0`, negativa, decimal, no numérica y libro repetido (con la política aprobada); cada caso muestra un mensaje de texto y conserva la composición válida (R-02, R-06, R-07).
- [ ] CA-03 — Con dos unidades de un libro a 1.500 y una de otro a 2.000, los subtotales son 3.000,00 y 2.000,00 y el total 5.000,00; cambiar una cantidad o quitar un renglón actualiza subtotales y total; no aparecen artefactos de coma flotante (R-03).
- [ ] CA-04 — Confirmar sin cliente, sin renglones o con cantidad inválida no registra nada y muestra error; una confirmación válida agrega una venta con id único, fecha, cliente, renglones con `precioUnitario` histórico, subtotal y total a `ElTintero.datos.ventas`, limpia el formulario y muestra el mensaje de éxito; no hay edición ni eliminación desde la interfaz (R-04, R-05, R-06).
- [ ] CA-05 — En `historial.html`, el render desde el modelo muestra las 2 ventas de ejemplo con identificador, fecha, cliente y total, y permite consultar sus renglones; no quedan filas estáticas; `#historial-vacio` aparece si el arreglo de ventas está vacío (R-05).
- [ ] CA-06 — El detalle de una venta usa el `precioUnitario`, subtotal y total almacenados: tras registrar una venta y modificar el precio actual del libro en el modelo, el render del historial conserva los valores confirmados (R-05).
- [ ] CA-07 — No se usa `innerHTML` con datos; los valores se insertan como texto; no hay errores en consola al abrir ni al operar; `verificarIntegridad()` devuelve `[]` con los datos de ejemplo y después de ventas válidas (R-07).
- [ ] CA-08 — Apertura directa por `file://` funciona sin servidor, npm ni librerías; los scripts nuevos son externos, clásicos, con `defer` y cargan después de `data.js` (R-08).
- [ ] CA-09 — El SPEC documenta el esquema de venta/renglón, las funciones nuevas de `ElTintero`, su contrato y los ganchos para el Ej. 6, y deja explícito que sin persistencia las ventas no sobreviven a la recarga ni a la navegación entre páginas (R-09).
- [ ] CA-10 — Se conservan `label`, `thead`/`th scope`, el total en `#ventas-resumen` y el diseño adaptable; los controles de cantidad/quitar son accesibles por teclado y no se muestran mensajes de éxito y error a la vez (R-06, R-10).
- [ ] Se cubre todo el alcance aprobado y no se incorpora trabajo excluido.
- [ ] Se respetan las tecnologías, dependencias y convenciones permitidas.
- [ ] Las comprobaciones exigidas se ejecutaron y sus resultados se informan con evidencia.
- [ ] Se distinguen los controles aprobados, fallidos, omitidos y pendientes; ningún control no ejecutado se presenta como aprobado.
- [ ] Los supuestos, placeholders pendientes y limitaciones quedan identificados.

## Restricciones anti-alucinación

- No inventes requisitos, funcionalidades, archivos existentes, APIs, contratos, credenciales, datos reales ni resultados de comprobaciones.
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
