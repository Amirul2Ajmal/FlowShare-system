<script>
import { login } from "@/services/auth";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      loading: false,
      dialogMessage: "",
      showDialog: false, // ✅ added missing reactive property
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      try {
        const res = await login(this.username, this.password);

        if (res.status === 200) {
          this.dialogMessage = "✅ Login successful!";
          this.showDialog = true;

          //setTimeout(() => {
          this.$router.push("/dashboard");
          //}, 1800);
        } else {
          this.dialogMessage = "❌ " + (res.message || "Invalid credentials");
          this.showDialog = true;
        }
      } catch (err) {
        this.dialogMessage = "❌ Login failed: " + err.message;
        this.showDialog = true;
      } finally {
        this.loading = false;
      }
    },
    closeDialog() {
      this.showDialog = false;
    },
    togglePassword() {
      // ✅ moved inside methods
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <img
          :src="require('@/assets/mycss/img/FlowShare.jpg')"
          alt="Logo"
          class="logo"
        />
        <h2>Welcome</h2>
        <p class="p">Please sign in to continue</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="p">Username :</label>
          <input class="p" v-model="username" type="text" required />
        </div>

        <div class="form-group">
          <label class="p">Password :</label>
          <div class="password-wrapper">
            <input
              class="p password-input"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
            />
            <span class="toggle-icon" @click="togglePassword">
              <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
            </span>
          </div>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </div>
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
          maxWidth: '350px',
          width: '100%',
        }"
      >
        <p :style="{ marginBottom: '15px', fontSize: '16px', color: '#333' }">
          {{ dialogMessage }}
        </p>
        <button
          @click="closeDialog"
          :style="{
            background: '#4CAF50',
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

<style scoped>
.login-header {
  background: #123f67;
  /* Apply your color */
  padding: 20px;
  border-radius: 12px 12px 0 0;
  /* Rounded only at the top */
  color: white;
  /* Make text readable */
}

.login-header h2,
.login-header p {
  margin: 10px 0;
  color: white;
  /* Ensure text is visible */
}

.login-header .logo {
  width: 400px;
  margin-bottom: 10px;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  width: 100%;
  padding-right: 35px;
}

.toggle-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: gray;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #42b983, #2c3e50);
}

.login-card {
  background: #123f67;
  /* Changed background color */
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 450px;
  text-align: center;
  color: white;
  /* optional: makes text readable */
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

input {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 5px;
}

button {
  width: 100%;
  padding: 15px;
  background: #42b983;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background: #a5d6c5;
  cursor: not-allowed;
}

button:hover:enabled {
  background: #36966e;
}

.p {
  font-size: 20px;
}
</style>
