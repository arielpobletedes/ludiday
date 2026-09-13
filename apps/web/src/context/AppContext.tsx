import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Portfolio,
  Project,
  Task,
  Milestone,
  Learning,
  TaskStatus,
  defaultPortfolios,
  defaultProjects,
  defaultTasks,
  defaultMilestones,
  defaultLearnings,
  InsForgePortfolioRepository,
  InsForgeProjectRepository,
  InsForgeTaskRepository,
  InsForgeMilestoneRepository,
  InsForgeLearningRepository,
  seedInitialUserData,
  getInsForge,
} from '@ludiday/core';
import { ActiveView, DeviceMode, FilterState } from '../types';

interface AppContextType {
  portfolios: Portfolio[];
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  learnings: Learning[];

  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  
  selectedPortfolioId: string | null;
  setSelectedPortfolioId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;

  // Auth & Cloud DB state
  user: any;
  authLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signIn: (email: string, pass: string) => Promise<{ error: any }>;
  signUp: (email: string, pass: string, name?: string) => Promise<{ error: any }>;
  signInOAuth: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
  isDbConnected: boolean;
  isLoadingDb: boolean;

  // Task Modal state
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  defaultModalStatus: TaskStatus;
  openTaskModal: (task?: Task | null, defaultStatus?: TaskStatus) => void;
  closeTaskModal: () => void;

  // Portfolio Modal state
  isPortfolioModalOpen: boolean;
  editingPortfolio: Portfolio | null;
  openPortfolioModal: (p?: Portfolio | null) => void;
  closePortfolioModal: () => void;

  // Project Modal state
  isProjectModalOpen: boolean;
  editingProject: Project | null;
  openProjectModal: (p?: Project | null) => void;
  closeProjectModal: () => void;

  // Milestone Modal state
  isMilestoneModalOpen: boolean;
  openMilestoneModal: () => void;
  closeMilestoneModal: () => void;

  // Learning Modal state
  isLearningModalOpen: boolean;
  openLearningModal: () => void;
  closeLearningModal: () => void;

  // CRUD actions
  addPortfolio: (p: Omit<Portfolio, 'id' | 'createdAt'>) => Promise<void>;
  updatePortfolio: (p: Portfolio) => Promise<void>;
  deletePortfolio: (id: string) => Promise<void>;

  addProject: (p: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (p: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addTask: (t: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (t: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus) => Promise<void>;

  addMilestone: (m: Omit<Milestone, 'id'>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;

  addLearning: (l: Omit<Learning, 'id'>) => Promise<void>;
  deleteLearning: (id: string) => Promise<void>;

  getFilteredTasks: () => Task[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Instantiate InsForge repositories
const portfolioRepo = new InsForgePortfolioRepository();
const projectRepo = new InsForgeProjectRepository();
const taskRepo = new InsForgeTaskRepository();
const milestoneRepo = new InsForgeMilestoneRepository();
const learningRepo = new InsForgeLearningRepository();

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(defaultPortfolios);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);
  const [learnings, setLearnings] = useState<Learning[]>(defaultLearnings);
  
  const [activeView, setActiveView] = useState<ActiveView>('kanban');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Auth & Cloud state
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    portfolioId: 'all',
    projectId: 'all',
    status: 'all',
    search: '',
    weekOffset: 0,
  });

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultModalStatus, setDefaultModalStatus] = useState<TaskStatus>('todo');

  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isLearningModalOpen, setIsLearningModalOpen] = useState(false);

  // Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load Database Records for authenticated user
  const loadDatabaseData = async () => {
    setIsLoadingDb(true);
    try {
      const [dbPortfolios, dbProjects, dbTasks, dbMilestones, dbLearnings] = await Promise.all([
        portfolioRepo.getAll(),
        projectRepo.getAll(),
        taskRepo.getAll(),
        milestoneRepo.getAll(),
        learningRepo.getAll(),
      ]);

      if (dbPortfolios.length === 0 && dbTasks.length === 0) {
        // Auto-seed initial starter data for brand new user
        await seedInitialUserData();
        const [seededPortfolios, seededProjects, seededTasks, seededMilestones, seededLearnings] = await Promise.all([
          portfolioRepo.getAll(),
          projectRepo.getAll(),
          taskRepo.getAll(),
          milestoneRepo.getAll(),
          learningRepo.getAll(),
        ]);
        setPortfolios(seededPortfolios);
        setProjects(seededProjects);
        setTasks(seededTasks);
        setMilestones(seededMilestones);
        setLearnings(seededLearnings);
      } else {
        setPortfolios(dbPortfolios);
        setProjects(dbProjects);
        setTasks(dbTasks);
        setMilestones(dbMilestones);
        setLearnings(dbLearnings);
      }
    } catch (err) {
      console.error('Failed to load InsForge database records:', err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  // Check auth session on startup
  useEffect(() => {
    const insforge = getInsForge();

    insforge.auth.getCurrentUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        loadDatabaseData();
      }
      setAuthLoading(false);
    }).catch((err) => {
      console.error('Error fetching current user:', err);
      setAuthLoading(false);
    });

    // Listen to Auth State Changes
    const unsubscribeAuth = insforge.auth.onAuthStateChange(async () => {
      const { data } = await insforge.auth.getCurrentUser();
      if (data?.user) {
        setUser(data.user);
        await loadDatabaseData();
      } else {
        setUser(null);
        // Reset to default mock for preview
        setPortfolios(defaultPortfolios);
        setProjects(defaultProjects);
        setTasks(defaultTasks);
        setMilestones(defaultMilestones);
        setLearnings(defaultLearnings);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const signIn = async (email: string, pass: string) => {
    const insforge = getInsForge();
    const res = await insforge.auth.signInWithPassword({ email, password: pass });
    if (res.data?.user) {
      setUser(res.data.user);
      await loadDatabaseData();
    }
    return { error: res.error };
  };

  const signUp = async (email: string, pass: string, name?: string) => {
    const insforge = getInsForge();
    const res = await insforge.auth.signUp({
      email,
      password: pass,
      name: name || undefined,
    });
    if (res.data?.user) {
      setUser(res.data.user);
      await loadDatabaseData();
    }
    return { error: res.error };
  };

  const signInOAuth = async (provider: 'google' | 'github') => {
    const insforge = getInsForge();
    await insforge.auth.signInWithOAuth({
      provider,
      redirectTo: window.location.origin,
    });
  };

  const signOut = async () => {
    const insforge = getInsForge();
    await insforge.auth.signOut();
    setUser(null);
    setPortfolios(defaultPortfolios);
    setProjects(defaultProjects);
    setTasks(defaultTasks);
    setMilestones(defaultMilestones);
    setLearnings(defaultLearnings);
  };

  // Modals
  const openTaskModal = (task?: Task | null, defaultStatus: TaskStatus = 'todo') => {
    setEditingTask(task || null);
    setDefaultModalStatus(defaultStatus);
    setIsTaskModalOpen(true);
  };
  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const openPortfolioModal = (p?: Portfolio | null) => {
    setEditingPortfolio(p || null);
    setIsPortfolioModalOpen(true);
  };
  const closePortfolioModal = () => {
    setIsPortfolioModalOpen(false);
    setEditingPortfolio(null);
  };

  const openProjectModal = (p?: Project | null) => {
    setEditingProject(p || null);
    setIsProjectModalOpen(true);
  };
  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const openMilestoneModal = () => setIsMilestoneModalOpen(true);
  const closeMilestoneModal = () => setIsMilestoneModalOpen(false);

  const openLearningModal = () => setIsLearningModalOpen(true);
  const closeLearningModal = () => setIsLearningModalOpen(false);

  // Portfolio CRUD
  const addPortfolio = async (newP: Omit<Portfolio, 'id' | 'createdAt'>) => {
    if (user) {
      try {
        const created = await portfolioRepo.create(newP);
        setPortfolios((prev) => [...prev, created]);
        return;
      } catch (err) {
        console.error('Error creating portfolio in DB:', err);
      }
    }
    const portfolio: Portfolio = {
      ...newP,
      id: `port-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPortfolios((prev) => [...prev, portfolio]);
  };

  const updatePortfolio = async (updatedP: Portfolio) => {
    setPortfolios((prev) => prev.map((p) => (p.id === updatedP.id ? updatedP : p)));
    if (user) {
      await portfolioRepo.update(updatedP).catch(console.error);
    }
  };

  const deletePortfolio = async (id: string) => {
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
    setProjects((prev) => prev.filter((proj) => proj.portfolioId !== id));
    setTasks((prev) => prev.filter((t) => t.portfolioId !== id));
    if (user) {
      await portfolioRepo.delete(id).catch(console.error);
    }
  };

  // Project CRUD
  const addProject = async (newProj: Omit<Project, 'id'>) => {
    if (user) {
      try {
        const created = await projectRepo.create(newProj);
        setProjects((prev) => [...prev, created]);
        return;
      } catch (err) {
        console.error('Error creating project in DB:', err);
      }
    }
    const project: Project = {
      ...newProj,
      id: `proj-${Date.now()}`,
    };
    setProjects((prev) => [...prev, project]);
  };

  const updateProject = async (updatedProj: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProj.id ? updatedProj : p)));
    if (user) {
      await projectRepo.update(updatedProj).catch(console.error);
    }
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    if (user) {
      await projectRepo.delete(id).catch(console.error);
    }
  };

  // Task CRUD
  const addTask = async (newTask: Omit<Task, 'id'>) => {
    if (user) {
      try {
        const created = await taskRepo.create(newTask);
        setTasks((prev) => [created, ...prev]);
        // Refresh projects to reflect trigger-calculated progress
        const updatedProjects = await projectRepo.getAll();
        setProjects(updatedProjects);
        return;
      } catch (err) {
        console.error('Error creating task in DB:', err);
      }
    }
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [task, ...prev]);
  };

  const updateTask = async (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    if (user) {
      try {
        await taskRepo.update(updatedTask);
        const updatedProjects = await projectRepo.getAll();
        setProjects(updatedProjects);
      } catch (err) {
        console.error('Error updating task in DB:', err);
      }
    }
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (user) {
      try {
        await taskRepo.delete(id);
        const updatedProjects = await projectRepo.getAll();
        setProjects(updatedProjects);
      } catch (err) {
        console.error('Error deleting task in DB:', err);
      }
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubtasks };
      })
    );
    if (user) {
      await taskRepo.toggleSubtask(taskId, subtaskId).catch(console.error);
    }
  };

  const moveTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    if (user) {
      try {
        await taskRepo.updateStatus(taskId, newStatus);
        const updatedProjects = await projectRepo.getAll();
        setProjects(updatedProjects);
      } catch (err) {
        console.error('Error updating task status in DB:', err);
      }
    }
  };

  // Milestone CRUD
  const addMilestone = async (newM: Omit<Milestone, 'id'>) => {
    if (user) {
      try {
        const created = await milestoneRepo.create(newM);
        setMilestones((prev) => [created, ...prev]);
        return;
      } catch (err) {
        console.error('Error creating milestone in DB:', err);
      }
    }
    const milestone: Milestone = {
      ...newM,
      id: `ms-${Date.now()}`,
    };
    setMilestones((prev) => [milestone, ...prev]);
  };

  const deleteMilestone = async (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
    if (user) {
      await milestoneRepo.delete(id).catch(console.error);
    }
  };

  // Learning CRUD
  const addLearning = async (newL: Omit<Learning, 'id'>) => {
    if (user) {
      try {
        const created = await learningRepo.create(newL);
        setLearnings((prev) => [created, ...prev]);
        return;
      } catch (err) {
        console.error('Error creating learning in DB:', err);
      }
    }
    const learning: Learning = {
      ...newL,
      id: `lrn-${Date.now()}`,
    };
    setLearnings((prev) => [learning, ...prev]);
  };

  const deleteLearning = async (id: string) => {
    setLearnings((prev) => prev.filter((l) => l.id !== id));
    if (user) {
      await learningRepo.delete(id).catch(console.error);
    }
  };

  // Filter tasks
  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      if (filters.portfolioId !== 'all' && task.portfolioId !== filters.portfolioId) {
        return false;
      }
      if (filters.projectId !== 'all' && task.projectId !== filters.projectId) {
        return false;
      }
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }
      if (filters.search.trim() !== '') {
        const query = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        const matchesTags = task.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesAssignee = task.assignee.name.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesAssignee) {
          return false;
        }
      }
      return true;
    });
  };

  return (
    <AppContext.Provider
      value={{
        portfolios,
        projects,
        tasks,
        milestones,
        learnings,
        activeView,
        setActiveView,
        deviceMode,
        setDeviceMode,
        darkMode,
        setDarkMode,
        filters,
        setFilters,
        selectedPortfolioId,
        setSelectedPortfolioId,
        selectedProjectId,
        setSelectedProjectId,
        user,
        authLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signInOAuth,
        signOut,
        isDbConnected: Boolean(user),
        isLoadingDb,
        isTaskModalOpen,
        editingTask,
        defaultModalStatus,
        openTaskModal,
        closeTaskModal,
        isPortfolioModalOpen,
        editingPortfolio,
        openPortfolioModal,
        closePortfolioModal,
        isProjectModalOpen,
        editingProject,
        openProjectModal,
        closeProjectModal,
        isMilestoneModalOpen,
        openMilestoneModal,
        closeMilestoneModal,
        isLearningModalOpen,
        openLearningModal,
        closeLearningModal,
        addPortfolio,
        updatePortfolio,
        deletePortfolio,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        toggleSubtask,
        moveTaskStatus,
        addMilestone,
        deleteMilestone,
        addLearning,
        deleteLearning,
        getFilteredTasks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
