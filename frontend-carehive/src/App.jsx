import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import CareTakerDashboard from "./components/CareTakerDashboard";
import ElderDashboard from "./components/ElderDashboard";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";  // Import the ForgotPassword component
import ResetPassword from "./components/ResetPassword";
import PropTypes from 'prop-types';
import Booking from "./components/Booking";
import Emergency from "./components/Emergency";
import Payment from "./components/Payment";
import AdminDashboard from "./components/Admin/AdminDashboard";
import PaymentSuccessScreen from "./components/PaymentSuccessScreen";
import ServiceManagement from "./components/Admin/ServiceManagement";
import Appointments from "./components/Admin/Appointments";
import Caretakers from "./components/Admin/Caretaker";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("userId");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />  {/* Add Forgot Password route */}
        
        {/* Protected Routes */}
        <Route path="/elder" element={<ProtectedRoute><ElderDashboard /></ProtectedRoute>} />
        <Route path="/caretaker" element={<ProtectedRoute><CareTakerDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
        {/* ResetPassword with query params (e.g., /resetPassword?token=xyz) */}
        <Route path="/resetPassword" element={<ResetPassword />} />  {/* Reset Password route */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/success-payment" element={<PaymentSuccessScreen />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/service" element={<ServiceManagement />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/caretakers" element={<Caretakers />} />

      </Routes>
    </Router>
  );
}

export default App;
