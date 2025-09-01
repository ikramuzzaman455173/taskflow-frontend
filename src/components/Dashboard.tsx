import React, { useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    tasks,
    summary,
    listTasks,
    fetchSummary,
    loadingList,
    loadingSummary,
    errorList,
    errorSummary,
    getTasksByStatus,
    getOverdueTasks,
  } = useTasks();

  // Load data on mount
  useEffect(() => {
    (async () => {
      await listTasks({ sort: 'createdAt', order: 'desc' });
      await fetchSummary();
    })();
  }, [listTasks, fetchSummary]);

  // Selectors (prefer context-provided ones)
  const pendingTasks = useMemo(
    () => getTasksByStatus('pending'),
    [getTasksByStatus, tasks]
  );

  const completedTasks = useMemo(
    () => getTasksByStatus('completed'),
    [getTasksByStatus, tasks]
  );

  const overdueTasks = useMemo(
    () => getOverdueTasks(),
    [getOverdueTasks, tasks]
  );

  // Numbers (server summary first, fallback to client derivations)
  const total = summary?.total ?? tasks.length;
  const inProgress = summary?.inProgress ?? pendingTasks.length;
  const completedCount = summary?.completed ?? completedTasks.length;
  const overdueCount = summary?.overdue ?? overdueTasks.length;

  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const priorityStats = summary?.byPriority ?? {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  const recentTasks = useMemo(() => {
    const list = summary?.recent ?? tasks;
    return [...list]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [summary?.recent, tasks]);

  const stats = [
    {
      title: 'Total Tasks',
      value: total,
      icon: CheckSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12%',
    },
    {
      title: 'In Progress',
      value: inProgress,
      icon: Clock,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: '+8%',
    },
    {
      title: 'Completed',
      value: completedCount,
      icon: Target,
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+23%',
    },
    {
      title: 'Overdue',
      value: overdueCount,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      change: '-5%',
    },
  ] as const;

  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? '-'
      : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isLoading = loadingList || loadingSummary;
  const errorMsg = errorList ?? errorSummary;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Error banner (if any) */}
      {errorMsg && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 text-destructive p-3 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover-glow smooth-transition">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {isLoading ? '—' : stat.value}
                    </p>
                    <p
                      className={`text-sm mt-1 flex items-center gap-1 ${
                        String(stat.change).startsWith('+') ? 'text-success' : 'text-destructive'
                      }`}
                    >
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress and Priority Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Progress */}
        <Card className="hover-glow smooth-transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Task Completion Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">{isLoading ? '—' : `${completionRate}%`}</span>
              </div>
              <Progress value={isLoading ? 0 : completionRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {isLoading ? '—' : completedCount}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">
                  {isLoading ? '—' : inProgress}
                </p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card className="hover-glow smooth-transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Priority Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <span className="text-sm">High Priority</span>
                </div>
                <span className="font-medium">{isLoading ? '—' : priorityStats.high}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <span className="text-sm">Medium Priority</span>
                </div>
                <span className="font-medium">{isLoading ? '—' : priorityStats.medium}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="text-sm">Low Priority</span>
                </div>
                <span className="font-medium">{isLoading ? '—' : priorityStats.low}</span>
              </div>
            </div>

            {(!isLoading && overdueCount > 0) && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm font-medium text-destructive">
                  ⚠️ {overdueCount} task{overdueCount > 1 ? 's' : ''} overdue
                </p>
                <p className="text-xs text-destructive/80 mt-1">
                  Review and update your deadlines
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card className="hover-glow smooth-transition">
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading && tasks.length === 0 ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : (
              recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.status === 'completed' ? 'bg-success' : 'bg-secondary'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
