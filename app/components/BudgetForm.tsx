"use client"

import { cn, inputStyles } from "@/lib/utils";
import { Budget } from "@/lib/types";

type BudgetProps = {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget>>;
  selectedMonth: number;
  selectedYear: number;
};



export default function BudgetForm({ budgets, setBudgets, selectedMonth, selectedYear }: BudgetProps) {
    const filteredBudgets = budgets
    .filter((budget: Budget) => budget.month === selectedMonth)
    .filter((budget: Budget) => budget.year === selectedYear);
    console.log(budgets);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBudget = { ...budgets, amount: Number(e.target.value) };
        setBudgets(newBudget);
    }
    return (
        <div className="flex items-center gap-1">
        <input type="number"
            placeholder="Budget"
            value={filteredBudgets[0]?.amount ?? 5000}
            onChange={handleChange}
            className={cn("w-28 text-right", inputStyles)}
        /></div>

    );
}