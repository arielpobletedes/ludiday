export type HealthStatus = 'on_track' | 'at_risk' | 'delayed';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold';

export type ActiveView = 'kanban' | 'monthly' | 'portfolios' | 'projects' | 'tasks';

export type DeviceMode = 'responsive' | 'mobile';

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  color: string;
  category: string;
  owner: string;
  budget: string;
  health: HealthStatus;
  createdAt: string;
}

export interface Project {
  id: string;
  portfolioId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  health: HealthStatus;
  progress: number;
  startDate: string;
  endDate: string;
  owner: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskAssignee {
  name: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  projectId: string;
  portfolioId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  estimatedHours: number;
  assignee: TaskAssignee;
  subtasks: Subtask[];
  tags: string[];
}

export interface FilterState {
  portfolioId: string;
  projectId: string;
  status: string;
  search: string;
  weekOffset: number;
}

export interface Milestone {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: string; // e.g. 'Despliegue', 'Certificación', 'Lanzamiento'
  taskId?: string; // Optional linked task ID
}

export interface Learning {
  id: string;
  date: string; // YYYY-MM-DD
  lesson: string;
  category: string; // e.g. 'Arquitectura', 'Procesos', 'Equipo'
  taskId?: string; // Optional linked task ID
  actionItem?: string; // Recommended action item
}
