import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type:
    | "task_assigned"
    | "project_update"
    | "mention"
    | "team_invite"
    | "general";
  title: string;
  message: string;
  read: boolean;
  relatedProject?: mongoose.Types.ObjectId;
  relatedTask?: mongoose.Types.ObjectId;
  relatedTeam?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "task_assigned",
        "project_update",
        "mention",
        "team_invite",
        "general",
      ],
      default: "general",
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedProject: { type: Schema.Types.ObjectId, ref: "Project" },
    relatedTask: { type: Schema.Types.ObjectId, ref: "Task" },
    relatedTeam: { type: Schema.Types.ObjectId, ref: "Team" },
  },
  { timestamps: true }
);

// Index for faster queries
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
