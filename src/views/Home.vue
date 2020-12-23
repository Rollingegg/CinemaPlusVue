<template>
  <a-spin class="home" :spinning="loading" size="large">
    <div class="banner" role="banner" v-show="!isVip">
      <a-carousel :autoplay="true" arrows>
        <div
          slot="prevArrow"
          class="custom-slick-arrow"
          style="left: 10px;zIndex: 1"
        >
          <a-icon type="left-circle"/>
        </div>
        <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
          <a-icon type="right-circle"/>
        </div>
        <router-link to="/user/coupons" v-for="(item, index) in vipInfoList" :key="index">
          <h1>会员卡购买：{{item.type}}</h1>
        </router-link>
      </a-carousel>
    </div>
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
                            :movie-name="item.name"
                            :movie-poster-url="item.posterUrl"
                            :rate="parseFloat(((Math.random() * 39 + 60) / 10).toFixed(1))"
                            :pub-date="new Date(item.startDate)"/>
            </li>
          </ul>
        </section>
      </a-col>
      <a-col :md="6">
        <section class="movies-overview-container">
          <div class="movies-overview-container-title">
            <div class="section-title">今日票房</div>
          </div>
          <a-list v-if="!loading" :data-source="rankList.slice(1)" class="movies-rank-container">
            <router-link :to="`/movies/${rankList[0].id}`" slot="header" class="rank-first">
              <i class="rank-first-icon"></i>
              <img :src="rankList[0].posterUrl" alt="movie-poster" class="rank-first-movie"/>
              <div class="rank-first-info">
                <h3>{{ rankList[0].name }}</h3>
                <a-statistic :value="rankList[0].likeCount" :value-style="{color: '#0063B1'}"></a-statistic>
              </div>
            </router-link>
            <a-list-item slot="renderItem" slot-scope="item,index" class="rank-item">
              <router-link :to="`/movies/${item.id}`" class="rank-item-normal">
                <div class="movie-rank-title">
                  <i :style="{color: getRankColor(index),fontSize: '24px',marginRight: '20px'}">{{
                      index + 2
                    }}</i>{{ item.name }}
                </div>
                <a-statistic :value="item.likeCount" :value-style="{color: '#0063B1'}"></a-statistic>
              </router-link>
              <a-skeleton :loading="loading" active/>
            </a-list-item>
          </a-list>
        </section>
      </a-col>
    </a-row>
  </a-spin>
</template>

