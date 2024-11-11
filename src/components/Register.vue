<template>
    <div class="register-container">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            required
            placeholder="Enter your username"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            required
            placeholder="Enter your password"
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            required
            placeholder="Confirm your password"
          />
          <small v-if="passwordMismatch" class="error-message">Passwords do not match</small>
        </div>
        
        <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            required
            placeholder="Enter your name"
          />
        </div>
        
        <div class="form-group">
          <label for="address">Address</label>
          <input
            type="text"
            id="address"
            v-model="form.address"
            required
            placeholder="Enter your address"
          />
        </div>
        
        <button type="submit" :disabled="passwordMismatch" class="btn btn-primary">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    name: "Register",
    data() {
      return {
        form: {
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          name: "",
          address: ""
        }
      };
    },
    computed: {
      passwordMismatch() {
        return this.form.password !== this.form.confirmPassword;
      }
    },
    methods: {
      async handleRegister() {
        if (this.passwordMismatch) {
          alert("Passwords do not match. Please try again.");
          return;
        }
        
        const registrationData ={
            email: this.form.email,
            name: this.form.name,
            username: this.form.username,
            password: this.form.password,
            address: this.form.address,
            roles: "ROLE_USER",
        };

        try {
          const response = await axios.post("http://localhost:8080/auth/addNewUser", registrationData);
          alert(response.data); // Show server response message
          console.log("Response:", response.data);
          this.$router.push('/login');
        } catch (error) {
          alert("Error during registration: " + error.response.data);
          console.error("Error during registration:", error);
        }

      }
    }
  };
  </script>
  
  <style scoped>
  .register-container {
    width: 400px;
    margin: auto;
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: black;
  }
  
  .form-group {
    margin-bottom: 1rem;
    color: black;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .btn {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    color: white;
    background-color: #007bff;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  
  .btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .error-message {
    color: red;
    font-size: 0.875rem;
  }
  </style>
  