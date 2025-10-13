<template>
  <div class="content">
    <!-- Material Icons CDN -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

    <!-- Top Bar Logout -->
    <div class="top-bar">
      <md-button class="md-raised md-accent btn-logout" @click="dialogActive = true">
        <i class="material-icons" style="vertical-align: middle; margin-right: 6px">
          exit_to_app
        </i>
        Logout
      </md-button>
    </div>

    <!-- Logout Confirmation Dialog -->
    <md-dialog :md-active.sync="dialogActive" class="logout-dialog">
      <md-dialog-title class="dialog-title">
        Confirm Logout
      </md-dialog-title>

      <md-dialog-content class="dialog-content">
        Are you sure you want to log out?
      </md-dialog-content>

      <md-dialog-actions class="dialog-actions">
        <md-button class="md-primary" @click="dialogActive = false">
          Cancel
        </md-button>
        <md-button class="md-accent" @click="confirmLogout">
          <i class="material-icons" style="vertical-align: middle; margin-right: 4px; font-size: 18px">
            exit_to_app
          </i>
          Logout
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <br />

    <div class="md-layout">
      <div class="md-layout-item">
        <div class="card">
          <div class="card-header">
            <h4 class="title">Notifications</h4>
            <p class="category">EVERY HARDSHIP COMES WITH HUGE REWARD</p>
          </div>

          <div class="card-content">
            <!-- Category Radios -->
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
                    <i class="material-icons" style="font-size: 16px">person</i>
                    Created By: {{ task.createdByName || "Unknown" }}
                  </small>
                </span>

                <div class="task-actions">
                  <md-button class="md-raised md-success" style="margin-right: 8px; border-radius: 20px"
                    @click="completeTask(task.worktaskId)">
                    Complete
                  </md-button>

                  <md-button class="md-raised delete-btn" style="margin-right: 8px; border-radius: 20px"
                    @click="deleteTaskHandler(task.worktaskId)">
                    Delete
                  </md-button>

                  <md-button class="md-raised" style="background-color: #9e9e9e; color: white; border-radius: 20px"
                    @click="viewFile(task)">
                    View/Download
                  </md-button>
                </div>
              </div>
            </div>

            <div v-else>
              <p class="text-center">No tasks available for {{ selectedCategory }}</p>
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

    <!-- Dialog Box -->
    <div v-if="dialog.visible" class="dialog-overlay">
      <div class="dialog-box">
        <i class="material-icons dialog-icon" :class="{
          success: dialog.type === 'success',
          error: dialog.type === 'error',
          warning: dialog.type === 'warning',
          info: dialog.type === 'info',
        }">
          {{ dialogIcon }}
        </i>
        <p class="dialog-message">{{ dialog.message }}</p>
        <div class="dialog-actions">
          <button v-if="dialog.mode === 'confirm'" class="btn btn-success" @click="handleDialogConfirm(true)">
            Yes
          </button>
          <button v-if="dialog.mode === 'confirm'" class="btn btn-danger" @click="handleDialogConfirm(false)">
            No
          </button>
          <button v-if="dialog.mode === 'alert'" class="btn btn-primary" @click="handleDialogConfirm(true)">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAssingToUser, updateTask, deleteTask, fetchTaskById } from "@/services/api";

