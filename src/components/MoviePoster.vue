<template>
  <div class="movie-poster-container">
    <router-link :to="`/movies/${movieId}`">
      <div class="movie-poster">
        <img v-lazy="moviePosterUrl" class="movie-img">
        <div class="movie-title" :title="movieName">{{movieName}}</div>
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
    pubDate: Date
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables.less";
.movie-poster-container{
  //padding-right: @base-interval;
  .movie-poster{
    width: @movie-poster-width;
    height: @movie-poster-container-height;
    .movie-img{
      width: 100%;
      height: @movie-poster-height;
      transition-duration: 1s;
      border-radius: @img-radius;
      &:hover{
        transform: translateY(@img-hover-transform-y);
      }
    }
    .movie-title{
      line-height: calc(@movie-poster-container-height - @movie-poster-height);
      font-size: @menu-item-font-size;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
img[lazy="loading"]{
  width: 200px;
  height: 200px;
}
</style>
