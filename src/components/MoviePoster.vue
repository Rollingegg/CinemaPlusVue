<template>
  <div class="movie-poster-container">
    <router-link :to="`/movies/${movieId}`">
      <div class="movie-poster">
        <img v-lazy="moviePosterUrl" class="movie-img" :alt="movieName">
        <div class="movie-info">
          <div class="movie-title" :title="movieName">{{movieName}}</div>
          <div class="movie-rate">
            <i class="movie-rate-int">{{String(rate).substr(0,1)}}.</i>
            <i class="movie-rate-frac">{{String(rate).substr(2)||0}}</i>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'MoviePoster',
  props: {
    movieId: Number,
    movieName: String,
    moviePosterUrl: String,
    pubDate: Date,
    rate: Number
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables.less";
@import "~@/assets/style/utils";

.movie-poster-container{
  padding-top: @base-interval;
  .movie-poster{
    width: @movie-poster-width;
    height: @movie-poster-container-height;
    .movie-img{
      width: 100%;
      height: @movie-poster-height;
      transition-duration: 1s;
      border-radius: @img-radius;
      border: 1px solid @base-border-color;
      &:hover{
        transform: translateY(@img-hover-transform-y);
      }
    }
    .movie-info{
      line-height: calc(@movie-poster-container-height - @movie-poster-height);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .movie-title{
        font-size: @menu-item-font-size;
        .textOverflow()
      }
      .movie-rate{
        color: @movie-rate-color;
        i{
          font-style: italic;
        }
        &-int{
          font-size: @section-title-font-size;
        }
        &-frac{
          font-size: @menu-item-font-size;
        }
      }
    }
  }
}
img[lazy="loading"]{
  width: 200px;
  height: 200px;
}
</style>
