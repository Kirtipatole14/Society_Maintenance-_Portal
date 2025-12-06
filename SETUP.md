# Setup Guide

## Quick Start

### 1. Database Setup

1. Install MySQL if not already installed
2. Start MySQL service
3. Create database (or it will be created automatically):
```sql
CREATE DATABASE IF NOT EXISTS society_maintenance;
```

4. Update `backend/src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Build the project (first time)
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time)
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## First Time Usage

1. **Register as Admin**: Go to Register page and select "Admin" role
2. **Login as Admin**: Login with your admin credentials
3. **Approve Users**: In Admin Dashboard, approve any pending residents or managers
4. **Use the Portal**: 
   - Residents can login after approval and use resident features
   - Managers can login after approval and use manager features

## Troubleshooting

### Backend Issues

- **Port 8080 already in use**: Change port in `application.properties`:
  ```properties
  server.port=8081
  ```

- **Database connection error**: 
  - Verify MySQL is running
  - Check credentials in `application.properties`
  - Ensure database exists

- **JWT errors**: Check `jwt.secret` in `application.properties`

### Frontend Issues

- **Port 3000 already in use**: Vite will automatically use next available port
- **API connection errors**: 
  - Ensure backend is running on port 8080
  - Check CORS configuration in backend
  - Verify proxy settings in `vite.config.js`

### Common Issues

- **Users can't login after registration**: Admin needs to approve them first
- **CORS errors**: Backend CORS is configured for `http://localhost:3000`
- **Token expired**: Logout and login again (tokens expire after 24 hours)

## Development

### Backend Development
- Main application: `backend/src/main/java/com/society/maintenanceportal/SocietyMaintenancePortalApplication.java`
- Controllers: `backend/src/main/java/com/society/maintenanceportal/controller/`
- Services: `backend/src/main/java/com/society/maintenanceportal/service/`
- Models: `backend/src/main/java/com/society/maintenanceportal/model/`

### Frontend Development
- Main app: `frontend/src/App.jsx`
- Pages: `frontend/src/pages/`
- Components: `frontend/src/components/`
- API service: `frontend/src/services/api.js`

## Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/maintenance-portal-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Output will be in frontend/dist/
```

