-- ==============================================================================
-- Migration: 20260913171307_initial-schema.sql
-- Description: Core schema for LudiDay (Profiles, Portfolios, Projects, Tasks,
--              Subtasks, Milestones, Learnings) with RLS, triggers & real-time.
-- ==============================================================================

-- 1. Profiles (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'Member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Portfolios (Strategic Level)
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#3b82f6',
  category TEXT NOT NULL DEFAULT 'Estratégico',
  owner TEXT NOT NULL DEFAULT '',
  budget NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  budget_currency TEXT NOT NULL DEFAULT 'USD',
  health TEXT NOT NULL CHECK (health IN ('on_track', 'at_risk', 'delayed')) DEFAULT 'on_track',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Projects (Tactical Level)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')) DEFAULT 'planning',
  health TEXT NOT NULL CHECK (health IN ('on_track', 'at_risk', 'delayed')) DEFAULT 'on_track',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  end_date DATE,
  owner TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Tasks (Operational Level)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'review', 'done')) DEFAULT 'todo',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  due_date DATE NOT NULL,
  estimated_hours NUMERIC(5, 1) NOT NULL DEFAULT 0.0,
  assignee_name TEXT NOT NULL DEFAULT '',
  assignee_avatar TEXT NOT NULL DEFAULT '',
  assignee_role TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Subtasks (Task Checklist)
CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Milestones (Monthly Goals & Strategic Markers)
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Learnings (Knowledge & Continuous Improvement)
CREATE TABLE IF NOT EXISTS public.learnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL,
  lesson TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  action_item TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_health ON public.portfolios(health);

CREATE INDEX IF NOT EXISTS idx_projects_portfolio_id ON public.projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_portfolio_id ON public.tasks(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_tags ON public.tasks USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON public.subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_subtasks_user_id ON public.subtasks(user_id);

CREATE INDEX IF NOT EXISTS idx_milestones_user_date ON public.milestones(user_id, date);
CREATE INDEX IF NOT EXISTS idx_milestones_task_id ON public.milestones(task_id);

CREATE INDEX IF NOT EXISTS idx_learnings_user_date ON public.learnings(user_id, date);
CREATE INDEX IF NOT EXISTS idx_learnings_task_id ON public.learnings(task_id);

-- ==============================================================================
-- AUTOMATION FUNCTIONS & TRIGGERS
-- ==============================================================================

-- A. Auto-update updated_at timestamps
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER trg_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER trg_subtasks_updated_at
  BEFORE UPDATE ON public.subtasks
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER trg_milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER trg_learnings_updated_at
  BEFORE UPDATE ON public.learnings
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

-- B. Auto-create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.profile->>'name',
      NEW.profile->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.profile->>'avatar_url', ''),
    'Member'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public, pg_temp;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill profile for existing users if any
INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
SELECT 
  u.id, 
  u.email, 
  COALESCE(u.profile->>'name', u.profile->>'full_name', split_part(u.email, '@', 1)), 
  COALESCE(u.profile->>'avatar_url', ''), 
  'Member'
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- C. Auto-calculate Project Progress on Task Changes
CREATE OR REPLACE FUNCTION public.sync_project_progress()
RETURNS TRIGGER AS $$
DECLARE
  target_project_id UUID;
  total_tasks INT;
  done_tasks INT;
  new_progress INT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_project_id := OLD.project_id;
  ELSE
    target_project_id := NEW.project_id;
  END IF;

  IF target_project_id IS NOT NULL THEN
    SELECT 
      COUNT(*),
      COUNT(*) FILTER (WHERE status = 'done')
    INTO total_tasks, done_tasks
    FROM public.tasks
    WHERE project_id = target_project_id;

    IF total_tasks = 0 THEN
      new_progress := 0;
    ELSE
      new_progress := ROUND((done_tasks::NUMERIC / total_tasks::NUMERIC) * 100);
    END IF;

    UPDATE public.projects
    SET progress = new_progress, updated_at = now()
    WHERE id = target_project_id AND progress IS DISTINCT FROM new_progress;
  END IF;

  -- If task changed project, update the previous project as well
  IF TG_OP = 'UPDATE' AND OLD.project_id IS DISTINCT FROM NEW.project_id AND OLD.project_id IS NOT NULL THEN
    SELECT 
      COUNT(*),
      COUNT(*) FILTER (WHERE status = 'done')
    INTO total_tasks, done_tasks
    FROM public.tasks
    WHERE project_id = OLD.project_id;

    IF total_tasks = 0 THEN
      new_progress := 0;
    ELSE
      new_progress := ROUND((done_tasks::NUMERIC / total_tasks::NUMERIC) * 100);
    END IF;

    UPDATE public.projects
    SET progress = new_progress, updated_at = now()
    WHERE id = OLD.project_id AND progress IS DISTINCT FROM new_progress;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public, pg_temp;

DROP TRIGGER IF EXISTS trg_sync_project_progress ON public.tasks;
CREATE TRIGGER trg_sync_project_progress
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_project_progress();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learnings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "profiles_select_authenticated" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "profiles_insert_owner" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles_update_owner" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- 2. Portfolios Policies
CREATE POLICY "portfolios_select_owner" ON public.portfolios
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "portfolios_insert_owner" ON public.portfolios
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "portfolios_update_owner" ON public.portfolios
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "portfolios_delete_owner" ON public.portfolios
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- 3. Projects Policies
CREATE POLICY "projects_select_owner" ON public.projects
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "projects_insert_owner" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "projects_update_owner" ON public.projects
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "projects_delete_owner" ON public.projects
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- 4. Tasks Policies
CREATE POLICY "tasks_select_owner" ON public.tasks
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "tasks_insert_owner" ON public.tasks
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "tasks_update_owner" ON public.tasks
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "tasks_delete_owner" ON public.tasks
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- 5. Subtasks Policies
CREATE POLICY "subtasks_select_owner" ON public.subtasks
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "subtasks_insert_owner" ON public.subtasks
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "subtasks_update_owner" ON public.subtasks
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "subtasks_delete_owner" ON public.subtasks
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- 6. Milestones Policies
CREATE POLICY "milestones_select_owner" ON public.milestones
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "milestones_insert_owner" ON public.milestones
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "milestones_update_owner" ON public.milestones
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "milestones_delete_owner" ON public.milestones
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- 7. Learnings Policies
CREATE POLICY "learnings_select_owner" ON public.learnings
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "learnings_insert_owner" ON public.learnings
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "learnings_update_owner" ON public.learnings
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "learnings_delete_owner" ON public.learnings
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ==============================================================================
-- PERMISSIONS / GRANTS
-- ==============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- ==============================================================================
-- REALTIME CHANNELS & REPLICATION SETUP
-- ==============================================================================

INSERT INTO realtime.channels (pattern, description, enabled)
VALUES 
  ('tasks:%', 'Task updates and board moves', true),
  ('projects:%', 'Project level updates', true),
  ('portfolios:%', 'Portfolio updates', true),
  ('ludiday:global', 'Global activity stream', true)
ON CONFLICT (pattern) DO UPDATE
SET description = EXCLUDED.description,
    enabled = EXCLUDED.enabled;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime FOR TABLE 
      public.portfolios, 
      public.projects, 
      public.tasks, 
      public.subtasks, 
      public.milestones, 
      public.learnings;
  ELSE
    ALTER PUBLICATION supabase_realtime ADD TABLE 
      public.portfolios, 
      public.projects, 
      public.tasks, 
      public.subtasks, 
      public.milestones, 
      public.learnings;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Publication supabase_realtime configuration skipped: %', SQLERRM;
END $$;
