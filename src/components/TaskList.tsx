
import React, { useState } from 'react';
import { Plus, Search, Filter, SortAsc, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task, TaskStatus, Priority, useTasks } from '@/contexts/TaskContext';
import TaskCard from './TaskCard';
import TaskDialog from './TaskDialog';
import BulkDeleteDialog from './BulkDeleteDialog';
import { toast } from 'react-toastify';

interface TaskListProps {
  status: TaskStatus | 'all' | 'overdue';
  title: string;
}

export default function TaskList({ status, title }: TaskListProps) {
  const { getTasksByStatus, deleteAllTasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState(6);

  let tasks = getTasksByStatus(status);

  // Filter by search query
  if (searchQuery) {
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter by priority
  if (filterPriority !== 'all') {
    tasks = tasks.filter(task => task.priority === filterPriority);
  }

  // Sort tasks
  tasks = [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      case 'createdAt':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const displayedTasks = tasks.slice(0, visibleTasks);
  const hasMoreTasks = tasks.length > visibleTasks;

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handlePriorityChange = (value: string) => {
    setFilterPriority(value as Priority | 'all');
  };

  const handleBulkDelete = async () => {
    await deleteAllTasks();
    toast.success('All tasks have been deleted successfully');
  };

  const handleLoadMore = () => {
    setVisibleTasks(prev => prev + 6);
  };

  const resetVisibleTasks = () => {
    setVisibleTasks(6);
  };

  // Reset visible tasks when filters change
  React.useEffect(() => {
    resetVisibleTasks();
  }, [searchQuery, filterPriority, sortBy]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex gap-2">
          {tasks.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setIsBulkDeleteOpen(true)}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete All Tasks
            </Button>
          )}
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2 gradient-bg hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add New Task
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterPriority} onValueChange={handlePriorityChange}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task Grid */}
      {displayedTasks.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTasks.map((task, index) => (
              <div
                key={task.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-slide-in"
              >
                <TaskCard task={task} onEdit={handleEditTask} />
              </div>
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMoreTasks && (
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="gap-2"
                size="lg"
              >
                <Plus className="h-4 w-4" />
                Load More Tasks ({tasks.length - visibleTasks} remaining)
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-bg-soft flex items-center justify-center">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterPriority !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first task'
            }
          </p>
          {!searchQuery && filterPriority === 'all' && (
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gradient-bg">
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          )}
        </div>
      )}

      {/* Dialogs */}
      <TaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <TaskDialog
        task={editingTask}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
      />

      <BulkDeleteDialog
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        title="Delete All Tasks"
        description="This will permanently delete all your tasks. This action cannot be undone."
        confirmationText="Yes Delete My All Task"
        onConfirm={handleBulkDelete}
        itemCount={tasks.length}
      />
    </div>
  );
}
