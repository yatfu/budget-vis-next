"use server";

import { RegisterState } from "@/lib/types";
import { pool } from "@/db/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function register(
  prevState: RegisterState | null,
  formData: FormData
) {
  console.log("Executing Register function");
  const username: string = formData.get("username") as string;
  const password: string = formData.get("password") as string;

  // Validate input data
  if (!username || !password) {
    console.log("You need username and password dummy -.-");
    return {
      success: false,
      userId: null,
      error: "You need username and password dummy -.-",
    }; // returned error will be caught in the component and displayed to user
  }
  // hash password
  const passwordHash = await bcrypt.hash(password, 10);
  // Check if username already exists
  const checkSql = `SELECT id FROM users WHERE username = $1`;
  const checkValues = [username];
  const checkResult = await pool.query(checkSql, checkValues);
  if (checkResult.rows.length > 0) {
    console.log("Username already exists");
    return {
      success: false,
      userId: null,
      error: "Username already exists :(",
    };
  }

  // Insert new user into the database
  const sql = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`;
  const values = [username, passwordHash];
  let result;
  try {
    result = await pool.query(sql, values);
  } catch (error) {
    return {
      success: false,
      userId: null,
      error: "DB failed to register"
    }
  }
  
  redirect("/login");
  
}
