# Authentication System

A comprehensive Node.js/Express-based authentication system with email verification, JWT-based login, password reset functionality, and role-based access control. Built as a boilerplate for MERN stack applications.

## Features

- **User Registration** - Create new user accounts with email verification
- **Email Verification** - Verify user email addresses with secure tokens
- **JWT Authentication** - Secure token-based authentication with 24-hour expiration
- **Login/Logout** - Session management with HTTP-only cookies
- **Forgot Password** - Secure password reset flow via email
- **Password Reset** - Reset password using email verification token
- **Role-Based Access Control** - Support for user and admin roles
- **Password Encryption** - Bcrypt hashing for secure password storage
- **CORS Enabled** - Cross-origin request support

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer
- **Development**: Nodemon for auto-reload

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Authentication-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables file**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=4000
   BASE_URL=http://localhost:3000
   
   # MongoDB
   MONGO_URI=mongodb://localhost:27017/auth-system
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   
   # Mailtrap Configuration (for email verification)
   MAILTRAP_HOST=smtp.mailtrap.io
   MAILTRAP_PORT=465
   MAILTRAP_USERNAME=your_mailtrap_username
   MAILTRAP_PASSWORD=your_mailtrap_password
   MAILTRAP_SENDERMAIL=noreply@yourdomain.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on the port specified in `.env` (default: 4000)

## API Endpoints

### Authentication Routes
- **POST** `/api/v1/users/register` - Register a new user
- **GET** `/api/v1/users/verify/:token` - Verify user email
- **POST** `/api/v1/users/login` - Login user
- **POST** `/api/v1/users/logout` - Logout user
- **GET** `/api/v1/users/me` - Get current user profile
- **POST** `/api/v1/users/forgot-password` - Request password reset
- **POST** `/api/v1/users/reset-password/:token` - Reset password with token

## Project Structure

```
Authentication-System/
├── controllers/
│   └── user.controller.js      # User authentication logic
├── middleware/
│   └── auth.middleware.js      # JWT verification middleware
├── models/
│   └── user.model.js           # MongoDB User schema
├── routes/
│   └── user.route.js           # API routes definition
├── utils/
│   └── db.js                   # MongoDB connection
├── index.js                    # Entry point
├── package.json                # Dependencies
└── README.md                   # This file
```

## API Usage Examples

### Register a User
```bash
POST /api/v1/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Verify Email
```bash
GET /api/v1/users/verify/{verification_token}
```

### Login
```bash
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Get Current User
```bash
GET /api/v1/users/me
Authorization: Bearer {jwt_token}
```

### Request Password Reset
```bash
POST /api/v1/users/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Reset Password
```bash
POST /api/v1/users/reset-password/{reset_token}
Content-Type: application/json

{
  "password": "newpassword123"
}
```

## User Model

```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: String (enum: ["user", "admin"], default: "user"),
  isVerified: Boolean (default: false),
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  timestamps: true
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs before storage
- **JWT Tokens**: Secure token-based authentication with configurable expiration
- **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies to prevent XSS attacks
- **CORS Protection**: Configured CORS to allow requests only from authorized origins
- **Email Verification**: Secure token-based email verification
- **Password Reset Expiration**: Reset tokens expire after 1 hour

## Environment Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Email service account (Mailtrap or similar)

### MongoDB Setup
- Local: Make sure MongoDB is running on `mongodb://localhost:27017`
- Cloud: Use MongoDB Atlas and update `MONGO_URI` in `.env`

### Email Service Setup
1. Create an account on [Mailtrap](https://mailtrap.io)
2. Get your SMTP credentials
3. Add credentials to `.env` file

## Development

### Available Scripts

- `npm run dev` - Start development server with auto-reload (requires nodemon)
- `npm start` - Start production server (if configured)

### Dependencies
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email sending
- **cors** - Cross-origin resource sharing
- **cookie-parser** - Parse cookies
- **dotenv** - Environment variables

## Notes
- This is a boilerplate for MERN stack applications
- Suitable for use as a starting point for larger authentication-based projects
- Consider implementing rate limiting for production
- Use environment variables for all sensitive configuration
- Test email functionality before deploying to production


