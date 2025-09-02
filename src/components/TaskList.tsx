import React, { useState, useMemo, useEffect } from 'react';
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
import { TaskItem, TaskStatus, TaskPriority, useTasks } from '@/contexts/TaskContext';
import TaskCard from './TaskCard';
import TaskDialog from './TaskDialog';
import BulkDeleteDialog from './BulkDeleteDialog';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

interface TaskListProps {
  status: TaskStatus | 'all' | 'overdue';
  title: string;
}

type SortKey = 'createdAt' | 'title' | 'priority' | 'dueDate';

export default function TaskList({ status, title }: TaskListProps) {
  const { getTasksByStatus, removeAll } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('createdAt');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState(6);

  // base tasks from selector
  const baseTasks = getTasksByStatus(status);

  // helpers
  const ts = (iso?: string | null): number => {
    if (!iso) return 0;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
  };

  // derived + filtered + sorted tasks
  const tasks = useMemo(() => {
    let list = [...baseTasks];

    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => {
        const title = (t.title ?? '').toLowerCase();
        const desc = (t.description ?? '').toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    }

    // priority filter
    if (filterPriority !== 'all') {
      list = list.filter((t) => t.priority === filterPriority);
    }

    // sort
    const priorityOrder: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };
    list.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title ?? '').localeCompare(b.title ?? '');
        case 'priority':
          return (priorityOrder[b.priority] ?? 0) - (priorityOrder[a.priority] ?? 0);
        case 'dueDate': {
          const at = ts(a.dueDate ?? undefined);
          const bt = ts(b.dueDate ?? undefined);
          // push undated to bottom
          if (at === 0 && bt === 0) return 0;
          if (at === 0) return 1;
          if (bt === 0) return -1;
          return at - bt; // earliest first
        }
        case 'createdAt':
        default: {
          const at = ts(a.createdAt);
          const bt = ts(b.createdAt);
          return bt - at; // newest first
        }
      }
    });

    return list;
  }, [baseTasks, searchQuery, filterPriority, sortBy]);

  const displayedTasks = tasks.slice(0, visibleTasks);
  const hasMoreTasks = tasks.length > visibleTasks;

  const handleEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handlePriorityChange = (value: string) => {
    setFilterPriority(value as TaskPriority | 'all');
  };

  const handleBulkDelete = async () => {
    const ok = await removeAll();
    if (ok) {
      toast.success('All tasks have been deleted successfully');
    } else {
      toast.error('Failed to delete all tasks. Please try again.');
    }
  };

  const handleLoadMore = () => setVisibleTasks((prev) => prev + 6);
  const resetVisibleTasks = () => setVisibleTasks(6);

  // Reset visible count when filters/sort/search change
  useEffect(() => {
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

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
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
                key={task._id}
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
              <Button onClick={handleLoadMore} variant="outline" className="gap-2" size="lg">
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
              : 'Get started by creating your first task'}
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
      <TaskDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

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
