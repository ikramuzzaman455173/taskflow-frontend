import React, { createContext, useContext, useState, useEffect } from 'react';

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteAllTasks: () => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  getTasksByStatus: (status: TaskStatus | 'all' | 'overdue') => Task[];
}

const TaskContext = createContext<TaskContextType | null>(null);

// Demo tasks
const DEMO_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design Homepage',
    description: 'Create wireframes and mockups for the new homepage design',
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2024-08-15'),
    dueDate: new Date('2024-08-20')
  },
  {
    id: '2',
    title: 'Setup Database',
    description: 'Configure PostgreSQL database with proper schemas',
    priority: 'medium',
    status: 'completed',
    createdAt: new Date('2024-08-10'),
    completedAt: new Date('2024-08-12')
  },
  {
    id: '3',
    title: 'Code Review',
    description: 'Review pull requests from team members',
    priority: 'low',
    status: 'pending',
    createdAt: new Date('2024-08-14'),
    dueDate: new Date('2024-08-16')
  },
  {
    id: '4',
    title: 'Client Meeting',
    description: 'Discuss project requirements with stakeholders',
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2024-08-12'),
    dueDate: new Date('2024-08-18')
  }
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('taskManager_tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
      setTasks(parsedTasks);
    } else {
      setTasks(DEMO_TASKS);
      localStorage.setItem('taskManager_tasks', JSON.stringify(DEMO_TASKS));
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    localStorage.setItem('taskManager_tasks', JSON.stringify(newTasks));
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setLoading(false);
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setLoading(false);
  };

  const deleteTask = async (id: string): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setLoading(false);
  };

  const deleteAllTasks = async (): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTasks([]);
    localStorage.removeItem('taskManager_tasks');
    setLoading(false);
  };

  const toggleTaskStatus = async (id: string): Promise<void> => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updates: Partial<Task> = {
      status: task.status === 'pending' ? 'completed' : 'pending',
      completedAt: task.status === 'pending' ? new Date() : undefined
    };

    await updateTask(id, updates);
  };

  const getTasksByStatus = (status: TaskStatus | 'all' | 'overdue'): Task[] => {
    if (status === 'all') return tasks;
    if (status === 'overdue') {
      const now = new Date();
      return tasks.filter(task => 
        task.status === 'pending' && 
        task.dueDate && 
        task.dueDate < now
      );
    }
    return tasks.filter(task => task.status === status);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      addTask,
      updateTask,
      deleteTask,
      deleteAllTasks,
      toggleTaskStatus,
      getTasksByStatus
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
