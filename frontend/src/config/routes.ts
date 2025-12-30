// Route constants for the application
export const ROUTES = {
  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Dashboard
  DASHBOARD: "/dashboard",

  // Projects
  PROJECTS: "/projects",
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
  EDIT_PROJECT: (id: string) => `/projects/${id}/edit`,
  CREATE_PROJECT: "/projects/create",

  // Tasks
  TASKS: "/tasks",
  TASK_DETAIL: (id: string) => `/tasks/${id}`,
  EDIT_TASK: (id: string) => `/tasks/${id}/edit`,
  CREATE_TASK: "/tasks/create",

  // Teams
  TEAMS: "/teams",
  TEAM_DETAIL: (id: string) => `/teams/${id}`,
  CREATE_TEAM: "/teams/create",

  // Profile
  PROFILE: "/profile",

  // Root
  ROOT: "/",
} as const;

// Public routes (accessible without authentication)
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.ROOT,
] as const;

// Protected routes (require authentication)
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROJECTS,
  ROUTES.TASKS,
  ROUTES.TEAMS,
  ROUTES.PROFILE,
] as const;
