import { logout } from "../actions/logout";
import Link from "next/link";
type Props = {
  userId?: String;
};

const Nav = ({userId}: Props) => {
  return (
    <div className="nav py-3 flex justify-center">
      {userId && (
        <>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/expenses">Expenses</Link>
          <Link href="history">History</Link>
          <form action={logout}>
            <button type="submit">Log Out</button>
          </form>
        </>

      )}
      {!userId && (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>

        </>
      )}
      </div>
  );
}

export default Nav;