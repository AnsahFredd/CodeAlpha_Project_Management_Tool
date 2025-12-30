// API Constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// App Constants
export const APP_NAME =
  import.meta.env.VITE_APP_NAME || "Project Management Tool";

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER: "user",
  THEME: "theme",
} as const;

// Task Status Options
export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  REVIEW: "review",
  DONE: "done",
  BLOCKED: "blocked",
} as const;

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: "To Do",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.REVIEW]: "Review",
  [TASK_STATUS.DONE]: "Done",
  [TASK_STATUS.BLOCKED]: "Blocked",
} as const;

// Task Priority Options
export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: "Low",
  [TASK_PRIORITY.MEDIUM]: "Medium",
  [TASK_PRIORITY.HIGH]: "High",
  [TASK_PRIORITY.URGENT]: "Urgent",
} as const;

// Project Status Options
export const PROJECT_STATUS = {
  PLANNING: "planning",
  ACTIVE: "active",
  ON_HOLD: "on-hold",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.PLANNING]: "Planning",
  [PROJECT_STATUS.ACTIVE]: "Active",
  [PROJECT_STATUS.ON_HOLD]: "On Hold",
  [PROJECT_STATUS.COMPLETED]: "Completed",
  [PROJECT_STATUS.CANCELLED]: "Cancelled",
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  MEMBER: "member",
  VIEWER: "viewer",
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.MEMBER]: "Member",
  [USER_ROLES.VIEWER]: "Viewer",
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  DISPLAY_WITH_TIME: "MMM dd, yyyy hh:mm a",
  INPUT: "yyyy-MM-dd",
  INPUT_WITH_TIME: "yyyy-MM-dd'T'HH:mm",
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Debounce Delay (ms)
export const DEBOUNCE_DELAY = 300;

// Toast Duration (ms)
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 4000,
  WARNING: 4000,
} as const;
