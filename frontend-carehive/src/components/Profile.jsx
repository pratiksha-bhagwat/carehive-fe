import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaSave, FaEdit, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    contact: "",
    date: "",
    emergencyContact: "",
    gender: "",
    role: "Caretaker",
    serviceIds: [],
  });
  const [servicesList, setServicesList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const originalProfileData = useRef(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    if (!userId || !token) {
      toast.error("User not logged in. Please log in.");
      navigate("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`/user/userDetails/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          contact: data.contact || "",
          date: data.date || "",
          emergencyContact: data.emergencyContact || "",
          gender: data.gender || "",
          role: data.userType || "Caretaker",
          serviceIds: Array.isArray(data.serviceIds) ? data.serviceIds : [],
        });

        originalProfileData.current = { ...data };
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error(error.response?.data?.message || "Failed to fetch user details.");
        setLoading(false);
        navigate("/login");
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get("/service/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServicesList(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error(error.response?.data?.message || "Failed to fetch services.");
      }
    };

    fetchProfileData();
    fetchServices();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (selectedOptions) => {
    setProfileData((prev) => ({
      ...prev,
      serviceIds: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }));
  };

  const validateInputs = () => {
    const { name, email, contact, emergencyContact } = profileData;
    if (!name || !email || !contact || !emergencyContact) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    setIsSaving(true);
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    if (!userId || !token) {
      toast.error("User not logged in. Please log in.");
      setIsSaving(false);
      return;
    }

    const updatedProfile = {
      userType: profileData.userType,
      name: profileData.name,
      email: profileData.email,
      contact: profileData.contact,
      emergencyContact: profileData.emergencyContact,
      gender: profileData.gender,
      serviceIds: profileData.role === "Caretaker" ? profileData.serviceIds : [],
    };

    try {
      const response = await axios.patch(`/user/updateUserDetails/${userId}`, updatedProfile, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("Profile saved successfully!");
        setIsEditing(false);

        setProfileData((prev) => ({
          ...prev,
          serviceIds: response.data.serviceIds || [],
          role: response.data.userType || "Caretaker",
        }));

        originalProfileData.current = {
          ...originalProfileData.current,
          ...response.data,
          serviceIds: response.data.serviceIds || [],
        };
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      ...originalProfileData.current,
      serviceIds: originalProfileData.current.serviceIds || [],
    });
    setIsEditing(false);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading Profile...</div>;
  }

  const servicesOptions = servicesList.map((service) => ({
    value: service.serviceId,
    label: service.serviceTitle,
  }));

  const selectedServiceTitles = profileData.serviceIds
    .map((id) => {
      const service = servicesList.find((s) => s.serviceId === id);
      return service ? service.serviceTitle : null;
    })
    .filter((title) => title !== null);

  const selectedServices = servicesOptions.filter((option) =>
    profileData.serviceIds.includes(option.value)
  );

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen p- bg-gradient-to-r from-blue-100 to-gray-300 p-4">
      <Navbar
        userType={profileData?.role}
        userName={profileData?.name}
        onLogout={handleLogout}
      />

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6 transition-all hover:scale-105">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Profile Settings</h1>

        <div className="space-y-6">
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Contact", name: "contact", type: "text" },
            { label: "Date of Birth", name: "date", type: "date" },
            { label: "Emergency Contact", name: "emergencyContact", type: "text" },
          ].map((field) => (
            <div key={field.name} className="flex items-center space-x-4">
              <label className="text-lg text-gray-700 font-medium w-1/3">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={profileData[field.name] || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-2/3 p-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          <div className="flex items-center space-x-4">
            <label className="text-lg text-gray-700 font-medium w-1/3">Gender</label>
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-2/3 p-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {profileData.role === "Caretaker" && !isEditing && (
            <div className="flex items-center space-x-4">
              <label className="text-lg text-gray-700 font-medium w-1/3">Services Offered</label>
              <div className="w-2/3 flex flex-wrap space-x-3">
                {selectedServiceTitles.map((title, index) => (
                  <span key={index} className="bg-blue-500 text-white p-2 rounded-4xl text-sm">
                    {title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profileData.role === "Caretaker" && isEditing && (
            <div className="flex items-center space-x-4">
              <label className="text-lg text-gray-700 font-medium w-1/3">Services Offered</label>
              <Select
                options={servicesOptions}
                isMulti
                onChange={handleServiceChange}
                value={selectedServices}
                className="w-2/3"
              />
            </div>
          )}

          <div className="mt-8 flex justify-center space-x-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center justify-center space-x-2 transition-transform hover:scale-105"
                  disabled={isSaving}
                >
                  <FaSave />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-6 py-3 rounded-md flex items-center justify-center space-x-2 transition-transform hover:scale-105"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center justify-center space-x-2 transition-transform hover:scale-105"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
