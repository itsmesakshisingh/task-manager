const router = require("express").Router();
const Project = require("../models/Project");
const verifyToken = require("../middleware/auth");

// CREATE PROJECT
router.post("/", verifyToken, async (req, res) => {
  try {
    const project = new Project({
      name: req.body.name,
      owner: req.user.id,
      members: [req.user.id],
    });

    const savedProject = await project.save();
    res.json(savedProject);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET PROJECTS
router.get("/", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;