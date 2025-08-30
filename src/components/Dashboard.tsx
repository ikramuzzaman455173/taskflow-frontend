
import React from 'react';
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
  const { tasks, getTasksByStatus } = useTasks();
  const { user } = useAuth();

  const allTasks = getTasksByStatus('all');
  const pendingTasks = getTasksByStatus('pending');
  const completedTasks = getTasksByStatus('completed');
  const overdueTasks = getTasksByStatus('overdue');

  const completionRate = allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0;

  const stats = [
    {
      title: 'Total Tasks',
      value: allTasks.length,
      icon: CheckSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12%'
    },
    {
      title: 'In Progress',
      value: pendingTasks.length,
      icon: Clock,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: '+8%'
    },
    {
      title: 'Completed',
      value: completedTasks.length,
      icon: Target,
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+23%'
    },
    {
      title: 'Overdue',
      value: overdueTasks.length,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      change: '-5%'
    }
  ];

  const priorityStats = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length
  };

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
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover-glow smooth-transition">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {stat.value}
                    </p>
                    <p className={`text-sm mt-1 flex items-center gap-1 ${
                      stat.change.startsWith('+') ? 'text-success' : 'text-destructive'
                    }`}>
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
                <span className="font-medium">{Math.round(completionRate)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{completedTasks.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">{pendingTasks.length}</p>
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
                <span className="font-medium">{priorityStats.high}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <span className="text-sm">Medium Priority</span>
                </div>
                <span className="font-medium">{priorityStats.medium}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="text-sm">Low Priority</span>
                </div>
                <span className="font-medium">{priorityStats.low}</span>
              </div>
            </div>

            {overdueTasks.length > 0 && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm font-medium text-destructive">
                  ⚠️ {overdueTasks.length} task{overdueTasks.length > 1 ? 's' : ''} overdue
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
            {tasks.slice(0, 5).map((task, index) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                <div className={`w-2 h-2 rounded-full ${
                  task.status === 'completed' ? 'bg-success' : 'bg-secondary'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {task.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full priority-${task.priority}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
