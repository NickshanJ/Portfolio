import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import dns from "node:dns";

import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminProjectRoutes from "./routes/adminProjectRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import adminSkillRoutes from "./routes/adminSkillRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import adminAboutRoutes from "./routes/adminAboutRoutes.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://nickshanjportfolio.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);

app.use(express.json({ limit: "1mb" }));

app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/projects", adminProjectRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/admin/skills", adminSkillRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/admin/about", adminAboutRoutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Health-check route
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Portfolio backend is running",
  });
});

// MongoDB connection status
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    server: "running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Error-handling middleware
app.use((err, _req, res, _next) => {
  if (err.type === "entity.too.large" || err.status === 413) {
    return res.status(413).json({
      success: false,
      message: "Request body exceeds the 1 MB limit",
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
  }

  console.error("Unhandled request error:", err.message);

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred",
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Atlas connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Portfolio backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
