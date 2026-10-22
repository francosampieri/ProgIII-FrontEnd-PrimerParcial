# Design

## Context

Este change agrega persistencia con `localStorage` al modelo local de El Tintero.
El "por qué" y el alcance están en `proposal.md` (§"Why", §"Alcance"); los
requisitos normativos, en los cinco delta specs (`persistencia`, `documentacion`,
`datos-locales`, `historial`, `ventas`). Las decisiones D-01 a D-11 están
aprobadas y registradas en `proposal.md` §"Decisiones aprobadas". Este documento
explica **cómo** se implementa, no repite los escenarios.

Estado actual verificado (solo lectura) que condiciona el diseño:

- `js/data.js` es un IIFE con `"use strict"` que define `ElTintero.datos`
  (`js/data.js:11-118`), las consultas (`js/data.js:604-620`), los registros
  (`js/data.js:622-629`) y ejecuta `verificarIntegridad()` al final
  (`js/data.js:631`). No toca el DOM.
- Los tres puntos de mutación hacen `push` y retornan un contrato estable:
  `registrarLibro` (`js/data.js:469-470`), `registrarCliente`
  (`js/data.js:500-501`) y `registrarVenta` (`js/data.js:600-601`). Todos validan
  **antes** del `push` y no mutan si hay errores.
- `verificarIntegridad()` (`js/data.js:249-333`) reporta con `console.error` y
  devuelve el array de errores; nunca lanza. Verifica ids duplicados, referencias
  a editorial/género/autor, precios finitos, cliente y libros de cada venta,
  cantidades enteras, subtotales y total.
- `generarIdSiguiente` (`js/data.js:366-371`) usa `max(id) + 1` sobre la colección
  viva, de modo que la hidratación debe ocurrir antes de cualquier alta.
- Las vistas se auto-inician al final de su IIFE (`js/catalogo.js:153`,
  `js/altas.js:369`, `js/ventas.js:393`, `js/historial.js:170`) y leen
  `ElTintero.datos` en ese momento. No hay llamadas a `localStorage` en `js/`.
- Cada HTML carga `<script defer src="js/data.js">` antes del script de su vista
  (`catalogo.html:41-42`, `libros.html:74-75`, `clientes.html:55-56`,
  `ventas.html:70-71`, `historial.html:43-44`). `index.html` no carga scripts.
- `assets/` solo contiene `.gitkeep`; no hay imágenes en HTML ni CSS. No existe
  `README.md`.

Restricciones: apertura `file://`, sin npm, sin build, sin servidor, sin módulos
ES, sin librerías, sin `fetch`, solo `localStorage`, ES2020+ y 2 espacios de
indentación.

## Goals / Non-Goals

**Goals:**

- Centralizar **toda** lectura, escritura, serialización y nombre de clave en
  `js/data.js` bajo `ElTintero.persistencia`; las vistas no cambian ni conocen el
  almacenamiento.
- Hidratar `ElTintero.datos` dentro de `js/data.js`, de forma síncrona y antes de
  que el script de cada vista renderice.
- Sembrar los ejemplos una sola vez por colección y reemplazar (no concatenar)
  para que recargar y navegar no dupliquen registros.
- Mantener intactos los contratos públicos existentes y los `id` del HTML.
- Dejar la persistencia y el restablecimiento verificables desde consola, sin
  controles visibles nuevos.

**Non-Goals:**

- Cambios de HTML, CSS, navegación, semántica o lógica de negocio de los
  Ejercicios 1 a 5.
- Pantalla de edición de precios, administración del almacenamiento, botón de
  restablecimiento, exportación/importación.
- Migraciones de datos reales, corrección retroactiva de importes, sincronización
  entre pestañas, usuarios o equipos.
- Tests automatizados, npm, bundlers, servidores, `sessionStorage`, IndexedDB,
  cookies o service workers.

## Decisions

### A. Arquitectura de `ElTintero.persistencia`

- **Elegida:** una única capa en `js/data.js`, compuesta por constantes internas,
  helpers privados y un objeto público aditivo `ElTintero.persistencia`. Las
  claves se derivan de un mapa, nunca se escriben literales dispersos.

```text
CLAVES = {
  libros:   "eltintero.libros.v1",
  clientes: "eltintero.clientes.v1",
  ventas:   "eltintero.ventas.v1"
}
EJEMPLOS = copia profunda de { libros, clientes, ventas } tomada antes de hidratar
```

