"use server";

import { pool } from '@/db/db'
import bcrypt from 'bcryptjs'

export async function login(username: string, password: string) {
    // Validate input data
    if (!username || !password) {
        return Error("You need username and password dummy -.-"); // returned error will be caught in the component and displayed to user
    }
    // Query the database for the user
    const passwordHash = await bcrypt.hash(password, 10);
    const sql =
        `SELECT id, username, passwordHash
        FROM users
        WHERE username = $1`;
    const values = [username];
    const result = await pool.query(sql, values);
    // Check if user was found
    if (result.rows.length === 0) {
        return Error("User not found :(");
    }
    // Extract the user data from query result
    const user = result.rows[0];

    // Compare provided password with stored hashed password
    // bcryptjs.compare() safely compares without exposing the hash
    const match = await bcrypt.compare(password, user.passwordhash);

    // Return error if password doesn't match
    if (!match) {
        return Error("Incorrect password :(");
    }
    // Login successful, return user data NOT PASSWORD
    return { id: user.id, username: user.username };
}
