import {
  Portfolio,
  Project,
  Task,
  Milestone,
  Learning,
  FilterCriteria,
  TaskStatus,
} from '../domain/entities';
import {
  IPortfolioRepository,
  IProjectRepository,
  ITaskRepository,
  IMilestoneRepository,
  ILearningRepository,
} from '../domain/repositories';
import {
  defaultPortfolios,
  defaultProjects,
  defaultTasks,
  defaultMilestones,
  defaultLearnings,
} from './mockData';

export class MockPortfolioRepository implements IPortfolioRepository {
  private portfolios: Portfolio[] = [...defaultPortfolios];

  async getAll(): Promise<Portfolio[]> {
    return [...this.portfolios];
  }

  async getById(id: string): Promise<Portfolio | null> {
    return this.portfolios.find((p) => p.id === id) || null;
  }

  async create(portfolio: Omit<Portfolio, 'id' | 'createdAt'>): Promise<Portfolio> {
    const newP: Portfolio = {
      ...portfolio,
      id: `port-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.portfolios.push(newP);
    return newP;
  }

  async update(portfolio: Portfolio): Promise<Portfolio> {
    this.portfolios = this.portfolios.map((p) => (p.id === portfolio.id ? portfolio : p));
    return portfolio;
  }

  async delete(id: string): Promise<void> {
    this.portfolios = this.portfolios.filter((p) => p.id !== id);
  }
}

export class MockProjectRepository implements IProjectRepository {
  private projects: Project[] = [...defaultProjects];

  async getAll(): Promise<Project[]> {
    return [...this.projects];
  }

  async getByPortfolioId(portfolioId: string): Promise<Project[]> {
    return this.projects.filter((p) => p.portfolioId === portfolioId);
  }

  async getById(id: string): Promise<Project | null> {
    return this.projects.find((p) => p.id === id) || null;
  }

  async create(project: Omit<Project, 'id'>): Promise<Project> {
    const newProj: Project = {
      ...project,
      id: `proj-${Date.now()}`,
    };
    this.projects.push(newProj);
    return newProj;
  }

  async update(project: Project): Promise<Project> {
    this.projects = this.projects.map((p) => (p.id === project.id ? project : p));
    return project;
  }

  async delete(id: string): Promise<void> {
    this.projects = this.projects.filter((p) => p.id !== id);
  }
}

export class MockTaskRepository implements ITaskRepository {
  private tasks: Task[] = [...defaultTasks];

  async getAll(): Promise<Task[]> {
    return [...this.tasks];
  }

  async getByCriteria(criteria: FilterCriteria): Promise<Task[]> {
    return this.tasks.filter((task) => {
      if (criteria.portfolioId && criteria.portfolioId !== 'all' && task.portfolioId !== criteria.portfolioId) {
        return false;
      }
      if (criteria.projectId && criteria.projectId !== 'all' && task.projectId !== criteria.projectId) {
        return false;
      }
      if (criteria.status && criteria.status !== 'all' && task.status !== criteria.status) {
        return false;
      }
      if (criteria.search && criteria.search.trim() !== '') {
        const q = criteria.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description.toLowerCase().includes(q);
        const matchesAssignee = task.assignee.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAssignee) {
          return false;
        }
      }
      return true;
    });
  }

  async getById(id: string): Promise<Task | null> {
    return this.tasks.find((t) => t.id === id) || null;
  }

  async create(task: Omit<Task, 'id'>): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
    };
    this.tasks.unshift(newTask);
    return newTask;
  }

  async update(task: Task): Promise<Task> {
    this.tasks = this.tasks.map((t) => (t.id === task.id ? task : t));
    return task;
  }

  async delete(id: string): Promise<void> {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task ${id} not found`);
    task.status = status;
    return { ...task };
  }

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    task.subtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    return { ...task };
  }
}

export class MockMilestoneRepository implements IMilestoneRepository {
  private milestones: Milestone[] = [...defaultMilestones];

  async getAll(): Promise<Milestone[]> {
    return [...this.milestones];
  }

  async create(milestone: Omit<Milestone, 'id'>): Promise<Milestone> {
    const newM: Milestone = {
      ...milestone,
      id: `ms-${Date.now()}`,
    };
    this.milestones.push(newM);
    return newM;
  }

  async delete(id: string): Promise<void> {
    this.milestones = this.milestones.filter((m) => m.id !== id);
  }
}

export class MockLearningRepository implements ILearningRepository {
  private learnings: Learning[] = [...defaultLearnings];

  async getAll(): Promise<Learning[]> {
    return [...this.learnings];
  }

  async create(learning: Omit<Learning, 'id'>): Promise<Learning> {
    const newL: Learning = {
      ...learning,
      id: `lrn-${Date.now()}`,
    };
    this.learnings.push(newL);
    return newL;
  }

  async delete(id: string): Promise<void> {
    this.learnings = this.learnings.filter((l) => l.id !== id);
  }
}
