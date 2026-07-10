const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    techStack: {
      // Comma-separated tags, e.g. "React, Node.js, MongoDB"
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },
    liveUrl: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      // Optional thumbnail/screenshot link (e.g. hosted on GitHub or Cloudinary)
      type: String,
      trim: true,
      default: "",
    },
    featured: {
      // Featured projects can be shown first / highlighted
      type: Boolean,
      default: false,
    },
    order: {
      // Lower number = shown first, for manual ordering on the site
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
