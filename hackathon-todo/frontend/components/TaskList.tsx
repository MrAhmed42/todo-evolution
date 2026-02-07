'use client';

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

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onTaskUpdated, 
  onTaskDeleted, 
  userId, 
  pendingOperations, 
  setOperationPending 
}) => {
  return (
    <div className="w-full mt-8">
      {/* THIS IS THE ONLY HEADER. 
          If you see another "My Todo List" above this, 
          you must delete it from your page.tsx file.
      */}
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center">
          My Todo List
        </h2>
        <div className="w-16 h-1.5 bg-emerald-500 rounded-full mt-2" />
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500 shadow-sm">
          <p className="text-lg font-medium">No tasks yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="bg-transparent space-y-4">
          <AnimatePresence mode="popLayout">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-3"
            >
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={item}
                  layout
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskItem
                    task={task}
                    onTaskUpdated={onTaskUpdated}
                    onTaskDeleted={onTaskDeleted}
                    userId={userId}
                    pendingOperations={pendingOperations}
                    setOperationPending={setOperationPending}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TaskList;