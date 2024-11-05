<template>
  <v-container>
    <v-row v-if="loading">
      <v-col cols="12">
        <v-skeleton-loader type="article"></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" v-if="movieDetail">
        <v-card-actions>
          <v-btn @click="goToMoviesList">Back to Movies List</v-btn>
        </v-card-actions>
        <v-card class="mx-auto" max-width="1200">
          <v-row>
            <v-col cols="12" md="6">
              <v-img :src="'https://image.tmdb.org/t/p/w500' + movieDetail.poster_path" class="full-height"></v-img>
            </v-col>
            <v-col cols="12" md="6">
              <v-card-title>{{ movieDetail.title }}</v-card-title>
              <v-card-subtitle>{{ movieDetail.release_date }}</v-card-subtitle>
              <v-card-text>
                <p>{{ movieDetail.overview }}</p>
                <p><strong>Genres:</strong> <span v-for="genre in movieDetail.genres" :key="genre.id">{{ genre.name }}</span></p>
                <p><strong>Runtime:</strong> {{ movieDetail.runtime }} minutes</p>
                <p><strong>Vote Average:</strong> {{ movieDetail.vote_average }}</p>
                <p><strong>Vote Count:</strong> {{ movieDetail.vote_count }}</p>
                <v-rating v-model="movieRating" @update:modelValue="rateMovie(movieDetail.id, $event)"></v-rating>
                <v-btn icon @click="toggleFavorite(movieDetail.id)">
                  <v-icon :color="isFavorite(movieDetail.id) ? 'red' : ''">mdi-heart</v-icon>
                </v-btn>
                <span v-if="isFavorite(movieDetail.id)">Favorite</span>
                <v-text-field
                  v-model="newComment"
                  label="Add a comment"
                  @keyup.enter="addComment"
                  class="mt-4"
                ></v-text-field>
                <v-btn @click="addComment">Submit</v-btn>
                <div v-for="(comment, index) in comments" :key="index" class="comment mt-3">
                  <v-card class="pa-3">
                    <p>{{ comment }}</p>
                  </v-card>
                </div>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" v-else>
        <v-alert type="error" v-if="errorData">{{ errorData.message }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dataService from '@/dataservice.ts';
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      movieDetail: null,
      movieRating: 0,
      loading: true,
      errorData: null,
      comments: [],
      newComment: ''
    };
  },
  computed: {
    ...mapGetters(['getRating', 'isFavorite']),
  },
  methods: {
    ...mapMutations(['SET_RATING', 'TOGGLE_FAVORITE']),
    async fetchMovieDetails(movieId) {
      this.loading = true;
      try {
        const response = await dataService.getMovieDetails(movieId);
        this.movieDetail = response.data;
        const ratedMoviesResponse = await dataService.getRatedMovies();
        const ratedMovies = ratedMoviesResponse.data.results;
        const ratedMovie = ratedMovies.find(movie => movie.id === Number(movieId));
        if (ratedMovie) {
          this.movieRating = ratedMovie.rating;
        }
        this.comments = dataService.getComments(movieId);
      } catch (error) {
        this.errorData = error.response ? error.response.data : error;
      } finally {
        this.loading = false;
      }
    },
    rateMovie(movieId, rating) {
      dataService.rateMovie(movieId, rating)
        .then(() => {
          this.SET_RATING({ movieId, rating });
          alert('Rating submitted successfully!');
        })
        .catch((error) => {
          console.error('Error submitting rating:', error);
        });
    },
    toggleFavorite(movieId) {
      this.TOGGLE_FAVORITE(movieId);
      // Sincronizza lo stato con localStorage
      const isNowFavorite = this.isFavorite(movieId);
      if (isNowFavorite) {
        dataService.addFavorite(movieId);
      } else {
        dataService.removeFavorite(movieId);
      }
    },
    goToMoviesList() {
      this.$router.push({ name: 'movies' });
    },
    addComment() {
      if (this.newComment.trim() === '') return;
      dataService.addComment(this.movieDetail.id, this.newComment);
      this.comments.push(this.newComment);
      this.newComment = '';
    }
  },
  mounted() {
    const movieId = this.$route.params.id;
    this.fetchMovieDetails(movieId);
  }
};
</script>

<style scoped>
.movie-card {
  cursor: pointer;
  transition: transform 0.2s;
}
.movie-card:hover {
  transform: scale(1.05);
}
.comment {
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
}
.full-height {
  height: 100%;
}
</style>
