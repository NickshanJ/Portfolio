import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project.js";

const router = express.Router();

// GET /api/projects — published projects for the public portfolio
router.get("/", async (_req, res) => {
  try {
    const projects = await Project.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Fetch public projects failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch projects",
    });
  }
});

// GET /api/projects/:id — one published project
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      published: true,
    }).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({ success: true, project });
  } catch (error) {
    console.error("Fetch project failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch project",
    });
  }
});

export default router;