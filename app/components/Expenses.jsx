"use client";

import ExpensesForm from "./ExpensesForm";
import ExpensesChart from "./ExpensesChart";
import { useState, useEffect } from "react";
import DateSelector from "./DateSelector";

const Expenses = () => {
  const now = new Date();

  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1 == january
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [sortBy, setSortBy] = useState("none"); // "amount" | "name"

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/expenses`);
      const data = await res.json();
      console.log("EXPENSES DATA:", data);
      setExpenses(data);
    })();
  }, []);

  const filteredExpenses = expenses
    .filter((expense) => expense.month === selectedMonth)
    .filter((expense) => expense.year === selectedYear) // used for rendering selected dates
    .slice() // copy
    .sort((a, b) => {
      if (sortBy === "amount") {
        return b.amount - a.amount;
      } 
      else if (sortBy === "label") {
        return a.label.localeCompare(b.label);
      }
      else {
        return 0; // means dont sort
      }
    });

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
      <button
        onClick={() => {
          setSortBy("label");
        }}
      >
        Name
      </button>
      <button
        onClick={() => {
          setSortBy("amount");
        }}
      >
        Amount
      </button>

      <ExpensesForm
        expenses={filteredExpenses}
        setExpenses={setExpenses}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </div>
  );
};

export default Expenses;
