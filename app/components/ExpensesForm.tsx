import React, { useState } from "react";
import { Expense } from "@/lib/types";

type ExpenseFormProps = {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const ExpensesForm = ({ expenses, setExpenses }: ExpenseFormProps) => {
  // { PROPS }

  const handleChange = (index: number, field: keyof Expense, value: string | number) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const addCategory = () => {
    setExpenses([...expenses, { name: "New Expense", value: 1000 }]);
  };

  const deleteCategory = (indexToRemove) => {
    const newExpenses = expenses.filter(
      (element, index, array) => index !== indexToRemove
    );
    setExpenses(newExpenses);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted expenses:", expenses);
  };

  return (
    <form onSubmit={handleSubmit}>
      {expenses.map((expense, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Category Name"
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
            onChange={(e) =>
              handleChange(index, "amount", parseFloat(e.target.value))
            }
            required
          />
          <button
            type="button"
            onClick={() => {
              deleteCategory(index);
            }}
          >
            X
          </button>
        </div>
      ))}
      {/* Delete function needs arrow function to pass parameters, addcategory does not, can pass function itself */}
      <div className="income-expenses-form-buttons">
        <button type="button" onClick={addCategory}>
          + Add Category
        </button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default ExpensesForm;
