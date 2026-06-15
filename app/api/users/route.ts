import { pool } from "@/db/db";
import bcrypt from 'bcryptjs';

/** POST API
 * 
 * inserts a user into user table
 * body: { username: string, password: string }
 */

export async function POST(req: Request) {
  const body = await req.json(); // handle input, parses it to javascript
  const { username, password } = body; // expected values username and password

  if ( // check for missing fields
    !username || 
    !password
    ) { 
    return Response.json( // return error if fail
      { error: "Missing fields" },
      { status: 400 }
    );
  }
  if ( // check for validity, matching sql checks
    username.trim().length < 1
  ) {
    return Response.json(
      { error: "Invalid credentials" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10); // hash password

  try {
    const result = await pool.query( // send sql query, requests returned values
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );

    return Response.json(result.rows[0], { status: 201 }); // returns what db sent back
  } catch (error: any) {
    if (error.code === "23505") {
      return Response.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    console.error(error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 });
  }
}

/**
 * GET API
 * only used for debugging
 */

export async function GET(req: Request) {
  const result = await pool.query("SELECT * FROM users");
  return Response.json(result.rows);
}


/**

fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    username: "testuser",
    password: "123456"
  })
})
.then(res => res.json())
.then(console.log);


 */