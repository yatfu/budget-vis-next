import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function getBudgetColor(value: number, maxBudget: number): string {
  if (value > maxBudget) {
    return "oklch(0.55 0.22 25)"; // red — over budget
  }

  const t = maxBudget === 0 ? 0 : value / maxBudget;
  const blueHue = 250;
  const orangeHue = 55;
  const lightness = 0.65;

  const maxChroma = 0.2;
  const minChroma = 0.06; // floor — never fully gray

  if (t <= 0.5) {
    const stageT = t / 0.5;
    const chroma = maxChroma - (maxChroma - minChroma) * stageT;
    return `oklch(${lightness} ${chroma} ${blueHue})`;
  } else {
    const stageT = (t - 0.5) / 0.5;
    const chroma = minChroma + (maxChroma - minChroma) * stageT;
    return `oklch(${lightness} ${chroma} ${orangeHue})`;
  }
}

const ExpensesChart = ({ labels, values }) => {
  const TEMPBUDGET = 10000;
  const maxBudget = TEMPBUDGET;
  const cumulativeSum = values.reduce((acc: number[], value, i) => {
    const previousTotal = i === 0 ? 0 : acc[i - 1];
    acc.push(previousTotal + value);
    return acc;
  }, []);

  const colors = cumulativeSum.map((total) => getBudgetColor(total, maxBudget));

  const data = {
    labels: labels,
    datasets: [
      {
        label: "$",
        data: values,
        backgroundColor: colors,
        borderColor: "hsl(var(--background))", // matches page bg, creates a clean gap
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "40%",
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
    <div className="income-expenses-chart">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ExpensesChart;
