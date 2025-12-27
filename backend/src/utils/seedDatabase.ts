import mongoose from "mongoose";
import User from "../models/User";
import Project from "../models/Project";
import Task from "../models/Task";
import Team from "../models/Team";
import connectDB from "../config/database";

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Team.deleteMany({});

    console.log("Cleared existing data");

    // Create sample users
    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "member",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        role: "member",
      },
      {
        name: "Bob Wilson",
        email: "bob@example.com",
        password: "password123",
        role: "viewer",
      },
    ]);

    console.log(`Created ${users.length} users`);

    // Create sample projects
    const projects = await Project.create([
      {
        name: "Website Redesign",
        description: "Complete redesign of company website",
        status: "active",
        owner: users[0]._id,
        members: [users[1]._id, users[2]._id],
      },
      {
        name: "Mobile App Development",
        description: "Build iOS and Android mobile applications",
        status: "planning",
        owner: users[0]._id,
        members: [users[1]._id],
      },
      {
        name: "Marketing Campaign",
        description: "Q1 marketing campaign planning and execution",
        status: "on-hold",
        owner: users[1]._id,
        members: [users[2]._id, users[3]._id],
      },
    ]);

    console.log(`Created ${projects.length} projects`);

    // Create sample tasks
    const tasks = await Task.create([
      {
        title: "Design homepage mockup",
        description: "Create initial homepage design concepts",
        status: "in-progress",
        priority: "high",
        project: projects[0]._id,
        assignedTo: users[2]._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        title: "Set up development environment",
        description: "Configure local dev environment for the project",
        status: "done",
        priority: "medium",
        project: projects[0]._id,
        assignedTo: users[1]._id,
      },
      {
        title: "Research competitor apps",
        description: "Analyze top 5 competitor mobile applications",
        status: "todo",
        priority: "medium",
        project: projects[1]._id,
        assignedTo: users[1]._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      },
      {
        title: "Create wireframes",
        description: "Mobile app wireframes for all main screens",
        status: "todo",
        priority: "high",
        project: projects[1]._id,
      },
      {
        title: "Social media content calendar",
        description: "Plan content for Q1 social media posts",
        status: "blocked",
        priority: "urgent",
        project: projects[2]._id,
        assignedTo: users[2]._id,
      },
    ]);

    console.log(`Created ${tasks.length} tasks`);

    // Create sample teams
    const teams = await Team.insertMany([
      {
        name: "Development Team",
        description: "Core development team",
        members: [users[0]._id, users[1]._id],
        owner: users[0]._id,
      },
      {
        name: "Design Team",
        description: "UI/UX design team",
        members: [users[2]._id],
        owner: users[2]._id,
      },
    ]);

    console.log(`Created ${teams.length} teams`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
