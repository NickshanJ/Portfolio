import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAdmin);

function validateProject(body) {
  const {
    slug,
    title,
    description,
    image,
    imagePublicId,
    technologies,
    liveUrl,
    githubUrl,
    frontendUrl,
    backendUrl,
    category,
    featured,
    published,
    order,
  } = body;

  if (
    title !== undefined &&
    (typeof title !== "string" || !title.trim() || title.trim().length > 120)
  ) {
    return "Title must be a non-empty string of at most 120 characters";
  }

  if (
    description !== undefined &&
    (typeof description !== "string" ||
      !description.trim() ||
      description.trim().length > 3000)
  ) {
    return "Description must be a non-empty string of at most 3000 characters";
  }

  for (const value of [
    slug,
    image,
    imagePublicId,
    liveUrl,
    githubUrl,
    frontendUrl,
    backendUrl,
    category,
  ]) {
    if (value !== undefined && typeof value !== "string") {
      return "Text fields must be strings";
    }
  }

  if (slug !== undefined && slug !== "") {
    if (slug !== slug.trim()) {
      return "Slug must not contain leading or trailing spaces";
    }

    if (slug !== slug.toLowerCase()) {
      return "Slug must contain only lowercase letters";
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return "Slug may contain only lowercase letters, numbers, and single hyphens between words";
    }

    if (slug.length > 100) {
      return "Slug must not exceed 100 characters";
    }
  }

  const urlFields = {
    liveUrl,
    githubUrl,
    frontendUrl,
    backendUrl,
  };

  for (const [field, value] of Object.entries(urlFields)) {
    if (value === undefined || value.trim() === "") {
      continue;
    }

    try {
      const parsedUrl = new URL(value);

      if (
        !["http:", "https:"].includes(parsedUrl.protocol) ||
        !parsedUrl.hostname.includes(".") ||
        parsedUrl.hostname.startsWith(".") ||
        parsedUrl.hostname.endsWith(".")
      ) {
        return `${field} must be a valid HTTP or HTTPS URL`;
      }
    } catch {
      return `${field} must be a valid HTTP or HTTPS URL`;
    }
  }

  if (category !== undefined && category.trim().length > 60) {
    return "Category must not exceed 60 characters";
  }

  if (technologies !== undefined) {
    if (
      !Array.isArray(technologies) ||
      !technologies.every((item) => typeof item === "string")
    ) {
      return "Technologies must be an array of strings";
    }

    if (technologies.length > 20) {
      return "A project can have at most 20 technologies";
    }

    if (
      !technologies.every(
        (item) => item.trim().length > 0 && item.trim().length <= 50,
      )
    ) {
      return "Each technology must contain 1–50 non-whitespace characters";
    }
  }

  if (featured !== undefined && typeof featured !== "boolean") {
    return "Featured must be true or false";
  }

  if (published !== undefined && typeof published !== "boolean") {
    return "Published must be true or false";
  }

  if (order !== undefined && (!Number.isInteger(order) || order < 0)) {
    return "Order must be a non-negative integer";
  }

  return null;
}

function handleProjectError(error, res, fallbackMessage) {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A project with this slug already exists.",
    });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  console.error(`${fallbackMessage}:`, error.message);

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
}

// GET /api/admin/projects — list all projects, including drafts
router.get("/", async (_req, res) => {
  try {
    const projects = await Project.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    return handleProjectError(error, res, "Unable to fetch projects");
  }
});

// POST /api/admin/projects — create a project
router.post("/", async (req, res) => {
  try {
    const validationError = validateProject(req.body ?? {});

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const { title, description, ...rest } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      ...rest,
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    return handleProjectError(error, res, "Unable to create project");
  }
});

// PUT /api/admin/projects/:id — update a project
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const validationError = validateProject(req.body ?? {});

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const updates = { ...req.body };
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.updatedAt;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { returnDocument: "after", runValidators: true },
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({ success: true, project });
  } catch (error) {
    return handleProjectError(error, res, "Unable to update project");
  }
});

// DELETE /api/admin/projects/:id — delete a project
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return handleProjectError(error, res, "Unable to delete project");
  }
});

export default router;
