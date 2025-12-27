import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadAvatar,
} from "../controllers/user.controller";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  updateUserValidation,
  userIdValidation,
} from "../validators/user.validator";
import { uploadSingle } from "../middleware/upload";

const router = Router();

// All routes require authentication
router.use(protect);

// Get all users
router.get("/", getAllUsers);

// Get user by ID
router.get("/:id", validate(userIdValidation), getUserById);

// Update user
router.put("/:id", validate(updateUserValidation), updateUser);

// Delete user (admin only)
router.delete("/:id", validate(userIdValidation), deleteUser);

// Upload avatar
router.post("/:id/avatar", uploadSingle("avatar"), uploadAvatar);

export default router;
