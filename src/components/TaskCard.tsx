
import React, { useState } from 'react';
import { 
  Calendar, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Circle,
  Star,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Task, useTasks } from '@/contexts/TaskContext';
import LoadingSpinner from './LoadingSpinner';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { deleteTask, toggleTaskStatus, loading } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const isOverdue = task.dueDate && task.status === 'pending' && new Date() > task.dueDate;

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTask(task.id);
    setIsDeleting(false);
  };

  const handleToggleStatus = async () => {
    setIsToggling(true);
    await toggleTaskStatus(task.id);
    setIsToggling(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-low';
    }
  };

  return (
    <Card className={cn(
      'hover-glow smooth-transition cursor-pointer animate-slide-in relative',
      isOverdue && 'border-destructive bg-destructive/5',
      task.status === 'completed' && 'opacity-75'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStatus}
              disabled={isToggling}
              className="flex-shrink-0 hover:scale-110 transition-transform"
            >
              {isToggling ? (
                <LoadingSpinner size="sm" />
              ) : task.status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
              )}
            </button>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="z-50 bg-background border shadow-md">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <h3 className={cn(
            'font-semibold text-foreground',
            task.status === 'completed' && 'line-through text-muted-foreground'
          )}>
            {task.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Created {task.createdAt.toLocaleDateString()}</span>
              </div>
              
              {task.dueDate && (
                <div className={cn(
                  'flex items-center gap-1',
                  isOverdue && 'text-destructive font-medium'
                )}>
                  <Clock className="h-3 w-3" />
                  <span>Due {task.dueDate.toLocaleDateString()}</span>
                  {isOverdue && <span className="text-destructive">⚠️</span>}
                </div>
              )}
            </div>

            {task.status === 'completed' && task.completedAt && (
              <div className="flex items-center gap-1 text-xs text-success">
                <CheckCircle2 className="h-3 w-3" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
