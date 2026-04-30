import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Login from "./Login";

const API_URL = "https://task-manager-production-ad42.up.railway.app";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // ================= FETCH TASKS =================
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(${API_URL}/api/tasks, {
        headers: {
          Authorization: Bearer ${localStorage.getItem("token")},
        },
      });

      setTasks(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  }, []);

  // ================= LOAD TASKS =================
  useEffect(() => {
    if (loggedIn) fetchTasks();
  }, [loggedIn, fetchTasks]);

  // ================= LOGIN =================
  const handleLogin = () => {
    setLoggedIn(true);
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  // ================= ADD TASK =================
  const addTask = async () => {
    if (!taskInput) return;

    try {
      const res = await axios.post(
        ${API_URL}/api/tasks,
        { text: taskInput },
        {
          headers: {
            Authorization: Bearer ${localStorage.getItem("token")},
          },
        }
      );

      setTasks([...tasks, res.data]);
      setTaskInput("");
    } catch (err) {
      console.log("Add error:", err);
    }
  };

  // ================= DELETE TASK =================
  const deleteTask = async (id) => {
    try {
      await axios.delete(${API_URL}/api/tasks/${id}, {
        headers: {
          Authorization: Bearer ${localStorage.getItem("token")},
        },
      });

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // ================= UI =================
  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🚀 Team Task Manager</h2>

      <button onClick={handleLogout}>Logout</button>

      <h3>📊 Dashboard</h3>
      <p>Completed: 0</p>
      <p>Pending: {tasks.length}</p>

      <input
        type="text"
        placeholder="Enter task..."
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
      />

      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.text}
            <button onClick={() => deleteTask(task._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;