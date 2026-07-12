"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FAFAF8]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <>
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 z-[99] lg:hidden"
          />
          <div className="fixed inset-y-0 left-0 w-52 z-[100] lg:hidden shadow-floating">
            <Sidebar />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-[-44px] w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
