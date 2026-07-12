import { ExpenseRowProps } from "@/lib/types";
import { useState } from "react";
import { cn, inputStyles, buttonBase, buttonVariants, buttonSizes } from "@/lib/utils";
import { X } from "lucide-react";

export default function ExpenseRow({
  expense,
  index,
  onAddAmount,
  onChangeExpense,
  onAddExpense,
  onDeleteExpense,
}: ExpenseRowProps) {
  const [amount, setAmount] = useState(0);

  const handleAdd = (index: number, amount: number) => {
    onAddAmount(index, amount);
    setAmount(0);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-1 py-1">
      <button
        type="button"
        onClick={() => onDeleteExpense(index)}
        className={cn(buttonBase, buttonVariants.ghost, buttonSizes.icon, "text-muted-foreground hover:text-destructive hover:bg-destructive/10")}
      >
        <X />
      </button>

      <input
        type="text"
        placeholder="Expense Name"
        value={expense.label}
        onChange={(e) => onChangeExpense(index, "label", e.target.value)}
        required
        className={cn("min-w-0 flex-1 text-left", inputStyles)}
      />

      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Value"
        value={expense.amount}
        onChange={(e) => {
          const parsed = parseFloat(e.target.value);
          onChangeExpense(index, "amount", isNaN(parsed) ? 0 : parsed);
        }}
        required
        className={cn("w-28 text-right", inputStyles)}
      />

      <div className="flex items-center gap-1 border-l border-border pl-2">
        <input
          type="number"
          placeholder="Add"
          value={amount}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            setAmount(isNaN(parsed) ? 0 : parsed);
          }}
          className={cn("w-20", inputStyles)}
        />
        <button
          type="button"
          onClick={() => handleAdd(index, amount)}
          className={cn(buttonBase, buttonVariants.secondary, buttonSizes.sm)}
        >
          +
        </button>
      </div>
    </div>
  );
}