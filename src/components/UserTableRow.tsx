
import React from 'react';
import { 
  User,
  Mail,
  Calendar,
  Shield,
  MoreHorizontal,
  Trash2,
  AlertTriangle,
  UserCheck,
  UserX
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  joinDate: string;
  lastActive: string;
  status: 'active' | 'inactive';
  tasksCount: number;
}

interface UserTableRowProps {
  user: MockUser;
  isSelected: boolean;
  isCurrentUser: boolean;
  onSelect: (userId: string, selected: boolean) => void;
  onDelete: (userId: string, userName: string) => void;
  onToggleRole: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
}

export default function UserTableRow({
  user,
  isSelected,
  isCurrentUser,
  onSelect,
  onDelete,
  onToggleRole,
  onToggleStatus
}: UserTableRowProps) {
  const getRoleBadgeColor = (role: 'user' | 'admin') => {
    return role === 'admin' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const getStatusBadgeColor = (status: 'active' | 'inactive') => {
    return status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  return (
    <TableRow key={user.id} className={user.status === 'inactive' ? 'opacity-75' : ''}>
      <TableCell className="w-12">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(user.id, checked as boolean)}
          disabled={isCurrentUser}
          aria-label={`Select ${user.name}`}
        />
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            user.status === 'active' ? 'bg-primary/10' : 'bg-muted'
          }`}>
            <User className={`h-4 w-4 ${user.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </div>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <Badge 
          variant="secondary" 
          className={getRoleBadgeColor(user.role)}
        >
          {user.role === 'admin' ? (
            <>
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </>
          ) : (
            <>
              <User className="h-3 w-3 mr-1" />
              User
            </>
          )}
        </Badge>
      </TableCell>
      
      <TableCell>
        <Badge 
          variant="secondary"
          className={getStatusBadgeColor(user.status)}
        >
          {user.status === 'active' ? (
            <>
              <UserCheck className="h-3 w-3 mr-1" />
              Active
            </>
          ) : (
            <>
              <UserX className="h-3 w-3 mr-1" />
              Inactive
            </>
          )}
        </Badge>
      </TableCell>
      
      <TableCell>
        <div className="text-sm">
          {user.tasksCount} tasks
        </div>
      </TableCell>
      
      <TableCell>
        <div className="text-sm flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          {new Date(user.joinDate).toLocaleDateString()}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="text-sm text-muted-foreground">
          {new Date(user.lastActive).toLocaleDateString()}
        </div>
      </TableCell>
      
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48 z-50 bg-popover border shadow-md"
            sideOffset={5}
          >
            <DropdownMenuItem 
              onClick={() => onToggleRole(user.id)}
              disabled={isCurrentUser}
            >
              <Shield className="h-4 w-4 mr-2" />
              Make {user.role === 'admin' ? 'User' : 'Admin'}
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => onToggleStatus(user.id)}
              disabled={isCurrentUser}
            >
              {user.status === 'active' ? (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Deactivate User
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Activate User
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                  disabled={isCurrentUser}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent className="z-[60]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Delete User
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <strong>{user.name}</strong>? 
                    This action cannot be undone and will permanently remove all their data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(user.id, user.name)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete User
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
