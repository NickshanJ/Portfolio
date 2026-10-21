import express from "express";
import About from "../models/About.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAdmin);

const DEFAULT_ABOUT = {
  key: "about",
  profileImage: {
    url: "",
    publicId: "",
  },
  paragraphs: [],
  infoItems: [],
};

// GET /api/admin/about
router.get("/", async (_req, res) => {
  try {
    const about = await About.findOne({ key: "about" }).lean();

    res.json({
      success: true,
      about: about || DEFAULT_ABOUT,
    });
  } catch (error) {
    console.error("Failed to fetch admin About content:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch About content",
    });
  }
});

// PUT /api/admin/about
router.put("/", async (req, res) => {
  try {
    const { profileImage, paragraphs, infoItems } = req.body;

    if (
      !profileImage ||
      typeof profileImage.url !== "string" ||
      typeof profileImage.publicId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid profile image details are required",
      });
    }

    const hasImageUrl = profileImage.url.trim().length > 0;
    const hasImagePublicId = profileImage.publicId.trim().length > 0;

    if (hasImageUrl !== hasImagePublicId) {
      return res.status(400).json({
        success: false,
        message: "Image URL and public ID must both be provided",
      });
    }

    if (
      hasImageUrl &&
      !profileImage.url.startsWith("https://res.cloudinary.com/")
    ) {
      return res.status(400).json({
        success: false,
        message: "Profile image must use a valid Cloudinary URL",
      });
    }

    if (!Array.isArray(paragraphs) || paragraphs.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Paragraphs must be an array with at most 20 items",
      });
    }

    if (!Array.isArray(infoItems) || infoItems.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Information cards must be an array with at most 20 items",
      });
    }

    const validParagraphs = paragraphs.every(
      (item) =>
        item &&
        typeof item.text === "string" &&
        item.text.trim().length > 0 &&
        item.text.trim().length <= 3000,
    );

    if (!validParagraphs) {
      return res.status(400).json({
        success: false,
        message: "Every paragraph must contain between 1 and 3000 characters",
      });
    }

    const validInfoItems = infoItems.every(
      (item) =>
        item &&
        typeof item.label === "string" &&
        item.label.trim().length > 0 &&
        item.label.trim().length <= 60 &&
        typeof item.value === "string" &&
        item.value.trim().length > 0 &&
        item.value.trim().length <= 200,
    );

    if (!validInfoItems) {
      return res.status(400).json({
        success: false,
        message: "Every information card must have a label and value",
      });
    }

    const normalizedParagraphs = paragraphs.map((item, index) => ({
      text: item.text.trim(),
      order: index,
    }));

    const normalizedInfoItems = infoItems.map((item, index) => ({
      label: item.label.trim(),
      value: item.value.trim(),
      order: index,
    }));

    const about = await About.findOneAndUpdate(
      { key: "about" },
      {
        $set: {
          profileImage: {
            url: profileImage.url.trim(),
            publicId: profileImage.publicId.trim(),
          },
          paragraphs: normalizedParagraphs,
          infoItems: normalizedInfoItems,
        },
        $setOnInsert: {
          key: "about",
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    res.json({
      success: true,
      message: "About content updated successfully",
      about,
    });
  } catch (error) {
    console.error("Failed to update About content:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid About content",
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to update About content",
    });
  }
});

export default router;
