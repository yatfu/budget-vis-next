// Step 1: Mark this file as a server-only module
// This ensures the code can only run on the server, protecting sensitive operations

// Step 2: Import necessary dependencies
// Database connection pool
// Password hashing/comparison library

// Step 3: Define the login function as an async server action
// This function will be called from client components but runs on the server

// Step 4: Validate input data
// Always check that required fields are provided

// Step 5: Query the database for the user
// Use parameterized queries ($1) to prevent SQL injection

// Step 6: Check if user was found
// If no rows returned, user doesn't exist

// Step 7: Extract the user data from query result

// Step 8: Compare provided password with stored hashed password
// bcryptjs.compare() safely compares without exposing the hash

// Step 9: Return error if password doesn't match

// Step 10: Login successful - return user data
// Note: Never return the password hash to the client

// Step 11: Handle any unexpected errors
// Log errors to console for debugging
