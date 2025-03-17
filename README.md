# Account Management System

<div align="center">
  <p><strong>A full-stack application for managing personal accounts and financial transactions</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#api-documentation">API</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>
</div>

## Overview

The Account Management System is a comprehensive financial management solution built with ASP.NET Core and Angular. It provides a secure and intuitive platform for managing personal accounts, tracking transactions, and maintaining customer records with a modern, responsive user interface.

Developed by Mpho Ndlela for Traq Software, this application demonstrates best practices in full-stack development, including:

- Clean architecture principles
- RESTful API design
- Secure authentication
- Responsive UI/UX
- Database integration
- Data validation

## Features

### Person Management
- **Create and manage customer profiles** with personal information
- **Search and filter** customers by name, ID number, or account details
- **View detailed customer information** including linked accounts and transaction history
- **Update or delete** customer records with proper validation

### Account Management
- **Create new accounts** linked to existing customers
- **Monitor account balances** in real-time
- **Change account status** (open/closed)
- **View account details** including transaction history
- **Search and filter** accounts by number, balance, or status

### Transaction Processing
- **Record financial transactions** with detailed information
- **Support for deposits and withdrawals**
- **Transaction history** with filtering and sorting options
- **Generate transaction receipts**
- **View transaction details** including linked account information

### Security Features
- **JWT-based authentication** for secure API access
- **Role-based authorization** for different user types
- **Input validation** to prevent malicious data
- **Secure password handling**

### User Interface
- **Responsive design** that works on desktop and mobile devices
- **Intuitive navigation** with a clean, modern interface
- **Data visualization** for financial information
- **Accessibility features** for inclusive user experience

## Technology Stack

### Backend
- **ASP.NET Core 7.0** - Web API framework
- **Entity Framework Core** - ORM for database operations
- **SQL Server** - Relational database
- **AutoMapper** - Object-to-object mapping
- **JWT Authentication** - Secure token-based authentication
- **Swagger/OpenAPI** - API documentation

### Frontend
- **Angular 15** - Frontend framework
- **TypeScript** - Programming language
- **Bootstrap 5** - CSS framework for responsive design
- **Angular Material** - UI component library
- **RxJS** - Reactive programming library
- **Chart.js** - Data visualization

## Prerequisites

- **.NET 7.0 SDK** or later
- **SQL Server 2019** or later
- **Node.js 16.x** or later
- **Angular CLI 15.x** or later
- **Visual Studio 2022** or **Visual Studio Code** (recommended)

## Project Structure

```
AccountManagement/
├── PersonAccountApp/
│   ├── backend/         # ASP.NET Core Web API
│   │   ├── Controllers/ # API endpoints
│   │   ├── Models/      # Domain models
│   │   ├── DTOs/        # Data transfer objects
│   │   ├── Data/        # Database context and repositories
│   │   └── Services/    # Business logic
│   │
│   └── frontend/        # Angular frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/  # UI components
│       │   │   │   ├── guards/      # Route guards
│       │   │   │   └── interceptors/ # HTTP interceptors
│       │   │   │
│       │   │   ├── services/    # API communication
│       │   │   ├── models/      # TypeScript interfaces
│       │   │   └── environments/    # Environment configurations
│       │   │
│       │   ├── assets/          # Static files
│       │   └── angular.json         # Angular configuration
│       │
│       └── setup_database.sql           # Database setup script
```

## Installation

### Database Setup

1. Open SQL Server Management Studio
2. Connect to your local SQL Server instance
3. Execute the `setup_database.sql` script to create the database and populate initial data

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/account-management.git
   cd account-management
   ```

2. Navigate to the backend directory:
   ```bash
   cd PersonAccountApp/backend
   ```

3. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

4. Update the connection string in `appsettings.json` to match your SQL Server instance:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER;Database=AccountManagement;Trusted_Connection=True;MultipleActiveResultSets=true"
   }
   ```

