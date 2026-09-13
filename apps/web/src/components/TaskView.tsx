import React from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../types';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  Clock,
  User,
  AlertTriangle,
  Flame,
  Briefcase,
  FolderKanban,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
} from 'lucide-react';

export const TaskView: React.FC = () => {
  const {
    tasks,
    portfolios,
    projects,
    filters,
    setFilters,
    getFilteredTasks,
    openTaskModal,
    moveTaskStatus,
    deleteTask,
    toggleSubtask,
  } = useApp();

  const filteredTasks = getFilteredTasks();

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1"><Flame className="w-3 h-3" /> Urgente</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Alta</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">Media</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30">Baja</span>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">Por Hacer</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400">En Progreso</span>;
      case 'review':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400">En Revisión</span>;
      case 'done':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">Completada</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-500/10 text-brand-500 font-semibold text-xs flex items-center gap-1">
              <CheckSquare className="w-4 h-4" /> Nivel 3: Operativo
            </span>
            <span className="text-xs text-slate-400">
              ({filteredTasks.length} tareas en lista)
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Lista Detallada de Tareas
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Explora, filtra y edita de forma granular todas las tareas asignadas.
          </p>
        </div>

        <button
          onClick={() => openTaskModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-brand-500/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Nueva Tarea
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Filtros en Lista
            </span>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en tareas..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Portafolio</label>
            <select
              value={filters.portfolioId}
              onChange={(e) => setFilters((prev) => ({ ...prev, portfolioId: e.target.value, projectId: 'all' }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">Todos los Portafolios</option>
              {portfolios.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Proyecto</label>
            <select
              value={filters.projectId}
              onChange={(e) => setFilters((prev) => ({ ...prev, projectId: e.target.value }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">Todos los Proyectos</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium"
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

      {/* Task List / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No se encontraron tareas con los filtros seleccionados.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTasks.map((task) => {
              const portfolio = portfolios.find((p) => p.id === task.portfolioId);
              const project = projects.find((p) => p.id === task.projectId);
              const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

              return (
                <div
                  key={task.id}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer"
                  onClick={() => openTaskModal(task)}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    
                    {/* Checkbox status toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done');
                      }}
                      className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                    >
                      {task.status === 'done' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Title */}
                        <h4 className={`text-sm font-bold leading-snug group-hover:text-brand-500 transition-colors ${
                          task.status === 'done'
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}>
                          {task.title}
                        </h4>

                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                      </div>

                      {/* Description snippet */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {task.description}
                      </p>

                      {/* Badges: Portfolio, Project, Tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        {portfolio && (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                            style={{ backgroundColor: portfolio.color }}
                          >
                            {portfolio.name}
                          </span>
                        )}
                        {project && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {project.name}
                          </span>
                        )}
                        {task.subtasks.length > 0 && (
                          <span className="text-[10px] text-slate-400">
                            {completedSubtasks}/{task.subtasks.length} subtareas
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Assignee & Due Date & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 text-xs text-slate-500 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.dueDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        src={task.assignee.avatar}
                        alt={task.assignee.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600"
                        title={task.assignee.name}
                      />
                      <span className="hidden sm:inline font-medium text-slate-700 dark:text-slate-300">
                        {task.assignee.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openTaskModal(task);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
