<template>
    <div class="user-profile">
      <h1>User Profile: {{ username }}</h1>
      <!-- Additional content for the user's profile can go here -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserProfile',
    props: ['username'],
    created() {
      // Fetch and display user data based on the username if needed
    }
  };
  </script>
  
  <style scoped>
  .user-profile {
    text-align: center;
    margin-top: 2rem;
    color: black;
  }
  </style>
  