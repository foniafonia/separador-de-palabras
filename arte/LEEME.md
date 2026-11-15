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

## Ejemplos de uso y pasos de impresión

Las imágenes nuevas de este encargo se generaron con la herramienta integrada de generación de imágenes de Codex (`image_gen`), usando como referencias los modelos de `img/`, las manos de `arte/` y, para la cabecera, `arte/abeja.png`. Se pidió explícitamente el contorno morado `#3A2449`, colores planos, estilo infantil limpio, tiras sin texto y puño cerrado con un único índice extendido.

- `ejemplo-cruzando.png`: cuaderno visto desde arriba, «el gato» a lápiz y tira turquesa cruzando el renglón; el dedo ocupa el hueco después de «el».
- `ejemplo-debajo.png`: «mi casa es» a lápiz y tira coral colocada debajo y paralela al renglón; el dedo sube donde termina una palabra.
- `ejemplo-dos-dedos.png`: tira lila cruzando el renglón, con un índice en cada extremo y «sol» entre ambos.
- `ejemplo-familia.png`: adulto y niño en la mesa; el niño escribe y sujeta el separador.
- `paso-imprimir.png`: impresora sacando una hoja con tiras de colores.
- `paso-recortar.png`: tijeras recortando una tira por la línea de puntos, con borde blanco.
- `paso-plastificar.png`: tira entrando en una plastificadora y saliendo con brillo.
- `paso-usar.png`: tira plastificada sobre un cuaderno, lista para usar.
- `cabecera.png`: descartada (los dedos parecían el corazón, no el índice).

Las escenas de ejemplo quedaron en 1200 × 800 px, los pasos en 800 × 800 px y la cabecera en 1600 × 700 px. Después de generarlas se redimensionaron y se guardaron como PNG indexados optimizados; todos los archivos nuevos pesan menos de 350 KB.
