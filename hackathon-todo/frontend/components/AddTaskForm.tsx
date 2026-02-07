'use client';

import React, { useState } from 'react';
import { ApiClient } from '../lib/api';
import type { Task } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface AddTaskFormProps {
  userId: string;
  onTaskAdded: (task: Task) => void;
  isPending?: boolean;
  setPending?: (isPending: boolean) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ userId, onTaskAdded, isPending, setPending }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length < 1 || title.trim().length > 200) {
      setError('Title must be between 1 and 200 characters');
      return;
    }

    if (setPending) setPending(true);
    setError('');

    try {
      const apiClient = new ApiClient();
      const newTask = await apiClient.createTask(userId, title, description);
      onTaskAdded(newTask);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error(err);
    } finally {
      if (setPending) setPending(false);
    }
  };

  return (
    <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-md border border-slate-200">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-800">Add New Task</h2>
      {error && <div className="text-red-500 mb-3 sm:mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            className="mt-1 block w-full p-2.5 sm:p-3 border border-slate-300 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-sm transition-colors duration-200 min-h-[44px]"
            placeholder="Task title (1-200 characters)"
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={3}
            className="mt-1 block w-full p-2.5 sm:p-3 border border-slate-300 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-sm transition-colors duration-200 min-h-[60px]"
            placeholder="Optional task description (max 1000 characters)"
            disabled={isPending}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center w-full h-10 sm:h-9 border border-transparent text-sm font-medium rounded-lg sm:rounded-xl shadow-sm text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors duration-200 min-h-[40px]"
        >
          {isPending ? (
            <>
              <LoadingSpinner />
              <span className="ml-1.5">Adding</span>
            </>
          ) : (
            'Add Task'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;