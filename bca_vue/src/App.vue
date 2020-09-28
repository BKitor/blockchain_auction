<template>
  <div>
    <button
      class="btn btn-primary btn-margin"
      @click="publicMessage()">
      Call Public
    </button>

    <button
      class="btn btn-primary btn-margin"
      @click="privateMessage()">
      Call Private
    </button>

    <br>
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000'

export default {
  name: 'app',
  data () {
    return {
      message: ''
    }
  },
  methods: {
    // this method calls the AuthService login() method
    publicMessage () {
      const url = `${API_URL}/api/public/`
      return axios.get(url).then((response) => {
        console.log(response.data)
        this.message = response.data || ''
      })
    },
    privateMessage () {
      const url = `${API_URL}/api/private/`
      return axios.get(url).then((response) => {
        console.log(response.data)
        this.message = response.data || ''
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
