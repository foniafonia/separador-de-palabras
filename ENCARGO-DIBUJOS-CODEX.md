# Encargo para Codex · dibujos del «Separador de palabras»

## Qué necesito

Los **dibujos de la mano que señala** (y una abeja) para unas tiras que se imprimen y se plastifican. Las tiras ayudan a un niño a dejar espacio entre palabra y palabra: el dedo índice de la tira se pone justo donde acaba una palabra y el niño escribe la siguiente al otro lado.

Solo imágenes: **no toques el código**. Yo (Claude, otro hilo) las coloco después.

- Carpeta: `~/Developer/separador-de-palabras/`
- Deja todo en `~/Developer/separador-de-palabras/arte/` (carpeta nueva).
- **No hagas commit ni push.** No edites `index.html`, `app.js` ni `dibujo.js`.
- No uses ni pidas datos personales de nadie. No subas nada a ningún servicio salvo la generación de imágenes.

## El estilo: el de los dos dibujos adjuntos

Te adjunto los dos modelos de José (`img/modelo-un-dedo.jpg` y `img/modelo-dos-dedos.jpg`). **Copia ese estilo**: contorno grueso morado oscuro `#3A2449`, colores planos y alegres, manos redondeadas de dibujo infantil, mangas con dibujo (rayas, lunares, estrella, corazón, abejita).

**Lo más importante, que el intento anterior hizo mal:**
- Es un **puño cerrado con el ÍNDICE estirado hacia arriba**, señalando. El índice sale de la parte de arriba del puño, del lado del pulgar. **No es un pulgar arriba** («ok») y **no puede parecer otro gesto**: el dedo corazón y los demás van doblados dentro del puño, se ven sus nudillos.
- El dedo tiene forma de dedo: recto, largo, con la punta redondeada, uña pequeña en la punta vista de frente y una o dos arruguitas en el nudillo. Nada de formas blandas o deformes.
- Se ve la manga en la muñeca, abajo.

## Archivos que tienes que entregar

Todos PNG con **fondo transparente**, mano mirando de frente, dedo vertical y centrado.

| Archivo | Qué |
|---|---|
| `arte/mano-clara-1.png` … `mano-clara-6.png` | Piel clara, 6 mangas distintas (ver tabla de mangas) |
| `arte/mano-morena-1.png` … `mano-morena-6.png` | Piel morena, las mismas 6 mangas |
| `arte/mano-oscura-1.png` … `mano-oscura-6.png` | Piel oscura, las mismas 6 mangas |
| `arte/mano-linea.png` | La misma mano solo en contorno (relleno blanco), para imprimir en blanco y negro |
| `arte/abeja.png` | La abejita de ColmenIA del dibujo de José, sola |
| `arte/manos.json` | Medidas de cada mano (ver abajo) |
| `arte/hoja-de-contacto.png` | Todas las manos juntas en una sola imagen, para revisarlas de un vistazo |
| `arte/LEEME.md` | Con qué herramienta y qué instrucción generaste cada imagen |

Mangas (iguales en las tres pieles):

| Nº | Manga |
|---|---|
| 1 | Azul turquesa con rayas blancas |
| 2 | Amarilla con lunares blancos |
| 3 | Morada con un corazón blanco |
| 4 | Verde con una abejita |
| 5 | Rosa con lunares blancos |
| 6 | Azul con una estrella blanca |

**Las 18 manos tienen que ser la misma mano** (misma forma y postura; solo cambian piel y manga), para que se puedan cambiar sin que salte el dibujo.

## Tamaño y medidas (imprescindible)

- Lienzo de cada mano: **600 × 1000 px**, la mano ocupándolo casi entero, sin aire de sobra arriba ni a los lados.
- El dedo índice, de pie, **centrado en horizontal** en el lienzo.
- En `manos.json`, para cada archivo de mano: `ancho`, `alto`, `dedo_centro_x`, `dedo_ancho` (en px, medido a la altura del nudillo, contando el contorno), `dedo_punta_y` (lo más alto del dedo) y `puno_arriba_y` (la altura donde el dedo sale del puño). Mídelo en los píxeles de verdad, no a ojo. Con eso escalo el dibujo para que el dedo impreso mida exactamente 1, 1,4 o 1,8 cm.
- Peso: cada PNG por debajo de **250 KB** (redúcelo con pngquant u oxipng si hace falta).

## Colores (los de los dibujos de José)

| Uso | Color |
|---|---|
| Contorno | `#3A2449` |
| Piel clara / morena / oscura | `#FAD3AA` / `#E3A06C` / `#A0653C` (sombras suaves del mismo tono) |
| Mangas | turquesa `#22A39C`, amarillo `#F5C431`, morado `#8E5CC9`, verde `#5CC98A`, rosa `#E84D8A`, azul `#3B7DD8` |

## Cuando acabes

Dime en una línea qué archivos hay en `arte/` y si alguno no te ha salido bien.
