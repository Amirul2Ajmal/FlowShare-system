<script>
import {
  fetchAssingToUser,
  updateTask,
  deleteTask,
  fetchTaskById,
} from "@/services/api";

export default {
  data() {
    return {
      selectedCategory: "Meeting",
      categories: ["Meeting", "Follow-up", "Personal", "Reminder"],
      tasks: [],
      previewFile: null, // For image preview modal
    };
  },

  computed: {
    filteredTasks() {
      return this.tasks.filter(
        (task) =>
          task.taskType === this.selectedCategory &&
          task.workStatus !== "Completed" // ✅ hide completed
      );
    },
  },

  methods: {
    /** Fetch tasks assigned to the current user */
    async fetchTasks() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          alert("❌ No user logged in");
          this.$router.push("/login");
          return;
        }
        this.tasks = await fetchAssingToUser(user.userId);
      } catch (err) {
        alert("❌ Error fetching tasks: " + err.message);
      }
    },

    /** Count tasks by category */
    taskCount(category) {
      return this.tasks.filter((task) => task.taskType === category).length;
    },

    /** Mark a task as completed */
    async completeTask(taskId) {
      try {
        console.log("👉 Completing task ID:", taskId);

        const res = await updateTask(taskId, "Completed");
        console.log("✅ API response:", res);

        if (res && res.success) {
          // ❌ Remove task from list
          this.tasks = this.tasks.filter((task) => task.worktaskId !== taskId);
          console.log("🗑️ Task removed from table:", taskId);
          alert("✅ Task marked as complete and removed!");
        } else {
          console.warn("⚠️ Task not removed, unexpected API response:", res);
          alert("⚠️ Task completed but not removed (check logs).");
        }
      } catch (err) {
        console.error("❌ Error completing task:", err);
        alert("❌ Error completing task: " + err.message);
      }
    },

    /** Delete a task */
    async deleteTaskHandler(taskId) {
      if (!confirm("Are you sure you want to delete this task?")) return;
      try {
        await deleteTask(taskId);
        this.tasks = this.tasks.filter((task) => task.worktaskId !== taskId);
        alert("🗑️ Task deleted successfully!");
      } catch (err) {
        alert("❌ Error deleting task: " + err.message);
      }
    },

    /** View or download task file */
    async viewFile(task) {
      try {
        const latestTask = await fetchTaskById(task.worktaskId);
        if (!latestTask) {
          alert("Task not found or has been deleted.");
          return;
        }

        const fileURL = latestTask.filePath
          ? `http://localhost/backend-systemPHP/${latestTask.filePath}`
          : latestTask.link;

        if (!fileURL) {
          alert("No file uploaded for this task.");
          return;
        }

        const extension = fileURL.split(".").pop().toLowerCase();
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
        const docExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "txt"];

        if (imageExtensions.includes(extension)) {
          this.previewFile = fileURL;
        } else if (docExtensions.includes(extension) || latestTask.link) {
          if (latestTask.link) {
            window.open(fileURL, "_blank");
          } else {
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = fileURL.split("/").pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } else {
          alert("File type not supported for preview or download.");
        }
      } catch (err) {
        console.error("Failed to fetch task:", err);
        alert("Failed to fetch task details.");
      }
    },

    /** Close image preview modal */
    closePreview() {
      this.previewFile = null;
    },

    /** Logout current user */
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
      alert("You have been logged out.");
    },
  },

  mounted() {
    this.fetchTasks();
  },
};
</script>

