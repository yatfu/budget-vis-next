"use client";
import { useActionState } from "react";
import { register } from "../actions/register";
import { cn, inputStyles, buttonBase, buttonVariants, buttonSizes } from "@/lib/utils";

export default function Register() {
  const [state, formAction] = useActionState(register, {
    success: false,
    userId: null,
    error: null,
  });

  return (
    <div className="flex justify-center py-3">
      <form
        className="register-form flex flex-col gap-1 rounded-lg border border-border bg-card px-1 py-1"
        action={formAction}
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Username</label>
          <input type="text" name="username" required className={inputStyles} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Password</label>
          <input type="password" name="password" required className={inputStyles} />
        </div>

        <button type="submit" className={cn(buttonBase, buttonVariants.default, buttonSizes.default)}>Register</button>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      </form>
    </div>
  );
}
