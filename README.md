# 🛫 Project Pilot — Piloting Projects to Success

**Project Pilot** is a modern, collaborative **project management tool** built to help teams **organize, track, and complete** their work efficiently.  
Inspired by productivity platforms like **Trello** and **Asana**, it features a clean **Kanban board interface** and integrates **AI-driven task suggestions** to elevate productivity and teamwork.


## ✨ Core Features

### 🎯 Visual Task Management
- **Interactive Kanban Board:** Organize tasks across customizable columns (Backlog, In Progress, Done).  
- **Drag & Drop Interface:** Smooth task movement between columns for effortless progress tracking.  

### 🗂️ Comprehensive Task Controls
- **Create, Edit, and Delete Tasks:** Manage the full lifecycle of every task.  
- **Detailed Task Modals:** View and edit descriptions, sub-tasks, comments, and more.  
- **Assignees:** Assign work to team members with avatar indicators.  
- **Due Dates & Priorities:** Set deadlines and priority levels (Low / Medium / High) with color-coded tags.  
- **Progress Bars:** Track completion via sub-task progress indicators.  

### 🤖 AI-Powered Sub-task Suggestions
Harness the **Google Gemini API** to automatically generate actionable sub-tasks from a task’s title and description — breaking complex goals into smaller steps.

### 🔔 Smart Reminders & Notifications
- Set **custom reminders** with date and time.  
- Receive **native browser notifications** when tasks are due — never miss a deadline again.  

### 💬 Team Collaboration
- **Comments:** Discuss tasks directly in-app.  
- **Task Sharing:** Copy a direct task link to collaborate seamlessly.  
- **Deletion Safety:** Built-in confirmation modal prevents accidental data loss.  

---

## 🚀 Tech Stack

| Area | Technologies |
|------|---------------|
| **Frontend** | React + TypeScript + Tailwind CSS |
| **AI Integration** | Google Gemini API (`@google/genai`) |
| **State Management** | React Context API |
| **Drag & Drop** | Native HTML Drag and Drop API |
| **Notifications** | Browser Notification API |
| **Local Storage** | Used to persist reminder data and prevent duplicate alerts |

---

## 🧭 How to Use

1. **Open the Board:** The main screen displays all workflow columns.  
2. **Add a Task:** Click **“+ Add a card”** under any column to create a new task.  
3. **Move Tasks:** Drag and drop tasks between columns to update their status.  
4. **Edit Task Details:**  
   - Modify title and description  
   - Assign a team member  
   - Set due dates, priorities, and reminders  
   - Add or complete sub-tasks  
   - Click **“Suggest Sub-tasks”** to let AI generate a checklist  
   - Discuss within comments  
5. **Enable Notifications:** Allow browser permission when prompted to receive deadline reminders.

---

## 🤖 AI Integration — *Smart Sub-tasks*

**Project Pilot** integrates **Google’s Gemini API** to make task planning intelligent.  
When the **“Suggest Sub-tasks”** button is clicked, the app sends the task’s title + description to Gemini, which analyzes context and returns a list of meaningful sub-tasks — instantly added to your task.

> ⚠️ **Note:** This feature requires a valid `API_KEY` configured in your environment.  
> If unavailable, the app uses mock data for demonstration.
## 📁 Project Structure

```
/
├── components/          # Reusable React components (Board, Column, TaskCard, Modals, etc.)
│   ├── icons/           # SVG icon components
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useProjectData.tsx   # Core state management for project data
│   └── useReminderNotifications.ts # Logic for handling browser notifications
├── services/            # Modules for external API calls
│   └── geminiService.ts # Functions for interacting with the Gemini API
├── App.tsx              # Main application component and layout
├── index.tsx            # Application entry point
├── constants.ts         # Initial project data, users, and other constants
├── types.ts             # TypeScript type definitions for the application
├── index.html           # Main HTML file
└── README.md            # You are here!


---

## 🧩 Future Enhancements
- ✅ Team workspaces with real-time collaboration  
- ✅ Cloud-based task storage  
- ✅ Advanced analytics dashboard  
- ✅ Mobile-responsive layout  

---

## 👩‍💻 Author
**Hafsa**  
Full-Stack Developer | AI Integrator | Tech Educator 🌸  
📧 Email: [hrranger555@gmail.com]  
🌐 LinkedIn: [https://www.linkedin.com/in/hafsa-raja-5224a8365/]  

---

## 🪄 License
Released under the **MIT License** — free for personal and educational use.  
Feel free to fork, enhance, and innovate with *Project Pilot*!


## 📁 Project Structure