| Función | Firma | Devuelve | Responsabilidad |
| --- | --- | --- | --- |
| `claveDe(nombre)` | `nombre: "libros"\|"clientes"\|"ventas"` | `string \| null` | Mapea la colección a su clave; `null` si el nombre no es válido |
| `disponible()` | — | `boolean` | Comprueba acceso y escritura de prueba sin propagar excepciones |
| `validarColeccion(nombre, valor)` | `nombre`, `valor: unknown` | `boolean` | Valida array, registros y campos/tipos por colección |
| `leerColeccion(nombre)` | `nombre` | `{ ok: true, datos: [] } \| { ok: false, motivo: string }` | Lee, parsea y valida; **no** muta el modelo |
| `escribirColeccion(nombre)` | `nombre` | `{ ok: boolean, error?: string }` | Escritura interna sin verificación, para siembra |
| `guardarColeccion(nombre)` | `nombre` | `{ ok: boolean, error?: string }` | Serializa `ElTintero.datos[nombre]`, escribe y verifica integridad |
| `guardarTodo()` | — | `{ ok: boolean, errores: string[] }` | Escribe las tres colecciones y verifica una vez |
| `sembrarColeccion(nombre)` | `nombre` | `{ ok: boolean, error?: string }` | Copia el ejemplo de esa colección y lo persiste |
| `sembrar()` | — | `void` | Siembra las tres colecciones |
| `iniciar()` | — | `void` | Orquesta hidratación o siembra por colección y recuperación de coherencia |
| `restablecer()` | — | `{ ok: boolean, errores: string[] }` | Borra las claves, vuelve a sembrar y verifica; solo consola |

- **Privadas:** `detectarColeccionesInconsistentes()`, `restaurarCoherencia()`,
  `obtenerAlmacen()` y los validadores por colección. No se exponen para no
  ampliar la interfaz pública más allá de lo aprobado.
- **Snapshot de ejemplos:** `EJEMPLOS` se captura con una copia profunda
  (`JSON.parse(JSON.stringify(...))`) inmediatamente después de declarar
  `ElTintero.datos` y **antes** de llamar a `iniciar()`. Sin este snapshot, tras
  reemplazar una colección por datos guardados ya no habría ejemplos con los que
  sembrar una colección inválida.
- **Descartadas:** duplicar los ejemplos en un segundo literal (mantenimiento
  doble); sembrar desde `ElTintero.datos` en el momento del fallback (los
  ejemplos ya podrían estar reemplazados).
- **Consecuencias:** `ElTintero.datos` conserva su forma; solo se reasignan sus
  tres arrays. La copia es barata (decenas de registros) y compatible con ES2020.

### B. Orden de inicialización y `defer`

- **Elegida:** el IIFE de `js/data.js` define el modelo, captura `EJEMPLOS`,
  declara todos los helpers, expone `ElTintero.consultas`, `ElTintero.registros` y
  `ElTintero.persistencia`, y recién entonces ejecuta
  `ElTintero.persistencia.iniciar()` y, al final, `verificarIntegridad()`.
- **Por qué funciona:** un `<script defer>` se ejecuta después de parsear el
  documento y **en orden de aparición**. `data.js` termina su IIFE completo
  (incluida la hidratación síncrona de `localStorage`) antes de que se ejecute
  `catalogo.js`, `altas.js`, `ventas.js` o `historial.js`. Como las vistas leen
  `ElTintero.datos` al auto-iniciarse, nunca ven los ejemplos si había datos
  guardados: no hay render intermedio ni parpadeo.
- **Sin `DOMContentLoaded`:** `defer` ya garantiza el DOM parseado; agregar un
  listener en las vistas rompería el orden y duplicaría la coordinación.
- **Descartadas:** hidratar desde cada vista (viola la centralización R-02/R-09 y
  el escenario "Vista sin acceso directo al almacenamiento"); cargar `data.js`
  como módulo (incompatible con `file://`).
- **Consecuencias:** la hidratación es síncrona y bloquea el hilo principal un
  instante mínimo; con los volúmenes de este TPI es despreciable.

### C. Siembra, hidratación y detección de primer inicio

- **Elegida:** decisión **por colección** y **por ausencia de clave** (D-07):

