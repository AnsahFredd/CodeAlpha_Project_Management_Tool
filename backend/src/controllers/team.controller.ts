import { Request, Response, NextFunction } from "express";
import Team from "../models/Team";
import config from "../config";

// @desc    Get all teams for current user
// @route   GET /api/teams
// @access  Private
export const getTeams = async (req: any, res: Response, next: NextFunction) => {
  try {
    const teams = await Team.find({
      $or: [{ owner: req.user.id }, { "members.user": req.user.id }], // Update query for members.user
    })
      .populate("owner", "name email")
      .populate("createdBy", "name email")
      .populate("members.user", "name email"); // Populate nested user field

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
      .populate("createdBy", "name email")
      .populate("members.user", "name email") // Populate nested user field
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
    req.body.createdBy = req.user.id;
    // Initialize members with owner as admin
    if (!req.body.members) {
      req.body.members = [{ user: req.user.id, role: "admin" }];
    }
    const team = await Team.create(req.body);
    // Populate for response
    const teamId = (team as any)._id || (team as any)[0]._id;
    const populatedTeam = await Team.findById(teamId)
      .populate("owner", "name email")
      .populate("createdBy", "name email");
    res.status(201).json({ success: true, data: populatedTeam });
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
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this team",
      });
    }

    team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("owner", "name email")
      .populate("createdBy", "name email");

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
      return res.status(401).json({
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

// @desc    Add team member (Existing user)
// @route   POST /api/teams/:id/members
// @access  Private
export const addTeamMember = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, role } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    // Check permissions
    if (team.owner.toString() !== req.user.id) {
      // Also allow admins or other roles if needed later
    }

    const User = require("../models/User").default; 
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if already member
    const isMember = team.members.some(
      (m: any) => m.user.toString() === userToAdd._id.toString()
    );

    if (isMember) {
      return res
        .status(400)
        .json({ success: false, message: "User is already a member" });
    }

    team.members.push({
      user: userToAdd._id,
      role: role || "member",
      joinedAt: new Date(),
    });

    await team.save();

    // Re-fetch to populate
    const updatedTeam = await Team.findById(req.params.id)
      .populate("owner", "name email")
      .populate("createdBy", "name email")
      .populate("members.user", "name email");

    res.json({ success: true, data: updatedTeam });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite team member (Send email)
// @route   POST /api/teams/:id/invite
// @access  Private
export const inviteTeamMember = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, role } = req.body;
    const team = await Team.findById(req.params.id);
    const Invitation = require("../models/Invitation").default;
    const crypto = require("crypto");
    const emailService = require("../services/email.service").default;

    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    // Check if user exists already
    const User = require("../models/User").default;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
     

      // Check if already member
      const isMember = team.members.some(
        (m: any) => m.user.toString() === existingUser._id.toString()
      );
      if (isMember) {
        return res
          .status(400)
          .json({ success: false, message: "User is already a member" });
      }

      team.members.push({
        user: existingUser._id,
        role: role || "member",
        joinedAt: new Date(),
      });
      await team.save();

      // Send notification email (fire-and-forget)
      emailService
        .sendTeamInvitationEmail(
          email,
          team.name,
          `${config.frontendUrl}/teams/${team._id}`, // Direct link to team
          req.user.name
        )
        .catch((err: Error) =>
          console.error("Failed to send direct notification email:", err)
        );

      return res.json({
        success: true,
        message: "User added directly and notified",
        member: existingUser,
      });
    }

    // Create invitation
    const token = crypto.randomBytes(20).toString("hex");
    const invitation = await Invitation.create({
      email,
      team: team._id,
      role: role || "member",
      token,
      invitedBy: req.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Send email (fire-and-forget)
    const joinUrl = `${config.frontendUrl}/register?token=${token}`; 

    emailService
      .sendTeamInvitationEmail(email, team.name, joinUrl, req.user.name)
      .catch((err: Error) =>
        console.error("Failed to send invitation email:", err)
      );

    res.json({ success: true, data: invitation });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove team member
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private
export const removeTeamMember = async (
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

    // Filter out member
    team.members = team.members.filter(
      (m: any) => m.user.toString() !== req.params.userId
    );

    await team.save();
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team member role
// @route   PATCH /api/teams/:id/members/:userId
// @access  Private
export const updateMemberRole = async (
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

    const member = team.members.find(
      (m: any) => m.user.toString() === req.params.userId
    );

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    member.role = req.body.role;
    await team.save();

    const updatedTeam = await Team.findById(req.params.id)
      .populate("owner", "name email")
      .populate("createdBy", "name email")
      .populate("members.user", "name email");

    res.json({ success: true, data: updatedTeam });
  } catch (error) {
    next(error);
  }
};
