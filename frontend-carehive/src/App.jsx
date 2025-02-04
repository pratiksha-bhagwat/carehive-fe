import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import CareTakerDashboard from "./components/CareTakerDashboard";
import ElderDashboard from "./components/ElderDashboard";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";  // Import the ForgotPassword component

import PropTypes from 'prop-types';

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
        <Route path="/elder" element={<ProtectedRoute><ElderDashboard /></ProtectedRoute>} />
        <Route path="/caretaker" element={<ProtectedRoute><CareTakerDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
