import React from "react";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Filler,
  Tooltip as ChartJSTooltip,
  Legend as ChartJSLegend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Filler,
  ChartJSTooltip,
  ChartJSLegend
);

// Line Chart Component
const LineChart = ({ data }) => {
  const months = data.map((item) => item.month);
  const invoiceCounts = data.map((item) => item.invoiceCount);
  const totalPrices = data.map((item) => item.totalPrice);

  const chartConfig = {
    labels: months,
    datasets: [
      {
        label: "Invoice Count",
        data: invoiceCounts,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Total Price (₹)",
        data: totalPrices,
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (tooltipItem) => {
            const datasetLabel = tooltipItem.dataset.label || '';
            const value = tooltipItem.raw;
            if (tooltipItem.datasetIndex === 0) {
              return `${datasetLabel}: ${value} invoices`;
            } else if (tooltipItem.datasetIndex === 1) {
              return `${datasetLabel}: ₹${value}`;
            }
            return `${datasetLabel}: ${value}`;
          },
        },
        bodyFont: { weight: 'bold' },
        titleFont: { weight: 'bold' },
        backgroundColor: '#aaa',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="line-chart">
      <h2>Monthly Invoice and Price Summary</h2>
      <Line data={chartConfig} options={options} />
    </div>
  );
};

// Grouped Bar Chart Component
const GroupedBarChart = ({ chartData }) => {
  return (
    <div className="bar-chart">
      <h3>Month-Wise Invoice Count and Total Price</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 25, left: 25, bottom: 5 }}
        >
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Invoice Count") return [`${value} invoices`, name];
              if (name === "Total Price") return [`₹${value}`, name];
              return [value, name];
            }}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
            }}
          />
          <Legend />
          <Bar dataKey="invoiceCount" fill="#8884d8" name="Invoice Count" />
          <Bar dataKey="totalPrice" fill="#82ca9d" name="Total Price" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Pie Chart Component
const PieChart = ({ data }) => {
  const filteredData = data.filter((item) => item.invoiceCount > 0);

  const totalPriceChartData = {
    labels: filteredData.map((item) => item.month),
    datasets: [
      {
        label: "Total Price",
        data: filteredData.map((item) => item.totalPrice),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 1,
      },
    ],
  };

  const invoiceCountChartData = {
    labels: filteredData.map((item) => item.month),
    datasets: [
      {
        label: "Invoice Count",
        data: filteredData.map((item) => item.invoiceCount),
        backgroundColor: ["#4BC0C0", "#FF9F40", "#9966FF", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const datasetLabel = tooltipItem.dataset.label || "";
            const value = tooltipItem.raw;
            const total = tooltipItem.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${datasetLabel}: ₹${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="pie-chart-container">
      <h2>Monthly Invoice Analysis</h2>
      <div className="charts-wrapper">
        <div className="chart-item">
          <h3>Total Price Distribution (Month-wise)</h3>
          <Pie data={totalPriceChartData} options={options} />
        </div>
        <div className="chart-item">
          <h3>Invoice Count Distribution (Month-wise)</h3>
          <Pie data={invoiceCountChartData} options={options} />
        </div>
      </div>
    </div>
  );
};

// Parent Component
const Charts = ({ data }) => {
  return (
    <div className="dashboard-container">
      <LineChart data={data} />
      <GroupedBarChart chartData={data} />
      <PieChart data={data} />
    </div>
  );
};

export default Charts;
