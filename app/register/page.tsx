"use client";
import { register } from "../actions/register";

export default function Register() {
  return (
    <form className="register-form" action={register}>
      <div>
        <label>Username</label>
        <input type="text" name="username" required />
      </div>

      <div>
        <label>Password</label>
        <input type="password" name="password" required />
      </div>

      <button type="submit">Register</button>
    </form>
  );
}
