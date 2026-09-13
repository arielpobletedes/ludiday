import React from 'react';
import { useApp } from '../context/AppContext';
import { Portfolio } from '../types';
import {
  Briefcase,
  Plus,
  FolderKanban,
  CheckSquare,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Edit2,
  Trash2,
  ArrowRight,
  User,
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const {
    portfolios,
    projects,
    tasks,
    setActiveView,
    setFilters,
    openPortfolioModal,
    openProjectModal,
    openTaskModal,
    deletePortfolio,
  } = useApp();

  const getHealthBadge = (health: Portfolio['health']) => {
    switch (health) {
      case 'on_track':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> En Meta
          </span>
        );
      case 'at_risk':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> En Riesgo
          </span>
        );
      case 'delayed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Retrasado
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-semibold text-xs flex items-center gap-1">
              <Briefcase className="w-4 h-4" /> Nivel 1: Estratégico
            </span>
            <span className="text-xs text-slate-400">
              ({portfolios.length} portafolios activos)
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Gestión de Portafolios
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Supervisa los objetivos corporativos, inversiones y avance agrupado de proyectos y tareas.
          </p>
        </div>

        <button
          onClick={() => openPortfolioModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Nuevo Portafolio
        </button>
      </div>

      {/* Portfolios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => {
          const linkedProjects = projects.filter((p) => p.portfolioId === portfolio.id);
          const linkedTasks = tasks.filter((t) => t.portfolioId === portfolio.id);
          const completedTasks = linkedTasks.filter((t) => t.status === 'done').length;
          const progressPercent = linkedTasks.length > 0
            ? Math.round((completedTasks / linkedTasks.length) * 100)
            : 0;

          return (
            <div
              key={portfolio.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Colored Top Bar */}
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: portfolio.color }}
                />

                <div className="p-5 space-y-4">
                  
                  {/* Category & Health Badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {portfolio.category}
                    </span>
                    {getHealthBadge(portfolio.health)}
                  </div>

                  {/* Portfolio Name & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {portfolio.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {portfolio.description}
                    </p>
                  </div>

                  {/* Owner & Budget */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{portfolio.owner}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{portfolio.budget}</span>
                    </div>
                  </div>

                  {/* Progress & Metrics */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Avance Global Tareas
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {progressPercent}% ({completedTasks}/{linkedTasks.length})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Linked Projects Preview */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold flex items-center gap-1">
                        <FolderKanban className="w-3.5 h-3.5 text-purple-500" /> Proyectos ({linkedProjects.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {linkedProjects.slice(0, 3).map((proj) => (
                        <span
                          key={proj.id}
                          className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-300 font-medium"
                        >
                          {proj.name}
                        </span>
                      ))}
                      {linkedProjects.length > 3 && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400">
                          +{linkedProjects.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openPortfolioModal(portfolio)}
                    title="Editar Portafolio"
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePortfolio(portfolio.id)}
                    title="Eliminar Portafolio"
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, portfolioId: portfolio.id }));
                    setActiveView('projects');
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Ver Proyectos</span>
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
