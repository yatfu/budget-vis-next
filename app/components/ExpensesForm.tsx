import { Expense, ExpenseUseState } from "@/lib/types";

const ExpensesForm = (
  { expenses, setExpenses, selectedMonth, selectedYear }: 
  ExpenseUseState & {selectedMonth: number; selectedYear: number}) => {
  // { PROPS }
  
  const handleChange = <K extends keyof Expense>(
    index: number, field: K, value: Expense[K]) => { // 
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const addCategory = () => {
    const tempId = "temp" + crypto.randomUUID();// temp id is used to match type
    setExpenses([...expenses, 
      { id: tempId, user_id: tempId, label: "New Expense", amount: 1000, month: selectedMonth, year: selectedYear }
    ]); // temp ids are not sent to db
  };

  const deleteCategory = (indexToRemove: number) => {
    const newExpenses = expenses.filter(
      (element, index, array) => index !== indexToRemove
    );
    setExpenses(newExpenses);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(JSON.stringify(expenses));
      const response = await fetch("/api/expenses", { // save expenses
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({expenses, selectedMonth, selectedYear})
      });
      console.log("Response from server:", response);
      if (!response.ok) { // check for error response
        throw new Error("Failed to save expenses");
      }
      console.log("Submitted expenses:", expenses);

    } catch (error) {console.error(error);}
  };

  return (
    <form onSubmit={handleSubmit}>
      {expenses.map((expense, index) => (
        <div key={expense.id}>
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
            onChange={(e) => {
              const parsed = parseFloat(e.target.value);
              handleChange(index, "amount", isNaN(parsed) ? 0 : parsed); // CHATGPT solution to bug: when deleting the entire input, NaN is given to parseFloat which causes error
            }}
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
        <button type="button" onClick={addCategory} className="px-5">
          [ + ]
        </button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default ExpensesForm;
