
# Login-Register-Form with Pagination in Todo -> Next.js + MongoDB + JWT Authentication + shadCn 

Full Stack app for authentication and pagination

## Features

- User authentication with JWT
- Add, update, delete todos
- Mark todos as completed
- Pagination
- Cloudinary image upload for user profiles


## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aniket-kumar05/pagination-auth.git
cd login-register-form

##  install dependencies

npm install

## Setup Environment Variables

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_PRESET=your_preset_name

## Run the development server
 
 npm run dev

 This will give url -> http://localhost:3000

## Api End Points 

    POST /api/auth/login - Login user
    POST /api/auth/register - Register user
    GET /api/todos?page=1&limit=5 - Get todos with pagination
    POST /api/todos - Add a new todo
    PUT /api/todos/:id - Update todo (toggle completed)
    DELETE /api/todos/:id - Delete a todo