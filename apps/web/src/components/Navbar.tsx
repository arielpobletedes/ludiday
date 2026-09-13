import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Kanban,
  Search,
  Sun,
  Moon,
  Plus,
  Smartphone,
  Monitor,
  FolderPlus,
  Briefcase,
  CheckSquare,
  Sparkles,
  Database,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    darkMode,
    setDarkMode,
    deviceMode,
    setDeviceMode,
    filters,
    setFilters,
    openTaskModal,
    openProjectModal,
    openPortfolioModal,
    user,
    openAuthModal,
    signOut,
  } = useApp();

  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Kanban className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Ludi<span className="text-brand-500">Day</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Gestión de Portafolios, Proyectos y Tareas
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block relative">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar tareas, proyectos, portafolios, responsables..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-all"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Viewport simulator switcher */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setDeviceMode('responsive')}
              title="Vista de Escritorio / Responsive"
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                deviceMode === 'responsive'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden lg:inline">Escritorio</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              title="Vista Simulador Móvil"
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                deviceMode === 'mobile'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden lg:inline">Móvil</span>
            </button>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCreateDropdown(!showCreateDropdown)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-brand-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Crear</span>
            </button>

            {showCreateDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCreateDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setShowCreateDropdown(false);
                      openTaskModal();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                  >
                    <CheckSquare className="w-4 h-4 text-brand-500" />
                    <span>Nueva Tarea</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateDropdown(false);
                      openProjectModal();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                  >
                    <FolderPlus className="w-4 h-4 text-purple-500" />
                    <span>Nuevo Proyecto</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateDropdown(false);
                      openPortfolioModal();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                  >
                    <Briefcase className="w-4 h-4 text-emerald-500" />
                    <span>Nuevo Portafolio</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Profile / Database Connection Badge */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold"
                title={`Conectado a InsForge PostgreSQL como ${user.email}`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Postgres Online</span>
              </div>
              <button
                onClick={signOut}
                title={`Cerrar sesión (${user.email || 'Usuario'})`}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-brand-500/30">
                  {(user.email || user.profile?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <LogOut className="w-4 h-4 hidden lg:block text-slate-400 hover:text-rose-500 transition-colors" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Conectar DB</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
