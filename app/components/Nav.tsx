import { logout } from "../actions/logout";
import Link from "next/link";
import { cn, buttonBase, buttonVariants, buttonSizes } from "@/lib/utils";

type Props = {
  userId?: String;
};

const navLinkStyles = cn(buttonBase, buttonVariants.ghost, buttonSizes.default);

const Nav = ({userId}: Props) => {
  return (
    <div className="nav py-3 flex justify-center gap-1">
      {userId && (
        <>
          <Link href="/dashboard" className={navLinkStyles}>Dashboard</Link>
          <Link href="history" className={navLinkStyles}>History</Link>
          <form action={logout}>
            <button type="submit" className={cn(buttonBase, buttonVariants.secondary, buttonSizes.default)}>Log Out</button>
          </form>
        </>

      )}
      {!userId && (
        <>
          <Link href="/login" className={navLinkStyles}>Login</Link>
          <Link href="/register" className={navLinkStyles}>Register</Link>

        </>
      )}
      </div>
  );
}

export default Nav;