import Notification, { INotification } from "../models/Notification";
import mongoose from "mongoose";

interface CreateNotificationParams {
  userId: string | mongoose.Types.ObjectId;
  type:
    | "task_assigned"
    | "project_update"
    | "mention"
    | "team_invite"
    | "general";
  title: string;
  message: string;
  relatedProject?: string | mongoose.Types.ObjectId;
  relatedTask?: string | mongoose.Types.ObjectId;
  relatedTeam?: string | mongoose.Types.ObjectId;
}

/**
 * Service for managing notifications
 */
class NotificationService {
  /**
   * Create a new notification
   */
  async createNotification(
    params: CreateNotificationParams
  ): Promise<INotification> {
    const notification = await Notification.create({
      user: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      relatedProject: params.relatedProject,
      relatedTask: params.relatedTask,
      relatedTeam: params.relatedTeam,
    });

    return notification;
  }

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(
    userId: string,
    options: { unreadOnly?: boolean; limit?: number } = {}
  ): Promise<INotification[]> {
    const query: any = { user: userId };

    if (options.unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(options.limit || 50)
      .populate("relatedProject", "name")
      .populate("relatedTask", "title")
      .populate("relatedTeam", "name");

    return notifications;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<INotification | null> {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    return notification;
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    const result = await Notification.findByIdAndDelete(notificationId);
    return !!result;
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const count = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    return count;
  }

  /**
   * Notify user about task assignment
   */
  async notifyTaskAssigned(
    userId: string,
    taskTitle: string,
    taskId: string,
    projectId?: string
  ): Promise<INotification> {
    return this.createNotification({
      userId,
      type: "task_assigned",
      title: "New Task Assigned",
      message: `You have been assigned to task: ${taskTitle}`,
      relatedTask: taskId,
      relatedProject: projectId,
    });
  }

  /**
   * Notify users about project update
   */
  async notifyProjectUpdate(
    userIds: string[],
    projectName: string,
    projectId: string,
    updateMessage: string
  ): Promise<void> {
    const notifications = userIds.map((userId) => ({
      user: userId,
      type: "project_update" as const,
      title: `Project Update: ${projectName}`,
      message: updateMessage,
      relatedProject: projectId,
    }));

    await Notification.insertMany(notifications);
  }

  /**
   * Notify user about team invitation
   */
  async notifyTeamInvite(
    userId: string,
    teamName: string,
    teamId: string
  ): Promise<INotification> {
    return this.createNotification({
      userId,
      type: "team_invite",
      title: "Team Invitation",
      message: `You have been invited to join team: ${teamName}`,
      relatedTeam: teamId,
    });
  }
}

export default new NotificationService();
