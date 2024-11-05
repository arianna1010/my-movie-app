import { createStore } from 'vuex';

export default createStore({
  state: {
    ratings: {},
    favorites: JSON.parse(localStorage.getItem('favorites')) || [], // Carica i preferiti da localStorage
    selectedGenre: null, // Mantiene il genere selezionato
  },
  getters: {
    getRating: (state) => (movieId) => {
      return state.ratings[movieId] || 0;
    },
    isFavorite: (state) => (movieId) => {
      return state.favorites.includes(movieId);
    },
    getSelectedGenre: (state) => {
      return state.selectedGenre;
    },
  },
  mutations: {
    SET_RATING(state, { movieId, rating }) {
      state.ratings = { ...state.ratings, [movieId]: rating };
    },
    TOGGLE_FAVORITE(state, movieId) {
      if (state.favorites.includes(movieId)) {
        state.favorites = state.favorites.filter(id => id !== movieId);
      } else {
        state.favorites.push(movieId);
      }
      localStorage.setItem('favorites', JSON.stringify(state.favorites)); // Aggiorna il localStorage
    },
    SET_SELECTED_GENRE(state, genreId) {
      state.selectedGenre = genreId;
    },
  },
  actions: {
    updateSelectedGenre({ commit }, genreId) {
      commit('SET_SELECTED_GENRE', genreId);
    },
  },
});
