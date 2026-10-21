import express from "express";
import SiteSettings from "../models/SiteSettings.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public: Get the current resume URL
router.get("/resume", async (_req, res) => {
  try {
    const settings = await SiteSettings.findOne({ key: "global" }).lean();

    res.json({
      success: true,
      resumeUrl: settings?.resumeUrl || "",
    });
  } catch (error) {
    console.error("Failed to fetch resume settings:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch resume settings",
    });
  }
});

// Admin: Update the current resume URL and Cloudinary public ID
router.put("/admin/resume", requireAdmin, async (req, res) => {
  try {
    const { resumeUrl, resumePublicId } = req.body;

    if (
      typeof resumeUrl !== "string" ||
      !resumeUrl.startsWith("https://res.cloudinary.com/") ||
      typeof resumePublicId !== "string" ||
      !resumePublicId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid Cloudinary resume URL and public ID are required",
      });
    }

    const settings = await SiteSettings.findOneAndUpdate(
      { key: "global" },
      {
        $set: {
          resumeUrl: resumeUrl.trim(),
          resumePublicId: resumePublicId.trim(),
        },
        $setOnInsert: { key: "global" },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      },
    );

    res.json({
      success: true,
      message: "Resume settings updated successfully",
      resumeUrl: settings.resumeUrl,
    });
  } catch (error) {
    console.error("Failed to update resume settings:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update resume settings",
    });
  }
});

// GET /api/settings/home
router.get("/home", async (_req, res) => {
  try {
    const settings = await SiteSettings.findOne({
      key: "global",
    }).lean();

    const defaults = {
      roleTitles: [
        "Front-End Developer",
        "MERN Full Stack Developer",
        "React Developer",
      ],
      description:
        "Passionate about building performant, pixel-perfect web apps. From clean UIs to robust back-end systems — I bring ideas to life with modern technologies.",
      experienceYears: 2,
      terminalName: "J. Nickshan",
    };

    const savedHome = settings?.home || {};

    res.json({
      success: true,
      home: {
        roleTitles:
          Array.isArray(savedHome.roleTitles) && savedHome.roleTitles.length > 0
            ? savedHome.roleTitles
            : defaults.roleTitles,
        description: savedHome.description ?? defaults.description,
        experienceYears: savedHome.experienceYears ?? defaults.experienceYears,
        terminalName: savedHome.terminalName ?? defaults.terminalName,
      },
    });
  } catch (error) {
    console.error("Failed to fetch Home settings:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch Home settings",
    });
  }
});

// PUT /api/settings/admin/home
router.put("/admin/home", requireAdmin, async (req, res) => {
  try {
    const { roleTitles, description, experienceYears, terminalName } =
      req.body ?? {};

    if (
      !Array.isArray(roleTitles) ||
      roleTitles.length === 0 ||
      !roleTitles.every(
        (title) => typeof title === "string" && title.trim().length > 0,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one valid role title is required",
      });
    }

    if (typeof description !== "string" || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid Home description is required",
      });
    }

    if (!Number.isInteger(experienceYears) || experienceYears < 0) {
      return res.status(400).json({
        success: false,
        message: "Experience years must be a non-negative integer",
      });
    }

    if (typeof terminalName !== "string" || !terminalName.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid terminal name is required",
      });
    }

    const settings = await SiteSettings.findOneAndUpdate(
      { key: "global" },
      {
        $set: {
          "home.roleTitles": roleTitles.map((title) => title.trim()),
          "home.description": description.trim(),
          "home.experienceYears": experienceYears,
          "home.terminalName": terminalName.trim(),
        },
        $setOnInsert: { key: "global" },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );

    res.json({
      success: true,
      message: "Home settings updated successfully",
      home: settings.home.toObject(),
    });
  } catch (error) {
    console.error("Failed to update Home settings:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update Home settings",
    });
  }
});

export default router;