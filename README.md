# RecyclePay Backend

Backend server for the RecyclePay platform built with Node.js, Express, and MySQL.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the root directory with the following variables:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=recycling_db
JWT_SECRET=your_secret_key
NODE_ENV=development
```

3. Set up the database:
   - Make sure MySQL is running
   - Open MySQL Workbench or MySQL CLI
   - Run the SQL commands in `db_setup.sql`

4. Validate setup:
```bash
npm run setup
```

5. Start the server:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## API Documentation

### Authentication
- POST `/api/auth/register`
  - Register a new user (recycler or company)
  - Body: `{ username, email, password, role }`

- POST `/api/auth/login`
  - Login user
  - Body: `{ email, password }`

### Users
- GET `/api/users/me`
  - Get current user profile
  - Requires: Authentication token

- PATCH `/api/users/me`
  - Update user profile
  - Requires: Authentication token
  - Body: `{ username?, email? }`

- GET `/api/users/payment`
  - Get user's payment setup
  - Requires: Authentication token

- POST `/api/users/payment`
  - Update payment setup
  - Requires: Authentication token
  - Body: `{ payment_method, account_info }`

### Recycling
- POST `/api/recycling/requests`
  - Create new recycling request
  - Requires: Authentication token
  - Body: `{ item_type, quantity, location }`

- GET `/api/recycling/requests`
  - Get all recycling requests (companies only)
  - Requires: Authentication token

- PATCH `/api/recycling/requests/:id`
  - Update request status
  - Requires: Authentication token
  - Body: `{ status }`

- GET `/api/recycling/history`
  - Get user's recycling history
  - Requires: Authentication token

### Transactions
- POST `/api/transactions`
  - Record new transaction
  - Requires: Authentication token
  - Body: `{ recycling_item_id, amount }`

- GET `/api/transactions/earnings`
  - Get user's earnings history
  - Requires: Authentication token

- GET `/api/transactions/payments`
  - Get company's payment history
  - Requires: Authentication token

## Error Handling
The API uses standard HTTP status codes and returns errors in the format:
```json
{
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]  // For validation errors
}
```