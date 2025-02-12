import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import Navbar from "./Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ElderDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [servicesList, setServicesList] = useState([]);
    const [selectedCaretaker, setSelectedCaretaker] = useState(null);
    const [selectedService, setSelectedService] = useState("");
    const [selectedDateTime, setSelectedDateTime] = useState("");
    const [caretakers, setCaretakers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [serviceOptions, setServiceOptions] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [hours, setHours] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [bookingSuccessMessage, setBookingSuccessMessage] = useState(null);
    const [isBooking, setIsBooking] = useState(false);

    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.error("User not logged in. Please log in first.");
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/user/userDetails/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch {
                toast.error("Error fetching user details.");
            }
        };

        const fetchServices = async () => {
            try {
                const response = await axios.get("/service/list", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setServicesList(response.data);
            } catch {
                toast.error("Failed to fetch services.");
            }
        };

        const fetchCaretakers = async () => {
            try {
                const response = await axios.get(`/user/caretakers`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCaretakers(response.data);
            } catch {
                toast.error("Error fetching caretakers.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
        fetchServices();
        fetchCaretakers();
    }, [userId, navigate]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    const handleEmergency = () => {
        toast.success("Emergency alert sent!");
    };

    const handleBookingSubmit = async () => {
        const date = new Date(selectedDateTime);
        const options = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const istDate = date.toLocaleString('en-IN', options);
        const [datePart, timePart] = istDate.split(', ');
        const [day, month, year] = datePart.split('/');
        const formattedDateTime = `${year}-${month}-${day} ${timePart}`;

        const elderIdInt = parseInt(userId, 10);
        const hoursInt = parseInt(hours, 10);

        const bookingData = {
            elderId: elderIdInt,
            serviceId: selectedId,
            caretakerId: selectedCaretaker.id,
            datetime: formattedDateTime,
            bookingHrs: hoursInt,
            price: selectedPrice,
            status: "PENDING",
            message: `Booking created successfully for Caretaker ${selectedCaretaker.name}`
        };
        setIsBooking(true);

        try {
            const token = sessionStorage.getItem("token");
            await axios.post("/booking/create", bookingData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setBookingSuccessMessage(`Successfully Booking created for Caretaker ${selectedCaretaker.name}`);
            setTimeout(() => {
                setIsBooking(false);
                setBookingSuccessMessage(null);
                setSelectedService("");
                setSelectedPrice(null);
                setSelectedDateTime("");
                setHours(0);
                setSelectedCaretaker(null);
                setSelectedId(null);
            }, 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Booking failed.");
            setIsBooking(false);
        }
    };

    const handleCaretakerSelect = async (caretaker) => {
        setSelectedCaretaker(caretaker);

        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`/user/userDetails/${caretaker.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedCaretaker = response.data;

            if (updatedCaretaker.serviceIds && updatedCaretaker.serviceIds.length > 0) {
                const filteredServices = servicesList.filter(service =>
                    updatedCaretaker.serviceIds.includes(service.serviceId)
                );

                const serviceOptions = filteredServices.map(service => ({
                    value: service.serviceTitle,
                    label: service.serviceTitle,
                    price: service.hourlyPrice,
                    id: service.serviceId
                }));

                setServiceOptions(serviceOptions);
                setSelectedService("");
                setSelectedPrice(null);
                setSelectedId(null);
            } else {
                toast.error("Caretaker does not have any available services.");
            }
        } catch {
            toast.error("Error fetching caretaker data.");
        }
    };

    const handleServiceSelect = (selectedOption) => {
        setSelectedService(selectedOption.value);
        setSelectedPrice(selectedOption.price);
        setSelectedId(selectedOption.id);
    };

    const handleHoursChange = (event) => {
        const value = event.target.value;
        if (value >= 1) {
            setHours(value);
        }
    };

    return (
        <div className="min-h-screen p-4 bg-gradient-to-r from-blue-100 to-gray-300">
            <Navbar userType={user?.userType || ""} userName={user?.name || ""} onLogout={handleLogout} />

            <div className="flex flex-wrap justify-between gap-8 p-6">
                <div className="flex-1 space-y-6 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-blue-600">CareTakers</h2>
                    {isLoading ? (
                        <p className="text-blue-500">Loading caretakers...</p>
                    ) : !Array.isArray(caretakers) || caretakers.length === 0 ? (
                        <p className="text-blue-500">No caretakers available.</p>
                    ) : (
                        caretakers.map((caretaker) => (
                            <div key={caretaker.id} className="p-4 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer transition duration-300">
                                <h3 className="font-semibold text-blue-600">{caretaker.name}</h3>
                                <p><strong>Contact:</strong> {caretaker.contact}</p>
                                <p><strong>Email:</strong> {caretaker.email}</p>
                                <button
                                    onClick={() => handleCaretakerSelect(caretaker)}
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Select {caretaker.name}
                                </button>
                            </div>
                        ))
                    )}
                </div>


                <div className="flex-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold text-blue-600">Notifications</h2>
                        <p className="bg-blue-100 p-3 rounded-lg mb-2">No new notifications</p>
                    </div>
                    <button
                        onClick={handleEmergency}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 w-full"
                    >
                        Emergency Alert
                    </button>
                </div>
            </div>

            {selectedCaretaker && (
                <div className="p-6 bg-white rounded-xl shadow-lg m-6">
                    <h2 className="text-xl font-bold text-blue-600 mb-4">Book a Service with {selectedCaretaker.name}</h2>
                    <div className="space-y-4">
                        {/* Select Service */}
                        <div>
                            <label className="font-semibold">Select Service</label>
                            <Select
                                value={serviceOptions.find((option) => option.value === selectedService)}
                                onChange={handleServiceSelect}
                                options={serviceOptions}
                                className="w-full"
                            />
                        </div>

                        {/* Select Date & Time */}
                        <div className="space-y-4">
                            <div>
                                <label className="font-semibold">Select Date </label>
                                <DatePicker
                                    selected={selectedDateTime}
                                    onChange={(date) => setSelectedDateTime(date)}
                                    dateFormat="yyyy-MM-dd"
                                    minDate={new Date()}
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                                />
                            </div>

                            <div>
                                <label className="font-semibold">Select Time </label>
                                <DatePicker
                                    selected={selectedDateTime}
                                    onChange={(date) => setSelectedDateTime(date)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeFormat="h:mm aa"
                                    timeIntervals={60}
                                    dateFormat="h:mm aa"
                                    minDate={new Date()}
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                                />
                            </div>
                        </div>


                        {/* Select Number of Hours */}
                        <div>
                            <label className="font-semibold text-gray-700">Number of Hours</label>
                            <input
                                type="number"
                                value={hours}
                                onChange={handleHoursChange}
                                min="1"
                                className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleBookingSubmit}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full"
                            disabled={!selectedService || !selectedDateTime || selectedPrice === null || isBooking}
                        >
                            Submit Booking
                        </button>
                    </div>
                </div>
            )}

            {/* Booking Success Message */}
            {bookingSuccessMessage && (
                <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center p-4">
                    {bookingSuccessMessage}
                </div>
            )}

        </div>
    );
};

export default ElderDashboard;