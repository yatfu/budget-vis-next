import RegisterForm from "../components/RegisterForm";
import { redirect } from "next/navigation";
import { authenticate } from "@/lib/auth";

export default async function Register() {
  const userId = await authenticate();
  if (userId) {
    redirect('/dashboard');
  }
  return (
    <RegisterForm />
  );
}
