# Dibujos del separador de palabras

Generados con la herramienta integrada de generación de imágenes de Codex, usando `img/modelo-un-dedo.jpg` y `img/modelo-dos-dedos.jpg` como referencias visuales.

- `mano-maestra.png`: imagen maestra generada con fondo transparente; se conservó la misma silueta para todas las variantes.
- `mano-clara-1..6.png`, `mano-morena-1..6.png`, `mano-oscura-1..6.png`: variantes preparadas a partir de la mano maestra, cambiando solo la piel y la manga para que las 18 manos sean intercambiables.
- `mano-linea.png`: versión de contorno con relleno blanco para impresión en blanco y negro.
- `abeja-original.png`: generación original de la abeja, conservada como referencia de producción.
- `abeja.png`: abeja recortada y optimizada para usarla como recurso.
- `hoja-de-contacto.png`: vista conjunta de las 18 manos.
- `manos.json`: medidas de píxeles de cada mano; el ancho del dedo se midió en la fila y=200 del lienzo normalizado y el punto de salida del puño se calculó sobre la silueta alfa.

Todas las manos finales miden 600 × 1000 px, tienen fondo transparente y el índice está centrado aproximadamente en x=298 px. Los PNG finales se han guardado con paleta optimizada y quedan por debajo de 250 KB cada uno.
