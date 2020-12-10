<template>
  <div class="movie-card">
    <div class="movie-card-poster-wrapper">
      <img v-lazy="movieInfo.url" :alt="movieInfo.title"/>
    </div>
    <div class="movie-card-info">
      <div class="movie-card-info-title">
        <div>
          <div class="movie-title">{{ movieInfo.title }}</div>
          <div v-if="!isMobile">
            <a-tag v-if="movieInfo.status===1" color="#f5222d">热映中</a-tag>
            <a-tag v-else-if="movieInfo.status===2" color="#0063B1">将上映</a-tag>
            <a-tag v-else color="rgba(0, 0, 0, 0.25)">已下架</a-tag>
          </div>
        </div>
        <div v-if="!isMobile">
          <a-icon class="movie-like-icon" type="heart"/>
          <div><i>{{ movieInfo.likes }}</i>人想看</div>
        </div>
      </div>
      <div class="movie-card-info-description" v-if="!isMobile">
        {{ movieInfo.description }}
      </div>
      <div class="movie-card-info-item">类型：<span>{{ movieInfo.category }}</span></div>
      <div class="movie-card-info-item" v-if="!isMobile">导演：<span>{{ movieInfo.directors }}</span></div>
      <div class="movie-card-info-item">主演：<span>{{ movieInfo.actors }}</span></div>
      <div class="movie-card-info-item">上映日期：<span>{{ movieInfo.date }}</span></div>
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
      return this.movieInfo.status === 0
    },
    isPlaying () {
      return this.movieInfo.status === 1
    }
  },
  props: {
    movieInfo: {
      type: Object,
      required: false,
      default () {
        return {
          id: 1,
          url: 'http://n.sinaimg.cn/translate/640/w600h840/20190312/ampL-hufnxfm4278816.jpg',
          title: '夏目友人帐',
          description: '在人与妖怪之间过着忙碌日子的夏目，偶然与以前的同学结城重逢，由此回忆起了被妖怪缠身的苦涩记忆。此时，夏目认识了在归还名字的妖怪记忆中出现的女性·津村容莉枝。和玲子相识的她，现在和独子椋雄一同过着平稳的生活。夏目通过与他们的交流，心境也变得平和。但这对母子居住的城镇，却似乎潜伏着神秘的妖怪。在调查此事归来后，寄生于猫咪老师身体的“妖之种”，在藤原家的',
          category: '动画',
          actors: '神谷浩史 /井上和彦 /高良健吾 /小林沙苗 /泽城美雪',
          date: '2020-10-24',
          likes: 313,
          status: 1
        }
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
