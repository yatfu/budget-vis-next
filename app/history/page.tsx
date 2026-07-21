"use client";

import { Bar, Line, Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const HistoryPage = () => {
  // placeholder labels/data — replace with expenses/budgets grouped by month
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const data = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Expenses",
        data: [] as number[],
        stack: "budget",
      },
      {
        type: "bar" as const,
        label: "Remaining budget",
        data: [] as number[],
        stack: "budget",
      },
      {
        // line dataset stacked on the same axis as the bars above, not stacked with them (Chart.js only stacks same-type datasets sharing a "stack" key)
        type: "line" as const,
        label: "Budget",
        data: [] as number[],
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  return (
    <div className="h-100">
      {/* generic Chart component (not the typed Bar/Line wrappers) is what supports mixed bar+line datasets with correct types */}
      <Chart type="bar" data={data} options={options} />
    </div>
  );
};

export default HistoryPage;
