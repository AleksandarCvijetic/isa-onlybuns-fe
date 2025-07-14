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
      passwordSuccess: false
    };
  },
  mounted() {
    this.loadUserProfile();
  },
  methods: {
    async loadUserProfile() {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          this.errorMessage = 'Niste prijavljeni.';
          return;
        }
        const decodedToken = VueJwtDecode.decode(token);
        const userId = decodedToken.userId;
        console.log(userId);
        /*const currentUsername = decodedToken.username; // proveri da li je ovo u tokenu
        this.user = decodedToken;

        if (!currentUsername) {
          this.errorMessage = 'Nevalidan token.';
          return;
        }*/
          const config = token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : {};
        const response = await axios.get(`http://localhost:8080/auth/userId/${userId}`, config);
        console.log('Response data:', response.data);
        this.user = response.data;
      } catch (err) {
        this.errorMessage = 'Greška pri učitavanju profila.';
        console.error(err);
      }
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

h1 {
  margin-bottom: 30px;
  font-size: 40px;
  font-family: 'Playfair Display', serif;
  color: #333
}

.profile-info {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center; /* za tekstualne podatke */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

</style>
