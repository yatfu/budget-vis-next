import { pool } from "@/db/db";
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const body = await req.json(); // handle input, parses it to javascript
  const { username, password } = body; // expected values username and password

  if (!username || !password) { // match sql checks
    return Response.json( // return error if fail
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10); // hash password

  const result = await pool.query( // send sql query, requests returned values
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
    [username, hashedPassword]
  );

  return Response.json(result.rows[0]); // returns what db sent back
}

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