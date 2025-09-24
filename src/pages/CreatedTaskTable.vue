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
    // ✅ Delete with dialog
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

    // ✅ Toggle status with dialog
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
  <div>
    <md-table v-if="tasks.length" class="task-table">
      <md-table-row>
        <md-table-head>Task Type</md-table-head>
        <md-table-head>Assigned To</md-table-head>
        <md-table-head>Description</md-table-head>
        <md-table-head>Status</md-table-head>
        <md-table-head>Created At</md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>

      <md-table-row v-for="task in tasks" :key="task.worktaskId">
        <md-table-cell>{{ task.taskType }}</md-table-cell>
        <md-table-cell>{{ task.assignedToName || "-" }}</md-table-cell>
        <md-table-cell>{{ task.description || "-" }}</md-table-cell>
        <md-table-cell>
          <span :class="['status-badge', task.workStatus.toLowerCase()]">
            {{ task.workStatus }}
          </span>
        </md-table-cell>
        <md-table-cell>{{ formatDate(task.createAt) }}</md-table-cell>
        <md-table-cell>
          <md-button
            class="md-icon-button md-accent"
            @click="onDelete(task.worktaskId)"
            aria-label="Delete Task"
          >
            <md-icon>delete</md-icon>
          </md-button>

          <md-button
            class="md-icon-button md-primary"
            @click="onView(task)"
            aria-label="View Task"
          >
            <md-icon>visibility</md-icon>
          </md-button>

          <md-button
            class="md-icon-button"
            :class="
              task.workStatus === 'Completed' ? 'md-accent' : 'md-primary'
            "
            @click="toggleStatus(task)"
            aria-label="Toggle Status"
          >
            <md-icon>
              {{ task.workStatus === "Completed" ? "undo" : "check_circle" }}
            </md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>

    <p v-else class="empty-msg">No tasks available.</p>

    <!-- Dialog Box -->
    <div
      v-if="showDialog"
      :style="{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }"
    >
      <div
        :style="{
          background: '#fff',
          padding: '20px 30px',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
        }"
      >
        <!-- Icon -->
        <md-icon
          v-if="dialogType === 'success'"
          style="font-size: 40px; color: green; margin-bottom: 10px"
        >
          check_circle
        </md-icon>

        <md-icon
          v-else-if="dialogType === 'error'"
          style="font-size: 40px; color: red; margin-bottom: 10px"
        >
          error
        </md-icon>

        <md-icon
          v-else-if="dialogType === 'confirm'"
          style="font-size: 40px; color: orange; margin-bottom: 10px"
        >
          warning
        </md-icon>

        <!-- Message -->
        <p :style="{ marginBottom: '15px', fontSize: '16px', color: '#333' }">
          {{ dialogMessage }}
        </p>

        <!-- Buttons -->
        <div>
          <button
            v-if="dialogType === 'confirm'"
            @click="confirmDelete"
            :style="{
              background: '#d9534f',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              marginRight: '10px',
            }"
          >
            Yes
          </button>

          <button
            @click="closeDialog"
            :style="{
              background: '#0275d8',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
            }"
          >
            {{ dialogType === "confirm" ? "No" : "OK" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-table {
  width: 100%;
}

.empty-msg {
  text-align: center;
  font-style: italic;
  padding: 1rem;
}

/* ✅ Status Badge Styling */
.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.completed {
  background: #4caf50;
  color: white;
}

.status-badge.pending {
  background: #ff9800;
  color: white;
}
</style>
