import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Charts() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Customer Visits",
        data: [30000, 25000, 40000, 35000, 45000, 50000],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: "Earnings",
        data: [15000, 18000, 22000, 25000, 27000, 30000],
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#374151",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#4B5563",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#4B5563",
          font: {
            size: 12,
            weight: "bold",
          },
          callback: function (value) {
            return `$${value / 1000}K`;
          },
        },
        grid: {
          color: "rgba(209, 213, 219, 0.5)",
          borderDash: [5, 5],
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 shadow-xl rounded-xl w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Overview</h3>
      <div className="h-64 sm:h-80 md:h-96 min-w-0">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
