import axios from 'axios';

const API_KEY = '71acc26efbead5619b0cedf5439a015a';

async function createGuestSession() {
  const response = await axios.get(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`);
  const guestSessionId = response.data.guest_session_id;
  localStorage.setItem('guest_session_id', guestSessionId);
  return guestSessionId;
}

async function getGuestSessionId() {
  let guestSessionId = localStorage.getItem('guest_session_id');
  if (!guestSessionId) {
    guestSessionId = await createGuestSession();
  }
  return guestSessionId;
}

export default {
  getGenres() {
    return axios.get(`https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${API_KEY}`);
  },
  getPopularMovies(page = 1) { // Aggiunto il parametro `page` per ottenere più pagine
    return axios.get(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&api_key=${API_KEY}`);
  },
  getMoviesByGenre(genreId, page = 1) { // Aggiunto il parametro `page`
    return axios.get(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=${page}&api_key=${API_KEY}`);
  },
  searchMovies(query, page = 1) { // Aggiunto il parametro `page`
    return axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}&api_key=${API_KEY}`);
  },
  getMovieDetails(movieId) {
    return axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
  },
  async rateMovie(movieId, rating) {
    const sessionId = await getGuestSessionId();
    return axios.post(`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${sessionId}`, {
      value: rating
    });
  },
  async getRatedMovies() {
    const sessionId = await getGuestSessionId();
    return axios.get(`https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?api_key=${API_KEY}`);
  },
  getComments(movieId) {
    const comments = localStorage.getItem(`comments_${movieId}`);
    return comments ? JSON.parse(comments) : [];
  },
  addComment(movieId, comment) {
    const comments = this.getComments(movieId);
    comments.push(comment);
    localStorage.setItem(`comments_${movieId}`, JSON.stringify(comments));
  },
  createGuestSession,
  isAuthenticated() {
    return Boolean(localStorage.getItem('login'));
  },
  login(username) {
    localStorage.setItem('login', username);
  },
  logout() {
    localStorage.removeItem('login');
  },
  getUserName() {
    return localStorage.getItem('login');
  },
  // Aggiunta di un film ai preferiti
  addFavorite(movieId) {
    let favorites = this.getFavoriteMovies();
    if (!favorites.includes(movieId)) {
      favorites.push(movieId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  },

  // Rimozione di un film dai preferiti
  removeFavorite(movieId) {
    let favorites = this.getFavoriteMovies();
    favorites = favorites.filter(id => id !== movieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  },

  // Recupero dei film preferiti
  getFavoriteMovies() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }
};
