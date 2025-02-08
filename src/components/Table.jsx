export default function Table() {
  const appointments = [
    { id: 1, name: "Ronald F. Darnall", date: "Nov 20", time: "05 AM - 08 AM", service: "Nursing Care" },
    { id: 2, name: "Kay W. Mulkey", date: "Nov 28", time: "After 04 PM", service: "Special Care" },
    { id: 3, name: "Gemma E. Wolfe", date: "Nov 30", time: "08 AM - 12 PM", service: "Home Care" },
    { id: 4, name: "Samuel T. Hughes", date: "Dec 05", time: "10 AM - 02 PM", service: "Physical Therapy" },
    { id: 5, name: "Olivia R. Carter", date: "Dec 12", time: "01 PM - 04 PM", service: "Mental Health Support" },
    { id: 6, name: "Liam J. Bennett", date: "Dec 18", time: "09 AM - 11 AM", service: "Elderly Care" },
  ];

  return (
    <div className="bg-white p-6 shadow-md rounded-xl mt-6 w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Appointments</h3>
      
      {/* Scrollable Table with Smooth Design */}
      <div className="overflow-y-auto max-h-[280px] rounded-lg">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead className="sticky top-0 bg-gray-100 text-gray-700 rounded-lg">
            <tr className="text-left">
              <th className="p-3">#</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Service</th>
            </tr>
          </thead>
          
          <tbody>
            {appointments.map((appt, index) => (
              <tr key={index} className="bg-white shadow-md rounded-lg transition-all hover:bg-gray-50">
                <td className="p-3 text-gray-700">{appt.id}</td>
                <td className="p-3 text-gray-700">{appt.name}</td>
                <td className="p-3 text-gray-700">{appt.date}</td>
                <td className="p-3 text-gray-700">{appt.time}</td>
                <td className="p-3 text-gray-700">{appt.service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
