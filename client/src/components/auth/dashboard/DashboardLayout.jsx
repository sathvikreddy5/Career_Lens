import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Header */}
      <Header setMobileOpen={setMobileOpen} />

      {/* Page Content */}
      <main className="lg:ml-[250px]">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
