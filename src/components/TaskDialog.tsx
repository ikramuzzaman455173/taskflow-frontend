
// import React, { useState, useEffect } from 'react';
// import { Plus, Calendar } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Task, Priority, useTasks } from '@/contexts/TaskContext';
// import LoadingSpinner from './LoadingSpinner';
// import { toast } from 'react-toastify';

// interface TaskDialogProps {
//   task?: Task | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   trigger?: React.ReactNode;
// }

// export default function TaskDialog({ task, open, onOpenChange, trigger }: TaskDialogProps) {
//   const { addTask, updateTask, loading } = useTasks();

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     priority: 'medium' as Priority,
//     dueDate: '',
//   });

//   useEffect(() => {
//     if (task) {
//       setFormData({
//         title: task.title,
//         description: task.description,
//         priority: task.priority,
//         dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
//       });
//     } else {
//       setFormData({
//         title: '',
//         description: '',
//         priority: 'medium',
//         dueDate: '',
//       });
//     }
//   }, [task, open]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.title.trim()) {
//       toast.error("Task title is required");
//       return;
//     }

//     try {
//       const taskData = {
//         title: formData.title.trim(),
//         description: formData.description.trim(),
//         priority: formData.priority,
//         status: task?.status || 'pending' as const,
//         dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
//       };

//       if (task) {
//         await updateTask(task.id, taskData);
//         toast.success("Your task has been updated successfully.");
//       } else {
//         await addTask(taskData);
//         toast.success("Your new task has been created successfully.");
//       }

//       onOpenChange(false);
//     } catch (error) {
//       toast.error("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

//       <DialogContent className="sm:max-w-[525px] z-50">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             {task ? 'Edit Task' : 'Create New Task'}
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="title">Task Title *</Label>
//             <Input
//               id="title"
//               value={formData.title}
//               onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//               placeholder="Enter task title..."
//               className="w-full"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//               placeholder="Enter task description..."
//               rows={3}
//               className="w-full"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="priority">Priority</Label>
//               <Select
//                 value={formData.priority}
//                 onValueChange={(value: Priority) => setFormData(prev => ({ ...prev, priority: value }))}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent
//                   position="popper"
//                   sideOffset={5}
//                   className="z-[60] bg-popover border shadow-md"
//                 >
//                   <SelectItem value="low">Low Priority</SelectItem>
//                   <SelectItem value="medium">Medium Priority</SelectItem>
//                   <SelectItem value="high">High Priority</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="dueDate">Due Date</Label>
//               <Input
//                 id="dueDate"
//                 type="date"
//                 value={formData.dueDate}
//                 onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
//                 className="w-full"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={loading}
//               className="min-w-[100px]"
//             >
//               {loading ? (
//                 <LoadingSpinner size="sm" />
//               ) : task ? (
//                 'Update Task'
//               ) : (
//                 'Create Task'
//               )}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }


import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskItem, TaskPriority, TaskStatus, useTasks } from '@/contexts/TaskContext';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-toastify';

interface TaskDialogProps {
  task?: TaskItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

type FormState = {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string; // yyyy-mm-dd
};

export default function TaskDialog({ task, open, onOpenChange, trigger }: TaskDialogProps) {
  const { createTask, updateTask } = useTasks();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    if (task) {
      // task.dueDate likely an ISO string or yyyy-mm-dd; normalize to yyyy-mm-dd for input[type=date]
      const dateOnly =
        typeof task.dueDate === 'string' && task.dueDate.length > 0
          ? task.dueDate.split('T')[0]
          : '';
      setFormData({
        title: task.title ?? '',
        description: task.description ?? '',
        priority: (task.priority as TaskPriority) ?? 'medium',
        dueDate: dateOnly,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
      });
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = formData.title.trim();
    if (!title) {
      toast.error('Task title is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Pick<TaskItem, 'title' | 'description' | 'priority' | 'status' | 'dueDate'>> = {
        title,
        description: formData.description.trim(),
        priority: formData.priority,
        status: (task?.status as TaskStatus) || 'pending',
        // Send empty string as undefined to avoid overwriting with empty
        dueDate: formData.dueDate ? formData.dueDate : undefined,
      };

      if (task) {
        const ok = await updateTask(task._id, payload);
        if (ok) {
          toast.success('Your task has been updated successfully.');
          onOpenChange(false);
        } else {
          toast.error('Failed to update task. Please try again.');
        }
      } else {
        const created = await createTask(payload);
        if (created) {
          toast.success('Your new task has been created successfully.');
          onOpenChange(false);
        } else {
          toast.error('Failed to create task. Please try again.');
        }
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[525px] z-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description..."
              rows={3}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={5}
                  className="z-[60] bg-popover border shadow-md"
                >
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="min-w-[120px]">
              {submitting ? <LoadingSpinner size="sm" /> : task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
