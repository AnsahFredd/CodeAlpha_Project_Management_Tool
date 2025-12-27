import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { AuthRequest } from "../interfaces";
import { ApiResponse } from "../utils/ApiResponse";
import cloudinary from "../config/cloudinary";

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private
 */
export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("-password");

    return ApiResponse.success(res, users, "Users retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    return ApiResponse.success(res, user, "User retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/:id
 * @access  Private
 */
export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, email, role, avatar } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    // Only allow users to update their own profile, unless they're admin
    if (req.user?._id.toString() !== id && req.user?.role !== "admin") {
      return ApiResponse.forbidden(res, "You can only update your own profile");
    }

    // Only admins can change roles
    if (role && req.user?.role !== "admin") {
      return ApiResponse.forbidden(res, "Only admins can change user roles");
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role && req.user?.role === "admin") user.role = role;
    if (avatar) user.avatar = avatar;

    await user.save();

    return ApiResponse.success(
      res,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      "User updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin only)
 */
export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Only admins can delete users
    if (req.user?.role !== "admin") {
      return ApiResponse.forbidden(res, "Only admins can delete users");
    }

    const user = await User.findById(id);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    // Prevent deleting yourself
    if (req.user._id.toString() === id) {
      return ApiResponse.badRequest(res, "You cannot delete your own account");
    }

    await user.deleteOne();

    return ApiResponse.success(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload user avatar
 * @route   POST /api/users/:id/avatar
 * @access  Private
 */
export const uploadAvatar = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    // Only allow users to update their own avatar
    if (req.user?._id.toString() !== id && req.user?.role !== "admin") {
      return ApiResponse.forbidden(res, "You can only update your own avatar");
    }

    // Check if file was uploaded
    if (!req.file) {
      return ApiResponse.badRequest(res, "Please upload an image file");
    }

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars",
          transformation: [{ width: 200, height: 200, crop: "fill" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file!.buffer);
    });

    // Update user avatar
    user.avatar = result.secure_url;
    await user.save();

    return ApiResponse.success(
      res,
      { avatar: user.avatar },
      "Avatar uploaded successfully"
    );
  } catch (error) {
    next(error);
  }
};
