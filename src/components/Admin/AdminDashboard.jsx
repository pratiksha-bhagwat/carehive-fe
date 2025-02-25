import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Navbar from "./Navbar";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState("");
    const [stats, setStats] = useState({ elders: 0, caretakers: 0, bookings: 0 });
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState({});
    const [elderDetails, setElderDetails] = useState({});
    const [caretakerDetails, setCaretakerDetails] = useState({});

    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        if (!userId || !token) {
            toast.error("User not logged in. Please log in first.");
            navigate("/login");
            return;
        }

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

        const fetchEldersOrCaretakers = async (role) => {
            try {
                const response = await axios.get(`/user/countByType/${role}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return response.data;
            } catch {
                toast.error(`Error fetching ${role} count.`);
                return 0;
            }
        };

        const fetchDashboardStats = async () => {
            try {
                const [elders, caretakers, bookingsResponse] = await Promise.all([
                    fetchEldersOrCaretakers("Elder"),
                    fetchEldersOrCaretakers("Caretaker"),
                    axios.get(`/booking/count`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                setStats({
                    elders,
                    caretakers,
                    bookings: bookingsResponse.data, 
                });
            } catch {
                toast.error("Error fetching dashboard stats.");
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

                const formattedAppointments = await Promise.all(
                    response.data.map(async (booking) => {
                        await fetchElderOrCaretakerDetails(booking);
                        const datetime = new Date(booking.datetime);
                        return {
                            ...booking,
                            formattedDate: datetime.toLocaleDateString(),
                            formattedTime: datetime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        };
                    })
                );

                setAppointments(formattedAppointments.slice(0, 5));
            } catch {
                toast.error("Failed to fetch bookings.");
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

        fetchUserData();
        fetchDashboardStats();
        fetchServices();
        fetchBookings();
    }, [userId, navigate]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div className="min-h-screen p-4 bg-gradient-to-r from-blue-100 to-gray-300">
            <Navbar userType={userType} userName={user?.name} onLogout={handleLogout} />

            <div className="flex flex-wrap justify-between gap-8 p-6">
                <div className="w-full space-y-6 bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                    <h2 className="text-xl font-bold text-blue-600">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-600">Customers</h3>
                            <p className="text-2xl font-bold">{stats.elders}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-600">Caretakers</h3>
                            <p className="text-2xl font-bold">{stats.caretakers}</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-yellow-600">Bookings</h3>
                            <p className="text-2xl font-bold">{stats.bookings}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full space-y-6 bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                    <h2 className="text-xl font-bold text-blue-600">Recent Appointments</h2>
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="w-full border-collapse bg-white text-left text-sm shadow-sm">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="p-3">Booking ID</th>
                                    <th className="p-3">Customer</th>
                                    <th className="p-3">Service</th>
                                    <th className="p-3">Caretaker</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length > 0 ? (
                                    appointments.map((appointment, index) => (
                                        <tr key={appointment.bookingId} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                                            <td className="p-3">{appointment.bookingId}</td>
                                            <td className="p-3">{elderDetails[appointment.elderId] || "N/A"}</td>
                                            <td className="p-3">{services[appointment.serviceId] || "Unknown"}</td>
                                            <td className="p-3">{caretakerDetails[appointment.caretakerId] || "Unassigned"}</td>
                                            <td className="p-3">{appointment.formattedDate}</td>
                                            <td className="p-3">{appointment.formattedTime}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="p-3 text-center">No recent appointments.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
