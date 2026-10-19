# PROMPT2 — Ejercicio 2 únicamente (copiar y pegar al orquestador)

> Pegá el bloque `text` de abajo tal cual al orquestador active-stack. Ya tiene todos los `{{...}}` de la plantilla reemplazados. Solo Ejercicio 2.

```text
@docs/Repaso Primer Parcial.pdf

## Rol

Actuá como arquitecto frontend senior, con experiencia en diseño de interfaces CSS, diseño adaptable (responsive), accesibilidad web y SDD, y responsabilidad sobre definir la especificación completa del Ejercicio 2, su plan de tareas y, solo tras mi aprobación, su implementación en CSS nativo.

## Metodología

- Metodología a utilizar: SDD con framework active-stack (flujo SPEC → PLAN → IMPLEMENTACIÓN, con openspec: `openspec/changes/<change>/proposal.md` + `tasks.md` + specs).
- Herramientas y convenciones: openspec CLI, convenciones del orquestador active-stack, CSS3 nativo (Flexbox, Grid, media queries, custom properties), archivos CSS externos, apertura directa de `index.html` en navegador sin npm ni servidor.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a la metodología elegida.
- No escribas código ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles, informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: ProgIII-FrontEnd-PrimerParcial — TPI frontend de una librería (UTN, Programación III).
- Propósito y usuarios: librería que presenta su catálogo y registra libros, clientes y ventas. Usuarios: docente evaluador y estudiantes que maquetan el frontend. Solo frontend simulado en navegador.
- Ubicación o repositorio: `C:\Users\tomas\Documents\GitHub\ProgIII-FrontEnd-PrimerParcial` (repo actual).
- Estado actual verificado: existe la estructura HTML de las 5 vistas (Catálogo, Libros, Clientes, Ventas, Historial) con datos estáticos, pero sin estilos (Ejercicio 1 completado). Verificar el estado real antes de especificar; si difiere, informalo.
- Fuentes de requisitos: `docs/Repaso Primer Parcial.pdf` — obligatorias para este change: sección "Ejercicio 2 · 2. Presentación con CSS y uso adaptable" (p. 3), "Contexto y alcance", "Organización del trabajo Etapa 1", "Criterios de evaluación" (2. CSS: 20 = coherencia y organización 8 + adaptación 8 + accesibilidad básica 4) y "Formato de entrega". Si hay conflicto entre tu propuesta y el PDF, vale el PDF.
- Tecnologías y dependencias permitidas: CSS3 nativo (Flexbox, Grid, media queries, custom properties), archivos CSS externos, clases reutilizables, pseudo-clases de foco (`:focus`, `:focus-visible`), `overflow-x` en contenedores de tabla.
- Tecnologías y dependencias excluidas: librerías, frameworks y CDNs de CSS o JavaScript (Tailwind, Bootstrap, Font Awesome, Google Fonts vía CDN); preprocesadores (Sass, Less); CSS-in-JS; API, base de datos, servidor, backend; JavaScript funcional (Ej. 3 a 6).
- Punto de entrada o componente afectado: archivos CSS externos a crear (`css/styles.css` u organización equivalente) + ajustes de clases/atributos en los HTML existentes si son necesarios para el diseño.
- Condiciones del entorno: apertura directa de `index.html` con doble clic, sin npm, sin build, sin servidor. Verificación a 320 px y 1280 px de ancho.

## Alcance estricto

### Objetivo de esta entrega

Especificar (Fase 1), planificar (Fase 2 tras aprobación) e implementar solo tras autorización la identidad visual y el diseño adaptable del frontend de la librería, con CSS externo, Flexbox o Grid, y accesibilidad básica (foco visible, mensajes con texto, alt de imágenes).

### Incluido

- Identidad visual coherente: paleta de colores, tipografía, espaciado, tarjetas, formularios y botones con estilos propios.
- CSS en archivos externos (ej. `css/styles.css`) con clases reutilizables para elementos equivalentes (botones, tarjetas, tablas, formularios, mensajes).
- Organización de contenido con Flexbox o Grid.
- Diseño adaptable a 320 px y 1280 px: textos y controles legibles, sin desplazamiento horizontal de la página completa.
- Tablas con scroll propio (`overflow-x` en su contenedor) cuando necesitan más espacio.
- Foco visible en todos los controles interactivos, recorribles con teclado.
- Mensajes de error expresados con texto (no solo color).
- Imágenes informativas con `alt` descriptivo; imágenes decorativas con `alt=""` o sin repetir información innecesaria.

### Excluido

- Todo el Ejercicio 1 (estructura HTML de las vistas — ya existe; solo se ajustan clases/atributos si el CSS lo requiere).
- Todo el Ejercicio 3 (arrays/objetos JS, renderizado de catálogo, filtro).
- Todo el Ejercicio 4 (validaciones de alta con `preventDefault`).
- Todo el Ejercicio 5 (cálculos de venta, historial dinámico).
- Todo el Ejercicio 6 (`localStorage`, README definitivo).
- Agregar imágenes decorativas nuevas (solo se estilizan las existentes); no se agregan iconos de librerías externas.
- Modificar la estructura semántica HTML existente salvo ajustes mínimos de clases/atributos necesarios para el diseño.

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

Completá únicamente los grupos aplicables y asigná un identificador estable a cada requisito.

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Convenciones | Identidad visual definida con custom properties CSS para colores, tipografía y espaciado; al menos una paleta coherente (fondo, texto, acento, error, éxito) y una familia de tipografía propia (sin CDNs). |
| R-02 | Convenciones | CSS en archivo(s) externo(s) en carpeta `css/`; clases reutilizables para elementos equivalentes (ej. `.btn`, `.card`, `.tabla-contenedor`, `.form-group`, `.mensaje-error`, `.mensaje-exito`); sin estilos inline en HTML. |
| R-03 | Estructura e interfaces | Contenido organizado con Flexbox o Grid: nav horizontal, grid de tarjetas de catálogo, layout de formularios, tabla de historial; sin posiciones `position: absolute/fixed` innecesarias para el layout principal. |
| R-04 | Compatibilidad | A 320 px de ancho: textos legibles (sin cortarse), controles utilizables, sin scroll horizontal de la página; tablas con `overflow-x: auto` en su contenedor para desplazarse internamente. |
| R-05 | Compatibilidad | A 1280 px de ancho: layout cómodo, tarjetas en grilla multi-columna, formularios con espacio suficiente, sin desaprovechar el ancho disponible. |
| R-06 | Calidad | Todos los controles interactivos (`a`, `button`, `input`, `select`, `textarea`) muestran foco visible (`outline` o equivalente con `:focus-visible`); el foco es distinguible del estado normal. |
| R-07 | Calidad | Mensajes de error y éxito se expresan con texto (ej. "El título es obligatorio") y no dependen únicamente de un color; el color es complementario, no el único indicador. |
| R-08 | Calidad | Imágenes informativas (si existen) tienen `alt` descriptivo; imágenes decorativas (si existen) tienen `alt=""`; no se repite información innecesaria en `alt`. |
| R-09 | Convenciones | Nomenclatura CSS consistente: clases en kebab-case, nombres descriptivos (`.libro-tarjeta`, `.venta-resumen`); selectores simples y específicos; sin selectores demasiado anidados o `!important` innecesarios. |

Datos de ejemplo, si se necesitan: no se agregan datos nuevos; se estilizan los datos estáticos ya presentes en las vistas del Ejercicio 1.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná las fuentes y el estado existente dentro del alcance autorizado antes de definir la solución.

Generá `openspec/changes/ejercicio-2-presentacion-css-adaptable/proposal.md` (con `specs/` por sección si el flujo openspec lo requiere) con:

1. Problema, objetivo y resultado esperado.
2. Contexto verificado y referencias concretas a las fuentes consultadas.
3. Alcance incluido y exclusiones explícitas.
4. Requisitos identificados y escenarios observables, incluidos los casos límite relevantes.
5. Estructura o componentes propuestos, interfaces y datos necesarios, con el detalle proporcional al alcance.
6. Estados y manejo de errores aplicables.
7. Restricciones técnicas y convenciones que condicionan la solución.
8. Criterios de aceptación vinculados a los requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta.

Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta. Decisiones esperadas: organización del CSS (un archivo vs. varios por sección); paleta de colores exacta; si se permite algún icono Unicode/emoji o solo texto. Si no respondo, usá `{{DATO_PENDIENTE: ...}}` y proponé un default sin implementarlo.

Al terminar, presentá la especificación para revisión y detenete. No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar, generá `openspec/changes/ejercicio-2-presentacion-css-adaptable/tasks.md` con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar.

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación y mi autorización para implementar.

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá convenciones CSS: custom properties para tokens, clases kebab-case, archivos externos en `css/`, sin estilos inline, sin `!important` salvo justificación.
- Respetá verificación manual: abrir `index.html` con doble clic, redimensionar a 320 px y 1280 px, recorrer controles con teclado y verificar foco visible; sin tests automatizados en este change.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá los archivos CSS creados/modificados junto con un resumen de cambios, comprobaciones realizadas, limitaciones y pendientes.

## Criterios de aceptación

Reemplazá los criterios editables por condiciones observables y vinculalas a los requisitos correspondientes.

- [ ] CA-01 — Los archivos CSS externos están enlazados desde los HTML y no hay estilos inline significativos (R-02).
- [ ] CA-02 — La identidad visual es coherente: custom properties para colores/tipografía/espaciado, botones, tarjetas, formularios y tablas con estilo propio y clases reutilizables (R-01, R-02, R-09).
- [ ] CA-03 — El layout usa Flexbox o Grid; a 320 px no hay scroll horizontal de la página y las tablas se desplazan dentro de su contenedor; a 1280 px el layout es cómodo y multi-columna donde corresponde (R-03, R-04, R-05).
- [ ] CA-04 — Al recorrer con teclado, todos los controles muestran foco visible y distinguishable; los mensajes de error incluyen texto descriptivo, no solo color (R-06, R-07).
- [ ] CA-05 — Si hay imágenes, las informativas tienen `alt` descriptivo y las decorativas `alt=""` (R-08).
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
