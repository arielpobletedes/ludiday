import { Portfolio, Project, Task, Milestone, Learning } from '../types';

// Helper to get dates relative to today
const getRelativeDate = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

// Calculate offset to get specific day of current week (0 = Mon, 6 = Sun)
const getDayOfCurrentWeek = (dayIndex: number): string => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sun, 1 is Mon...
  const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMon + dayIndex);
  return monday.toISOString().split('T')[0];
};

export const initialPortfolios: Portfolio[] = [
  {
    id: 'port-1',
    name: 'Tecnología & Producto Digital',
    description: 'Innovación tecnológica, desarrollo de software y modernización de plataformas.',
    color: '#3b82f6',
    category: 'Estratégico',
    owner: 'Carlos Mendoza',
    budget: '$120,000 USD',
    health: 'on_track',
    createdAt: '2026-01-15',
  },
  {
    id: 'port-2',
    name: 'Marketing & Growth 2026',
    description: 'Campañas de aceleración de ventas, branding y adquisición de clientes.',
    color: '#ec4899',
    category: 'Crecimiento',
    owner: 'Valeria Rojas',
    budget: '$85,000 USD',
    health: 'at_risk',
    createdAt: '2026-02-01',
  },
  {
    id: 'port-3',
    name: 'Operaciones & Infraestructura',
    description: 'Eficiencia operativa, seguridad IT y optimización de logística interna.',
    color: '#10b981',
    category: 'Operacional',
    owner: 'Roberto Silva',
    budget: '$64,000 USD',
    health: 'on_track',
    createdAt: '2026-01-10',
  }
];

