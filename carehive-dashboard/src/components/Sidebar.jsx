export default function Sidebar() {
    return (
        <aside className="w-1/5 bg-white p-4 shadow-lg">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <nav>
          <ul>
            <li className="py-2 text-gray-700">Overview</li>
            <li className="py-2 text-gray-700">Appointments</li>
            <li className="py-2 text-gray-700">Services</li>
            <li className="py-2 text-gray-700">Settings</li>
          </ul>
        </nav>
      </aside>
    );
  }