<!-- App.vue -->
<template>
  <!-- Main router-view for displaying routed components -->
  <router-view />
</template>

<script>
export default {
  name: "App",
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
