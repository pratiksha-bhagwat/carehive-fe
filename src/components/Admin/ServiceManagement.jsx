import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const ServiceManagement = () => {
    const [servicesList, setServicesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [serviceTitle, setServiceTitle] = useState("");
    const [serviceDescription, setServiceDescription] = useState("");
    const [hourlyPrice, setHourlyPrice] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    const [user, setUser] = useState({});
    const [userType, setUserType] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchServices();
        fetchUserData();
    }, []);

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
            setServicesList(response.data);
        } catch {
            toast.error("Failed to fetch services.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateOrUpdateService = async () => {
        const url = selectedServiceId ? `/service/update/${selectedServiceId}` : "/service/create";
        const method = selectedServiceId ? "patch" : "post";
        const action = selectedServiceId ? "updated" : "created";

        try {
            await axios[method](url, { serviceTitle, serviceDescription, hourlyPrice }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(`Service ${action} successfully!`);
            resetForm();
            fetchServices();
        } catch {
            toast.error(`Failed to ${action} service.`);
        } finally {
            setIsCreating(false);
            setIsUpdating(false);
        }
    };

    const resetForm = () => {
        setServiceTitle("");
        setServiceDescription("");
        setHourlyPrice(0);
        setSelectedServiceId(null);
    };

    const handleSelectService = (service) => {
        setSelectedServiceId(service.serviceId);
        setServiceTitle(service.serviceTitle);
        setServiceDescription(service.serviceDescription);
        setHourlyPrice(service.hourlyPrice);
    };
    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen bg-gradient-to-r from-blue-100 to-gray-300">
            <Navbar userType={userType} userName={user?.name} onLogout={handleLogout} />
            <h2 className="text-2xl font-bold text-blue-700 text-center mt-4 mb-6">Service Management</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {/* Service List */}
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-blue-600 mb-4">Available Services</h3>
                    {isLoading ? (
                        <p className="text-gray-500">Loading services...</p>
                    ) : servicesList.length ? (
                        <div className="space-y-4">
                            {servicesList.map((service) => (
                                <div key={service.serviceId} className="p-4 bg-gray-50 rounded-lg shadow">
                                    <h4 className="font-semibold text-blue-700">{service.serviceTitle}</h4>
                                    <p className="text-gray-600 text-sm">{service.serviceDescription}</p>
                                    <p className="text-gray-800 font-bold">₹{service.hourlyPrice} /hr</p>
                                    <button
                                        onClick={() => handleSelectService(service)}
                                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No services available.</p>
                    )}
                </div>

                {/* Service Form */}
                {/* Service Form */}
                <div className=" bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 h-[500px] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-blue-600 mb-4">
                        {selectedServiceId ? "Update Service" : "Create Service"}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="font-semibold">Service Title</label>
                            <input
                                type="text"
                                value={serviceTitle}
                                onChange={(e) => setServiceTitle(e.target.value)}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Service Description</label>
                            <textarea
                                value={serviceDescription}
                                onChange={(e) => setServiceDescription(e.target.value)}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Hourly Price (₹)</label>
                            <input
                                type="number"
                                value={hourlyPrice}
                                onChange={(e) => setHourlyPrice(e.target.value)}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg"
                            />
                        </div>
                        <button
                            onClick={handleCreateOrUpdateService}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full"
                            disabled={!serviceTitle || !serviceDescription || !hourlyPrice || isCreating || isUpdating}
                        >
                            {selectedServiceId ? "Update Service" : "Create Service"}
                        </button>
                        {selectedServiceId && (
                            <button
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 w-full mt-2"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ServiceManagement;