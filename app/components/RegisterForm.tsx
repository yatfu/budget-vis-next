"use client";

import React, { useState } from "react";

export default function RegisterForm({ action }: {action: (formData: FormData) => Promise<void>}) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form className="register-form" action={action}>
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
