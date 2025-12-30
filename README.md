# CodeAlpha Project Management Tool

A modern, production-ready project management application built with React, Mantine UI, Express.js, and MongoDB.

## Features

- **Robust Authentication**: Secure JWT-based registration and login.
- **Project Tracking**: Create, update, and manage projects with status tracking.
- **Task Management**: Granular task control with priority, status, and assignment.
- **Team Collaboration**: Organize users into teams and assign them to projects.
- **Responsive UI**: Premium, modern interface built with Mantine UI.
- **Secure Persistence**: Custom `secureStorage` implementation for sensitive data.

## Project Structure

### Backend (`/backend`)

- `src/controllers`: Business logic for auth, projects, tasks, and teams.
- `src/models`: Mongoose schemas.
- `src/middleware`: Auth protection and error handling.
- `src/routes`: API endpoint definitions.
- `src/interfaces`: TypeScript definitions for backend models and requests.

### Frontend (`/frontend`)

- `src/api`: Axios instance and service layer.
- `src/components`: Reusable UI components and route guards.
- `src/context`: Authentication, theme, and project data management.
- `src/pages`: Feature-specific page components.
- `src/interfaces`: Centralized TypeScript interfaces.
- `src/hooks`: Custom React hooks (e.g., `useAuth`).

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or remote instance)

### Setup

1. **Clone the repository**
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create .env with MONGODB_URI and JWT_ACCESS_SECRET
   npm run dev
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Technology Stack

- **Frontend**: React, Mantine UI, Lucide Icons, Axios, React Router.
- **Backend**: Node.js, Express, Mongoose, JWT, bcryptjs.
- **Database**: MongoDB.