```text
para cada nombre en ["libros", "clientes", "ventas"]:
  crudo = almacen.getItem(claveDe(nombre))
  si crudo === null:
      ElTintero.datos[nombre] = copia(EJEMPLOS[nombre])
      escribirColeccion(nombre)                 // primer inicio de esa colección
  si no:
      resultado = leerColeccion(nombre)
      si resultado.ok:
          ElTintero.datos[nombre] = resultado.datos   // reemplazo, no concatenación
      si no:
          console.error("[ElTintero.persistencia] ...")
          ElTintero.datos[nombre] = copia(EJEMPLOS[nombre])
          escribirColeccion(nombre)             // D-04: solo la colección inválida
```

- Un `[]` guardado es un array válido y se asigna tal cual: **no** se vuelve a
  sembrar (D-07). Lo mismo aplica a `ventas` (`historial` muestra su estado
  vacío).
- La clave ausente se siembra de forma aislada: las otras dos no se tocan.
- El reemplazo por asignación (nunca `push` ni `concat`) es lo que impide
  duplicados en recargas y navegaciones.
- **Descartadas:** detectar primer inicio por valor vacío (borrar todo desde
  consola volvería a sembrar); sembrar en cada carga y "deduplicar" después
  (costoso, frágil y contradice D-07).
- **Consecuencias / borde conocido:** si una colección vacía deja referencias
  colgadas en otra (por ejemplo `libros: []` con ventas que apuntan a libros), la
  etapa de coherencia (F) puede volver a sembrarla. Prevalece un modelo no roto
  sobre conservar una colección vacía referencialmente inconsistente; se
  documenta como trade-off.

### D. Punto de guardado en las mutaciones y D-10

- **Elegida:** guardar la colección afectada inmediatamente después del `push` y
  antes del `return`, sin cambiar el contrato:

| Mutación | Punto exacto (estado actual) | Llamada |
| --- | --- | --- |
| `registrarLibro` | tras `ElTintero.datos.libros.push(libro)` (`js/data.js:469`) | `ElTintero.persistencia.guardarColeccion("libros")` |
| `registrarCliente` | tras `ElTintero.datos.clientes.push(cliente)` (`js/data.js:500`) | `ElTintero.persistencia.guardarColeccion("clientes")` |
| `registrarVenta` | tras `ElTintero.datos.ventas.push(venta)` (`js/data.js:600`) | `ElTintero.persistencia.guardarColeccion("ventas")` |

- El resultado del guardado **no** altera `{ exito, ... }`. Si la escritura falla
  (cuota, modo privado, bloqueo), la mutación queda en memoria, se registra
  `console.error` con prefijo `[ElTintero.persistencia]` y la vista muestra su
  confirmación normal (D-10).
- Las altas rechazadas retornan antes del `push`, por lo que no escriben nada.
- `guardarColeccion` ejecuta `verificarIntegridad()` después de una escritura
  exitosa; durante la siembra se usa `escribirColeccion` para no reportar errores
  transitorios entre colecciones todavía no hidratadas.
- **Descartadas:** rechazar la mutación si falla la escritura (cambiaría el
  contrato y perdería una venta válida); guardar desde las vistas (viola R-02 y
  R-09).

### E. Validación de esquema por colección y política D-04

- **Elegida:** validación **todo o nada por colección**. Un solo registro
  inválido invalida la colección completa; no se mezclan registros válidos e
  inválidos.

| Colección | Validación mínima |
| --- | --- |
| `libros` | array; cada registro objeto con `id` entero, `titulo` string no vacío, `isbn` string no vacío, `precio` número finito, `editorialId` entero, `generoId` entero o `null`, `autoresIds` array no vacío de enteros |
| `clientes` | array; cada registro objeto con `id` entero, `nombre` string no vacío, `email` string no vacío |
| `ventas` | array; cada registro objeto con `id` entero, `fecha` string `YYYY-MM-DD`, `clienteId` entero, `clienteNombre` string no vacío, `renglones` array no vacío, `total` número finito; cada renglón con `libroId` entero, `tituloLibro` string no vacío, `cantidad` entero `> 0`, `precioUnitario` número finito `>= 0`, `subtotal` número finito `>= 0` |

- La validación de esquema **no** verifica referencias entre colecciones ni
  unicidad de ISBN/email; eso queda para la etapa de coherencia (F) o para el
  flujo normal de altas.
- **Política (D-04):** JSON inválido, valor que no es array, registro no objeto,
  campo obligatorio ausente o tipo incorrecto → se descarta **solo** esa
  colección, se siembran sus ejemplos, se persiste y se conservan las demás. Se
  registra `console.error` controlado. Nunca se lanza hacia la vista.
