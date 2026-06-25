import { login } from '@/app/actions/login'
import Link from "next/link";
import LoginForm from "@/app/components/LoginForm";

/**
 * Login Page
 * uses login server action instead of api to validate and handle data
 */
 export default function LoginPage() {
    return (
        <>
            <LoginForm action={login}/>
            <Link href="/register">
                <button>Register</button>
            </Link>
        </>
    );
}

