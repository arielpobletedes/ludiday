import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import {
  FolderKanban,
  Plus,
  Briefcase,
  Calendar,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2,
  ArrowRight,
  User,
  Filter,
  Layers,
  Clock,
} from 'lucide-react';

export const ProjectView: React.FC = () => {
  const {
    projects,
    portfolios,
    tasks,
    filters,
    setFilters,
    setActiveView,
    openProjectModal,
    openTaskModal,
    deleteProject,
  } = useApp();

  const [selectedPortfolioFilter, setSelectedPortfolioFilter] = useState<string>(
    filters.portfolioId || 'all'
  );

  const filteredProjects = selectedPortfolioFilter === 'all'
    ? projects
    : projects.filter((p) => p.portfolioId === selectedPortfolioFilter);

  const getHealthBadge = (health: Project['health']) => {
    switch (health) {
      case 'on_track':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> En Meta
          </span>
        );
      case 'at_risk':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> En Riesgo
          </span>
        );
      case 'delayed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Retrasado
          </span>
        );
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-600 dark:text-purple-300">Planificación</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-300">En Progreso</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">Completado</span>;
      case 'on_hold':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-500/15 text-slate-600 dark:text-slate-300">Pausado</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500 font-semibold text-xs flex items-center gap-1">
              <FolderKanban className="w-4 h-4" /> Nivel 2: Táctico
            </span>
            <span className="text-xs text-slate-400">
              ({filteredProjects.length} proyectos)
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Gestión de Proyectos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organiza iniciativas, asigna equipos y realiza seguimiento al cronograma.
          </p>
        </div>

        <button
          onClick={() => openProjectModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Nuevo Proyecto
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Filtrar por Portafolio:
          </span>
        </div>

        <select
          value={selectedPortfolioFilter}
          onChange={(e) => setSelectedPortfolioFilter(e.target.value)}
          className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 sm:w-64"
        >
          <option value="all">Todos los Portafolios</option>
          {portfolios.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const portfolio = portfolios.find((p) => p.id === project.portfolioId);
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const completedTasks = projectTasks.filter((t) => t.status === 'done').length;

          return (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-4">
                
                {/* Portfolio Tag & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: portfolio?.color || '#8b5cf6' }}
                  >
                    {portfolio?.name || 'Sin Portafolio'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {getStatusBadge(project.status)}
                    {getHealthBadge(project.health)}
                  </div>
                </div>

                {/* Project Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Owner & Dates */}
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {project.owner}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" /> {project.startDate} al {project.endDate}
                    </span>
                  </div>
                </div>

                {/* Task Completion Metrics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Avance del Proyecto
                    </span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {project.progress}% ({completedTasks}/{projectTasks.length} tareas)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openProjectModal(project)}
                    title="Editar Proyecto"
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    title="Eliminar Proyecto"
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, projectId: project.id, portfolioId: project.portfolioId }));
                    setActiveView('kanban');
                  }}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Ver Kanban</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
