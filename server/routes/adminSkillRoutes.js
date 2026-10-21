import express from "express";
import mongoose from "mongoose";
import Skill from "../models/Skill.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAdmin);

function validateSkill(body) {
  const { name, icon, color, order, published } = body;

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    return "Skill name must be a non-empty string";
  }

  if (icon !== undefined && (typeof icon !== "string" || !icon.trim())) {
    return "Icon identifier must be a non-empty string";
  }

  if (
    color !== undefined &&
    (typeof color !== "string" ||
      !/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color))
  ) {
    return "Color must be a valid hexadecimal color";
  }

  if (order !== undefined && (!Number.isInteger(order) || order < 0)) {
    return "Order must be a non-negative integer";
  }

  if (published !== undefined && typeof published !== "boolean") {
    return "Published must be true or false";
  }

  return null;
}

// GET /api/admin/skills — list all skills, including unpublished
router.get("/", async (_req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: 1 }).lean();

    res.json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    console.error("Admin skill list failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch skills",
    });
  }
});

// POST /api/admin/skills — create a skill
router.post("/", async (req, res) => {
  try {
    const body = req.body ?? {};
    const validationError = validateSkill(body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (!body.name?.trim() || !body.icon?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Skill name and icon are required",
      });
    }

    const skill = await Skill.create({
      name: body.name.trim(),
      icon: body.icon.trim(),
      color: body.color ?? "#00D4FF",
      order: body.order ?? 0,
      published: body.published ?? true,
    });

    return res.status(201).json({
      success: true,
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    console.error("Create skill failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create skill",
    });
  }
});

// PUT /api/admin/skills/:id — update a skill
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    const body = req.body ?? {};
    const validationError = validateSkill(body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const updates = {};

    for (const field of ["name", "icon", "color", "order", "published"]) {
      if (body[field] !== undefined) {
        updates[field] =
          typeof body[field] === "string" ? body[field].trim() : body[field];
      }
    }

    const skill = await Skill.findByIdAndUpdate(id, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.json({
      success: true,
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    console.error("Update skill failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update skill",
    });
  }
});

// DELETE /api/admin/skills/:id — delete a skill
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete skill failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete skill",
    });
  }
});

export default router;
