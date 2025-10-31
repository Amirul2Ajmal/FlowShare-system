<script>
import { updateTask } from "@/services/api";

export default {
  name: "OrderedTable",
  props: {
    tasks: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showDialog: false,
      dialogMessage: "",
      dialogType: "info", // success | error | confirm
      pendingDeleteId: null,
    };
  },
  methods: {
    //  Delete with dialog
    onDelete(taskID) {
      if (!taskID) {
        console.warn("Task ID is undefined!", this.tasks);
        return;
      }
      this.dialogMessage = "Are you sure you want to delete this task?";
      this.dialogType = "confirm";
      this.pendingDeleteId = taskID;
      this.showDialog = true;
    },

    confirmDelete() {
      if (this.pendingDeleteId) {
        this.$emit("delete-task", this.pendingDeleteId);
        this.pendingDeleteId = null;
      }
      this.closeDialog();
    },

    onView(task) {
      this.$emit("view-task", task);
    },

    // Toggle status with dialog
    async toggleStatus(task) {
      const newStatus =
        task.workStatus === "Completed" ? "Pending" : "Completed";
      try {
        await updateTask(task.worktaskId, newStatus);
        task.workStatus = newStatus;
        this.$emit("status-updated", {
          id: task.worktaskId,
          status: newStatus,
        });

        this.dialogMessage = `Status updated successfully for Task ID: ${task.worktaskId}. New status: ${newStatus}`;
        this.dialogType = "success";
        this.showDialog = true;
      } catch (err) {
        console.error("❌ Failed to update status:", err.message);

        this.dialogMessage = `Error updating status for Task ID: ${task.worktaskId}. Reason: ${err.message}`;
        this.dialogType = "error";
        this.showDialog = true;
      }
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return isNaN(date) ? "-" : date.toLocaleString();
    },

    closeDialog() {
      this.showDialog = false;
      this.pendingDeleteId = null;
    },
  },
};
</script>

<template>
  <div class="table-wrapper">
    <md-table v-if="tasks.length" class="task-table md-elevation-2">
      <md-table-row>
        <md-table-head>Task Types</md-table-head>
        <md-table-head>Assigned To</md-table-head>
        <md-table-head>Description</md-table-head>
        <md-table-head>Status</md-table-head>
        <md-table-head>Created At</md-table-head>
        <md-table-head class="text-center">Actions</md-table-head>
      </md-table-row>

      <md-table-row
        v-for="task in tasks"
        :key="task.worktaskId"
        class="task-row"
      >
        <md-table-cell>{{ task.taskType }}</md-table-cell>
        <md-table-cell>{{ task.assignedToName || "-" }}</md-table-cell>
        <md-table-cell>{{ task.description || "-" }}</md-table-cell>
        <md-table-cell>
          <span :class="['status-badge', task.workStatus.toLowerCase()]">
            {{ task.workStatus }}
          </span>
        </md-table-cell>
        <md-table-cell>{{ formatDate(task.createAt) }}</md-table-cell>
        <md-table-cell class="text-center">
          <div class="action-buttons">
            <!-- Delete (Red) -->
            <md-button
              class="md-icon-button delete-btn"
              @click="onDelete(task.worktaskId)"
            >
              <md-icon>delete_outline</md-icon>
            </md-button>

            <!-- View (Blue) -->
            <md-button class="md-icon-button view-btn" @click="onView(task)">
              <md-icon>visibility</md-icon>
            </md-button>

            <!-- Mark/Toggle (Green) -->
            <md-button
              class="md-icon-button toggle-btn"
              @click="toggleStatus(task)"
              :title="
                task.workStatus === 'Completed'
                  ? 'Mark as Pending'
                  : 'Mark as Completed'
              "
            >
              <md-icon>
                {{ task.workStatus === "Completed" ? "undo" : "check_circle" }}
              </md-icon>
            </md-button>
          </div>
        </md-table-cell>
      </md-table-row>
    </md-table>

    <p v-else class="empty-msg">No tasks availablesss.</p>

    <!-- Dialog Box -->
    <transition name="fade">
      <div v-if="showDialog" class="dialog-overlay">
        <div class="dialog-box">
          <md-icon v-if="dialogType === 'success'" class="dialog-icon success">
            check_circle
          </md-icon>

          <md-icon v-else-if="dialogType === 'error'" class="dialog-icon error">
            error
          </md-icon>

          <md-icon
            v-else-if="dialogType === 'confirm'"
            class="dialog-icon confirm"
          >
            warning
          </md-icon>

          <p class="dialog-message">{{ dialogMessage }}</p>

          <div class="dialog-actions">
            <button
              v-if="dialogType === 'confirm'"
              @click="confirmDelete"
              class="dialog-btn danger"
            >
              Yes
            </button>
            <button @click="closeDialog" class="dialog-btn primary">
              {{ dialogType === "confirm" ? "No" : "OK" }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.task-table {
  width: 100%;
  font-size: 14px;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.table-wrapper {
  margin: 1rem auto;
  max-width: 98%;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.task-row:hover {
  background-color: #f5f5f5;
  transition: background 0.2s ease-in-out;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 0.3rem;
}

/* Status badge design */
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}

.status-badge.completed {
  background: #4caf50;
  color: white;
}

.status-badge.pending {
  background: #ff9800;
  color: white;
}

/* Empty state */
.empty-msg {
  text-align: center;
  font-style: italic;
  padding: 1rem;
  color: #666;
}

/* Dialog */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog-box {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.dialog-message {
  font-size: 16px;
  margin: 16px 0;
  color: #333;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.dialog-btn {
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.dialog-btn.danger {
  background: #e53935;
  color: white;
}

.dialog-btn.primary {
  background: #43a047;
  color: white;
}

.dialog-btn:hover {
  opacity: 0.9;
}

.dialog-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.dialog-icon.success {
  color: #4caf50;
}

.dialog-icon.error {
  color: #f44336;
}

.dialog-icon.confirm {
  color: #ff9800;
}

/* Smooth fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.md-button.md-icon-button {
  width: 36px;
  height: 36px;
  border-radius: 50% !important;
  padding: 0;
  min-width: 36px;
  background-color: transparent !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

/* Smooth hover feedback */
.md-button.md-icon-button:hover {
  background-color: rgba(0, 0, 0, 0.06) !important;
}

/* Optional: add icon sizing */
.md-button.md-icon-button md-icon {
  font-size: 20px;
}

/* Custom colors */
/* 💥 Stronger scoped selector to pierce Vue Material styles */
.delete-btn >>> .md-icon,
.view-btn >>> .md-icon,
.toggle-btn >>> .md-icon {
  color: inherit !important;
}

/* Now apply per-button color on the parent */
.delete-btn {
  color: #f44336 !important;
}

.view-btn {
  color: #2196f3 !important;
}

.toggle-btn {
  color: #4caf50 !important;
}
</style>
