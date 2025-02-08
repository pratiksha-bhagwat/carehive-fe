import { useState } from "react";

export default function Booking() {
  const [appointment, setAppointment] = useState({ name: "", date: "", time: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Appointment booked successfully!");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Your Name" className="border p-2 w-full" onChange={(e) => setAppointment({ ...appointment, name: e.target.value })} />
        <input type="date" className="border p-2 w-full" onChange={(e) => setAppointment({ ...appointment, date: e.target.value })} />
        <input type="time" className="border p-2 w-full" onChange={(e) => setAppointment({ ...appointment, time: e.target.value })} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Book Now</button>
      </form>
    </div>
  );
}