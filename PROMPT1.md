# PROMPT1 — Ejercicio 1 únicamente (copiar y pegar al orquestador)

> Pegá el bloque `text` de abajo tal cual al orquestador active-stack. Ya tiene todos los `{{...}}` de la plantilla reemplazados. Solo Ejercicio 1.

```text
@docs/Repaso Primer Parcial.pdf

## Rol

Actuá como arquitecto frontend senior, con experiencia en HTML semántico, maquetación de sistemas de gestión (catálogos, altas, ventas) y SDD, y responsabilidad sobre definir la especificación completa del Ejercicio 1, su plan de tareas y, solo tras mi aprobación, su implementación en HTML.

## Metodología

- Metodología a utilizar: SDD con framework active-stack (flujo SPEC → PLAN → IMPLEMENTACIÓN, con openspec: `openspec/changes/<change>/proposal.md` + `tasks.md` + specs).
- Herramientas y convenciones: openspec CLI, convenciones del orquestador active-stack, HTML5 semántico nativo, archivos y recursos locales, apertura directa de `index.html` en navegador sin npm ni servidor.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a la metodología elegida.
- No escribas código ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles, informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: ProgIII-FrontEnd-PrimerParcial — TPI frontend de una librería (UTN, Programación III).
- Propósito y usuarios: librería que presenta su catálogo y registra libros, clientes y ventas. Usuarios: docente evaluador y estudiantes que maquetan el frontend. Solo frontend simulado en navegador.
- Ubicación o repositorio: `C:\Users\tomas\Documents\GitHub\ProgIII-FrontEnd-PrimerParcial` (repo actual).
- Estado actual verificado: solo existe `docs/Repaso Primer Parcial.pdf`. No existe `index.html`, ni carpetas de CSS/JS, ni README, ni `openspec/`. Nada implementado; todo el Ejercicio 1 está pendiente.
- Fuentes de requisitos: `docs/Repaso Primer Parcial.pdf` — obligatorias para este change: sección "Ejercicio 1 · 1. Estructura y pantallas HTML" (p. 2), "Contexto y alcance", "Organización del trabajo Etapa 1", "Criterios de evaluación" (1. HTML: 20 = vistas y navegación 10 + semántica, formularios y estados 10) y "Formato de entrega". Si hay conflicto entre tu propuesta y el PDF, vale el PDF.
- Tecnologías y dependencias permitidas: HTML5 nativo. Atributos `id`, `name`, `class` como ganchos y `aria-live` en zonas de mensajes para preparación futura. Datos estáticos de ejemplo hardcodeados en el HTML.
- Tecnologías y dependencias excluidas: librerías, frameworks y CDNs de CSS o JavaScript; API, base de datos, servidor, conexión con backend, login real; CSS definitivo (Ej. 2) y JavaScript funcional, validaciones, `fetch`, `localStorage` (Ej. 3 a 6).
- Punto de entrada o componente afectado: `index.html` (a crear). Se permite multi-página o secciones de una misma página, siempre con navegación clara.
- Condiciones del entorno: apertura directa de `index.html` con doble clic, sin npm, sin build, sin servidor.

## Alcance estricto

### Objetivo de esta entrega

Especificar (Fase 1), planificar (Fase 2 tras aprobación) e implementar solo tras autorización la estructura HTML completa de las 5 vistas del Ejercicio 1, con navegación, semántica, formularios, tablas y estados/mensajes presentes en el DOM, usando datos estáticos de ejemplo.

### Incluido

- Entrada `index.html` + navegación clara entre Catálogo, Libros, Clientes, Ventas, Historial (multi-página o secciones con anclas).
- Vista Catálogo: título de la librería, buscador por título y listado de libros; cada libro con título, ISBN, editorial, género, autores y precio; género ausente = literal «Sin clasificar».
- Vista Libros: formulario de alta (título, ISBN, precio, editorial, género, autores) + listado/tabla de registrados.
- Vista Clientes: formulario de alta (nombre completo, email) + listado/tabla de registrados.
- Vista Ventas: selección de cliente, composición de renglones (libro + cantidad + agregar/quitar) y resumen de la venta.
- Vista Historial: listado/tabla de ventas (identificador, fecha, cliente, total) + acceso a detalles/renglones.
- Semántica: `header`, `nav`, `main`, `section`/`article`, `footer`; cada campo con `label for` + `id`; botones con texto de acción; tablas con `thead`/`th scope`; mensajes de lista vacía, búsqueda sin resultados, operación correcta y operación rechazada como contenedores en el DOM con `id` predecible.
- Datos estáticos de ejemplo y estructura con `id`/`name`/`data-*` que luego usará JavaScript, sin implementar lógica.

### Excluido

- Todo el Ejercicio 2 (identidad visual, CSS externo, Flexbox/Grid, responsive 320/1280 px, foco visible, accesibilidad CSS).
- Todo el Ejercicio 3 (arrays/objetos JS, renderizado de catálogo, filtro case-insensitive/trim).
- Todo el Ejercicio 4 (validaciones de alta con `preventDefault`, ISBN duplicado, email duplicado).
- Todo el Ejercicio 5 (cálculos subtotal/total, precio histórico, confirmación de venta).
- Todo el Ejercicio 6 (`localStorage`, casos manuales, README definitivo).
- Editar/eliminar registros, gestión de stock, cobros, facturación, editoriales/géneros/autores administrables.

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

Completá únicamente los grupos aplicables y asigná un identificador estable a cada requisito.

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Funcional | Navegación: desde `index.html` se alcanza cada una de las 5 vistas (Catálogo, Libros, Clientes, Ventas, Historial) mediante `nav` con enlaces/anclas visibles y con `href` válido. |
| R-02 | Estructura e interfaces | Catálogo contiene: `h1/h2` con título de la librería, formulario buscador (`label` + `input[type=search]` + botón "Buscar por título"/"Limpiar búsqueda") y listado donde cada libro expone título, ISBN, editorial, género, autores y precio; al menos un ejemplo muestra «Sin clasificar». |
| R-03 | Estructura e interfaces | Libros contiene formulario de alta con campos título, ISBN, precio, editorial (`select`), género (`select` con opción «Sin clasificar») y autores (selector múltiple o equivalente), cada uno con `label`; más tabla/listado de libros con `thead` (Título, ISBN, Editorial, Género, Autores, Precio). |
| R-04 | Estructura e interfaces | Clientes contiene formulario de alta con nombre completo y email (ambos con `label`) más tabla/listado (Nombre completo, Email) con `thead`. |
| R-05 | Estructura e interfaces | Ventas contiene `select` de cliente con `label`, controles de renglón (selector de libro + cantidad + botón "Agregar renglón"), tabla de renglones (Libro, Cantidad, Precio unitario, Subtotal, Acciones quitar/cambiar) y bloque resumen con total + botón "Confirmar venta". |
| R-06 | Estructura e interfaces | Historial contiene tabla de ventas con `thead` (Identificador, Fecha, Cliente, Total) y acceso a detalle por venta (`details/summary` o enlace a sección detalle con tabla de renglones). |
| R-07 | Datos y estados | Cada vista incluye contenedores de estado en el DOM: lista vacía, búsqueda sin resultados (catálogo), mensaje de operación correcta y mensaje de operación rechazada (altas y venta), con `id` estable y `aria-live="polite"` donde corresponda; vacíos por defecto o con texto de ejemplo claramente marcado. |
| R-08 | Calidad | Todo `input`/`select` tiene `label for` asociado a su `id`; todo `button` tiene texto de acción; toda `table` tiene `thead` + `th scope`; se usan `header/nav/main/footer` y jerarquía de encabezados sin saltos. |
| R-09 | Convenciones | Archivos: `index.html` como entrada (+ otros HTML solo si se elige multi-página); recursos en carpetas locales `css/`, `js/`, `assets/` aunque en este change queden mínimas o vacías con placeholder; nombres en minúsculas con guiones; `id` en formato `vista-elemento` (ej. `catalogo-buscador`, `libros-mensaje`). |
| R-10 | Preparación futura, si aplica | Todos los campos, selects y contenedores de mensaje llevan `id`/`name`/`data-*` estables documentados en el SPEC para que los Ej. 3-5 los usen sin cambiar el HTML (ej. `data-libro-id`, `venta-renglones`, `historial-detalle-<id>`); sin implementar comportamiento JS. |

Datos de ejemplo, si se necesitan: 3 libros estáticos (uno con género asignado, uno con «Sin clasificar», con título, ISBN, editorial, autores y precio visibles), 2 clientes y 2 ventas de ejemplo. Identificalos como ejemplos; no los presentes como datos reales.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná las fuentes y el estado existente dentro del alcance autorizado antes de definir la solución.

Generá `openspec/changes/ejercicio-1-estructura-pantallas-html/proposal.md` (con `specs/` por vista si el flujo openspec lo requiere) con:

1. Problema, objetivo y resultado esperado.
2. Contexto verificado y referencias concretas a las fuentes consultadas.
3. Alcance incluido y exclusiones explícitas.
4. Requisitos identificados y escenarios observables, incluidos los casos límite relevantes.
5. Estructura o componentes propuestos, interfaces y datos necesarios, con el detalle proporcional al alcance.
6. Estados y manejo de errores aplicables.
7. Restricciones técnicas y convenciones que condicionan la solución.
8. Criterios de aceptación vinculados a los requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta.

Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta. Decisiones esperadas: multi-página vs. secciones en una página; formato del selector múltiple de autores; formato del detalle de venta (`details` vs. sección aparte). Si no respondo, usá `{{DATO_PENDIENTE: ...}}` y proponé un default sin implementarlo.

Al terminar, presentá la especificación para revisión y detenete. No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar, generá `openspec/changes/ejercicio-1-estructura-pantallas-html/tasks.md` con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar.

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación y mi autorización para implementar.

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá convenciones HTML5 semántico, indentación de 2 espacios, atributos en minúsculas, `id` formato `vista-elemento`.
- Respetá verificación manual: abrir `index.html` con doble clic y recorrer las 5 vistas; sin tests automatizados en este change.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá los archivos HTML creados en la raíz/carpetas locales junto con un resumen de cambios, comprobaciones realizadas, limitaciones y pendientes.

## Criterios de aceptación

Reemplazá los criterios editables por condiciones observables y vinculalas a los requisitos correspondientes.

- [ ] CA-01 — Las 5 vistas son alcanzables desde el `nav` de `index.html` y cada una muestra su contenido esperado (R-01 a R-06).
- [ ] CA-02 — Catálogo muestra por libro título, ISBN, editorial, género, autores y precio, con al menos un caso «Sin clasificar» y buscador etiquetado (R-02).
- [ ] CA-03 — Formularios de Libros y Clientes tienen todos sus campos con `label`, tablas con `thead`/`th`, y Ventas/Historial tienen los controles y columnas exigidos (R-03 a R-06).
- [ ] CA-04 — Existen contenedores de lista vacía, búsqueda sin resultados y mensajes de operación correcta/rechazada con `id` estable (R-07).
- [ ] CA-05 — Pasa inspección manual: cada `input`/`select` tiene `label`, cada tabla tiene `th`, hay `header/nav/main/footer` y los botones describen su acción (R-08).
- [ ] CA-06 — Apertura directa de `index.html` sin servidor ni npm muestra las 5 vistas navegables y los ejemplos estáticos (compatibilidad/entorno).
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
