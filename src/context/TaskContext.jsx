import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loadSampleData } from '../utils/sampleData';

const TaskContext = createContext();

// Task statuses
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

// Task priorities
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Initial state
const initialState = {
  tasks: [],
  filter: 'all', // all, today, upcoming, high-priority
  searchQuery: '',
  theme: 'light'
};

// Action types
const ACTIONS = {
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  TOGGLE_TASK: 'TOGGLE_TASK',
  SET_FILTER: 'SET_FILTER',
  SET_SEARCH: 'SET_SEARCH',
  SET_THEME: 'SET_THEME',
  LOAD_TASKS: 'LOAD_TASKS',
  MOVE_TASK: 'MOVE_TASK',
  REORDER_TASKS: 'REORDER_TASKS'
};

// Reducer
function taskReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: Date.now().toString() }]
      };
    
    case ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      };
    
    case ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    
    case ACTIONS.TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? {
                ...task,
                completed: !task.completed,
                status: !task.completed ? TASK_STATUS.COMPLETED : TASK_STATUS.TODO
              }
            : task
        )
      };
    
    case ACTIONS.MOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, status: action.payload.newStatus, completed: action.payload.newStatus === TASK_STATUS.COMPLETED }
            : task
        )
      };
    
    case ACTIONS.REORDER_TASKS: {
      const { activeId, overId } = action.payload;
      if (activeId === overId) return state;
      const tasks = [...state.tasks];
      const fromIndex = tasks.findIndex(t => t.id === activeId);
      const toIndex = tasks.findIndex(t => t.id === overId);
      if (fromIndex === -1 || toIndex === -1) return state;
      if (tasks[fromIndex].status !== tasks[toIndex].status) return state;
      const [moved] = tasks.splice(fromIndex, 1);
      tasks.splice(toIndex, 0, moved);
      return { ...state, tasks };
    }
    
    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };
    
    case ACTIONS.SET_SEARCH:
      return {
        ...state,
        searchQuery: action.payload
      };
    
    case ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
    
    case ACTIONS.LOAD_TASKS:
      return {
        ...state,
        tasks: action.payload
      };
    
    default:
      return state;
  }
}

// Provider component
export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('ai-task-manager-tasks');
    const savedTheme = localStorage.getItem('ai-task-manager-theme');
    
    if (savedTasks) {
      dispatch({ type: ACTIONS.LOAD_TASKS, payload: JSON.parse(savedTasks) });
    } else {
      // Load sample data if no tasks exist
      const sampleTasks = loadSampleData();
      dispatch({ type: ACTIONS.LOAD_TASKS, payload: sampleTasks });
    }
    
    if (savedTheme) {
      dispatch({ type: ACTIONS.SET_THEME, payload: savedTheme });
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('ai-task-manager-tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  // Save theme to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem('ai-task-manager-theme', state.theme);
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  // Action creators
  const addTask = (task) => {
    dispatch({ type: ACTIONS.ADD_TASK, payload: task });
  };

  const updateTask = (task) => {
    dispatch({ type: ACTIONS.UPDATE_TASK, payload: task });
  };

  const deleteTask = (taskId) => {
    dispatch({ type: ACTIONS.DELETE_TASK, payload: taskId });
  };

  const toggleTask = (taskId) => {
    dispatch({ type: ACTIONS.TOGGLE_TASK, payload: taskId });
  };

  const moveTask = (taskId, newStatus) => {
    dispatch({ type: ACTIONS.MOVE_TASK, payload: { taskId, newStatus } });
  };

  const reorderTasks = (activeId, overId) => {
    dispatch({ type: ACTIONS.REORDER_TASKS, payload: { activeId, overId } });
  };

  const setFilter = (filter) => {
    dispatch({ type: ACTIONS.SET_FILTER, payload: filter });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: ACTIONS.SET_SEARCH, payload: query });
  };

  const toggleTheme = () => {
    dispatch({ type: ACTIONS.SET_THEME, payload: state.theme === 'light' ? 'dark' : 'light' });
  };

  // Filter tasks based on current filter and search
  const getFilteredTasks = () => {
    let filtered = state.tasks;

    // Helper: parse 'YYYY-MM-DD' as local date at 00:00
    const parseLocalDate = (value) => {
      if (!value) return null;
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [y, m, d] = value.split('-').map(Number);
        return new Date(y, m - 1, d, 0, 0, 0, 0);
      }
      const dt = new Date(value);
      return isNaN(dt.getTime()) ? null : dt;
    };

    // Build time windows
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const tomorrowEnd = new Date(todayEnd);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

    // Apply search filter
    if (state.searchQuery) {
      filtered = filtered.filter(task =>
        (task.title || '').toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        (task.description || '').toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    // Apply status/quick filters
    switch (state.filter) {
      case 'today':
        filtered = filtered.filter(task => {
          const due = parseLocalDate(task.dueDate);
          return due && due >= todayStart && due <= todayEnd;
        });
        break;
      case 'upcoming':
        // Define upcoming as "due tomorrow"
        filtered = filtered.filter(task => {
          const due = parseLocalDate(task.dueDate);
          return due && due >= tomorrowStart && due <= tomorrowEnd;
        });
        break;
      case 'high-priority':
        filtered = filtered.filter(task => 
          task.priority === TASK_PRIORITY.HIGH || task.priority === TASK_PRIORITY.URGENT
        );
        break;
      default:
        break;
    }

    return filtered;
  };

  // Get tasks by status for Kanban board
  const getTasksByStatus = (status) => {
    return getFilteredTasks().filter(task => task.status === status);
  };

  const value = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    moveTask,
    reorderTasks,
    setFilter,
    setSearchQuery,
    toggleTheme,
    getFilteredTasks,
    getTasksByStatus
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

// Custom hook to use the context
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
