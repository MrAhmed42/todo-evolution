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
    <div className="bg-white hover:bg-slate-50 transition-all duration-200 border-b border-slate-100 last:border-0 shadow-sm rounded-xl mb-3 overflow-hidden">
      <div className="p-4 sm:p-5">
        {isEditing ? (
          <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none"
              placeholder="Task title..."
              disabled={pendingOperations[saveOperationId]}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none"
              placeholder="Description (optional)..."
              disabled={pendingOperations[saveOperationId]}
            />
            <div className="flex flex-row gap-2">
              <button
                onClick={handleSave}
                disabled={pendingOperations[saveOperationId]}
                className="flex-1 inline-flex items-center justify-center h-10 text-sm font-bold rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50"
              >
                {pendingOperations[saveOperationId] ? <LoadingSpinner /> : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 inline-flex items-center justify-center h-10 text-sm font-bold rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Header: Checkbox + Title + Description */}
            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={handleToggleComplete}
                  className="h-5 w-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                  disabled={pendingOperations[toggleOperationId]}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-base font-bold leading-tight break-words ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm mt-1 line-clamp-2 leading-relaxed break-words ${task.completed ? 'line-through text-slate-400' : 'text-slate-500'}`}>
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions: Forced Side-by-Side buttons on ALL screens */}
            <div className="flex flex-row items-center gap-2 mt-1 w-full flex-nowrap">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 h-9 flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all active:scale-95 border border-emerald-100 whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={pendingOperations[deleteOperationId]}
                className="flex-1 h-9 flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-all active:scale-95 border border-red-100 disabled:opacity-50 whitespace-nowrap"
              >
                {pendingOperations[deleteOperationId] ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;