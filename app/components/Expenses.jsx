"use client";

import ExpensesForm from "./ExpensesForm";
import ExpensesChart from "./ExpensesChart";
import { useState, useEffect } from "react";
import DateSelector from './DateSelector';

const Expenses = () => {
  const now = new Date();

  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1 == january
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  useEffect(() => {
    (async () => {
      const cachedExpenses = localStorage.getItem("expenses");
      if (cachedExpenses) {
        setExpenses(JSON.parse(cachedExpenses));
        console.log("Found expenses cached in localstorage")
        return;
      }
      const res = await fetch(`/api/expenses`);
      const data = await res.json();
      console.log("EXPENSES DATA:", data);
      setExpenses(data);
      localStorage.setItem("expenses", JSON.stringify(data));
    })();
  }, []);

  const filteredExpenses = expenses
    .filter((expense) => expense.month === selectedMonth)
    .filter((expense) => expense.year === selectedYear); // used for rendering selected dates

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
      <ExpensesForm expenses={expenses} setExpenses={setExpenses} selectedMonth={selectedMonth} selectedYear={selectedYear} />
    </div>
  );
};

export default Expenses;
