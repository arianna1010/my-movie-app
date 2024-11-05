import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import MoviesView from '@/views/MoviesView.vue';
import MovieDetailView from '@/views/MovieDetailView.vue';

let isAuthenticated = false; // Variabile di stato globale per esempio

const routes = [
  { path: '/', component: LoginView, name: 'login' },
  { path: '/movies', component: MoviesView, name: 'movies' },
  { path: '/movie/:id', component: MovieDetailView, name: 'movie-detail', props: true },
  { path: '/favorites', component: FavoritesView, name: 'favorites' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (!isAuthenticated && to.name !== 'login') {
    next({ name: 'login' });
  } else if (isAuthenticated && to.name === 'login') {
    next({ name: 'movies' });
  } else {
    next();
  }
});

export function setAuth(authenticated) {
  isAuthenticated = authenticated;
}

export default router;
