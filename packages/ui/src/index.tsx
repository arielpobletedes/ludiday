import React from 'react';
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  Eye,
  Flame,
  AlertTriangle,
} from 'lucide-react';

export type StatusType = 'todo' | 'in_progress' | 'review' | 'done';
export type PriorityType = 'low' | 'medium' | 'high' | 'urgent';

export interface StatusBadgeProps {
  status: StatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'todo':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          Por Hacer
        </span>
      );
    case 'in_progress':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          En Progreso
        </span>
      );
    case 'review':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          En Revisión
        </span>
      );
    case 'done':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Completada
        </span>
      );
  }
};

export interface PriorityBadgeProps {
  priority: PriorityType;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'urgent':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
          <Flame className="w-3 h-3" /> Urgente
        </span>
      );
    case 'high':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Alta
        </span>
      );
    case 'medium':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
          Media
        </span>
      );
    case 'low':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30">
          Baja
        </span>
      );
  }
};

export interface StatusSquareIconProps {
  status: StatusType;
  title: string;
  onClick?: () => void;
}

export const StatusSquareIcon: React.FC<StatusSquareIconProps> = ({ status, title, onClick }) => {
  switch (status) {
    case 'done':
      return (
        <div
          onClick={onClick}
          className="w-7 h-7 mx-auto rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm flex items-center justify-center transition-all scale-100 hover:scale-110 cursor-pointer"
          title={title}
        >
          <CheckCircle2 className="w-4 h-4" />
        </div>
      );
    case 'in_progress':
      return (
        <div
          onClick={onClick}
          className="w-7 h-7 mx-auto rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-sm flex items-center justify-center transition-all scale-100 hover:scale-110 cursor-pointer animate-pulse"
          title={title}
        >
          <PlayCircle className="w-4 h-4" />
        </div>
      );
    case 'review':
      return (
        <div
          onClick={onClick}
          className="w-7 h-7 mx-auto rounded-lg bg-purple-500 hover:bg-purple-600 text-white shadow-sm flex items-center justify-center transition-all scale-100 hover:scale-110 cursor-pointer"
          title={title}
        >
          <Eye className="w-4 h-4" />
        </div>
      );
    case 'todo':
    default:
      return (
        <div
          onClick={onClick}
          className="w-7 h-7 mx-auto rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center justify-center transition-all scale-100 hover:scale-110 cursor-pointer"
          title={title}
        >
          <Clock className="w-4 h-4" />
        </div>
      );
  }
};
