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
    const filteredBudget = budgets
    .filter((budget: Budget) => budget.month === selectedMonth)
    .filter((budget: Budget) => budget.year === selectedYear)[0];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!filteredBudget) {
            return;
        }
        for (const budget of budgets) { // match filtered budget with budget in array, edit budget in array
            if (budget.id === filteredBudget.id) {
                budget.amount = filteredBudget.amount;
                return;
            }
        }
    }
    return (
        <div className="flex items-center gap-1">
        <input type="number"
            placeholder="Budget"
            value={filteredBudget?.amount ?? 5000}
            onChange={handleChange}
            className={cn("w-28 text-right", inputStyles)}
        /></div>

    );
}