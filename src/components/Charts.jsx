import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Charts() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Customer Visits",
        data: [30000, 25000, 40000, 35000, 45000, 50000],
        backgroundColor: "blue",
      },
      {
        label: "Earnings",
        data: [15000, 18000, 22000, 25000, 27000, 30000],
        backgroundColor: "green",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensure the chart uses available space
  };

  return (
<div className="bg-white p-4 shadow-lg rounded-lg">
      <h3 className="text-lg font-semibold">Monthly Overview</h3>
      <div className="h-96"> {/* Set a height for the chart */}
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