- **Descartadas:** volver todo a ejemplos (pierde altas válidas de otras
  colecciones); detener la carga con aviso (deja la aplicación inutilizable);
  rescatar registros válidos sueltos (estado parcial impredecible).

### F. Coherencia referencial después de hidratar

- **Elegida:** después de hidratar/sembrar las tres colecciones, ejecutar
  `verificarIntegridad()` y aplicar una recuperación en dos etapas:

```text
errores = verificarIntegridad()
si errores.length === 0: fin
implicadas = detectarColeccionesInconsistentes()
   // ids duplicados en X -> X
   // libro con editorial/genero/autor inexistente -> libros
   // venta con cliente inexistente -> clientes + ventas
   // venta con libro inexistente -> libros + ventas
para cada colección en implicadas: asignar ejemplo y escribir
si verificarIntegridad() sigue con errores:
   restaurar las tres colecciones a ejemplos y escribir
   verificar y registrar el resultado final
```

- `detectarColeccionesInconsistentes()` es una comprobación acotada y explícita,
  no un parseo de los mensajes de `verificarIntegridad()`.
- **Descartadas:** parsear strings de error (frágil ante cambios de redacción);
  restaurar siempre las tres ante el primer error (pierde datos válidos de
  colecciones ajenas al problema).
- **Consecuencias:** con datos válidos no hay errores ni ruido en consola. Con
  datos corruptos puede aparecer el `console.error` propio de
  `verificarIntegridad()` antes de la reparación; es un aviso controlado y
  esperado, no una excepción. La aplicación siempre termina renderizando.

### G. Aislamiento catálogo / ventas y precio histórico

- **Elegida:** tres claves independientes (D-01, D-03). `libros` guarda el
  catálogo; `ventas` guarda cada venta con `tituloLibro`, `precioUnitario`,
  `subtotal` y `total` copiados al confirmar. El historial (`js/historial.js:99-107`)
  ya lee esos valores del registro de venta y no consulta `ElTintero.datos.libros`
  para los importes.
- Editar solo el `precio` dentro de `eltintero.libros.v1` no toca
  `eltintero.ventas.v1`; al recargar, el catálogo muestra el precio nuevo y el
  historial conserva los importes confirmados (R-03, R-05).
- **Descartadas:** una única clave con todo el estado (D-01 descartada: obligaría
  a reescribir ventas al editar un precio); recalcular el historial desde el
  catálogo actual (viola R-05 y el escenario "Sin recálculo desde el catálogo").
- **Consecuencias:** el instructivo del README puede indicar con precisión qué
  clave y qué campo editar, sin riesgo de corromper ventas.

### H. Contratos que no cambian

- **Elegida:** la persistencia es **aditiva**. Se conservan sin cambios:

| Contrato | Estado |
| --- | --- |
| `ElTintero.datos.{editoriales,generos,autores,libros,clientes,ventas}` | misma forma y tipos |
| `ElTintero.consultas.*` (16 helpers, `js/data.js:604-620`) | mismas firmas y retornos |
| `ElTintero.registros.{generarId*,registrar*}` (`js/data.js:622-629`) | mismas firmas y `{ exito, ... }` |
| `verificarIntegridad()` | sigue reportando con `console.error` y devolviendo `[]` o errores |
| `id`, clases y estructura de los 6 HTML | intactos |
| Orden `data.js` → vista con `defer` | intacto; `index.html` sigue sin scripts |
| `js/catalogo.js`, `js/altas.js`, `js/ventas.js`, `js/historial.js` | **sin cambios** |

- Se actualiza únicamente el comentario del modelo (`js/data.js:6-10`), que hoy
  declara "en memoria y sin persistencia", para describir la hidratación y el
  guardado.
- **Descartadas:** renombrar claves o helpers existentes; mover la persistencia a
  un archivo nuevo (rompería el orden de carga y la centralización pedida).
- **Consecuencias:** el change queda contenido en `js/data.js` más la
  documentación; el riesgo de regresión en las vistas es nulo por diseño.

### I. Trazabilidad de decisiones

