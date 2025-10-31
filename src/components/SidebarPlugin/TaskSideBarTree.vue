<script>
export default {
  name: "TaskSidebarTree",
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    isActive() {
      return this.$route.path.startsWith("/task");
    },
  },
  watch: {
    $route() {
      // Auto open if navigating within /task
      if (this.isActive) this.isOpen = true;
    },
  },
  mounted() {
    if (this.isActive) this.isOpen = true;
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<template>
  <li class="nav-item" :class="{ active: isActive }">
    <a href="javascript:void(0);" class="nav-link" @click="toggleOpen">
      <md-icon>assignment</md-icon>
      <p>
        Task
        <b class="caret" />
      </p>
    </a>
    <ul v-show="isOpen" class="nav-tree">
      <li class="nav-item">
        <sidebar-link to="/table">
          <md-icon>add_task</md-icon>
          <p>Generate Task</p>
        </sidebar-link>
      </li>
      <li class="nav-item">
        <sidebar-link to="/Tasklist">
          <md-icon>list_alt</md-icon>
          <p>Task List</p>
        </sidebar-link>
      </li>
    </ul>
  </li>
</template>

<style scoped>
.nav-tree {
  list-style: none;
  padding-left: 1.8rem;
  transition: all 0.3s ease;
}

.nav-tree .nav-item {
  margin-top: 6px;
}

.nav-tree .nav-item p {
  font-size: 13px;
}

.nav-tree .md-icon {
  font-size: 18px;
  margin-right: 6px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #fff;
  text-decoration: none;
}

.nav-link md-icon {
  font-size: 20px;
  margin-right: 18px;
}

.nav-link p {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 14px;
}

.nav-link .caret {
  font-size: 12px;
  margin-left: auto;
}
</style>
