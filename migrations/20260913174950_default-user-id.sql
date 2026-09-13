-- Migration: 20260913174950_default-user-id.sql
-- Description: Set default user_id to auth.uid() on all application tables

ALTER TABLE public.portfolios ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.projects ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.tasks ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.subtasks ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.milestones ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.learnings ALTER COLUMN user_id SET DEFAULT auth.uid();
