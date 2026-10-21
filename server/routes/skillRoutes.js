import express from "express";
import Skill from "../models/Skill.js";

const router = express.Router();

// GET /api/skills — published skills for the public portfolio
router.get("/", async (_req, res) => {
  try {
    const skills = await Skill.find({ published: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    res.json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    console.error("Fetch public skills failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch skills",
    });
  }
});

export default router;