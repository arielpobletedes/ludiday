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
  addPortfolio: (p: Omit<Portfolio, 'id' | 'createdAt'>) => void;
  updatePortfolio: (p: Portfolio) => void;
  deletePortfolio: (id: string) => void;

  addProject: (p: Omit<Project, 'id'>) => void;
  updateProject: (p: Project) => void;
  deleteProject: (id: string) => void;

  addTask: (t: Omit<Task, 'id'>) => void;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus) => void;

  addMilestone: (m: Omit<Milestone, 'id'>) => void;
  deleteMilestone: (id: string) => void;

  addLearning: (l: Omit<Learning, 'id'>) => void;
  deleteLearning: (id: string) => void;

  getFilteredTasks: () => Task[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
  const addPortfolio = (newP: Omit<Portfolio, 'id' | 'createdAt'>) => {
    const portfolio: Portfolio = {
      ...newP,
      id: `port-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPortfolios((prev) => [...prev, portfolio]);
  };
  const updatePortfolio = (updatedP: Portfolio) => {
    setPortfolios((prev) => prev.map((p) => (p.id === updatedP.id ? updatedP : p)));
  };
  const deletePortfolio = (id: string) => {
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
    setProjects((prev) => prev.filter((proj) => proj.portfolioId !== id));
    setTasks((prev) => prev.filter((t) => t.portfolioId !== id));
  };

  // Project CRUD
  const addProject = (newProj: Omit<Project, 'id'>) => {
    const project: Project = {
      ...newProj,
      id: `proj-${Date.now()}`,
    };
    setProjects((prev) => [...prev, project]);
  };
  const updateProject = (updatedProj: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProj.id ? updatedProj : p)));
  };
  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
  };

  // Task CRUD
  const addTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [task, ...prev]);
  };
  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubtasks };
      })
    );
  };
  const moveTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Milestone CRUD
  const addMilestone = (newM: Omit<Milestone, 'id'>) => {
    const milestone: Milestone = {
      ...newM,
      id: `ms-${Date.now()}`,
    };
    setMilestones((prev) => [milestone, ...prev]);
  };
  const deleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  // Learning CRUD
  const addLearning = (newL: Omit<Learning, 'id'>) => {
    const learning: Learning = {
      ...newL,
      id: `lrn-${Date.now()}`,
    };
    setLearnings((prev) => [learning, ...prev]);
  };
  const deleteLearning = (id: string) => {
    setLearnings((prev) => prev.filter((l) => l.id !== id));
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
