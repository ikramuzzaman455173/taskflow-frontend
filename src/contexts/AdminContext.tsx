// src/contexts/AdminContext.tsx
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status?: "active" | "inactive";
  tasks: number;
  joinedAt?: string;
  lastActive?: string;
}

interface AdminContextType {
  // state
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  // actions
  fetchUsers: (opts?: { search?: string }) => Promise<boolean>;
  makeAdmin: (id: string) => Promise<boolean>;
  activate: (id: string) => Promise<boolean>;
  deactivate: (id: string) => Promise<boolean>;
  removeUser: (id: string) => Promise<boolean>;
  // utilities
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>; // exposed for custom UIs (tables, inline edits)
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (opts?: { search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (opts?.search) params.set("search", opts.search);
      const { data } = await api.get(`/admin/users${params.toString() ? `?${params.toString()}` : ""}`);
      const list: AdminUser[] = data?.data ?? [];
      setUsers(list);
      return true;
    } catch (e: unknown) {
      if (e && typeof e === "object" && "response" in e && e.response && typeof e.response === "object" && "data" in e.response && e.response.data && typeof e.response.data === "object" && "error" in e.response.data) {
        setError((e as { response: { data: { error: string } } }).response.data.error);
      } else {
        setError("Failed to load users");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ——— Mutations with optimistic UI ———
  const makeAdmin = useCallback(async (id: string) => {
    const prev = users;
    setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, role: "admin" } : u)));
    try {
      const { data } = await api.patch(`/admin/users/${id}/make-admin`);
      const role = data?.data?.role as AdminUser["role"]; // sync from server
      setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, role } : u)));
      return true;
    } catch (e) {
      setUsers(prev);
      return false;
    }
  }, [users]);

  const activate = useCallback(async (id: string) => {
    const prev = users;
    setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, status: "active" } : u)));
    try {
      const { data } = await api.patch(`/admin/users/${id}/activate`);
      const status = data?.data?.status as AdminUser["status"];
      setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, status } : u)));
      return true;
    } catch (e) {
      setUsers(prev);
      return false;
    }
  }, [users]);

  const deactivate = useCallback(async (id: string) => {
    const prev = users;
    setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, status: "inactive" } : u)));
    try {
      const { data } = await api.patch(`/admin/users/${id}/deactivate`);
      const status = data?.data?.status as AdminUser["status"];
      setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, status } : u)));
      return true;
    } catch (e) {
      setUsers(prev);
      return false;
    }
  }, [users]);

  const removeUser = useCallback(async (id: string) => {
    const prev = users;
    setUsers((cur) => cur.filter((u) => u.id !== id));
    try {
      await api.delete(`/admin/users/${id}`);
      return true;
    } catch (e) {
      setUsers(prev);
      return false;
    }
  }, [users]);

  const value = useMemo(
    () => ({
      users,
      loading,
      error,
      isAdmin,
      fetchUsers,
      makeAdmin,
      activate,
      deactivate,
      removeUser,
      setUsers,
    }),
    [users, loading, error, isAdmin, fetchUsers, makeAdmin, activate, deactivate, removeUser]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within an AdminProvider");
  return ctx;
};

