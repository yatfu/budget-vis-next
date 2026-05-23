import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const IncomeExpensesChart = ({labels, values}) => {
  // Random values for demo
  const chartColors = [
  'rgba(255, 99, 132, 0.7)',     // vivid red
  'rgba(54, 162, 235, 0.7)',     // medium blue
  'rgba(255, 206, 86, 0.7)',     // bright yellow
  'rgba(75, 192, 192, 0.7)',     // soft teal
  'rgba(255, 159, 64, 0.7)',     // orange
  'rgba(153, 102, 255, 0.7)',    // purple
  'rgba(0, 200, 83, 0.7)',       // bright green
  'rgba(233, 30, 99, 0.7)',      // pink
  'rgba(0, 188, 212, 0.7)',      // cyan
  'rgba(255, 87, 34, 0.7)',      // deep orange
  'rgba(63, 81, 181, 0.7)',      // indigo
  'rgba(205, 220, 57, 0.7)',     // lime yellow
  'rgba(156, 39, 176, 0.7)',     // violet
  'rgba(0, 150, 136, 0.7)',      // dark teal
  'rgba(244, 67, 54, 0.7)',      // strong red
  'rgba(33, 150, 243, 0.7)',     // clean blue
  'rgba(255, 238, 88, 0.7)',     // lemon
  'rgba(124, 179, 66, 0.7)',     // muted green
  'rgba(255, 112, 67, 0.7)',     // soft coral
  'rgba(103, 58, 183, 0.7)',     // deep purple
];

  const data = {
    labels: labels,
    datasets: [
      {
        label: '$',
        data: values,
        backgroundColor: chartColors,
        borderColor: 'transparent',
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '40%',
    plugins: {
      legend: {
        position: 'right',
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

export default IncomeExpensesChart;