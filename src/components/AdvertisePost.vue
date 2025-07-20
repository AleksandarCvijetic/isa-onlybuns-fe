<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <h2 class="text-h5 font-weight-bold mb-4">Posts from your followers</h2>

        <v-alert
          v-if="loading"
          type="info"
          border="start"
          colored-border
          class="mb-4"
        >
          Loading posts...
        </v-alert>

        <v-alert
          v-else-if="error"
          type="error"
          border="start"
          colored-border
          class="mb-4"
        >
          Error: {{ error }}
          <template #append>
            <v-btn size="small" color="error" @click="fetchPosts">
              Try again
            </v-btn>
          </template>
        </v-alert>

        <v-alert
          v-if="!loading && posts.length === 0"
          type="info"
          border="start"
          colored-border
        >
          There's no posts.
        </v-alert>

        <v-card
          v-for="post in posts"
          :key="post.id"
          class="mb-4"
          elevation="2"
          max-height="200"
        >
          <v-row no-gutters>
            <v-col cols="4">
              <v-img
                :src="post.image"
                :alt="post.description"
                height="200"
                cover
              />
            </v-col>

            <v-col cols="8" class="pa-4">
              <v-row>
                <v-col
                  cols="12"
                  class="d-flex justify-space-between align-center"
                >
                  <div class="font-weight-medium text-subtitle-1">
                    {{ post.creatorUsername }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ formatDate(post.createdAt) }}
                  </div>
                </v-col>

                <v-col cols="12">
                  <div class="mb-2 text-body-1 font-italic">
                    {{ post.description }}
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-row dense>
                    <v-col cols="auto">♥ {{ post.likeCount }}</v-col>
                    <v-col cols="auto">
                      📍 {{ post.location.city }}, {{ post.location.country }}
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <div class="d-flex justify-end align-end" style="flex: 1">
                <v-btn
                  color="secondary"
                  variant="outlined"
                  size="small"
                  class="mt-2"
                  @click="advertisePost(post)"
                >
                  <v-icon start>mdi-bullhorn</v-icon>
                  Advertise
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import VueJwtDecode from "vue-jwt-decode";

const posts = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchPosts = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch("http://localhost:8080/post");
    if (!response.ok) throw new Error("Failed to fetch posts");

    const data = await response.json();
    posts.value = data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const advertisePost = (post) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("No token found in localStorage");
  }

  const decodedToken = VueJwtDecode.decode(token);
  const role = decodedToken.role; // Only needed if you use it
  if (role == "ROLE_ADMIN") {
    axios.put(`http://localhost:8080/post/${post.id}/mark-for-advertising`);
  }
};

onMounted(() => {
  fetchPosts();
});
</script>
