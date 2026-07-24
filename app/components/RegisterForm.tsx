"use client";

import { useActionState } from "react";
import { register } from "../actions/register";
import { cn, inputStyles, buttonBase, buttonVariants, buttonSizes, cardStyles } from "@/lib/utils";
import type { RegisterState } from "@/lib/types";

export default function RegisterForm() {
  const [state, formAction] = useActionState<RegisterState, FormData>(register, {
    success: false,
    userId: null,
    error: "",
  });

  return (
    <div className="flex justify-center py-3">
      <form
        className={cn("register-form flex flex-col gap-1", cardStyles)}
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
