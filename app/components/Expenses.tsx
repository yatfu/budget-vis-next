"use client";

import ExpensesForm from "./ExpensesForm";
import ExpensesChart from "./ExpensesChart";
import { useState, useEffect } from "react";
import DateSelector from "./DateSelector";
import Modal from "./Modal";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Expense, Budget } from "@/lib/types";
import { cn, buttonBase, buttonVariants, buttonSizes, cardStyles } from "@/lib/utils";

type SortBy = "none" | "amount" | "label";

const Expenses = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [budgets, setBudgets] = useState<Budget[]>([]); // default budget
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

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

  const [sortBy, setSortBy] = useState<SortBy>("amount");

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/expenses`);
      const { expenses, budgets }: { expenses: Expense[], budgets: Budget[] } = await res.json();
      console.log("EXPENSES DATA:", expenses);
      setExpenses(expenses);
      console.log("BUDGETS DATA:", budgets);
      setBudgets(budgets);
    })();
  }, []);

  const filteredExpenses = expenses
    .filter((expense) => expense.month === selectedMonth)
    .filter((expense) => expense.year === selectedYear) // used for rendering selected dates
    .slice() // copy
    .sort((a, b) => {
      if (sortBy === "amount") {
        return a.amount - b.amount;
      } else if (sortBy === "label") {
        return a.label.localeCompare(b.label);
      } else {
        return 0; // means dont sort
      }
    });

    const filteredBudgets = budgets
      .filter((budget) => budget.month === selectedMonth)
      .filter((budget) => budget.year === selectedYear);

  return (
    <div className="expenses flex flex-col gap-1">
      <DateSelector
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <div className="flex items-center gap-1">
      </div>

      <div className={cardStyles}>
        <ExpensesChart
          labels={filteredExpenses.map((expense) => expense.label)}
          values={filteredExpenses.map((expense) => expense.amount)}
          budget={filteredBudgets[0]?.amount ?? 0}
        />
      </div>
      <Modal isModalOpen={isModalOpen} setModalOpen={setModalOpen} message="Expenses saved" />
      <ExpensesForm
        expenses={filteredExpenses}
        setExpenses={setExpenses}
        budget={filteredBudgets[0]?.amount ?? 0}
        setBudget={setBudgets}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setModalOpen={setModalOpen}
      />
    </div>
  );
};

export default Expenses;