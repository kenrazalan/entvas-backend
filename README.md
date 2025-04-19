# Entvas Backend

A clean, scalable, and maintainable Node.js backend application built with Express, TypeScript, and MongoDB.

## Features

- User authentication (register, login)
- JWT-based authorization
- MongoDB database with Mongoose ORM
- SendGrid email service integration
- Input validation with express-validator
- Centralized error handling
- Structured logging
- Environment-based configuration
- TypeScript for type safety

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middleware/       # Express middleware
├── models/           # Mongoose models
├── repositories/     # Data access layer
├── routes/           # API routes
├── services/         # Business logic
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── validations/      # Request validation schemas
└── app.ts            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- SendGrid account
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/entvas.git
   cd entvas/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   SENDGRID_API_KEY=your-sendgrid-api-key
   SENDGRID_FROM_EMAIL=your-verified-sender@yourdomain.com
   FRONTEND_URL=http://localhost:3000
   ```

4. Set up SendGrid:
   - Create a SendGrid account at https://signup.sendgrid.com
   - Go to Settings → API Keys
   - Create an API key with "Mail Send" permissions
   - Go to Settings → Sender Authentication
   - Click "Verify a Single Sender"
   - Fill in your sender information and verify your email
   - Add the API key and verified sender email to your .env file

5. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Request body:
    ```json
    {
      "email": "user@example.com",
      "password": "Password123!",
      "name": "John Doe",
      "isManager": false
    }
    ```

- `POST /api/auth/login` - Login a user
  - Request body:
    ```json
    {
      "email": "user@example.com",
      "password": "Password123!"
    }
    ```

## Development

### Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm test` - Run tests (not implemented yet)

### Code Style

This project follows the following coding standards:

- Use TypeScript for type safety
- Follow the repository pattern for data access
- Use dependency injection for better testability
- Implement proper error handling
- Use async/await for asynchronous operations
- Follow RESTful API design principles

## Deployment

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 