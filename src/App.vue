<!-- App.vue -->
<template>
    <v-app>
    <!-- Main router-view for displaying routed components -->
    <router-view />
    <!-- Show chat only when user is authenticated and not on Login/Register -->
    <ChatModal v-if="showChat"></ChatModal>
  </v-app>
  
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
      const hidden = ['login', 'register'];
       console.log('isAuth=', this.isAuthenticated, 'route=', this.$route.name)
      return this.isAuthenticated && !hidden.includes(this.$route.name);
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
