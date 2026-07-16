"use client"

import { cn, inputStyles } from "@/lib/utils";
import { Budget } from "@/lib/types";

type BudgetProps = {
  budget: Budget;
  setBudgets: React.Dispatch<React.SetStateAction<Budget>>;
};

export default function Budget({ budget, setBudgets }: BudgetProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBudget = { ...budget, amount: Number(e.target.value) };
        setBudgets(newBudget);
    }
    return (
        <div className="flex items-center gap-1">
        <input type="number"
            placeholder="Budget"
            value={budget.amount}
            onChange={handleChange}
            className={cn("w-28 text-right", inputStyles)}
        /></div>

    );
}