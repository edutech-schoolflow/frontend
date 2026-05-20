"use client";

import CustomerTable from "./components/CustomerTable";
import RecentActivity from "./components/RecentActivity";
import RecentTickets from "./components/RecentTickets";
import StatsRow from "./components/StatsRow";

const Dashboard = () => {
  return (
    <div className="space-y-4">
      <StatsRow />
      <div className="flex gap-4">
        <RecentTickets />
        <RecentActivity />
      </div>
      <CustomerTable />
    </div>
  );
};

export default Dashboard;
