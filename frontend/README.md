# Churin Frontend

React frontend for the Churin restaurant ordering system.

## Setup

Create `frontend/.env` from the example file:

```bash
cp .env.example .env
```

Set the backend API URL:

```text
REACT_APP_BACKEND_URL=http://localhost:10000
```

## Available Scripts

```bash
npm ci
npm start
npm run build
npm test -- --watchAll=false
```

## Notes

- The app uses Firebase Authentication for user sessions.
- API requests are sent to the Express backend configured through `REACT_APP_BACKEND_URL`.
- See the root README for full-stack setup, backend variables, and deployment notes.
