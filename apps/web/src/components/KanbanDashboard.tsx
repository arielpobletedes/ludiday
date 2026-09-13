import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Calendar as CalendarIcon,
  Columns,
  Layers,
  Briefcase,
  FolderKanban,
  User,
  ListTodo,
} from 'lucide-react';

export const KanbanDashboard: React.FC = () => {
  const {
    portfolios,
    projects,
    tasks,
    filters,
    setFilters,
    getFilteredTasks,
    openTaskModal,
    moveTaskStatus,
    toggleSubtask,
  } = useApp();

  const [kanbanMode, setKanbanMode] = useState<'days' | 'status'>('days');

  // Helper to compute Monday date for weekOffset
  const getMondayForOffset = (offset: number) => {
    const d = new Date();
    const day = d.getDay();
    const diffToMon = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMon + offset * 7);
    return monday;
  };

  const currentMonday = getMondayForOffset(filters.weekOffset);

  // Generate array of 7 days (Mon-Sun) for the current week offset
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const dayDate = new Date(currentMonday);
    dayDate.setDate(currentMonday.getDate() + i);
    const isoString = dayDate.toISOString().split('T')[0];
    const dayName = dayDate.toLocaleDateString('es-ES', { weekday: 'short' });
    const formattedDate = dayDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const isToday = new Date().toISOString().split('T')[0] === isoString;
    return {
      date: isoString,
      dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      formattedDate,
      isToday,
      dayIndex: i,
    };
  });

  const filteredTasks = getFilteredTasks();

  const statusColumns: { id: TaskStatus; label: string; color: string; badgeBg: string }[] = [
    { id: 'todo', label: 'Por Hacer', color: 'border-amber-400', badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { id: 'in_progress', label: 'En Progreso', color: 'border-blue-500', badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { id: 'review', label: 'En Revisión', color: 'border-purple-500', badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
    { id: 'done', label: 'Completada', color: 'border-emerald-500', badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  ];

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1"><Flame className="w-3 h-3" /> Urgente</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Alta</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">Media</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30">Baja</span>;
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus => {
    switch (current) {
      case 'todo': return 'in_progress';
      case 'in_progress': return 'review';
      case 'review': return 'done';
      case 'done': return 'todo';
    }
  };

  const activeFilterCount =
    (filters.portfolioId !== 'all' ? 1 : 0) +
    (filters.projectId !== 'all' ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.search !== '' ? 1 : 0);

  const resetFilters = () => {
    setFilters({
      portfolioId: 'all',
      projectId: 'all',
      status: 'all',
      search: '',
      weekOffset: 0,
    });
  };

  // Filter projects by portfolio if selected
  const availableProjects = filters.portfolioId === 'all'
    ? projects
    : projects.filter((p) => p.portfolioId === filters.portfolioId);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Week Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-500/10 text-brand-500 font-semibold text-xs flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" /> Tablero Kanban Semanal
            </span>
            <span className="text-xs text-slate-400">
              ({filteredTasks.length} tareas mostradas)
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Planificación de la Semana
          </h1>
        </div>

        {/* Week navigation & mode switcher */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* View mode toggle (By Days vs By Status) */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setKanbanMode('days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                kanbanMode === 'days'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Días de Semana</span>
            </button>
            <button
              onClick={() => setKanbanMode('status')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                kanbanMode === 'status'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Columnas Estado</span>
            </button>
          </div>

          {/* Week Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, weekOffset: prev.weekOffset - 1 }))}
              title="Semana Anterior"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setFilters((prev) => ({ ...prev, weekOffset: 0 }))}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                filters.weekOffset === 0
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              Semana Actual
            </button>

            <button
              onClick={() => setFilters((prev) => ({ ...prev, weekOffset: prev.weekOffset + 1 }))}
              title="Siguiente Semana"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Filters Bar (Estado, Portafolio, Proyecto) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Filtros Avanzados
            </span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white">
                {activeFilterCount} activo(s)
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-semibold hover:underline"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Portfolio Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-emerald-500" /> Portafolio:
            </label>
            <select
              value={filters.portfolioId}
              onChange={(e) => setFilters((prev) => ({ ...prev, portfolioId: e.target.value, projectId: 'all' }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">Todos los Portafolios</option>
              {portfolios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <FolderKanban className="w-3 h-3 text-purple-500" /> Proyecto:
            </label>
            <select
              value={filters.projectId}
              onChange={(e) => setFilters((prev) => ({ ...prev, projectId: e.target.value }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">Todos los Proyectos</option>
              {availableProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <ListTodo className="w-3 h-3 text-amber-500" /> Estado de Tarea:
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">Todos los Estados</option>
              <option value="todo">Por Hacer</option>
              <option value="in_progress">En Progreso</option>
              <option value="review">En Revisión</option>
              <option value="done">Completada</option>
            </select>
          </div>

        </div>
      </div>

      {/* KANBAN BOARD: View 1 (7 Days of the Week) */}
      {kanbanMode === 'days' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 overflow-x-auto pb-4 custom-scrollbar">
          {weekDays.map((day) => {
            const dayTasks = filteredTasks.filter((t) => t.dueDate === day.date);

            return (
              <div
                key={day.date}
                className={`flex flex-col min-w-[240px] md:min-w-0 bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-3 border transition-all ${
                  day.isToday
                    ? 'border-brand-500/60 bg-brand-500/5 dark:bg-brand-500/10 ring-1 ring-brand-500/30'
                    : 'border-slate-200 dark:border-slate-800/80'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold uppercase tracking-wider ${day.isToday ? 'text-brand-500' : 'text-slate-600 dark:text-slate-300'}`}>
                        {day.dayName}
                      </span>
                      {day.isToday && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-brand-500 text-white uppercase">
                          Hoy
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">{day.formattedDate}</div>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center">
                    {dayTasks.length}
                  </span>
                </div>

                {/* Task Cards Column */}
                <div className="flex-1 space-y-2.5 min-h-[160px]">
                  {dayTasks.length === 0 ? (
                    <div className="h-28 flex flex-col items-center justify-center text-center p-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                      <span>Sin tareas agendadas</span>
                      <button
                        onClick={() => openTaskModal(null, 'todo')}
                        className="mt-2 text-[10px] text-brand-500 hover:underline font-semibold flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> Agregar
                      </button>
                    </div>
                  ) : (
                    dayTasks.map((task) => {
                      const portfolio = portfolios.find((p) => p.id === task.portfolioId);
                      const project = projects.find((p) => p.id === task.projectId);
                      const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

                      return (
                        <div
                          key={task.id}
                          className="group bg-white dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/70 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
                          onClick={() => openTaskModal(task)}
                        >
                          {/* Portfolio Color Indicator */}
                          {portfolio && (
                            <div
                              className="absolute top-0 left-3 right-3 h-1 rounded-b"
                              style={{ backgroundColor: portfolio.color }}
                            />
                          )}

                          <div className="pt-1 space-y-2">
                            {/* Tags & Priority */}
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                                {project?.name || 'General'}
                              </span>
                              {getPriorityBadge(task.priority)}
                            </div>

                            {/* Title */}
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-brand-500 transition-colors line-clamp-2">
                              {task.title}
                            </h4>

                            {/* Subtasks progress bar */}
                            {task.subtasks.length > 0 && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                  <span>Subtareas</span>
                                  <span>{completedSubtasks}/{task.subtasks.length}</span>
                                </div>
                                <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-brand-500 rounded-full transition-all"
                                    style={{ width: `${(completedSubtasks / task.subtasks.length) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Footer: Status Toggle & Assignee */}
                            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700/50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveTaskStatus(task.id, getNextStatus(task.status));
                                }}
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide transition-colors ${
                                  statusColumns.find((c) => c.id === task.status)?.badgeBg
                                }`}
                                title="Haz clic para avanzar estado"
                              >
                                {statusColumns.find((c) => c.id === task.status)?.label}
                              </button>

                              <div className="flex items-center gap-1">
                                <img
                                  src={task.assignee.avatar}
                                  alt={task.assignee.name}
                                  className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600"
                                  title={task.assignee.name}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Quick Add Button */}
                <button
                  onClick={() => openTaskModal(null, 'todo')}
                  className="mt-3 w-full py-1.5 text-xs text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all font-medium border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Nueva Tarea
                </button>

              </div>
            );
          })}
        </div>
      )}

      {/* KANBAN BOARD: View 2 (By Task Status Columns) */}
      {kanbanMode === 'status' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statusColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col"
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between pb-3 mb-3 border-b-2 ${col.color}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {col.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openTaskModal(null, col.id)}
                    className="p-1 text-slate-400 hover:text-brand-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Column Tasks */}
                <div className="space-y-3 flex-1 min-h-[200px]">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                      <span>No hay tareas en esta columna</span>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const portfolio = portfolios.find((p) => p.id === task.portfolioId);
                      const project = projects.find((p) => p.id === task.projectId);

                      return (
                        <div
                          key={task.id}
                          onClick={() => openTaskModal(task)}
                          className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2.5 relative group"
                        >
                          {portfolio && (
                            <div
                              className="absolute top-0 left-3 right-3 h-1 rounded-b"
                              style={{ backgroundColor: portfolio.color }}
                            />
                          )}

                          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">
                              {project?.name || 'General'}
                            </span>
                            {getPriorityBadge(task.priority)}
                          </div>

                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-500 transition-colors">
                            {task.title}
                          </h4>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{task.dueDate}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px]">{task.assignee.name}</span>
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
