<template>
  <div>
    <h1>Login</h1>
    <input v-model="username" placeholder="Enter username">
    <button @click="login">Login</button>
  </div>
</template>

<script>
import dataService from '@/dataservice.ts';

export default {
  data() {
    return {
      username: ''
    };
  },
  methods: {
    async login() {
      dataService.login(this.username);
      await dataService.createGuestSession();
      this.$router.push('/movies');
    }
  }
};
</script>
