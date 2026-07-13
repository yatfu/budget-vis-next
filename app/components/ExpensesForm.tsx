import { Expense, ExpenseUseState } from "@/lib/types";
import ExpenseRow from "./ExpenseRow";
import Budget from "./Budget";
import { cn, buttonBase, buttonVariants, buttonSizes } from "@/lib/utils";

const ExpensesForm = ({
  expenses,
  setExpenses,
  budget, setBudget,
  sortBy, setSortBy,
  selectedMonth,
  selectedYear,
  setModalOpen,
}: ExpenseUseState & {budget: number; setBudget: React.Dispatch<React.SetStateAction<number>>; selectedMonth: number; selectedYear: number }) => {
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
      console.log('Submitting...')
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
      setModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex flex-col gap-1">
      <div className="flex justify-between gap-1">
              <div className="flex items-center gap-1">
        <p className="text-sm font-medium">Budget</p>
        <Budget budget={budget} setBudget={setBudget} />
      </div>
      <div className="flex items-center gap-1">
        <p className="text-sm font-medium">Sort By</p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className={cn(buttonBase, buttonVariants.secondary, buttonSizes.default)}
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
          className={cn(buttonBase, buttonVariants.secondary, buttonSizes.default)}
        >
          + Add Expense
        </button>
        <button type="submit" className={cn(buttonBase, buttonVariants.default, buttonSizes.default)}>
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
