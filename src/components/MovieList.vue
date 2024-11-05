<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="movie in filteredMovies" :key="movie.id" cols="12" md="4">
        <v-card>
          <v-img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"></v-img>
          <v-card-title>{{ movie.title }}</v-card-title>
          <v-card-subtitle>{{ movie.release_date }}</v-card-subtitle>
          <v-card-text>{{ movie.overview }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    selectedGenre: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      movies: [],
      allMovies: [], // Store all movies initially fetched
    };
  },
  watch: {
    selectedGenre(newGenre) {
      this.filterMovies(newGenre);
    },
  },
  created() {
    this.fetchMovies();
  },
  computed: {
    filteredMovies() {
      if (this.selectedGenre) {
        return this.movies;
      }
      return this.allMovies;
    },
  },
  methods: {
    fetchMovies() {
      axios
        .get(
          'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=71acc26efbead5619b0cedf5439a015a'
        )
        .then((response) => {
          this.allMovies = response.data.results;
          this.movies = response.data.results;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    filterMovies(genre) {
      if (genre) {
        this.movies = this.allMovies.filter((movie) =>
          movie.genre_ids.includes(genre)
        );
      } else {
        this.movies = this.allMovies;
      }
    },
  },
};
</script>

<style scoped>
/* Your styles here */
</style>
