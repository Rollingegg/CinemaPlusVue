<template>
  <section v-page-title data-title="电影详情">
    <a-breadcrumb>
      <a-breadcrumb-item>
        <router-link to="/movies">电影</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ movieInfo.title }}</a-breadcrumb-item>
    </a-breadcrumb>
      <div class="movie-info-container">
        <img v-lazy="movieInfo.url" :alt="movieInfo.title"/>
        <a-skeleton :loading="loading" active>
          <div class="movie-info-base">
            <h1>{{ movieInfo.title }}</h1>
            <ul>
              <li>上映日期：<span>{{ movieInfo.date | dateformat('YYYY-MM-DD')}}</span></li>
              <li>时长：<span>{{ movieInfo.len }}分钟</span></li>
              <li>类型：<span>{{ movieInfo.category }}</span></li>
              <li>地区：<span>{{ movieInfo.date }}</span></li>
              <li>语言：<span>{{ movieInfo.lang }}</span></li>
              <li>导演：<span>{{ movieInfo.directors }}</span></li>
              <li>主演：<span>{{ movieInfo.actors }}</span></li>
            </ul>
            <a-space>
              <a-button icon="heart" type="primary" block>想看</a-button>
              <a-button icon="star" block>看过</a-button>
            </a-space>
          </div>
        </a-skeleton>
      </div>
    <div class="movie-des-container">
      <div>
        <span>简介</span>
        <a-button type="link" @click="textCollapse=!textCollapse">
          {{ textCollapse ? '展开':'收起' }}
          <a-icon :type="textCollapse?'down':'up'"/>
        </a-button>
      </div>
      <p :class="{'textCollapse':textCollapse}">{{ movieInfo.description }}</p>
    </div>
    <div class="movie-schedule-container">
      <a-radio-group size="large" :default-value="0" button-style="solid" v-model="dateIndex">
        <a-radio-button v-for="(item,index) in scheduleData" :key="index" :value="index">
          {{ item.date | dateformat('MM月DD日')}}
        </a-radio-button>
      </a-radio-group>
      <a-table :data-source="scheduleData.length>0?scheduleData[dateIndex].scheduleItemList:[]" :pagination="false" :scroll="isMobile?{ x: 420 }:undefined">
        <a-table-column key="startTime" title="放映开始时间" data-index="startTime" :custom-render="renderPlayTime"/>
        <a-table-column key="endTime" title="放映结束时间" data-index="endTime" :custom-render="renderPlayTime"/>
        <a-table-column key="hallName" title="放映厅" data-index="hallName">
          <template slot-scope="hallName">
            <a-tag color="green">{{hallName}}</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="fare" title="票价(元)" data-index="fare" :width="isMobile?100:'auto'">
          <template slot-scope="fare">
            <a-statistic :precision="2" :value="fare"/>
          </template>
        </a-table-column>
        <a-table-column key="buy" title="选座购票" fixed="right" :width="isMobile?100:'auto'">
          <template slot-scope="text,record">
            <a-button type="danger" @click="buyMovie(record.id)">立即购买</a-button>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </section>
</template>

<script>
import pageTitle from '@/directive/page-title'
import { fetchMovies, fetchScheduleDataByMovieId } from '@/api/movie'

export default {
  name: 'MovieDetail',
  data () {
    return {
      movieInfo: {},
      scheduleData: [],
      textCollapse: true,
      loading: true,
      dateIndex: 0
    }
  },
  computed: {
    isMobile () {
      return this.$store.state.device === 'mobile'
    }
  },
  props: {
    id: {
      type: Number
    }
  },
  directives: {
    pageTitle
  },
  async mounted () {
    this.loading = true
    this.movieInfo = await fetchMovies()
    this.movieInfo = this.movieInfo[0]
    this.loading = false
    this.scheduleData = await fetchScheduleDataByMovieId(this.id)
    console.log(this.scheduleData)
  },
  methods: {
    buyMovie (scheduleId) {
      this.$router.push({
        name: 'movieBuy',
        query: {
          id: this.id,
          scheduleId: scheduleId
        },
        params: {
          title: this.movieInfo.title || ''
        }
      })
    },
    renderPlayTime (time) {
      return this.$options.filters.dateformat(time, 'HH:mm')
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables";
@import "~@/assets/style/utils";

.movie-info-container {
  display: flex;

  img {
    width: @movie-poster-width;
    height: @movie-poster-height;
    border-radius: @img-radius;

    @media (max-width: @mobile-screen-width) {
      width: 120px;
      height: 200px;
      border-radius: 4px;
    }
  }

  .movie-info-base {
    padding-left: @base-interval;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h1 {
      font-size: @movie-title-font-size;
      margin-bottom: 0;
      @media (max-width: @mobile-screen-width) {
        font-size: @movie-title-font-size-mobile;
      }
    }

    ul {
      list-style: none;
      padding-left: 0;
      margin-bottom: 0;

      li {
        font-size: @movie-description-font-size;

        @media (max-width: @mobile-screen-width) {
          font-size: @base-font-size;
          width: 200px;
        }

        span {
          color: @text-color-secondary;
        }

        .textOverflow()
      }
    }
  }
}

.movie-des-container {
  margin-top: @base-interval;

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-size: @movie-title-font-size-mobile;
      font-weight: bold;
    }
  }
}

.movie-schedule-container {
  margin-top: @base-interval;
}

.textCollapse {
  .textOverflowMulti()
}
</style>
