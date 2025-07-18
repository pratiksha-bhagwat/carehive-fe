import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // State to manage success message visibility
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing reset token.");
            navigate("/forgot-password");
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setError("Both fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            // Send POST request with new password as plain text
            const response = await axios.post(
                `http://localhost:8080/user/resetPassword?token=${token}`,
                newPassword,  // Sending the plain password directly in the body
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                // Set the success message and show it on the screen
                setSuccessMessage("Password reset successful!");

                // Hide the success message after 1 second and redirect to login
                setTimeout(() => {
                    navigate("/login");  // Redirect to login after 1 second
                }, 1000);
            } else {
                toast.error("Failed to reset password. Try again.");
            }
        } catch {
            // Handling any errors that occur during the API call
            toast.error("Failed to reset password. Try again.");
            setError("Invalid or expired token.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-gray-300 p-5">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Reset Password</h2>
                
                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-500 text-white p-4 rounded-lg mb-4 text-center">
                        {successMessage}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-lg font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full p-3 border rounded-lg text-lg border-gray-300"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-lg font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full p-3 border rounded-lg text-lg border-gray-300"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    <button className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
