// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status?: "active" | "inactive";
  preferences?: Record<string, unknown>;
  joinedAt?: string;
  lastActiveAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// —— localStorage (for fast paint + cross-tab sync) ——
const LS_USER_KEY = "auth_user";

function readUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function writeUserToStorage(u: User | null) {
  try {
    if (!u) localStorage.removeItem(LS_USER_KEY);
    else localStorage.setItem(LS_USER_KEY, JSON.stringify(u));
  } catch {
    // ignore quota or JSON errors
  }
}

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(() => (typeof window !== "undefined" ? readUserFromStorage() : null));
//   const [loading, setLoading] = useState<boolean>(true);

//   // Sync user across tabs
//   useEffect(() => {
//     const onStorage = (e: StorageEvent) => {
//       if (e.key === LS_USER_KEY) setUser(readUserFromStorage());
//     };
//     window.addEventListener("storage", onStorage);
//     return () => window.removeEventListener("storage", onStorage);
//   }, []);

//   // Bootstrap: validate httpOnly cookies against /auth/me, try /auth/refresh on 401
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       const finish = (next: User | null) => {
//         if (!mounted) return;
//         setUser(next);
//         writeUserToStorage(next);
//         setLoading(false);
//       };

//       try {
//         const { data } = await api.get("/auth/me");
//         finish(data?.data ?? null);
//       } catch (err: unknown) {
//         try {
//           await api.post("/auth/refresh", {});
//           const { data } = await api.get("/auth/me");
//           finish(data?.data ?? null);
//         } catch {
//           finish(null);
//         }
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const login = useCallback(async (email: string, password: string): Promise<boolean> => {
//     try {
//       const { data } = await api.post("/auth/login", { email, password });
//       const nextUser: User | null = data?.data ?? null;
//       setUser(nextUser);
//       writeUserToStorage(nextUser);
//       return !!nextUser;
//     } catch {
//       setUser(null);
//       writeUserToStorage(null);
//       return false;
//     }
//   }, []);

//   const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
//     try {
//       const { data } = await api.post("/auth/register", { name, email, password });
//       const nextUser: User | null = data?.data ?? null; // your API returns user data on success
//       setUser(nextUser);
//       writeUserToStorage(nextUser);
//       return !!nextUser;
//     } catch {
//       return false;
//     }
//   }, []);

//   const logout = useCallback(async (): Promise<void> => {
//     try {
//       // backend requires authRequired for /auth/logout, so ensure cookies are present
//       await api.post("/auth/logout", {});
//     } catch {
//       // ignore
//     } finally {
//       setUser(null);
//       writeUserToStorage(null);
//     }
//   }, []);

//   const refresh = useCallback(async (): Promise<boolean> => {
//     try {
//       await api.post("/auth/refresh", {});
//       // optionally pull fresh profile
//       const { data } = await api.get("/auth/me");
//       const next: User | null = data?.data ?? null;
//       setUser(next);
//       writeUserToStorage(next);
//       return !!next;
//     } catch {
//       return false;
//     }
//   }, []);

//   // These assume you have separate Users routes
//   const updateProfile = useCallback(async (name: string, email: string): Promise<boolean> => {
//     try {
//       const { data } = await api.put("/profile/update", { name, email });
//       const nextUser: User | null = data?.data ?? null;
//       setUser(nextUser);
//       writeUserToStorage(nextUser);
//       return !!nextUser;
//     } catch {
//       return false;
//     }
//   }, []);

//   const changePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<boolean> => {
//     try {
//       await api.post("/users/me/change-password", { oldPassword, newPassword });
//       return true;
//     } catch {
//       return false;
//     }
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         isAuthenticated: !!user,
//         login,
//         register,
//         logout,
//         refresh,
//         updateProfile,
//         changePassword,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    typeof window !== "undefined" ? readUserFromStorage() : null
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_USER_KEY) setUser(readUserFromStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Bootstrap
  useEffect(() => {
    let mounted = true;
    (async () => {
      const finish = (next: User | null) => {
        if (!mounted) return;
        setUser(next);
        writeUserToStorage(next);
        setLoading(false);
      };

      try {
        const { data } = await api.get("/auth/me");
        finish(data?.data ?? null);
      } catch {
        try {
          await api.post("/auth/refresh", {});
          const { data } = await api.get("/auth/me");
          finish(data?.data ?? null);
        } catch (err: any) {
          toast.error(err?.response?.data?.error || "Session expired");
          finish(null);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const { data } = await api.post("/auth/login", { email, password });
        const nextUser: User | null = data?.data ?? null;
        setUser(nextUser);
        writeUserToStorage(nextUser);
        return !!nextUser;
      } catch (err: any) {
        toast.error(err?.response?.data?.error || "Login failed");
        setUser(null);
        writeUserToStorage(null);
        return false;
      }
    },
    []
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      try {
        const { data } = await api.post("/auth/register", {
          name,
          email,
          password
        });
        const nextUser: User | null = data?.data ?? null;
        setUser(nextUser);
        writeUserToStorage(nextUser);
        return !!nextUser;
      } catch (err: any) {
        toast.error(err?.response?.data?.error || "Registration failed");
        return false;
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.post("/auth/logout", {});
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Logout failed");
    } finally {
      setUser(null);
      writeUserToStorage(null);
    }
  }, []);

  const refresh = useCallback(async (): Promise<boolean> => {
    try {
      await api.post("/auth/refresh", {});
      const { data } = await api.get("/auth/me");
      const next: User | null = data?.data ?? null;
      setUser(next);
      writeUserToStorage(next);
      return !!next;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Refresh failed");
      return false;
    }
  }, []);

  const updateProfile = useCallback(
    async (name: string, email: string): Promise<boolean> => {
      try {
        const { data } = await api.put("/profile/update", { name, email });
        const nextUser: User | null = data?.data ?? null;
        setUser(nextUser);
        writeUserToStorage(nextUser);
        return !!nextUser;
      } catch (err: any) {
        toast.error(err?.response?.data?.error || "Profile update failed");
        return false;
      }
    },
    []
  );

  const changePassword = useCallback(
  async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.put("/profile/change-password", { currentPassword, newPassword });
      // Explicitly check backend response
      if (!response.data?.success) {
        toast.error(response.data?.error || "Password change failed");
        return false;
      }

      return true;
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Password change failed");
      return false;
    }
  },
  []
);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refresh,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
