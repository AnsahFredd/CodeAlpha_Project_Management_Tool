import { body, param } from "express-validator";

/**
 * Validation rules for creating a task
 */
export const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Task title must be between 3 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "review", "done", "blocked"])
    .withMessage("Invalid task status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Invalid task priority"),

  body("project")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Invalid project ID"),

  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("Invalid user ID for assignedTo"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date")
    .custom((value) => {
      const dueDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate >= today;
    })
    .withMessage("Due date cannot be in the past"),
];

/**
 * Validation rules for updating a task
 */
export const updateTaskValidation = [
  param("id").isMongoId().withMessage("Invalid task ID"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Task title must be between 3 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "review", "done", "blocked"])
    .withMessage("Invalid task status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Invalid task priority"),

  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("Invalid user ID for assignedTo"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

/**
 * Validation rules for updating task status
 */
export const updateTaskStatusValidation = [
  param("id").isMongoId().withMessage("Invalid task ID"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["todo", "in-progress", "review", "done", "blocked"])
    .withMessage("Invalid task status"),
];

/**
 * Validation rules for task ID parameter
 */
export const taskIdValidation = [
  param("id").isMongoId().withMessage("Invalid task ID"),
];
