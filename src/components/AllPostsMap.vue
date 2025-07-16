<template>
  <div>
    <PostsMap :posts="allPosts" :userAddress="user?.address" />
  </div>
</template>

<script>
import PostsMap from './PostsMap.vue';
import axios from 'axios';
import VueJwtDecode from 'vue-jwt-decode';

export default {
  components: { PostsMap },
  data() {
    return {
      allPosts: [],
      user: null,
      errorMessage: '',
    };
  },
  async mounted() {
    await this.loadUser();
    await this.loadPosts();
  },
  methods: {
    async loadUser() {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          this.errorMessage = 'Niste prijavljeni.';
          return;
        }

        const decodedToken = VueJwtDecode.decode(token);
        const userId = decodedToken.userId;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`http://localhost:8080/auth/userId/${userId}`, config);
        this.user = response.data;

      } catch (err) {
        this.errorMessage = 'Greška pri učitavanju korisnika.';
        console.error(err);
      }
    },

    async loadPosts() {
      try {
        const res = await axios.get('http://localhost:8080/post');
        this.allPosts = res.data;
      } catch (err) {
        console.error('Greška pri učitavanju postova:', err);
      }
    },
  },
};
</script>
