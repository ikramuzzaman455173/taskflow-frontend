
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Settings, 
  User,
  Moon,
  Sun,
  LogOut,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import LogoutConfirmDialog from './LogoutConfirmDialog';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { getTasksByStatus } = useTasks();
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  const menuItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      count: getTasksByStatus('all').length,
    },
    ...(user?.role === 'admin' ? [{
      id: 'admin',
      icon: Shield,
      label: 'Admin Dashboard',
      count: 0,
    }] : []),
    {
      id: 'all',
      icon: CheckSquare,
      label: 'All Tasks',
      count: getTasksByStatus('all').length,
    },
    {
      id: 'pending',
      icon: Clock,
      label: 'Pending',
      count: getTasksByStatus('pending').length,
    },
    {
      id: 'completed',
      icon: CheckSquare,
      label: 'Completed',
      count: getTasksByStatus('completed').length,
    },
    {
      id: 'overdue',
      icon: AlertTriangle,
      label: 'Overdue',
      count: getTasksByStatus('overdue').length,
    }
  ];

  return (
    <div className="h-full w-full bg-sidebar border-r-2 border-sidebar-border flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b-2 border-sidebar-border flex-shrink-0 bg-gradient-to-r from-sidebar-background to-sidebar-background/95">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-md border border-primary/20">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">TaskFlow</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b-2 border-sidebar-border flex-shrink-0 bg-gradient-to-r from-sidebar-background to-sidebar-background/98">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user?.role === 'admin' ? 'Administrator' : 'User'}
            </p>
          </div>
          {user?.role === 'admin' && (
            <Shield className="h-4 w-4 text-warning" />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={item.label}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2',
                isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md border-sidebar-primary/30 scale-[1.02]' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-transparent hover:border-sidebar-border hover:shadow-sm hover:scale-[1.01]'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className={cn(
                  'text-xs px-2.5 py-1 rounded-full font-semibold border',
                  isActive 
                    ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground border-sidebar-primary-foreground/30' 
                    : 'bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border'
                )}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t-2 border-sidebar-border space-y-2 flex-shrink-0 bg-gradient-to-r from-sidebar-background to-sidebar-background/95">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 border-2 border-transparent hover:border-sidebar-border hover:shadow-sm"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        
        {/* Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2',
            activeTab === 'profile'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary/30 shadow-md'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-transparent hover:border-sidebar-border hover:shadow-sm'
          )}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </button>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 border-2 border-transparent hover:border-destructive/20 hover:shadow-sm"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />
    </div>
  );
}
