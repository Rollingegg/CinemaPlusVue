<template>
  <div class="home">
    <a-row :gutter="32">
      <a-col :md="18">
        <section class="movies-overview-container">
          <div class="movies-overview-container-title">
            <div class="section-title">正在热映</div>
            <router-link to="/movies?type=1" class="section-link">查看全部
              <a-icon type="right"/>
            </router-link>
          </div>
          <ul :class="{'movies-list-container': !isMobile,'movies-list-container-mobile': isMobile}">
            <li v-for="(item, index) in moviesCurrent" :key="index">
              <movie-poster :movie-id="item.id"
                            :movie-name="item.title"
                            :movie-poster-url="item.url"
                            :rate="Number(item.rate)"
                            :pub-date="new Date(item.date)"/>
            </li>
          </ul>
        </section>
      </a-col>
      <a-col :md="6">
        <section class="movies-overview-container">
          <div class="movies-overview-container-title">
            <div class="section-title">今日票房</div>
          </div>
          <a-list :data-source="rankList.slice(1)" class="movies-rank-container">
            <router-link :to="`/movies/${rankList[0].id}`" slot="header" class="rank-first">
              <img :src="rankList[0].url" alt="movie-poster" class="rank-first-movie"/>
              <div class="rank-first-info">
                <h3>{{ rankList[0].title }}</h3>
                <a-statistic :value="rankList[0].likes" :value-style="{color: '#0063B1'}"></a-statistic>
              </div>
            </router-link>
            <a-list-item slot="renderItem" slot-scope="item,index" class="rank-item">
              <router-link :to="`/movies/${item.id}`" class="rank-item-normal">
                <div class="movie-rank-title">
                  <i :style="{color: getRankColor(index),fontSize: '24px',marginRight: '20px'}">{{ index + 2 }}</i>{{ item.title }}</div>
                <a-statistic :value="item.likes" :value-style="{color: '#0063B1'}"></a-statistic>
              </router-link>
              <a-skeleton :loading="loading" active/>
            </a-list-item>
          </a-list>
        </section>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import MoviePoster from '@/components/MoviePoster'
import { fetchMovieRank, fetchMovies } from '@/api/movie'

export default {
  name: 'Home',
  components: {
    MoviePoster
  },
  data () {
    return {
      limit: 8,
      moviesCurrent: [],
      rankList: [],
      loading: true
    }
  },
  computed: {
    isMobile () {
      return this.$store.state.device === 'mobile'
    }
  },
  async mounted () {
    this.loading = true
    this.moviesCurrent = await fetchMovies({
      type: 0,
      limit: this.limit
    })
    this.rankList = await fetchMovieRank({
      limit: 5
    })
    this.loading = false
  },
  methods: {
    getRankColor (index) {
      const colorDict = ['#f5222d', '#f5222d', '#999999', '#999999']
      return colorDict[index]
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables";
@import "~@/assets/style/utils";

.home {

  .movies-overview-container {
    padding-bottom: 60px;

    .movies-overview-container-title {
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

    ul{
      list-style: none;
      padding-left: 0;
    }
    .movies-list-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      //&:after {
      //  content: '';
      //  // 因为一行刚好有4个，所以添加两倍的伪类长度，使得占满一行
      //  // 所以这里限定limit=8，使得刚好铺满
      //  width: @movie-poster-width;
      //}
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

      & > li {
        display: inline-block;
        margin-left: @mobile-interval;
      }

      & > li:first-child {
        margin-left: 0;
      }
    }

    .movies-rank-container{
      .rank-item{
        &:hover{
          background-color: @hover-background-color;
        }
        &-normal{
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .movie-rank-title{
            font-size: @base-interval;
            padding-right: @base-interval;
            color: @menu-item-font-color;
            .textOverflow()
          }
        }
      }
      .rank-first{
        height: @movie-rank-first-height;
        display: flex;
        align-items: center;
        // 为了对齐：20px - 12px(ant-list-header:padding-top)
        margin: 8px 0 -12px 0;
        &:hover{
          background-color: @hover-background-color;
        }
        &-movie{
          height: 100%;
          width: @movie-rank-first-width;
        }
        &-info{
          padding-left: @base-interval;
          display: flex;
          flex-direction: column;
          h3{
            font-size: @movie-title-font-size;
          }
        }
      }
    }
  }
}
</style>
