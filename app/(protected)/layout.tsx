// app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { authenticate } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const userId = await authenticate();
  if (!userId) redirect("/login");

  return <>{children}</>;
}