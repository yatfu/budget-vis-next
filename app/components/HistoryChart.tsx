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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type HistoryChartProps = {
  budgets: number[];
  expenses: number[];
  differences: number[];
};

const HistoryChart = ({ budgets, expenses, differences }: HistoryChartProps) => {
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
  const absoluteDifferences = Math.max(1, ...differences.map((d) => Math.abs(d)));
  //console.log(expenses)


  const budgetVsExpensesData = {
    labels,
    datasets: [
      { label: "Budget", data: budgets, backgroundColor: "oklch(0.65 0.16 250)" },
      {
        label: "Expenses",
        data: expenses,
        backgroundColor: "oklch(0.65 0.16 55)",
      },
    ],
  };

  const budgetVsExpensesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { stacked: false }, y: { stacked: false } },
    plugins: {
      tooltip: {
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
      },
    ],
  };

  const differenceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: -absoluteDifferences,
        max: absoluteDifferences,
        ticks: { maxTicksLimit: 5 },
        grid: {
          color: (ctx: { tick: { value: number } }) =>
            ctx.tick.value === 0 ? "#898781" : "#e1e0d9",
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            `${context.dataset.label ?? ""}: $${context.parsed.y ?? 0}`,
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="h-100">
        <Bar data={budgetVsExpensesData} options={budgetVsExpensesOptions} />
      </div>
      <div className="h-64">
        <Bar data={differenceData} options={differenceOptions} />
      </div>
    </div>
  );
};

export default HistoryChart;
