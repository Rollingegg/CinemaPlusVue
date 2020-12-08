<template>
  <div>
    <h1>电影详情hhh</h1>
    <h1>{{ movieInfo.title }}</h1>
  </div>
</template>

<script>
import pageTitle from '@/directive/page-title'
// import request from '@/utils/request'
import { fetchMovies } from '@/api/movie'

export default {
  name: 'MovieDetail',
  data () {
    return {
      movieInfo: {}
    }
  },
  directives: {
    pageTitle
  },
  async mounted () {
    // request.get('http://localhost:5200/movie/search', { ids: [1, 2] })
    this.movieInfo = await fetchMovies()
    this.movieInfo = this.movieInfo[0]
  }
}
</script>

<style scoped>

</style>
