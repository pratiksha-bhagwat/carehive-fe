import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import TextField from "./TextField";
import Button from "./Button";
import OnBoardingPanel from "./auth/OnBoardingPanel";
import Checkbox from "./Checkbox";

const Login = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
        validationSchema,
        onSubmit: async (values) => {

            try {
                const response = await axios.post("http://localhost:8080/user/login", values);
                if (response.status === 200) {
                    // Store user data and token in sessionStorage
                    sessionStorage.setItem("userId", response.data.user.id);
                    sessionStorage.setItem("token", response.data.token);
                    sessionStorage.setItem("user", JSON.stringify(response.data.user));
                    console.log("User data:", response.data.user);
                    console.log("ID:", response.data.user.id);
                    toast.success("Login successful!");

                    // Redirect based on user type
                    const userType = response.data.user.userType || "Elder";
                    switch (userType) {
                        case "Elder":
                            navigate("/elder");
                            break;
                        case "Caretaker":
                            navigate("/caretaker");
                            break;
                        case "Admin":
                            navigate("/admin");
                            break;
                        default:
                            toast.error("Unknown user type. Redirecting to default dashboard.");
                            navigate("/");
                            break;
                    }
                } else {
                    toast.error(response.data.message || "Login failed. Please check your credentials.");
                }
            } catch (error) {
                console.error("Login error:", error);

                if (error.response) {
                    toast.error(error.response.data.message || "Login failed. Please check your credentials.");
                } else if (error.request) {
                    toast.error("Login failed. No response from server.");
                } else {
                    toast.error("Login failed. Please try again later.");
                }
            }
        }
    }
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
            >
                {/* Left Side - CareHive Information */}
                <OnBoardingPanel title="Welcome Back!" subtitle="Please enter your details." />

                {/* Right Side - Login Form */}
                <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your email"
                                startIcon={<FiMail />}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your password"
                                startIcon={<FiLock />}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password ? formik.errors.password : ""}
                            />
                            <a href="/forgot-password" className="flex justify-end mt-0 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <Checkbox
                                name="rememberMe"
                                checked={formik.values.rememberMe}
                                onChange={formik.handleChange}
                                label="Remember me"
                                labelProps={{
                                    className: 'text-sm text-gray-700',
                                    component: 'span'
                                }}
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <Button
                                type="submit"
                                onClick={formik.handleSubmit}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                disabled={formik.isSubmitting || !formik.isValid}
                            >
                                {formik.isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <FiLogIn className="w-5 h-5 mr-2" />
                                        Sign In
                                    </>
                                )}
                            </Button>
                        </motion.div>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don&apos;t have an account?{' '}
                                <a href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                    Create account
                                </a>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;