export default {
  data() {
    return {
      selectedCategory: "Meeting",
      categories: ["Meeting", "Follow-up", "Personal", "Reminder"],
      tasks: [],
      previewFile: null,
      dialogActive: false,

      // Custom dialog box state
      dialog: {
        visible: false,
        message: "",
        type: "info",
        mode: "alert", // 'alert' or 'confirm'
        resolve: null,
      },
    };
  },

  computed: {
    filteredTasks() {
      return this.tasks.filter(
        (task) => task.taskType === this.selectedCategory && task.workStatus !== "Completed"
      );
    },
    dialogIcon() {
      switch (this.dialog.type) {
        case "success":
          return "check_circle";
        case "error":
          return "error";
        case "warning":
          return "warning";
        default:
          return "info";
      }
    },
  },

  methods: {
    // --- Logout ---
    confirmLogout() {
      this.dialogActive = false;
      localStorage.removeItem("user");
      this.$router.push("/login");
    },

    // --- Dialog Handling ---
    handleDialogConfirm(result) {
      if (this.dialog.resolve) this.dialog.resolve(result);
      this.dialog.visible = false;
    },

    async showDialog(message, type = "info", mode = "alert") {
      return new Promise((resolve) => {
        this.dialog.visible = true;
        this.dialog.message = message;
        this.dialog.type = type;
        this.dialog.mode = mode;
        this.dialog.resolve = resolve;
      });
    },

    // --- Fetch Tasks ---
    async fetchTasks() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          await this.showDialog("No user logged in.", "error");
          this.$router.push("/login");
          return;
        }
        this.tasks = await fetchAssingToUser(user.userId);
      } catch (err) {
        await this.showDialog("Error fetching tasks: " + err.message, "error");
      }
    },

    // --- Count Tasks by Category ---
    taskCount(category) {
      return this.tasks.filter((task) => task.taskType === category).length;
    },

    // --- Complete Task ---
    async completeTask(taskId) {
      try {
        const res = await updateTask(taskId, "Completed");
        if (res && res.success) {
          this.tasks = this.tasks.filter((task) => task.worktaskId !== taskId);
          await this.showDialog("Task marked as complete.", "success");
        } else {
          await this.showDialog("Task completed but not removed.", "warning");
        }
      } catch (err) {
        await this.showDialog("Error completing task: " + err.message, "error");
      }
    },

    // --- Delete Task ---
    async deleteTaskHandler(taskId) {
      const confirmed = await this.showDialog("Are you sure you want to delete this task?", "warning", "confirm");
      if (!confirmed) return;

      try {
        await deleteTask(taskId);
        this.tasks = this.tasks.filter((task) => task.worktaskId !== taskId);
        await this.showDialog("Task deleted successfully.", "success");
      } catch (err) {
        await this.showDialog("Error deleting task: " + err.message, "error");
      }
    },

    // --- View or Download File ---
    async viewFile(task) {
      try {
        const latestTask = await fetchTaskById(task.worktaskId);
        if (!latestTask) {
          await this.showDialog("Task not found.", "error");
          return;
        }

        const fileURL = latestTask.filePath
          ? `http://localhost/backend-systemPHP/${latestTask.filePath}`
          : latestTask.link;

        if (!fileURL) {
          await this.showDialog("No file found for this task.", "info");
          return;
        }

        const ext = fileURL.split(".").pop().toLowerCase();
        const imageTypes = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
        const docTypes = ["pdf", "doc", "docx", "xls", "xlsx", "txt"];

        if (imageTypes.includes(ext)) {
          this.previewFile = fileURL;
        } else if (docTypes.includes(ext) || latestTask.link) {
          window.open(fileURL, "_blank");
        } else {
          await this.showDialog("Unsupported file type.", "warning");
        }
      } catch (err) {
        await this.showDialog("Failed to view or download file.", "error");
      }
    },

    // --- Close Image Preview ---
    closePreview() {
      this.previewFile = null;
    },
  },

  mounted() {
    this.fetchTasks();
  },
};
</script>


<style scoped>
/* --- Dialog Box --- */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 30, 30, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.dialog-box {
  background: #fff;
  padding: 1.8rem 2rem;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 380px;
  max-width: 90%;
  animation: fadeIn 0.25s ease;
}

.dialog-icon {
  font-size: 50px;
  margin-bottom: 12px;
}

.dialog-icon.success {
  color: #4caf50;
}

.dialog-icon.error {
  color: #f44336;
}

.dialog-icon.warning {
  color: #ff9800;
}

.dialog-icon.info {
  color: #2196f3;
}

.dialog-message {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
  font-weight: 500;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- Modern Logout --- */
.top-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 18px 28px;
  background: #f9fafb;
  border-bottom: 1px solid #e0e0e0;
}

.btn-logout {
  background-color: #dc3545 !important;
  color: #fff !important;
  border-radius: 16px;
  text-transform: none;
  padding: 3px 8px;
  font-weight: 500;
  font-size: 16px;
}

.btn-logout:hover {
  background-color: #b02a37 !important;
}

/* 🟢 Dialog Styling */
.logout-dialog {
  border-radius: 20px !important;
  /* Rounded corners */
  overflow: hidden;
}

.dialog-title {
  text-align: center;
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 10px;
}

.dialog-content {
  text-align: center;
  font-size: 16px;
  padding: 10px 0;
  color: #444;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 12px 0 14px;
  background-color: #f7f7f7;
  /* Light background for contrast */
  border-top: 1px solid #e0e0e0;
  /* Subtle separator line */
  border-bottom-left-radius: 25px;
  /* Rounded bottom corners */
  border-bottom-right-radius: 25px;
}

.confirm-btn {
  background-color: #f44336 !important;
  color: #fff !important;
  border-radius: 50px !important;
  padding: 8px 20px !important;
  transition: all 0.2s ease;
}

.confirm-btn:hover {
  background-color: #d32f2f !important;
  box-shadow: 0 3px 8px rgba(244, 67, 54, 0.3);
}

/* Category Colors */
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

.alert span {
  font-size: 20px;
  font-weight: 700;
  display: block;
  margin-bottom: 6px;
}

.alert small {
  font-size: 15px;
  font-weight: 400;
  opacity: 0.85;
}

/* Radio buttons */
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

/* Buttons */
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