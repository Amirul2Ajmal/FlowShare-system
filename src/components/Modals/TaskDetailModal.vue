<script>
export default {
  name: "TaskDetailModal",
  props: {
    show: { type: Boolean, required: true },
    task: {
      type: Object,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<template>
  <div v-if="show" class="modal" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">✖</button>
      <h3>Task Details</h3>
      <p><strong>Type:</strong> {{ task.taskType }}</p>
      <p><strong>Assigned To:</strong> {{ task.assignedToName || "-" }}</p>
      <p><strong>Description:</strong> {{ task.description || "-" }}</p>
      <p><strong>Status:</strong> {{ task.workStatus }}</p>
      <p>
        <strong>Created At:</strong>
        {{ new Date(task.createAt).toLocaleString() }}
      </p>
      <div class="actions">
        <button
          v-if="task.filePath || task.link"
          class="view-btn"
          @click="$emit('view-file')"
        >
          📂 View File
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  position: relative;
  background: #fff;
  padding: 1.5rem;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease-in-out;
}

.close-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  color: #ff4d4f;
  border: 2px solid #ff4d4f;
  border-radius: 50%;
  padding: 0.35rem 0.55rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
}

.close-btn:hover {
  background-color: #ff4d4f;
  color: #fff;
  transform: scale(1.1) rotate(90deg);
}

.actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.view-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #42a5f5, #478ed1);
  color: white;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 12px rgba(66, 165, 245, 0.4);
}

.view-btn:hover {
  background: linear-gradient(135deg, #1e88e5, #1565c0);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 16px rgba(30, 136, 229, 0.45);
}

.view-btn::before {
  content: "📁";
  font-size: 1.1rem;
  transition: transform 0.3s ease-in-out;
}

.view-btn:hover::before {
  transform: rotate(15deg) scale(1.1);
}
</style>
