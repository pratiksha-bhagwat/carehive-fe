import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img from "../assets/logo.png";

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        contact: "",
        date: "",
        emergencyContact: "",
        role: "Caretaker",  // Default role, will be updated after fetching
        services: [],
    });
    const [servicesList, setServicesList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const originalProfileData = useRef(null);

    // Fetch profile data and services list
    useEffect(() => {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            toast.error("User not logged in. Please log in.");
            navigate('/login');
            return;
        }

        // Fetch profile data
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`/user/userDetails/${userId}`);
                const data = response.data;
                setProfileData({
                    name: data.name || "",
                    email: data.email || "",
                    contact: data.contact || "",
                    date: data.date || "",
                    emergencyContact: data.emergencyContact || "",
                    role: data.userType || "Caretaker",
                    services: Array.isArray(data.services) ? data.services : [],
                });
                originalProfileData.current = { ...data };  // Save original data
                setLoading(false);
            } catch {
                toast.error("Failed to fetch user details.");
                setLoading(false);
            }
        };

        // Fetch services list
        const fetchServices = async () => {
            try {
                const response = await axios.get("/service/list");
                setServicesList(response.data);
            } catch {
                toast.error("Failed to fetch services.");
            }
        };

        fetchProfileData();
        fetchServices();
    }, [navigate]);

    // Handle input field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle services change
    const handleServiceChange = (selectedOptions) => {
        setProfileData((prev) => ({
            ...prev,
            services: selectedOptions ? selectedOptions.map((option) => option.value) : [],
        }));
    };

    // Handle save button click
    const handleSave = async () => {
        console.log("Save button clicked!");
    
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            toast.error("User not logged in. Please log in.");
            return;
        }
    
        const updatedProfile = {
            name: profileData.name,
            email: profileData.email,
            contact: profileData.contact,
            emergencyContact: profileData.emergencyContact,
            date: profileData.date,
            services: profileData.role === "Caretaker" ? profileData.services : [],
        };
    
        try {
            const response = await axios.patch(`/user/updateUserDetails/${userId}`, updatedProfile, {
                headers: { "Content-Type": "application/json" },
            });
    
            if (response.status >= 200 && response.status < 300) { 
                toast.success("Profile saved successfully!");
                setIsEditing(false);
                setProfileData({
                    ...profileData,
                    services: response.data.services || [],  // Ensure services are updated
                });
                originalProfileData.current = { ...response.data };
                console.log("Profile updated:", response.data);
            } else {
                handleError(response);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error) => {
        if (error.response) {
            console.error("Response error:", error.response.status, error.response.data);
            toast.error(`Update failed: ${error.response.data?.message || "Server error"}`);
        } else if (error.request) {
            console.error("Request error:", error.request);
            toast.error("Update failed: No response from server");
        } else {
            console.error("Request setup error:", error.message);
            toast.error("Update failed: " + error.message);
        }
    };

    // Handle cancel button click
    const handleCancel = () => {
        setProfileData(originalProfileData.current); // Reset to original data
        setIsEditing(false);
    };

    if (loading) {
        return <div className="text-center mt-10">Loading Profile...</div>;
    }

    // Services list for react-select
    const servicesOptions = servicesList.map((service) => ({
        value: service.serviceId,
        label: service.serviceTitle,
    }));

    // Conditional logic for role-based navigation
    const getHomeLink = () => {
        if (profileData.role === "Elder") {
            return "/elder";
        } else if (profileData.role === "Caretaker") {
            return "/caretaker";
        }
        return "/home";
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
<nav className="bg-blue-300 text-white p-4 flex justify-between items-center">
            <div className="text-2xl font-bold">
                <Link to={getHomeLink()}><img src={img} alt="Logo" className="h-10" /></Link>
            </div>
            <div className="flex space-x-4">
                <Link to={getHomeLink()} className={`hover:text-white ${location.pathname === "/home" ? "text-white font-bold" : "text-blue-700"}`}>
                    Home
                </Link>
                <Link to="/profile" className="text-blue-700 hover:text-white">Profile</Link>
                <Link to="/bookings" className="text-blue-700 hover:text-white">Bookings</Link>
                <Link to="/emergency" className="text-blue-700 hover:text-white">Emergency</Link>
                {profileData && <span className="text-lg text-green-700">{profileData.name}</span>}
                <button onClick={() => { sessionStorage.clear(); navigate('/login'); }} className="text-red-600 hover:text-red-800">Logout</button>
                </div>
            </nav>

            {/* Profile Form */}
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-6">
                <h1 className="text-2xl font-bold text-gray-700 text-center mb-6">Profile Settings</h1>

                <div className="space-y-6">
                    {/* Input Fields */}
                    {[
                        { label: "Full Name", name: "name", type: "text" },
                        { label: "Email", name: "email", type: "email" },
                        { label: "Contact", name: "contact", type: "text" },
                        { label: "Date of Birth", name: "date", type: "date" },
                        { label: "Emergency Contact", name: "emergencyContact", type: "text" },
                    ].map((field) => (
                        <div key={field.name} className="flex justify-between items-center">
                            <label className="font-medium text-gray-700">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={profileData[field.name] || ""}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-2/3 p-2 border-2 ${isEditing ? "border-blue-500" : "border-gray-300"} rounded-md`}
                            />
                        </div>
                    ))}

                    {/* Services Section for Caretaker */}
                    {profileData.role === "Caretaker" && (
                        <div className="flex items-center justify-between">
                            <label className="font-medium text-gray-700">Services Offered</label>
                            {isEditing ? (
                                <Select
                                    options={servicesOptions}
                                    isMulti
                                    className={`w-2/3 border-2 ${isEditing ? "border-blue-500" : "border-gray-300"} rounded-md`}
                                    onChange={handleServiceChange}
                                    value={servicesOptions.filter((option) =>
                                        profileData.services.includes(option.value)
                                    )}
                                />
                            ) : (
                                <div className="flex space-x-2">
                                    {profileData.services.length > 0 ? (
                                        profileData.services.map((serviceId) => {
                                            const service = servicesList.find((s) => s.serviceId === serviceId);
                                            return (
                                                service && (
                                                    <span
                                                        key={serviceId}
                                                        className="bg-blue-500 text-white py-1 px-3 rounded-full"
                                                    >
                                                        {service.serviceTitle}
                                                    </span>
                                                )
                                            );
                                        })
                                    ) : (
                                        <span className="text-gray-500">No services selected</span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;