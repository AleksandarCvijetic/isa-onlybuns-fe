<template>
  <div class="trending-container">
    <h2>Post statistics</h2>
    <div class="stat-card">
      <p><strong>Total number of posts:</strong> {{ totalPosts }}</p>
      <p><strong>Number of posts in last month:</strong> {{ lastMonthPosts }}</p>
    </div>

    <div class="top-posts-section">
      <h3>Top 5 liked posts in last week:</h3>
        <div v-if="topLikedPosts.length===0">No posts in last seven days</div>
        <div v-else>
          <div v-for="post in topLikedPosts" :key="post.id" class="post-card" >
            <img @click="goToPost(post.id)" v-if="post.image" :src="getImageSrc(post.image)" alt="Post Image" class="post-image" />
            <div class="post-details">
              <h3 class="post-username">
                {{ post.user.username }}
                </h3>          
              <p class="post-description">{{ post.description }}</p>
              <p class="post-date"><strong>Created At:</strong> {{ new Date(post.createdAt).toLocaleString() }}</p>
              <p class="post-comments"><strong>Comments:</strong> {{ post.comments.length }}</p>
              <p><strong>Likes:</strong> {{ post.likeCount }}</p>
            </div>
          </div>
      </div>
    </div>
    <div class="top-posts-section">
      <h3>Top liked posts all time</h3>
        <div v-if="topLikedPostsAllTime.length === 0">No liked posts</div>
        <div v-else>
          <div v-for="post in topLikedPostsAllTime" :key="post.id" class="post-card" >
                    <img @click="goToPost(post.id)" v-if="post.image" :src="getImageSrc(post.image)" alt="Post Image" class="post-image" />
                    <div class="post-details">
                      <h3 class="post-username">
                        {{ post.user.username }}
                        </h3>          
                      <p class="post-description">{{ post.description }}</p>
                      <p class="post-date"><strong>Created At:</strong> {{ new Date(post.createdAt).toLocaleString() }}</p>
                      <p class="post-comments"><strong>Comments:</strong> {{ post.comments.length }}</p>
                      <p><strong>Likes:</strong> {{ post.likeCount }}</p>
                    </div>
            </div>
        </div>
    </div>
    <div class="top10-users">
      <h3>Top 10 likers in last week</h3>
      <div v-if="topUsers.length === 0">No liked posts in last 7 days</div>
      <div v-else>
        <div v-for="user in topUsers" :key="user.id" class="user-card">
          <p><strong>Username: </strong>{{ user.username }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios, { all } from 'axios';

export default {
  name: 'TrendingStats',
  data() {
    return {
      posts: [],
      totalPosts: 0,
      lastMonthPosts: 0,
      topLikedPosts: [],
      topLikedPostsAllTime: [],
      allLikes: [],
      topUsers: [],
    };
  },
  methods:{
    // Method to extract the filename from the image path
    getImageSrc(imagePath) {
      const fileName = imagePath.substring(imagePath.lastIndexOf("\\") + 1); // Extract file name from path
      return `http://localhost:8080/images/${fileName}`; // Construct the URL
    }
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:8080/post');
      this.posts = response.data;
      this.totalPosts = this.posts.length;

      const now = new Date();

      // --- Postovi u poslednjih mesec dana
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      this.lastMonthPosts = this.posts.filter(post =>
        new Date(post.createdAt) > oneMonthAgo
      ).length;

      // --- Top 10 svih vremena
      const top10Response = await axios.get('http://localhost:8080/post/top10');
      this.topLikedPostsAllTime = top10Response.data.filter(post => post.likeCount > 0);

      // --- Top 5 poslednjih 7 dana
      const weeklyTopResponse = await axios.get('http://localhost:8080/post/top5weekly');
      this.topLikedPosts = weeklyTopResponse.data.filter(post => post.likeCount);

    } catch (error) {
      console.error('Greška pri dohvaćanju podataka o postovima:', error);
    }

    try {
      // --- Dobavljanje svih lajkova
      const response = await axios.get('http://localhost:8080/post/likes');
      const allLikes = response.data;
      console.log(allLikes);
      this.allLikes = allLikes;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // --- Filtriranje lajkova iz poslednjih 7 dana
      const recentLikes = allLikes.filter(like => new Date(like.likeDate) > sevenDaysAgo);

      // --- Broj lajkova po korisniku
      const userLikeCounts = {};

      for (const like of recentLikes) {
        const username = like.user?.username || like.user;
        if (!username) continue;
        userLikeCounts[username] = (userLikeCounts[username] || 0) + 1;
      }

      // --- Sortiranje i uzimanje top 10 korisnika
      const topUsers = Object.entries(userLikeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([username, count]) => ({ username, count }));

      this.topUsers = topUsers;

    } catch (error) {
      console.error('Greška pri obradi lajkova:', error);
    }
  }

};
</script>

<style scoped>
.trending-container {
  background: #f0f0f0;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
}

h2{
  color: black;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
  font-size: 40px;
}

h3{
  color: black;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
  font-size: 30px;
}

.stat-card {
  background: white;
  color: black;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  font-size: 1.2rem;
}
.top-posts-section {
  margin-top: 2rem;
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
  color: black;
}

.top-posts-section ul {
  list-style: none;
  padding: 0;
  color: black;
}

.top-posts-section li {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: black;
}

.likes {
  color: #e74c3c;
  margin-left: 0.5rem;
}

.date {
  color: #888;
  margin-left: 1rem;
  font-size: 0.9rem;
}
.post-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.post-card {
  display: inline-block;
  margin-left: 20px;
  margin-bottom: 20px;
  background-color: #eedbca;
  border: 3px solid #a1622e;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  width: 300px; /* Set a fixed width for each post card */
  padding: 1.5rem;
  transition: transform 0.2s ease-in-out;
  font-family: 'Open Sans', sans-serif; /* Using Open Sans for card content */
}
.button {
  display: inline-block;
  margin: 0.5rem 0.25rem;
  padding: 0;
}

.button button {
  background-color: #a1622e;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-family: 'Roboto', sans-serif;
}

.button button:hover {
  background-color: #8a4f22;
  transform: scale(1.05);
}

.button button:active {
  background-color: #71401b;
  transform: scale(1);
}

.button button:focus {
  outline: none;
}

.post-card:hover {
  transform: translateY(-5px);
}

.post-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.post-details {
  padding: 0.5rem 0;
}

.post-username {
  color: #333;
  font-weight: 600; /* Slightly bolder for the username */
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-family: 'Roboto', sans-serif; /* Using Roboto for usernames */
}

.post-description {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}



.post-date,
.post-comments {
  font-size: 0.9rem;
  color: #777;
  font-family: 'Open Sans', sans-serif; /* Keeping Open Sans for smaller text */
}

.top10-users{
  margin-top: 2rem;
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
  color: black;
}

</style>
