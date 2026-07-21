import { Expense, ExpenseUseState, Budget } from "@/lib/types";
import ExpenseRow from "./ExpenseRow";
import BudgetForm from "./BudgetForm";
import { cn, buttonBase, buttonVariants, buttonSizes } from "@/lib/utils";

import { inputStyles } from "@/lib/utils";

const ExpensesForm = ({
  expenses,
  setExpenses,
  budgets,
  setBudgets,
  sortBy,
  setSortBy,
  selectedMonth,
  selectedYear,
  setModalOpen,
}: ExpenseUseState & {
  budgets: Budget[];
  setBudgets: React.Dispatch<Budget[]>;
  selectedMonth: number;
  selectedYear: number;
}) => {
  // { PROPS }

  const handleChange = <K extends keyof Expense>(
    index: number,
    field: K,
    value: Expense[K]
  ) => {
    //
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const addAmount = (index: number, value: number) => {
    const newExpenses = [...expenses];
    newExpenses[index].amount += value;
    setExpenses(newExpenses);
  };
  const addExpense = () => {
    const tempId = "temp" + crypto.randomUUID(); // temp id is used to match type
    setExpenses([
      ...expenses,
      {
        id: tempId,
        user_id: tempId,
        label: "New Expense",
        amount: 1000,
        month: selectedMonth,
        year: selectedYear,
      },
    ]); // temp ids are not sent to db
  };

  const deleteExpense = (indexToRemove: number) => {
    const newExpenses = expenses.filter(
      (element, index, array) => index !== indexToRemove
    );
    setExpenses(newExpenses);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("Submitting...");
      console.log(JSON.stringify(expenses));
      const response = await fetch("/api/expenses", {
        // save expenses
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expenses, budgets, selectedMonth, selectedYear }),
      });
      console.log("Response from server:", response);
      if (!response.ok) {
        // check for error response
        throw new Error("Failed to save expenses");
      }
      console.log("Submitted expenses:", expenses);
      setModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredBudget = budgets
    .filter((budget: Budget) => budget.month === selectedMonth)
    .filter((budget: Budget) => budget.year === selectedYear)[0];

  const handleBudgetChange = (newAmount: number) => {
    const tempId = "temp" + crypto.randomUUID(); // temp id is used to match type
    if (!filteredBudget) {
      const newBudgets: Budget[] = [...budgets]; // duplicate budget array because set function cant use same array
      newBudgets.push({id: tempId, user_id: tempId, amount: newAmount, month: selectedMonth, year: selectedYear})
      setBudgets(newBudgets);
    }
    else {
      const newBudgets = budgets.map(b => b.id === filteredBudget.id ? { ...b, amount: newAmount } : b); // map returns new array, doesnt modify existing
      setBudgets(newBudgets);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-1"
    >
      <div className="flex justify-between gap-1">
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium">Budget</p>

          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="Budget"
              value={filteredBudget?.amount ?? 5000}
              onChange={(e) => handleBudgetChange(Number(e.target.value))}
              className={cn("w-28 h-9 text-right", inputStyles)}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium">Sort By</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className={cn(
              buttonBase,
              buttonVariants.secondary,
              buttonSizes.default
            )}
          >
            <option value="label">Name</option>
            <option value="amount">Amount</option>
          </select>
        </div>
      </div>
      {expenses.map((expense, index) => (
        <ExpenseRow
          key={expense.id ?? index}
          expense={expense}
          index={index}
          onAddAmount={addAmount}
          onAddExpense={addExpense}
          onChangeExpense={handleChange}
          onDeleteExpense={deleteExpense}
        />
      ))}
      {/* Delete function needs arrow function to pass parameters, addExpense does not, can pass function itself */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={addExpense}
          className={cn(
            buttonBase,
            buttonVariants.secondary,
            buttonSizes.default
          )}
        >
          + Add Expense
        </button>
        <button
          type="submit"
          className={cn(
            buttonBase,
            buttonVariants.default,
            buttonSizes.default
          )}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

// prevent enter key from submitting
const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};

export default ExpensesForm;
