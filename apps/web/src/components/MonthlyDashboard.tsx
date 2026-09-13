import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskStatus } from '../types';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Target,
  Award,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Briefcase,
  Link as LinkIcon,
  PlayCircle,
  Eye,
  CheckSquare,
} from 'lucide-react';

export const MonthlyDashboard: React.FC = () => {
  const {
    tasks,
    projects,
    portfolios,
    milestones,
    learnings,
    openTaskModal,
    openMilestoneModal,
    openLearningModal,
    deleteMilestone,
    deleteLearning,
    moveTaskStatus,
  } = useApp();

  // Selected Month/Year state (Default current month: Septiembre 2026)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monthName = selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const formattedMonthTitle = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Month navigation
  const handlePrevMonth = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const handleCurrentMonth = () => {
    setSelectedDate(new Date());
  };

  // Get total days in selected month
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create array of days (1 to daysInMonth)
  const daysArray = Array.from({ length: daysInMonth }).map((_, i) => {
    const dayNum = i + 1;
    const d = new Date(year, month, dayNum);
    const isoString = d.toISOString().split('T')[0];
    const dayOfWeek = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const isToday = new Date().toISOString().split('T')[0] === isoString;
    return {
      dayNum,
      isoString,
      dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
      isToday,
    };
  });

  // Filter projects with active tasks in this month
  const activeProjectsThisMonth = projects.filter((proj) => {
    const projTasks = tasks.filter((t) => t.projectId === proj.id);
    return projTasks.length > 0;
  });

  // Objectives: Tasks due or marked for this month
  const monthlyObjectives = tasks.slice(0, 6);

  // Helper to render Status Color Square / Icon
  const renderStatusCellSquare = (status: TaskStatus, taskTitle: string, dueDate: string) => {
    switch (status) {
      case 'done':
        return (
          <div
            className="w-7 h-7 mx-auto rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm flex items-center justify-center transition-all scale-100 hover:scale-110 cursor-pointer"
            title={`[Completada] ${taskTitle} - Fecha: ${dueDate} (Clic para cambiar)`}
          >
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'in_progress':
        return (
          <div
            className="w-7 h-7 mx-auto rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-sm flex items-center justify-center transition-all scale-100 hover:scale-110 cursor-pointer animate-pulse"
            title={`[En Progreso] ${taskTitle} - Fecha: ${dueDate} (Clic para cambiar)`}
          >
            <PlayCircle className="w-4 h-4" />
          </div>
        );
      case 'review':
        return (
          <div
            className="w-7 h-7 mx-auto rounded-lg bg-purple-500 hover:bg-purple-600 text-white shadow-sm flex items-center justify-center transition-all scale-100 hover:scale-110 cursor-pointer"
            title={`[En Revisión] ${taskTitle} - Fecha: ${dueDate} (Clic para cambiar)`}
          >
            <Eye className="w-4 h-4" />
          </div>
        );
      case 'todo':
      default:
        return (
          <div
            className="w-7 h-7 mx-auto rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center justify-center transition-all scale-100 hover:scale-110 cursor-pointer"
            title={`[Por Hacer] ${taskTitle} - Fecha: ${dueDate} (Clic para cambiar)`}
          >
            <Clock className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Month Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-500/10 text-brand-500 font-semibold text-xs flex items-center gap-1">
              <CalendarDays className="w-4 h-4" /> Dashboard Mensual Integrado
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Vista de Actividad Mensual & Objetivos
          </h1>
        </div>

        {/* Month Selector Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Mes Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 text-xs font-extrabold text-slate-800 dark:text-white min-w-[140px] text-center">
            {formattedMonthTitle}
          </span>

          <button
            onClick={handleNextMonth}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Mes Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleCurrentMonth}
            className="px-2.5 py-1 text-[11px] font-bold bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors ml-1"
          >
            Hoy
          </button>
        </div>
      </div>

      {/* DUAL PANEL LAYOUT (Left: Grilla Actividad Diaria, Right: 4 Secciones) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL IZQUIERDO: Grilla de Actividad Diaria (Filas = Días del mes, Columnas = Tareas sin texto visible, solo tooltip per doc/04-prompt.txt) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Grilla de Actividad Diaria
                </h3>
              </div>

              {/* Leyenda de Colores e Íconos por Estado */}
              <div className="hidden sm:flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" /> Por Hacer
                </span>
                <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                  <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block" /> En Progreso
                </span>
                <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                  <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block" /> En Revisión
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Hecho
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Pasa el cursor sobre los encabezados de columna para ver el título de cada tarea en el tooltip.
            </p>

            {/* Matrix Table */}
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="p-2 border-b border-r border-slate-200 dark:border-slate-700 min-w-[70px] bg-slate-100 dark:bg-slate-800 text-center">
                      Día
                    </th>

                    {/* Column Headers WITHOUT text, ONLY Tooltip per doc/04-prompt.txt */}
                    {tasks.map((task, index) => {
                      const portfolio = portfolios.find((p) => p.id === task.portfolioId);
                      const project = projects.find((p) => p.id === task.projectId);
                      const tooltipText = `Tarea ${index + 1}: ${task.title}\nProyecto: ${project?.name || 'General'}\nPortafolio: ${portfolio?.name || 'General'}\nPrioridad: ${task.priority.toUpperCase()}\nEstado: ${task.status}`;

                      return (
                        <th
                          key={task.id}
                          className="p-2 border-b border-r border-slate-200 dark:border-slate-700 min-w-[48px] text-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group relative"
                          onClick={() => openTaskModal(task)}
                          title={tooltipText}
                        >
                          <div className="flex flex-col items-center justify-center gap-1 py-1">
                            <span
                              className="w-3 h-3 rounded-full shadow-xs border border-white dark:border-slate-900 shrink-0"
                              style={{ backgroundColor: portfolio?.color || '#3b82f6' }}
                            />
                            <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700/80">
                              T{index + 1}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {daysArray.map((day) => (
                    <tr
                      key={day.dayNum}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        day.isToday ? 'bg-brand-500/10 dark:bg-brand-500/15 font-bold' : ''
                      }`}
                    >
                      {/* Day Column */}
                      <td className="p-2 border-r border-slate-200 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-300 text-[11px] whitespace-nowrap bg-slate-50/50 dark:bg-slate-900/50 text-center">
                        {day.dayNum} {day.dayOfWeek}
                        {day.isToday && (
                          <span className="ml-1 px-1 py-0.2 rounded text-[8px] bg-brand-500 text-white font-extrabold">
                            HOY
                          </span>
                        )}
                      </td>

                      {/* Task Activity Cell */}
                      {tasks.map((task) => {
                        const isDueDate = task.dueDate === day.isoString;

                        return (
                          <td
                            key={task.id}
                            className="p-1.5 border-r border-slate-200 dark:border-slate-800 text-center align-middle"
                          >
                            {isDueDate ? (
                              <div
                                onClick={() => {
                                  const nextStatus: TaskStatus =
                                    task.status === 'todo' ? 'in_progress' :
                                    task.status === 'in_progress' ? 'review' :
                                    task.status === 'review' ? 'done' : 'todo';
                                  moveTaskStatus(task.id, nextStatus);
                                }}
                              >
                                {renderStatusCellSquare(task.status, task.title, task.dueDate)}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-300 dark:text-slate-700">
                                ·
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: 4 SECCIONES ESTRATÉGICAS */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* SECCIÓN 1: Proyectos con Actividades del Mes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  1. Proyectos con Actividades del Mes
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                {activeProjectsThisMonth.length} activos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeProjectsThisMonth.map((project) => {
                const portfolio = portfolios.find((p) => p.id === project.portfolioId);
                const projTasks = tasks.filter((t) => t.projectId === project.id);
                const completedCount = projTasks.filter((t) => t.status === 'done').length;

                return (
                  <div
                    key={project.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span
                        className="px-2 py-0.5 rounded text-[9px] font-bold text-white"
                        style={{ backgroundColor: portfolio?.color || '#8b5cf6' }}
                      >
                        {portfolio?.name}
                      </span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {project.progress}% Avance
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {project.name}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{projTasks.length} actividades en mes</span>
                      <span>{completedCount} completadas</span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECCIÓN 2: Objetivos del Mes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  2. Objetivos a Finalizar en el Mes
                </h3>
              </div>
              <button
                onClick={() => openTaskModal(null, 'todo')}
                className="text-xs text-brand-500 hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Nuevo Objetivo
              </button>
            </div>

            <div className="space-y-2">
              {monthlyObjectives.map((task) => {
                const isDone = task.status === 'done';
                return (
                  <div
                    key={task.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <button
                      onClick={() => moveTaskStatus(task.id, isDone ? 'todo' : 'done')}
                      className="flex items-center gap-2.5 text-left flex-1"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                        {task.title}
                      </span>
                    </button>

                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {task.dueDate}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECCIÓN 3: Hitos Registrados Manualmente */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  3. Hitos (Eventos Significativos)
                </h3>
              </div>
              <button
                onClick={openMilestoneModal}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Registrar Hito
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase text-slate-400 font-bold">
                    <th className="pb-2">Fecha</th>
                    <th className="pb-2">Hito / Evento</th>
                    <th className="pb-2">Categoría</th>
                    <th className="pb-2">Tarea Asociada</th>
                    <th className="pb-2 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {milestones.map((m) => {
                    const linkedTask = tasks.find((t) => t.id === m.taskId);
                    return (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2 font-medium text-slate-500">{m.date}</td>
                        <td className="py-2 font-bold text-slate-800 dark:text-slate-100">{m.title}</td>
                        <td className="py-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            {m.category}
                          </span>
                        </td>
                        <td className="py-2 text-slate-500">
                          {linkedTask ? (
                            <span className="flex items-center gap-1 text-[10px] text-brand-500 font-semibold truncate max-w-[120px]">
                              <LinkIcon className="w-3 h-3" /> {linkedTask.title}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Sin vincular</span>
                          )}
                        </td>
                        <td className="py-2 text-right">
                          <button
                            onClick={() => deleteMilestone(m.id)}
                            className="p-1 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECCIÓN 4: Aprendizajes / Lecciones Aprendidas */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  4. Aprendizajes & Lecciones Aprendidas
                </h3>
              </div>
              <button
                onClick={openLearningModal}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Registrar Aprendizaje
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase text-slate-400 font-bold">
                    <th className="pb-2">Fecha</th>
                    <th className="pb-2">Lección Aprendida</th>
                    <th className="pb-2">Acción Recomendada</th>
                    <th className="pb-2">Tarea Asociada</th>
                    <th className="pb-2 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {learnings.map((l) => {
                    const linkedTask = tasks.find((t) => t.id === l.taskId);
                    return (
                      <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2 font-medium text-slate-500">{l.date}</td>
                        <td className="py-2 font-semibold text-slate-800 dark:text-slate-100 max-w-[160px]">
                          {l.lesson}
                        </td>
                        <td className="py-2 text-emerald-600 dark:text-emerald-400 font-medium max-w-[150px]">
                          {l.actionItem || '—'}
                        </td>
                        <td className="py-2 text-slate-500">
                          {linkedTask ? (
                            <span className="flex items-center gap-1 text-[10px] text-brand-500 font-semibold truncate max-w-[120px]">
                              <LinkIcon className="w-3 h-3" /> {linkedTask.title}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Sin vincular</span>
                          )}
                        </td>
                        <td className="py-2 text-right">
                          <button
                            onClick={() => deleteLearning(l.id)}
                            className="p-1 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
