import { getInsForge } from './insforgeClient';
import {
  defaultPortfolios,
  defaultProjects,
  defaultTasks,
  defaultMilestones,
  defaultLearnings,
} from './mockData';

export async function seedInitialUserData(): Promise<void> {
  const insforge = getInsForge();

  // Check if portfolios already exist
  const { data: existingPortfolios, error: checkErr } = await insforge.database
    .from('portfolios')
    .select('id')
    .limit(1);

  if (checkErr || (existingPortfolios && existingPortfolios.length > 0)) {
    // Already has data or error
    return;
  }

  const portfolioIdMap = new Map<string, string>();
  const projectIdMap = new Map<string, string>();
  const taskIdMap = new Map<string, string>();

  // 1. Seed Portfolios
  for (const p of defaultPortfolios) {
    const numBudget = parseFloat(p.budget.replace(/[^0-9.]/g, '')) || 0;
    const { data: inserted, error: pErr } = await insforge.database
      .from('portfolios')
      .insert([{
        name: p.name,
        description: p.description,
        color: p.color,
        category: p.category,
        owner: p.owner,
        budget: numBudget,
        budget_currency: 'USD',
        health: p.health,
      }])
      .select()
      .single();

    if (pErr) {
      console.error('Error seeding portfolio:', pErr);
      continue;
    }
    if (inserted) {
      portfolioIdMap.set(p.id, inserted.id);
    }
  }

  // 2. Seed Projects
  for (const proj of defaultProjects) {
    const realPortfolioId = portfolioIdMap.get(proj.portfolioId);
    if (!realPortfolioId) continue;

    const { data: insertedProj, error: prErr } = await insforge.database
      .from('projects')
      .insert([{
        portfolio_id: realPortfolioId,
        name: proj.name,
        description: proj.description,
        status: proj.status,
        health: proj.health,
        progress: proj.progress,
        start_date: proj.startDate || null,
        end_date: proj.endDate || null,
        owner: proj.owner,
      }])
      .select()
      .single();

    if (prErr) {
      console.error('Error seeding project:', prErr);
      continue;
    }
    if (insertedProj) {
      projectIdMap.set(proj.id, insertedProj.id);
    }
  }

  // 3. Seed Tasks & Subtasks
  for (const t of defaultTasks) {
    const realPortfolioId = portfolioIdMap.get(t.portfolioId);
    const realProjectId = projectIdMap.get(t.projectId);
    if (!realPortfolioId || !realProjectId) continue;

    const { data: insertedTask, error: tErr } = await insforge.database
      .from('tasks')
      .insert([{
        portfolio_id: realPortfolioId,
        project_id: realProjectId,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        due_date: t.dueDate,
        estimated_hours: t.estimatedHours,
        assignee_name: t.assignee.name,
        assignee_avatar: t.assignee.avatar,
        assignee_role: t.assignee.role,
        tags: t.tags,
      }])
      .select()
      .single();

    if (tErr) {
      console.error('Error seeding task:', tErr);
      continue;
    }

    if (insertedTask) {
      taskIdMap.set(t.id, insertedTask.id);

      if (t.subtasks && t.subtasks.length > 0) {
        const subtasks = t.subtasks.map((st, idx) => ({
          task_id: insertedTask.id,
          title: st.title,
          completed: st.completed,
          position: idx,
        }));
        await insforge.database.from('subtasks').insert(subtasks);
      }
    }
  }

  // 4. Seed Milestones
  for (const m of defaultMilestones) {
    const realTaskId = m.taskId ? taskIdMap.get(m.taskId) || null : null;
    await insforge.database
      .from('milestones')
      .insert([{
        date: m.date,
        title: m.title,
        category: m.category,
        task_id: realTaskId,
      }]);
  }

  // 5. Seed Learnings
  for (const l of defaultLearnings) {
    const realTaskId = l.taskId ? taskIdMap.get(l.taskId) || null : null;
    await insforge.database
      .from('learnings')
      .insert([{
        date: l.date,
        lesson: l.lesson,
        category: l.category,
        action_item: l.actionItem || null,
        task_id: realTaskId,
      }]);
  }
}
