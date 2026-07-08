import { authenticate } from "@/lib/auth";
import Nav from "../components/Nav";
import Expenses from '../components/Expenses'
import { redirect } from "next/navigation";
import { months } from '@/lib/utils';

type props = {
  searchParams: Promise<{ month?: string; year?: string }>};

export default async function Dashboard({ searchParams }: props)  {
  const userId = await authenticate();
  const params = await searchParams;

  const selectedMonth =
    Number(params.month) || new Date().getMonth() + 1;
  const selectedYear =
    Number(params.year) || new Date().getFullYear();

  if (!userId) {
    redirect("/login");
  }
  return (
    <>
      <Nav userId={userId} />
      <h2>{months[selectedMonth]} {selectedYear}</h2>
      <Expenses />
    </>
  );
}
