const Project = require("../models/Project");

// @route  GET /api/projects
// @desc   PUBLIC — get all projects, sorted by order then newest first
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

// @route  GET /api/projects/:id
// @desc   PUBLIC — get a single project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error: error.message });
  }
};

// @route  POST /api/projects
// @desc   ADMIN ONLY — create a new project
const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, liveUrl, imageUrl, featured, order } =
      req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const project = await Project.create({
      title,
      description,
      techStack: Array.isArray(techStack)
        ? techStack
        : (techStack || "").split(",").map((t) => t.trim()).filter(Boolean),
      githubUrl,
      liveUrl,
      imageUrl,
      featured,
      order,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

// @route  PUT /api/projects/:id
// @desc   ADMIN ONLY — update a project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { title, description, techStack, githubUrl, liveUrl, imageUrl, featured, order } =
      req.body;

    project.title = title ?? project.title;
    project.description = description ?? project.description;
    if (techStack !== undefined) {
      project.techStack = Array.isArray(techStack)
        ? techStack
        : techStack.split(",").map((t) => t.trim()).filter(Boolean);
    }
    project.githubUrl = githubUrl ?? project.githubUrl;
    project.liveUrl = liveUrl ?? project.liveUrl;
    project.imageUrl = imageUrl ?? project.imageUrl;
    project.featured = featured ?? project.featured;
    project.order = order ?? project.order;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error: error.message });
  }
};

// @route  DELETE /api/projects/:id
// @desc   ADMIN ONLY — delete a project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
