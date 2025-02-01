import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        password: "",
        confirmPassword: "",
        gender: "",
        date: "",
        userType: "",
        emergencyContact: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        // Validate required fields (e.g., date, userType)
        if (!formData.date) {
            toast.error("Date of Birth is required.");
            return;
        }
        if (!formData.userType) {
            toast.error("User Type is required.");
            return;
        }

        try {
            console.log("Form data before submitting:", formData); // Debugging

            // Post data to the backend API
            const response = await axios.post(
                "http://localhost:8080/user/register",
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Response:", response.data); // Debugging
            toast.success("Registration successful!");
            navigate("/login"); // Navigate to login page after successful registration
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            toast.error(error.response?.data || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
            <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col lg:flex-row w-full max-w-5xl">
                <div className="lg:w-1/2 p-6 flex flex-col justify-center items-center bg-blue-100 rounded-2xl">
                    <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">Join CareHive</h1>
                    <p className="text-lg text-gray-700 text-center">
                        CareHive is your trusted platform connecting elderly individuals with compassionate caretakers and family members. Your safety and comfort matter to us.
                    </p>
                </div>
                <div className="lg:w-1/2 p-6 flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Register</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full p-3 border rounded-lg text-lg"
                                onChange={handleChange}
                                required
                                value={formData.name}
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full p-3 border rounded-lg text-lg"
                                onChange={handleChange}
                                required
                                value={formData.email}
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Contact</label>
                            <input
                                type="text"
                                name="contact"
                                className="w-full p-3 border rounded-lg text-lg"
                                onChange={handleChange}
                                pattern="[0-9]{10}"
                                required
                                value={formData.contact}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Gender</label>
                                <select
                                    name="gender"
                                    className="w-full p-3 border rounded-lg text-lg h-[50px]"
                                    onChange={handleChange}
                                    required
                                    value={formData.gender}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="w-full p-3 border rounded-lg text-lg"
                                    onChange={handleChange}
                                    required
                                    value={formData.date} // Fix: Use formData.date here
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700">User Type</label>
                            <select
                                name="userType"
                                className="w-full p-3 border rounded-lg text-lg h-[50px]"
                                onChange={handleChange}
                                required
                                value={formData.userType}
                            >
                                <option value="">Select User Type</option>
                                <option value="Elder">Elder</option>
                                <option value="Caretaker">Caretaker</option>
                                <option value="Familymember">Familymember</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Emergency Contact</label>
                            <input
                                type="text"
                                name="emergencyContact"
                                className="w-full p-3 border rounded-lg text-lg"
                                onChange={handleChange}
                                pattern="[0-9]{10}"
                                required
                                value={formData.emergencyContact}
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full p-3 border rounded-lg text-lg"
                                onChange={handleChange}
                                required
                                value={formData.password}
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="w-full p-3 border rounded-lg text-lg"
                                onChange={handleChange}
                                required
                                value={formData.confirmPassword}
                            />
                        </div>
                        <button className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                            Register
                        </button>
                    </form>
                    <p className="text-center mt-4 text-gray-700 text-lg">
                        Already have an account? <a href="/login" className="text-blue-600 font-semibold">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
