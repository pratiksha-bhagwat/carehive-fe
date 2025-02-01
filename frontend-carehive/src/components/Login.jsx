import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/auth/login", formData);
            localStorage.setItem("token", response.data.token);
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
            <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col lg:flex-row w-full max-w-4xl">

                {/* Left Side - CareHive Information */}
                <div className="lg:w-1/2 p-6 flex flex-col justify-center items-center bg-blue-100 rounded-2xl">
                    <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">Welcome to CareHive</h1>
                    <p className="text-lg text-gray-700 text-center">
                        CareHive connects elderly individuals with compassionate caretakers
                        and family members. Ensuring safety, comfort, and care in every interaction.
                    </p>
                </div>

                {/* Right Side - Login Form */}
                <div className="lg:w-1/2 p-6 flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full p-3 border rounded-lg text-lg"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full p-3 border rounded-lg text-lg"
                            onChange={handleChange}
                            required
                        />
                        <button className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                            Login
                        </button>
                    </form>
                    <p className="text-center mt-4 text-gray-700 text-lg">
                        Don&apos;t have an account?{" "}
                        <a href="/register" className="text-blue-600 font-semibold">Register</a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;
