import { Expense, ExpenseUseState, ExpenseRowProps } from "@/lib/types";
import ExpenseRow from "./ExpenseRow";

const ExpensesForm = ({
  expenses,
  setExpenses,
  selectedMonth,
  selectedYear,
}: ExpenseUseState & { selectedMonth: number; selectedYear: number }) => {
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
      console.log(JSON.stringify(expenses));
      const response = await fetch("/api/expenses", {
        // save expenses
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expenses, selectedMonth, selectedYear }),
      });
      console.log("Response from server:", response);
      if (!response.ok) {
        // check for error response
        throw new Error("Failed to save expenses");
      }
      console.log("Submitted expenses:", expenses);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
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
      <div className="income-expenses-form-buttons">
        <button type="button" onClick={addExpense} className="px-5">
          [ + ]
        </button>
        <button type="submit">Submit</button>
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
