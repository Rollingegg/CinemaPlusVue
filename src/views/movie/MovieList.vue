<template>
  <section class="movie-list-container">
    <div class="section-title">选择心上影片({{ movieList.length }})</div>
    <a-skeleton :loading="loading" active>
      <ul>
        <li v-for="(item,index) in movieList.slice((current-1)*pageSize,current*pageSize)" :key="index">
          <movie-card :movie-info="item"/>
        </li>
      </ul>
    </a-skeleton>
    <div class="pagination-container">
      <a-pagination v-model="current" hideOnsinglePage :pageSize="pageSize" :total="movieList.length"/>
    </div>
  </section>
</template>

<script>
import MovieCard from '@/components/MovieCard'
import { fetchMovies } from '@/api/movie'

const isEmpty = (object) => {
  return Object.is(object, undefined) || object === null || (object.length === 0 && object !== '')
}

export default {
  name: 'MovieList',
  data () {
    return {
      movieList: [],
      current: 1,
      pageSize: 10,
      loading: true
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
  watch: {
    $route: {
      handler (route) {
        if (route.query) {
          this.fetchAllMovies()
        }
      },
      immediate: true
    }
  },
  async mounted () {
    await this.fetchAllMovies()
  },
  methods: {
    async fetchAllMovies () {
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
      this.loading = true
      try {
        this.movieList = await fetchMovies(query)
        if (this.movieList === null || this.movieList.length === 0) {
          this.$message.error('获取电影列表失败，请检查网络连接')
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
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

  .pagination-container {
    display: flex;
    justify-content: center;
  }
}
</style>
