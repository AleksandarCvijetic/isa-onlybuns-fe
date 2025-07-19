<template>
  <div class="profile-container">
    <h1>User profile</h1>
    <img src="@/assets/profile-picture_12225773.png" alt="User Icon" class="profile-icon" />
    <div v-if="errorMessage" class="text-danger mb-3">{{ errorMessage }}</div>
    <div v-else-if="!user">
      Loading...
    </div>
    <div class="profile-info" v-else>
      <p><strong>Full name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Address:</strong> {{ user.address }}</p>
      <button @click="showPasswordForm = !showPasswordForm" class="form-button">
        Change Password
      </button>
      <div v-if="showPasswordForm" class="password-form">
        <div>
          <label>Enter your current password:</label>
          <input type="password" class="form-control" v-model="currentPassword" />
        </div>
        <div class="form-group mb-2">
          <label>Enter new password:</label>
          <input type="password" class="form-control" v-model="newPassword" />
        </div>
        <div class="form-group mb-3">
          <label>Confirm new password:</label>
          <input type="password" class="form-control" v-model="confirmNewPassword" />
        </div>
        <button class="btn btn-success" @click="changePassword">Change</button>

        <div v-if="passwordMessage" class="mt-2" :class="{'text-success': passwordSuccess, 'text-danger': !passwordSuccess}">
          {{ passwordMessage }}
        </div>
      </div>
    </div>
  </div>
      <!-- Prikaz pratilaca -->
      <h2>Followers: {{ followers.length }}</h2>
      <div class="followers-container">
        <div v-if="followers.length === 0">Nema pratilaca.</div>
        <div class="followers-card" v-for="follower in followers" :key="follower.id">
          <p><strong>Full Name: </strong> {{follower.name}} </p>
          <p><strong>Email: </strong> {{follower.email}} </p>
          <p><strong>Address: </strong> {{follower.address}} </p>
        </div>
      </div>
      <!-- Prikaz koga pratim -->
      <h2>Followees: {{ followees.length }}</h2>
      <div class="followers-container">
        <div v-if="followees.length === 0">Nema pratilaca.</div>
        <div class="followers-card" v-for="followee in followees" :key="followee.id">
          <p><strong>Full Name: </strong> {{followee.name}} </p>
          <p><strong>Email: </strong> {{followee.email}} </p>
          <p><strong>Address: </strong> {{followee.address}} </p>
        </div>
      </div>
      <!-- Prikaz objava -->
      <h2>Posts: {{ posts.length }}</h2>
      <div class="posts-container">
      <div v-if="posts.length===0">No posts</div>
        <div v-else>
          <div v-for="post in posts" :key="post.id" class="post-card" >
            <img v-if="post.image" :src="getImageSrc(post.image)" alt="Post Image" class="post-image" />
            <div class="post-details">
              <h3 class="post-username">
                {{ post.user.username }}
                </h3>          
              <p class="post-description">{{ post.description }}</p>
              <p class="post-date"><strong>Created At:</strong> {{ new Date(post.createdAt).toLocaleString() }}</p>
              <p class="post-comments"><strong>Comments:</strong> {{ post.comments.length }}</p>
              <p class="post-likes"><strong>Likes:</strong> {{ post.likeCount }}</p>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import { config } from '@fortawesome/fontawesome-svg-core';
import axios from 'axios';
import VueJwtDecode from 'vue-jwt-decode';

