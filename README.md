# Fórmula Exacta

Sitio web de una academia online de Matemáticas, Física y Cálculo. El frontend está desarrollado con React y Vite; el backend usa Node.js, Express y MongoDB Atlas. El chatbot usa la API de OpenAI y responde con información propia de la academia.

## Estructura

- `Frontend/react-app`: aplicación React que se publica en GitHub Pages.
- `Backend`: API de Express, conexión con MongoDB y endpoint del chatbot.
- `Frontend/HTML`: versión estática anterior conservada como referencia.

## Ejecutar localmente

1. Copia `Backend/.env.example` a `Backend/.env` y completa las credenciales localmente. No subas `.env` a GitHub.
2. En `Backend`, instala dependencias con `npm install` e inicia el servidor con `npm run dev`.
3. En `Frontend/react-app`, instala dependencias con `npm install` e inicia Vite con `npm run dev`.
4. La aplicación local usa `http://localhost:2323/api`. MongoDB Atlas debe permitir la IP pública de tu laptop mientras desarrollas.

## Publicación

GitHub Pages publica el frontend; no ejecuta Express ni conecta directamente con MongoDB. Para habilitar formularios, login y chatbot en internet:

1. Publica `Backend` en un servicio que ejecute Node.js 22 o posterior.
2. Configura en ese servicio las variables de `Backend/.env.example`, usando valores secretos reales. La clave de OpenAI va únicamente en el backend; nunca en una variable `VITE_*`.
3. En MongoDB Atlas, autoriza la salida de red del servicio donde alojes el backend. La IP de tu laptop solo sirve para desarrollo. Usa un usuario de base de datos con permisos limitados y guarda la URI como variable secreta.
4. En GitHub abre **Settings → Secrets and variables → Actions → Variables** y agrega `VITE_API_URL` con la URL pública del backend terminada en `/api` (por ejemplo, `https://tu-api.example.com/api`).
5. En **Settings → Pages**, selecciona **GitHub Actions** como método de publicación.
6. En el backend configura `FRONTEND_URL` con `https://dlwidxk.github.io` y el origen local `http://localhost:5173`, separados por coma.
7. Sube los commits a la rama `main`. El workflow compila y publica el frontend en `https://dlwidxk.github.io/Proyecto_JC/`.

El workflow se detiene si no existe `VITE_API_URL`, para evitar publicar accidentalmente una app que intenta llamar a `localhost`.
