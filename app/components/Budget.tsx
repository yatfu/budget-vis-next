"use client"

import { cn, inputStyles } from "@/lib/utils";

type BudgetProps = {
  budget: number;
  setBudget: React.Dispatch<React.SetStateAction<number>>;
};

export default function Budget({ budget, setBudget }: BudgetProps) {
    return (
        <div className="flex items-center gap-1">
        <input type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className={cn("w-28 text-right", inputStyles)}
        /></div>

    );
}