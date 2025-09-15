import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Briefcase, 
  FileText, 
  Calendar, 
  Code, 
  ShoppingCart,
  Heart,
  Zap
} from 'lucide-react';

const recommendations = [
  {
    id: 'homework',
    title: 'Complete Math Homework',
    description: 'Solve algebra problems from chapter 5, due next week',
    priority: 'high',
    category: 'Education',
    icon: BookOpen,
    color: 'bg-blue-500',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: 'project',
    title: 'Finish Project Proposal',
    description: 'Draft and review the quarterly project proposal document',
    priority: 'urgent',
    category: 'Work',
    icon: Briefcase,
    color: 'bg-green-500',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: 'assignment',
    title: 'Write Research Paper',
    description: 'Complete the 2000-word research paper on climate change',
    priority: 'medium',
    category: 'Education',
    icon: FileText,
    color: 'bg-purple-500',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: 'meeting',
    title: 'Prepare for Team Meeting',
    description: 'Review agenda and prepare presentation slides',
    priority: 'high',
    category: 'Work',
    icon: Calendar,
    color: 'bg-orange-500',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: 'coding',
    title: 'Debug Application',
    description: 'Fix the authentication bug in the user login system',
    priority: 'urgent',
    category: 'Development',
    icon: Code,
    color: 'bg-red-500',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: 'shopping',
    title: 'Grocery Shopping',
    description: 'Buy ingredients for weekend meal prep',
    priority: 'low',
    category: 'Personal',
    icon: ShoppingCart,
    color: 'bg-yellow-500',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: 'exercise',
    title: 'Gym Workout',
    description: 'Complete 45-minute strength training session',
    priority: 'medium',
    category: 'Health',
    icon: Heart,
    color: 'bg-pink-500',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: 'learning',
    title: 'Learn New Technology',
    description: 'Complete online course on React advanced patterns',
    priority: 'low',
    category: 'Learning',
    icon: Zap,
    color: 'bg-indigo-500',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
];

export default function TaskRecommendations({ onAddTask }) {
  const handleRecommendationClick = (recommendation) => {
    const taskData = {
      title: recommendation.title,
      description: recommendation.description,
      priority: recommendation.priority,
      dueDate: recommendation.dueDate,
      status: 'todo',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onAddTask(taskData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          💡 Quick Add Tasks
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Click on any recommendation below to quickly add a task with pre-filled details
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {recommendations.map((recommendation, index) => {
            const Icon = recommendation.icon;
            return (
              <motion.button
                key={recommendation.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRecommendationClick(recommendation)}
                className={`
                  group relative p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600
                  hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20
                  transition-all duration-200 cursor-pointer text-left
                `}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`p-3 rounded-lg ${recommendation.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                      {recommendation.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {recommendation.category}
                    </p>
                    <div className="flex items-center justify-center space-x-1">
                      <span className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${recommendation.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                          recommendation.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                          recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'}
                      `}>
                        {recommendation.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-xl bg-primary-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
              </motion.button>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 These are just suggestions - you can modify any details after adding the task
          </p>
        </div>
      </div>
    </motion.div>
  );
}
