// Sample data for demonstration purposes
export const sampleTasks = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern, responsive landing page for the new product launch. Focus on mobile-first design and accessibility.',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-01-20',
    completed: false,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    title: 'Review quarterly reports',
    description: 'Analyze Q4 performance metrics and prepare executive summary for board meeting.',
    priority: 'urgent',
    status: 'todo',
    dueDate: '2024-01-18',
    completed: false,
    createdAt: '2024-01-14T14:30:00.000Z',
    updatedAt: '2024-01-14T14:30:00.000Z'
  },
  {
    id: '3',
    title: 'Update team documentation',
    description: 'Refresh onboarding docs and API documentation for new team members.',
    priority: 'medium',
    status: 'completed',
    dueDate: '2024-01-16',
    completed: true,
    createdAt: '2024-01-10T09:15:00.000Z',
    updatedAt: '2024-01-16T16:45:00.000Z'
  },
  {
    id: '4',
    title: 'Plan team offsite',
    description: 'Organize quarterly team building event. Research venues, activities, and logistics.',
    priority: 'low',
    status: 'todo',
    dueDate: '2024-02-01',
    completed: false,
    createdAt: '2024-01-12T11:20:00.000Z',
    updatedAt: '2024-01-12T11:20:00.000Z'
  },
  {
    id: '5',
    title: 'Implement user authentication',
    description: 'Add OAuth integration and user session management to the application.',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-01-22',
    completed: false,
    createdAt: '2024-01-13T08:45:00.000Z',
    updatedAt: '2024-01-13T08:45:00.000Z'
  },
  {
    id: '6',
    title: 'Code review for PR #123',
    description: 'Review and provide feedback on the new feature implementation.',
    priority: 'medium',
    status: 'completed',
    dueDate: '2024-01-17',
    completed: true,
    createdAt: '2024-01-16T13:10:00.000Z',
    updatedAt: '2024-01-17T10:30:00.000Z'
  },
  {
    id: '7',
    title: 'Research new technologies',
    description: 'Investigate latest frontend frameworks and tools for potential adoption.',
    priority: 'low',
    status: 'todo',
    dueDate: '2024-01-25',
    completed: false,
    createdAt: '2024-01-14T16:00:00.000Z',
    updatedAt: '2024-01-14T16:00:00.000Z'
  },
  {
    id: '8',
    title: 'Fix critical bug in payment flow',
    description: 'Resolve issue where users cannot complete checkout process on mobile devices.',
    priority: 'urgent',
    status: 'in-progress',
    dueDate: '2024-01-19',
    completed: false,
    createdAt: '2024-01-15T12:30:00.000Z',
    updatedAt: '2024-01-15T12:30:00.000Z'
  }
];

// Helper function to load sample data
export const loadSampleData = () => {
  const existingTasks = localStorage.getItem('ai-task-manager-tasks');
  if (!existingTasks || JSON.parse(existingTasks).length === 0) {
    localStorage.setItem('ai-task-manager-tasks', JSON.stringify(sampleTasks));
    return sampleTasks;
  }
  return JSON.parse(existingTasks);
};
