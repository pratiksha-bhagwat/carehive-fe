import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Appointments = () => {
    const [bookings, setBookings] = useState({
        PENDING: [],
        CONFIRMED: [],
        CANCELLED: [],
        COMPLETED: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState("");
    const [services, setServices] = useState({});
    const [caretakerDetails, setCaretakerDetails] = useState({});
    const [elderDetails, setElderDetails] = useState({});
    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        fetchUserData();
        fetchServices();
    }, []);

    useEffect(() => {
        if (userType) {
            fetchBookings();
        }
    }, [userType]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`/user/userDetails/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            setUserType(response.data.userType);
        } catch {
            toast.error("Error fetching user details.");
        }
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get("/service/list", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const serviceData = response.data.reduce((acc, service) => {
                acc[service.serviceId] = service.serviceTitle;
                return acc;
            }, {});
            setServices(serviceData);
        } catch {
            toast.error("Failed to fetch services.");
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await axios.get(`/booking/allBookings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            const groupedBookings = {
                PENDING: [],
                CONFIRMED: [],
                CANCELLED: [],
                COMPLETED: []
            };

            response.data.forEach((booking) => {
                groupedBookings[booking.status]?.push(booking);
                fetchElderOrCaretakerDetails(booking);
            });

            setBookings(groupedBookings);
        } catch {
            toast.error("Failed to fetch bookings.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchElderOrCaretakerDetails = async (booking) => {
        try {
            if (booking.elderId && !elderDetails[booking.elderId]) {
                const elderResponse = await axios.get(`/user/userDetails/${booking.elderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                if (elderResponse.data) {
                    setElderDetails((prev) => ({
                        ...prev,
                        [booking.elderId]: elderResponse.data.name || "Unknown Elder",
                    }));
                }
            }
    
            if (booking.caretakerId && !caretakerDetails[booking.caretakerId]) {
                const caretakerResponse = await axios.get(`/user/userDetails/${booking.caretakerId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                if (caretakerResponse.data) {
                    setCaretakerDetails((prev) => ({
                        ...prev,
                        [booking.caretakerId]: caretakerResponse.data.name || "Unknown Caretaker",
                    }));
                }
            }
        } catch (error) {
            console.error("Error fetching Elder/Caretaker details:", error);
            toast.error("Failed to fetch Elder/Caretaker details.");
        }
    };
    

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    const statusColors = {
        PENDING: "border-yellow-500 text-yellow-700 bg-yellow-50",
        CONFIRMED: "border-green-500 text-green-700 bg-green-50",
        CANCELLED: "border-red-500 text-red-700 bg-red-50",
        COMPLETED: "border-blue-500 text-blue-700 bg-blue-50"
    };
    
    const renderBookings = (status) => (
        <div className={`shadow-lg rounded-lg p-6 w-full border-l-8 ${statusColors[status] || "border-gray-500 bg-gray-50"}`}>
            <h3 className="text-lg font-semibold mb-3">{status} Bookings</h3>
            {bookings[status].length ? (
                <div className="space-y-4">
                    {bookings[status].map((booking) => (
                        <div 
                            key={booking.bookingId}
                            className="p-4 rounded-lg shadow-sm border border-gray-300 hover:shadow-md transition duration-200 bg-white"
                        >
                            <div className="flex justify-between items-center border-b pb-2 mb-2">
                                <p className="text-sm font-bold text-gray-700">Booking ID: <span className="text-gray-900">{booking.bookingId}</span></p>
                                <span className={`px-3 py-1 text-xs font-semibold uppercase ${statusColors[status]}`}>
                                    {status}
                                </span>
                            </div>
                            <p className="text-gray-600"><strong>Service:</strong> {services[booking.serviceId] || "Loading..."}</p>
                            <p className="text-gray-600">
                                <strong>{userType === "Caretaker" ? "Elder Name" : "Caretaker Name"}:</strong> 
                                {userType === "Caretaker" ? (elderDetails[booking.elderId] || "Loading...") : (caretakerDetails[booking.caretakerId] || "Loading...")}
                            </p>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700">
                                <p><strong>Date:</strong> {new Date(booking.datetime).toLocaleString()}</p>
                                <p><strong>Booking Hours:</strong> {booking.bookingHrs} hrs</p>
                                <p><strong>Price per Hour:</strong> ₹{booking.price}</p>
                                <p><strong>Total Price:</strong> ₹{booking.totalprice}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No bookings available.</p>
            )}
        </div>
    );
    

    return (
        <div className="min-h-screen p-4 bg-gradient-to-r from-blue-100 to-gray-300 space-y-8">
            <Navbar 
                userType={user?.userType || "User"} 
                userName={user?.name || "Guest"} 
                onLogout={handleLogout} 
            />
            <h2 className="text-2xl font-bold text-blue-600">Manage Appointments</h2>
            {isLoading ? (
                <div className="text-center text-blue-500">Loading bookings...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderBookings("PENDING")}
                    {renderBookings("CONFIRMED")}
                    {renderBookings("CANCELLED")}
                    {renderBookings("COMPLETED")}
                </div>
            )}
        </div>
    );
};

export default Appointments;
