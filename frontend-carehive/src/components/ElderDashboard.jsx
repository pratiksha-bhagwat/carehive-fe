import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ElderDashboard = () => {
    const navigate = useNavigate();

    // Static User Data
    const user = { name: "John Doe" };

    // Static Caretakers Data
    const caretakers = [
        { id: 1, name: 'Alice', contact: '555-123-4567', services: ['Health Care', 'Assistance'], availableSlots: ['9:00 AM', '1:00 PM', '3:00 PM'] },
        { id: 2, name: 'Bob', contact: '555-234-5678', services: ['Cooking', 'Housekeeping'], availableSlots: ['10:00 AM', '2:00 PM', '4:00 PM'] }
    ];

    // Static Notifications
    const notifications = [
        "Your booking with Alice is confirmed for 2025-02-01 at 10:00 AM.",
        "Reminder: Your caretaker Bob will arrive tomorrow at 2:00 PM."
    ];

    // State
    const [selectedCaretaker, setSelectedCaretaker] = useState(null);
    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // Logout Handler
    const handleLogout = () => {
        navigate('/login');
    };

    // Emergency Alert
    const handleEmergency = () => {
        toast.success('Emergency message sent!');
    };

    // Booking Submit Handler
    const handleBookingSubmit = () => {
        if (!selectedCaretaker || !selectedService || !selectedDate || !selectedTime) {
            toast.error("Please fill in all fields before submitting.");
            return;
        }

        toast.success(`Booking for ${selectedService} with ${selectedCaretaker.name} on ${selectedDate} at ${selectedTime} has been submitted!`);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link to="/home">Logo</Link>
                </div>
                <div className="flex space-x-4">
                    <Link to="/home" className="text-blue-300 hover:text-white">Home</Link>
                    <Link to="/profile" className="text-blue-300 hover:text-white">Profile</Link>
                    <Link to="/bookings" className="text-blue-300 hover:text-white">Bookings</Link>
                    <Link to="/emergency" className="text-blue-300 hover:text-white">Emergency</Link>
                    <span className="text-lg">{user.name}</span>
                    <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-wrap justify-between gap-8 p-6">
                {/* Left Section - Caretakers List */}
                <div className="flex-1 space-y-6 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-blue-700">CareTakers</h2>
                    {caretakers.map((caretaker) => (
                        <div key={caretaker.id} className="border-b p-4">
                            <h3 className="font-semibold text-blue-700">{caretaker.name}</h3>
                            <p><strong>Contact:</strong> {caretaker.contact}</p>
                            <p><strong>Services:</strong> {caretaker.services.join(', ')}</p>
                            <button
                                onClick={() => setSelectedCaretaker(caretaker)}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Select {caretaker.name}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Right Section - Notifications */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-blue-700">Notifications</h2>
                        {notifications.map((notification, index) => (
                            <p key={index} className="bg-gray-200 p-3 rounded-lg mb-2">{notification}</p>
                        ))}
                    </div>

                    {/* Emergency Button */}
                    <button
                        onClick={handleEmergency}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 w-full"
                    >
                        Emergency Alert
                    </button>
                </div>
            </div>

            {/* Booking Form - Only Show When Caretaker is Selected */}
            {selectedCaretaker && (
                <div className="p-6 bg-white rounded-lg shadow-md m-6">
                    <h2 className="text-xl font-bold text-blue-700 mb-4">Book a Service with {selectedCaretaker.name}</h2>
                    <div className="space-y-4">
                        {/* Service Selection */}
                        <div>
                            <label className="font-semibold">Select Service</label>
                            <select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select a Service</option>
                                {selectedCaretaker.services.map((service) => (
                                    <option key={service} value={service}>{service}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Picker */}
                        <div>
                            <label className="font-semibold">Select Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        {/* Time Slot Picker */}
                        <div>
                            <label className="font-semibold">Select Time</label>
                            <select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Time</option>
                                {selectedCaretaker.availableSlots.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleBookingSubmit}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full"
                        >
                            Submit Booking
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ElderDashboard;
