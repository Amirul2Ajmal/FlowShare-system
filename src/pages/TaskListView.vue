<script>
import { fetchTasksByUser, deleteTask, fetchTaskById } from "@/services/api";
import CreatedTaskTable from "@/components/Tables/CreatedTaskTable.vue";
import TaskDetailModal from "@/components/Modals/TaskDetailModal.vue";
import FilePreviewModal from "@/components/Modals/FilePreviewModal.vue";

export default {
  name: "TaskListView",
  components: {
    CreatedTaskTable,
    TaskDetailModal,
    FilePreviewModal,
  },
  data() {
    return {
      tasks: [],
      currentUser: {},
      previewFile: null,
      previewType: null,
      selectedTask: null,
      showTaskModal: false,
    };
  },
  async created() {
    const savedUser = localStorage.getItem("user");
    if (savedUser) this.currentUser = JSON.parse(savedUser);
    await this.loadTasks();
  },
  methods: {
    async loadTasks() {
      if (!this.currentUser.userId) return;
      try {
        const tasks = await fetchTasksByUser(this.currentUser.userId);
        this.tasks = tasks;
      } catch (err) {
        console.error("❌ Error fetching tasks:", err.message);
      }
    },
    async deleteTaskHandler(taskID) {
      try {
        await deleteTask(taskID);
        this.tasks = this.tasks.filter((t) => t.worktaskId !== taskID);
        alert("Task deleted successfully");
      } catch (err) {
        console.error("Failed to delete task:", err);
        alert("Failed to delete task");
      }
    },
    async viewTask(task) {
      try {
        const latestTask = await fetchTaskById(task.worktaskId);
        if (!latestTask) {
          alert("Task not found or has been deleted.");
          return;
        }
        this.selectedTask = latestTask;
        this.showTaskModal = true;
      } catch (err) {
        console.error("Failed to fetch task:", err);
        alert("Failed to fetch task details.");
      }
    },
    handleViewFile() {
      if (!this.selectedTask) return;

      let fileURL = this.selectedTask.filePath
        ? `http://localhost/backend-systemPHP/${this.selectedTask.filePath}`
        : this.selectedTask.link || null;

      if (!fileURL) {
        alert("No file uploaded for this task.");
        return;
      }

      const fileExtension = fileURL.split(".").pop().toLowerCase();
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
      const officeExtensions = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

      if (imageExtensions.includes(fileExtension)) {
        this.previewFile = encodeURI(fileURL);
        this.previewType = "image";
      } else if (fileExtension === "pdf" || fileExtension === "txt") {
        this.previewFile = encodeURI(fileURL);
        this.previewType = "pdf";
      } else if (officeExtensions.includes(fileExtension)) {
        this.previewFile = encodeURI(fileURL);
        this.previewType = "doc";
      } else {
        window.open(fileURL, "_blank");
      }
    },
    closeTaskModal() {
      this.showTaskModal = false;
      this.selectedTask = null;
    },
    closePreview() {
      this.previewFile = null;
      this.previewType = null;
    },
  },
};
</script>

<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card class="md-card-plain">
          <md-card-header data-background-color="green">
            <div>
              <h4 class="title">Task List</h4>
              <p class="category">All tasks in the system</p>
            </div>
          </md-card-header>
          <md-card-content>
            <created-task-table
              :tasks="tasks"
              @delete-task="deleteTaskHandler"
              @view-task="viewTask"
            />
          </md-card-content>
        </md-card>
      </div>
    </div>

    <!-- Task Detail Modal -->
    <task-detail-modal
      :show="showTaskModal"
      :task="selectedTask"
      @close="closeTaskModal"
      @view-file="handleViewFile"
    />

    <!-- Preview Modal -->
    <file-preview-modal
      :show="!!previewFile"
      :type="previewType"
      :file-url="previewFile"
      @close="closePreview"
    />
  </div>
</template>

<style scoped>
.header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