export default {
  name: 'UserProfile',
  data() {
    return {
      user: null,
      errorMessage: '',
      showPasswordForm: false,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      passwordMessage: '',
      passwordSuccess: false,
      followers: [],
      followees: [],
      posts: []
    };
  },
  mounted() {
    this.loadUserProfile();
  },
  methods: {
    async loadUserProfile() {
      try {
        /*const token = localStorage.getItem('jwtToken');
        if (!token) {
          this.errorMessage = 'Niste prijavljeni.';
          return;
        }*/
        //const decodedToken = VueJwtDecode.decode(token);
        const userId = this.$route.params.userId;
        console.log("USER ID: " + userId);
        /*const currentUsername = decodedToken.username; // proveri da li je ovo u tokenu
        this.user = decodedToken;

        if (!currentUsername) {
          this.errorMessage = 'Nevalidan token.';
          return;
        }
          const config = token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : {};*/
        const response = await axios.get(`http://localhost:8080/auth/userId/${userId}`);
        console.log('Response data:', response.data);
        this.user = response.data;
        await this.fetchFollowers();
        await this.fetchFollowees();
        await this.fetchPosts();
        console.log(this.user.id);
      } catch (err) {
        this.errorMessage = 'Greška pri učitavanju profila.';
        console.error(err);
      }
    },
    // Method to extract the filename from the image path
    getImageSrc(imagePath) {
      const fileName = imagePath.substring(imagePath.lastIndexOf("\\") + 1); // Extract file name from path
      return `http://localhost:8080/images/${fileName}`; // Construct the URL
    },
    async changePassword() {

      if (this.newPassword !== this.confirmNewPassword) {
        this.passwordMessage = "New passwords do not match.";
        this.passwordSuccess = false;
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/auth/change-password', {
          userId: this.user.id,
          oldPassword: this.currentPassword,
          newPassword: this.newPassword
        });

        if(response.data === "Old password incorrect!"){
          this.passwordMessage = "Old password is incorrect!";
          this.passwordSuccess = false;
          return;
        }

        this.passwordMessage = response.data;
        this.passwordSuccess = true;

        // Reset fields
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
        this.showPasswordForm = false;
      } catch (error) {
          this.passwordMessage = error.response?.data || 'Error changing password.';
          this.passwordSuccess = false;
      }
    },

    async fetchFollowers(){
      try {
        const token = localStorage.getItem('jwtToken');
        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        const response = await axios.get(`http://localhost:8080/followers/followers/${this.user.id}`, config);
        this.followers = response.data;
      } catch (err) {
        this.errorMessage = 'Greška pri učitavanju pratilaca.';
        console.error(err);
      }
    },
    async fetchFollowees(){
      try {
        const token = localStorage.getItem('jwtToken');
        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        const response = await axios.get(`http://localhost:8080/followers/followees/${this.user.id}`, config);
        this.followees = response.data;
      } catch (err) {
        this.errorMessage = 'Greška pri učitavanju pracenih.';
        console.error(err);
      }
    },
    async fetchPosts(){
      try {
        const token = localStorage.getItem('jwtToken');
        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        const response = await axios.get(`http://localhost:8080/post/posts-by-user/${this.user.id}`, config);
        this.posts = response.data;
        //console.log("ID" + this.posts[0].id);
      } catch (err) {
        this.errorMessage = 'Greška pri učitavanju objava.';
        console.error(err);
      }
    }

  },
};
</script>

<style scoped>

.profile-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}

.posts-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
}

.followers-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
  color: black;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

h1 {
  margin-bottom: 30px;
  font-size: 40px;
  font-family: 'Playfair Display', serif;
  color: #333
}

h2 {
  font-size: 30px;
  font-family: 'Playfair Display', serif;
  color: #333;
  text-align: center;
}

.profile-info {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center; /* za tekstualne podatke */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.followers-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center; /* za tekstualne podatke */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* Ovo kontroliše širinu kartice */
  flex: 0 1 180px;       /* fiksna maksimalna širina ~180px, fleksibilno smanjenje */
  max-width: auto;
  min-width: auto;
}

.followers-card p {
  margin-bottom: 10px;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  color: #555;
}

.profile-icon {
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
}

.profile-info p {
  margin-bottom: 10px;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  color: #555;
}

.password-form {
  color: black;
}

.form-button {
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  color: black;
}

.post-card {
  display: inline-block;
  margin-left: 20px;
  margin-bottom: 20px;
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

.post-likes {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}

</style>
