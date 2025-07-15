<template>
  <div class="admin-panel">
    <h1>Admin Dashboard</h1>
    <nav>
      <ul>
        <li><router-link to="/admin/posts">All posts</router-link></li>
        <li><router-link to="/admin/trends">Trends on network</router-link></li>
        <li><router-link to="/admin/analytics">Application analytics</router-link></li>
        <li><router-link to="/admin/users">All users</router-link></li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
};
</script>

<style scoped>
.admin-panel {
  padding: 20px;
}
.admin-panel nav ul {
  list-style: none;
  padding: 0;
}
.admin-panel nav li {
  margin: 10px 0;
}
</style>
