<!-- App.vue -->
<template>
  <!-- Main router-view for displaying routed components -->
  <router-view />
  <!-- Prikaz ChatModal samo kada je korisnik autentifikovan i nije na login/register stranici -->
    <ChatModal v-if="showChat" />
</template>

<script>
import ChatModal from '@/components/ChatModal.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: { ChatModal },
  computed: {
    ...mapGetters(['isAuthenticated']),
    showChat() {
      const hiddenRoutes = ['login', 'register'];
      return this.isAuthenticated && !hiddenRoutes.includes(this.$route.name);
    }
  },
  watch: {
    $route() {
      // automatski će se reaktivirati showChat
    }
  }
};
</script>

<style>
/* Apply white background to the whole app */
html, body, #app {
  background-color: white;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  min-height: 100vh;
}

</style>
