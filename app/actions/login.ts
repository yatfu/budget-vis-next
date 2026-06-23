"use server";

import { pool } from '@/db/db'
import bcrypt from 'bcryptjs'
import crypto from "crypto"; // uuid generation
import { cookies } from "next/headers";

const SESSION_LENGTH = 60 * 60 * 24 * 7; // 7 days

const expiresAt = new Date( // postgres will convert javascript date object to sql date format when sending query
    Date.now() + SESSION_LENGTH * 1000
  );

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
    // Login successful, create session
    const sessionId = crypto.randomUUID();

    await pool.query(
      `INSERT INTO sessions (id, user_id, expires_at)
       VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 second'))`,
      [sessionId, user.id, expiresAt]
    );

    // Set cookie
  const cookieStore = await cookies();

  cookieStore.set("session", sessionId, {
    httpOnly: true, // security
    secure: process.env.NODE_ENV === "production", // allows for localhost to still work when in dev 
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_LENGTH, //
  });


    return { id: user.id, username: user.username };
}
