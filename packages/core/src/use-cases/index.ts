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

export class GetWeeklyKanbanTasksUseCase {
  constructor(private taskRepo: ITaskRepository) {}

  async execute(criteria: FilterCriteria, weekOffset: number = 0): Promise<{
    tasks: Task[];
    weekDays: { date: string; dayName: string; formattedDate: string; isToday: boolean }[];
  }> {
    const tasks = await this.taskRepo.getByCriteria(criteria);

    // Calculate current Monday for weekOffset
    const d = new Date();
    const day = d.getDay();
    const diffToMon = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMon + weekOffset * 7);

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const isoString = dayDate.toISOString().split('T')[0];
      const dayName = dayDate.toLocaleDateString('es-ES', { weekday: 'short' });
      const formattedDate = dayDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      const isToday = new Date().toISOString().split('T')[0] === isoString;

      return {
        date: isoString,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        formattedDate,
        isToday,
      };
    });

    return { tasks, weekDays };
  }
}

export class GetMonthlyActivityGridUseCase {
  constructor(
    private taskRepo: ITaskRepository,
    private projectRepo: IProjectRepository
  ) {}

  async execute(targetDate: Date = new Date()): Promise<{
    daysInMonth: { dayNum: number; isoString: string; dayOfWeek: string; isToday: boolean }[];
    tasks: Task[];
    activeProjects: Project[];
    monthTitle: string;
  }> {
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const monthName = targetDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const monthTitle = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const daysInMonth = Array.from({ length: totalDays }).map((_, i) => {
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

    const allTasks = await this.taskRepo.getAll();
    const allProjects = await this.projectRepo.getAll();

    const activeProjects = allProjects.filter((p) =>
      allTasks.some((t) => t.projectId === p.id)
    );

    return {
      daysInMonth,
      tasks: allTasks,
      activeProjects,
      monthTitle,
    };
  }
}

export class ManageTaskUseCase {
  constructor(private taskRepo: ITaskRepository) {}

  async create(task: Omit<Task, 'id'>): Promise<Task> {
    return this.taskRepo.create(task);
  }

  async update(task: Task): Promise<Task> {
    return this.taskRepo.update(task);
  }

  async updateStatus(id: string, newStatus: TaskStatus): Promise<Task> {
    return this.taskRepo.updateStatus(id, newStatus);
  }

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
    return this.taskRepo.toggleSubtask(taskId, subtaskId);
  }

  async delete(id: string): Promise<void> {
    return this.taskRepo.delete(id);
  }
}

export class ManagePortfolioUseCase {
  constructor(private portfolioRepo: IPortfolioRepository) {}

  async create(portfolio: Omit<Portfolio, 'id' | 'createdAt'>): Promise<Portfolio> {
    return this.portfolioRepo.create(portfolio);
  }

  async update(portfolio: Portfolio): Promise<Portfolio> {
    return this.portfolioRepo.update(portfolio);
  }

  async delete(id: string): Promise<void> {
    return this.portfolioRepo.delete(id);
  }
}

export class ManageProjectUseCase {
  constructor(private projectRepo: IProjectRepository) {}

  async create(project: Omit<Project, 'id'>): Promise<Project> {
    return this.projectRepo.create(project);
  }

  async update(project: Project): Promise<Project> {
    return this.projectRepo.update(project);
  }

  async delete(id: string): Promise<void> {
    return this.projectRepo.delete(id);
  }
}

export class ManageMilestoneUseCase {
  constructor(private milestoneRepo: IMilestoneRepository) {}

  async create(m: Omit<Milestone, 'id'>): Promise<Milestone> {
    return this.milestoneRepo.create(m);
  }

  async delete(id: string): Promise<void> {
    return this.milestoneRepo.delete(id);
  }
}

export class ManageLearningUseCase {
  constructor(private learningRepo: ILearningRepository) {}

  async create(l: Omit<Learning, 'id'>): Promise<Learning> {
    return this.learningRepo.create(l);
  }

  async delete(id: string): Promise<void> {
    return this.learningRepo.delete(id);
  }
}
