<template>
  <div class="analytics">
    <h1>App Analytics</h1>

    <section class="trend-charts">
      <div class="chart-card">
        <h2>Last 7 Days</h2>
        <Line
          v-if="weekData"
          :data="weekData"
          :options="lineOptions"
        />
        <p v-else>Loading…</p>
      </div>

      <div class="chart-card">
        <h2>Last 30 Days</h2>
        <Line
          v-if="monthData"
          :data="monthData"
          :options="lineOptions"
        />
        <p v-else>Loading…</p>
      </div>

      <div class="chart-card">
        <h2>Last 12 Months</h2>
        <Line
          v-if="yearData"
          :data="yearData"
          :options="lineOptions"
        />
        <p v-else>Loading…</p>
      </div>
    </section>

    <section class="radial-chart">
      <h2>User Activity Breakdown</h2>
      <Doughnut
        v-if="activityData"
        :data="activityData"
        :options="doughnutOptions"
      />
      <p v-else>Loading…</p>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  ArcElement,
  Tooltip,
  Legend
)

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { display: true }, y: { display: true } }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } }
}

// separate refs so Vue tracks assignment
const weekData   = ref(null)
const monthData  = ref(null)
const yearData   = ref(null)
const activityData = ref(null)

async function loadTrend(period, destRef) {
  try {
    const token = localStorage.getItem('jwtToken');
    const resp = await axios.get('http://localhost:8080/admin/analytics/posts-comments', { 
        params: { period }, 
        headers: {
            Authorization: `Bearer ${token}`,
        }, 
    })
    console.log(`analytics[${period}] =`, resp.data)
    const { labels, posts, comments } = resp.data
    destRef.value = { labels, datasets: [
      { label: 'Posts',    data: posts,    tension: 0.4 },
      { label: 'Comments', data: comments, tension: 0.4 }
    ] }
  } catch (err) {
    console.error(`loadTrend(${period}) failed:`, err)
    // you can choose to set destRef.value to an empty ChartData,
    // or leave it null and let the v-if show “Loading” (or “Error”)…
  }
}


onMounted(async () => {
  await Promise.all([
    loadTrend('week',  weekData),
    loadTrend('month', monthData),
    loadTrend('year',  yearData)
  ])

  const token = localStorage.getItem('jwtToken');
  const resp2 = await axios.get('http://localhost:8080/admin/analytics/user-activity', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const { postedPct, commentedPct, inactivePct } = resp2.data
  activityData.value = {
    labels: ['Posted', 'Commented Only', 'Inactive'],
    datasets: [{
      data: [postedPct, commentedPct, inactivePct],
      backgroundColor: [
        'rgba(75,192,192,0.6)',
        'rgba(153,102,255,0.6)',
        'rgba(255,159,64,0.6)'
      ]
    }]
  }
})
</script>

<style scoped>
.analytics {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.trend-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(280px,1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.chart-card, .radial-chart {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 1rem;
  height: 320px;
  position: relative;
}
.chart-card h2,
.radial-chart h2 {
  margin-top: 0;
}
.chart-card canvas,
.radial-chart canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
