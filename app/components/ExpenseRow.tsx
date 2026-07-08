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
    <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onDeleteExpense(index)}
        className="text-zinc-500 hover:text-red-400 hover:bg-red-950"
      >
        ✕
      </Button>

      <input
        type="text"
        placeholder="Expense Name"
        value={expense.label}
        onChange={(e) => onChangeExpense(index, "label", e.target.value)}
        required
        className="min-w-0 flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600"
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
        className="w-28 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-right text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-2">
        <input
          type="number"
          placeholder="Add"
          value={amount}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            setAmount(isNaN(parsed) ? 0 : parsed);
          }}
          className="w-20 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
