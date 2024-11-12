<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <h1>Onlybuns</h1>
    </div>
    <div class="navbar-buttons">
      <button @click="handleCreatePostClick" class="btn btn-create">Create Post</button>
      <FontAwesomeIcon icon="comments" class="icon large" title="Chat" />
      <FontAwesomeIcon icon="user" class="icon large" title="User Profile" />
      <button class="btn btn-logout" @click="handleLogout">Log Out</button>
    </div>
  </nav>

  <div class="sidebar">
    <div :class="['sidebar-item', { active: selectedSection === 'following' }]" @click="setSection('following')">
      Following
    </div>
    <div :class="['sidebar-item', { active: selectedSection === 'trending' }]" @click="setSection('trending')">
      Trending
    </div>
    <div :class="['sidebar-item', { active: selectedSection === 'nearMe' }]" @click="setSection('nearMe')">
      Near Me
    </div>
  </div>

  <div class="main-content">
    <div v-if="selectedSection === 'createPost'" class="create-post-wrapper">
      <CreatePost />
    </div>
  </div>
</template>



<script setup>
import HomeUserVue from "@/components/HomeUser.vue";
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faComments, faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import CreatePost from "@/components/CreatePost.vue";

import { useRouter } from 'vue-router';

// Use Vue Router to get navigation functions
const router = useRouter();

// Handle Logout Function
function handleLogout() {
  // Remove the JWT token from localStorage
  localStorage.removeItem('jwtToken');
  
  // Redirect to the login page
  router.push('/');
}

const selectedSection = ref("following");

const handleCreatePostClick = () => {
    selectedSection.value = "createPost";
};

const setSection = (section) => {
    selectedSection.value = section;
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

.navbar-buttons {
  display: flex;
  align-items: center;
}

.navbar-buttons .icon.large {
  font-size: 1.5rem;
  margin-left: 1rem;
  cursor: pointer;
  color: white;
}

.btn.btn-create {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn.btn-create:hover {
  background-color: #0056b3;
}

.btn.btn-logout {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  margin-left: 1rem;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn.btn-logout:hover {
  background-color: #c82333;
}

.sidebar {
  position: fixed;
  top: 70px; /* Adjust to navbar height */
  left: 0;
  bottom: 0; /* Prošireno do dna */
  width: 200px;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: #222;
  color: white;
  overflow-y: auto;
}

.sidebar-item {
  padding: 1rem;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.3s;
}

.sidebar-item:hover {
  background-color: #333;
}

.sidebar-item.active {
  background-color: #444;
}

.main-content {
  margin-left: 220px; /* Adjust to sidebar width */
  padding-top: 70px; /* Adjust based on navbar height */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-post-wrapper {
  width: 100%;
  max-width: 800px; /* Max širina */
  margin: 0 auto; /* Centriraj horizontalno */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
