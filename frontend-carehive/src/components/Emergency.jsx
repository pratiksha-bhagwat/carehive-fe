import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Emergency = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [emergencyDetails, setEmergencyDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("userId");

        if (!userId || !token) {
            toast.error("User not logged in. Please log in.");
            navigate('/login');
            return;
        }

        axios.get(`/user/userDetails/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            const userType = response.data.userType || "Caretaker";
            setProfileData({
                ...response.data,
                role: userType, 
            });
            fetchEmergencyDetails(userType);
        })
        .catch(() => toast.error("Failed to fetch user details."))
        .finally(() => setLoading(false));
    }, [navigate]);

    const fetchEmergencyDetails = (userType) => {
        const token = sessionStorage.getItem("token");
        const endpoint = userType === "Elder" ? "/emergency/familyAndCaretakers" : "/emergency/alerts";

        axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setEmergencyDetails(Array.isArray(response.data) ? response.data : []))
        .catch(() => toast.error("Failed to fetch emergency details."));
    };

    const handleLogout = () => {
        sessionStorage.removeItem("userId");
        navigate("/login");
    };

    return (
        <div className="min-h-screen p-4 bg-gradient-to-r from-blue-100 to-gray-300">
            {/* Navbar */}
            <Navbar 
                userType={profileData?.role || "Caretaker"} 
                userName={profileData?.name || "Loading..."} 
                onLogout={handleLogout} 
            />

            {/* Main Content */}
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-6">
                <h1 className="text-2xl font-bold text-blue-700 mb-4">Emergency Contacts & Alerts</h1>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Elder Role UI */}
                        {profileData?.role === "Elder" && (
                            <div className="mt-4">
                                <h2 className="text-xl font-semibold text-gray-800">Family Members & Caretakers</h2>
                                <ul className="mt-4 space-y-4">
                                    {emergencyDetails.length > 0 ? (
                                        emergencyDetails.map((contact, index) => (
                                            <li key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                                                <div>
                                                    <p className="font-semibold text-gray-700">{contact.name}</p>
                                                    <p className="text-gray-600">{contact.contact}</p>
                                                </div>
                                                <button className="text-blue-600 hover:underline">Call</button>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No emergency contacts found. Please add them to your profile.</p>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Caretaker Role UI */}
                        {profileData?.role === "Caretaker" && (
                            <div className="mt-4">
                                <h2 className="text-xl font-semibold text-gray-800">Emergency Alerts from Elders</h2>
                                <ul className="mt-4 space-y-4">
                                    {emergencyDetails.length > 0 ? (
                                        emergencyDetails.map((alert, index) => (
                                            <li key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                                                <div>
                                                    <p className="font-semibold text-gray-700">{alert.message}</p>
                                                    <p className="text-gray-600">{alert.date}</p>
                                                </div>
                                                <button className="text-red-600 hover:underline">Acknowledge</button>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No emergency alerts found at this time.</p>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Unauthorized Access */}
                        {profileData?.role !== "Elder" && profileData?.role !== "Caretaker" && (
                            <p className="text-red-500 text-center mt-4">Unauthorized access. Please contact support.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Emergency;
