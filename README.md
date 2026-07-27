# 🐾 Luna & Max — ¿Cuántos cachorritos vendrán?

Sitio web tipo quiniela para que familiares y amigos adivinen cuántos cachorritos van a tener Luna (mamá) y Max (papá, estilo Labrador). Es un sitio 100% estático (HTML, CSS y JavaScript puro), sin backend ni base de datos: cada persona que entra guarda su apuesta en el `localStorage` de su propio navegador y la ve reflejada en el muro de la comunidad de ese mismo dispositivo.

## 📁 Archivos del proyecto

```
luna-max-quiniela/
├── index.html      → estructura de la página
├── styles.css       → estilos, paleta de colores y animaciones
├── script.js        → toda la lógica (camita, formulario, muro, admin, confeti)
└── README.md        → este archivo
```

No se necesita instalar nada ni correr `npm install`: es HTML/CSS/JS plano.

## 🚀 Cómo subirlo a GitHub

1. Crea un repositorio nuevo en GitHub (por ejemplo `luna-max-quiniela`).
2. Descomprime este ZIP en una carpeta local.
3. Dentro de esa carpeta, abre una terminal y ejecuta:

```bash
git init
git add .
git commit -m "Primer commit: sitio Luna & Max"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/luna-max-quiniela.git
git push -u origin main
```

## ▲ Cómo desplegarlo en Vercel

1. Entra a [vercel.com](https://vercel.com) e inicia sesión (puedes usar tu cuenta de GitHub).
2. Haz clic en **"Add New... → Project"**.
3. Selecciona el repositorio `luna-max-quiniela` que acabas de subir.
4. Vercel detectará automáticamente que es un sitio estático — no necesitas cambiar ningún ajuste de "Build Command" ni "Output Directory". Solo dale **Deploy**.
5. En un par de minutos tendrás una URL pública (algo como `luna-max-quiniela.vercel.app`) que puedes compartir por WhatsApp, Instagram o Facebook.

## 🔒 Panel de la dueña (administración)

- Al final de la página hay un pequeño ícono de candado 🔒 (poco visible a propósito, junto al pie de página).
- Al tocarlo pedirá una contraseña. La contraseña por defecto es:

  ```
  LunaYMax2026
  ```

- **Para cambiarla:** abre `script.js` y edita esta línea cerca del inicio del archivo:

  ```js
  const ADMIN_PASSWORD = 'LunaYMax2026';
  ```

  Cambia el texto entre comillas por la contraseña que prefieras y vuelve a subir el cambio a GitHub (Vercel lo redesplegará automáticamente).

- Desde el panel puedes:
  - **Publicar el resultado real** (número de cachorritos que nacieron y, opcionalmente, la fecha). Esto activa el "Modo Celebración": aparece un banner especial, se lanza confeti 🎉 y en el muro se resalta automáticamente a quienes adivinaron el número exacto o quienes más se acercaron.
  - **Reiniciar el concurso**, borrando todas las apuestas guardadas y el resultado (por si quieres volver a usar el sitio para una futura camada).

## ⚠️ Importante sobre `localStorage`

Como el sitio no tiene una base de datos compartida, cada apuesta se guarda en el navegador de la persona que la envió. Esto significa:

- Si alguien participa desde su teléfono, su apuesta se verá en el muro **de su propio teléfono**, pero no aparecerá automáticamente en el teléfono de otra persona ni en el tuyo.
- El botón de "Publicar resultado" del panel de administración también solo actualiza el `localStorage` del dispositivo desde el que lo publiques.

Este enfoque es ideal para una demo rápida, ligera y sin costos de servidor. Si más adelante quieres que **todas** las apuestas se vean en un muro compartido de verdad (en cualquier dispositivo), lo siguiente sería conectar un backend simple (por ejemplo Firebase Firestore) — con gusto puedo ayudarte a hacer esa versión si la necesitas.

## 🎨 Personalización rápida

- **Colores:** están definidos como variables al inicio de `styles.css` (busca `:root`), así que puedes ajustar la paleta cambiando esos valores hexadecimales.
- **Tonos de pelaje:** en `script.js`, la lista `FUR_SHADES` controla los colores disponibles para personalizar a cada cachorrito.
- **Máximo de cachorritos:** el selector va de 1 a 12; para cambiarlo, edita los atributos `min`/`max` del `<input id="puppySlider">` en `index.html`.

---
Hecho con 💛 para Luna & Max 🐾
