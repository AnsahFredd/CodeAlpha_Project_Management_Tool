import { Request, Response, NextFunction } from "express";
import Project from "../models/Project";
import Task from "../models/Task";

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const totalProjects = await Project.countDocuments({
      $or: [{ owner: userId }, { members: userId }],
    });

    const totalTasks = await Task.countDocuments({
      assignedTo: userId,
    });

    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "done" },
    });

    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "done",
    });

    res.json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        pendingTasks,
        completedTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};
