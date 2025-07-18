import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import CareTakerDashboard from "./components/CareTakerDashboard";
import ElderDashboard from "./components/ElderDashboard";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";
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
import Navbar from "./components/Admin/Navbar";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("userId");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const AdminLayout = ({ children }) => {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    const userType = sessionStorage.getItem("userType");
    
    if (userId && token && userType) {
      setUserType(userType);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-gray-300">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar userType={userType} onLogout={handleLogout} />
      </div>
      <div className="pt-24 px-4">
        {children}
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected Routes */}
      <Route path="/elder" element={<ProtectedRoute><ElderDashboard /></ProtectedRoute>} />
      <Route path="/caretaker" element={<ProtectedRoute><CareTakerDashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
      <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/success-payment" element={<PaymentSuccessScreen />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/service" element={
        <ProtectedRoute>
          <AdminLayout><ServiceManagement /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/appointments" element={
        <ProtectedRoute>
          <AdminLayout><Appointments /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/caretakers" element={
        <ProtectedRoute>
          <AdminLayout><Caretakers /></AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
