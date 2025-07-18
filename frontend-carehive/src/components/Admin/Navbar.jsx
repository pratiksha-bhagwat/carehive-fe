import { useEffect } from "react";
import { Link } from "react-router-dom";
import img from "../../assets/logo.png";
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import checkout from "../../assets/check-out.png";

const Navbar = ({ userType, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    const [userData, setUserData] = useState({});

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        onLogout();
    };

    const fetchUserData = async() => {
        try {
            const response = await axios.get(`/user/userDetails/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserData(response.data);
        } catch {
            toast.error("Failed to fetch user details.");
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <nav className="bg-gradient-to-r from-blue-300 to-blue-600 text-white rounded-xl p-4 px-4 flex justify-between items-center shadow-lg relative pb-4">
            {/* Logo */}
            <Link to="/admin" className="text-2xl font-bold flex items-center space-x-2">
                <img src={img} alt="Logo" className="h-11" />
            </Link>

            {/* Desktop Navigation (Hidden in Mobile) */}
            <div className="hidden md:flex space-x-6 items-center">
                <Link to="/admin" className="text-blue-200 hover:text-white font-semibold transition duration-200">
                    Home
                </Link>
                <Link to="/service" className="text-blue-200 hover:text-white font-semibold transition duration-200">
                    Services
                </Link>
                <Link to="/appointments" className="text-blue-200 hover:text-white font-semibold transition duration-200">
                    Appointments
                </Link>
                <Link to="/caretakers" className="text-blue-200 hover:text-white font-semibold transition duration-200">
                    Caretakers
                </Link>

                {userData.name && <span className="text-lg text-white font-semibold">{userData.name}</span>}

                <button onClick={handleLogout} className="text-red-300 font-semibold hover:text-red-800 transition duration-200">
                    <img src={checkout} alt="Logo" className="h-10 text-red-300"/>
                </button>
            </div>

            {/* Hamburger Icon for Mobile */}
            <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-gradient-to-r from-blue-300 to-blue-600 text-white p-4 rounded-b-xl shadow-lg md:hidden">
                    <div className="flex flex-col items-center space-y-4">
                        <Link to={userType === "Elder" ? "/elder" : "/caretaker"} className="text-blue-200 hover:text-white font-semibold transition duration-200" onClick={toggleMenu}>
                            Home
                        </Link>
                        <Link to="/service" className="text-blue-200 hover:text-white font-semibold transition duration-200" onClick={toggleMenu}>
                            Services
                        </Link>
                        <Link to="/appointments" className="text-blue-200 hover:text-white font-semibold transition duration-200" onClick={toggleMenu}>
                            Appointments
                        </Link>
                        <Link to="/caretakers" className="text-blue-200 hover:text-white font-semibold transition duration-200" onClick={toggleMenu}>
                            Caretakers
                        </Link>

                        {userData.name && <span className="text-lg text-white font-semibold">{userData.name}</span>}

                        <button onClick={handleLogout} className="text-red-500 font-semibold hover:text-red-800 transition duration-200">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
        
    );
};

Navbar.propTypes = {
    userType: PropTypes.string.isRequired,
    userName: PropTypes.string,
    onLogout: PropTypes.func.isRequired,
};

export default Navbar;
