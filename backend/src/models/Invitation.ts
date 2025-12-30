import mongoose, { Schema, Document } from "mongoose";

export interface IInvitation extends Document {
  email: string;
  team: mongoose.Types.ObjectId;
  role: "admin" | "member" | "viewer";
  token: string;
  invitedBy: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const InvitationSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },
    token: { type: String, required: true, unique: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Expire automatically after expiresAt
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IInvitation>("Invitation", InvitationSchema);
