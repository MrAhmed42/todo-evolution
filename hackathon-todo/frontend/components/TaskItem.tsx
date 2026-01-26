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
    <li className="bg-white hover:bg-slate-50 transition-colors duration-200 border-b border-slate-100 last:border-0">
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        {isEditing ? (
          <div className="p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl">
            <div className="mb-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                disabled={pendingOperations[saveOperationId]}
              />
            </div>
            <div className="mb-3">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                disabled={pendingOperations[saveOperationId]}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleSave}
                disabled={pendingOperations[saveOperationId]}
                className="flex-1 inline-flex items-center justify-center h-10 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
              >
                {pendingOperations[saveOperationId] ? <LoadingSpinner /> : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 inline-flex items-center justify-center h-10 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start flex-1 min-w-0">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleComplete}
                className="h-5 w-5 mt-1 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                disabled={pendingOperations[toggleOperationId]}
              />
              <div className="ml-3 flex-1 min-w-0">
                <p className={`text-base font-medium break-words ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className={`text-sm mt-1 break-words ${task.completed ? 'line-through text-slate-400' : 'text-slate-500'}`}>
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            {/* RESPONSIVE BUTTONS: Stack on mobile, Row on Desktop */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:w-20 h-10 sm:h-9 inline-flex items-center justify-center text-sm font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={pendingOperations[deleteOperationId]}
                className="flex-1 sm:w-20 h-10 sm:h-9 inline-flex items-center justify-center text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {pendingOperations[deleteOperationId] ? <LoadingSpinner /> : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default TaskItem;