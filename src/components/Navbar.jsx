import { Link } from "react-router-dom";
import img from "../assets/logo.png";
import PropTypes from "prop-types";
import { useState } from "react";
import checkout from "../assets/check-out.png";

const Navbar = ({ userType, userName, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-300 to-blue-600 text-white rounded-xl p-4 px-4 flex justify-between items-center shadow-lg relative pb-4">
            {/* Logo */}
            <Link to={userType === "Elder" ? "/elder" : "/caretaker"} className="text-2xl font-bold flex items-center space-x-2">
                <img src={img} alt="Logo" className="h-11" />
            </Link>

            {/* Desktop Navigation (Hidden in Mobile) */}
            <div className="hidden md:flex space-x-6 items-center">
                <Link to={userType === "Elder" ? "/elder" : "/caretaker"} className="text-blue-200 hover:text-white font-semibold transition duration-200">
                    Home
                </Link>
                <Link to="/profile" className="text-blue-200 hover:text-white font-semibold transition duration-200">
                    Profile
                </Link>
                <Link to="/bookings" className="text-blue-200 hover:text-white font-semibold transition duration-200">
                    Bookings
                </Link>
                <Link to="/emergency" className="text-blue-200 hover:text-white font-semibold transition duration-200">
                    Emergency
                </Link>

                {userName && <span className="text-lg text-white font-semibold">{userName}</span>}

                <button onClick={onLogout} className="text-red-300 font-semibold hover:text-red-800 transition duration-200">
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
                        <Link to="/profile" className="text-blue-200 hover:text-white font-semibold transition duration-200" onClick={toggleMenu}>
                            Profile
                        </Link>
                        <Link to="/bookings" className="text-blue-200 hover:text-white font-semibold transition duration-200" onClick={toggleMenu}>
                            Bookings
                        </Link>
                        <Link to="/emergency" className="text-blue-200 hover:text-white font-semibold transition duration-200" onClick={toggleMenu}>
                            Emergency
                        </Link>

                        {userName && <span className="text-lg text-white font-semibold">{userName}</span>}

                        <button onClick={onLogout} className="text-red-500 font-semibold hover:text-red-800 transition duration-200">
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
