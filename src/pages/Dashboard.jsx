import TopNav from "../Header/Header";
import Charts from "../components/Charts";
import StatsCard from "../components/StatsCard";
import Table from "../components/Table";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <TopNav />

      {/* Main Content - Responsive Layout */}
      <div className="flex justify-center w-full">
        <div className="pt-16 sm:pt-20 lg:pt-24 px-4 sm:px-6 space-y-6 w-full max-w-6xl">
          
          {/* Stats Section - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <StatsCard title="Total Customers" value="1,200" />
            <StatsCard title="Earnings" value="$50,000" />
            <StatsCard title="Appointments" value="320" />
          </div>

          {/* Charts Section - Responsive */}
          <Charts />

          {/* Table Section - Make Scrollable on Small Screens */}
          <div className="overflow-x-auto">
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
}

