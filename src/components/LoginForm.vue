<template>
  <v-container>
    <v-form @submit.prevent="login">
      <v-text-field v-model="username" label="Username"></v-text-field>
      <v-text-field v-model="password" label="Password" type="password"></v-text-field>
      <v-btn type="submit" color="primary">Login</v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    login() {
      this.$emit('login', true);

      /*
      if (this.username === 'user' && this.password === 'password') {
        this.$emit('login', true);
      } else {
        alert('Invalid credentials');
      }
        */
    }
  }
};
</script>

<style scoped>
/* Your styles here */
</style>
