// import React, { useState } from 'react';
// import {
//   Users,
//   CheckSquare,
//   BarChart3,
//   Settings,
//   Calendar,
//   TrendingUp,
//   Activity,
//   Clock,
//   UserCog
// } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useTasks } from '@/contexts/TaskContext';
// import UserManagement from './UserManagement';

// export default function AdminDashboard() {
//   const { tasks, getTasksByStatus } = useTasks();
//   const [activeTab, setActiveTab] = useState('overview');

//   const allTasks = getTasksByStatus('all');
//   const pendingTasks = getTasksByStatus('pending');
//   const completedTasks = getTasksByStatus('completed');
//   const overdueTasks = getTasksByStatus('overdue');

//   const userStats = {
//     totalUsers: 5, // Mock data
//     activeUsers: 3,
//     newUsersThisMonth: 2
//   };

//   const completionRate = allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0;

//   const adminStats = [
//     {
//       title: 'Total Users',
//       value: userStats.totalUsers,
//       icon: Users,
//       color: 'text-primary',
//       bgColor: 'bg-primary/10',
//       change: '+12%'
//     },
//     {
//       title: 'Active Users',
//       value: userStats.activeUsers,
//       icon: Activity,
//       color: 'text-success',
//       bgColor: 'bg-success/10',
//       change: '+8%'
//     },
//     {
//       title: 'Total Tasks',
//       value: allTasks.length,
//       icon: CheckSquare,
//       color: 'text-secondary',
//       bgColor: 'bg-secondary/10',
//       change: '+23%'
//     },
//     {
//       title: 'Completion Rate',
//       value: `${Math.round(completionRate)}%`,
//       icon: TrendingUp,
//       color: 'text-warning',
//       bgColor: 'bg-warning/10',
//       change: '+15%'
//     }
//   ];

//   const taskStatusData = [
//     { status: 'Completed', count: completedTasks.length, color: 'bg-success' },
//     { status: 'Pending', count: pendingTasks.length, color: 'bg-secondary' },
//     { status: 'Overdue', count: overdueTasks.length, color: 'bg-destructive' }
//   ];

//   return (
//     <div className="space-y-6 animate-fade-in-up">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
//           <p className="text-muted-foreground mt-1">
//             Monitor and manage your TaskFlow application
//           </p>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//           <Calendar className="h-4 w-4" />
//           <span>{new Date().toLocaleDateString('en-US', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//           })}</span>
//         </div>
//       </div>

//       {/* Admin Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="overview" className="flex items-center gap-2">
//             <BarChart3 className="h-4 w-4" />
//             Overview
//           </TabsTrigger>
//           <TabsTrigger value="users" className="flex items-center gap-2">
//             <UserCog className="h-4 w-4" />
//             User Management
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-6 mt-6">
//           {/* Admin Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {adminStats.map((stat) => {
//               const Icon = stat.icon;
//               return (
//                 <Card key={stat.title} className="hover-glow smooth-transition">
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground">
//                           {stat.title}
//                         </p>
//                         <p className="text-3xl font-bold text-foreground mt-2">
//                           {stat.value}
//                         </p>
//                         <p className="text-sm mt-1 flex items-center gap-1 text-success">
//                           <TrendingUp className="h-3 w-3" />
//                           {stat.change}
//                         </p>
//                       </div>
//                       <div className={`${stat.bgColor} p-3 rounded-lg`}>
//                         <Icon className={`h-6 w-6 ${stat.color}`} />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>

