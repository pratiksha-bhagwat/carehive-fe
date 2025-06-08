import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "./TextField";
import OnBoardingPanel from "./auth/OnBoardingPanel";
import Button from "./Button";
import { motion } from "framer-motion";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email format").required("Email is required"),
        }),
        onSubmit: async (values) => {
            try {
                await axios.post("http://localhost:8080/user/forgotPassword", { values });
                toast.success("Password reset link sent!");
                navigate("/login");
            } catch {
                toast.error("Error sending reset email.");
            }
        },
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-gray-300 p-5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
            >
                {/* Left Side - CareHive Information */}
                <OnBoardingPanel title="Forgot Password" subtitle="Please enter your email to reset your password." />

                {/* Right Side - Forgot Password Form */}
                <div className="lg:w-1/2 p-6 flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Forgot Password</h2>
                    {/* Email Field with Label */}
                    <div>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            placeholder="Enter your email"
                            required
                            value={formik.values.email}
                            error={formik.errors.email && formik.touched.email}
                            helperText={formik.errors.email && formik.touched.email ? formik.errors.email : ""}
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={formik.handleSubmit}
                        label="Send Reset Link"
                        variant="contained"
                        color="primary"
                        isLoading={formik.isSubmitting}
                        disabled={!formik.isValid}
                        fullWidth
                    />

                    {/* Back to Login Link */}
                    <p className="text-center mt-4 text-gray-700 text-lg">
                        Remember your password?{" "}
                        <a href="/login" className="text-blue-600 font-semibold">Login</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
