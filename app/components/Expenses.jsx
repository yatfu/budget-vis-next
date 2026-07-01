"use client";

import ExpensesForm from "./ExpensesForm";
import ExpensesChart from "./ExpensesChart";
import { useState, useEffect } from "react";
import DateSelector from './DateSelector';

const Expenses = () => {
  const now = new Date();
  const user_id = 1;

  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1 == january
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/expenses?user_id=${user_id}`);
      const data = await res.json();
      console.log("EXPENSES DATA:", data);
      setExpenses(data);
    })();
  }, []);

  const oldExpenses = expenses // used for comparing to updated expenses when saving to database
  const filteredExpenses = expenses
    .filter((expenses) => expenses.month === selectedMonth)
    .filter((expenses) => expenses.year === selectedYear); // used for rendering selected dates

  //<ExpensesForm expenses={expenses} setExpenses={setExpenses} />
  return (
    <div className="expenses">
      <DateSelector 
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <ExpensesChart
        title={"Expenses"}
        labels={filteredExpenses.map((expense) => expense.label)}
        values={filteredExpenses.map((expense) => parseFloat(expense.amount))}
      />
    </div>
  );
};

export default Expenses;
