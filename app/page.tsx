import Link from "next/link";

export default function LandingPage() {
  /* page has two tabs
       one to crud data of budget per month
       one to display data of all months */

  return (
    <div>
      <h1>Budget Vis</h1>
      <p>Track monthly expenses against a budget.</p>
      <nav>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/dashboard">Dashboard</Link>
      </nav>
    </div>
  );
}
