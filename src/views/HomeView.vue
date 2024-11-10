<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <h1>Onlybuns</h1>
    </div>
    <div class="navbar-buttons">
      <button @click="goToLogin" class="btn btn-primary">Login</button>
      <button @click="goToRegister" class="btn btn-secondary">Register</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  methods: {
    goToLogin() {
      this.$router.push({ name: "login" });
    },
    goToRegister() {
      this.$router.push({ name: "register" });
    },
  },
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #333;
  color: white;
  z-index: 1000;
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.5rem;
}

.navbar-buttons button {
  margin-left: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
/* Add padding to the main content to avoid overlap */
.main-content {
  padding-top: 70px; /* Adjust based on navbar height */
}
</style>
