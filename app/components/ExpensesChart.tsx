import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getRemainingBudget } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

function getBudgetColor(value: number, budget: number): string {
  if (value > budget) {
    return "oklch(0.55 0.22 25)"; // red — over budget
  }

  const t = budget === 0 ? 0 : value / budget;
  const blueHue = 250;
  const orangeHue = 55;
  const lightness = 0.65;

  const maxChroma = 0.16;
  const minChroma = 0.06; // floor — never fully gray

  const threshold = 0.55; // blue now covers 0–70% of budget, orange only kicks in for the last 30%

  if (t <= threshold) {
    const stageT = t / threshold;
    const chroma = maxChroma - (maxChroma - minChroma) * stageT;
    return `oklch(${lightness} ${chroma} ${blueHue})`;
  } else {
    const stageT = (t - threshold) / (1 - threshold);
    const chroma = minChroma + (maxChroma - minChroma) * stageT;
    return `oklch(${lightness} ${chroma} ${orangeHue})`;
  }
}

const ExpensesChart = ({ labels, values, budget }: {labels: string[], values: number[], budget: number}) => {

  const cumulativeSum: number[] = []; // each index is its own expense + sum of all elements behind it
  const colors: string[] = []; 

  let runningTotal = 0; // reduced total
  
  for (let i = 0; i < values.length; i++) { 
    runningTotal += values[i]; // calculate reduced total
    cumulativeSum.push(runningTotal); // O(1) since adding to end of array
  }
  
  for (let i = 0; i < cumulativeSum.length; i++) {
    colors.push(getBudgetColor(cumulativeSum[i], budget)); // O(1)
  }

  // add remaining budget to data
  // Claude advised to create new arrays instead of using current props
  // fixed bug where rendering wasnt happening because i was changing props
  const chartLabels = [...labels, "Remaining Budget"];
  const chartValues = [...values, getRemainingBudget(values, budget)];
  const chartColors = [...colors, "oklch(69.6% 0.25 162.5)"]; // hardcoded color

  const data = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: chartColors,
        borderColor: "hsl(var(--background))", // matches page bg, creates a clean gap
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "40%",
    offset: chartValues.map((_, i) =>
    i === chartValues.length - 1 ? 50 : 0), // pop out the last segment (Remaining Budget)
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="h-100">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ExpensesChart;
