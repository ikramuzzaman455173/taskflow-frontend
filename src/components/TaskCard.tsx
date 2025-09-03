import React, { useState, useMemo } from "react";
import {
  Calendar,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  Circle,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TaskItem, useTasks } from "@/contexts/TaskContext";
import LoadingSpinner from "./LoadingSpinner";

interface TaskCardProps {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { removeTask, updateTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const toDate = (value?: string | null) => {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const createdAt = useMemo(() => toDate(task.createdAt), [task.createdAt]);
  const dueAt = useMemo(
    () => toDate(task.dueDate ?? undefined),
    [task.dueDate]
  );
  const completedAt = useMemo(() => toDate((task as any)?.completedAt), [task]);

  const isCompleted = String(task.status) === "completed";
  const isOverdue =
    !!dueAt && !isCompleted && new Date().getTime() > dueAt.getTime();

  // NEW: derive a single status value to drive the status tag
  const status: "completed" | "overdue" | "pending" = useMemo(() => {
    if (isCompleted) return "completed";
    if (isOverdue) return "overdue";
    return "pending";
  }, [isCompleted, isOverdue]);

  const formatDate = (d: Date | null) =>
    d
      ? d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
      : "-";

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await removeTask(task._id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      const next = isCompleted ? "pending" : "completed";
      await updateTask(task._id, { status: next });
    } finally {
      setIsToggling(false);
    }
  };

  const priorityClass = (priority?: string) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
      default:
        return "priority-low";
    }
  };

  // NEW: classes for the status badge (works with shadcn <Badge> by passing className)
  const statusBadgeClass = (s: typeof status) => {
    switch (s) {
      case "completed":
        return "border-emerald-300/50 text-emerald-700 bg-emerald-500/10";
      case "overdue":
        return "border-red-300/50 text-red-700 bg-red-500/10";
      case "pending":
      default:
        return "border-amber-300/50 text-amber-700 bg-amber-500/10";
    }
  };

  const statusLabel = (s: typeof status) =>
    s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <Card
      className={cn(
        "hover-glow smooth-transition cursor-pointer animate-slide-in relative",
        isOverdue && "border-destructive bg-destructive/5",
        isCompleted && "border-green-500 bg-green-500/5",
        status === "pending" && "border-warning bg-warning/5"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStatus}
              disabled={isToggling}
              className="flex-shrink-0 hover:scale-110 transition-transform"
              aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
            >
              {isToggling ? (
                <LoadingSpinner size="sm" />
              ) : isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
              )}
            </button>

            {/* Priority tag */}
            <Badge className={priorityClass(task.priority)}>
              {task.priority}
            </Badge>

            {/* NEW: Status tag (Completed / Pending / Overdue) */}
            <Badge
              variant="outline"
              className={cn(
                "uppercase tracking-wide border px-2 py-0.5 text-[10px]",
                statusBadgeClass(status)
              )}
            >
              {statusLabel(status)}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              className="z-50 bg-background border shadow-md"
            >
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
          <h3
            className={cn(
              "font-semibold text-foreground",
              isCompleted && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Created {formatDate(createdAt)}</span>
              </div>

              {dueAt && (
                <div
                  className={cn(
                    "flex items-center gap-1",
                    isOverdue && "text-destructive font-medium"
                  )}
                >
                  <Clock className="h-3 w-3" />
                  <span>Due {formatDate(dueAt)}</span>
                  {isOverdue && <span className="text-destructive">⚠️</span>}
                </div>
              )}
            </div>

            {isCompleted && completedAt && (
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
