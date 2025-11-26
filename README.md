# webapp-auth-crud

This is a full-stack web application built for the **Frontend Developer Intern Assignment**.  
It includes:

- React (Vite) frontend  
- TailwindCSS UI components  
- React Router for routing & protected routes  
- Context API for authentication state  
- Node.js + Express backend  
- MongoDB (Mongoose) database  
- JWT authentication  
- CRUD operations  
- Secure API integration  

## Tech Stack

### Frontend
- React (Vite)
- TailwindCSS
- React Router
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB (Atlas) + Mongoose
- JWT Authentication
- bcrypt password hashing
- CORS
- dotenv

## Features
### Authentication
- Login
- Register
- Logout
- Protected dashboard

### Dashboard
- Fetch user profile
- Create, Read, Update, Delete tasks/notes
- Search & filter
- Responsive UI

### Security
- Password hashing with bcrypt
- JWT auth middleware
- Protected API routes
- Input validation
- Error handling

## How to Run

### 1. Clone the repository
```bash
git clone <repo-url>
cd webapp-auth-crud
2. Install frontend dependencies
cd frontend
npm install
npm run dev

3. Install backend dependencies
cd backend
npm install
npm start

4. Environment variables (.env)
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

API Endpoints
Auth

POST /auth/register

POST /auth/login

POST /auth/logout

GET /auth/me

Tasks/Notes

GET /notes

POST /notes

PUT /notes/:id

DELETE /notes/:id

Postman Collection

A Postman collection is included in the repo for testing all APIs.