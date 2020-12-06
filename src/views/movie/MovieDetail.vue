<template>
  <div v-page-title :data-title="movieInfo.title">
    <h1>{{movieInfo.title}}</h1>
  </div>
</template>

<script>
import pageTitle from '@/directive/page-title'
import { fetchMovies } from '@/api/movie'
export default {
  name: 'MovieDetail',
  data () {
    return {
      movieInfo: {
      }
    }
  },
  directives: {
    pageTitle
  },
  async created () {
    this.movieInfo = await fetchMovies([1, 2])
    this.movieInfo = this.movieInfo[0]
  }
}
</script>

<style scoped>

</style>
