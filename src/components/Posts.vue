<template>
  <div class="posts-container">
    <h1>All Posts</h1>
    <div class="no-posts-message" v-if="posts.length === 0">No posts available</div>
    <div v-else>
      <div v-for="post in posts" :key="post.id" class="post-card">
        <img v-if="post.image" :src="post.image" alt="Post Image" class="post-image" />
        <div class="post-details">
          <h3 class="post-username">{{ post.user.username }}</h3>
          <p class="post-description">{{ post.description }}</p>
          <p class="post-date"><strong>Created At:</strong> {{ new Date(post.createdAt).toLocaleString() }}</p>
          <p class="post-comments"><strong>Comments:</strong> {{ post.comments.length }}</p>
          <!--<p><strong>Likes:</strong> {{ post.likes.length }}</p>-->
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
    };
  },
  created() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get('http://localhost:8080/post');
        this.posts = response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
  },
};
</script>

<style scoped>
.posts-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: #333;
}

h1 {
  text-align: center;
  color: #4a4a4a;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.no-posts-message {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  margin-top: 2rem;
}

.post-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  transition: transform 0.2s ease-in-out;
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
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
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
}
</style>
