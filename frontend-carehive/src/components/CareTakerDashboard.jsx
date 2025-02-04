import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import axios from 'axios';

const CaretakerDashboard = () => {
    const navigate = useNavigate();

    // State for caretaker details
    const [caretaker, setCaretaker] = useState(null);
    const [serviceRequests, setServiceRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [earnings, setEarnings] = useState([]);

    // Get userId from sessionStorage
    const userId = sessionStorage.getItem("userId");

    // Fetch caretaker details from API (using the userId)
    useEffect(() => {
        if (!userId) {
            toast.error("User not logged in. Please log in first.");
            navigate('/login'); // Redirect if user is not logged in
            return;
        }

        axios.get(`http://localhost:8080/user/userDetails/${userId}`)
            .then(response => {
                setCaretaker(response.data); // Set caretaker data
            })
            .catch(error => {
                console.error('Error fetching caretaker details:', error);
            });
    }, [userId, navigate]);

    // Fetch service requests, notifications, and earnings
    useEffect(() => {
        if (userId) {
            // Fetch service requests for the caretaker
            axios.get(`http://localhost:8080/user/userDetails/${userId}`)
                .then(response => setServiceRequests(response.data))
                .catch(error => console.error('Error fetching service requests:', error));

            // Fetch notifications
            axios.get(`http://localhost:8080/user/userDetails/${userId}`)
                .then(response => setNotifications(response.data))
                .catch(error => console.error('Error fetching notifications:', error));

            // Fetch earnings
            axios.get(`http://localhost:8080/user/userDetails/${userId}`)
                .then(response => setEarnings(response.data))
                .catch(error => console.error('Error fetching earnings:', error));
        }
    }, [userId]);

    // Logout function
    const handleLogout = () => {
        sessionStorage.clear();  // Clear session storage on logout
        navigate('/login');
    };

    // Emergency Alert
    const handleEmergency = () => {
        toast.success('Emergency message sent!');
    };

    // Handle Service Request (Accept or Reject)
    const handleServiceRequest = (requestId, action) => {
        // You can implement your logic here to handle the action
        // For example, updating the request status in the database
        axios.post(`http://localhost:8080/user/serviceRequestAction`, {
            requestId,
            action
        })
        .then(() => {
            if (action === 'accept') {
                toast.success('Service request accepted!');
            } else if (action === 'reject') {
                toast.success('Service request rejected!');
            }
            // Refresh the service requests after action
            setServiceRequests(serviceRequests.filter(request => request.id !== requestId));
        })
        .catch(error => {
            console.error('Error handling service request:', error);
            toast.error('Error handling service request!');
        });
    };
    
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar caretaker={caretaker} onLogout={handleLogout} />

            {/* Main Content */}
            <div className="flex flex-wrap justify-between gap-8 p-6">
                {/* Left Section - Service Requests */}
                <div className="flex-1 space-y-6 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-blue-700">Service Requests</h2>
                    {serviceRequests.length > 0 ? (
                        serviceRequests.map((request) => (
                            <div key={request.id} className="border-b p-4">
                                <p><strong>User:</strong> {request.elderlyName}</p>
                                <p><strong>Service:</strong> {request.serviceType}</p>
                                <p><strong>Date:</strong> {request.date}</p>
                                <p><strong>Location:</strong> {request.location}</p>
                                <button
                                    onClick={() => handleServiceRequest(request.id, 'accept')}
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleServiceRequest(request.id, 'reject')}
                                    className="mt-2 ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Reject
                                </button>
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
