# SkillBridge AI

SkillBridge AI is a robust full-stack application designed to help college students in India identify skill gaps and generate actionable learning roadmaps using the Gemini AI. 

## Features
- **AI-Powered Roadmaps**: Generates week-by-week curriculum based on your current skills and target role.
- **Progress Tracking**: Mark weeks as completed and visualize progress.
- **Secure Authentication**: JWT-based login and registration.
- **Responsive UI**: Built with React, Tailwind CSS V4, and Framer Motion aesthetics.

## Tech Stack
- Frontend: React 19, React Router v7, Tailwind CSS 4, Vite
- Backend: Node.js, Express, MongoDB
- AI: Google Gemini 1.5 Flash API

## Setup Instructions

### Environment Variables
Create a `.env` file in the `server` directory using the `.env.example`:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Running Locally

1. **Install Dependencies**
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd client
   npm install
   ```

2. **Start Development Servers**
   Open two terminal windows.
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

3. Visit `http://localhost:5173` in your browser.
