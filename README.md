# MERN Stack Ticketing System

A complete support ticket management system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### 🔐 Authentication & Authorization
- Login and logout functionality
- Role-based access control (User, Admin, Support Agent)
- Users can only manage their own tickets

### 👤 User Dashboard
- Raise new tickets with subject, description, priority
- View ticket list with current status
- Add comments to tickets
- Track ticket status (Open, In Progress, Resolved, Closed)
- View ticket history with all comments

### 🎫 Ticket Management
- Full ticket lifecycle: Open → In Progress → Resolved → Closed
- Comment threads with timestamps and user info
- Ticket assignment tracking
- Priority levels (Low, Medium, High)

### 👑 Admin Panel
- User management (add/remove users, assign roles)
- View all tickets across the system
- Force reassign or resolve/close any ticket
- Monitor ticket statuses across users
- Comprehensive analytics dashboard

### 📊 Analytics (Admin Only)
- Ticket statistics and trends
- Performance metrics
- Support agent performance tracking
- User activity reports

## Tech Stack

- **Frontend**: React, React Router, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure
ticketing-system/
├── admin/ # Admin React frontend
├── client/ # Client React frontend
├── server/ # Node.js/Express backend
└── README.md

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ticketing-system.git
   cd ticketing-system

                                  //////////////////////////////////////////////////////////////////////////////////// TO RUN CODE///////////////////////////////////////////////////////////

Setup Backend
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev


Setup Client
cd ../client
npm install
npm run dev


Setup Admin Panel
cd ../admin
npm install
npm run dev



                            ///////////////////////////////////////////////////////////////// Passwords/////////////////////////////////////////

email":"admin@ticketsystem.com","password":"admin123


email":"agent1@ticketsystem.com","password":"agent123
email":"agent1@ticketsystem.com","password":"agent123



email":"user1@ticketsystem.com","password":"user123
email":"user2@ticketsystem.com","password":"user123 



                                          //////////////////////////////////////////////////////////Login issue invalid credentials USE THE BELOW COMMANDS IN INTEGRATED TERMINAL //////////////////////////////////////////////////


After your server is running (you see "Server running on port 5000"), run these commands in a separate PowerShell window:

# Admin User
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/create-user" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Admin User","email":"admin@ticketsystem.com","password":"admin123","role":"admin"}'

# Support Agents
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/create-user" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Support Agent 1","email":"agent1@ticketsystem.com","password":"agent123","role":"support_agent"}'
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/create-user" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Support Agent 2","email":"agent2@ticketsystem.com","password":"agent123","role":"support_agent"}'

# Regular Users
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/create-user" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Regular User 1","email":"user1@ticketsystem.com","password":"user123","role":"user"}'
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/create-user" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Regular User 2","email":"user2@ticketsystem.com","password":"user123","role":"user"}'
