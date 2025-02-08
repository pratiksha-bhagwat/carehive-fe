export default function Table() {
  
  const appointments = [
    { name: "Ronald F. Darnall", date: "Nov 20", time: "05 AM - 08 AM", service: "Nursing Care" },
    { name: "Kay W. Mulkey", date: "Nov 28", time: "After 04 PM", service: "Special Care" },
    { name: "Gemma E. Wolfe", date: "Nov 30", time: "08 AM - 12 PM", service: "Home Care" },
    { name: "Samuel T. Hughes", date: "Dec 05", time: "10 AM - 02 PM", service: "Physical Therapy" },
    { name: "Olivia R. Carter", date: "Dec 12", time: "01 PM - 04 PM", service: "Mental Health Support" },
    { name: "Liam J. Bennett", date: "Dec 18", time: "09 AM - 11 AM", service: "Elderly Care" },

  ];
  
  return (
  <div className="bg-white p-4 shadow-lg rounded-lg mt-6 w-full">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Appointments</h3>
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2 text-gray-700">Customer</th>
          <th className="border p-2 text-gray-700">Date</th>
          <th className="border p-2 text-gray-700">Time</th>
          <th className="border p-2 text-gray-700">Service</th>
        </tr>
      </thead>
      
      <tbody>
        {appointments.map((appt, index) => (
          <tr key={index} className="text-center">
            <td className="border p-2 text-gray-700">{appt.name}</td>
            <td className="border p-2 text-gray-700">{appt.date}</td>
            <td className="border p-2 text-gray-700">{appt.time}</td>
            <td className="border p-2 text-gray-700">{appt.service}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}
  