import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Search, 
  Filter, 
  Plus, 
  BarChart3,
  Calendar,
  Clock,
  AlertTriangle,
  Grid3X3,
  List,
  Trash2
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function Header({ onAddTask, viewMode, onViewModeChange }) {
  const { 
    theme, 
    toggleTheme, 
    filter, 
    setFilter, 
    searchQuery, 
    setSearchQuery,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    moveTask,
    setFilter: setFilterAction,
    setSearchQuery: setSearchQueryAction,
    toggleTheme: toggleThemeAction,
    getFilteredTasks,
    getTasksByStatus
  } = useTasks();

  const [showFilters, setShowFilters] = useState(false);

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('ai-task-manager-tasks');
      localStorage.removeItem('ai-task-manager-theme');
      window.location.reload();
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Tasks', icon: List, count: tasks.length },
    { value: 'today', label: 'Today', icon: Calendar, count: tasks.filter(task => {
      const today = new Date().toDateString();
      const taskDate = new Date(task.dueDate).toDateString();
      return taskDate === today;
    }).length },
    { value: 'upcoming', label: 'Upcoming', icon: Clock, count: tasks.filter(task => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const taskDate = new Date(task.dueDate);
      return taskDate > new Date() && taskDate <= tomorrow;
    }).length },
    { value: 'high-priority', label: 'High Priority', icon: AlertTriangle, count: tasks.filter(task => 
      task.priority === 'high' || task.priority === 'urgent'
    ).length }
  ];

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40"
    >
      <div className="px-6 py-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              AI Task Manager
            </h1>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <BarChart3 className="w-4 h-4" />
              <span>{completionRate}% completed</span>
              <span>•</span>
              <span>{completedTasks}/{totalTasks} tasks</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* View mode toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('kanban')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'kanban' 
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title="Kanban view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
            </button>

            {/* Clear data button (for testing) */}
            <button
              onClick={handleClearAllData}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors text-red-600 dark:text-red-400"
              title="Clear all data (for testing)"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Add task button */}
            <button
              onClick={() => onAddTask()}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center space-x-2 ${
              filter !== 'all' ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : ''
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Filter options */}
        <motion.div
          initial={false}
          animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {filterOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilter(option.value);
                    setShowFilters(false);
                  }}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${filter === option.value
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                  <span className="bg-white dark:bg-gray-600 text-xs px-2 py-1 rounded-full">
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
