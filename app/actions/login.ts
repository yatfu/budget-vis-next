"use server";

import { pool } from "@/db/db";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // uuid generation
import { cookies } from "next/headers";

const SESSION_LENGTH = 60 * 60 * 24 * 7; // 7 days

const expiresAt = new Date(Date.now() + SESSION_LENGTH * 1000); // postgres will convert javascript date object to sql date format when sending query

export async function login(formData: FormData) {
  console.log("Executing Login function")
  const username: string = formData.get("username") as string;
  const password: string = formData.get("password") as string;

  
  // Validate input data
  if (!username || !password) {
    console.log("You need username and password dummy -.-");
    throw new Error("You need username and password dummy -.-"); // returned error will be caught in the component and displayed to user
  }
  // Query the database for the user
  const passwordHash = await bcrypt.hash(password, 10);
  const sql = `SELECT id, username, password
        FROM users
        WHERE username = $1`;
  const values = [username];
  const result = await pool.query(sql, values);
  // Check if user was found
  if (result.rows.length === 0) {
    console.log("user not found");
    throw new Error("User not found :(");
  }
  // Extract the user data from query result
  const user = result.rows[0];

  // Compare provided password with stored hashed password
  // bcryptjs.compare() safely compares without exposing the hash
  const match = await bcrypt.compare(password, user.password);

  // Return error if password doesn't match
  if (!match) {
    console.log("incorrect password");
    throw new Error("Incorrect password :(");
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
  console.log("Cookies set");

  console.log(user);
  return { id: user.id, username: user.username };
}
