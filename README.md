# Society Maintenance Portal

A comprehensive web application for managing society maintenance operations with separate modules for Admin, Resident, and Manager roles.

## Features

### Admin Module
- Register and login
- Verify/Approve/Reject residents and managers
- View all users (residents and managers)

### Resident Module
- Register and login (requires admin approval)
- View notices posted by managers
- Raise complaints
- Pay maintenance fees

### Manager Module
- Register and login (requires admin approval)
- Post notices
- Resolve complaints raised by residents
- Approve/Reject maintenance payments
- Update maintenance status

## Tech Stack

### Backend
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- React 18
- React Router DOM
- Axios
- Tailwind CSS
- Vite

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Setup Instructions

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE society_maintenance;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Admin
- `GET /api/admin/pending-users` - Get pending users
- `GET /api/admin/residents` - Get all residents
- `GET /api/admin/managers` - Get all managers
- `PUT /api/admin/verify-user/{userId}` - Verify user (APPROVED/REJECTED)

### Resident
- `GET /api/resident/notices` - Get all notices
- `POST /api/resident/complaints` - Create complaint
- `GET /api/resident/complaints` - Get my complaints
- `POST /api/resident/payments` - Create payment
- `GET /api/resident/payments` - Get my payments

### Manager
- `POST /api/manager/notices` - Create notice
- `GET /api/manager/notices` - Get all notices
- `DELETE /api/manager/notices/{id}` - Delete notice
- `GET /api/manager/complaints` - Get all complaints
- `PUT /api/manager/complaints/{id}/resolve` - Resolve complaint
- `GET /api/manager/payments` - Get all payments
- `PUT /api/manager/payments/{id}/approve` - Approve payment
- `PUT /api/manager/payments/{id}/reject` - Reject payment
- `GET /api/manager/maintenance` - Get all maintenance records
- `PUT /api/manager/maintenance/{id}/status` - Update maintenance status

## Default Configuration

- Backend Port: 8080
- Frontend Port: 3000
- Database: MySQL on localhost:3306
- JWT Secret: Configured in application.properties
- JWT Expiration: 24 hours

## Usage

1. First, register an Admin account
2. Login as Admin and approve other users (Residents and Managers)
3. Residents can then login and use their features
4. Managers can login and manage complaints, payments, and notices

## Project Structure

```
Society_project/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/society/maintenanceportal/
│   │       │   ├── controller/
│   │       │   ├── service/
│   │       │   ├── repository/
│   │       │   ├── model/
│   │       │   ├── security/
│   │       │   └── dto/
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Notes

- All users except Admin need approval from Admin before they can login
- JWT tokens are stored in localStorage
- CORS is configured to allow requests from localhost:3000
- The application uses responsive design with Tailwind CSS
