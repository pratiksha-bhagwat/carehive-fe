import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import img from '../assets/logo.png';
const Navbar = ({ caretaker, onLogout }) => {
    const location = useLocation();

    return (
        <nav className="bg-blue-300 text-white p-4 flex justify-between items-center">
            <div className="text-2xl font-bold">
                <Link to="/home"><img src={img} alt="Logo" className="h-10" /></Link>
            </div>
            <div className="flex space-x-4">
                <Link to="/home" className={`hover:text-white border-2 rounded-2xl p-2 ${location.pathname === "/home" ? "text-white font-bold" : "text-blue-700"}`}>
                    Home
                </Link>
                <Link to="/profile" className="text-blue-700 hover:text-white border-2 rounded-2xl p-2">Profile</Link>
                <Link to="/bookings" className="text-blue-700 hover:text-white border-2 rounded-2xl p-2">Bookings</Link>
                <Link to="/emergency" className="text-blue-700 hover:text-white border-2 rounded-2xl p-2">Emergency</Link>
                {caretaker && <span className="text-lg border-2 rounded-2xl p-2">{caretaker.name}</span>}
                <button onClick={onLogout} className="text-red-600 hover:text-red-800 border-2 rounded-2xl p-2">Logout</button>
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
