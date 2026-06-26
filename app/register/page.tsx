"use client";

export default function Register({ action }: {action: (formData: FormData) => Promise<string | Error>}) {
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
