<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <h1>Onlybuns</h1>
    </div>
    <div class="navbar-buttons">
      <button @click="goToLogin" class="btn btn-primary">Login</button>
    </div>
  </nav>
  <div class="posts">
    <Posts />
  </div>
</template>

<script>
import Posts from '@/components/Posts.vue';
export default {
  name: "Navbar",
  components: {
    Posts,  // Register Posts component here
  },
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
.posts {
  padding-top: 80px;
}

p {
  color: black;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgb(183, 121, 50);
  color: white;
  font-family: 'Arial', sans-serif;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: #f1f1f1;
  font-family: 'Verdana', sans-serif;
}

.navbar-buttons button {
  margin-left: 0.5rem;
  border-radius: 20px;
}

.btn {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-family: 'Verdana', sans-serif;
}

.btn-primary {
  background-color: #7d4300;
  color: white;
  font-family: 'Roboto', sans-serif;
}

.btn-primary:hover {
  background-color: #3c2000;
  transform: scale(1.05);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #565e64;
  transform: scale(1.05);
}

.main-content {
  padding-top: 70px; /* Adjust based on navbar height */
}
</style>
