import { login } from '@/app/actions/login'
import { authenticate } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from "next/link";
import { cn, inputStyles, buttonBase, buttonVariants, buttonSizes, cardStyles } from "@/lib/utils";

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
        <div className="flex justify-center py-3">
            <div className={cn("flex flex-col gap-1", cardStyles)}>
                <form className="login-form flex flex-col gap-1" action={login}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-muted-foreground">Username</label>
                        <input type="text" name="username" required className={inputStyles} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-muted-foreground">Password</label>
                        <input type="password" name="password" required className={inputStyles} />
                    </div>

                    <button type="submit" className={cn(buttonBase, buttonVariants.default, buttonSizes.default)}>Log In</button>
                </form>
                <Link href="/register" className={cn(buttonBase, buttonVariants.secondary, buttonSizes.default)}>
                    Register
                </Link>
            </div>
        </div>
    );
}

