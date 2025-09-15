import React from 'react';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import { useTasks } from '../context/TaskContext';
import { Plus } from 'lucide-react';

export default function ListView({ onEdit, onDelete, onToggle, onAddTask }) {
  const { getFilteredTasks } = useTasks();
  const tasks = getFilteredTasks();

  // Group tasks by status
  const groupedTasks = {
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    completed: tasks.filter(task => task.status === 'completed')
  };

  const statusLabels = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    completed: 'Completed'
  };

  return (
    <div className="p-6 space-y-8">
      {Object.entries(groupedTasks).map(([status, statusTasks]) => (
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Status header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {statusLabels[status]}
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({statusTasks.length} {statusTasks.length === 1 ? 'task' : 'tasks'})
              </span>
            </h2>
            
            {status === 'todo' && (
              <button
                onClick={() => onAddTask()}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            )}
          </div>

          {/* Tasks grid */}
          {statusTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700"
            >
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No {statusLabels[status].toLowerCase()} tasks
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {status === 'todo' 
                    ? 'Get started by adding your first task'
                    : `No tasks are currently ${status === 'in-progress' ? 'in progress' : 'completed'}`
                  }
                </p>
                {status === 'todo' && (
                  <button
                    onClick={() => onAddTask()}
                    className="btn-primary"
                  >
                    Add Your First Task
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statusTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggle={onToggle}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
