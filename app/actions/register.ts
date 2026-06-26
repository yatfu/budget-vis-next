"use server";

import { pool } from "@/db/db";
import bcrypt from "bcryptjs";

export async function register(formData: FormData) {
  console.log("Executing Register function");
  const username: string = formData.get("username") as string;
  const password: string = formData.get("password") as string;
  
  // Validate input data
  if (!username || !password) {
    console.log("You need username and password dummy -.-");
    return Error("You need username and password dummy -.-"); // returned error will be caught in the component and displayed to user
  }
    // hash password
const passwordHash = await bcrypt.hash(password, 10);
// Check if username already exists
const checkSql = `SELECT id FROM users WHERE username = $1`;
const checkValues = [username];
const checkResult = await pool.query(checkSql, checkValues);
if (checkResult.rows.length > 0) {
    console.log("Username already exists");
    return Error("Username already exists :(");
}
    
  // Insert new user into the database
  const sql = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`;
  const values = [username, passwordHash];
  const result = await pool.query(sql, values);
  return result.rows[0].id;
}