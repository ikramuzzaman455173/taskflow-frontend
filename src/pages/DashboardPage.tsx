import React, { useState } from "react";
import { TaskProvider } from "@/contexts/TaskContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import AdminDashboard from "@/components/AdminDashboard";
import TaskList from "@/components/TaskList";
import Profile from "@/components/Profile";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getTabConfig = (tab: string) => {
    switch (tab) {
      case "dashboard":
        return { component: <Dashboard />, title: "Dashboard" };
      case "admin":
        return { component: <AdminDashboard />, title: "Admin Dashboard" };
      case "all":
        return {
          component: <TaskList status="all" title="All Tasks" />,
          title: "All Tasks"
        };
      case "pending":
        return {
          component: <TaskList status="pending" title="Pending Tasks" />,
          title: "Pending Tasks"
        };
      case "completed":
        return {
          component: <TaskList status="completed" title="Completed Tasks" />,
          title: "Completed Tasks"
        };
      case "overdue":
        return {
          component: <TaskList status="overdue" title="Overdue Tasks" />,
          title: "Overdue Tasks"
        };
      case "profile":
        return { component: <Profile />, title: "Profile" };
      default:
        return { component: <Dashboard />, title: "Dashboard" };
    }
  };

  const { component } = getTabConfig(activeTab);

  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="min-h-screen bg-background">
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar - Truly fixed positioning */}
          <div
            className={`
            fixed left-0 top-0 h-screen w-72 z-50 transform transition-transform duration-300 lg:translate-x-0
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
          >
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Main Content with left margin to account for fixed sidebar */}
          <div className="lg:ml-72">
            {/* Mobile Header */}
            {/* <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-muted"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold">TaskFlow</h1>
              <div className="w-10" />
            </div> */}

            {/* Mobile Header (sticky) */}
            <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-muted"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-lg font-semibold">TaskFlow</h1>
              <div className="w-10" />
            </div>

            {/* Page Content */}
            <div className="min-h-screen">
              <div className="container mx-auto p-6">{component}</div>
            </div>
          </div>
        </div>
      </TaskProvider>
    </ThemeProvider>
  );
}
