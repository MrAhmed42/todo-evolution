import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: number) => void;
  userId: string;
  pendingOperations: Record<string, boolean>;
  setOperationPending: (operationId: string, isPending: boolean) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdated, onTaskDeleted, userId, pendingOperations, setOperationPending }) => {
  if (tasks.length === 0) {
    return <div className="text-center py-8 text-slate-500">No tasks yet. Add one to get started!</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden">
      <AnimatePresence>
        <motion.ul
          className="divide-y divide-slate-200"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              variants={item}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={{ duration: 0.3 }}
            >
              <TaskItem
                task={task}
                onTaskUpdated={onTaskUpdated}
                onTaskDeleted={onTaskDeleted}
                userId={userId}
                pendingOperations={pendingOperations}
                setOperationPending={setOperationPending}
              />
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
};

export default TaskList;