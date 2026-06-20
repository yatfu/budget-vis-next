import Link from "next/link";
import { login } from "@/app/actions/login";
import LoginForm from "@/app/components/LoginForm";

/**
 * Login Page
 * uses login server action instead of api to validate and handle data
 */
function LoginPage() {
    return (
        <>
            <LoginForm onSubmit={login} />
            <Link href="/register">
                <button>Register</button>
            </Link>
        </>
    );
}

export default LoginPage