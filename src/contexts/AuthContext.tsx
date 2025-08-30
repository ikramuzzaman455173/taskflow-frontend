
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (name: string, email: string) => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo credentials
const DEMO_USER = {
  id: '1',
  name: 'Md. Ikramuzzaman',
  email: 'jakaria455173@gmail.com',
  password: 'demo123',
  role: 'user' as const
};

const ADMIN_USER = {
  id: 'admin1',
  name: 'Admin User',
  email: 'admin@taskflow.com',
  password: 'admin123',
  role: 'admin' as const
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('taskManager_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const userData = { id: DEMO_USER.id, name: DEMO_USER.name, email: DEMO_USER.email, role: DEMO_USER.role };
      setUser(userData);
      localStorage.setItem('taskManager_user', JSON.stringify(userData));
      return true;
    }
    
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      const userData = { id: ADMIN_USER.id, name: ADMIN_USER.name, email: ADMIN_USER.email, role: ADMIN_USER.role };
      setUser(userData);
      localStorage.setItem('taskManager_user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = { id: Date.now().toString(), name, email, role: 'user' as const };
    setUser(userData);
    localStorage.setItem('taskManager_user', JSON.stringify(userData));
    localStorage.setItem('taskManager_password', password);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskManager_user');
  };

  const updateProfile = (name: string, email: string) => {
    if (user) {
      const updatedUser = { ...user, name, email };
      setUser(updatedUser);
      localStorage.setItem('taskManager_user', JSON.stringify(updatedUser));
    }
  };

  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    const savedPassword = localStorage.getItem('taskManager_password') || 
      (user?.email === DEMO_USER.email ? DEMO_USER.password : ADMIN_USER.password);
    if (oldPassword === savedPassword) {
      localStorage.setItem('taskManager_password', newPassword);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
