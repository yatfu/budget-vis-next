"use client";

import ExpensesForm from "./ExpensesForm";
import ExpensesChart from "./ExpensesChart";
import { useState, useEffect } from "react";
import DateSelector from "./DateSelector";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const selectedMonth = Number(searchParams.get("month")) || new Date().getMonth() + 1;
  const selectedYear = Number(searchParams.get("year")) || new Date().getFullYear();
  // Write to URL
  const setSelectedMonth = (month: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(month));
    router.push(`${pathname}?${params.toString()}`);
  };

  const setSelectedYear = (year: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(year));
    router.push(`${pathname}?${params.toString()}`);
  };
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
