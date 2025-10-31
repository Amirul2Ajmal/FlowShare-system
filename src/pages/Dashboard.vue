<template>
  <div class="content">
    <!-- Dashboard Content -->
    <div class="md-layout md-gutter md-alignment-center-center">
      <!-- Stats Cards -->
      <div class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100">
        <stats-card data-background-color="orange">
          <template #header>
            <md-icon>assignment</md-icon>
          </template>
          <template #content>
            <p class="category">Total Created Tasks</p>
            <h3 class="title">{{ totalTasks }}</h3>
          </template>
          <template #footer>
            <div class="stats">
              <md-icon>update</md-icon>
              Just Updated
            </div>
          </template>
        </stats-card>
      </div>
      <div class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100">
        <stats-card data-background-color="blue">
          <template #header>
            <md-icon>notifications</md-icon>
          </template>
          <template #content>
            <p class="category">Notifications</p>
            <h3 class="title">{{ totalNotifications }}</h3>
          </template>
          <template #footer>
            <div class="stats">
              <md-icon>update</md-icon>
              Just Updated
            </div>
          </template>
        </stats-card>
      </div>
      <!-- Chart Cards -->
      <div class="md-layout-item md-size-50 md-medium-size-100 md-xsmall-size-100">
        <chart-card :chart-data="dailySalesChart.data" :chart-options="dailySalesChart.options" :chart-type="'Line'"
          data-background-color="blue">
          <template #content>
            <h4 class="title">Upcoming Project</h4>
            <p class="category">
              <span class="text-success">
                <i class="fas fa-long-arrow-alt-up"></i> 55%
              </span>
              increase in today sales.
            </p>
          </template>
          <template #footer>
            <div class="stats">
              <md-icon>access_time</md-icon>
              updated 4 minutes ago
            </div>
          </template>
        </chart-card>
      </div>

      <div class="md-layout-item md-size-50 md-medium-size-100 md-xsmall-size-100">
        <chart-card :chart-data="dataCompletedTasksChart.data" :chart-options="dataCompletedTasksChart.options"
          :chart-type="'Line'" data-background-color="green">
          <template #content>
            <h4 class="title">Completed Tasks</h4>
            <p class="category">Last Campaign Performance</p>
          </template>
          <template #footer>
            <div class="stats">
              <md-icon>access_time</md-icon>
              campaign sent 26 minutes ago
            </div>
          </template>
        </chart-card>
      </div>



      <!-- Ordered Table -->
      <div class="md-layout-item md-size-100">
        <md-card>
          <md-card-header data-background-color="orange">
            <h4 class="title">Current Onsite Staff</h4>
            <p class="category">This will be next UPDATE to the system.</p>
          </md-card-header>
          <md-card-content>
            <ordered-table table-header-color="orange"></ordered-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.md-layout.md-alignment-center-center {
  padding: 20px;
}

.md-layout-item {
  margin-bottom: 20px;
}
</style>

<script>
import { StatsCard, ChartCard, OrderedTable } from "@/components";

import { fetchTasksByUser } from "@/services/api";

export default {
  data() {
    return {
      totalTasks: 0,
      totalNotifications: 0,
      currentUser: null,
    };
  },
  async created() {
    // Get current user from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
    await this.loadDashboardData();
  },
  methods: {
    async loadDashboardData() {
      // Load total tasks using the same API as CreatedTaskTable
      if (this.currentUser?.userId) {
        try {
          const tasks = await fetchTasksByUser(this.currentUser.userId);
          this.totalTasks = tasks.length || 0;
        } catch (err) {
          console.error("Error fetching tasks:", err);
          this.totalTasks = 0;
        }
      }

      // Load total notifications
      try {
        const response = await fetch('http://192.168.0.28/backend-systemPHP/public/index.php/api/v1/notifications');
        const data = await response.json();
        this.totalNotifications = data.data.length || 0;
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    }
  },
  components: {
    StatsCard,
    ChartCard,
    OrderedTable,
  },
  data() {
    return {
      showLogoutDialog: false,
      dailySalesChart: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]],
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({ tension: 0 }),
          low: 0,
          high: 50,
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      dataCompletedTasksChart: {
        data: {
          labels: ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]],
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({ tension: 0 }),
          low: 0,
          high: 1000,
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
    };
  },
  methods: {
    confirmLogout() {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      this.showLogoutDialog = false;
      this.$router.push("/login");
    },
  },
};
</script>
