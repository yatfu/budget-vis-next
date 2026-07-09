import { ExpenseRowProps } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onDeleteExpense(index)}
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        ✕
      </Button>

      <input
        type="text"
        placeholder="Expense Name"
        value={expense.label}
        onChange={(e) => onChangeExpense(index, "label", e.target.value)}
        required
        className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring"
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
        className="w-28 rounded-md border border-input bg-background px-3 py-1.5 text-right text-sm text-foreground placeholder:text-muted-foreground focus:border-ring [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <div className="flex items-center border-l border-border pl-2">
        <input
          type="number"
          placeholder="Add"
          value={amount}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            setAmount(isNaN(parsed) ? 0 : parsed);
          }}
          className="w-20 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleAdd(index, amount)}
        >
          +
        </Button>
      </div>
    </div>
  );
}