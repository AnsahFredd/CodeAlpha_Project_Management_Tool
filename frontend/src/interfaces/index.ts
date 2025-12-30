export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
  createdAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Activity {
  _id: string;
  user: User;
  description: string;
  project?: string | Project;
  createdAt: string;
}

export interface DashboardStats {
  activeProjects: number;
  totalTasks: number;
  totalTeams: number;
  pendingTasks: number;
  completedTasks: number;
  recentActivity: unknown[];
}

export interface LoginForm {
  email: string;
  password?: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password?: string;
}

export interface ProjectForm {
  name: string;
  description?: string;
  status?: Project["status"];
  priority?: "low" | "medium" | "high" | "urgent";
  startDate?: string;
  endDate?: string;
  members?: string[];
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  startDate?: string;
  endDate?: string;
  owner: User;
  members: User[];
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "done" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  project: string | Project;
  assignedTo?: User | User[];
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  owner: User;
  createdBy: User | string;
  members: {
    user: User;
    role: "admin" | "member" | "viewer";
    joinedAt: string;
  }[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskForm {
  title: string;
  description?: string;
  status?: Task["status"];
  priority?: Task["priority"];
  project: string;
  assignedTo?: string[];
  dueDate?: string;
  tags?: string[];
}

export interface TeamForm {
  name: string;
  description?: string;
  members?: string[];
}
