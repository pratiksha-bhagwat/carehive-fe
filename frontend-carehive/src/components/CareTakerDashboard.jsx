import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from './Navbar';

const CaretakerDashboard = () => {
    const navigate = useNavigate();
    const [caretaker, setCaretaker] = useState({});
    const [serviceRequests, setServiceRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [earnings, setEarnings] = useState([]);
    const [elderDetails, setElderDetails] = useState(null); // Store a single elder's details
    const [services, setServices] = useState({});
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        if (!userId) {
            toast.error("User not logged in. Please log in first.");
            navigate('/login');
            return;
        }

        axios.get(`/user/userDetails/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setCaretaker(response.data))
        .catch(error => console.error('Error fetching caretaker details:', error));

        axios.get(`/booking/list/${userId}/Caretaker`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            const pendingRequests = response.data.filter(request => request.status === "PENDING");
            if (pendingRequests.length > 0) {
                axios.get(`/user/userDetails/${pendingRequests[0].elderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(response => setElderDetails(response.data))
                .catch(error => console.error('Error fetching elder details:', error));
            }
            setServiceRequests(pendingRequests);
        })
        .catch(error => {
            console.error('Error fetching service requests:', error);
            toast.error('Error fetching service requests.');
        });

        axios.get(`/user/notifications/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setNotifications(response.data))
        .catch(error => console.error('Error fetching notifications:', error));

        axios.get(`/user/earnings/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setEarnings(response.data))
        .catch(error => console.error('Error fetching earnings:', error));

        axios.get("/service/list", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            const serviceData = response.data.reduce((acc, service) => {
                acc[service.serviceId] = service.serviceTitle;
                return acc;
            }, {});
            setServices(serviceData);
        })
        .catch(() => toast.error("Error fetching services"));
    }, [userId, navigate]);

    const handleServiceRequest = (bookingId, action) => {
        axios.patch(`/booking/${bookingId}/${action}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            toast.success(`Service request ${action}ed!`);
            setServiceRequests(serviceRequests.filter(request => request.bookingId !== bookingId));
        })
        .catch(error => {
            console.error('Error handling service request:', error);
            toast.error('Error handling service request!');
        });
    };

    const handleLogout = () => {
        sessionStorage.removeItem("userId");
        navigate('/login');
    };

    const handleEmergency = () => {
        navigate('/emergency');
    };

    return (
        <div className="min-h-screen p-4 bg-gradient-to-r from-blue-100 to-gray-300">
            <Navbar
                userType={caretaker?.userType || ""}
                userName={caretaker?.name}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <div className="flex flex-wrap justify-between gap-8 p-6">
                {/* Left Section - Service Requests */}
                <div className="flex-1 space-y-6 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-blue-700">Service Requests</h2>
                    {serviceRequests.length > 0 ? (
                        serviceRequests.map((request) => (
                            <div key={request.bookingId} className="p-4 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer transition duration-300">
                                {/* Dynamically load the elder details for each request */}
                                <p><strong>User:</strong>{elderDetails?.name || 'Loading...'}</p>
                                <p><strong>Service:</strong> {services[request.serviceId] || 'Unknown Service'}</p>
                                <p><strong>Scheduled Date:</strong> {new Date(request.datetime).toLocaleString()}</p>
                                <p><strong>Hours:</strong> {request.bookingHrs}</p>
                                <p><strong>Price:</strong> ₹{request.price}</p>
                                <p><strong>Status:</strong> {request.status}</p>
                                <div className="mt-4">
                                    {/* Only show Accept and Reject buttons if status is "PENDING" */}
                                    {request.status === "PENDING" && (
                                        <div className="mt-6 flex justify-end space-x-4">
                                            <button
                                                onClick={() => handleServiceRequest(request.bookingId, 'CONFIRMED')}
                                                className="bg-green-500 text-white px-6 py-2 rounded-md transition-colors hover:bg-green-600"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleServiceRequest(request.bookingId, 'CANCELLED')}
                                                className="bg-red-500 text-white px-6 py-2 rounded-md transition-colors hover:bg-red-600"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No new requests</p>
                    )}

                </div>

                {/* Right Section - Notifications */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-blue-700">Notifications</h2>
                        {notifications.length > 0 ? (
                            <ul>
                                {notifications.map((notification) => (
                                    <li key={notification.id} className="bg-gray-200 p-3 rounded-lg mb-2">
                                        {notification.message}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No new notifications</p>
                        )}
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

            {/* Profile Section */}
            <div className="p-6 bg-white rounded-lg shadow-md m-6">
                <h2 className="text-xl font-bold text-blue-700 mb-4">Profile</h2>
                {caretaker ? (
                    <>
                        <p><strong>Name:</strong> {caretaker.name}</p>
                        <p><strong>Email:</strong> {caretaker.email}</p>
                        <p><strong>Phone:</strong> {caretaker.contact}</p>
                    </>
                ) : (
                    <p>Loading caretaker details...</p>
                )}
            </div>

            {/* Earnings Section */}
            <div className="p-6 bg-white rounded-lg shadow-md m-6">
                <h2 className="text-xl font-bold text-blue-700 mb-4">Earnings</h2>
                {earnings.length > 0 ? (
                    <ul>
                        {earnings.map((earning) => (
                            <li key={earning.id} className="border-b p-3">
                                <p><strong>Service:</strong> {earning.serviceType}</p>
                                <p><strong>Amount:</strong> {earning.amount}</p>
                                <p><strong>Status:</strong> {earning.status}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No earnings data available</p>
                )}
            </div>
        </div>
    );
};

export default CaretakerDashboard;
