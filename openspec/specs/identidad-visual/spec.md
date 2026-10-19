# identidad-visual Specification

## Purpose

Define la identidad visual propia del frontend de la librería y su organización
en CSS externo reutilizable: tokens de color, tipografía y espaciado, clases
compartidas para elementos equivalentes y nomenclatura consistente.

## Requirements

### Requirement: Tokens de identidad visual (R-01)

El CSS SHALL declarar custom properties en `:root` para colores (fondo, texto,
acento, error, éxito), tipografía y escala de espaciado, y SHALL usar una
familia tipográfica propia sin CDNs; los componentes SHALL consumir esos tokens
vía `var(--...)`.

#### Scenario: Tokens declarados y consumidos

- **WHEN** se inspecciona el CSS cargado por las vistas
- **THEN** existe un bloque `:root` con custom properties de color, tipografía y
  espaciado, y los componentes las referencian con `var(--...)` en lugar de
  repetir valores literales

#### Scenario: Paleta coherente mínima

- **WHEN** se revisan las custom properties de color
- **THEN** existen al menos tokens para fondo, texto, acento, error y éxito

#### Scenario: Tipografía sin CDNs

- **WHEN** se revisan las familias tipográficas declaradas
- **THEN** provienen de fuentes del sistema o locales, sin `@import` ni `link` a
  Google Fonts u otros CDNs

### Requirement: CSS en archivos externos sin estilos inline (R-02)

Los estilos SHALL residir en archivo(s) externo(s) de la carpeta `css/`,
enlazados desde cada HTML con `<link rel="stylesheet">`; el HTML NO SHALL
contener atributos `style` significativos ni bloques `<style>`.

#### Scenario: Cada vista enlaza CSS externo

- **WHEN** se inspecciona el `<head>` de cada uno de los 6 HTML
- **THEN** cada documento incluye un `<link rel="stylesheet" href="css/...">`
  con ruta relativa

#### Scenario: Ausencia de estilos inline

- **WHEN** se buscan atributos `style="..."` y bloques `<style>` en los HTML
- **THEN** no se encuentran usos significativos

### Requirement: Clases reutilizables para elementos equivalentes (R-02)

El CSS SHALL exponer clases reutilizables en kebab-case para elementos
equivalentes —botones (`.btn`), tarjetas (`.card`), contenedor de tabla
(`.tabla-contenedor`), bloque de formulario (`.form-group`) y mensajes
(`.mensaje-error`, `.mensaje-exito`)— y los elementos equivalentes SHALL
compartir la misma clase base.

#### Scenario: Misma clase base para elementos equivalentes

- **WHEN** se comparan dos botones de la misma categoría (p. ej. «Registrar
  libro» y «Registrar cliente»)
- **THEN** ambos comparten la clase base `.btn` y difieren, si acaso, solo por
  modificadores

#### Scenario: Tablas envueltas en contenedor con clase

- **WHEN** se revisan las tablas de las vistas
- **THEN** cada `table` está dentro de un contenedor con clase
  `.tabla-contenedor` (requisito necesario para R-04)

### Requirement: Nomenclatura CSS consistente (R-09)

Las clases SHALL usar kebab-case y nombres descriptivos (p. ej.
`.libro-tarjeta`, `.venta-resumen`); los selectores SHALL ser simples y
específicos, sin anidación profunda (más de 3 niveles) ni `!important`
innecesario.

#### Scenario: Clases en kebab-case

- **WHEN** se listan las clases definidas en el CSS
- **THEN** todas usan kebab-case y nombres descriptivos de su propósito

#### Scenario: Selectores simples sin !important

- **WHEN** se revisan los selectores del CSS
- **THEN** no hay `!important` sin justificación documentada ni selectores con
  más de 3 niveles de anidación
