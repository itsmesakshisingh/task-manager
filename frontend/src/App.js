import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

/* ================= LOGIN COMPONENT ================= */
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("Login successful");
      onLogin();
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="add-btn" onClick={login}>
        Login
      </button>
    </div>
  );
}

/* ================= MAIN APP ================= */
function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [projectName, setProjectName] = useState("");

  const API = "http://localhost:5000/api/tasks";
  const PROJECT_API = "http://localhost:5000/api/projects";

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  /* ================= FETCH TASKS ================= */
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: token },
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (loggedIn) fetchTasks();
  }, [loggedIn]);

  /* ================= ADD TASK ================= */
  const addTask = async () => {
    if (!title) return;

    await axios.post(
      API,
      { title },
      { headers: { Authorization: token } }
    );

    setTitle("");
    fetchTasks();
  };

  /* ================= DELETE TASK ================= */
  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`, {
      headers: { Authorization: token },
    });
    fetchTasks();
  };

  /* ================= UPDATE TASK ================= */
  const updateTask = async (id, status) => {
    await axios.put(
      `${API}/${id}`,
      { status },
      { headers: { Authorization: token } }
    );
    fetchTasks();
  };

  /* ================= CREATE PROJECT ================= */
  const createProject = async () => {
    if (!projectName) return;

    await axios.post(
      PROJECT_API,
      { name: projectName },
      { headers: { Authorization: token } }
    );

    alert("Project created");
    setProjectName("");
  };

  /* ================= DASHBOARD ================= */
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.filter((t) => t.status !== "Completed").length;

  const overdue = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== "Completed"
  ).length;

  /* ================= LOGIN SCREEN ================= */
  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="container">
      <h2>🚀 Team Task Manager</h2>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.clear();
          setLoggedIn(false);
        }}
      >
        Logout
      </button>

      {/* Dashboard */}
      <div style={{ marginBottom: "20px" }}>
        <h3>📊 Dashboard</h3>
        <p>✅ Completed: {completed}</p>
        <p>⏳ Pending: {pending}</p>
        <p>⚠️ Overdue: {overdue}</p>
      </div>

      {/* Project Creation (Admin only) */}
      {role === "admin" && (
        <div>
          <input
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <button onClick={createProject}>Create Project</button>
        </div>
      )}

      {/* Add Task */}
      <div className="input-section">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task..."
        />
        <button className="add-btn" onClick={addTask}>
          Add Task
        </button>
      </div>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <span
              className={task.status === "Completed" ? "completed" : ""}
            >
              {task.title} - {task.status}
            </span>

            <div>
              <select
                onChange={(e) =>
                  updateTask(task._id, e.target.value)
                }
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <button
                className="delete-btn"
                onClick={() => deleteTask(task._id)}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;