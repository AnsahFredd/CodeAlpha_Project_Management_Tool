import dotenv from "dotenv";

dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  mongodbUri:
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/project-management-tool",
  jwtSecret: process.env.JWT_SECRET || "fallback_secret_for_development_only",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  email: {
    service: process.env.EMAIL_SERVICE || "gmail",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
  },
};

// Validation to ensure critical variables are present in production
if (config.env === "production") {
  const criticalVars = [
    "MONGODB_URI",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  criticalVars.forEach((v) => {
    if (!process.env[v]) {
      console.warn(`WARNING: Missing critical environment variable: ${v}`);
    }
  });
}

export default config;
