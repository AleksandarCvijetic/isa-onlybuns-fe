<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="form-control"
            placeholder="Enter your e-mail"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        <div class="form-group">
            <p class="register-text">Don't have an account? 
                <router-link to="/register" class="register-link">Click here to register</router-link>
            </p>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
        
        <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import VueJwtDecode from 'vue-jwt-decode';
  export default {
    data() {
      return {
        form: {
            email: '',
            password: '',
        },
        errorMessage: '',
      };
    },
    methods: {
      async handleLogin() {
        const loginPayload = {
          email: this.form.email,
          password: this.form.password,
        };

        try {
          const response = await axios.post('http://localhost:8080/auth/generateToken', loginPayload);
  
          // Assuming the backend sends the JWT token upon successful login
          const token = response.data;
  
          // Store the token in localStorage or Vuex
          localStorage.setItem('jwtToken', token);
          const decodedToken = VueJwtDecode.decode(token);
          const role = decodedToken.role;
          if (role === 'ROLE_USER') {
          this.$router.push('/home-user'); 
        }else {
          this.$router.push('/homepage');
        }
          // Optionally, redirect user to another page after successful login
        } catch (error) {
          if (error.response) {
            const status = error.response.status;
            console.log("JEL UDJES")
            if (status === 403) {
              this.errorMessage = 'Invalid username or password. Please try again.';
            }else if (status === 429) {
              this.errorMessage = 'Too many login attempts. Please wait a minute and try again.';
            }else{
              this.errorMessage = 'An error occurred. Please try again later.';
            }
          }else{
              this.errorMessage = 'Network error. Please check your connection.';
          }
          alert(this.errorMessage);
          console.log(this.errorMessage);
          console.error(error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 2rem;
  background-color: #f1f1f1;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.login-container:hover {
  transform: translateY(-2px);
}

h2 {
  color: #3c2000;
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.register-text {
  color: #3c2000;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.25rem;
  position: relative;
}

label {
  display: block;
  color: #6c757d;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 0.25rem;
  border: 2px solid #7d4300;
  border-radius: 8px;
  font-size: 1rem;
  color: #3c2000;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #b77932;
  box-shadow: 0 0 0 3px rgba(183, 121, 50, 0.2);
}

input:hover:not(:focus) {
  border-color: #b77932;
}

input::placeholder {
  color: #a0aec0;
}

button {
  width: 100%;
  padding: 0.875rem;
  margin-top: 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: #7d4300;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Verdana', sans-serif;
}

button:hover {
  background-color: #3c2000;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.alert {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  line-height: 1.5;
}

.alert-danger {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

@media (max-width: 480px) {
  .login-container {
    margin: 20px auto;
    padding: 1.5rem;
  }

  input {
    padding: 0.625rem 0.875rem;
  }

  button {
    padding: 0.75rem;
  }
}

/* Optional: Add loading state animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

button.loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

  