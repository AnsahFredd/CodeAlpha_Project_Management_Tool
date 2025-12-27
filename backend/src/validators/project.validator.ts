import { body, param } from "express-validator";

/**
 * Validation rules for creating a project
 */
export const createProjectValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Project name must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("status")
    .optional()
    .isIn(["planning", "active", "on-hold", "completed", "cancelled"])
    .withMessage("Invalid project status"),

  body("members")
    .optional()
    .isArray()
    .withMessage("Members must be an array")
    .custom((members) => {
      if (members && members.length > 0) {
        return members.every((id: string) => /^[0-9a-fA-F]{24}$/.test(id));
      }
      return true;
    })
    .withMessage("All member IDs must be valid MongoDB ObjectIds"),
];

/**
 * Validation rules for updating a project
 */
export const updateProjectValidation = [
  param("id").isMongoId().withMessage("Invalid project ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Project name must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("status")
    .optional()
    .isIn(["planning", "active", "on-hold", "completed", "cancelled"])
    .withMessage("Invalid project status"),

  body("members")
    .optional()
    .isArray()
    .withMessage("Members must be an array")
    .custom((members) => {
      if (members && members.length > 0) {
        return members.every((id: string) => /^[0-9a-fA-F]{24}$/.test(id));
      }
      return true;
    })
    .withMessage("All member IDs must be valid MongoDB ObjectIds"),
];

/**
 * Validation rules for project ID parameter
 */
export const projectIdValidation = [
  param("id").isMongoId().withMessage("Invalid project ID"),
];
