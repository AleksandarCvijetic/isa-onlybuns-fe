<template>
    <div class="post-details-container">
      <div class="post-details">
        <!-- Post Description -->
        <h2>{{ post.description }}</h2>
  
        <!-- Post Creation Date -->
        <p class="post-date">{{ post.createdAt }}</p>
  
        <!-- Likes Section -->
        <div class="likes-section">
          <button class="like-button" @click="likePost">
            ❤️ Like
          </button>
          <span>{{ post.likeCount }} Likes</span>
        </div>
  
        <!-- Comment Input and Button -->
        <div class="comment-section">
          <input v-model="newComment" type="text" placeholder="Write a comment..." class="comment-input"/>
          <button @click="addComment()" class="add-comment-button">Add Comment</button>
        </div>
  
        <!-- Display Comments -->
        <div v-if="post.comments && post.comments.length" class="comments-list">
          <h3>Comments:</h3>
          <ul>
            <li v-for="comment in post.comments" :key="comment.id" class="comment-item">
              <p class="comment-content">{{ comment.text }}</p>
              <p class="comment-meta">
                Posted on {{ formatDate(comment.creationDate) }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  import { jwtDecode } from 'jwt-decode';
  
  export default {
    data() {
      return {
        post: null,
        userId: null, // Track logged-in user's ID to check for editing permissions
        newComment: '',
      };
    },
    computed: {
      formattedPostDate() {
        return this.formatDate(this.post.createdAt);
      }
    },
    async created() {
      const postId = this.$route.params.id; // Access the ID from route params
      if (!postId) {
        console.error('Post ID is missing');
        return;
      }
      console.log(postId);
      this.fetchPostDetails(postId);
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {  // Change the locale if needed
          weekday: 'long', // "Monday"
          year: 'numeric', // "2024"
          month: 'long', // "November"
          day: 'numeric', // "12"
          hour: 'numeric', // "11"
          minute: 'numeric', // "30"
          second: 'numeric', // "15"
          hour12: true // Add AM/PM if you want
        });
      },
      async fetchPostDetails(id) {
        try {
          const token = localStorage.getItem('jwtToken');
          const response = await axios.get(`http://localhost:8080/post/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);
          // Ensure likes and comments are initialized
          this.post = {
            ...response.data, // Initialize likes as an empty array if not present
            comments: response.data.comments || [],  // Initialize comments as an empty array if not present
          };
        } catch (error) {
          console.error('Error fetching post details:', error);
        }
      },
      async likePost() {
        try {
        const token = localStorage.getItem('jwtToken');
        const userId = jwtDecode(token).userId;
        console.log('UserId', userId);
        const response = await axios.post(
          `http://localhost:8080/post/${this.post.id}/like`,
          {userId},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Update the post with the new likes count
        this.post.likeCount++;
      } catch (error) {
        console.error('Error liking post:', error);
      }
      },
      async addComment() {
        if (!this.newComment.trim()) {
        alert('Please enter a comment');
        return;
      }

      try {
        const token = localStorage.getItem('jwtToken');
        const userId = jwtDecode(token).userId;
        const response = await axios.post(
          `http://localhost:8080/post/${this.post.id}/comment`,
          { text: this.newComment,
            user: {id: userId}
           },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        // Add the new comment to the list
        this.post.comments.push(response.data);
        this.newComment = ''; // Clear the input field
      } catch (error) {
        console.error('Error adding comment:', error);
      }
      },
      async editPost(updatedPost) {
        // Code for editing post details
      },
      async deletePost() {
        // Code for deleting the post
      },
    },
  };
  </script>

<style scoped>
.post-details-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%; /* Make sure the container takes full width */
  background-color: #f4f4f9;
  margin-left: 220%;
  margin-right: 30%;
}

.post-details {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px; /* Restrict the width to 600px */
  box-sizing: border-box;
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
}

.post-date {
  text-align: center;
  color: #777;
  font-size: 14px;
  margin-bottom: 20px;
}

.likes-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.like-button {
  background-color: #ff4081;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.like-button:hover {
  background-color: #f50057;
}

.comment-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.comment-input {
  width: 75%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.add-comment-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-comment-button:hover {
  background-color: #0056b3;
}

.comments-list {
  margin-top: 20px;
}

.comment-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.comment-content {
  font-size: 14px;
  margin-bottom: 5px;
}

.comment-meta {
  font-size: 12px;
  color: #777;
}

ul {
  list-style: none;
  padding-left: 0;
}
</style>

  