export const initialProjects: Project[] = [
  {
    id: 'proj-101',
    portfolioId: 'port-1',
    name: 'Rediseño App Móvil v3.0',
    description: 'Nueva arquitectura UX/UI con soporte multi-idioma y modo oscuro.',
    status: 'in_progress',
    health: 'on_track',
    progress: 68,
    startDate: getRelativeDate(-30),
    endDate: getRelativeDate(25),
    owner: 'Ana Beltrán',
  },
  {
    id: 'proj-102',
    portfolioId: 'port-1',
    name: 'Migración a Microservicios Cloud',
    description: 'Transición de backend monolítico a AWS Lambda y Kubernetes.',
    status: 'in_progress',
    health: 'at_risk',
    progress: 42,
    startDate: getRelativeDate(-45),
    endDate: getRelativeDate(40),
    owner: 'Esteban Cruz',
  },
  {
    id: 'proj-201',
    portfolioId: 'port-2',
    name: 'Campaña Q4 Black Friday & Navidad',
    description: 'Estrategia multicanal en redes sociales, Google Ads e Influencer Marketing.',
    status: 'planning',
    health: 'on_track',
    progress: 25,
    startDate: getRelativeDate(-10),
    endDate: getRelativeDate(60),
    owner: 'Camila Torres',
  },
  {
    id: 'proj-202',
    portfolioId: 'port-2',
    name: 'Programa de Fidelización LudiClub',
    description: 'Sistema de puntos, recompensas y gamificación para usuarios recurrentes.',
    status: 'in_progress',
    health: 'on_track',
    progress: 80,
    startDate: getRelativeDate(-60),
    endDate: getRelativeDate(10),
    owner: 'Gabriel Navarro',
  },
  {
    id: 'proj-301',
    portfolioId: 'port-3',
    name: 'Certificación ISO 27001 Seguridad',
    description: 'Auditoría e implementación de políticas de seguridad de la información.',
    status: 'in_progress',
    health: 'delayed',
    progress: 55,
    startDate: getRelativeDate(-90),
    endDate: getRelativeDate(15),
    owner: 'Lucía Vargas',
  }
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    portfolioId: 'port-1',
    projectId: 'proj-101',
    title: 'Diseñar wireframes para pantalla de onboarding',
    description: 'Crear vistas responsive para móvil (iOS/Android) y escritorio del proceso de registro inicial.',
    status: 'in_progress',
    priority: 'high',
    dueDate: getDayOfCurrentWeek(0),
    estimatedHours: 6,
    assignee: {
      name: 'Sofía Lara',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: 'UI/UX Designer',
    },
    subtasks: [
      { id: 'st-1', title: 'Definir paleta de colores y componentes', completed: true },
      { id: 'st-2', title: 'Flujo de autenticación con OAuth', completed: true },
      { id: 'st-3', title: 'Prototipo interactivo Figma', completed: false }
    ],
    tags: ['UI/UX', 'Diseño', 'Mobile']
  },
  {
    id: 'task-2',
    portfolioId: 'port-1',
    projectId: 'proj-101',
    title: 'Implementar API REST de autenticación biométrica',
    description: 'Integrar endpoints seguros para TouchID / FaceID en cliente móvil.',
    status: 'todo',
    priority: 'urgent',
    dueDate: getDayOfCurrentWeek(1),
    estimatedHours: 8,
    assignee: {
      name: 'Mateo Morales',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'Fullstack Dev',
    },
    subtasks: [
      { id: 'st-4', title: 'Pruebas de encriptación AES-256', completed: false },
      { id: 'st-5', title: 'Swagger doc API', completed: false }
    ],
    tags: ['Backend', 'Seguridad', 'API']
  },
  {
    id: 'task-3',
    portfolioId: 'port-2',
    projectId: 'proj-201',
    title: 'Crear piezas gráficas para campaña Social Ads',
    description: 'Adaptar banners para Meta Ads, TikTok y LinkedIn con mensaje de prelanzamiento Q4.',
    status: 'review',
    priority: 'medium',
    dueDate: getDayOfCurrentWeek(2),
    estimatedHours: 4,
    assignee: {
      name: 'Valentina Díaz',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'Growth Marketer',
    },
    subtasks: [
      { id: 'st-6', title: 'Formato 1:1 Instagram Post', completed: true },
      { id: 'st-7', title: 'Formato 9:16 Stories/Reels', completed: true }
    ],
    tags: ['Marketing', 'Social', 'Branding']
  },
  {
    id: 'task-4',
    portfolioId: 'port-3',
    projectId: 'proj-301',
    title: 'Auditoría de accesos a servidores de producción',
    description: 'Revisar permisos IAM y claves SSH activas en la infraestructura AWS.',
    status: 'done',
    priority: 'high',
    dueDate: getDayOfCurrentWeek(3),
    estimatedHours: 5,
    assignee: {
      name: 'Diego Parra',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      role: 'DevOps & SysAdmin',
    },
    subtasks: [
      { id: 'st-8', title: 'Exportar informe de accesos', completed: true },
      { id: 'st-9', title: 'Revocar cuentas inactivas > 90 días', completed: true }
    ],
    tags: ['DevOps', 'ISO27001', 'Cloud']
  },
  {
    id: 'task-5',
    portfolioId: 'port-2',
    projectId: 'proj-202',
    title: 'Configurar motor de cálculo de puntos LudiClub',
    description: 'Definir reglas de negocio para asignación de puntos por compras e interacciones.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: getDayOfCurrentWeek(4),
    estimatedHours: 7,
    assignee: {
      name: 'Gabriel Navarro',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      role: 'Product Owner',
    },
    subtasks: [
      { id: 'st-10', title: 'Lógica de multiplicadores por nivel', completed: true },
      { id: 'st-11', title: 'Integración con pasarela de pagos', completed: false }
    ],
    tags: ['Fidelización', 'Backend']
  },
  {
    id: 'task-6',
    portfolioId: 'port-1',
    projectId: 'proj-102',
    title: 'Pruebas de estrés y carga en cluster Kubernetes',
    description: 'Ejecutar simulaciones de trafico pico con JMeter antes de producción.',
    status: 'todo',
    priority: 'urgent',
    dueDate: getDayOfCurrentWeek(5),
    estimatedHours: 6,
    assignee: {
      name: 'Esteban Cruz',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      role: 'Cloud Architect',
    },
    subtasks: [
      { id: 'st-12', title: 'Simular 50,000 usuarios concurrentes', completed: false },
      { id: 'st-13', title: 'Validar auto-scaling pods', completed: false }
    ],
    tags: ['QA', 'K8s', 'Performance']
  },
  {
    id: 'task-7',
    portfolioId: 'port-3',
    projectId: 'proj-301',
    title: 'Reunión de revisión semanal y retrospectiva',
    description: 'Sincronización de avances con los líderes de equipo de cada portafolio.',
    status: 'todo',
    priority: 'low',
    dueDate: getDayOfCurrentWeek(6),
    estimatedHours: 2,
    assignee: {
      name: 'Carlos Mendoza',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      role: 'Portfolio Manager',
    },
    subtasks: [
      { id: 'st-14', title: 'Revisar KPIs y presupuesto Q3', completed: false }
    ],
    tags: ['Gestión', 'Retrospectiva']
  }
];

export const initialMilestones: Milestone[] = [
  {
    id: 'ms-1',
    date: getRelativeDate(-5),
    title: 'Aprobación de Arquitectura de Seguridad ISO 27001',
    category: 'Certificación & Cumplimiento',
    taskId: 'task-4',
  },
  {
    id: 'ms-2',
    date: getRelativeDate(2),
    title: 'Firma de Contrato con Agencia de Growth Marketing',
    category: 'Alianza Estratégica',
    taskId: 'task-3',
  },
  {
    id: 'ms-3',
    date: getRelativeDate(12),
    title: 'Despliegue Beta App Móvil v3.0 en TestFlight',
    category: 'Lanzamiento Producto',
    taskId: 'task-1',
  }
];

export const initialLearnings: Learning[] = [
  {
    id: 'lrn-1',
    date: getRelativeDate(-8),
    lesson: 'Las llamadas síncronas entre microservicios generaban cuellos de botella bajo carga alta.',
    category: 'Arquitectura Cloud',
    taskId: 'task-6',
    actionItem: 'Migrar comunicaciones a colas asíncronas RabbitMQ / AWS SQS.',
  },
  {
    id: 'lrn-2',
    date: getRelativeDate(-3),
    lesson: 'Los usuarios móviles prefieren autenticación biométrica en lugar de códigos OTP SMS.',
    category: 'UX & Retención',
    taskId: 'task-2',
    actionItem: 'Priorizar autenticación con Passkeys y FaceID en el primer sprint.',
  }
];
