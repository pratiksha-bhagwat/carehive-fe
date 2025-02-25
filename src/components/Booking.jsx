import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import ReactStars from "react-rating-stars-component";

const Bookings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [userType, setUserType] = useState("Caretaker");
    const [bookings, setBookings] = useState([]);
    const [elderDetails, setElderDetails] = useState(null);
    const [caretakerDetails, setCaretakerDetails] = useState(null);
    const [services, setServices] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");
        if (!userId || !token) {
            toast.error("User not logged in. Please log in.");
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/user/userDetails/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
                setUserType(response.data.userType || "Caretaker");
            } catch (error) {
                console.error("Error fetching user details:", error);
                toast.error(error.response?.data?.message || "Failed to fetch user details.");
                navigate("/login");
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
            } catch (error) {
                console.error("Error fetching services:", error);
                toast.error("Failed to fetch services.");
            }
        };

        const fetchBookings = async () => {
            try {
                const response = await axios.get(`/booking/list/${userId}/${userType}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(response.data);

                // Fetch additional details for each booking
                response.data.forEach((booking) => fetchElderOrCaretakerDetails(booking));
            } catch (error) {
                setError("Failed to fetch bookings. Please try again.");
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchServices();
        fetchBookings();
    }, [userType, navigate]);

    const fetchElderOrCaretakerDetails = async (booking) => {
        const token = sessionStorage.getItem("token");
        try {
            if (userType === "Caretaker") {
                const elderResponse = await axios.get(`/user/userDetails/${booking.elderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setElderDetails(elderResponse.data);
            } else if (userType === "Elder") {
                const caretakerResponse = await axios.get(`/user/userDetails/${booking.caretakerId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCaretakerDetails(caretakerResponse.data);
            }
        } catch (error) {
            console.error("Error fetching Elder/Caretaker details:", error);
            toast.error("Failed to fetch Elder/Caretaker details.");
        }
    };

    const handleStatusUpdate = async (bookingId, status) => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.error("Authentication failed. Please log in again.");
            navigate("/login");
            return;
        }

        try {
            await axios.patch(`/booking/${bookingId}/${status}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success(`Booking ${status} successfully`);
            setBookings(prev =>
                prev.map(booking =>
                    booking.bookingId === bookingId ? { ...booking, status } : booking
                )
            );
        } catch {
            toast.error("Failed to update booking status.");
        }
    };

    const handlePayment = (bookingId) => {
        sessionStorage.setItem("bookingId", bookingId);
        navigate("/payment");
    };

    const handleLogout = () => {
        sessionStorage.removeItem("userId");
        navigate("/login");
    };

    return (
        <div className="min-h-screen p-4 bg-gradient-to-r from-blue-100 to-gray-300">
            <Navbar
                userType={userType}
                userName={user?.name}
                onLogout={handleLogout}
            />

            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-6 border-l-4 border-blue-500">
                <h1 className="text-2xl font-bold text-gray-700 text-center mb-6">Bookings</h1>

                {loading || !services || !user ? (
                    <p className="text-center text-gray-600">Loading bookings...</p>
                ) : error ? (
                    <div>
                        <p className="text-center text-red-600">{error}</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <p className="text-center text-gray-600">No bookings found.</p>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.bookingId} 
                            className={`p-4 border-2 rounded-lg hover:shadow-2xl transition-shadow duration-300 ${
                                booking.status === "PENDING" ? "border-yellow-500 text-yellow-700 bg-yellow-50" :
                                booking.status === "CONFIRMED" ? "border-blue-500 text-blue-700 bg-blue-50" :
                                booking.status === "COMPLETED" ? "border-green-500 text-green-700 bg-green-50" :
                                booking.status === "CANCELLED" ? "border-red-500 text-red-700 bg-red-50": "border-gray-500 bg-gray-50"
                            }`}
                        >
                        
                                <div className="flex flex-wrap justify-between items-start space-y-4 md:space-y-0">
                                    <div className="space-y-2 flex-1">
                                        <p className="font-medium text-gray-700">
                                            {userType === "Caretaker" ? "Elder Details" : "Caretaker Details"}
                                        </p>
                                        <div className="space-y-1">
                                            {userType === "Caretaker" && elderDetails && (
                                                <div>
                                                    <p className="text-gray-600"><strong>Name:</strong> {elderDetails.name}</p>
                                                    <p className="text-gray-600"><strong>Contact:</strong> {elderDetails.contact}</p>
                                                    <p className="font-bold">
                                                        <span className={`inline-block py-1 px-3 rounded-full text-xs ${booking.status === "COMPLETED" ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"}`}>
                                                            {booking.status}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                            {userType === "Elder" && caretakerDetails && (
                                                <div>
                                                    <p className="text-gray-600"><strong>Name:</strong> {caretakerDetails.name}</p>
                                                    <p className="text-gray-600"><strong>Contact:</strong> {caretakerDetails.contact}</p>
                                                </div>
                                            )}
                                            {booking.status === "COMPLETED" && (
                                    <div className="mt-6">
                                        <p className="text-gray-700 font-medium">Rating:</p>
                                        <ReactStars
                                            count={5}
                                            size={30}
                                            value={5} // Always show 5 stars when completed
                                            activeColor="#ffd700"
                                            isHalf={false} // Disable half stars, since you want it to be a static 5 stars
                                            edit={false} // Disable the ability to change the rating, since it's static
                                        />
                                    </div>
                                )}
                                        </div>
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        <p className="font-medium text-gray-700">Booking Details</p>
                                        <div className="space-y-2">
                                            <p className="text-gray-600"><strong>Service:</strong> {services[booking.serviceId] || "Unknown Service"}</p>
                                            <p className="text-gray-600"><strong>Booking Hrs:</strong> {booking.bookingHrs} hours</p>
                                            <p className="text-gray-600"><strong>Date:</strong> {new Date(booking.datetime).toLocaleDateString()}</p>
                                            <p className="text-gray-600"><strong>Time:</strong> {new Date(booking.datetime).toLocaleTimeString()}</p>
                                            <p className="text-gray-600"><strong>Price per hour:</strong> ₹{booking.price}</p>
                                            <p className="text-gray-600"><strong>Total Price:</strong> ₹{booking.totalprice}</p>
                                            <p className="font-bold">
                                                <span className={`inline-block py-1 px-3 rounded-full text-xs ${booking.status === "PENDING" ? "bg-yellow-200 text-yellow-700" : booking.status === "ACCEPTED" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                                                    {booking.status}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {userType === "Caretaker" && booking.status === "PENDING" && (
                                    <div className="mt-6 flex justify-end space-x-4">
                                        <button
                                            onClick={() => handleStatusUpdate(booking.bookingId, "CONFIRMED")}
                                            className="bg-green-500 text-white px-6 py-2 rounded-md transition-colors hover:bg-green-600"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(booking.bookingId, "CANCELLED")}
                                            className="bg-red-500 text-white px-6 py-2 rounded-md transition-colors hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}

                                {userType === "Elder" && booking.status === "CONFIRMED" && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => handlePayment(booking.bookingId)}
                                            className="bg-blue-500 text-white px-6 py-2 rounded-4xl transition-colors hover:bg-blue-600"
                                        >
                                            Pay Now
                                        </button>
                                    </div>
                                )}


                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
