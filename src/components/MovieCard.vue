<template>
  <div class="movie-card" @click="jump2movie">
    <div class="movie-card-poster-wrapper">
      <img v-lazy="movieInfo.posterUrl" :alt="movieInfo.name"/>
    </div>
    <div class="movie-card-info">
      <div class="movie-card-info-title">
        <div>
          <div class="movie-title">{{ movieInfo.name }}</div>
          <div v-if="!isMobile">
            <a-tag v-if="movieInfo.status===0" color="#f5222d">热映中</a-tag>
<!--            <a-tag v-else-if="movieInfo.status===1" color="#0063B1">将上映</a-tag>-->
            <a-tag v-else color="rgba(0, 0, 0, 0.25)">已下架</a-tag>
          </div>
        </div>
        <div v-if="!isMobile">
<!--          <a-icon class="movie-like-icon" type="heart" />-->
          <div><i>{{ movieInfo.likeCount || 0 }}</i>人想看</div>
        </div>
      </div>
      <div class="movie-card-info-description" v-if="!isMobile">
        {{ movieInfo.description }}
      </div>
      <div class="movie-card-info-item">时长：<span>{{ movieInfo.length }}分钟</span></div>
      <div class="movie-card-info-item" v-if="!isMobile">导演：<span>{{ movieInfo.director }}</span></div>
      <div class="movie-card-info-item">主演：<span>{{ movieInfo.starring }}</span></div>
      <div class="movie-card-info-item">上映日期：<span>{{ movieInfo.startDate | dateformat('YYYY-MM-DD')}}</span></div>
    </div>
    <div class="movie-card-button" v-if="!isDownStairs">
      <router-link :to="`/movies/${movieInfo.id}`">
        <a-button shape="round"
                  :type="isPlaying?'danger':'primary'"
                  :size="isMobile?'default':'large'">
          {{ isPlaying ? '购票':'预售' }}
        </a-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  computed: {
    isMobile () {
      return this.$store.state.device === 'mobile'
    },
    isDownStairs () {
      return this.movieInfo.status === 1
    },
    isPlaying () {
      return this.movieInfo.status === 0
    }
  },
  props: {
    movieInfo: Object
  },
  methods: {
    jump2movie () {
      if (this.isMobile) {
        this.$router.push(`/movies/${this.movieInfo.id}`)
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables";
@import "~@/assets/style/utils";

.movie-card {
  display: flex;
  border-radius: @base-interval;
  border: 1px solid @base-border-color;
  align-items: center;
  @media (max-width: @mobile-screen-width) {
    border-radius: 0;
    border: none;
  }

  &:hover {
    border-color: rgba(0, 0, 0, .09);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .09);
  }

  &-poster-wrapper {
    height: @movie-poster-height;
    width: @movie-poster-width;
    flex-shrink: 0;

    @media (max-width: @mobile-screen-width) {
      height: @movie-poster-height-mobile;
      width: @movie-poster-width-mobile;
    }

    img {
      border-radius: @base-interval 0 0 @base-interval;
      height: 100%;
      width: 100%;

      @media (max-width: @mobile-screen-width) {
        border-radius: 0;
      }
    }
  }

  &-info {
    padding: 0 @base-interval;
    color: @text-color;
    overflow: hidden;

    @media (max-width: @mobile-screen-width) {
      // 调试出来的……
      padding: 0 8px;
      flex-basis: 200px;
    }

    &-title {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding-bottom: @base-interval;
      @media (max-width: @mobile-screen-width) {
        padding-bottom: 0;
      }

      div:first-child {
        display: flex;
        align-items: center;

        .movie-title {
          color: @heading-color;
          font-size: @movie-title-font-size;
          @media (max-width: @mobile-screen-width) {
            font-size: @movie-title-font-size-mobile;
            font-weight: 500;
          }
          .textOverflow()
        }
      }

      div:nth-child(2) {
        display: flex;
        align-items: center;
        font-size: @base-interval;

        .movie-like-icon {
          color: @movie-rate-color;
        }

        div {
          i {
            color: @primary-color;
          }
        }
      }
    }

    &-description {
      color: @text-color-secondary;
      font-size: @movie-description-font-size;
      @media (max-width: @mobile-screen-width) {
        font-size: @base-font-size;
      }
      .textOverflowMulti()
    }

    &-item {
      padding-top: calc(@base-interval / 2);
      white-space: nowrap;
      overflow: hidden;
      font-size: @movie-info-item-font-size;
      @media (max-width: @mobile-screen-width) {
        padding-top: 2px;
        font-size: @base-font-size;
      }

      span {
        color: @text-color-secondary;
      }

      .textOverflow()
    }
  }

  &-button {
    padding-right: @base-interval;
    @media (max-width: @mobile-screen-width) {
      padding-right: 0;
    }
  }
}
</style>
