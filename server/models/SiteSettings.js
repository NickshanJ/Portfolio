import mongoose from "mongoose";

const homeSettingsSchema = new mongoose.Schema(
  {
    roleTitles: {
      type: [String],
      default: [
        "Front-End Developer",
        "MERN Full Stack Developer",
        "React Developer",
      ],
      validate: {
        validator: (titles) =>
          titles.length > 0 &&
          titles.every(
            (title) =>
              typeof title === "string" && title.trim().length > 0,
          ),
        message: "At least one valid role title is required",
      },
    },

    description: {
      type: String,
      default:
        "Passionate about building performant, pixel-perfect web apps. From clean UIs to robust back-end systems — I bring ideas to life with modern technologies.",
      trim: true,
    },

    experienceYears: {
      type: Number,
      default: 2,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Experience years must be a whole number",
      },
    },

    terminalName: {
      type: String,
      default: "J. Nickshan",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global",
    },

    // Existing Resume settings — preserved
    resumeUrl: {
      type: String,
      default: "",
      trim: true,
    },

    resumePublicId: {
      type: String,
      default: "",
      trim: true,
    },

    // New Home page settings
    home: {
      type: homeSettingsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

export default SiteSettings;