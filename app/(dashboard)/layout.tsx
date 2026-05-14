"use client";

import React, { useEffect } from "react";
import DashboardSidebar from "./_components/DashboardSidebar";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/common/Skeleton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    // We wait for hydration (mount) to check auth
    const token = localStorage.getItem('auth_token');
    if (!token && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted) {
    return <div className="min-h-[600px]" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-[25%_71%] gap-[2%]">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[25%_71%] lg:gap-[2%]   mx-auto py-16">
      <div className="w-full">
        <DashboardSidebar />
      </div>
      <div className="min-h-[600px] w-full flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#004b91] mb-1">Hi, {user?.name || 'User'}</h1>
          <p className="text-slate-500 text-sm lg:text-base">Welcome to our account</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
