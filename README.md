# Quantity Measurement App - Express

This project is a backend API built with Express.js and Sequelize for unit conversion and quantity operations. It supports user authentication, quantity comparisons, conversions, arithmetic operations, and history logging in a MySQL database.

## Overview

The application exposes REST endpoints for user registration, login, and quantity processing. It stores user credentials securely using bcrypt hashing and saves every quantity operation in the database, including successful operations and error cases.

## Key Concepts

The application is organized into several layers. The route layer defines API endpoints and applies middleware. The controller layer receives requests, calls service methods, and handles responses. The service layer implements the core quantity and unit calculation logic. Models define database tables and relationships, while middleware handles authentication, input validation, and error handling.

## Entry Point

The main entry point is `server.js`. It loads environment variables, initializes the Express application, connects to the MySQL database using Sequelize, synchronizes the schema, and starts the HTTP server.

## How It Works

When the server starts, `server.js` imports `src/app.js` and the database configuration from `src/config/database.js`. It calls `sequelize.sync({ alter: true })` to make sure database tables match the model definitions. After database initialization, the server listens on the configured port.

`src/app.js` configures Express middleware, enables CORS, parses JSON requests, attaches the authentication and quantity routes, and registers a global error handler.

## Authentication

Authentication is implemented with JWT. The auth routes in `src/routes/authRoutes.js` allow users to register and login. Registration stores a new user in the database using the `User` model. Login verifies credentials and issues a JWT token signed with the secret configured in the environment.

The `authMiddleware` in `src/middlewares/authMiddleware.js` checks the `Authorization` header on protected routes, verifies the token, and assigns the decoded user information to `req.user`.

## Quantity Operations

Quantity operations are defined in `src/routes/quantityRoutes.js` and protected by authentication. Supported operations include compare, convert, add, subtract, add with target unit, subtract with target unit, and divide.

The controller `src/controllers/quantityController.js` orchestrates each operation. It validates input, calls the service logic from `src/services/quantityService.js`, logs the operation to the database, and returns the result. It also provides history endpoints to fetch past operations and error records.

The service layer handles unit conversion and arithmetic logic. It uses base conversion factors from `src/utils/unitConstants.js`. For most measurement types, values are converted to a base unit and then converted back to the desired unit. Temperature uses special conversion logic between Celsius and Fahrenheit.

## Data Storage

The app stores data in a MySQL database configured in `src/config/database.js`. Database credentials must be provided via environment variables such as `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `DB_HOST`.

User data is stored in the `User` model defined in `src/models/User.js`. Quantity operation history is stored in the `QuantityMeasurement` model defined in `src/models/QuantityMeasurement.js`.

Every quantity request results in a database insert through `QuantityMeasurement.create()` in `src/controllers/quantityController.js`. Both successful operations and errors are logged with details including input quantities, operation type, result, and user association.

## Folder Structure and File Purpose

- `server.js`: Starts the application and connects to the database.
- `package.json`: Lists dependencies, scripts, and entry point configuration.
- `src/app.js`: Configures Express application, middleware, and routes.
- `src/routes/authRoutes.js`: Defines authentication endpoints.
- `src/routes/quantityRoutes.js`: Defines quantity operation and history endpoints.
- `src/controllers/authController.js`: Handles user registration and login logic.
- `src/controllers/quantityController.js`: Handles quantity operations and history retrieval.
- `src/services/quantityService.js`: Contains the core measurement and conversion logic.
- `src/models/User.js`: Sequelize model for users.
- `src/models/QuantityMeasurement.js`: Sequelize model for operation history.
- `src/models/index.js`: Sets up model associations.
- `src/config/database.js`: Configures Sequelize with MySQL credentials.
- `src/config/auth.js`: Provides JWT configuration settings.
- `src/middlewares/authMiddleware.js`: Verifies JWT tokens.
- `src/middlewares/errorHandler.js`: Formats and returns errors.
- `src/middlewares/validator.js`: Validates request payloads.
- `src/utils/unitConstants.js`: Defines supported units and conversion factors.



