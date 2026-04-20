import React from "react";
import DashboardSidebar from "./_components/DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[25%_71%] lg:gap-[2%]   mx-auto py-16">
      <div className="w-full">
        <DashboardSidebar />
      </div>
      <div className="min-h-[600px] w-full flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#004b91] mb-1">Hi, Amanullah</h1>
          <p className="text-slate-500 text-sm lg:text-base">Welcome to our account</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