| Decisión | Dónde se materializa |
| --- | --- |
| D-01 claves separadas | §A, §G (`CLAVES`, tres `setItem` independientes) |
| D-02 solo libros/clientes/ventas | §A (`CLAVES`), §C (solo esas tres se hidratan) |
| D-03 nombres y array JSON | §A (`CLAVES`), §E (validación de array) |
| D-04 fallback por colección | §E, §F |
| D-05 solo consola | §C, §D, §F (`console.error`/`console.warn`) |
| D-06 `restablecer()` por consola | §A, tarea 1.9 / 4.6 |
| D-07 clave ausente vs. `[]` | §C |
| D-08 `docs/pruebas-manuales.md` | tareas 5.1, 6.1, 6.10 |
| D-09 integrantes sin legajos | tarea 5.1 |
| D-10 fallo de escritura conserva memoria | §D |
| D-11 caso 1500/2000 con copia o datos de prueba | tareas 6.6, 6.7 |

## Risks / Trade-offs

- **`file://` con origen aislado** → cada navegador/perfil/ruta puede tener su
  propio almacenamiento y no compartirlo entre páginas o equipos. Mitigación:
  documentarlo con precisión en el README (R-06) y verificar el recorrido
  completo abriendo siempre la misma copia; no prometer sincronización.
- **Cuota excedida** → `setItem` lanza `QuotaExceededError`. Mitigación: `try/catch`
  en toda escritura, `console.error` controlado, mutación conservada en memoria
  (D-10) y comprobación manual llenando el almacenamiento antes de operar.
- **Modo privado / almacenamiento bloqueado** → el acceso o la escritura pueden
  lanzar. Mitigación: `disponible()` con escritura de prueba, helpers envueltos en
  `try/catch`, funcionamiento en memoria y aviso por consola.
- **Datos corruptos o de otra versión** → JSON inválido, tipo incorrecto o
  esquema incompleto. Mitigación: validación por colección + fallback aislado
  (D-04) + recuperación de coherencia en dos etapas (F). La versión vive en el
  sufijo `.v1`; una versión futura usaría otra clave sin tocar la anterior.
- **Doble siembra** → sembrar en cada carga duplicaría ejemplos. Mitigación:
  decisión por ausencia de clave, asignación por reemplazo y snapshot `EJEMPLOS`;
  la comprobación manual recarga cinco veces y cuenta registros.
- **Ruido de `console.error`** → `verificarIntegridad()` reporta antes de reparar
  datos corruptos. Mitigación: se acepta como aviso controlado solo en escenarios
  de corrupción; con datos válidos la consola debe quedar limpia (CA-08).
- **Dos pestañas abiertas** → la última escritura gana y la otra pestaña no se
  entera. Mitigación: fuera de alcance (sin sincronización); se declara como
  límite en el README.
- **Trade-off `[]` vs. coherencia** → una colección vacía referencialmente
  inconsistente puede volver a sembrarse en la recuperación. Mitigación:
  documentarlo; el caso normal de `[]` (sin referencias colgadas) se respeta.
- **Variación entre navegadores** → no se puede garantizar el mismo
  comportamiento de `localStorage` en todos. Mitigación: registrar en las pruebas
  el navegador y la versión usados; si un escenario no se puede reproducir, se
  marca omitido, no aprobado.
- **Tamaño** → los datos son pequeños (decenas de registros). No se prevé
  problema de cuota en uso normal; la prueba de cuota es artificial y se limpia
  al terminar.

## Migration Plan

- No hay datos reales que migrar. Las claves nacen con sufijo `.v1`; una versión
  futura puede usar `.v2` sin leer ni borrar `.v1`.
- Despliegue: reemplazar `js/data.js`, agregar `README.md` y
  `docs/pruebas-manuales.md`, y abrir `index.html` por `file://`.
- Primer inicio esperado: siembra de 6 libros, 3 clientes y 2 ventas, y creación
  de las tres claves. Segunda apertura: hidratación sin resiembra.
- Rollback: revertir el bloque de persistencia de `js/data.js` (el resto de la
  lógica no depende de él para renderizar) y, si se desea, borrar las tres claves
  desde la consola o ejecutar `ElTintero.persistencia.restablecer()`. No hay
  migración destructiva ni formato binario.
- La implementación y la ejecución de los 8 casos manuales pertenecen a la Fase 3
  y requieren autorización explícita; este documento no declara resultados.

## Open Questions

- Ninguna decisión bloqueante: D-01 a D-11 están aprobadas.
- Queda como supuesto a verificar en Fase 3 el comportamiento exacto de
  `localStorage` bajo `file://` en el navegador elegido (persistencia por ruta,
  por perfil y visibilidad al copiar la carpeta). No cambia el diseño; solo el
  texto del README y la evidencia de las pruebas.
