"use client";
import { useActionState } from "react";
import { register } from "../actions/register";

export default function Register() {
  const [state, formAction] = useActionState(register, {
    success: false,
    userId: null,
    error: null,
  });

  return (
    <form className="register-form" action={formAction}>
      <div>
        <label>Username</label>
        <input type="text" name="username" required />
      </div>

      <div>
        <label>Password</label>
        <input type="password" name="password" required />
      </div>

      <button type="submit">Register</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
