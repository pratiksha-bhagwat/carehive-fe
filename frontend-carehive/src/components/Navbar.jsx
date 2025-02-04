import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import img from '../assets/logo.png';
const Navbar = ({ caretaker, onLogout }) => {
    const location = useLocation();

    return (
        <nav className="bg-blue-300 text-white p-4 flex justify-between items-center">
            <div className="text-2xl font-bold">
                <Link to="/caretaker"><img src={img} alt="Logo" className="h-10" /></Link>
            </div>
            <div className="flex space-x-4">
                <Link to="/caretaker" className={`hover:text-white ${location.pathname === "/home" ? "text-white font-bold" : "text-blue-700"}`}>
                    Home
                </Link>
                <Link to="/profile" className="text-blue-700 hover:text-white">Profile</Link>
                <Link to="/bookings" className="text-blue-700 hover:text-white">Bookings</Link>
                <Link to="/emergency" className="text-blue-700 hover:text-white">Emergency</Link>
                {caretaker && <span className="text-lg text-green-700">{caretaker.name}</span>}
                <button onClick={onLogout} className="text-red-600 hover:text-red-800">Logout</button>
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    caretaker: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }),
    onLogout: PropTypes.func.isRequired,
};

export default Navbar;
