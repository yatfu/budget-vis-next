import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { cn, cardStyles } from '@/lib/utils';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Ratio = () => {
  // Labels for the bars
  const labels = ['Income', 'Expenses'];

  // Placeholder values
  const data = {
    labels,
    datasets: [
      {
        label: 'January',
        data: [5000, 3000], // Income = 5000, Expenses = 3000
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'February',
        data: [6000, 2500], // Income = 6000, Expenses = 2500
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // fit to container
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
  };

  return (
    <div className={cn("ratio", cardStyles)}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default Ratio;