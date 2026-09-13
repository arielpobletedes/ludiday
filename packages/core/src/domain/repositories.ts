import { Portfolio, Project, Task, Milestone, Learning, FilterCriteria, TaskStatus } from './entities';

export interface IPortfolioRepository {
  getAll(): Promise<Portfolio[]>;
  getById(id: string): Promise<Portfolio | null>;
  create(portfolio: Omit<Portfolio, 'id' | 'createdAt'>): Promise<Portfolio>;
  update(portfolio: Portfolio): Promise<Portfolio>;
  delete(id: string): Promise<void>;
}

export interface IProjectRepository {
  getAll(): Promise<Project[]>;
  getByPortfolioId(portfolioId: string): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  create(project: Omit<Project, 'id'>): Promise<Project>;
  update(project: Project): Promise<Project>;
  delete(id: string): Promise<void>;
}

export interface ITaskRepository {
  getAll(): Promise<Task[]>;
  getByCriteria(criteria: FilterCriteria): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(task: Omit<Task, 'id'>): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: TaskStatus): Promise<Task>;
  toggleSubtask(taskId: string, subtaskId: string): Promise<Task>;
}

export interface IMilestoneRepository {
  getAll(): Promise<Milestone[]>;
  create(milestone: Omit<Milestone, 'id'>): Promise<Milestone>;
  delete(id: string): Promise<void>;
}

export interface ILearningRepository {
  getAll(): Promise<Learning[]>;
  create(learning: Omit<Learning, 'id'>): Promise<Learning>;
  delete(id: string): Promise<void>;
}
