<template>
  <v-app>
    <v-navigation-drawer v-if="isAuthenticated" v-model="drawer" app>
      <v-list dense>
        <v-list-item @click="selectGenre('favorites')">
          <v-list-item-content>
            <v-list-item-title class="title">Preferiti</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="genre in genres" :key="genre.id" @click="selectGenre(genre.id)">
          <v-list-item-content>
            <v-list-item-title>{{ genre.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="isAuthenticated" app color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title @click="goHome">Home</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="searchQuery"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Cerca"
      ></v-text-field>
      <v-btn @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <router-view v-if="isAuthenticated" :movies="filteredMovies" @update-movies="updateMovies" />
      <v-container v-else class="d-flex justify-center align-center login-container">
        <v-card class="pa-4 login-card">
          <v-card-title class="text-h5">Login</v-card-title>
          <LoginForm @login="handleLogin" />
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';
import DataService from './dataservice.ts';

export default {
  components: {
    LoginForm
  },
  data() {
    return {
      drawer: false,
      genres: [],
      movies: [],
      allMovies: [], // Lista globale di tutti i film
      selectedGenre: null,
      isAuthenticated: DataService.isAuthenticated(),
      searchQuery: '',
      loading: false, // Indica se i film stanno caricando
    };
  },
  watch: {
    searchQuery() {
      this.allMovies = []; // Resetta i film caricati
      this.searchMovies(this.searchQuery); // Esegui la ricerca paginata
    }
  },
  computed: {
    filteredMovies() {
      let filtered = this.allMovies;

      // Se esiste una query di ricerca, applica il filtro su tutti i film globali
      if (this.searchQuery) {
        return filtered.filter(movie => movie.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
      }

      // Filtra solo i preferiti
      if (this.selectedGenre === 'favorites') {
        filtered = filtered.filter(movie => DataService.getFavoriteMovies().includes(movie.id));
      } else if (this.selectedGenre) {
        filtered = filtered.filter(movie => movie.genre_ids.includes(this.selectedGenre));
      }

      return filtered;
    },
  },
  methods: {
    handleLogin(isAuthenticated) {
      if (isAuthenticated) {
        this.isAuthenticated = true;
        DataService.login(true);
        this.fetchGenres();
        this.fetchMovies(); // Carica i film popolari inizialmente
        this.$router.push({ name: 'movies' });
      }
    },
    fetchGenres() {
      DataService.getGenres()
        .then((response) => {
          this.genres = response.data.genres;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchMovies(page = 1) {
      this.loading = true;
      try {
        const response = await DataService.getPopularMovies(page);
        this.allMovies = [...this.allMovies, ...response.data.results]; // Aggiunge i risultati della pagina
        this.updateMovies();
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async searchMovies(query, page = 1) {
      this.loading = true;
      try {
        const response = await DataService.searchMovies(query, page);
        if (page === 1) {
          this.allMovies = response.data.results;
        } else {
          this.allMovies = [...this.allMovies, ...response.data.results];
        }
        this.updateMovies();
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    updateMovies() {
      this.movies = this.filteredMovies;
    },
    handleUpdateMovies(movies) {
      this.movies = movies; // Aggiorna la lista dei film
    },
    selectGenre(genreId) {
      this.selectedGenre = genreId;
      this.searchQuery = ''; // Resetta la query di ricerca quando si seleziona un genere
      this.allMovies = []; // Resetta i film caricati
      this.fetchMovies(); // Carica i film per il genere selezionato

      // Naviga alla vista dei film
      this.$router.push({ name: 'movies' });
    },
    goHome() {
      // Reimposta il genere selezionato e mostra i film popolari
      this.selectedGenre = null;
      this.searchQuery = ''; // Resetta la query di ricerca
      this.allMovies = []; // Resetta i film caricati
      this.fetchMovies(); // Carica i film popolari

      // Naviga alla vista dei film
      this.$router.push({ name: 'movies' });
    },
    goToMovieDetail(movieId) {
      this.$router.push({ name: 'movie-detail', params: { id: movieId } });
    },
    logout() {
      this.isAuthenticated = false;
      DataService.logout();
      this.$router.push({ name: "login" });
    },
  },
  mounted() {
    this.isAuthenticated = DataService.isAuthenticated();
    if (this.isAuthenticated) {
      this.fetchGenres();
      this.fetchMovies(); // Carica i film popolari all'avvio
    }
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
</style>