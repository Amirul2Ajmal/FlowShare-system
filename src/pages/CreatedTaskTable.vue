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
          <!-- Status Badge -->
          <span :class="['status-badge', task.workStatus.toLowerCase()]">
            {{ task.workStatus }}
          </span>
        </md-table-cell>
        <md-table-cell>{{ formatDate(task.createAt) }}</md-table-cell> 
        <md-table-cell>
          <!-- Delete -->
          <md-button
            class="md-icon-button md-accent"
            @click="onDelete(task.worktaskId)"
            aria-label="Delete Task"
          >
            <md-icon>delete</md-icon>
          </md-button>

          <!-- View -->
          <md-button
            class="md-icon-button md-primary"
            @click="onView(task)"
            aria-label="View Task"
          >
            <md-icon>visibility</md-icon>
          </md-button>

          <!-- ✅ Toggle Status -->
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
  </div>
</template>

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
  methods: {
    onDelete(taskID) {
      if (!taskID) {
        console.warn("Task ID is undefined!", this.tasks);
        return;
      }
      if (confirm("Are you sure you want to delete this task?")) {
        this.$emit("delete-task", taskID);
      }
    },

    onView(task) {
      this.$emit("view-task", task);
    },

    async toggleStatus(task) {
      const newStatus =
        task.workStatus === "Completed" ? "Pending" : "Completed";
      try {
        await updateTask(task.worktaskId, newStatus);
        task.workStatus = newStatus; //  Update locally so UI refreshes
        this.$emit("status-updated", {
          id: task.worktaskId,
          status: newStatus,
        });

        console.log(
          `✅ Status updated successfully for Task ID: ${task.worktaskId}. New status: ${newStatus}`
        );
      } catch (err) {
        console.error("❌ Failed to update status:", err.message);

        console.log(
          `❌ Error updating status for Task ID: ${task.worktaskId}. Reason: ${err.message}`
        );

        alert("❌ Failed to update status. Please try again.");
      }
    },
    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return isNaN(date) ? "-" : date.toLocaleString();
    },
  },
};
</script>

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
