"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Budget, Expense } from "@/lib/types";
import { cn, cardStyles } from "@/lib/utils";
import YearStepper from "./YearStepper";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type HistoryChartProps = {
  budgets: Budget[];
  expenses: {year: number, total: number, month: number}[];
};

const HistoryChart = ({ budgets, expenses }: HistoryChartProps) => {
  const labels = [
    "January",
    "Feburary",
    "March",
    "Aprli",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const filteredExpenses = expenses.filter((e) => e.year === selectedYear);
  const filteredBudgets = budgets.filter((b) => b.year === selectedYear);

  const expensesByMonth = new Map(filteredExpenses.map((e) => [e.month, e.total]));
  const budgetsByMonth = new Map(filteredBudgets.map((b) => [b.month, b.amount]));

  const monthNumbers = Array.from({ length: 12 }, (_, i) => i + 1); // [1..12], we need the entire array from 1-12 to fill out the chart, instead of only including months that have expenses and budgets
  const expensesByMonthArray: number[] = [];
  const budgetsByMonthArray: number[] = [];

  for (let i = 1; i < 13; i++) {
    let amount: number | undefined = expensesByMonth.get(i);
    if (amount) { // null = 0 in this case, but it's okay because the data is only used for display
      expensesByMonthArray.push(amount)
    }
    else {
      expensesByMonthArray.push(0);
    }
  } 

  for (let i = 1; i < 13; i++) {
    let amount: number | undefined = budgetsByMonth.get(i);
    if (amount) { // null = 0 in this case, but it's okay because the data is only used for display
      budgetsByMonthArray.push(amount)
    }
    else {
      budgetsByMonthArray.push(0);
    }
  } 

  const differences: number[] = budgetsByMonthArray.map(
    (b, i) => b - expensesByMonthArray[i]
  );


  const absoluteDifferences = Math.max(1, ...differences.map((d) => Math.abs(d)));
  //console.log(expenses)


  const budgetVsExpensesData = {
    labels,
    datasets: [
      {
        label: "Budget",
        data: budgetsByMonthArray,
        backgroundColor: "oklch(0.65 0.16 250)",
        maxBarThickness: 32,
      },
      {
        label: "Expenses",
        data: expensesByMonthArray,
        backgroundColor: "oklch(0.65 0.16 55)",
        maxBarThickness: 32,
      },
    ],
  };

  const budgetVsExpensesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#898781" },
      },
      y: {
        stacked: false,
        border: { display: false },
        grid: { color: "#e1e0d9" },
        ticks: { color: "#898781" },
      },
    },
    plugins: {
      tooltip: {
        padding: 12,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { size: 14, weight: "bold" as const },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            `${context.dataset.label ?? ""}: $${context.parsed.y ?? 0}`,
        },
      },
    },
  };

  const differenceData = {
    labels,
    datasets: [
      {
        label: "Budget - Expenses",
        data: differences,
        backgroundColor: differences.map((d) =>
          d >= 0 ? "oklch(69.6% 0.25 162.5)" : "oklch(0.55 0.22 25)"
        ),
        maxBarThickness: 32,
      },
    ],
  };

  const differenceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#898781" },
      },
      y: {
        min: -absoluteDifferences,
        max: absoluteDifferences,
        ticks: { maxTicksLimit: 5, color: "#898781" },
        border: { display: false },
        grid: {
          color: (ctx: { tick: { value: number } }) =>
            ctx.tick.value === 0 ? "#898781" : "#e1e0d9",
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        padding: 12,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { size: 14, weight: "bold" as const },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            `${context.dataset.label ?? ""}: $${context.parsed.y ?? 0}`,
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-1">
      <YearStepper year={selectedYear} setYear={setSelectedYear} />
      <div className={cn(cardStyles, "h-100", "p-4", "flex flex-col gap-2")}>
        <p className="text-sm font-medium text-center">Budget vs Expenses</p>
        <div className="relative flex-1">
          <Bar data={budgetVsExpensesData} options={budgetVsExpensesOptions} />
        </div>
      </div>
      <div className={cn(cardStyles, "h-64", "p-4", "flex flex-col gap-2")}>
        <p className="text-sm font-medium text-center">Savings</p>
        <div className="relative flex-1">
          <Bar data={differenceData} options={differenceOptions} />
        </div>
      </div>
    </div>
  );
};

export default HistoryChart;
