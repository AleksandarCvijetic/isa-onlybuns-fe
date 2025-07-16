<template>
  <div class="trending-container">
    <h2>Statistika objava</h2>
    <div class="stat-card">
      <p><strong>Ukupan broj objava:</strong> {{ totalPosts }}</p>
      <p><strong>Broj objava u poslednjih mesec dana:</strong> {{ lastMonthPosts }}</p>
    </div>

    <div class="top-posts-section">
        <h3>Top 5 liked posts in last week:</h3>
        <div v-if="topLikedPosts.length===0">No posts in last seven days</div>
        <ul v-else>
        <li v-for="(post, index) in topLikedPosts" :key="post.id">
          <strong>#{{ index + 1 }}</strong> - {{ post.content?.slice(0, 100) || 'Bez teksta' }}
          <br />
          <span class="likes">❤️ {{ post.like_count }} lajka</span>
          <span class="date">• {{ new Date(post.createdAt).toLocaleDateString() }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TrendingStats',
  data() {
    return {
      posts: [],
      totalPosts: 0,
      lastMonthPosts: 0,
      topLikedPosts: [],
    };
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:8080/post');
      this.posts = response.data;

      this.totalPosts = this.posts.length;
      const now = new Date();
      // --- Poslednjih mesec dana
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      this.lastMonthPosts = this.posts.filter(post =>
        new Date(post.createdAt) > oneMonthAgo
      ).length;

      // --- Poslednjih 7 dana
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      this.topLikedPosts = this.posts
        .filter(post => new Date(post.createdAt) > sevenDaysAgo)
        .sort((a, b) => b.like_count - a.like_count)
        .slice(0, 5);

    } catch (error) {
      console.error('Greška pri dohvaćanju objava:', error);
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

.stat-card {
  background: white;
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
}

.top-posts-section ul {
  list-style: none;
  padding: 0;
}

.top-posts-section li {
  margin-bottom: 1rem;
  font-size: 1rem;
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

</style>
