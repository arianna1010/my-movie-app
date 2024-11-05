<template>
  <v-container fluid>
    <v-row v-if="loading">
      <v-col v-for="i in 12" :key="i" cols="12" sm="6" md="4" lg="2">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="movie in filteredMovies" :key="movie.id" cols="12" sm="6" md="4" lg="2">
        <v-card @click="goToMovieDetail(movie.id)">
          <v-img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" height="300"></v-img>
          <v-card-title>{{ movie.title }}</v-card-title>
          <v-card-subtitle>{{ movie.release_date }}</v-card-subtitle>
          <v-card-actions>
            <v-btn icon @click.stop="toggleFavorite(movie.id)">
              <v-icon :color="isFavorite(movie.id) ? 'red' : ''">mdi-heart</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DataService from '@/dataservice.ts';
import { mapGetters, mapMutations } from 'vuex';

export default {
  props: {
    movies: Array, // receive movies as prop from parent component
  },
  data() {
    return {
      allMovies: [],
      selectedGenre: null,
      searchQuery: '',
      favorites: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['isFavorite']),
    filteredMovies() {
      let filtered = this.movies;
      if (this.selectedGenre) {
        filtered = filtered.filter(movie => movie.genre_ids.includes(this.selectedGenre));
      }
      if (this.searchQuery) {
        filtered = filtered.filter(movie => movie.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
      }
      return filtered;
    },
  },
  methods: {
    ...mapMutations(['TOGGLE_FAVORITE']),
    fetchMovies() {
      this.loading = true;
      DataService.getPopularMovies()
        .then((response) => {
          this.allMovies = response.data.results;
          this.$emit('update-movies', this.allMovies);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    searchMovies() {
      if (this.searchQuery.length > 2) {
        this.loading = true;
        DataService.searchMovies(this.searchQuery)
          .then((response) => {
            this.$emit('update-movies', response.data.results);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.$emit('update-movies', this.allMovies);
      }
    },
    selectGenre(genreId) {
      this.selectedGenre = genreId;
    },
    goToMovieDetail(movieId) {
      this.$router.push({ name: 'movie-detail', params: { id: movieId } });
    },
    toggleFavorite(movieId) {
      if (this.isFavorite(movieId)) {
        DataService.removeFavorite(movieId);
      } else {
        DataService.addFavorite(movieId);
      }
      this.TOGGLE_FAVORITE(movieId);

      this.$emit('update-movies', this.filteredMovies);
    },
  },
  watch: {
    searchQuery() {
      this.searchMovies();
    }
  },
  created() {
    this.fetchMovies();
    
  },
};
</script>
