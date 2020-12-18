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
      <div class="movie-info-base">
        <h1>{{ movieInfo.title }}</h1>
        <ul>
          <li>上映日期：<span>{{ movieInfo.date }}</span></li>
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
      <a-radio-group size="large" :default-value="0" button-style="solid">
        <a-radio-button v-for="(item,index) in scheduleDateList" :key="index" :value="index">
          {{ item }}
        </a-radio-button>
      </a-radio-group>
      <a-table :columns="scheduleColumns" :data-source="scheduleData" :pagination="false">
        <span slot="buy"><a-button type="danger" shape="round" @click="buyMovie">立即购票</a-button></span>
      </a-table>
    </div>
  </section>
</template>

<script>
import pageTitle from '@/directive/page-title'
import { fetchMovies } from '@/api/movie'

const scheduleColumns = [
  {
    title: '放映开始时间',
    dataIndex: 'startTime',
    key: 'startTime'
  },
  {
    title: '放映结束时间',
    dataIndex: 'endTime',
    key: 'endTime'
  },
  {
    title: '放映厅',
    dataIndex: 'hall',
    key: 'hall'
  },
  {
    title: '票价',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '选座购票',
    key: 'buy',
    scopedSlots: { customRender: 'buy' }
  }
]
const scheduleData = [
  {
    key: '1',
    startTime: '01:14',
    endTime: '预计03:14散场',
    hall: '2号厅',
    price: 40
  }
]
export default {
  name: 'MovieDetail',
  data () {
    return {
      movieInfo: {},
      scheduleDateList: ['今天', '明天'],
      scheduleColumns,
      scheduleData,
      textCollapse: true
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
    console.log(this.id)
    this.movieInfo = await fetchMovies()
    this.movieInfo = this.movieInfo[0]
  },
  methods: {
    buyMovie () {
      this.$router.push({
        name: 'movieBuy',
        query: { id: this.id },
        params: { title: this.movieInfo.title || '' }
      })
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

    @media (max-width: @mobile-screen-width) {
      width: 120px;
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
