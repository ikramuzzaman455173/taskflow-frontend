
// import React, { createContext, useContext, useState, useEffect } from 'react';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'user' | 'admin';
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   register: (name: string, email: string, password: string) => Promise<boolean>;
//   updateProfile: (name: string, email: string) => void;
//   changePassword: (oldPassword: string, newPassword: string) => boolean;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// // Demo credentials
// const DEMO_USER = {
//   id: '1',
//   name: 'Md. Ikramuzzaman',
//   email: 'jakaria455173@gmail.com',
//   password: 'demo123',
//   role: 'user' as const
// };

// const ADMIN_USER = {
//   id: 'admin1',
//   name: 'Admin User',
//   email: 'admin@taskflow.com',
//   password: 'admin123',
//   role: 'admin' as const
// };

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const savedUser = localStorage.getItem('taskManager_user');
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     if (email === DEMO_USER.email && password === DEMO_USER.password) {
//       const userData = { id: DEMO_USER.id, name: DEMO_USER.name, email: DEMO_USER.email, role: DEMO_USER.role };
//       setUser(userData);
//       localStorage.setItem('taskManager_user', JSON.stringify(userData));
//       return true;
//     }

//     if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
//       const userData = { id: ADMIN_USER.id, name: ADMIN_USER.name, email: ADMIN_USER.email, role: ADMIN_USER.role };
//       setUser(userData);
//       localStorage.setItem('taskManager_user', JSON.stringify(userData));
//       return true;
//     }

//     return false;
//   };

//   const register = async (name: string, email: string, password: string): Promise<boolean> => {
//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     const userData = { id: Date.now().toString(), name, email, role: 'user' as const };
//     setUser(userData);
//     localStorage.setItem('taskManager_user', JSON.stringify(userData));
//     localStorage.setItem('taskManager_password', password);
//     return true;
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('taskManager_user');
//   };

//   const updateProfile = (name: string, email: string) => {
//     if (user) {
//       const updatedUser = { ...user, name, email };
//       setUser(updatedUser);
//       localStorage.setItem('taskManager_user', JSON.stringify(updatedUser));
//     }
//   };

//   const changePassword = (oldPassword: string, newPassword: string): boolean => {
//     const savedPassword = localStorage.getItem('taskManager_password') ||
//       (user?.email === DEMO_USER.email ? DEMO_USER.password : ADMIN_USER.password);
//     if (oldPassword === savedPassword) {
//       localStorage.setItem('taskManager_password', newPassword);
//       return true;
//     }
//     return false;
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       login,
//       logout,
//       register,
//       updateProfile,
//       changePassword
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



// src/contexts/AuthContext.tsx
import api from "@/lib/api";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  // optional: token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ——— localStorage helpers ———
const LS_USER_KEY = "auth_user";

function readUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage (synchronous)
  const [user, setUser] = useState<User | null>(() => readUserFromStorage());
  // Since we initialize synchronously from storage, loading can be false by default.
  // Turn it on only if you also call /api/auth/me to validate the session.
  const [loading, setLoading] = useState(false);

  // Sync across tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_USER_KEY) {
        setUser(readUserFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // If you want to validate/refresh the session on boot, uncomment this block.
  // It will briefly set loading=true and reconcile the stored user with the server.
  /*
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/api/auth/me");
        const nextUser: User | null = data?.user ?? null;
        if (mounted) {
          setUser(nextUser);
          writeUserToStorage(nextUser);
        }
      } catch {
        if (mounted) {
          setUser(null);
          writeUserToStorage(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  */

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      // Adjust these two lines to match your API payload shape
      const nextUser: User | null = data?.data ?? data?.user ?? null;
      setUser(nextUser);
      writeUserToStorage(nextUser);
      return !!nextUser;
    } catch {
      setUser(null);
      writeUserToStorage(null);
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });
      // Some APIs auto-login and return the created user; otherwise call login() after.
      const nextUser: User | null = data?.user ?? data?.data ?? null;
      setUser(nextUser);
      writeUserToStorage(nextUser);
      return !!nextUser;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore errors
    } finally {
      setUser(null);
      writeUserToStorage(null);
    }
  }, []);

  const updateProfile = useCallback(async (name: string, email: string): Promise<boolean> => {
    try {
      const { data } = await api.patch("/api/users/me", { name, email });
      const nextUser: User | null = data?.user ?? data?.data ?? null;
      setUser(nextUser);
      writeUserToStorage(nextUser);
      return !!nextUser;
    } catch {
      return false;
    }
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await api.post("/api/users/me/change-password", { oldPassword, newPassword });
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
        changePassword,
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
