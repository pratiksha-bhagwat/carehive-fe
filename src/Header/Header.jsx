import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white p-4 shadow-lg fixed top-0 left-0 z-50">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

        {/* Navigation Links */}
        <ul
          className={`md:flex md:space-x-6 text-gray-700 
          absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto 
          bg-white md:bg-transparent shadow-md md:shadow-none transition-all 
          duration-300 ease-in-out ${menuOpen ? "flex flex-col items-center py-4" : "hidden md:flex"}`}
        >
          <li className="cursor-pointer hover:text-blue-500 p-2">Overview</li>
          <li className="cursor-pointer hover:text-blue-500 p-2">Appointments</li>
          <li 
            className="cursor-pointer hover:text-blue-500 p-2"
            onClick={() => navigate("/services")}
          >
            Services
          </li>
          <li className="cursor-pointer hover:text-blue-500 p-2">Settings</li>

          {/* Profile Icon & Dropdown */}
          <li className="relative p-2">
            <button
              className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              👤 {/* Placeholder for Admin Profile Icon */}
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                <ul className="text-gray-700">
                  <li 
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    onClick={() => { navigate("/profile"); setProfileOpen(false); }}
                  >
                    Manage Profile
                  </li>
                  <li 
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    onClick={() => { navigate("/settings"); setProfileOpen(false); }}
                  >
                    Settings
                  </li>
                  <li 
                    className="cursor-pointer px-4 py-2 text-red-500 hover:bg-gray-100"
                    onClick={() => alert("Logged out!")}
                  >
                    Log Out
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
    </nav>
  );
}
