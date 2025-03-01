# Task Manager API

## Overview
This is a simple Task Manager API that allows users to register, authenticate, and manage their tasks.

## Setup
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd task-manager
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and set environment variables:
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret-key>
   ```
4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### User Authentication

#### Register a new user
- **Linux/macOS:**
  ```sh
  curl -X POST http://localhost:5000/api/auth/register \
       -H "Content-Type: application/json" \
       -d '{"username": "testuser", "email": "test@email.com", "password": "password123"}'
  ```
- **PowerShell:**
  ```powershell
  $body = @{ username = "testuser"; email = "test@email.com"; password = "password123" } | ConvertTo-Json
  Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
  ```

#### Login
- **Linux/macOS:**
  ```sh
  curl -X POST http://localhost:5000/api/auth/login \
       -H "Content-Type: application/json" \
       -d '{"email": "test@email.com", "password": "password123"}'
  ```
- **PowerShell:**
  ```powershell
  $body = @{ email = "test@email.com"; password = "password123" } | ConvertTo-Json
  $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
  $token = $response.token
  ```

### Task Management

#### Get All Tasks
- **Linux/macOS:**
  ```sh
  curl -X GET http://localhost:5000/api/tasks \
       -H "Authorization: Bearer YOUR_TOKEN"
  ```
- **PowerShell:**
  ```powershell
  $headers = @{ Authorization = "Bearer $token" }
  Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method Get -Headers $headers
  ```

#### Create a Task
- **Linux/macOS:**
  ```sh
  curl -X POST http://localhost:5000/api/tasks \
       -H "Authorization: Bearer YOUR_TOKEN" \
       -H "Content-Type: application/json" \
       -d '{"title": "New Task", "description": "Task details", "status": "Pending", "priority": "High", "dueDate": "2025-02-28T23:59:59.000Z"}'
  ```
- **PowerShell:**
  ```powershell
  $body = @{ title = "New Task"; description = "Task details"; status = "Pending"; priority = "High"; dueDate = "2025-02-28T23:59:59.000Z" } | ConvertTo-Json -Depth 10
  Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method Post -Body $body -ContentType "application/json" -Headers $headers
  ```

#### Update a Task
- **Linux/macOS:**
  ```sh
  curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
       -H "Authorization: Bearer YOUR_TOKEN" \
       -H "Content-Type: application/json" \
       -d '{"status": "Completed"}'
  ```
- **PowerShell:**
  ```powershell
  $body = @{ status = "Completed" } | ConvertTo-Json
  Invoke-RestMethod -Uri "http://localhost:5000/api/tasks/TASK_ID" -Method Put -Body $body -ContentType "application/json" -Headers $headers
  ```

#### Delete a Task
- **Linux/macOS:**
  ```sh
  curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
       -H "Authorization: Bearer YOUR_TOKEN"
  ```
- **PowerShell:**
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:5000/api/tasks/TASK_ID" -Method Delete -Headers $headers
  ```

## Notes
- Replace `YOUR_TOKEN` with the actual JWT token received upon login.
- Replace `TASK_ID` with the actual ID of the task you want to modify or delete.
- The API requires authentication for all task-related operations.

