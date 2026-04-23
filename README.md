# Notesphere
Full-stack web application for Diploma CSE students (SBTE).

## Tech Stack
- Frontend: React.js + Tailwind CSS (Vite)
- Backend: Node.js + Express.js
- Database: MongoDB (Mongoose)
- Auth: JWT + bcrypt
- File Upload: Multer (PDF only)

## Setup
1. Backend: `cd server && npm install && cp .env.example .env && npm run dev`
2. Frontend: `cd client && npm install && npm run dev`
3. MongoDB Atlas: Add connection string to server/.env
4. Admin account: Register first user as admin manually or via seed.

## Project Structure
```
.
├── client/          # React frontend
├── server/          # Node/Express backend
├── uploads/         # Static file uploads
└── README.md
```

## Environment Variables (server/.env)
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
```

## Deployment
- Frontend: Vercel
- Backend: Render
- DB: MongoDB Atlas

