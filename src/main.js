import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faComments, faUser } from '@fortawesome/free-solid-svg-icons';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'

library.add(faComments, faUser);

const app = createApp(App)

app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon);

Chart.register(ArcElement, Tooltip, Legend)

app.mount('#app')
