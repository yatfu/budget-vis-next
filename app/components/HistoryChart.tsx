"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const HistoryChart = () => {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // placeholder data — replace with real budget/spending totals per month
  const budget: number[] = [];
  const spending: number[] = [];
  const difference: number[] = budget.map((b, i) => b - spending[i]);
  const maxAbsDifference = Math.max(1, ...difference.map((d) => Math.abs(d)));

  const budgetVsSpendingData = {
    labels,
    datasets: [
      { label: "Budget", data: budget, backgroundColor: "oklch(70% 0.02 250)" },
      { label: "Spending", data: spending, backgroundColor: "oklch(65% 0.16 250)" },
    ],
  };

  const budgetVsSpendingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { stacked: false }, y: { stacked: false } },
  };

  const differenceData = {
    labels,
    datasets: [
      {
        label: "Budget - Spending",
        data: difference,
        backgroundColor: difference.map((d) =>
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
        min: -maxAbsDifference,
        max: maxAbsDifference,
        grid: {
          color: (ctx: { tick: { value: number } }) =>
            ctx.tick.value === 0 ? "#898781" : "#e1e0d9",
        },
      },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="h-100">
        <Bar data={budgetVsSpendingData} options={budgetVsSpendingOptions} />
      </div>
      <div className="h-100">
        <Bar data={differenceData} options={differenceOptions} />
      </div>
    </div>
  );
};

export default HistoryChart;
