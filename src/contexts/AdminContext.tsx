
// src/contexts/AdminContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

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

function getApiErrorMessage(e: any, fallback = "Something went wrong") {
  return (
    e?.response?.data?.error ||
    e?.response?.data?.message ||
    e?.message ||
    fallback
  );
}

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
      const { data } = await api.get(
        `/admin/users${params.toString() ? `?${params.toString()}` : ""}`
      );
      const list: AdminUser[] = data?.data ?? [];
      setUsers(list);
      return true;
    } catch (e: any) {
      const msg = getApiErrorMessage(e, "Failed to load users");
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ——— Guard for admin-only mutations ———
  const ensureAdmin = useCallback(() => {
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action");
      return false;
    }
    return true;
  }, [isAdmin]);

  // ——— Mutations with optimistic UI ———
  const makeAdmin = useCallback(
    async (id: string) => {
      if (!ensureAdmin()) return false;
      const prev = users;
      setUsers((cur) =>
        cur.map((u) => (u.id === id ? { ...u, role: "admin" } : u))
      );
      try {
        const { data } = await api.patch(`/admin/users/${id}/make-admin`);
        const role = (data?.data?.role as AdminUser["role"]) || "admin"; // sync from server
        setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, role } : u)));
        // toast.success("Granted admin access");
        return true;
      } catch (e: any) {
        setUsers(prev);
        toast.error(getApiErrorMessage(e, "Failed to grant admin access"));
        return false;
      }
    },
    [users, ensureAdmin]
  );

  const activate = useCallback(
    async (id: string) => {
      if (!ensureAdmin()) return false;
      const prev = users;
      setUsers((cur) =>
        cur.map((u) => (u.id === id ? { ...u, status: "active" } : u))
      );
      try {
        const { data } = await api.patch(`/admin/users/${id}/activate`);
        const status = (data?.data?.status as AdminUser["status"]) || "active";
        setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, status } : u)));
        // toast.success("User activated");
        return true;
      } catch (e: any) {
        setUsers(prev);
        toast.error(getApiErrorMessage(e, "Failed to activate user"));
        return false;
      }
    },
    [users, ensureAdmin]
  );

  const deactivate = useCallback(
    async (id: string) => {
      if (!ensureAdmin()) return false;
      const prev = users;
      setUsers((cur) =>
        cur.map((u) => (u.id === id ? { ...u, status: "inactive" } : u))
      );
      try {
        const { data } = await api.patch(`/admin/users/${id}/deactivate`);
        const status =
          (data?.data?.status as AdminUser["status"]) || "inactive";
        setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, status } : u)));
        // toast.success("User deactivated");
        return true;
      } catch (e: any) {
        setUsers(prev);
        toast.error(getApiErrorMessage(e, "Failed to deactivate user"));
        return false;
      }
    },
    [users, ensureAdmin]
  );

  const removeUser = useCallback(
    async (id: string) => {
      if (!ensureAdmin()) return false;
      if (user?.id && user.id === id) {
        toast.error("You cannot remove your own account");
        return false;
      }
      const prev = users;
      setUsers((cur) => cur.filter((u) => u.id !== id));
      try {
        await api.delete(`/admin/users/${id}`);
        // toast.success("User removed");
        return true;
      } catch (e: any) {
        setUsers(prev);
        toast.error(getApiErrorMessage(e, "Failed to remove user"));
        return false;
      }
    },
    [users, ensureAdmin, user?.id]
  );

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
      setUsers
    }),
    [
      users,
      loading,
      error,
      isAdmin,
      fetchUsers,
      makeAdmin,
      activate,
      deactivate,
      removeUser
    ]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within an AdminProvider");
  return ctx;
};
