const router = require("express").Router();
const Task = require("../models/Task");
const verifyToken = require("../middleware/auth");

// CREATE TASK (linked to project + user)
router.post("/", verifyToken, async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      project: req.body.projectId,
      assignedTo: req.body.userId,
      dueDate: req.body.dueDate,
    });

    const saved = await task.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET ALL TASKS
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "name")
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// UPDATE STATUS
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json("Task deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;