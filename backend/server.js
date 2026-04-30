const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS FIX (IMPORTANT)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Routes
const taskRoutes = require("./routes/task");
const authRoutes = require("./routes/auth");

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

// Root route (for testing)
app.get("/", (req, res) => {
  res.send("Task Manager API is running 🚀");
});

// Connect DB + start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(Server running on port ${PORT});
    });
  })
  .catch(err => console.log(err));