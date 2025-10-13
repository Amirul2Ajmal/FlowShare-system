<script>
import { fetchUsers, createTask } from "@/services/api";

export default {
  props: {
    taskTypes: {
      type: Array,
      default: () => ["Bug", "Feature", "Improvement"],
    },
    currentUser: { type: Object, required: true },
  },
  data() {
    return {
      users: [],
      form: {
        assignTo: "",
        taskType: "",
        link: "",
        description: "",
        file: null,
      },
      filePreview: null,

      // dialog states
      dialogVisible: false,
      dialogMessage: "",
      dialogType: "success", // "success" | "error"
    };
  },
  async mounted() {
    try {
      this.users = await fetchUsers();
      if (this.currentUser?.userId) {
        this.form.assignTo = String(this.currentUser.userId);
      }
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      this.form.file = file;
      this.filePreview = { name: file.name };
    },
    validate() {
      if (!this.form.assignTo) {
        this.showDialog("⚠️ Please select a user.", "error");
        return false;
      }
      if (!this.form.taskType) {
        this.showDialog("⚠️ Please select a task type.", "error");
        return false;
      }
      if (!this.form.description.trim()) {
        this.showDialog("⚠️ Task description cannot be empty.", "error");
        return false;
      }
      return true;
    },
    async submit() {
      if (!this.validate()) return;

      try {
        const res = await createTask({
          createBy: this.currentUser.userId,
          ...this.form,
        });

        this.showDialog(
          res.message || "✅ Task created successfully!",
          "success"
        );
        this.reset();
      } catch (err) {
        const msg = err.response?.data?.message || "❌ Failed to create task.";
        this.showDialog(msg, "error");
      }
    },
    reset() {
      this.form = {
        assignTo: this.currentUser?.userId
          ? String(this.currentUser.userId)
          : "",
        taskType: "",
        link: "",
        description: "",
        file: null,
      };
      this.filePreview = null;
      if (this.$refs.file) this.$refs.file.value = null;
    },
    showDialog(message, type = "success") {
      this.dialogMessage = message;
      this.dialogType = type;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>

<template>
  <div class="task-form-card">
    <md-card>
      <md-card-header>
        <div class="md-title">➕ Add New Task</div>
        <div class="md-subhead">Assign a task (to yourself or a colleague)</div>
      </md-card-header>

      <md-card-content>
        <div class="form-grid">
          <!-- Assign To -->
          <md-field v-if="users.length">
            <label>Assign To</label>
            <md-select v-model="form.assignTo" placeholder="Select user">
              <md-option disabled value="">-- Select user --</md-option>
              <md-option
                v-for="u in users"
                :key="u.userId"
                :value="String(u.userId)"
              >
                {{ u.userName }}
              </md-option>
            </md-select>
          </md-field>

          <!-- Task Type -->
          <md-field>
            <label>Task Type</label>
            <md-select v-model="form.taskType">
              <md-option disabled value="">-- Select type --</md-option>
              <md-option v-for="t in taskTypes" :key="t" :value="t">
                {{ t }}
              </md-option>
            </md-select>
          </md-field>

          <!-- File or Link -->
          <div class="upload-section">
            <label class="section-label">Attach File / Link</label>
            <input
              type="file"
              ref="file"
              class="file-input"
              @change="onFileChange"
            />
            <md-field>
              <label>Or paste link</label>
              <md-input v-model="form.link" placeholder="https://..." />
            </md-field>
            <div v-if="filePreview" class="file-preview">
              📎 Selected: {{ filePreview.name }}
            </div>
          </div>

          <!-- Description -->
          <md-field class="description-field">
            <label>Description</label>
            <md-textarea
              v-model="form.description"
              placeholder="Task details..."
            />
          </md-field>
        </div>
      </md-card-content>

      <md-card-actions>
        <md-button class="md-primary md-raised" @click="submit"
          >Add Task</md-button
        >
        <md-button class="md-accent" @click="reset">Reset</md-button>
      </md-card-actions>
    </md-card>

    <!-- ✅ Dialog -->
    <div
      v-if="dialogVisible"
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
          maxWidth: '350px',
          width: '100%',
        }"
      >
        <!-- ✅ Color based on dialogType -->
        <p
          :style="{
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: '500',
            color: dialogType === 'success' ? '#2E7D32' : '#C62828',
          }"
        >
          {{ dialogMessage }}
        </p>

        <button
          @click="closeDialog"
          :style="{
            background: dialogType === 'success' ? '#4CAF50' : '#F44336',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
          }"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>
