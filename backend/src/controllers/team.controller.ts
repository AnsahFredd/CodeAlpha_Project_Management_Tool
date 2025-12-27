import { Request, Response, NextFunction } from "express";
import Team from "../models/Team";

// @desc    Get all teams for current user
// @route   GET /api/teams
// @access  Private
export const getTeams = async (req: any, res: Response, next: NextFunction) => {
  try {
    const teams = await Team.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    }).populate("owner", "name email");
    res.json({ success: true, data: teams });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
export const getTeam = async (req: any, res: Response, next: NextFunction) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email")
      .populate("projects", "name status");

    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    res.json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new team
// @route   POST /api/teams
// @access  Private
export const createTeam = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body.owner = req.user.id;
    if (!req.body.members) req.body.members = [req.user.id];
    const team = await Team.create(req.body);
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
export const updateTeam = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let team = await Team.findById(req.params.id);

    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    if (team.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Not authorized to update this team",
        });
    }

    team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private
export const deleteTeam = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    if (team.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Not authorized to delete this team",
        });
    }

    await team.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Add team member
// @route   POST /api/teams/:id/members
// @access  Private
export const addTeamMember = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });

    if (!team.members.includes(req.body.userId)) {
      team.members.push(req.body.userId);
      await team.save();
    }

    res.json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};
