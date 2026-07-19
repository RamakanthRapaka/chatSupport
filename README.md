# Toolancer Chat Support Service

This project is the realtime chat service for Toolancer.

It works alongside:
- React frontend: `C:\xampp\htdocs\toolancer-react-tailwind`
- FastAPI backend: `C:\xampp\htdocs\fastapi_backend`

## What it does

- accepts Socket.IO client connections
- authenticates users by validating the FastAPI access token
- joins users into conversation rooms
- broadcasts new messages in realtime
- broadcasts read-status updates in realtime

FastAPI remains the source of truth for:
- authentication
- conversation access
- message persistence
- unread counts

This Node service is only for realtime delivery.

## Requirements

- Node.js 18+ recommended
- running FastAPI backend
- running React frontend

## Installation

```bash
npm install
```

## Environment setup

Create a `.env` file in this folder based on `.env.example`.

Example:

```env
PORT=4001
FRONTEND_URL=http://localhost:5173
FASTAPI_BASE_URL=https://toolancer-back-end.vercel.app/api/v1
```

## Run locally

```bash
npm run dev
```

For production:

```bash
npm start
```

## Frontend setup

In the frontend project, set:

```env
VITE_CHAT_SOCKET_URL=http://localhost:4001
```

## Chat flow

1. User logs in from the React app.
2. User opens an expert profile and clicks `Send Message`.
3. React creates or fetches the conversation through FastAPI.
4. React joins the Socket.IO room for that conversation.
5. Messages are saved through FastAPI.
6. Saved messages are broadcast through this Node service.
7. Read updates are also broadcast through this Node service.

## Main events

Client to server:
- `join_conversation`
- `leave_conversation`
- `broadcast_message`
- `broadcast_read`

Server to client:
- `message_created`
- `conversation_read`

## Notes

- Do not commit your real `.env` file.
- Keep FastAPI running because this service depends on it for token validation and conversation access checks.
- If you deploy this service separately, update `VITE_CHAT_SOCKET_URL` in the frontend.
