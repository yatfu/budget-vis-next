import Expenses from "../components/Expenses";
import Nav from "../components/Nav";
import { authenticate } from "@/lib/auth";

export default async function ExpensesPage() {
  const userId = await authenticate();
  return (
    <>
    <Nav userId={userId}/>
    <Expenses />
    </>
  )
}