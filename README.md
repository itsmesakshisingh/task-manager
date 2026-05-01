Project Name: Team Task Manager

Description:
This is a full-stack task management application where users can register, login, and manage their daily tasks efficiently.

Tech Stack:
Frontend: React.js
Backend: Node.js, Express.js
Database: MongoDB Atlas
Deployment:

* Frontend: Vercel
* Backend: Railway

Features:

* User Signup and Login (Authentication using JWT)
* Add new tasks
* Mark tasks as completed
* Delete tasks
* Persistent storage using MongoDB
* Secure API routes

How to Run Locally:

1. Clone the repository:
   git clone https://github.com/itsmesakshisingh/task-manager

2. Install backend dependencies:
   cd backend
   npm install

3. Install frontend dependencies:
   cd ../frontend
   npm install

4. Run backend server:
   cd ../backend
   npm run dev

5. Run frontend:
   cd ../frontend
   npm start

6. Open browser:
   http://localhost:3000

Environment Variables:
Backend (.env):
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Frontend (.env):
REACT_APP_API=https://your-backend-url.up.railway.app

Live Application URL:
https://task-manager-black-theta.vercel.app

GitHub Repository:
https://github.com/your-username/task-manager
