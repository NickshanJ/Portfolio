import express from "express";
import About from "../models/About.js";

const router = express.Router();

const DEFAULT_ABOUT = {
  key: "about",
  profileImage: {
    url: "",
    publicId: "",
  },
  paragraphs: [],
  infoItems: [],
};

// GET /api/about
router.get("/", async (_req, res) => {
  try {
    const about = await About.findOne({ key: "about" }).lean();

    res.json({
      success: true,
      about: about || DEFAULT_ABOUT,
    });
  } catch (error) {
    console.error("Failed to fetch About content:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch About content",
    });
  }
});

export default router;