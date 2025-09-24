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
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      try {
        const res = await login(this.username, this.password);

        if (res.status === 200) {
          alert("✅ Login successful!");
          this.$router.push("/dashboard");
          console.log("succesfully login");
        } else {
          alert("❌ " + (res.message || "Invalid credentials"));
        }
      } catch (err) {
        alert("❌ Login failed: " + err.message);
      } finally {
        this.loading = false;
      }
    },

    togglePassword() {
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
  </div>
</template>

<style scoped>
.login-header {
  background: #123f67; /* Apply your color */
  padding: 20px;
  border-radius: 12px 12px 0 0; /* Rounded only at the top */
  color: white; /* Make text readable */
}

.login-header h2,
.login-header p {
  margin: 10px 0;
  color: white; /* Ensure text is visible */
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
  background: #123f67; /* Changed background color */
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 450px;
  text-align: center;
  color: white; /* optional: makes text readable */
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

<!-- Optional external header CSS -->
<style src="@/assets/mycss/login-header.css"></style>
