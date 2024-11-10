<template>
    <div class="home-page">
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">MyApp</a>
        <div class="ml-auto">
          <button class="btn btn-danger" @click="handleLogout">Logout</button>
        </div>
      </nav>
  
      <!-- Main Content -->
      <h1>Prijavljen si</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomePage',
    methods: {
      // Handle Logout
      handleLogout() {
        // Remove the JWT token from localStorage
        localStorage.removeItem('jwtToken');
        
        // Redirect to the login page
        this.$router.push('/login');
      },
    },
  };
  </script>
  
  <style scoped>
  .home-page {
    text-align: center;
    margin-top: 50px;
  }
  
  /* Style the navbar */
  .navbar {
    margin-bottom: 20px;
  }
  
  /* Style the heading */
  h1 {
    font-size: 2em;
    color: #4CAF50;
  }
  
  /* Adjust the logout button */
  .btn-danger {
    margin-left: auto;
    margin-right: 20px;
  }
  </style>
  