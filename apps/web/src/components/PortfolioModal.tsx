import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HealthStatus, Portfolio } from '../types';
import { X, Briefcase, Trash2 } from 'lucide-react';

export const PortfolioModal: React.FC = () => {
  const {
    isPortfolioModalOpen,
    editingPortfolio,
    closePortfolioModal,
    addPortfolio,
    updatePortfolio,
    deletePortfolio,
  } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [category, setCategory] = useState('Estratégico');
  const [owner, setOwner] = useState('Carlos Mendoza');
  const [budget, setBudget] = useState('$100,000 USD');
  const [health, setHealth] = useState<HealthStatus>('on_track');

  useEffect(() => {
    if (editingPortfolio) {
      setName(editingPortfolio.name);
      setDescription(editingPortfolio.description);
      setColor(editingPortfolio.color);
      setCategory(editingPortfolio.category);
      setOwner(editingPortfolio.owner);
      setBudget(editingPortfolio.budget);
      setHealth(editingPortfolio.health);
    } else {
      setName('');
      setDescription('');
      setColor('#3b82f6');
      setCategory('Estratégico');
      setOwner('Carlos Mendoza');
      setBudget('$100,000 USD');
      setHealth('on_track');
    }
  }, [editingPortfolio, isPortfolioModalOpen]);

  if (!isPortfolioModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const portfolioData = {
      name,
      description,
      color,
      category,
      owner,
      budget,
      health,
    };

    if (editingPortfolio) {
      updatePortfolio({ ...editingPortfolio, ...portfolioData });
    } else {
      addPortfolio(portfolioData);
    }
    closePortfolioModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-bold">
              {editingPortfolio ? 'Editar Portafolio' : 'Crear Nuevo Portafolio'}
            </h3>
          </div>
          <button
            onClick={closePortfolioModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Nombre del Portafolio *
            </label>
            <input
              type="text"
              required
              placeholder="ej. Innovación & Transformación Digital"
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
              placeholder="Objetivos estratégicos y alcances generales..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Categoría
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Color Distintivo
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-9 h-9 p-0 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-slate-500">{color}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Líder / Owner
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Presupuesto
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Salud
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

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {editingPortfolio ? (
              <button
                type="button"
                onClick={() => {
                  deletePortfolio(editingPortfolio.id);
                  closePortfolioModal();
                }}
                className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closePortfolioModal}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/20 transition-all active:scale-95"
              >
                {editingPortfolio ? 'Guardar Cambios' : 'Crear Portafolio'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
