import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Service for sending emails
 * Note: Requires nodemailer to be installed and email configuration in .env
 */
class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter
   */
  private initializeTransporter() {
    // Check if email configuration exists
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
      console.warn(
        "Email configuration not found. Email functionality will be disabled."
      );
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      console.log("Email transporter initialized successfully");
    } catch (error) {
      console.error("Failed to initialize email transporter:", error);
    }
  }

  /**
   * Send an email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.warn("Email transporter not configured. Email not sent.");
      return false;
    }

    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || "Project Management Tool"}" <${
          process.env.EMAIL_FROM || process.env.EMAIL_USER
        }>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const subject = "Welcome to Project Management Tool";
    const html = `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for joining our Project Management Tool.</p>
      <p>You can now start creating projects, managing tasks, and collaborating with your team.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <br>
      <p>Best regards,<br>The Project Management Team</p>
    `;
    const text = `Welcome, ${name}! Thank you for joining our Project Management Tool. You can now start creating projects, managing tasks, and collaborating with your team.`;

    return this.sendEmail({ to: email, subject, html, text });
  }

  /**
   * Send task assignment notification email
   */
  async sendTaskAssignmentEmail(
    email: string,
    userName: string,
    taskTitle: string,
    projectName: string
  ): Promise<boolean> {
    const subject = `New Task Assigned: ${taskTitle}`;
    const html = `
      <h2>New Task Assignment</h2>
      <p>Hi ${userName},</p>
      <p>You have been assigned a new task:</p>
      <p><strong>${taskTitle}</strong></p>
      <p>Project: ${projectName}</p>
      <p>Please log in to the Project Management Tool to view the details.</p>
      <br>
      <p>Best regards,<br>The Project Management Team</p>
    `;
    const text = `Hi ${userName}, You have been assigned a new task: ${taskTitle} in project ${projectName}. Please log in to view the details.`;

    return this.sendEmail({ to: email, subject, html, text });
  }

  /**
   * Send project invitation email
   */
  async sendProjectInvitationEmail(
    email: string,
    userName: string,
    projectName: string,
    inviterName: string
  ): Promise<boolean> {
    const subject = `Project Invitation: ${projectName}`;
    const html = `
      <h2>Project Invitation</h2>
      <p>Hi ${userName},</p>
      <p>${inviterName} has invited you to join the project:</p>
      <p><strong>${projectName}</strong></p>
      <p>Please log in to the Project Management Tool to view the project.</p>
      <br>
      <p>Best regards,<br>The Project Management Team</p>
    `;
    const text = `Hi ${userName}, ${inviterName} has invited you to join the project: ${projectName}. Please log in to view the project.`;

    return this.sendEmail({ to: email, subject, html, text });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<boolean> {
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/reset-password/${resetToken}`;
    const subject = "Password Reset Request";
    const html = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your account.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>The Project Management Team</p>
    `;
    const text = `You requested a password reset. Please visit this link to reset your password: ${resetUrl}. This link will expire in 1 hour.`;

    return this.sendEmail({ to: email, subject, html, text });
  }
}

export default new EmailService();
