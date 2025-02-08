/*
export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white p-4 sm:p-6 shadow-lg rounded-lg text-center text-gray-700 flex flex-col justify-between h-full">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700">{title}</h2>
      <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-700">{value}</p>
    </div>
  );
}
*/

import { FaUsers, FaDollarSign, FaCalendarCheck } from "react-icons/fa";

const getIcon = (title) => {
  switch (title) {
    case "Total Customers":
      return <FaUsers className="text-4xl text-blue-500" />;
    case "Earnings":
      return <FaDollarSign className="text-4xl text-green-500" />;
    case "Appointments":
      return <FaCalendarCheck className="text-4xl text-purple-500" />;
    default:
      return <FaUsers className="text-4xl text-gray-500" />;
  }
};

export default function StatsCard({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 p-6 shadow-md rounded-2xl text-center flex flex-col items-center justify-between border border-gray-200">
      <div className="mb-4">{getIcon(title)}</div>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-3xl sm:text-4xl font-bold mt-2 text-gray-900">{value}</p>
    </div>
  );
}
