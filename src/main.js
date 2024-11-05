// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import MoviesView from './views/MoviesView.vue';
import MovieDetailView from './views/MovieDetailView.vue';
import LoginView from './views/LoginView.vue';
import DataService from './dataservice.ts';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import '@mdi/font/css/materialdesignicons.css';

// Importa lo store Vuex
import store from './store/store';

const routes = [
  { path: '/', component: LoginView, name: 'login' },
  { path: '/movies', component: MoviesView, name: 'movies' },
  { path: '/movie/:id', component: MovieDetailView, name: 'movie-detail', props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  if (!DataService.isAuthenticated() && to.name !== 'login') {
    return { name: 'login' };
  }
  if (DataService.isAuthenticated() && to.name === 'login') {
    return { name: 'movies' };
  }
});

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(store).use(vuetify).use(router).mount('#app');
