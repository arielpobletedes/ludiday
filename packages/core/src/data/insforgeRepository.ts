import {
  Portfolio,
  Project,
  Task,
  Subtask,
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
import { getInsForge } from './insforgeClient';

// Helper: Parse currency string like "$120,000 USD" to numeric 120000
function parseBudget(budgetStr?: string): number {
  if (!budgetStr) return 0;
  const clean = budgetStr.replace(/[^0-9.]/g, '');
  return parseFloat(clean) || 0;
}

// ============================================================================
// InsForgePortfolioRepository
// ============================================================================
export class InsForgePortfolioRepository implements IPortfolioRepository {
  async getAll(): Promise<Portfolio[]> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map(this.mapDbToEntity);
  }

  async getById(id: string): Promise<Portfolio | null> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? this.mapDbToEntity(data) : null;
  }

  async create(portfolio: Omit<Portfolio, 'id' | 'createdAt'>): Promise<Portfolio> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('portfolios')
      .insert([{
        name: portfolio.name,
        description: portfolio.description || '',
        color: portfolio.color || '#3b82f6',
        category: portfolio.category || 'Estratégico',
        owner: portfolio.owner || '',
        budget: parseBudget(portfolio.budget),
        budget_currency: 'USD',
        health: portfolio.health || 'on_track',
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapDbToEntity(data);
  }

  async update(portfolio: Portfolio): Promise<Portfolio> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('portfolios')
      .update({
        name: portfolio.name,
        description: portfolio.description || '',
        color: portfolio.color || '#3b82f6',
        category: portfolio.category || 'Estratégico',
        owner: portfolio.owner || '',
        budget: parseBudget(portfolio.budget),
        health: portfolio.health || 'on_track',
      })
      .eq('id', portfolio.id)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const insforge = getInsForge();
    const { error } = await insforge.database
      .from('portfolios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapDbToEntity(row: any): Portfolio {
    const numBudget = Number(row.budget) || 0;
    const formattedBudget = `$${numBudget.toLocaleString('en-US')} ${row.budget_currency || 'USD'}`;
    return {
      id: row.id,
      name: row.name || '',
      description: row.description || '',
      color: row.color || '#3b82f6',
      category: row.category || 'Estratégico',
      owner: row.owner || '',
      budget: formattedBudget,
      health: row.health || 'on_track',
      createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    };
  }
}

// ============================================================================
// InsForgeProjectRepository
// ============================================================================
export class InsForgeProjectRepository implements IProjectRepository {
  async getAll(): Promise<Project[]> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map(this.mapDbToEntity);
  }

  async getByPortfolioId(portfolioId: string): Promise<Project[]> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('projects')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map(this.mapDbToEntity);
  }

  async getById(id: string): Promise<Project | null> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? this.mapDbToEntity(data) : null;
  }

  async create(project: Omit<Project, 'id'>): Promise<Project> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('projects')
      .insert([{
        portfolio_id: project.portfolioId,
        name: project.name,
        description: project.description || '',
        status: project.status || 'planning',
        health: project.health || 'on_track',
        progress: project.progress ?? 0,
        start_date: project.startDate || null,
        end_date: project.endDate || null,
        owner: project.owner || '',
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapDbToEntity(data);
  }

  async update(project: Project): Promise<Project> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('projects')
      .update({
        portfolio_id: project.portfolioId,
        name: project.name,
        description: project.description || '',
        status: project.status || 'planning',
        health: project.health || 'on_track',
        progress: project.progress ?? 0,
        start_date: project.startDate || null,
        end_date: project.endDate || null,
        owner: project.owner || '',
      })
      .eq('id', project.id)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const insforge = getInsForge();
    const { error } = await insforge.database
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapDbToEntity(row: any): Project {
    return {
      id: row.id,
      portfolioId: row.portfolio_id,
      name: row.name || '',
      description: row.description || '',
      status: row.status || 'planning',
      health: row.health || 'on_track',
      progress: row.progress ?? 0,
      startDate: row.start_date || '',
      endDate: row.end_date || '',
      owner: row.owner || '',
    };
  }
}

// ============================================================================
// InsForgeTaskRepository
// ============================================================================
export class InsForgeTaskRepository implements ITaskRepository {
  async getAll(): Promise<Task[]> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('tasks')
      .select('*, subtasks(*)')
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapDbToEntity);
  }

  async getByCriteria(criteria: FilterCriteria): Promise<Task[]> {
    const all = await this.getAll();
    return all.filter((task) => {
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
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('tasks')
      .select('*, subtasks(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? this.mapDbToEntity(data) : null;
  }

  async create(task: Omit<Task, 'id'>): Promise<Task> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('tasks')
      .insert([{
        project_id: task.projectId,
        portfolio_id: task.portfolioId,
        title: task.title,
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        due_date: task.dueDate,
        estimated_hours: task.estimatedHours || 0,
        assignee_name: task.assignee?.name || '',
        assignee_avatar: task.assignee?.avatar || '',
        assignee_role: task.assignee?.role || '',
        tags: task.tags || [],
      }])
      .select()
      .single();

    if (error) throw error;

    // Insert subtasks if present
    if (task.subtasks && task.subtasks.length > 0) {
      const subtaskPayloads = task.subtasks.map((st, index) => ({
        task_id: data.id,
        title: st.title,
        completed: Boolean(st.completed),
        position: index,
      }));
      await insforge.database.from('subtasks').insert(subtaskPayloads);
    }

    const created = await this.getById(data.id);
    return created!;
  }

  async update(task: Task): Promise<Task> {
    const insforge = getInsForge();
    const { error } = await insforge.database
      .from('tasks')
      .update({
        project_id: task.projectId,
        portfolio_id: task.portfolioId,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.dueDate,
        estimated_hours: task.estimatedHours || 0,
        assignee_name: task.assignee?.name || '',
        assignee_avatar: task.assignee?.avatar || '',
        assignee_role: task.assignee?.role || '',
        tags: task.tags || [],
      })
      .eq('id', task.id);

    if (error) throw error;

    // Synchronize subtasks if provided
    if (task.subtasks) {
      // Delete existing and insert new
      await insforge.database.from('subtasks').delete().eq('task_id', task.id);
      if (task.subtasks.length > 0) {
        const subtaskPayloads = task.subtasks.map((st, idx) => ({
          task_id: task.id,
          title: st.title,
          completed: Boolean(st.completed),
          position: idx,
        }));
        await insforge.database.from('subtasks').insert(subtaskPayloads);
      }
    }

    const updated = await this.getById(task.id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    const insforge = getInsForge();
    const { error } = await insforge.database
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const insforge = getInsForge();
    const { error } = await insforge.database
      .from('tasks')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    const task = await this.getById(id);
    if (!task) throw new Error(`Task ${id} not found`);
    return task;
  }

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const insforge = getInsForge();
    const { data: st, error: stErr } = await insforge.database
      .from('subtasks')
      .select('completed')
      .eq('id', subtaskId)
      .single();

    if (stErr) throw stErr;

    const { error: updErr } = await insforge.database
      .from('subtasks')
      .update({ completed: !st.completed })
      .eq('id', subtaskId);

    if (updErr) throw updErr;

    const task = await this.getById(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    return task;
  }

  private mapDbToEntity(row: any): Task {
    const subtasks: Subtask[] = (row.subtasks || [])
      .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
      .map((st: any) => ({
        id: st.id,
        title: st.title || '',
        completed: Boolean(st.completed),
      }));

    return {
      id: row.id,
      projectId: row.project_id,
      portfolioId: row.portfolio_id,
      title: row.title || '',
      description: row.description || '',
      status: row.status || 'todo',
      priority: row.priority || 'medium',
      dueDate: row.due_date || '',
      estimatedHours: Number(row.estimated_hours) || 0,
      assignee: {
        name: row.assignee_name || '',
        avatar: row.assignee_avatar || '',
        role: row.assignee_role || '',
      },
      subtasks,
      tags: Array.isArray(row.tags) ? row.tags : [],
    };
  }
}

// ============================================================================
// InsForgeMilestoneRepository
// ============================================================================
export class InsForgeMilestoneRepository implements IMilestoneRepository {
  async getAll(): Promise<Milestone[]> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('milestones')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return (data || []).map((m: any) => ({
      id: m.id,
      date: m.date || '',
      title: m.title || '',
      category: m.category || 'General',
      taskId: m.task_id || undefined,
    }));
  }

  async create(milestone: Omit<Milestone, 'id'>): Promise<Milestone> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('milestones')
      .insert([{
        date: milestone.date,
        title: milestone.title,
        category: milestone.category || 'General',
        task_id: milestone.taskId || null,
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      date: data.date,
      title: data.title,
      category: data.category,
      taskId: data.task_id || undefined,
    };
  }

  async delete(id: string): Promise<void> {
    const insforge = getInsForge();
    const { error } = await insforge.database
      .from('milestones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

// ============================================================================
// InsForgeLearningRepository
// ============================================================================
export class InsForgeLearningRepository implements ILearningRepository {
  async getAll(): Promise<Learning[]> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('learnings')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return (data || []).map((l: any) => ({
      id: l.id,
      date: l.date || '',
      lesson: l.lesson || '',
      category: l.category || 'General',
      taskId: l.task_id || undefined,
      actionItem: l.action_item || undefined,
    }));
  }

  async create(learning: Omit<Learning, 'id'>): Promise<Learning> {
    const insforge = getInsForge();
    const { data, error } = await insforge.database
      .from('learnings')
      .insert([{
        date: learning.date,
        lesson: learning.lesson,
        category: learning.category || 'General',
        action_item: learning.actionItem || null,
        task_id: learning.taskId || null,
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      date: data.date,
      lesson: data.lesson,
      category: data.category,
      actionItem: data.action_item || undefined,
      taskId: data.task_id || undefined,
    };
  }

  async delete(id: string): Promise<void> {
    const insforge = getInsForge();
    const { error } = await insforge.database
      .from('learnings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
