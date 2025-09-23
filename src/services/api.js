// src/services/api.js
import axios from "axios";

const API_BASE = "http://localhost/backend-systemPHP/public/index.php/api/v1";

// 🔹 Central axios instance
const api = axios.create({
  baseURL: "http://localhost/backend-systemPHP/public/index.php/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// 🔹 Generic error handler
function handleError(error) {
  if (error.response) {
    throw new Error(error.response.data?.message || "Server error");
  }
  throw new Error(error.message || "Network error");
}

// =========================
// ✅ USER API
// =========================
export async function fetchUsers() {
  try {
    const res = await api.get("/user/list");
    return res.data.data || [];
  } catch (err) {
    handleError(err);
  }
}

// =========================
// ✅ TASK API
// =========================
export async function createTask(payload) {
  try {
    const formData = new FormData();
    formData.append("createBy", payload.createBy);
    formData.append("assignTo", payload.assignTo || payload.createBy);
    formData.append("taskType", payload.taskType);
    formData.append("description", payload.description || "");
    formData.append("link", payload.link || "");
    if (payload.file) {
      formData.append("file", payload.file);
    }

    const res = await api.post("/worktask/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    handleError(err);
  }
}
//task created by user
export async function fetchTasksByUser(userId) {
  try {
    const res = await api.post("/worktask/readbyuser", { userId });
    return res.data.data || [];
  } catch (err) {
    handleError(err);
  }
}

//task assing to user
export async function fetchAssingToUser(userId) {
  try {
    const res = await api.post("/worktask/assingto", { userId });
    return res.data.data || [];
  } catch (err) {
    handleError(err);
  }
}

export async function deleteTask(taskID) {
  try {
    const res = await api.post("/worktask/delete", { workTaskId: taskID });
    return res.data;
  } catch (err) {
    handleError(err);
  }
}

// Fetch a single task by its ID
export async function fetchTaskById(taskID) {
  try {
    const res = await api.post("/worktask/readbyid", { workTaskId: taskID });
    // Assuming backend returns { data: taskObject }
    return res.data.data;
  } catch (err) {
    handleError(err);
  }
}

// =========================
// 🔹 Placeholder for future (Update, etc.)
// =========================
export async function updateTask(worktaskId, workStatus) {
  try {
    const res = await api.post("/worktask/updateStatus", {
      worktaskId,
      workStatus,
    });
    return res.data;
  } catch (err) {
    handleError(err);
  }
}
