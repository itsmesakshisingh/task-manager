const router = require("express").Router();
const Task = require("../models/Task");

// CREATE TASK
router.post("/", async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json("Title is required");
    }

    const task = new Task({
      title: req.body.title,
      status: "pending",
    });

    const savedTask = await task.save();
    res.json(savedTask);

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json(err.message);
  }
});

// GET TASKS
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.log("FETCH ERROR:", err);
    res.status(500).json(err.message);
  }
});

// UPDATE TASK
router.put("/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json(err.message);
  }
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json("Deleted");
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json(err.message);
  }
});

module.exports = router;