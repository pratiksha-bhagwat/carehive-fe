import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProfileForm = () => {
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        contact: "",
        dob: "",
        emergencyContact: "",
        role: "caregiver", // Default role
        services: "", // Updated field name
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Fetch user data from API (assuming token is stored in localStorage)
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Unauthorized! Please log in.");
                    return;
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                const response = await axios.get("/api/user/profile", config);
                setProfileData(response.data);
            } catch (error) {
                toast.error("Failed to fetch profile data.");
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Unauthorized! Please log in.");
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            await axios.put("/api/user/profile", profileData, config);
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update profile.");
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <div className="relative p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
                {/* Profile Icon at Top Right */}
                <img
                    src="/profile-icon.png"
                    alt="Profile Icon"
                    className="w-12 h-12 rounded-full absolute top-4 right-4"
                />

                {/* Centered Profile Title */}
                <h1 className="text-2xl font-bold text-gray-700 text-center mt-6">Profile Settings</h1>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="font-medium">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-2/3 p-2 border ${isEditing ? "border-blue-500" : "border-gray-300"} rounded-md`}
                    />
                </div>

                <div className="flex justify-between items-center">
                    <label className="font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-2/3 p-2 border ${isEditing ? "border-blue-500" : "border-gray-300"} rounded-md`}
                    />
                </div>

                <div className="flex justify-between items-center">
                    <label className="font-medium">Contact</label>
                    <input
                        type="text"
                        name="contact"
                        value={profileData.contact}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-2/3 p-2 border ${isEditing ? "border-blue-500" : "border-gray-300"} rounded-md`}
                    />
                </div>

                <div className="flex justify-between items-center">
                    <label className="font-medium">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={profileData.dob}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-2/3 p-2 border ${isEditing ? "border-blue-500" : "border-gray-300"} rounded-md`}
                    />
                </div>

                <div className="flex justify-between items-center">
                    <label className="font-medium">Emergency Contact</label>
                    <input
                        type="text"
                        name="emergencyContact"
                        value={profileData.emergencyContact}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-2/3 p-2 border ${isEditing ? "border-blue-500" : "border-gray-300"} rounded-md`}
                    />
                </div>

                {profileData.role === "caretaker" && (
                    <div className="flex justify-between items-center">
                        <label className="font-medium">Services</label>
                        <select
                            name="services"
                            value={profileData.services}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-2/3 p-2 border ${isEditing ? "border-blue-500" : "border-gray-300"} rounded-md`}
                        >
                            <option value="">Select Services</option>
                            <option value="templeVisit">Temple Visit</option>
                            <option value="hospitalVisit">Hospital Visit</option>
                            <option value="cooking">Cooking</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
                {isEditing ? (
                    <>
                        <button
                            onClick={() => setIsEditing(false)}
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
    );
};

export default ProfileForm;
