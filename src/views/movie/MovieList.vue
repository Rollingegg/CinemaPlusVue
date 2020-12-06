<template>
  <section class="movie-list-container">
    <div class="section-title">选择心上影片({{ movieList.length }})</div>
    <ul>
      <li v-for="(item,index) in movieList.slice((current-1)*pageSize,current*pageSize)" :key="index">
        <movie-card :movie-info="item"/>
      </li>
    </ul>
    <div class="pagination-container">
      <a-pagination v-model="current" hideOnsinglePage :pageSize="pageSize" :total="movieList.length"/>
    </div>
  </section>
</template>

<script>
import MovieCard from '@/components/MovieCard'
import { fetchMovies } from '@/api/movie'

const isEmpty = (object) => {
  return Object.is(object, undefined) || object === null || object.length === 0
}

export default {
  name: 'MovieList',
  data () {
    return {
      movieList: [],
      current: 1,
      pageSize: 10
    }
  },
  props: {
    query: {
      type: String
    },
    limit: {
      type: Number
    },
    type: {
      type: Number
    }
  },
  components: {
    MovieCard
  },
  async mounted () {
    const query = {
      query: this.query,
      limit: this.limit,
      type: this.type
    }
    if (isEmpty(query.limit)) {
      Reflect.deleteProperty(query, 'limit')
    }
    if (isEmpty(query.type)) {
      Reflect.deleteProperty(query, 'type')
    }
    if (isEmpty(query.query)) {
      Reflect.deleteProperty(query, 'query')
    }
    this.movieList = await fetchMovies(query)
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables";

.movie-list-container {

  .section-title {
    font-size: @section-title-font-size;
  }

  ul {
    list-style: none;
    padding-left: 0;

    li {
      padding: @base-interval 0;

      @media (max-width: 768px) {
        border-bottom: 1px solid @base-border-color;
        padding: 8px 0;
        &:last-child {
          border: none;
        }
      }
    }
  }

  .pagination-container{
    display: flex;
    justify-content: center;
  }
}
</style>
