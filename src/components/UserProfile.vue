<template>
    <div class="user-profile">
      <h1>User Profile: {{ username }}</h1>
      <!-- Additional content for the user's profile can go here -->
      <button v-if="isFollowing" @click="unfollowUser">Unfollow</button>
      <button v-else @click="followUser">Follow</button>
    </div>
  </template>
  
  <script>
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

export default {
  props: ["profileId"], // Ensure profileId is passed as a prop
  data() {
    return {
      isFollowing: false,
      userId: null,
      username: null, // Define username
    };
  },
  methods: {
    async decodeToken() {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          this.userId = decodedToken.userId;
          this.username = decodedToken.username; // Extract username
          console.log("Decoded token:", decodedToken);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        console.error("No JWT token found in localStorage");
      }
    },
    async followUser() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No JWT token found. User may not be authenticated.");
        return;
      }
      console.log("Payload:", {
        followerId: this.userId,
        followeeId: this.profileId,
      });

      try {
        await axios.post(
          
          "http://localhost:8080/followers/follow",
          {
            followerId: this.userId,
            followeeId: this.profileId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        this.isFollowing = true;
      } catch (error) {
        console.error("Error following user:", error);
      }
    },
    async unfollowUser() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No JWT token found. User may not be authenticated.");
        return;
      }

      try {
        await axios.post(
          "http://localhost:8080/followers/unfollow",
          {
            followerId: this.userId,
            followeeId: this.profileId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.isFollowing = false;
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    },
  },
  async mounted() {
    console.log("Profile ID from route:", this.profileId);
    await this.decodeToken();
    if (this.userId) {
      try {
        const response = await axios.get(`http://localhost:8080/followers/${this.userId}/followees`);
        this.isFollowing = response.data.some(
          (user) => user.id.toString() === this.profileId.toString()
        );
        console.log("Followees:", response.data);
        console.log("Follow status:", this.isFollowing);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    }
  },
};
</script>

  
  <style scoped>
  .user-profile {
    text-align: center;
    margin-top: 2rem;
    color: black;
  }
  </style>
  