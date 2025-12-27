import { body, param } from "express-validator";

/**
 * Validation rules for updating user profile
 */
export const updateUserValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("role")
    .optional()
    .isIn(["admin", "member", "viewer"])
    .withMessage("Role must be admin, member, or viewer"),

  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),
];

/**
 * Validation rules for user ID parameter
 */
export const userIdValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];
