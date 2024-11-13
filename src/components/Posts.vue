<template>
  <div class="posts-container">
    <h1>All Posts</h1>
    <div class="no-posts-message" v-if="posts.length === 0">No posts available</div>
    <div v-else>
      <div v-for="post in posts" :key="post.id" class="post-card" @click="goToPost(post.id)">
        <img v-if="post.image" :src="post.image" alt="Post Image" class="post-image" />
        <div class="post-details">
          <h3 class="post-username">{{ post.user.username }}</h3>
          <p class="post-description">{{ post.description }}</p>
          <p class="post-date"><strong>Created At:</strong> {{ new Date(post.createdAt).toLocaleString() }}</p>
          <p class="post-comments"><strong>Comments:</strong> {{ post.comments.length }}</p>
          <p><strong>Likes:</strong> {{ post.likeCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Posts',
  data() {
    return {
      posts: [],
      userRole: null,
    };
  },
  created() {
    this.fetchPosts();
    this.setUserRoleFromToken();
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get('http://localhost:8080/post');
        console.log('API response:', response.data); // Log the data response
        // Sort posts by `createdAt` date, with newest posts first
        this.posts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    goToPost(id){
      if(id){
        this.$router.push(`/post-details/${id}`);
      } else {
        console.error('Post ID is undefined');
      }
      
    },
    async setUserRoleFromToken() {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        // Dynamically import jwt-decode
        const jwt_decode = (await import('jwt-decode')).default;
        const decodedToken = jwt_decode(token);
        this.userRole = decodedToken.roles || null;
        console.log(decodedToken.roles);
      }
    },
  },
};
</script>

<style scoped>
/* Importing Google Fonts for a better typography */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Open+Sans:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500&display=swap');

.posts-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: #333;
  position: absolute;
  font-family: 'Poppins', sans-serif; /* Using Poppins for general content */
}

h1 {
  text-align: center;
  width: 100%;
  display: inline-block;
  color: #4a4a4a;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-family: 'Playfair Display', serif; /* Using Playfair Display for headings */
}

.no-posts-message {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  margin-top: 2rem;
}

.post-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.post-card {
  display: inline-block;
  margin-left: 20px;
  background-color: #eedbca;
  border: 3px solid #a1622e;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  width: 300px; /* Set a fixed width for each post card */
  padding: 1.5rem;
  transition: transform 0.2s ease-in-out;
  font-family: 'Open Sans', sans-serif; /* Using Open Sans for card content */
}
.button {
  display: inline-block;
  margin: 0.5rem 0.25rem;
  padding: 0;
}

.button button {
  background-color: #a1622e;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-family: 'Roboto', sans-serif;
}

.button button:hover {
  background-color: #8a4f22;
  transform: scale(1.05);
}

.button button:active {
  background-color: #71401b;
  transform: scale(1);
}

.button button:focus {
  outline: none;
}

.post-card:hover {
  transform: translateY(-5px);
}

.post-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.post-details {
  padding: 0.5rem 0;
}

.post-username {
  color: #333;
  font-weight: 600; /* Slightly bolder for the username */
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-family: 'Roboto', sans-serif; /* Using Roboto for usernames */
}

.post-description {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}



.post-date,
.post-comments {
  font-size: 0.9rem;
  color: #777;
  font-family: 'Open Sans', sans-serif; /* Keeping Open Sans for smaller text */
}
</style>

