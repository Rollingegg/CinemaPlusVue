<template>
  <div class="home">
    <a-row :gutter="32">
      <a-col :md="18">
        <section class="movies-overview-container">
          <div class="movies-overview-container-title">
            <div class="section-title">正在热映</div>
            <router-link to="/movies?type=1" class="section-link">查看全部<a-icon type="right" /></router-link>
          </div>
          <div :class="{'movies-list-container': !isMobile,'movies-list-container-mobile': isMobile}">
            <movie-poster v-for="(item, index) in moviesCurrent"
                          :key="index"
                          :movie-id="item.id"
                          :movie-name="item.title"
                          :movie-poster-url="item.url"
                          :pub-date="new Date(item.date)"/>
          </div>
        </section>
      </a-col>
      <a-col :md="6">
        <section class="movies-overview-container">
          <div class="movies-overview-container-title">
            <div class="section-title">今日票房</div>
          </div>
        </section>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import MoviePoster from '@/components/MoviePoster'
import { fetchMovies } from '@/api/movie'

export default {
  name: 'Home',
  components: {
    MoviePoster
  },
  data () {
    return {
      limit: 8,
      moviesCurrent: []
    }
  },
  computed: {
    isMobile () {
      return this.$store.state.device === 'mobile'
    }
  },
  async mounted () {
    this.moviesCurrent = await fetchMovies({
      type: 0,
      limit: this.limit
    })
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables";

.home {

  .movies-overview-container {
    padding-bottom: 60px;

    .movies-overview-container-title {
      padding-bottom: @base-interval;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .section-title {
        font-size: @section-title-font-size;
      }

      .section-link {
        font-size: @menu-item-font-size;
      }
    }

    .movies-list-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      &:after {
        content: '';
        // 因为一行刚好有4个，所以添加两倍的伪类长度，使得占满一行
        // 所以这里限定limit=8，使得刚好铺满
        width: @movie-poster-width;
      }
    }

    .movies-list-container-mobile {
      width: 100%;
      display: inline-flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      overflow-x: scroll;
      overflow-y: hidden;

      &::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
      }

      & > div {
        display: inline-block;
        margin-left: @mobile-interval;
      }

      & > div:first-child {
        margin-left: 0;
      }
    }
  }
}
</style>
