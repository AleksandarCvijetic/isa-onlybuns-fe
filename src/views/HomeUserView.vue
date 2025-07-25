<template>
  <div class="full-page-container">
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>Onlybuns</h1>
      </div>

      <div class="navbar-buttons">
        <button @click="goToAllPostsMap" class="btn btn-map">
          <img src="@/assets/map_701351.png" alt="Map Icon" style="width: 20px; height: 20px;" />
          Map
        </button>
        <button @click="handleCreatePostClick" class="btn btn-create">
          Create Post
        </button>
        <FontAwesomeIcon icon="comments" class="icon large" title="Chat" />
        <FontAwesomeIcon @click="goToUserProfile" icon="user" class="icon large" title="User Profile" />
        
        <button class="btn btn-logout" @click="handleLogout">Log Out</button>
      </div>
    </nav>

    <div class="sidebar">
      <div
        :class="['sidebar-item', { active: selectedSection === 'following' }]"
        @click="setSection('following')"
      >
        Following
      </div>
      <div
        :class="['sidebar-item', { active: selectedSection === 'trending' }]"
        @click="setSection('trending')"
      >
        Trending
      </div>

    </div>

    <div class="main-content-wrapper">
      <div class="main-content">
        <div
          v-if="selectedSection === 'createPost'"
          class="create-post-wrapper"
        >
          <CreatePost @postCreated="handlePostCreated" />
        </div>
        <div
          v-else-if="selectedSection === 'trending'"
          class="create-post-wrapper"
        >
          <TrendingStats />
        </div>

        <div
          v-else-if="selectedSection === 'following'"
          class="create-post-wrapper"
        >
          <FollowedUsersPosts @showComments="handleShowComments" />
        </div>
        <div
          v-else-if="selectedSection === 'showComments'"
          class="create-post-wrapper"
        >
          <Comments :postId="postId" />
        </div>
        <div
          v-else-if="selectedSection === 'nearMe'"
          class="create-post-wrapper"
        >
        <AllPostsMap v-if="selectedSection === 'nearMe'" :key="selectedSection" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HomeUserVue from "@/components/HomeUser.vue";
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faComments, faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import CreatePost from "@/components/CreatePost.vue";
import VueJwtDecode from 'vue-jwt-decode';
import FollowedUsersPosts from "@/components/FollowedUsersPosts.vue";
import Comments from "@/components/Comments.vue";

import TrendingStats from "@/components/TrendingStats.vue";
import { useRouter } from "vue-router";
import PostsMap from "@/components/PostsMap.vue";
import AllPostsMap from "@/components/AllPostsMap.vue";

const router = useRouter();
const postId = ref(0);

function handleLogout() {
  localStorage.removeItem("jwtToken");

  router.push("/");
}

function goToUserProfile() {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Niste prijavljeni!');
      return;
    }
    const decodedToken = VueJwtDecode.decode(token);
    const userId = decodedToken.userId; // ili kako god se u tokenu zove id

    if (!userId) {
      alert('Nevalidan token!');
      return;
    }

    // Navigiraj do rute profila, npr:
    router.push({ name: 'userInfoProfile', params: { userId } });
  } catch (error) {
    console.error('Greška pri dobijanju korisničkog profila:', error);
  }
}

function goToAllPostsMap(){
  router.push("/postsmap")
}

function handlePostCreated() {
  selectedSection.value = "following";
}

const selectedSection = ref("following");

const handleCreatePostClick = () => {
  selectedSection.value = "createPost";
};

const setSection = (section) => {
  selectedSection.value = section;
};

function handleShowComments(id) {
  selectedSection.value = "showComments";
  postId.value = id;
  console.log(postId.value);
}
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

.full-page-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.main-content-wrapper {
  display: flex;
  flex: 1; /* Fills available space below navbar */
  justify-content: center;
  align-items: center;
  padding: 2rem;
  margin-left: 220px; /* Adjust for sidebar */
}

.main-content {
  width: 100%;
  max-width: 900px; /* Set max width for your form */
}

.create-post-wrapper {
  width: 100%;
  max-width: 900px; /* Adjust max width as needed */
  margin: 0 auto; /* Center horizontally */
  padding: 1rem; /* Optional padding */
  display: flex;
  justify-content: center;
  align-items: flex-start; /* This will avoid the whole component being too centered vertically */
}
.btn-map {
  display: flex;
  align-items: center;
  gap: 8px; /* razmak između slike i teksta */
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: bold;
  margin-right: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-map:hover {
  background-color: #2980b9;
}


</style>
