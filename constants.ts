import type { ProjectData, User } from './types';

export const USERS: User[] = [
  { id: 'user-1', name: 'Alex Reid', avatarUrl: 'https://picsum.photos/seed/alex/40/40' },
  { id: 'user-2', name: 'Casey Jordan', avatarUrl: 'https://picsum.photos/seed/casey/40/40' },
  { id: 'user-3', name: 'Morgan Lee', avatarUrl: 'https://picsum.photos/seed/morgan/40/40' },
  { id: 'user-4', name: 'Taylor Quinn', avatarUrl: 'https://picsum.photos/seed/taylor/40/40' },
];

const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

const getPastDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}


export const INITIAL_PROJECT_DATA: ProjectData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Design landing page mockup',
      description: 'Create a high-fidelity mockup for the new landing page using Figma. Focus on a clean, modern aesthetic and intuitive user flow. Include sections for features, testimonials, and pricing.',
      assignedTo: 'user-1',
      dueDate: getFutureDate(5),
      priority: 'Medium',
      comments: [
        { id: 'comment-1', userId: 'user-2', text: 'Great, I will start on the copy once the design is approved.', timestamp: new Date(Date.now() - 86400000).toISOString() },
      ],
      subtasks: [
        { id: 'sub-1-1', text: 'Research competitor landing pages', completed: true },
        { id: 'sub-1-2', text: 'Wireframe layout options', completed: true },
        { id: 'sub-1-3', text: 'Design final mockup', completed: false },
      ],
    },
    'task-2': {
      id: 'task-2',
      title: 'Develop authentication API',
      description: 'Build out the REST API endpoints for user registration, login, and password reset. Ensure all endpoints are secure and properly documented.',
      assignedTo: 'user-3',
      priority: 'High',
      comments: [],
      subtasks: [],
    },
    'task-3': {
      id: 'task-3',
      title: 'Set up CI/CD pipeline',
      description: 'Configure a continuous integration and continuous deployment pipeline using GitHub Actions to automate testing and deployment to the staging server.',
      assignedTo: 'user-3',
      dueDate: getPastDate(2),
      reminderDate: new Date(Date.now() + 60000).toISOString(), // Reminder in 1 minute for demonstration
      priority: 'High',
      comments: [],
      subtasks: [
        { id: 'sub-3-1', text: 'Create build script', completed: false },
        { id: 'sub-3-2', text: 'Configure deployment secrets', completed: false },
      ],
    },
    'task-4': {
      id: 'task-4',
      title: 'Write blog post about Q2 features',
      description: 'Draft a blog post announcing the new features launched in the second quarter. Highlight the benefits for our users and include screenshots.',
      assignedTo: 'user-2',
      priority: 'Low',
      comments: [],
      subtasks: [],
    },
    'task-5': {
      id: 'task-5',
      title: 'QA testing for mobile responsive views',
      description: 'Perform thorough quality assurance testing on all major pages to ensure they are fully responsive and functional on various mobile devices (iOS and Android).',
      assignedTo: 'user-4',
      dueDate: getFutureDate(10),
      priority: 'Medium',
      comments: [],
      subtasks: [],
    },
     'task-6': {
      id: 'task-6',
      title: 'Deploy database schema updates',
      description: 'Apply the latest migration scripts to the production database. Ensure a backup is created before starting the process.',
      comments: [],
      subtasks: [],
    },
    'task-7': {
      id: 'task-7',
      title: 'Review user feedback from survey',
      description: 'Analyze the results from the latest user satisfaction survey and compile a report with key takeaways and actionable insights for the product team.',
      assignedTo: 'user-1',
      priority: 'Low',
      comments: [],
      subtasks: [],
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Backlog',
      taskIds: ['task-1', 'task-2', 'task-4'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'In Review',
      taskIds: ['task-5'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Done',
      taskIds: ['task-6', 'task-7'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
};
