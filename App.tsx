import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { ProjectProvider } from './hooks/useProjectData';
import { useReminderNotifications } from './hooks/useReminderNotifications';

// This component now sits inside the provider, allowing it to use context-dependent hooks.
const AppLayout: React.FC = () => {
  // This hook will now run in the background, checking for due reminders.
  useReminderNotifications();

  return (
    <div className="flex flex-col h-screen font-sans text-slate-800">
      <Header />
      <main className="flex-1 overflow-x-auto">
        <Board />
      </main>
    </div>
  )
}

function App() {
  return (
    <ProjectProvider>
      <AppLayout />
    </ProjectProvider>
  );
}

export default App;
