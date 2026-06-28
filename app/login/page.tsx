import { login } from '@/app/actions/login'
import { authenticate } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from "next/link";

/**
 * Login Page
 * uses login server action instead of api to validate and handle data
 */
export default async function LoginPage() {
    const userId = await authenticate();
    if (userId) {
        redirect("/dashboard");
    }
    return (
        <>
            <form className="login-form" action={login}>
                <div>
                    <label>Username</label>
                    <input type="text" name="username" required />
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" name="password" required />
                </div>

                <button type="submit">Log In</button>
            </form>
            <Link href="/register">
                <button>Register</button>
            </Link>
        </>
    );
}

