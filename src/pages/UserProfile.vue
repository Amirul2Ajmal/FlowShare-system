<template>
  <div class="content">
    <!-- Top Bar Logout -->
    <div class="top-bar">
      <md-button class="md-raised md-accent" @click="logout">
        Logout
      </md-button>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <!-- Pass user data to EditProfileForm -->
        <edit-profile-form
          v-if="user"
          :user="user"
          data-background-color="green"
        />
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
        <!-- Pass user data to UserCard -->
        <user-card v-if="user" :user="user" />
      </div>
    </div>
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
    };
  },
  created() {
    // ✅ Load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      // If no user found, redirect to login
      this.$router.push("/login");
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
      alert("You have been logged out.");
    },
  },
};
</script>
