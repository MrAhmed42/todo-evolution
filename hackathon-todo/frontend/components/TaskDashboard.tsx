'use client';

import React, { useState, useEffect } from 'react';
import AddTaskForm from './AddTaskForm';
import TaskList from './TaskList';
import { ApiClient } from '../lib/api';
import type { Task } from '../types';

interface TaskDashboardProps {
  userId: string;
}

const TaskDashboard: React.FC<TaskDashboardProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingOperations, setPendingOperations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const apiClient = new ApiClient();
      const fetchedTasks = await apiClient.getTasks(userId);
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setOperationPending = (operationId: string, isPending: boolean) => {
    setPendingOperations(prev => ({
      ...prev,
      [operationId]: isPending
    }));
  };

  const handleTaskAdded = (newTask: Task) => {
    setTasks([newTask, ...tasks]); // Add new task to the top of the list
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <AddTaskForm
        userId={userId}
        onTaskAdded={handleTaskAdded}
        isPending={pendingOperations['add-task'] || false}
        setPending={(isPending: boolean) => setOperationPending('add-task', isPending)}
      />
      <TaskList
        tasks={tasks}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
        userId={userId}
        pendingOperations={pendingOperations}
        setOperationPending={setOperationPending}
      />
    </div>
  );
};

export default TaskDashboard;