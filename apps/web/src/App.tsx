import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { KanbanDashboard } from './components/KanbanDashboard';
import { MonthlyDashboard } from './components/MonthlyDashboard';
import { PortfolioView } from './components/PortfolioView';
import { ProjectView } from './components/ProjectView';
import { TaskView } from './components/TaskView';
import { TaskModal } from './components/TaskModal';
import { PortfolioModal } from './components/PortfolioModal';
import { ProjectModal } from './components/ProjectModal';
import { MilestoneModal } from './components/MilestoneModal';
import { LearningModal } from './components/LearningModal';
import { AuthModal } from './components/AuthModal';
import { Smartphone, Monitor } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, deviceMode, setDeviceMode } = useApp();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'kanban':
        return <KanbanDashboard />;
      case 'monthly':
        return <MonthlyDashboard />;
      case 'portfolios':
        return <PortfolioView />;
      case 'projects':
        return <ProjectView />;
      case 'tasks':
        return <TaskView />;
      default:
        return <KanbanDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {deviceMode === 'mobile' ? (
            /* Mobile Device Simulator Frame */
            <div className="flex flex-col items-center justify-center py-4">
              <div className="mb-4 flex items-center justify-between w-full max-w-sm px-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-4 h-4 text-brand-500" /> Previsualizador Móvil
                </span>
                <button
                  onClick={() => setDeviceMode('responsive')}
                  className="text-brand-500 hover:underline font-semibold flex items-center gap-1"
                >
                  <Monitor className="w-3.5 h-3.5" /> Volver a Escritorio
                </button>
              </div>

              <div className="w-full max-w-[395px] h-[780px] bg-slate-900 rounded-[45px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-slate-900/50 relative flex flex-col overflow-hidden">
                {/* Speaker Notch */}
                <div className="w-32 h-5 bg-slate-900 rounded-b-2xl absolute top-3 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* Inner Screen Content */}
                <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[35px] overflow-y-auto pt-6 px-3 pb-16 custom-scrollbar">
                  {renderCurrentView()}
                </div>
              </div>
            </div>
          ) : (
            /* Standard Responsive View */
            <div className="max-w-7xl mx-auto">
              {renderCurrentView()}
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <TaskModal />
      <PortfolioModal />
      <ProjectModal />
      <MilestoneModal />
      <LearningModal />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
