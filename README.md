# vehicle-maintenance-website

## 🚗 What is this

Vehicle-maintenance-website is a full-stack web application designed to help users track, log, and manage maintenance activities for their vehicles — services, repairs, maintenance history, reminders, etc.  

It provides a user-friendly interface (frontend) and a backend API/server to handle data, offering a simple solution for car/vehicle owners or small garages to monitor maintenance over time.

## 🛠️ Features

- User authentication (sign in / sign up)  
- Add, edit, delete maintenance records (service, repairs, reminders)  
- Store vehicle info + maintenance history  
- View history of maintenance per vehicle  
- (Optional/future) Reminders / notification for upcoming maintenance  
- (Optional/future) Support for multiple vehicles per user  

## 📁 Project Structure

Tech Stack
Frontend (myapp-frontend/)

Built with:
- JavaScript – core logic and dynamic UI updates
- HTML / CSS – page structure and styling
- Fetch API – communicates with the backend through REST requests

The frontend is responsible for:
- User interface and interaction
- Displaying vehicle information & maintenance logs
- Sending requests to the FastAPI backend
- Rendering JSON responses in the browser

Backend (myapp-backend/)
Powered by FastAPI, a modern, high-performance Python web framework.

Backend features:
- REST API endpoints for vehicles, maintenance logs, and users
- Pydantic models for data validation

The backend handles:
- All business logic
- Validation of incoming data
- Interaction with the database using SQLAlchemy
- Returning structured JSON responses to the frontend

Database Layer — SQLAlchemy
The project uses SQLAlchemy, a Python ORM, for full database management:
- Models for Vehicles, Maintenance Records, and Users
- Easy CRUD operations
- Safe session management
- Clean abstraction over SQL
- Flexible schema evolution
- SQLAlchemy ensures reliable, efficient database interaction with minimal boilerplate.

System Architecture: 
JavaScript Frontend
        ↓ (API Requests)
FastAPI Backend
        ↓ (ORM Calls)
  SQLAlchemy ORM
        ↓ (SQL)
     Database


## ✅ Getting Started — Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (for frontend)  
- [Python](https://www.python.org/) or backend dependencies (if backend is Python)  
- (Optionally) a database (e.g. PostgreSQL, SQLite, or whichever you configured)  
- Git

1) Clone the Repository
git clone https://github.com/flamedphoenix/vehicle-maintenance-website.git
cd vehicle-maintenance-website

Backend Setup (FastAPI + SQLAlchemy)
2) Install Backend Dependencies

Inside myapp-backend/:

cd myapp-backend
pip install -r requirements.txt


ajust the api in myapp-frontend/src/config.js for your setup
ajust the api accepted in origin located in myapp-backend/app/main.py

run deploy.sh to start the backend and frontend (ajust the script accordingly depending on your setup)

