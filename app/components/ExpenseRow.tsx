import { ExpenseRowProps } from "@/lib/types";
import { useState } from "react";
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
    <div>
      <button
        type="button"
        onClick={() => {
          onDeleteExpense(index);
        }}
      >
        X
      </button>
      <input
        type="text"
        placeholder="Expense Name"
        value={expense.label}
        onChange={(e) => onChangeExpense(index, "label", e.target.value)}
        required
      />
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Value"
        value={expense.amount}
        onChange={(e) => {
          const parsed = parseFloat(e.target.value);
          onChangeExpense(index, "amount", isNaN(parsed) ? 0 : parsed); // CHATGPT solution to bug: when deleting the entire input, NaN is given to parseFloat which causes error
        }}
        required
      />
      <input
        type="number"
        onChange={(e) => {
          setAmount(parseFloat(e.target.value));
        }}
        placeholder="Add"
        value={amount}
      />
      <button type="button" onClick={() => handleAdd(index, amount)}>
        {" "}
        +{" "}
      </button>
    </div>
  );
}
/**
 * 
 *       {expenses.map((expense, index) => (
        <div key={expense.id}>
          <button
            type="button"
            onClick={() => {
              deleteExpense(index);
            }}
          >
            X
          </button>
          <input
            type="text"
            placeholder="Expense Name"
            value={expense.label}
            onChange={(e) => handleChange(index, "label", e.target.value)}
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Value"
            value={expense.amount}
            onChange={(e) => {
              const parsed = parseFloat(e.target.value);
              handleChange(index, "amount", isNaN(parsed) ? 0 : parsed); // CHATGPT solution to bug: when deleting the entire input, NaN is given to parseFloat which causes error
            }}
            required
          />
        </div>
      ))}
 */
