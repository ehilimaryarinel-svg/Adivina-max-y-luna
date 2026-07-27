# Luna & Max — Selector de cachorritos 🐾

Componente web independiente: un selector deslizante que muestra de 1 a 12
cachorritos ilustrados en SVG. Cada cachorrito se puede tocar para alternar
el color de su lazo (niña = azul cielo pastel, niño = rosa pastel), y el
estado se guarda en `localStorage` del navegador.

## Archivos

- `index.html` — estructura de la página
- `styles.css` — estilos, paleta pastel y estilos del slider
- `script.js` — lógica: generación de los SVG, manejo del slider y
  persistencia en `localStorage` (sin dependencias externas)

## Ver en local

No requiere instalación ni build. Basta con abrir `index.html` en el
navegador, o servirlo con cualquier servidor estático, por ejemplo:

```bash
npx serve .
```

## Subir a GitHub

```bash
git init
git add .
git commit -m "Selector de cachorritos Luna & Max"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

## Desplegar en Vercel

1. Entra a [vercel.com](https://vercel.com) e inicia sesión.
2. **Add New… → Project** y selecciona el repositorio que acabas de subir.
3. Vercel detecta que es un sitio estático (sin framework) — no hace falta
   configurar ningún comando de build ni carpeta de salida especial.
4. Haz clic en **Deploy** y listo.

## Notas

- El estado de género de cada cachorrito se guarda con la clave
  `lunaMaxPuppyGenders` en `localStorage`, por cachorrito (`cachorro1`,
  `cachorro2`, etc.).
- Todo el arte de los cachorritos es SVG generado en `script.js`
  (módulo `PuppyArt`), así que es fácil ajustar colores de pelaje o
  agregar más tonos desde `furPalettes`.
