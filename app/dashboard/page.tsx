import { authenticate } from "@/lib/auth";
import Nav from "../components/Nav";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const userId = await authenticate();
  if (!userId) {
    redirect("/login");
  }
  return (
    <>
      <Nav userId={userId}/>
    </>
  );
}
