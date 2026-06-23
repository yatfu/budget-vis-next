"use client";

import React, { useState, type FormEvent } from "react"; // form event is only used for typescript declaration

type LoginFormProps ={
  onSubmit?: (username: string, password: string) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(username, password);
    }
  };

  return (
    <form className="login-form"> {/* onSubmit={handleSubmit}*/}
      <div>
        <label>Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </div>

      <div>
        <label>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <button type="submit">Log In</button>
    </form>
  );
}
