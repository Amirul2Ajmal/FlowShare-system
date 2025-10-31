<template>
  <div class="content">
    <!-- Material Icons CDN -->
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />

    <!-- Top Bar Logout -->
    <div class="top-bar">
      <md-button class="md-raised md-accent btn-logout" @click="openDialog">
        <i
          class="material-icons"
          style="vertical-align: middle; margin-right: 7px"
          >logout</i
        >
        Logout
      </md-button>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <edit-profile-form
          v-if="user"
          :user="user"
          data-background-color="green"
        />
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
        <user-card v-if="user" :user="user" />
      </div>
    </div>

    <!-- ✅ Rounded & Centered Logout Confirmation Dialog -->
    <md-dialog :md-active.sync="dialogActive" class="logout-dialog">
      <md-dialog-title class="dialog-title">Confirm Logout</md-dialog-title>
      <md-dialog-content class="dialog-content">
        Are you sure you want to log out?
      </md-dialog-content>
      <md-dialog-actions class="dialog-actions">
        <md-button class="md-primary" @click="dialogActive = false"
          >Cancel</md-button
        >
        <md-button class="md-accent" @click="confirmLogout"
          ><i
            class="material-icons"
            style="vertical-align: middle; margin-right: 4px; font-size: 18px"
          >
            exit_to_app </i
          >Logout</md-button
        >
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { EditProfileForm, UserCard } from "@/pages";

export default {
  components: {
    EditProfileForm,
    UserCard,
  },
  data() {
    return {
      user: null,
      dialogActive: false,
    };
  },
  created() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
    openDialog() {
      this.dialogActive = true;
    },
    confirmLogout() {
      localStorage.removeItem("user");
      this.dialogActive = false;
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* 🔴 Logout Button */
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
</style>
