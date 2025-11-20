import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Flag, 
  Edit2, 
  Trash2, 
  CheckCircle2,
  Circle,
  MoreVertical,
  Sparkles
} from 'lucide-react';
import { useTasks, TASK_PRIORITY } from '../context/TaskContext';

const priorityColors = {
  [TASK_PRIORITY.LOW]: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
  [TASK_PRIORITY.MEDIUM]: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
  [TASK_PRIORITY.HIGH]: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300',
  [TASK_PRIORITY.URGENT]: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
};

const priorityIcons = {
  [TASK_PRIORITY.LOW]: '🟢',
  [TASK_PRIORITY.MEDIUM]: '🟡',
  [TASK_PRIORITY.HIGH]: '🟠',
  [TASK_PRIORITY.URGENT]: '🔴'
};

export default function TaskCard({ task, onEdit, onDelete, onToggle, onAIAnalyze, isDragging = false, dragAttributes, dragListeners }) {
  const { theme } = useTasks();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const isDueSoon = new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000) && !task.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={`
        task-card group relative
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
        ${task.completed ? 'opacity-75' : ''}
      `}
    >
      {/* Header with drag handle + toggle + actions */}
      <div className="flex items-start justify-between mb-2 relative">
        <div className="flex items-center space-x-2 flex-1">
          {/* Drag handle */}
          <div
            {...(dragAttributes || {})}
            {...(dragListeners || {})}
            onMouseDown={(e) => e.stopPropagation()}
            className="h-5 w-3 mr-1 flex-shrink-0 cursor-grab active:cursor-grabbing select-none opacity-40 hover:opacity-70"
            title="Drag to move"
            aria-label="Drag handle"
          >
            <div className="w-full h-full bg-gray-400/60 rounded-sm" />
          </div>

          {/* Toggle completion */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(task.id); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          <h3 className={`
            font-medium text-xs leading-tight flex-1
            ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}
         `}>
            {task.title}
          </h3>
        </div>

        {/* Actions + Priority */}
        <div className="flex items-center gap-2 z-20 relative">
          <span className="text-sm select-none pointer-events-none" title={task.priority}>
            {priorityIcons[task.priority]}
          </span>
          {onAIAnalyze && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAIAnalyze(task); }}
              onMouseDown={(e) => e.stopPropagation()}
              className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900 rounded"
              title="AI Analysis"
              aria-label="AI Analysis"
            >
              <Sparkles className="w-4 h-4 text-purple-500 hover:text-purple-700 dark:hover:text-purple-300" />
            </button>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(task); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit2 className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(task.id); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600 dark:hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <div className={`
            flex items-center space-x-1
            ${isOverdue ? 'text-red-600 dark:text-red-400' : 
              isDueSoon ? 'text-orange-600 dark:text-orange-400' : 
              'text-gray-500 dark:text-gray-400'}
          `}>
            <Calendar className="w-3 h-3" />
            <span className={isOverdue ? 'font-medium' : ''}>
              {formatDate(task.dueDate)}
            </span>
          </div>

          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${priorityColors[task.priority]}
          `}>
            {task.priority}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-gray-400">
          <Clock className="w-3 h-3" />
          <span className="capitalize">{task.status.replace('-', ' ')}</span>
        </div>
      </div>

      {isOverdue && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 rounded-t-lg" />
      )}
    </motion.div>
  );
}