<template>
  <div class="content">
    <div class="top-bar">
      <button class="btn btn-logout" @click="logout">Logout</button>
    </div>
    <br />
    <div class="md-layout">
      <div class="md-layout-item">
        <div class="card">
          <div class="card-header">
            <h4 class="title">Notifications</h4>
            <p class="category">EVERY HARDSHIP COMES WITH HUGE REWARD</p>
          </div>

          <div class="card-content">
            <!-- ✅ Category Radios -->
            <div class="category-radios">
              <div v-for="cat in categories" :key="cat" class="radio-option">
                <input type="radio" :id="cat" name="category" :value="cat" v-model="selectedCategory"
                  class="radio-input" />
                <label :for="cat" class="radio-label">
                  {{ cat }} ({{ taskCount(cat) }})
                </label>
              </div>
            </div>

            <!-- Task List -->
            <div v-if="filteredTasks.length">
              <div v-for="task in filteredTasks" :key="task.worktaskId" class="alert"
                :class="'alert-' + task.taskType.toLowerCase().replace(' ', '')">
                <span>
                  <b>{{ task.taskType }} - </b>{{ task.description }}
                  <br />
                  <small>
                    👤 Created By: {{ task.createdByName || "Unknown" }}
                  </small>
                </span>

                <div class="task-actions">
                  <!-- ✅ Complete Task -->
                  <md-button class="md-raised md-success" style="margin-right: 8px; border-radius: 20px"
                    @click="completeTask(task.worktaskId)">
                    Complete
                  </md-button>

                  <!-- 🗑️ Delete Task -->
                  <md-button class="md-raised delete-btn" style="margin-right: 8px; border-radius: 20px"
                    @click="deleteTaskHandler(task.worktaskId)">
                    Delete
                  </md-button>

                  <!-- 📂 View/Download -->
                  <md-button class="md-raised" style="background-color: #9e9e9e; color: white; border-radius: 20px"
                    @click="viewFile(task)">
                    Download
                  </md-button>
                </div>
              </div>
            </div>

            <div v-else>
              <p class="text-center">
                No tasks available for {{ selectedCategory }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Image Preview Modal -->
    <div v-if="previewFile" class="modal">
      <img :src="previewFile" alt="Preview" style="max-width: 100%; max-height: 500px" />
      <button class="btn btn-secondary" @click="closePreview">Close</button>
    </div>
  </div>
</template>

<style scoped>
/* Category Colors (Task Boxes) */
.alert-meeting,
.alert-followup,
.alert-documentreview,
.alert-reminder {
  color: white;
  margin: 12px 0;
  padding: 16px;
  border-radius: 8px;
  font-size: 18px;
  line-height: 1.6;
}

/* inside <style scoped> */
.delete-btn {
  background-color: red !important;
  color: white !important;
}

/* Backgrounds */
.alert-meeting {
  background-color: #4a90e2;
}

.alert-followup {
  background-color: #f5a623;
}

.alert-documentreview {
  background-color: #7b8d8e;
}

.alert-reminder {
  background-color: #ed962a;
}

/* Main task text (e.g., Meeting - Task description) */
.alert span {
  font-size: 20px;
  /* ⬆️ larger main text */
  font-weight: 700;
  /* ⬆️ bold */
  display: block;
  margin-bottom: 6px;
}

/* Created By text */
.alert small {
  font-size: 15px;
  font-weight: 400;
  opacity: 0.85;
}

/* ✅ Radio buttons */
.category-radios {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin-bottom: 1.8rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.radio-input {
  accent-color: #4caf50;
  width: 22px;
  height: 22px;
  cursor: pointer;
}

.radio-label {
  font-weight: 600;
  cursor: pointer;
  color: #222;
  font-size: 17px;
  letter-spacing: 0.3px;
}

.radio-label:hover {
  color: #4caf50;
}

/* ✅ Buttons */
.btn {
  border: none;
  padding: 10px 18px;
  margin: 0 6px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}

.btn:hover {
  transform: scale(1.07);
}

.btn-primary {
  background: #2196f3;
  color: white;
}

.btn-primary:hover {
  background: #1976d2;
}

.btn-success {
  background: #4caf50;
  color: white;
}

.btn-success:hover {
  background: #388e3c;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover {
  background: #c62828;
}

.btn-secondary {
  background: #9e9e9e;
  color: white;
}

.btn-secondary:hover {
  background: #757575;
}

.btn-logout {
  background: #ff5722;
  color: white;
  font-weight: 700;
  font-size: 16px;
  padding: 10px 20px;
}

.btn-logout:hover {
  background: #e64a19;
}

/* Card styling */
.card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1.5rem;
}

.card-header {
  margin-bottom: 1.2rem;
}

.title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category {
  color: #555;
  font-size: 16px;
  font-style: italic;
}

/* Task actions */
.task-actions {
  margin-top: 12px;
}

/* Modal */
.modal {
  position: fixed;
  top: 10%;
  left: 10%;
  width: 80%;
  background: #fff;
  padding: 1.5rem;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  font-size: 16px;
}
</style>
