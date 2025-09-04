# User Authentication Backend (Node.js + Express + MongoDB)

## Overview

This backend provides a simple user authentication system using Node.js, Express, and MongoDB. It supports basic user operations:

- Get a user by ID
- Get all users
- Create a new user
- Delete a user
- Update a user

### User Model Fields

- `email` (String, required, unique)
- `fullName` (String, required)
- `username` (String, required, unique)
- `password` (String, required, hashed)

## Project Structure

```text
User_Auth_Backend/
│   package.json
│   server.js
│   README.md
│
├── models/
│     user.js
│
├── routes/
│     userRoutes.js
│
├── controllers/
│     userController.js
│
└── config/
      db.js
```

## Setup Instructions

1. **Install dependencies:**

   ```sh
   npm install express mongoose bcryptjs dotenv
   ```

2. **Start MongoDB:**

   Ensure MongoDB is running locally or update the connection string in `.env`.

3. **Run the server:**

   ```sh
   node server.js
   ```

## API Endpoints

| Method | Endpoint         | Description         |
|--------|------------------|--------------------|
| GET    | /api/users       | Get all users      |
| GET    | /api/users/:id   | Get user by ID     |
| POST   | /api/users       | Create new user    |
| PUT    | /api/users/:id   | Update user        |
| DELETE | /api/users/:id   | Delete user        |

## MVP Explanation

The MVP (Minimum Viable Product) is a backend REST API for user management. It allows clients to create, read, update, and delete users. Passwords are securely hashed. The system is modular, separating models, controllers, and routes for maintainability.

---

See code files for implementation details.
