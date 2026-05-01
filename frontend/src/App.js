import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  // ✅ Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`, {
        headers: { Authorization: token }
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  // ✅ Add Task
  const addTask = async () => {
    if (!input.trim()) return;

    try {
      await axios.post(
        `${API}/api/tasks`,
        { title: input },
        { headers: { Authorization: token } }
      );
      setInput("");
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Toggle Task
  const toggleTask = async (id) => {
    try {
      await axios.put(
        `${API}/api/tasks/${id}`,
        {},
        { headers: { Authorization: token } }
      );
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/api/tasks/${id}`, {
        headers: { Authorization: token }
      });
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // ❌ If not logged in → show login
  if (!token) return <Auth setToken={setToken} />;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🚀 Task Manager</h2>

      <button onClick={logout}>Logout</button>

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter task"
        />
        <button onClick={addTask}>Add</button>
      </div>

      {tasks.map((task) => (
        <div key={task._id}>
          <span
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              marginRight: "10px"
            }}
          >
            {task.title}
          </span>

          <button onClick={() => toggleTask(task._id)}>✔</button>
          <button onClick={() => deleteTask(task._id)}>❌</button>
        </div>
      ))}
    </div>
  );
}

export default App;
function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      const url = isLogin ? "/api/auth/login" : "/api/auth/register";

      const res = await axios.post(`http://localhost:5000${url}`, {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{isLogin ? "Login" : "Signup"}</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={submit}>
        {isLogin ? "Login" : "Signup"}
      </button>

      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer" }}>
        {isLogin ? "Create account" : "Already have account?"}
      </p>
    </div>
  );
}