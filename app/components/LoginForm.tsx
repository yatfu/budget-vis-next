"use client";

type LoginFormProps = {
  action: (formData: FormData) => Promise<void>;
};

export default function LoginForm({ action }: LoginFormProps) {
  return (
    <form className="login-form" action={action}>
      <div>
        <label>Username</label>
        <input type="text" name="username" required />
      </div>

      <div>
        <label>Password</label>
        <input type="password" name="password" required />
      </div>

      <button type="submit">Log In</button>
    </form>
  );
}
