<template>
  <div class="create-post-container">
    <h2>Create a New Post</h2>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="description"
        placeholder="Describe your post..."
        rows="4"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="image">Upload a picture of a bunny</label>
      <input required type="file" id="image" @change="handleImageUpload" />
      <div v-if="imagePreview" class="image-preview">
        <img :src="imagePreview" alt="Image Preview" />
      </div>
      <p v-if="showWarning" class="warning-text">
        Uploading an image is required!
      </p>
    </div>

    <div class="form-group">
      <label>Location</label>
      <div>
        <MapComponent :mode="'edit'" @location-selected="updateLocation" />
      </div>
    </div>
    <button class="btn btn-create" @click="createPost">Create Post</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import MapComponent from "@/components/MapComponent.vue";
import VueJwtDecode from "vue-jwt-decode";
import axios from "axios";
import { defineEmits } from "vue";

const emit = defineEmits(["postCreated"]);
const description = ref("");
const image = ref(null);
const imagePreview = ref(null);
const address = ref("");
const useMap = ref(false);
const location = ref({
  address: "",
  city: "",
  country: "",
  latitude: null,
  longitude: null,
});
const createdAt = ref(new Date());
const showWarning = ref(false);

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    image.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
}

function updateLocation(selectedLocation) {
  location.value = selectedLocation;
  address.value = `${selectedLocation.address}, ${selectedLocation.city}, ${selectedLocation.country}`;
}

async function createPost() {
  try {
    if (!imagePreview.value) {
      showWarning.value = true;
      return;
    }
    const token = localStorage.getItem("jwtToken");
    const decodedToken = VueJwtDecode.decode(token);
    const userId = decodedToken.userId;

    const formData = new FormData();
    formData.append("description", description.value);
    formData.append("image", image.value);
    formData.append("location", JSON.stringify(location.value));
    formData.append("createdAt", createdAt.value.toISOString());
    formData.append("userId", userId);

    const response = await axios.post("http://localhost:8080/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    emit("postCreated");
    console.log("Post created:", response.data);
  } catch (error) {
    console.error("Error creating post:", error);
  }
}
</script>

<style scoped>
.create-post-container {
  width: 100%;
  max-width: 900px;
  margin: auto;
  padding: 3rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  font-family: Arial, sans-serif;
}

body {
  margin: 0;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
}

h2 {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.warning-text {
  color: #d9534f;
  font-weight: bold;
  margin-top: 0.5rem;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}

textarea,
input[type="text"],
input[type="file"] {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s;
}

textarea:focus,
input[type="text"]:focus,
input[type="file"]:focus {
  border-color: #007bff;
  outline: none;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s;
  resize: none; /* Prevent resizing */
}

.btn-toggle {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: #007bff;
  background-color: #e7f0ff;
  border: 1px solid #007bff;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.3s, color 0.3s;
}

.btn-toggle:hover {
  background-color: #007bff;
  color: #fff;
}

button.btn-create {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.btn-create:hover {
  background-color: #218838;
}

.image-preview img {
  width: 100%;
  max-width: 200px;
  margin-top: 0.5rem;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

p {
  font-size: 1rem;
  color: #666;
}

input[type="file"]::file-selector-button {
  padding: 0.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

input[type="file"]::file-selector-button:hover {
  background-color: #0056b3;
}
</style>
