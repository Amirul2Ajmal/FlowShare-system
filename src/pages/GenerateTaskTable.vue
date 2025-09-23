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
              <!-- ✅ placeholder -->
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
        <md-button class="md-accent" @click="reset">Clear</md-button>
      </md-card-actions>

      <p v-if="error" class="error-msg">{{ error }}</p>
      <p v-if="success" class="success-msg">{{ success }}</p>
    </md-card>
  </div>
</template>

<script>
import { fetchUsers, createTask } from "@/services/api";

export default {
  props: {
    taskTypes: { type: Array, default: () => [] },
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
      error: "",
      success: "",
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
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      this.form.file = f;
      this.filePreview = { name: f.name };
    },
    validate() {
      if (!this.form.assignTo) {
        this.error = "⚠️ Please select a user.";
        return false;
      }
      if (!this.form.taskType) {
        this.error = "⚠️ Please select a task type.";
        return false;
      }
      this.error = "";
      return true;
    },
    async submit() {
      if (!this.validate()) return;

      try {
        // 🔎 Debug what we are sending
        console.log("📤 Submitting form payload:", {
          createBy: this.currentUser.userId,
          ...this.form,
        });

        const res = await createTask({
          createBy: this.currentUser.userId,
          ...this.form,
        });

        // 🔎 Debug the response
        console.log("📥 Backend response:", res);

        this.success = res.message || "✅ Task created successfully!";
        this.error = "";
        this.reset(false);
      } catch (err) {
        // 🔎 Debug the error
        console.error("❌ Error creating task:", err);
        if (err.response) {
          console.error("❌ Error response data:", err.response.data);
          console.error("❌ Error response status:", err.response.status);
        }

        this.error = err.response?.data?.message || "❌ Failed to create task.";
        this.success = "";
      }
    },

    reset(clearMsg = true) {
      this.form = {
        assignTo: this.currentUser.userId || "",
        taskType: "",
        link: "",
        description: "",
        file: null,
      };
      this.filePreview = null;
      if (this.$refs.file) this.$refs.file.value = null;
      if (clearMsg) {
        this.error = "";
        this.success = "";
      }
    },
  },
};
</script>
