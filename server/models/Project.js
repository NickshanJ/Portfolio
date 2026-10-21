import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // Stable identifier corresponding to the existing project id
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    // Project image and its Cloudinary reference
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },

    // Technologies shown as project chips
    technologies: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (items) => items.length <= 20,
          message: "A project can have at most 20 technologies",
        },
        {
          validator: (items) =>
            items.every(
              (item) => item.trim().length > 0 && item.trim().length <= 50,
            ),
          message:
            "Each technology must contain 1–50 non-whitespace characters",
        },
      ],
    },

    // Live demo and source repositories
    liveUrl: {
      type: String,
      default: "",
      trim: true,
    },
    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },
    frontendUrl: {
      type: String,
      default: "",
      trim: true,
    },
    backendUrl: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "Web Development",
      trim: true,
      maxlength: 60,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: false,
    },

    // Controls display sequence, e.g. 1, 2, 3
    order: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Order must be a whole number",
      },
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;