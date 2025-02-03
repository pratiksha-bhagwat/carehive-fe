export default function StatsCard({ title, value }) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg text-center  text-gray-700">
        <h2 className="text-xl font-semibold  text-gray-700">{title}</h2>
        <p className="text-3xl font-bold mt-2  text-gray-700">{value}</p>
      </div>
    );
  }
  