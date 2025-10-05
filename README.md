# Kanva

<img align=center width="250" height="70" alt="kanva-logo" src="https://github.com/user-attachments/assets/3e8ded10-9264-46cc-ab01-efdaf629fb4e" />


A collaborative project management application built with modern web technologies. This Kanva provides real-time Kanban board functionality with comprehensive project management features.

<p align="center">
  <a href="https://github.com/adityadutt29">
    <img alt="GitHub: Aditya Dutt" src="https://img.shields.io/github/followers/adityadutt29?style=social" target="_blank" />
  </a>
</p>

## Demo Video

[![Demo Video](https://img.youtube.com/vi/ebUVfSngQGM/0.jpg)](https://www.youtube.com/watch?v=ebUVfSngQGM)


## Screenshots
<img width="1444" height="834" alt="1" src="https://github.com/user-attachments/assets/6d195989-7140-4de5-9394-6d3bb1f2eda6" />
<img width="1443" height="837" alt="2" src="https://github.com/user-attachments/assets/eff9542d-e846-4592-9d84-977da66ccaa9" />
<img width="1442" height="835" alt="3" src="https://github.com/user-attachments/assets/a345ccd4-4b13-4dea-b21a-15aa26e22685" />
<img width="1447" height="841" alt="4" src="https://github.com/user-attachments/assets/7e2923a0-0f79-48d5-9f18-d3ff6b6c7381" />


## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Seed Script](#seed-script)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Known Limitations & Next Steps](#known-limitations--next-steps)
- [Support](#support)
- [Contributing](#contributing)
- [License](#license)

## Overview

This is a full-featured Kanva built for learning purposes with a focus on real-time collaboration, scalability, and modern web development practices. The application allows users to create workspaces, boards, lists (columns), and cards to organize and track their work effectively.

## 🚀 Features

### Core Features
- **User Authentication**: Login/Register with JWT token authentication
- **Workspaces**: Organize multiple projects in separate workspaces
- **Boards**: Create/update/delete boards with customizable backgrounds
- **Real-time Collaboration**: WebSocket-powered real-time updates for all board activities
- **Cards & Lists**: Add/update/move/delete cards across lists with drag-and-drop functionality
- **Background Images**: Library of background images for boards (via Unsplash integration)
- **Labels & Assignments**: Add labels to cards and assign them to users
- **Detailed Descriptions**: Rich text editor for detailed card descriptions
- **User Invitations**: Invite users to boards via email

### Advanced Features
- **Comments**: Add and manage comments on cards with real-time updates
- **Activity Log**: Comprehensive activity tracking for all board operations
- **Search & Filters**: Powerful search and filtering capabilities across boards
- **Activity Sidebar**: Dedicated sidebar for viewing real-time activity updates
- **Real-time Updates**: Live updates for card moves, comments, and other collaborative actions
- **Fractional Positioning**: Advanced ordering system for precise card/column positioning
- **Email Notifications**: Email notifications for board invitations and other events

## Tech Stack

### Frontend
- **Next.js** - React framework with server-side rendering
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Material-UI (MUI)** - Comprehensive UI component library
- **Redux Toolkit** - State management with RTK Query
- **Socket.IO Client** - Real-time WebSocket communication
- **Quill Editor** - Rich text editor for card descriptions

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe server code
- **Socket.IO** - Real-time WebSocket server
- **MongoDB** - NoSQL database with native driver
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service for notifications

### Development & Deployment
- **ESLint** - Code linting
- **Git** - Version control
- **Vercel** - Frontend deployment

## Project Structure

The project is organized into two main directories:

```
kanva/
├── backend/              # Backend server with API routes
│   ├── pages/api/        # API endpoints
│   ├── util/             # Utility functions (DB, auth, WS)
│   ├── scripts/          # Scripts (seed, etc.)
│   └── ...
├── frontend/             # Frontend application
│   ├── pages/            # Next.js pages
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── slices/       # Redux Toolkit slices
│   │   ├── styles/       # CSS and styling
│   │   └── types/        # TypeScript type definitions
│   └── ...
├── docs/                 # Documentation (HLD, LLD)
└── ...
```

## Requirements

1. [Node.js](https://nodejs.org/) (v14 or higher)
2. [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
3. [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
4. [Unsplash API Key](https://unsplash.com/developers) (for background images)

## Installation

1. **Clone the repository:**
   ```bash
       git clone https://github.com/adityadutt29/kanva.git
       cd kanva
       ```

2. **Install dependencies for both projects:**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

## Environment Variables

### Backend Configuration

Create `backend/.env` and add the environment variables (see `backend/.env.example` for reference):

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=kanva

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=smtp-user@example.com
SMTP_PASS=smtp-password
FROM_EMAIL=no-reply@yourdomain.com

# WebSocket Configuration
FRONTEND_URL=http://localhost:3000

# CORS Origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend Configuration

Create `frontend/.env.local` and add the environment variables (see `frontend/.env.example` for reference):

```bash
NEXT_PUBLIC_UNSPLASH_API=<your_unsplash_key>
```

## Running the Application

Start both the backend and frontend servers in separate terminals:

### Backend Server
```bash
cd backend
npm run dev
```
The backend server will run on `http://localhost:3001`

### Frontend Server
```bash
cd frontend
npm run dev
```
The frontend application will run on `http://localhost:3000`

## Seed Script

To populate the database with sample data for development and testing:

```bash
cd backend
npm run seed
# or if you have ts-node installed globally:
npx ts-node scripts/seed.ts
```

The seed script creates:
- 1 sample user (demo@example.com, password: password123)
- 1 sample board (Project Roadmap)
- 5 sample columns (Backlog, To Do, In Progress, Review, Done)
- 5 sample cards across all columns
- 3 sample comments
- 4 sample activity log entries

## Architecture

For detailed architectural information:
- [High-Level Design (HLD)](./docs/hld.md) - Overview of system architecture and components
- [Low-Level Design (LLD)](./docs/lld.md) - Detailed implementation specifications, database schema, and API definitions

## Known Limitations & Next Steps

### Current Limitations
- Horizontal scaling requires Redis for WebSocket adapter
- Mobile responsiveness could be improved further
- Advanced permission management is not fully implemented
- Some UI components may need performance optimization for very large boards

### Next Steps
- Add comprehensive unit and integration tests (Cypress/Jest)
- Implement advanced board permissions and roles
- Add more real-time collaborative features (live cursors, presence indicators)
- Implement offline support with service workers
- Add more advanced filtering and search capabilities
- Implement board templates and custom fields
- Add file attachments to cards
- Enhance activity tracking with more detailed analytics

## 📄 License

This project is licensed under the terms specified in the LICENSE file.

## 📞 Contact
For any questions or support, please contact:
- **Aditya Dutt** | [Github](https://github.com/adityadutt29) | [Linkedin](https://www.linkedin.com/in/adityadutt29/).
- **Email**: <adityadutt29@yahoo.com>

---

<div align="center">
A Project made by <b>Aditya Dutt</b>
</div>
