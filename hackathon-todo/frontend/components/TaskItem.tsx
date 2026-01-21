'use client';

import React, { useState } from 'react';
import { ApiClient } from '../lib/api';
import type { Task } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: number) => void;
  userId: string;
  pendingOperations: Record<string, boolean>;
  setOperationPending: (operationId: string, isPending: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated, onTaskDeleted, userId, pendingOperations, setOperationPending }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);

  const toggleOperationId = `toggle-${task.id}`;
  const deleteOperationId = `delete-${task.id}`;
  const saveOperationId = `save-${task.id}`;

  const handleToggleComplete = async () => {
    const operationId = toggleOperationId;
    setOperationPending(operationId, true);

    try {
      const apiClient = new ApiClient();
      const updatedTask = await apiClient.toggleTask(userId, task.id);
      onTaskUpdated(updatedTask);
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    } finally {
      setOperationPending(operationId, false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      const operationId = deleteOperationId;
      setOperationPending(operationId, true);

      try {
        const apiClient = new ApiClient();
        await apiClient.deleteTask(userId, task.id);
        onTaskDeleted(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setOperationPending(operationId, false);
      }
    }
  };

  const handleSave = async () => {
    const operationId = saveOperationId;
    setOperationPending(operationId, true);

    try {
      const apiClient = new ApiClient();
      const updatedTask = await apiClient.updateTask(userId, task.id, {
        title,
        description,
      });
      onTaskUpdated(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setOperationPending(operationId, false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setIsEditing(false);
  };

  return (
    <li className="bg-white hover:bg-slate-50 transition-colors duration-200">
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        {isEditing ? (
          <div className="mb-4 p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl">
            <div className="mb-2 sm:mb-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full p-2.5 sm:p-3 border border-slate-300 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-sm transition-colors duration-200 min-h-[44px]"
                disabled={pendingOperations[saveOperationId]}
              />
            </div>
            <div className="mb-2 sm:mb-3">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="block w-full p-2.5 sm:p-3 border border-slate-300 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-sm transition-colors duration-200 min-h-[60px]"
                disabled={pendingOperations[saveOperationId]}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <button
                onClick={handleSave}
                disabled={pendingOperations[saveOperationId]}
                className="inline-flex items-center justify-center w-full sm:w-20 h-10 sm:h-8 border border-transparent text-sm font-medium rounded-lg sm:rounded-xl shadow-sm text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors duration-200 min-h-[40px]"
              >
                {pendingOperations[saveOperationId] ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-1.5">Saving</span>
                  </>
                ) : (
                  'Save'
                )}
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center justify-center w-full sm:w-20 h-10 sm:h-8 border border-slate-300 text-sm font-medium rounded-lg sm:rounded-xl shadow-sm text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 min-h-[40px]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-start sm:items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleComplete}
                className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 mt-0.5 sm:mt-0"
                disabled={pendingOperations[toggleOperationId]}
              />
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className={`text-base font-medium break-words ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className={`text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-500'} mt-1 break-words`}>
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-row sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <button
                onClick={() => setIsEditing(true)}
                disabled={pendingOperations[saveOperationId]}
                className="inline-flex items-center justify-center w-full sm:w-20 h-10 sm:h-8 border border-transparent text-sm font-medium rounded-lg sm:rounded-xl text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 disabled:opacity-50 min-h-[40px]"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={pendingOperations[deleteOperationId]}
                className="inline-flex items-center justify-center w-full sm:w-20 h-10 sm:h-8 border border-transparent text-sm font-medium rounded-lg sm:rounded-xl text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 min-h-[40px]"
              >
                {pendingOperations[deleteOperationId] ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-1.5">Deleting</span>
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default TaskItem;