//           {/* Charts and Analytics */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Task Status Overview */}
//             <Card className="hover-glow smooth-transition">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <BarChart3 className="h-5 w-5 text-primary" />
//                   Task Status Overview
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {taskStatusData.map((item) => (
//                   <div key={item.status} className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span>{item.status}</span>
//                       <span className="font-medium">{item.count}</span>
//                     </div>
//                     <div className="w-full bg-muted rounded-full h-2">
//                       <div
//                         className={`h-2 rounded-full ${item.color}`}
//                         style={{
//                           width: `${allTasks.length > 0 ? (item.count / allTasks.length) * 100 : 0}%`
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             {/* System Health */}
//             <Card className="hover-glow smooth-transition">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Settings className="h-5 w-5 text-success" />
//                   System Health
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Server Status</span>
//                     <span className="text-success font-medium">Online</span>
//                   </div>
//                   <Progress value={98} className="h-2" />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Database</span>
//                     <span className="text-success font-medium">Healthy</span>
//                   </div>
//                   <Progress value={95} className="h-2" />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Response Time</span>
//                     <span className="text-success font-medium">120ms</span>
//                   </div>
//                   <Progress value={88} className="h-2" />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Recent Activity */}
//           <Card className="hover-glow smooth-transition">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-secondary" />
//                 Recent Activity
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
//                   <div className="w-2 h-2 rounded-full bg-success"></div>
//                   <div className="flex-1">
//                     <p className="font-medium text-sm">New user registered</p>
//                     <p className="text-xs text-muted-foreground">2 hours ago</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
//                   <div className="w-2 h-2 rounded-full bg-primary"></div>
//                   <div className="flex-1">
//                     <p className="font-medium text-sm">Task completed by John Doe</p>
//                     <p className="text-xs text-muted-foreground">4 hours ago</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
//                   <div className="w-2 h-2 rounded-full bg-warning"></div>
//                   <div className="flex-1">
//                     <p className="font-medium text-sm">System backup completed</p>
//                     <p className="text-xs text-muted-foreground">6 hours ago</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="users" className="mt-6">
//           <UserManagement />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  CheckSquare,
  BarChart3,
  Settings,
  Calendar,
  TrendingUp,
  Activity as ActivityIcon,
  Clock,
  UserCog,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "./UserManagement";
import { useDashboard } from "@/contexts/DashboardContext";

export default function AdminDashboard() {
  const { isAdmin, adminData, loadingAdmin, errorAdmin, fetchAdminDashboard } =
    useDashboard();

  const [activeTab, setActiveTab] = useState("overview");

  // Fetch once on mount
  useEffect(() => {
    fetchAdminDashboard();
  }, [fetchAdminDashboard]);

  // Safe getters
  const metrics = adminData?.metrics;
  const status = adminData?.statusOverview;
  const health = adminData?.systemHealth;

  const totalTasks = metrics?.totalTasks ?? 0;
  const completed = status?.completed ?? 0;
  const pending = status?.pending ?? 0;
  const overdue = status?.overdue ?? 0;
  const completionRate = Math.round(metrics?.completionRate ?? 0);

  const adminStats = useMemo(
    () => [
      {
        title: "Total Users",
        value: metrics?.totalUsers ?? 0,
        icon: Users,
        color: "text-primary",
        bgColor: "bg-primary/10"
      },
      {
        title: "Active Users",
        value: metrics?.activeUsers ?? 0,
        icon: ActivityIcon,
        color: "text-success",
        bgColor: "bg-success/10"
      },
      {
        title: "Total Tasks",
        value: totalTasks,
        icon: CheckSquare,
        color: "text-secondary",
        bgColor: "bg-secondary/10"
      },
      {
        title: "Completion Rate",
        value: `${completionRate}%`,
        icon: TrendingUp,
        color: "text-warning",
        bgColor: "bg-warning/10"
      }
    ],
    [metrics, totalTasks, completionRate]
  );

  const taskStatusData = useMemo(
    () => [
      { status: "Completed", count: completed, color: "bg-success" },
      { status: "Pending", count: pending, color: "bg-secondary" },
      { status: "Overdue", count: overdue, color: "bg-destructive" }
    ],
    [completed, pending, overdue]
  );

  const pct = (num: number, den: number) =>
    den > 0 ? Math.max(0, Math.min(100, (num / den) * 100)) : 0;

  // Health → progress mapping
  const serverPct =
    (health?.serverStatus || "").toLowerCase() === "online" ? 100 : 10;
  const dbPct = (health?.database || "").toLowerCase() === "healthy" ? 100 : 10;
  // 0–1000ms → 100–0%
  const responseTimePct = (() => {
    const ms =
      typeof health?.responseTimeMs === "number" ? health.responseTimeMs : 0;
    return Math.max(0, Math.min(100, 100 - ms / 10));
  })();

  // Guard: only admins
  if (!isAdmin) {
    return (
      <div className="space-y-2 p-4 border rounded-lg bg-muted/40">
        <p className="font-medium">Admins only</p>
        <p className="text-sm text-muted-foreground">
          You don’t have permission to view the admin dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your TaskFlow application
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAdminDashboard}
            disabled={loadingAdmin}
            aria-label="Refresh admin dashboard"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loadingAdmin ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error */}
      {errorAdmin && (
        <Card className="border-destructive/50">
          <CardContent className="p-4">
            <p className="text-destructive text-sm">{errorAdmin}</p>
          </CardContent>
        </Card>
      )}

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            User Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Loading skeleton */}
          {loadingAdmin ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="hover-glow smooth-transition">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-3 w-24 bg-muted rounded" />
                        <div className="h-7 w-20 bg-muted rounded" />
                        <div className="h-3 w-16 bg-muted rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="h-28 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="h-28 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="h-28 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* Admin Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={stat.title}
                      className="hover-glow smooth-transition"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {stat.title}
                            </p>
                            <p className="text-3xl font-bold text-foreground mt-2">
                              {stat.value}
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

              {/* Charts and Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Status Overview */}
                <Card className="hover-glow smooth-transition">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Task Status Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {taskStatusData.map((item) => (
                      <div key={item.status} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.status}</span>
                          <span className="font-medium">
                            {item.count}{" "}
                            <span className="text-muted-foreground">
                              ({Math.round(pct(item.count, totalTasks))}%)
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${pct(item.count, totalTasks)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card className="hover-glow smooth-transition">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-success" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Server Status</span>
                        <span
                          className={`${
                            serverPct === 100
                              ? "text-success"
                              : "text-destructive"
                          } font-medium`}
                        >
                          {health?.serverStatus ?? "Unknown"}
                        </span>
                      </div>
                      <Progress value={serverPct} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Database</span>
                        <span
                          className={`${
                            dbPct === 100 ? "text-success" : "text-destructive"
                          } font-medium`}
                        >
                          {health?.database ?? "Unknown"}
                        </span>
                      </div>
                      <Progress value={dbPct} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Response Time</span>
                        <span className="font-medium">
                          {typeof health?.responseTimeMs === "number"
                            ? `${health.responseTimeMs}ms`
                            : "—"}
                        </span>
                      </div>
                      <Progress value={responseTimePct} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              {/* <Card className="hover-glow smooth-transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-secondary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {adminData?.recentActivity?.length ? (
                    <div className="space-y-3">
                      {adminData.recentActivity.map((item) => {
                        const dot =
                          item.type === "error"
                            ? "bg-destructive"
                            : item.type === "warning"
                            ? "bg-warning"
                            : "bg-success";
                        return (
                          <div
                            key={item._id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border"
                          >
                            <div className={`w-2 h-2 rounded-full ${dot}`} />
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {item.message || item.type}
                                {item.user ? (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    — {item.user}
                                  </span>
                                ) : null}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleString()
                                  : "—"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent activity.
                    </p>
                  )}
                </CardContent>
              </Card> */}

              <Card className="hover-glow smooth-transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-secondary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {adminData?.recentActivity?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {adminData.recentActivity.map((item) => {
                        const dot =
                          item.type === "error"
                            ? "bg-destructive"
                            : item.type === "warning"
                            ? "bg-warning"
                            : "bg-success";
                        return (
                          <div
                            key={item._id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border"
                          >
                            <div className={`w-2 h-2 rounded-full ${dot}`} />
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {item.message || item.type}
                                {item.user ? (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    — {item.user}
                                  </span>
                                ) : null}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleString()
                                  : "—"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent activity.
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          {/* If UserManagement already consumes useDashboard() internally, just render it. */}
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
