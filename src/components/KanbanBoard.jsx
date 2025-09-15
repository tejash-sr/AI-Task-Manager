import React from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragOverlay, closestCenter, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import { useTasks, TASK_STATUS } from '../context/TaskContext';
import { Plus, ListTodo, Clock, CheckCircle2 } from 'lucide-react';

const statusConfig = {
  [TASK_STATUS.TODO]: {
    title: 'To Do',
    icon: ListTodo,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  [TASK_STATUS.IN_PROGRESS]: {
    title: 'In Progress',
    icon: Clock,
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  [TASK_STATUS.COMPLETED]: {
    title: 'Completed',
    icon: CheckCircle2,
    color: 'bg-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800'
  }
};

function SortableTaskCard({ task, onEdit, onDelete, onToggle }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="cursor-default"
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggle={onToggle}
        isDragging={isDragging}
        dragAttributes={attributes}
        dragListeners={listeners}
      />
    </div>
  );
}

function KanbanColumn({ status, tasks, onEdit, onDelete, onToggle, onAddTask }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        kanban-column flex-1 min-w-[200px] max-w-[250px]
        ${config.bgColor} ${config.borderColor}
        ${isOver ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${config.color} text-white`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {config.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
        </div>
        
        {status === TASK_STATUS.TODO && (
          <button
            onClick={() => onAddTask(status)}
            className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors group"
            title="Add new task"
          >
            <Plus className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          </button>
        )}
      </div>

      {/* Tasks */}
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500 dark:text-gray-400"
            >
              <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tasks yet</p>
              {status === TASK_STATUS.TODO && (
                <p className="text-xs mt-1">Click + to add a task</p>
              )}
            </motion.div>
          ) : (
            tasks.map(task => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            ))
          )}
        </div>
      </SortableContext>
    </motion.div>
  );
}

export default function KanbanBoard({ onEdit, onDelete, onToggle, onAddTask }) {
  const { getTasksByStatus, moveTask, reorderTasks } = useTasks();
  const [activeTask, setActiveTask] = React.useState(null);

  const todoTasks = getTasksByStatus(TASK_STATUS.TODO);
  const inProgressTasks = getTasksByStatus(TASK_STATUS.IN_PROGRESS);
  const completedTasks = getTasksByStatus(TASK_STATUS.COMPLETED);

  const handleDragStart = (event) => {
    const { active } = event;
    const task = [...todoTasks, ...inProgressTasks, ...completedTasks]
      .find(task => task.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = [...todoTasks, ...inProgressTasks, ...completedTasks]
      .find(task => task.id === active.id);

    if (!activeTask) return;

    // Check if dropped on a column (by checking if over.id is a status)
    const isDroppedOnColumn = Object.values(TASK_STATUS).includes(over.id);
    
    if (isDroppedOnColumn) {
      // Dropped on a column - change status
      const newStatus = over.id;
      if (activeTask.status !== newStatus) {
        moveTask(activeTask.id, newStatus);
      }
    } else {
      // Dropped on another task - determine status from the target task
      const targetTask = [...todoTasks, ...inProgressTasks, ...completedTasks]
        .find(task => task.id === over.id);
      
      if (!targetTask) return;
      // If same column, reorder; if different, move to that column
      if (targetTask.status === activeTask.status) {
        reorderTasks(active.id, over.id);
      } else {
        moveTask(activeTask.id, targetTask.status);
      }
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4 overflow-x-auto min-h-[400px] justify-center max-w-6xl mx-auto">
        <KanbanColumn
          status={TASK_STATUS.TODO}
          tasks={todoTasks}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          onAddTask={onAddTask}
        />
        
        <KanbanColumn
          status={TASK_STATUS.IN_PROGRESS}
          tasks={inProgressTasks}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          onAddTask={onAddTask}
        />
        
        <KanbanColumn
          status={TASK_STATUS.COMPLETED}
          tasks={completedTasks}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          onAddTask={onAddTask}
        />
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 scale-105">
            <TaskCard
              task={activeTask}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
              isDragging={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
