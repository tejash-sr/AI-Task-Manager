import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskProvider, useTasks } from './context/TaskContext';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import TaskForm from './components/TaskForm';
import TaskRecommendations from './components/TaskRecommendations';
import AIAssistant from './components/AIAssistant';
import './App.css';

function AppContent() {
  const [viewMode, setViewMode] = useState('kanban');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [aiTask, setAiTask] = useState(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  
  const { addTask, updateTask, deleteTask, toggleTask } = useTasks();

  const handleAddTask = (taskData = null) => {
    if (taskData) {
      // If taskData is provided (from recommendations), add it directly
      addTask(taskData);
    } else {
      // Otherwise, open the form
      setEditingTask(null);
      setIsTaskFormOpen(true);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const handleToggleTask = (taskId) => {
    toggleTask(taskId);
  };

  const handleSubmitTask = (taskData) => {
    if (editingTask) {
      updateTask({ ...editingTask, ...taskData });
    } else {
      addTask(taskData);
    }
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleAIAnalyze = (task) => {
    setAiTask(task);
    setIsAIAssistantOpen(true);
  };

  const handleCloseAIAssistant = () => {
    setIsAIAssistantOpen(false);
    setAiTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header 
        onAddTask={handleAddTask}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {viewMode === 'kanban' ? (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <KanbanBoard
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onToggle={handleToggleTask}
                onAddTask={handleAddTask}
                onAIAnalyze={handleAIAnalyze}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ListView
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onToggle={handleToggleTask}
                onAddTask={handleAddTask}
                onAIAnalyze={handleAIAnalyze}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        onSubmit={handleSubmitTask}
        task={editingTask}
      />
      
      <TaskRecommendations onAddTask={handleAddTask} />
      
      <AIAssistant
        task={aiTask}
        isOpen={isAIAssistantOpen}
        onClose={handleCloseAIAssistant}
      />
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;
