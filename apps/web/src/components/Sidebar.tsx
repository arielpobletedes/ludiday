import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveView } from '../types';
import {
  Kanban,
  CalendarRange,
  Briefcase,
  FolderKanban,
  CheckSquare,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    portfolios,
    projects,
    tasks,
  } = useApp();

  const navItems: { id: ActiveView; label: string; subLabel: string; icon: React.FC<{ className?: string }>; count: number }[] = [
    {
      id: 'kanban',
      label: 'Kanban Semanal',
      subLabel: 'Vista táctica de la semana',
      icon: Kanban,
      count: tasks.filter((t) => t.status !== 'done').length,
    },
    {
      id: 'monthly',
      label: 'Dashboard Mensual',
      subLabel: 'Grilla mensual & 4 secciones',
      icon: CalendarRange,
      count: tasks.length,
    },
    {
      id: 'portfolios',
      label: 'Portafolios',
      subLabel: 'Nivel estratégico',
      icon: Briefcase,
      count: portfolios.length,
    },
    {
      id: 'projects',
      label: 'Proyectos',
      subLabel: 'Nivel táctico / operativo',
      icon: FolderKanban,
      count: projects.length,
    },
    {
      id: 'tasks',
      label: 'Lista de Tareas',
      subLabel: 'Vista detallada ejecutable',
      icon: CheckSquare,
      count: tasks.length,
    },
  ];

  return (
    <>
      {/* Desktop Navigation Sidebar */}
      <aside className="w-64 hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 shrink-0 justify-between transition-colors">
        <div className="space-y-6">
          
          {/* Navigation Title */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
              Navegación Principal
            </span>

            <nav className="mt-3 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-400'}`} />
                      <div>
                        <div className="text-sm leading-tight">{item.label}</div>
                        <div className={`text-[10px] ${isActive ? 'text-brand-100' : 'text-slate-400'}`}>
                          {item.subLabel}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Metrics Widget */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white dark:from-slate-800 dark:to-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Resumen Ejecutivo
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                En meta
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-center">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-lg font-extrabold text-white">{portfolios.length}</div>
                <div className="text-[10px] text-slate-400">Portafolios</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-lg font-extrabold text-brand-400">{projects.length}</div>
                <div className="text-[10px] text-slate-400">Proyectos</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
          LudiDay Suite &copy; 2026
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all shrink-0 ${
                isActive
                  ? 'text-brand-500 font-bold bg-brand-500/10'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
