import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { FaUser, FaPhone, FaLock} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import * as Yup from "yup";
import OnBoardingPanel from "./auth/OnBoardingPanel";
import TextField from "./TextField";
import Button from "./Button";
import Select from "./Select";
import DatePicker from './DatePicker';
import { USER_TYPES, GENDER_OPTIONS } from "../utils/constant";

const Register = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email format").required("Email is required"),
        contact: Yup.string().matches(/^[0-9]{10}$/, "Invalid contact number").required("Contact is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords do not match").required("Confirm Password is required"),
        gender: Yup.string().required("Gender is required"),
        date: Yup.date().required("Date of Birth is required"),
        userType: Yup.string().required("User Type is required"),
        emergencyContact: Yup.string().matches(/^[0-9]{10}$/, "Invalid emergency contact number").required("Emergency Contact is required"),
    });
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            contact: "",
            password: "",
            confirmPassword: "",
            gender: "",
            date: "",
            userType: "",
            emergencyContact: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axios.post("http://localhost:8080/user/register", 
                    {
                        ...values,
                        date: values.date.toISOString(),
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const userData = response.data;
                localStorage.setItem('user', JSON.stringify(userData));

                toast.success("Registration successful!");
                navigate("/login");
            } catch {
                toast.error("Registration failed. Please try again.");
            }
        }
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
            >
                {/* Left Side - CareHive Information */}
                <OnBoardingPanel title="Welcome!" subtitle="Please register to get started." />
                <div className="lg:w-1/2 p-6 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Register</h2>
                        </div>
                        {/* Full Name Field */}
                        <div>
                            <TextField
                                label="Full Name"
                                name="name"
                                type="text"
                                onChange={formik.handleChange}
                                placeholder="Enter your full name"
                                required
                                startIcon={<FaUser />}
                                value={formik.values.name}
                                error={formik.errors.name && formik.touched.name}
                                helperText={formik.errors.name && formik.touched.name ? formik.errors.name : ""}
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                onChange={formik.handleChange}
                                placeholder="Enter your email"
                                required
                                startIcon={<FiMail />}
                                value={formik.values.email}
                                error={formik.errors.email && formik.touched.email}
                                helperText={formik.errors.email && formik.touched.email ? formik.errors.email : ""}
                            />
                        </div>
                        {/* Contact Field */}
                        <div>
                            <TextField
                                label="Contact"
                                name="contact"
                                type="text"
                                onChange={formik.handleChange}
                                placeholder="Enter your contact number"
                                required
                                startIcon={<FaPhone />}
                                value={formik.values.contact}
                                error={formik.errors.contact && formik.touched.contact}
                                helperText={formik.errors.contact && formik.touched.contact ? formik.errors.contact : ""}
                            />
                        </div>

                        {/* Gender & Date of Birth Fields */}
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <Select
                                    label="Gender"
                                    name="gender"
                                    options={GENDER_OPTIONS}
                                    onChange={formik.handleChange}
                                    required
                                    value={formik.values.gender}
                                    fullWidth
                                    error={formik.errors.gender && formik.touched.gender}
                                    helperText={formik.errors.gender && formik.touched.gender ? formik.errors.gender : ""}
                                />
                            </div>
                            <div>
                                <DatePicker
                                    label='Date of Birth'
                                    name='date'
                                    onChange={formik.handleChange}
                                    required
                                    value={formik.values.date}
                                    fullWidth
                                    error={formik.errors.date && formik.touched.date}
                                    helperText={formik.errors.date && formik.touched.date ? formik.errors.date : ""}
                                />
                            </div>
                        </div>

                        {/* User Type Field */}
                        <div>
                            <Select
                                label="User Type"
                                name="userType"
                                options={USER_TYPES}
                                onChange={formik.handleChange}
                                placeholder="Select User Type"
                                required
                                value={formik.values.userType}
                                error={formik.errors.userType && formik.touched.userType}
                                helperText={formik.errors.userType && formik.touched.userType ? formik.errors.userType : ""}
                            />
                        </div>

                        {/* Emergency Contact Field */}
                        <div>
                            <TextField
                                label="Emergency Contact"
                                name="emergencyContact"
                                type="text"
                                startIcon={<FaPhone />}
                                onChange={formik.handleChange}
                                placeholder="Enter your emergency contact number"
                                pattern="[0-9]{10}"
                                required
                                value={formik.values.emergencyContact}
                                error={formik.errors.emergencyContact && formik.touched.emergencyContact}
                                helperText={formik.errors.emergencyContact && formik.touched.emergencyContact ? formik.errors.emergencyContact : ""}
                            />
                        </div>

                        {/* Password & Confirm Password Fields */}
                        <div>
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                startIcon={<FaLock />}
                                onChange={formik.handleChange}
                                placeholder="Enter your password"
                                required
                                value={formik.values.password}
                                error={formik.errors.password && formik.touched.password}
                                helperText={formik.errors.password && formik.touched.password ? formik.errors.password : ""}
                            />
                        </div>
                        <div>
                            <TextField
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                onChange={formik.handleChange}
                                placeholder="Confirm your password"
                                required
                                startIcon={<FaLock />}
                                value={formik.values.confirmPassword}
                                error={formik.errors.confirmPassword && formik.touched.confirmPassword}
                                helperText={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ""}
                            />
                        </div>

                        {/* Register Button */}
                        <Button
                            onClick={formik.handleSubmit}
                            label="Register"
                            variant="contained"
                            color="primary"
                            isLoading={formik.isSubmitting}
                            disabled={!formik.isValid}
                            fullWidth
                        />
                        {/* Login Link */}
                        <p className="text-center mt-4 text-gray-700 text-lg">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 font-semibold">
                                Login
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
