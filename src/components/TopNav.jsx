export default function TopNav() {
  
  return (
    <nav className="w-full bg-white p-4 shadow-lg fixed top-0 left-0 z-10">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <ul className="flex space-x-6 text-gray-700">
          <li className="cursor-pointer hover:text-blue-500">Overview</li>
          <li className="cursor-pointer hover:text-blue-500">Appointments</li>
          <li className="cursor-pointer hover:text-blue-500">Services</li>
          <li className="cursor-pointer hover:text-blue-500">Settings</li>
        </ul>
      </div>
    </nav>
  );
}
