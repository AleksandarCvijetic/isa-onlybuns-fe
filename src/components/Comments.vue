<template>
  <v-card class="pa-4" elevation="2">
    <v-textarea
      v-model="newComment"
      label="Dodaj komentar..."
      auto-grow
      rows="2"
      class="mb-3"
      variant="outlined"
    ></v-textarea>

    <v-btn
      :disabled="!newComment.trim()"
      @click="submitComment"
      color="primary"
      class="mb-4"
    >
      Pošalji
    </v-btn>

    <p v-if="loading">Učitavanje komentara...</p>
    <p v-if="error" class="text-red">{{ error }}</p>

    <v-list v-else>
      <v-list-item
        v-for="comment in sortedComments"
        :key="comment.id"
        class="mb-2"
      >
        <v-list-item-content>
          <div class="d-flex justify-space-between align-center">
            <strong>{{ comment.username }}</strong>
            <small class="text-grey-darken-1">
              {{ formatDate(comment.createdAt) }}
            </small>
          </div>
          <div>{{ comment.text }}</div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import VueJwtDecode from "vue-jwt-decode";

const props = defineProps({
  postId: { type: Number, required: true },
});

const comments = ref([]);
const newComment = ref("");
const loading = ref(true);
const error = ref(null);

function formatDate(dateStr) {
  if (!dateStr) return "Nepoznat datum";
  const clean = dateStr.replace(/\[.*\]/, "");
  const date = new Date(clean);
  if (isNaN(date)) return "Nepoznat datum";
  return date.toLocaleString("sr-RS", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/comments/${props.postId}`
    );
    comments.value = data.map((c) => ({
      id: c.id,
      username: c.username,
      text: c.text,
      createdAt: c.creationDate,
    }));
  } catch (err) {
    error.value = "Greška pri dohvatanju komentara.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

async function submitComment() {
  if (!newComment.value.trim()) return;

  const token = localStorage.getItem("jwtToken");
  const decodedToken = VueJwtDecode.decode(token);
  const currentUserId = decodedToken.userId;
  const payload = {
    text: newComment.value.trim(),
    userId: currentUserId,
    creationDate: new Date().toISOString(),
    postId: props.postId,
  };

  try {
    const { data: created } = await axios.post(
      "http://localhost:8080/comments",
      payload
    );
    comments.value.unshift({
      id: created.id,
      username: created.username,
      text: created.text,
      createdAt: created.creationDate,
    });
    newComment.value = "";
  } catch (err) {
    console.error("Greška pri slanju komentara:", err);
    error.value = "Neuspešno slanje komentara.";
  }
}

const sortedComments = computed(() =>
  [...comments.value].sort(
    (a, b) =>
      new Date(b.createdAt.replace(/\[.*\]/, "")) -
      new Date(a.createdAt.replace(/\[.*\]/, ""))
  )
);
</script>
