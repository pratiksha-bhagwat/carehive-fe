import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import Charts from "../components/Charts";
import Table from "../components/Table";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard title="New Customers" value="3,500" />
          <StatsCard title="Staff" value="1,200" />
          <StatsCard title="Appointments" value="1,500" />
          <StatsCard title="Service Locations" value="100" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4">
          <Charts />
        </div>

        {/* Recent Appointments Table */}
        <Table />
      </main>
    </div>
  );
}
