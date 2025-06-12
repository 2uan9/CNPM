"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Quản lý trạng thái sidebar

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header isLoggedIn username="admin" />

      {/* Wrapper để chia Sidebar và Nội dung chính */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/* Nội dung chính */}
        <main className="flex-1 p-6 bg-white shadow-md rounded-lg overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
