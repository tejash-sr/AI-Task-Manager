# AI-Powered Task Manager with Smart Insights

A modern, feature-rich task management application built with React, featuring drag-and-drop Kanban boards, smart filtering, and a beautiful dark/light mode interface.

## ✨ Features

### Core Functionality
- ✅ **Add/Edit/Delete Tasks** - Full CRUD operations with intuitive forms
- ✅ **Task Categorization** - Priority levels (Low, Medium, High, Urgent) and status tracking
- ✅ **Smart Filtering** - Filter by Today, Upcoming, High Priority, or search by text
- ✅ **Kanban Board** - Drag & drop tasks between columns (To Do, In Progress, Completed)
- ✅ **Dual View Modes** - Switch between Kanban board and List view
- ✅ **Local Storage** - Persistent data without backend requirements
- ✅ **Dark/Light Mode** - Smooth theme switching with system preference detection
- 🤖 **AI-Powered Analysis** - Get AI insights, solutions, and clarifications for your tasks using Google Gemini

### UI/UX Features
- 🎨 **Modern Design** - Clean, professional interface with TailwindCSS
- 🎭 **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- 📱 **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- 🎯 **Intuitive Interactions** - Hover effects, loading states, and visual feedback
- 🎨 **Custom Styling** - Beautiful color schemes and typography

### Technical Features
- ⚡ **React 19** - Latest React with modern hooks and patterns
- 🚀 **Vite** - Lightning-fast development and build process
- 🎨 **TailwindCSS** - Utility-first CSS framework for rapid styling
- 🎭 **Framer Motion** - Production-ready motion library for animations
- 🎯 **@dnd-kit** - Modern drag-and-drop library with accessibility support
- 💾 **Context API** - Efficient state management without external dependencies
- 🔍 **Smart Search** - Real-time filtering across task titles and descriptions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Gemini API Key**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a `.env` file in the root directory
   - Add your API key:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 Usage

### Adding Tasks
1. Click the "Add Task" button in the header
2. Fill in the task details (title, description, priority, due date)
3. Choose the initial status (To Do, In Progress, Completed)
4. Click "Add Task" to save

### Managing Tasks
- **Edit**: Click the edit icon on any task card
- **Delete**: Click the trash icon and confirm deletion
- **Complete**: Click the circle icon to toggle completion status
- **Move**: Drag tasks between columns in Kanban view

### Filtering & Search
- **Search**: Use the search bar to find tasks by title or description
- **Filter**: Click "Filter" to access quick filters:
  - All Tasks
  - Today (due today)
  - Upcoming (due tomorrow)
  - High Priority (High or Urgent priority)

### View Modes
- **Kanban Board**: Visual drag-and-drop interface with columns
- **List View**: Traditional list layout grouped by status

### Theme Switching
- Click the sun/moon icon in the header to toggle between light and dark modes
- Theme preference is automatically saved

### AI Assistant Features
- **Analyze Task**: Click the sparkles icon (✨) on any task card to get AI-powered analysis
  - Task analysis and insights
  - Potential challenges and obstacles
  - Actionable solutions and recommendations
  - Best practices and tips
- **Ask Questions**: Use the "Ask Question" tab to get specific answers about your task
- **Generate Subtasks**: Use the "Subtasks" tab to break down complex tasks into smaller, actionable steps

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # App header with search, filters, theme toggle
│   ├── TaskCard.jsx    # Individual task display component
│   ├── TaskForm.jsx    # Add/edit task modal form
│   ├── KanbanBoard.jsx # Drag-and-drop Kanban interface
│   ├── ListView.jsx    # Alternative list view
│   └── AIAssistant.jsx # AI-powered task analysis component
├── services/           # API services
│   └── geminiService.js # Google Gemini API integration
├── context/            # React Context for state management
│   └── TaskContext.jsx # Main app state and actions
├── hooks/              # Custom React hooks (future)
├── utils/              # Utility functions
│   └── sampleData.js   # Sample task data
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles and TailwindCSS imports
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) - Main actions and highlights
- **Success**: Green - Completed tasks and positive actions
- **Warning**: Yellow/Orange - In-progress and high priority
- **Danger**: Red - Urgent tasks and destructive actions
- **Neutral**: Gray scale - Text, borders, and backgrounds

### Typography
- **Headings**: Inter font family with various weights
- **Body**: System font stack for optimal readability
- **Sizes**: Responsive typography scale

### Spacing
- **Consistent**: 4px base unit with TailwindCSS spacing scale
- **Responsive**: Mobile-first approach with breakpoint-specific spacing

## 🔧 Customization

### Adding New Priority Levels
1. Update `TASK_PRIORITY` in `TaskContext.jsx`
2. Add corresponding colors in `TaskCard.jsx`
3. Update form options in `TaskForm.jsx`

### Adding New Status Types
1. Update `TASK_STATUS` in `TaskContext.jsx`
2. Add column configuration in `KanbanBoard.jsx`
3. Update status options in `TaskForm.jsx`

### Styling Customization
- Modify `tailwind.config.js` for theme customization
- Update component classes in individual files
- Add custom CSS in `index.css` for complex styles

## 🚀 Future Enhancements

### Phase 2: Enhanced AI Features
- [x] AI task analysis and insights
- [x] AI-powered question answering
- [x] AI-generated subtask suggestions
- [ ] Smart task suggestions based on patterns
- [ ] Automatic priority assignment using ML
- [ ] Time estimation for tasks
- [ ] Productivity insights and analytics

### Phase 3: Collaboration
- [ ] User authentication
- [ ] Team workspaces
- [ ] Real-time collaboration
- [ ] Comments and mentions

### Phase 4: Advanced Features
- [ ] Calendar integration
- [ ] File attachments
- [ ] Recurring tasks
- [ ] Advanced reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The UI library
- [Vite](https://vitejs.dev/) - The build tool
- [TailwindCSS](https://tailwindcss.com/) - The CSS framework
- [Framer Motion](https://www.framer.com/motion/) - The animation library
- [@dnd-kit](https://dndkit.com/) - The drag and drop library
- [Lucide React](https://lucide.dev/) - The icon library

---

**Built with ❤️ for modern productivity**