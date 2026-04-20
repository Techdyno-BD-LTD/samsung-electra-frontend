import React from "react";

const DashboardPage = () => {
  return (
    <div className="premium-card p-8 bg-white min-h-[500px] flex flex-col justify-center items-center text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome to your Dashboard</h2>
      <p className="text-slate-600 max-w-md">
        This is where your dashboard content will appear. Use the sidebar to navigate through your orders, address, wishlist, and more.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 border border-slate-100 rounded-xl bg-slate-50 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
