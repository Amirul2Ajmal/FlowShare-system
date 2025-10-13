<template>
  <div class="content">
  
    <!-- Dashboard Content -->
    <div class="md-layout md-gutter center-cards">
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

      <!-- Stats Cards -->
      <div class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100">
        <stats-card data-background-color="orange">
          <template #header>
            <md-icon>content_copy</md-icon>
          </template>
          <template #content>
            <p class="category">Project dokument</p>
            <h3 class="title">49/50 <small>GB</small></h3>
          </template>
          <template #footer>
            <div class="stats">
              <md-icon class="text-danger">warning</md-icon>
              <a href="#pablo">Get More Space...</a>
            </div>
          </template>
        </stats-card>
      </div>

      <div class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100">
        <stats-card data-background-color="red">
          <template #header>
            <md-icon>info_outline</md-icon>
          </template>
          <template #content>
            <p class="category">Project Complete</p>
            <h3 class="title">75</h3>
          </template>
          <template #footer>
            <div class="stats">
              <md-icon>local_offer</md-icon>
              Tracked from Github
            </div>
          </template>
        </stats-card>
      </div>

      <div class="md-layout-item md-size-33 md-medium-size-100 md-xsmall-size-100">
        <stats-card data-background-color="blue">
          <template #header>
            <i class="fab fa-twitter"></i>
          </template>
          <template #content>
            <p class="category">Project live</p>
            <h3 class="title">+245</h3>
          </template>
          <template #footer>
            <div class="stats">
              <md-icon>update</md-icon>
              Just Updated
            </div>
          </template>
        </stats-card>
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

<script>
import { StatsCard, ChartCard, OrderedTable } from "@/components";

export default {
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