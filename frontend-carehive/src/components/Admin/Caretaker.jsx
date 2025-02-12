import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const CaretakerDetails = () => {
    const [caretakers, setCaretakers] = useState([]);
    const [selectedCaretaker, setSelectedCaretaker] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    const [user, setUser] = useState({});
    const [userType, setUserType] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCaretakers();
        fetchUser();
    }, []);

    const fetchUser = async () => {
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

    const fetchCaretakers = async () => {
        try {
            const response = await axios.get("/user/caretakers", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCaretakers(response.data);
        } catch {
            toast.error("Failed to fetch caretakers.");
        }
    };

    const handleSelectCaretaker = (caretaker) => {
        setSelectedCaretaker(caretaker);
    };

    const filteredCaretakers = caretakers.filter((caretaker) =>
        caretaker.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-gray-100  p-4 bg-gradient-to-r from-blue-100 to-gray-300">
            <Navbar 
                userType={userType || "User"} 
                userName={user?.name || "Guest"} 
                onLogout={handleLogout} 
            />
            <h2 className="text-2xl font-bold text-blue-600 my-6">Caretaker Management</h2>

            {/* Search Bar */}
            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="Search caretaker..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Clear Search Button */}
                <button
                    onClick={() => setSearchQuery("")}
                    className="ml-2 text-gray-500 hover:text-gray-800"
                >
                    Clear
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Caretaker List */}
                <div className="bg-white p-6 shadow-lg rounded-lg space-y-4 border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-blue-600">Caretaker List</h3>
                    {filteredCaretakers.length ? (
                        filteredCaretakers.map((caretaker) => (
                            <div
                                key={caretaker.id}
                                className="p-4 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer transition duration-300"
                                onClick={() => handleSelectCaretaker(caretaker)}
                            >
                                <h4 className="font-medium text-lg text-blue-600">{caretaker.name}</h4>
                                <p className="text-gray-600">{caretaker.contact}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No caretakers found.</p>
                    )}
                </div>

                {/* Caretaker Details */}
                {selectedCaretaker && (
                    <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-blue-600 mb-4">
                            Caretaker Details
                        </h3>
                        <div className="space-y-3">
                            <p><strong>Name:</strong> {selectedCaretaker.name}</p>
                            <p><strong>Email:</strong> {selectedCaretaker.email}</p>
                            <p><strong>Contact:</strong> {selectedCaretaker.contact}</p>
                            <p><strong>Gender:</strong> {selectedCaretaker.gender}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaretakerDetails;
