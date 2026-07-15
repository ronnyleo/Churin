# Churin - Sistema de pedidos para restaurante

Aplicacion web para consultar menu, armar un carrito, registrar pedidos y administrar platos de un restaurante. El proyecto esta separado en un frontend React y un backend Express conectado a PostgreSQL, con integracion de Firebase Authentication, Cloudinary para imagenes y notificaciones por Telegram.

## Stack principal

- Frontend: React 18, React Router, Firebase Auth, Axios, Tailwind CSS, Material UI.
- Backend: Node.js, Express, pg-promise/PostgreSQL, Multer, Sharp, Cloudinary.
- Integraciones: Firebase, Cloudinary, Telegram Bot API.

## Estructura

```text
backend/
  controllers/      Logica HTTP por dominio
  models/           Consultas SQL y acceso a datos
  routes/           Definicion de endpoints Express
  notifications/    Integraciones de notificacion
frontend/
  src/app/          Router, providers y contextos
  src/features/     Modulos por funcionalidad
  src/shared/       UI, estilos y librerias compartidas
```

## Requisitos

- Node.js 18 o superior recomendado.
- PostgreSQL disponible.
- Credenciales para Firebase, Cloudinary y Telegram si se quieren probar esas integraciones.

## Configuracion

Copia las plantillas de entorno y completa los valores locales:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Variables backend:

```text
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_IDS=
```

Variable frontend:

```text
REACT_APP_BACKEND_URL=http://localhost:10000
```

## Instalacion y ejecucion

Backend:

```bash
cd backend
npm ci
npm start
```

Frontend:

```bash
cd frontend
npm ci
npm start
```

La API corre por defecto en `http://localhost:10000` y el frontend de Create React App en `http://localhost:3000`.

## Scripts utiles

Backend:

```bash
npm start
npm audit --omit=dev
```

Frontend:

```bash
npm start
npm run build
npm test -- --watchAll=false
npm audit --omit=dev
```

## Estado de calidad

- Hay separacion entre frontend y backend, con carpetas por dominio en ambos lados.
- El proyecto incluye plantillas `.env.example` para evitar exponer credenciales.
- Antes de presentarlo a un cliente conviene ejecutar auditoria de dependencias, pruebas y una limpieza de archivos generados del historial de Git.

## Notas para despliegue

- Configurar variables de entorno en el proveedor de hosting, no en archivos versionados.
- Rotar credenciales si alguna vez se compartio un `.env` real.
- Verificar CORS para el dominio final del frontend.
- Subir imagenes a Cloudinary y evitar persistir uploads temporales en el repositorio.
