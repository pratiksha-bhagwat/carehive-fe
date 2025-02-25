import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentSuccessScreen = () => {
    const navigate = useNavigate();
    const bookingId = sessionStorage.getItem("bookingId");
    const [bookingDetails, setBookingDetails] = useState(null);
    const [caretakerDetails, setCaretakerDetails] = useState(null);
    const [services, setServices] = useState({});
    const userType = sessionStorage.getItem('userType');
    const token = sessionStorage.getItem('token');

    useEffect(() => {
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

        const fetchBookingDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/booking/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookingDetails(response.data);
                fetchCaretakerDetails(response.data.caretakerId);
            } catch (error) {
                console.error("Error fetching booking details:", error);
                toast.error("Failed to fetch booking details.");
            }
        };

        const fetchCaretakerDetails = async (caretakerId) => {
            try {
                const response = await axios.get(`/user/userDetails/${caretakerId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCaretakerDetails(response.data);
            } catch (error) {
                console.error("Error fetching caretaker details:", error);
                toast.error("Failed to fetch caretaker details.");
            }
        };

        if (bookingId) {
            fetchServices();
            fetchBookingDetails();
            handleStatusUpdate(bookingId, "COMPLETED");
            sessionStorage.removeItem("bookingId");
        }
    }, [bookingId]);

    const handleStatusUpdate = async (bookingId, status) => {
        try {
            await axios.patch(
                `http://localhost:8080/booking/${bookingId}/${status}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success(`Booking marked as ${status}`);
        } catch (error) {
            console.error("Error updating status:", error.response?.data || error.message);
            toast.error("Failed to update booking status.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-gray-300 flex flex-col justify-center items-center py-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-all hover:scale-105 hover:shadow-2xl">
                {/* Success Icon */}
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />

                {/* Header */}
                <h1 className="text-3xl font-semibold text-gray-800 mb-3 tracking-wide">
                    Payment Successful!
                </h1>
                <p className="text-sm text-gray-600 mb-5">
                    Thank you for your payment. Your booking has been confirmed.
                </p>

                {/* Booking and Caretaker Details Table */}
                {bookingDetails && (
                    <table className="min-w-full  text-sm text-gray-700 mb-5">
                        <tbody>
                            <tr className="border-b">
                                <td className="font-semibold py-2 px-4">Booking ID:</td>
                                <td className="py-2 px-4">{bookingDetails.bookingId}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-semibold py-2 px-4">Total Paid:</td>
                                <td className="py-2 px-4">₹{bookingDetails.totalprice}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-semibold py-2 px-4">Service Name:</td>
                                <td className="py-2 px-4">{services[bookingDetails.serviceId] || "Unknown Service"}</td>
                            </tr>
                            {caretakerDetails && (
                                <>
                                    <tr className="border-b">
                                        <td className="font-semibold py-2 px-4">Caretaker Name:</td>
                                        <td className="py-2 px-4">{caretakerDetails.name}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold py-2 px-4">Contact:</td>
                                        <td className="py-2 px-4">{caretakerDetails.contact}</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col space-y-4">
                    <button
                        onClick={() => navigate('/bookings')}
                        className="w-full p-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        View Bookings
                    </button>

                    <Link
                        to={userType === "Elder" ? "/elder" : "/caretaker"}
                        className="w-full p-3 rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-all transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                    >
                        Back to {userType === "Elder" ? "Elder" : "Caretaker"} Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessScreen;
