import mongoose from "mongoose";

const paragraphSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Paragraph order must be a non-negative integer",
      },
    },
  },
  { _id: true }
);

const infoItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    value: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Information order must be a non-negative integer",
      },
    },
  },
  { _id: true }
);

const aboutSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "about",
      immutable: true,
    },
    profileImage: {
      url: {
        type: String,
        default: "",
        trim: true,
      },
      publicId: {
        type: String,
        default: "",
        trim: true,
      },
    },
    paragraphs: {
      type: [paragraphSchema],
      default: [],
    },
    infoItems: {
      type: [infoItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const About = mongoose.model("About", aboutSchema);

export default About;