5. Run the application:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:7001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd PersonAccountApp/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URL in `src/environments/environment.ts` if necessary:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://localhost:7001/api'
   };
   ```

4. Start the development server:
   ```bash
   ng serve
   ```

The application will be available at `http://localhost:4200`

## Usage

### Login

1. Access the application at `http://localhost:4200`
2. Use the following credentials:
   - Username: `admin`
   - Password: `admin123`

### Managing Persons

1. Navigate to the "Persons" section from the main menu
2. Use the search bar to find specific persons
3. Click on a person to view their details
4. Use the "Add Person" button to create a new person
5. Edit or delete persons using the action buttons

### Managing Accounts

1. Navigate to the "Accounts" section from the main menu
2. Use filters to find accounts by status or balance
3. Click on an account to view its details and transaction history
4. Create new accounts from the person detail page
5. Change account status (open/closed) from the account detail page

### Processing Transactions

1. Navigate to the "Transactions" section or access from an account detail page
2. Use the "New Transaction" button to create a deposit or withdrawal
3. Fill in the required transaction details
4. View transaction history with filtering options
5. Generate and print transaction receipts

## API Documentation

The API follows RESTful principles and returns data in JSON format. All endpoints require authentication except for the login endpoint.

### Authentication

- **POST** `/api/auth/login` - Authenticate user and get JWT token

### Persons

- **GET** `/api/person` - Get all persons
- **GET** `/api/person/{code}` - Get person by code
- **POST** `/api/person` - Create new person
- **PUT** `/api/person/{code}` - Update person
- **DELETE** `/api/person/{code}` - Delete person

### Accounts

- **GET** `/api/accounts` - Get all accounts
- **GET** `/api/accounts/{code}` - Get account by code
- **GET** `/api/persons/{code}/accounts` - Get accounts for a specific person
- **POST** `/api/accounts` - Create new account
- **PUT** `/api/accounts/{code}` - Update account
- **DELETE** `/api/accounts/{code}` - Delete account

### Transactions

- **GET** `/api/transactions` - Get all transactions
- **GET** `/api/transactions/{code}` - Get transaction by code
- **GET** `/api/accounts/{code}/transactions` - Get transactions for a specific account
- **POST** `/api/transactions` - Create new transaction
- **PUT** `/api/transactions/{code}` - Update transaction
- **DELETE** `/api/transactions/{code}` - Delete transaction

### Status

- **GET** `/api/statuses` - Get all status types
- **GET** `/api/statuses/{code}` - Get status by code

## Architecture

### Backend Architecture

The backend follows a layered architecture pattern:

1. **Controllers Layer** - Handles HTTP requests and responses
2. **Service Layer** - Contains business logic and validation
3. **Data Access Layer** - Manages database operations
4. **Domain Layer** - Defines the core business entities

### Frontend Architecture

The Angular frontend follows a component-based architecture:

1. **Components** - Reusable UI elements
2. **Services** - Handle API communication and state management
3. **Models** - Define TypeScript interfaces for data structures
4. **Guards** - Protect routes based on authentication status
5. **Interceptors** - Handle HTTP requests and responses globally

## Troubleshooting

### Common Issues

#### Backend API not accessible
- Ensure SQL Server is running
- Check the connection string in `appsettings.json`
- Verify that the backend application is running
- Check for any firewall restrictions

#### Frontend not connecting to API
- Verify the API URL in `environment.ts`
- Check browser console for CORS errors
- Ensure the backend API is running

#### Database connection issues
- Verify SQL Server credentials
- Check if the database exists
- Ensure the SQL Server service is running

### Logging

- Backend logs are stored in the `logs` directory
- Frontend errors are logged to the browser console

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Bootstrap](https://getbootstrap.com/) - Frontend framework
- [Angular Material](https://material.angular.io/) - UI components
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/) - ORM
- [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/) - Web framework

## Contact

Mpho Ndlela - mpho.c.ndlela@gmail.com

