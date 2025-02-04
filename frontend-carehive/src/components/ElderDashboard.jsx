import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import img from "../assets/logo.png";


const ElderDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [caretakers, setCaretakers] = useState([]);
    const [selectedCaretaker, setSelectedCaretaker] = useState(null);
    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        if (!userId) {
            toast.error("User not logged in. Please log in first.");
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:8080/user/caretakers`)
            .then(response => setCaretakers(response.data))
            .catch(error => console.error('Error fetching caretakers:', error));
    }, [userId, navigate]);

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:8080/user/userDetails/${userId}`)
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    console.error("Error fetching user details", error);
                });
        }
    }, [userId]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const handleEmergency = () => {
        toast.success('Emergency message sent!');
    };

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
            <nav className="bg-blue-300 text-white p-4 flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link to="/home"><img src={img} alt="Logo" className="h-10" /></Link>
                </div>
                <div className="flex space-x-4">
                    <Link to="/home" className={`hover:text-white border-2 rounded-2xl p-2 ${location.pathname === "/home" ? "text-white font-bold" : "text-blue-700"}`}>
                        Home
                    </Link>
                    <Link to="/profile" className="text-blue-700 hover:text-white border-2 rounded-2xl p-2">Profile</Link>
                    <Link to="/bookings" className="text-blue-700 hover:text-white border-2 rounded-2xl p-2">Bookings</Link>
                    <Link to="/emergency" className="text-blue-700 hover:text-white border-2 rounded-2xl p-2">Emergency</Link>
                    {user && <span className="text-lg border-2 rounded-2xl p-2">{user.name}</span>}
                    <button onClick={handleLogout} className="text-red-600 hover:text-red-800 border-2 rounded-2xl p-2">Logout</button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-wrap justify-between gap-8 p-6">
                {/* Left Section - Caretakers List */}
                <div className="flex-1 space-y-6 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-blue-700">CareTakers</h2>
                    {caretakers.length > 0 ? (
                        caretakers.map((caretaker) => (
                            <div key={caretaker.id} className="border-b p-4">
                                <h3 className="font-semibold text-blue-700">{caretaker.name}</h3>
                                <p><strong>Contact:</strong> {caretaker.contact}</p>
                                <button
                                    onClick={() => setSelectedCaretaker(caretaker)}
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Select {caretaker.name}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Loading caretakers...</p>
                    )}
                </div>

                {/* Right Section - Notifications */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-blue-700">Notifications</h2>
                        <p className="bg-gray-200 p-3 rounded-lg mb-2">No new notifications</p>
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
                                {selectedCaretaker.services && selectedCaretaker.services.length > 0 ? (
                                    selectedCaretaker.services.map((service, index) => (
                                        <option key={index} value={service}>{service}</option>
                                    ))
                                ) : (
                                    <option disabled>No services available</option>
                                )}
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
                                {selectedCaretaker.availableSlots && selectedCaretaker.availableSlots.length > 0 ? (
                                    selectedCaretaker.availableSlots.map((time, index) => (
                                        <option key={index} value={time}>{time}</option>
                                    ))
                                ) : (
                                    <option disabled>No available slots</option>
                                )}
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
