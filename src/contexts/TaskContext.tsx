// src/contexts/TaskContext.tsx
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "@/lib/api";

// —— Types aligned with your Task model/controller ——
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "completed";

export interface TaskItem {
  _id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus | string; // in case of unexpected values
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  [k: string]: any;
}

export interface TaskSummary {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
  byPriority: { high: number; medium: number; low: number };
  recent: TaskItem[];
}

export interface ListOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sort?: string; // default: createdAt
  order?: "asc" | "desc"; // default: desc
}

interface TaskContextType {
  // state
  tasks: TaskItem[];
  summary: TaskSummary | null;
  loadingList: boolean;
  loadingSummary: boolean;
  errorList: string | null;
  errorSummary: string | null;

  // actions
  listTasks: (opts?: ListOptions) => Promise<boolean>;
  getTask: (id: string) => Promise<TaskItem | null>;
  createTask: (
    input: Partial<Pick<TaskItem, "title" | "description" | "priority" | "status" | "dueDate">>
  ) => Promise<TaskItem | null>;
  updateTask: (
    id: string,
    input: Partial<Pick<TaskItem, "title" | "description" | "priority" | "status" | "dueDate">>
  ) => Promise<TaskItem | null>;
  removeTask: (id: string) => Promise<boolean>;
  removeAll: () => Promise<boolean>;
  fetchSummary: () => Promise<boolean>;

  // selectors
  getTasksByStatus: (status: "all" | "pending" | "completed" | "overdue") => TaskItem[];
  getOverdueTasks: () => TaskItem[];

  // manual setter for advanced table UIs
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [summary, setSummary] = useState<TaskSummary | null>(null);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [errorList, setErrorList] = useState<string | null>(null);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);

  const listTasks = useCallback(async (opts?: ListOptions) => {
    setLoadingList(true);
    setErrorList(null);
    try {
      const params = new URLSearchParams();
      if (opts?.status) params.set("status", opts.status);
      if (opts?.priority) params.set("priority", opts.priority);
      if (opts?.search) params.set("search", opts.search);
      params.set("sort", opts?.sort ?? "createdAt");
      params.set("order", opts?.order ?? "desc");

      const { data } = await api.get(
        `/tasks/list${params.toString() ? `?${params.toString()}` : ""}`
      );
      const list: TaskItem[] = data?.data ?? [];
      setTasks(list);
      return true;
    } catch (e: any) {
      setErrorList(e?.response?.data?.error || "Failed to load tasks");
      return false;
    } finally {
      setLoadingList(false);
    }
  }, []);

  const getTask = useCallback(async (id: string) => {
    try {
      const { data } = await api.get(`/tasks/${id}`);
      return (data?.data as TaskItem) ?? null;
    } catch {
      return null;
    }
  }, []);

  const createTask = useCallback(
    async (
      input: Partial<
        Pick<TaskItem, "title" | "description" | "priority" | "status" | "dueDate">
      >
    ) => {
      // optimistic prepend
      const tempId = `temp-${Date.now()}`;
      const optimistic: TaskItem = {
        _id: tempId,
        title: String(input.title || "Untitled"),
        description: input.description || "",
        priority: (input.priority as TaskPriority) || "medium",
        status: (input.status as TaskStatus) || "pending",
        dueDate: input.dueDate ? String(input.dueDate) : undefined,
        createdAt: new Date().toISOString(),
      };
      setTasks((cur) => [optimistic, ...cur]);

      try {
        const { data } = await api.post("/tasks/create", input);
        const saved: TaskItem = data?.data;
        setTasks((cur) => cur.map((t) => (t._id === tempId ? saved : t)));
        return saved;
      } catch {
        // rollback
        setTasks((cur) => cur.filter((t) => t._id !== tempId));
        return null;
      }
    },
    []
  );

  const updateTask = useCallback(
    async (
      id: string,
      input: Partial<
        Pick<TaskItem, "title" | "description" | "priority" | "status" | "dueDate">
      >
    ) => {
      const prev = tasks;
      setTasks((cur) => cur.map((t) => (t._id === id ? ({ ...t, ...input } as TaskItem) : t)));
      try {
        const { data } = await api.put(`/tasks/${id}`, input);
        const updated: TaskItem = data?.data;
        setTasks((cur) => cur.map((t) => (t._id === id ? updated : t)));
        return updated;
      } catch {
        setTasks(prev);
        return null;
      }
    },
    [tasks]
  );

  const removeTask = useCallback(
    async (id: string) => {
      const prev = tasks;
      setTasks((cur) => cur.filter((t) => t._id !== id));
      try {
        await api.delete(`/tasks/${id}`);
        return true;
      } catch {
        setTasks(prev);
        return false;
      }
    },
    [tasks]
  );

  const removeAll = useCallback(
    async () => {
      const prev = tasks;
      setTasks([]);
      try {
        await api.delete("/tasks/removeAll");
        return true;
      } catch {
        setTasks(prev);
        return false;
      }
    },
    [tasks]
  );

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    setErrorSummary(null);
    try {
      const { data } = await api.get("/tasks/summary");
      setSummary((data?.data as TaskSummary) ?? null);
      return true;
    } catch (e: any) {
      setErrorSummary(e?.response?.data?.error || "Failed to load summary");
      return false;
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // —— Selectors (for convenience / backward compatibility) ——
  const getTasksByStatus = useCallback(
    (status: "all" | "pending" | "completed" | "overdue"): TaskItem[] => {
      if (status === "all") return tasks;
      if (status === "completed") return tasks.filter((t) => t.status === "completed");
      if (status === "pending") return tasks.filter((t) => t.status !== "completed");
      // overdue
      const now = new Date();
      return tasks.filter(
        (t) => t.status !== "completed" && t.dueDate && new Date(t.dueDate) < now
      );
    },
    [tasks]
  );

  const getOverdueTasks = useCallback(
    () => getTasksByStatus("overdue"),
    [getTasksByStatus]
  );

  const value = useMemo(
    () => ({
      tasks,
      summary,
      loadingList,
      loadingSummary,
      errorList,
      errorSummary,
      listTasks,
      getTask,
      createTask,
      updateTask,
      removeTask,
      removeAll,
      setTasks,
      fetchSummary,
      getTasksByStatus, // NEW
      getOverdueTasks,  // NEW
    }),
    [
      tasks,
      summary,
      loadingList,
      loadingSummary,
      errorList,
      errorSummary,
      listTasks,
      getTask,
      createTask,
      updateTask,
      removeTask,
      removeAll,
      fetchSummary,
      getTasksByStatus,
      getOverdueTasks,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within a TaskProvider");
  return ctx;
};