<script>
import MoviePoster from '@/components/MoviePoster'
import { fetchMovieRank, fetchMovies } from '@/api/movie'
import { mapState } from 'vuex'

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
    ...mapState({
      vipInfoList: state => state.user.vipCardInfoList,
      isVip: state => state.user.isVip
    }),
    isMobile () {
      return this.$store.state.device === 'mobile'
    }
  },
  async mounted () {
    this.loading = true
    // 多个promise并行请求：使用Promise.all并行请求
    const [moviesCurrent, rankList] = await Promise.all(
      [fetchMovies({
        type: 0
      }),
      fetchMovieRank({
        limit: 5
      })])
    this.moviesCurrent = moviesCurrent.slice(0, 8)
    this.rankList = rankList.slice(0, 5)
    const likes = [313, 287, 165, 156, 99]
    for (let i = 0; i < this.rankList.length; i++) {
      this.rankList[i].likeCount = likes[i]
    }
    this.loading = false
  },
  methods: {
    onChange (a, b, c) {
      console.log(a, b, c)
    },
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
  .banner {
    margin-bottom: @base-interval;
    /deep/ .slick-slide {
      text-align: center;
      height: 160px;
      line-height: 160px;
      background: #364d79;
      overflow: hidden;
      @media (max-width: @mobile-screen-width) {
        height: 80px;
        line-height: 80px;
      }
    }

    /deep/ .custom-slick-arrow {
      width: 30px;
      height: 30px;
      font-size: 25px;
      color: #fff;
      background-color: rgba(31, 45, 61, 0.11);
      opacity: 0.3;
    }

    /deep/ .custom-slick-arrow:before {
      display: none;
    }

    /deep/ .custom-slick-arrow:hover {
      opacity: 0.5;
    }

    /deep/ .slick-slide h1 {
      color: #fff;
    }

    /deep/ .slick-slide p {
      color: #fff;
    }
  }

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

    ul {
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

    .movies-rank-container {
      .rank-item {
        &:hover {
          background-color: @hover-background-color;
        }

        &-normal {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .movie-rank-title {
            font-size: @base-interval;
            padding-right: @base-interval;
            color: @menu-item-font-color;
            .textOverflow()
          }
        }
      }

      .rank-first {
        height: @movie-rank-first-height;
        display: flex;
        align-items: center;
        // 为了对齐：20px - 12px(ant-list-header:padding-top)
        margin: 8px 0 -12px 0;

        &:hover {
          background-color: @hover-background-color;
        }

        &-icon {
          display: inline-block;
          position: absolute;
          left: 0;
          // 对齐上部
          top: @base-interval;
          width: 22px;
          height: 25px;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAaCAYAAACzdqxAAAAABmJLR0QA/wD/AP+gvaeTAAAC4ElEQVRIx92VTYscVRSGn1P39qS6E7vbEZ1ROjMxaTMoImHETIQoRHAjbrIw4HYWwa2/wJ+QVUAkiDshwiyMDEgkYVT8jE0WYcJAhCQ9JKOmp6e/UlXdde/JotXY89GtkSz0QEFRdc9zTr3vPXWl/toR5SFE8DCg/02w3fxAvUeNQa0FZES6ImmKOIcEwc5g9R7dd4DsW29jpqaRbHY4NopwN28QffIxXP95AH7/ThUNQ3LzJ8E5kqWL2NIUmQPPbHvZ0hTJ0kVwjtz8STQMQXUbMECYw0xMEp9bwK/dAhkihQh+7RbxuQXMxCSEuSHmpT200yGYfApNEvB+Z7D3aJL013Y6kPZ2AIsg7RbJ0gXC4ycw+8tor7uzvr0uZn+Z8PgJkqULSLs18IUD5okIvcVP0W5CZvYwrlolODgDdtPmSVNctYotHyQ5v0j6xecEm2STLSOtincOtRmkUCQ7/w7ZN96EPxz3nmjxM6IP30cbG0jaIzBmix9bB0SEwFoMSlC/Q3TmNEnl0p+vk8olojOnCep3+mus3dbk4ZMXGKReI144i8YxGsfEC2eReg0CMzTVMiLEWNzKMn69BoBbWSYwI9NGg/Eebbdwa7f7FrRb/W1o/kXHCuj009jyDEGh2E84egx3bQVZvTn0TzK8YxEkl0OjDp2PPugXcw7J5fqGqT4YWFTRq1dQ1fsM+b3gCJ3/lnkPEv+DE+SvoeBT1Wbi9EbTpZcB8sYe2mVk2orkZUhjW8BONeqq/tJx/sp6r1dZjbs//NRsL39db/4KcPTR/BMv5vc8VwrHDo9nMrO7TfD8mMiEERk4bqR2bC5JlUbk/bVGmlZ+66Y/Xu3cvVxptqvnaxsbpXCX/26jOVD8SDHPapwErz9WLM7m9+x9dnfu0ONj9qWCtbPZIChboSDfzL3wXjXufv9to7Xy1Xrz9qvjhfjU9dV/pOe7+0p8ud4IXxnPP/ly4ZGZveHY3D3KzjdbTNAgKwAAAABJRU5ErkJggg==) no-repeat;
          background-size: contain;
        }

        &-movie {
          height: 100%;
          width: @movie-rank-first-width;
        }

        &-info {
          padding-left: @base-interval;
          display: flex;
          flex-direction: column;

          h3 {
            font-size: @movie-title-font-size;
          }
        }
      }
    }
  }
}
</style>
