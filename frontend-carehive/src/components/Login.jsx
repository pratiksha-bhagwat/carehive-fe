import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const validateForm = () => {
        let newErrors = { email: "", password: "" };
        let isValid = true;

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
            isValid = false;
        } else {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(formData.email)) {
                newErrors.email = "Invalid email format.";
                isValid = false;
            }
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required.";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/user/login", formData);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));  // Store user data
            toast.success("Login successful!");

            const userType = response.data.userType || "Elder";  // Default to Elder if no userType
            navigate(userType === "Elder" ? "/elder" : "/caretaker");
        } catch {
            toast.error("Please enter correct email / password.");
            setFormData({ email: "", password: "" });
            setErrors({ email: "Incorrect email.", password: "Incorrect password." });
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field with Label */}
                        <div>
                            <label className="text-lg font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className={`w-full p-3 border rounded-lg text-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Field with Label */}
                        <div>
                            <label className="text-lg font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className={`w-full p-3 border rounded-lg text-lg ${errors.password ? "border-red-500" : "border-gray-300"}`}
                                required
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Submit Button */}
                        <button className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                            Login
                        </button>
                    </form>

                    {/* Register Link */}
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
