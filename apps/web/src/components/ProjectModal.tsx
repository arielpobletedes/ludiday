import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HealthStatus, Project, ProjectStatus } from '../types';
import { X, FolderKanban, Trash2 } from 'lucide-react';

export const ProjectModal: React.FC = () => {
  const {
    isProjectModalOpen,
    editingProject,
    closeProjectModal,
    portfolios,
    addProject,
    updateProject,
    deleteProject,
  } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [portfolioId, setPortfolioId] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [health, setHealth] = useState<HealthStatus>('on_track');
  const [progress, setProgress] = useState<number>(50);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [owner, setOwner] = useState('Ana Beltrán');

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setDescription(editingProject.description);
      setPortfolioId(editingProject.portfolioId);
      setStatus(editingProject.status);
      setHealth(editingProject.health);
      setProgress(editingProject.progress);
      setStartDate(editingProject.startDate);
      setEndDate(editingProject.endDate);
      setOwner(editingProject.owner);
    } else {
      setName('');
      setDescription('');
      setPortfolioId(portfolios[0]?.id || '');
      setStatus('in_progress');
      setHealth('on_track');
      setProgress(0);
      setStartDate(new Date().toISOString().split('T')[0]);
      const future = new Date();
      future.setDate(future.getDate() + 30);
      setEndDate(future.toISOString().split('T')[0]);
      setOwner('Ana Beltrán');
    }
  }, [editingProject, isProjectModalOpen, portfolios]);

  if (!isProjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const projectData = {
      name,
      description,
      portfolioId,
      status,
      health,
      progress: Number(progress),
      startDate,
      endDate,
      owner,
    };

    if (editingProject) {
      updateProject({ ...editingProject, ...projectData });
    } else {
      addProject(projectData);
    }
    closeProjectModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold">
              {editingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
            </h3>
          </div>
          <button
            onClick={closeProjectModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              required
              placeholder="ej. Lanzamiento Campaña Q4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              placeholder="Detalles de la iniciativa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Portafolio Perteneciente
              </label>
              <select
                value={portfolioId}
                onChange={(e) => setPortfolioId(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium"
              >
                {portfolios.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Líder de Proyecto
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Estado del Proyecto
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="planning">Planificación</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completado</option>
                <option value="on_hold">Pausado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Salud del Proyecto
              </label>
              <select
                value={health}
                onChange={(e) => setHealth(e.target.value as HealthStatus)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="on_track">En Meta</option>
                <option value="at_risk">En Riesgo</option>
                <option value="delayed">Retrasado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Porcentaje de Avance
              </label>
              <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">
                {progress}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {editingProject ? (
              <button
                type="button"
                onClick={() => {
                  deleteProject(editingProject.id);
                  closeProjectModal();
                }}
                className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeProjectModal}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-extrabold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md shadow-purple-500/20 transition-all active:scale-95"
              >
                {editingProject ? 'Guardar Cambios' : 'Crear Proyecto'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
