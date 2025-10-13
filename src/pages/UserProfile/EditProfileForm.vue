<script>
import axios from "axios";

export default {
  name: "edit-profile-form",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "",
    },
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      disabled: "My Company", // static example
      form: {
        userName: "",
        emailAdd: "",
        fullName: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
        aboutMe: "",
      },
    };
  },
  mounted() {
    // ✅ Pre-fill form with user prop data
    if (this.user) {
      this.form.userName = this.user.userName || "";
      this.form.emailAdd = this.user.emailAdd || "";
      this.form.fullName = this.user.fullName || "";
    }
  },
  /*
  methods: {
    async updateProfile() {
      try {
        const res = await axios.put(
          `http://localhost/backend-systemPHP/public/index.php/api/v1/user/update/${this.user.userId}`,
          this.form,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        alert("✅ Profile updated successfully!");
        console.log("Updated User:", res.data);

        // update localStorage with new info
        localStorage.setItem("user", JSON.stringify(res.data.data));
      } catch (err) {
        alert(
          "❌ Failed to update profile: " +
            (err.response?.data?.message || err.message)
        );
      }
    },
  },*/
};
</script>

<template>
  <form @submit.prevent="updateProfile">
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Edit Profile</h4>
        <p class="category">Complete your profile</p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Company (disabled)</label>
              <md-input v-model="disabled" disabled />
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>User Name</label>
              <md-input v-model="form.userName" type="text" />
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Email Address</label>
              <md-input v-model="form.emailAdd" type="email" />
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Full Name</label>
              <md-input v-model="form.fullName" type="text" />
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Address</label>
              <md-input v-model="form.address" type="text" />
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>City</label>
              <md-input v-model="form.city" type="text" />
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Country</label>
              <md-input v-model="form.country" type="text" />
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Postal Code</label>
              <md-input v-model="form.postalCode" type="number" />
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field>
              <label>About Me</label>
              <md-textarea v-model="form.aboutMe" />
            </md-field>
          </div>
          <!--
          <div class="md-layout-item md-size-100 text-right">
            <md-button type="submit" class="md-raised md-success">
              Update Profile
            </md-button>
          </div>-->
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>

<style scoped>
.title {
  font-size: 22px;
  font-weight: 700;
}

.category {
  font-size: 16px;
  color: #666;
}

label {
  font-size: 16px !important;
  font-weight: 500;
  color: #333;
}

.md-input,
.md-textarea {
  font-size: 16px !important;
  color: #111;
}
</style>
