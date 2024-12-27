import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({monthData}) => {
  // Static dataset
  const data = {
    labels:monthData.labels, //['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // All 12 months
    datasets:monthData.datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Position of the legend
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Users: ${tooltipItem.raw}` // Custom tooltip format
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month', // Label for the x-axis
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Users', // Label for the y-axis
        },
        min: 0, // y-axis minimum value
        max: 100, // y-axis maximum value
        ticks: {
          stepSize: 10 // Tick interval for the y-axis
        }
      }
    }
  };

  return (
    <>      
    <h2 style={{textAlign:'center'}}>Month-Wise User Registrations</h2>
    <div className="line">
      <Line data={data} options={options} />
    </div>
    </>
  );
};

export default LineChart;
