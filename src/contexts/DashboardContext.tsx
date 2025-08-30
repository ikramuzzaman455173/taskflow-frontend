// src/contexts/DashboardContext.tsx
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

// —— API response types ——
export interface UserTaskItem {
  _id: string;
  title?: string;
  status: "pending" | "completed" | string;
  priority?: "low" | "medium" | "high" | string;
  dueDate?: string | null;
  createdAt?: string;
  [k: string]: unknown;
}

export interface UserDashboardData {
  totals: { total: number; inProgress: number; completed: number; overdue: number };
  completionRate: number;
  byPriority: { high: number; medium: number; low: number };
  recent: UserTaskItem[];
}

export interface ActivityItem {
  _id: string;
  type: string;
  message: string;
  user?: string;
  createdAt?: string;
}

export interface AdminUserRow {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status?: "active" | "inactive";
  joinedAt?: string;
  lastActiveAt?: string;
  tasksCount: number;
}

export interface AdminDashboardData {
  metrics: {
    totalUsers: number;
    activeUsers: number;
    totalTasks: number;
    completionRate: number;
  };
  statusOverview: {
    completed: number;
    pending: number;
    overdue: number;
  };
  systemHealth: {
    serverStatus: string;
    database: string;
    responseTimeMs: number;
  };
  recentActivity: ActivityItem[];
  users: AdminUserRow[];
}

interface DashboardContextType {
  // state
  userData: UserDashboardData | null;
  adminData: AdminDashboardData | null;
  loadingUser: boolean;
  loadingAdmin: boolean;
  errorUser: string | null;
  errorAdmin: string | null;
  isAdmin: boolean;
  // actions
  fetchUserDashboard: () => Promise<boolean>;
  fetchAdminDashboard: () => Promise<boolean>;
  // manual setters (optional for custom UIs)
  setUserData: React.Dispatch<React.SetStateAction<UserDashboardData | null>>;
  setAdminData: React.Dispatch<React.SetStateAction<AdminDashboardData | null>>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [userData, setUserData] = useState<UserDashboardData | null>(null);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [errorAdmin, setErrorAdmin] = useState<string | null>(null);

  const fetchUserDashboard = useCallback(async () => {
    setLoadingUser(true);
    setErrorUser(null);
    try {
      const { data } = await api.get("/dashboard/user");
      setUserData(data?.data ?? null);
      return true;
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as { response?: unknown }).response === "object" &&
        (e as { response?: { data?: unknown } }).response !== null &&
        "data" in (e as { response?: { data?: unknown } }).response! &&
        typeof ((e as { response: { data?: unknown } }).response as { data?: unknown }).data === "object" &&
        ((e as { response: { data?: { error?: unknown } } }).response as { data?: { error?: unknown } }).data !== null &&
        "error" in ((e as { response: { data?: { error?: unknown } } }).response as { data?: { error?: unknown } }).data!
      ) {
        setErrorUser(
          (((e as { response: { data: { error?: string } } }).response as { data: { error?: string } }).data.error) ||
            "Failed to load user dashboard"
        );
      } else {
        setErrorUser("Failed to load user dashboard");
      }
      return false;
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const fetchAdminDashboard = useCallback(async () => {
    setLoadingAdmin(true);
    setErrorAdmin(null);
    try {
      const { data } = await api.get("/dashboard/admin");
      setAdminData(data?.data ?? null);
      return true;
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as { response?: unknown }).response === "object" &&
        (e as { response?: { data?: unknown } }).response !== null &&
        "data" in (e as { response?: { data?: unknown } }).response! &&
        typeof ((e as { response: { data?: unknown } }).response as { data?: unknown }).data === "object" &&
        ((e as { response: { data?: { error?: unknown } } }).response as { data?: { error?: unknown } }).data !== null &&
        "error" in ((e as { response: { data?: { error?: unknown } } }).response as { data?: { error?: unknown } }).data!
      ) {
        setErrorAdmin(
          (((e as { response: { data: { error?: string } } }).response as { data: { error?: string } }).data.error) ||
            "Failed to load admin dashboard"
        );
      } else {
        setErrorAdmin("Failed to load admin dashboard");
      }
      return false;
    } finally {
      setLoadingAdmin(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      userData,
      adminData,
      loadingUser,
      loadingAdmin,
      errorUser,
      errorAdmin,
      isAdmin,
      fetchUserDashboard,
      fetchAdminDashboard,
      setUserData,
      setAdminData,
    }),
    [userData, adminData, loadingUser, loadingAdmin, errorUser, errorAdmin, isAdmin, fetchUserDashboard, fetchAdminDashboard]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within a DashboardProvider");
  return ctx;
};
