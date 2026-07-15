# Churin - Restaurant Ordering System

Churin is a full-stack restaurant ordering and menu management application. Customers can browse the menu, customize dishes, manage a cart, place orders, and continue the checkout flow through WhatsApp. Administrators can review orders and manage menu items from an internal dashboard.

## Tech Stack

- Frontend: React 18, React Router, Firebase Authentication, Axios, Tailwind CSS, Material UI.
- Backend: Node.js, Express, PostgreSQL, pg-promise, Multer, Sharp, Cloudinary.
- Integrations: Firebase, Cloudinary, Telegram Bot API, WhatsApp checkout links.

## Project Structure

```text
backend/
  controllers/      HTTP handlers by domain
  models/           SQL queries and data access
  routes/           Express API routes
  notifications/    External notification helpers
frontend/
  src/app/          Router, providers, and global context
  src/features/     Feature-based application modules
  src/shared/       Shared UI, styles, and utilities
```

## Requirements

- Node.js 18 or newer recommended.
- PostgreSQL database.
- Firebase project for authentication.
- Cloudinary account for image uploads.
- Telegram bot credentials if order notifications are enabled.

## Environment Setup

Create local environment files from the provided examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Backend variables:

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

Frontend variable:

```text
REACT_APP_BACKEND_URL=http://localhost:10000
```

## Installation and Local Development

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

By default, the API runs on `http://localhost:10000` and the React app runs on `http://localhost:3000`.

## Useful Commands

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

## Current Quality Notes

- The project is organized as separate frontend and backend applications.
- Environment examples are included so real credentials do not need to be committed.
- Generated folders such as `node_modules`, `frontend/build`, and upload artifacts should stay out of version control.
- Before using this as a public portfolio project, rotate any credentials that were previously committed and run a fresh dependency audit.

## Deployment Notes

- Configure all production secrets through the hosting provider, not through committed files.
- Update CORS origins for the final frontend domain.
- Store uploaded images in Cloudinary and keep temporary upload files out of Git.
- Rebuild the frontend after changing `REACT_APP_BACKEND_URL`.
