<template>
  <header class="top-navbar">
    <div class="logo">🚀 My App</div>
    <nav class="nav-links">
      <a href="#">Home</a>
      <a href="#">Tasks</a>
      <a href="#">Profile</a>
    </nav>
  </header>
</template>

<script>
export default {
  name: "TopNavbar",
};
</script>

<style scoped>
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2c3e50;
  padding: 10px 20px;
  color: #fff;
}

.nav-links a {
  margin-left: 15px;
  text-decoration: none;
  color: #fff;
}

.nav-links a:hover {
  text-decoration: underline;
}
</style>
