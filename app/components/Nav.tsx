"use client";

import { logout } from "../actions/logout";
import Link from "next/link";
import { cn, buttonBase, buttonVariants, buttonSizes, borderless } from "@/lib/utils";
import { usePathname } from "next/navigation";

type Props = {
  userId?: String;
};

const navLinkStyles = cn(buttonBase, buttonVariants.ghost, buttonSizes.default, borderless);

const Nav = ({userId}: Props) => {
  const pathname = usePathname();
  if (pathname === "/") {
    return null;
  }
  return (
    <div className="nav py-3 flex justify-center gap-1">
      {userId && (
        <>
          <Link href="/dashboard" className={navLinkStyles}>Dashboard</Link>
          <Link href="history" className={navLinkStyles}>History</Link>
          <form action={logout}>
            <button type="submit" className={cn(buttonBase, buttonVariants.secondary, buttonSizes.default, borderless)}>Log Out</button>
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