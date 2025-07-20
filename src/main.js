import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faComments, faUser } from '@fortawesome/free-solid-svg-icons';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import store from './store';

library.add(faComments, faUser);

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App)
store.dispatch('initializeAuth');
store.dispatch('fetchUsers');



app.use(router)
app.use(store);
app.use(vuetify);

app.component('font-awesome-icon', FontAwesomeIcon);

Chart.register(ArcElement, Tooltip, Legend)

app.mount('#app')
