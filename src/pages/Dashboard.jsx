import TopNav from "../components/TopNav";
import Charts from "../components/Charts";
import StatsCard from "../components/StatsCard";
import Table from "../components/Table";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <TopNav />

      {/* Main Content - Centered */}
      <div className="flex justify-center w-full">
        <div className="pt-20 px-6 space-y-6 w-full max-w-screen-lg">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Total Customers" value="1,200" />
            <StatsCard title="Earnings" value="$50,000" />
            <StatsCard title="Appointments" value="320" />
          </div>

          {/* Charts Section */}
          <Charts />

          {/* Table Section */}
          <Table />
        </div>
      </div>
    </div>
  );
}





