import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            setError("Invalid email format.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/user/forgotPassword", { email });
            toast.success("Password reset link sent!");
            navigate("/login");
        } catch {
            toast.error("Error sending reset email.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-gray-300 p-5">
            <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col lg:flex-row w-full max-w-4xl">
                {/* Left Side - CareHive Information */}
                <div className="lg:w-1/2 p-6 flex flex-col justify-center items-center bg-blue-100 rounded-2xl">
                    <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">Welcome to CareHive</h1>
                    <p className="text-lg text-gray-700 text-center">
                        CareHive connects elderly individuals with compassionate caretakers
                        and family members. Ensuring safety, comfort, and care in every interaction.
                    </p>
                </div>

                {/* Right Side - Forgot Password Form */}
                <div className="lg:w-1/2 p-6 flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Forgot Password</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field with Label */}
                        <div>
                            <label className="text-lg font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className={`w-full p-3 border rounded-lg text-lg ${error ? "border-red-500" : "border-gray-300"}`}
                                required
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>

                        {/* Submit Button */}
                        <button className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                            Send Reset Link
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <p className="text-center mt-4 text-gray-700 text-lg">
                        Remember your password?{" "}
                        <a href="/login" className="text-blue-600 font-semibold">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
