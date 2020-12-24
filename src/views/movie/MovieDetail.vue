<template>
  <section v-page-title data-title="电影详情">
    <a-breadcrumb>
      <a-breadcrumb-item>
        <router-link to="/movies">电影</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ movieInfo.name }}</a-breadcrumb-item>
    </a-breadcrumb>
      <div class="movie-info-container">
        <img v-lazy="movieInfo.posterUrl" :alt="movieInfo.name"/>
        <a-skeleton :loading="loading" active>
          <div class="movie-info-base">
            <h1>{{ movieInfo.name }}</h1>
            <ul>
              <li>上映日期：<span>{{ movieInfo.startDate | dateformat('YYYY-MM-DD')}}</span></li>
              <li>时长：<span>{{ movieInfo.length }}分钟</span></li>
              <li>类型：<span>{{ movieInfo.type }}</span></li>
              <li>地区：<span>{{ movieInfo.country||'中国' }}</span></li>
              <li>语言：<span>{{ movieInfo.language||'国语' }}</span></li>
              <li>导演：<a-tooltip :title="movieInfo.director"><span>{{ movieInfo.director }}</span></a-tooltip></li>
              <li>主演：<a-tooltip :title="movieInfo.starring" placement="topLeft"><span>{{ movieInfo.starring }}</span></a-tooltip></li>
            </ul>
            <a-space>
              <a-button :type="isLike?'primary':'default'"
                        @click="clickLike"
                        block>
                <a-icon type="heart" :theme="isLike?'filled':'outlined'" style="color: #f5222d"/>
                {{isLike?'已':''}}想看
              </a-button>
              <a-button :type="isSeen?'primary':'default'"
                        @click="updateWatchStatus"
                        block>
                <a-icon type="star" :theme="isSeen?'filled':'outlined'"/>
                {{isSeen?'已':''}}看过
              </a-button>
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
      <div class="nav-wrap">
      <a-radio-group :default-value="0" button-style="solid" v-model="dateIndex" :size="isMobile?'small':'large'" class="movie-nav">
        <a-radio-button v-for="(item,index) in scheduleData" :key="index" :value="index">
          {{ item.date | dateformat('MM月DD日', true)}}
        </a-radio-button>
      </a-radio-group>
      </div>
        <a-table :data-source="scheduleData.length>0?scheduleData[dateIndex].scheduleItemList:[]"
                 :pagination="false"
                 :rowKey="rowKey"
                 class="sch-table">
          <a-table-column key="startTime" :title="`放映${isMobile?'':'开始'}时间`" data-index="startTime" :width="isMobile?120:'auto'">
            <template slot-scope="startTime,endTime" style="padding: 8px">
              <h3 style="margin: 0">{{startTime | dateformat('hh:mm')}}</h3>
              <div style="color: rgba(0, 0, 0, 0.45);font-size: 12px" v-if="isMobile">{{endTime | dateformat('hh:mm')}}散场</div>
            </template>
          </a-table-column>
          <a-table-column key="endTime" title="放映结束时间" data-index="endTime" :custom-render="renderPlayTime" v-if="!isMobile"/>
          <a-table-column key="hallName" title="放映厅" data-index="hallName">
            <template slot-scope="hallName">
              <a-tag color="green">{{hallName}}</a-tag>
            </template>
          </a-table-column>
          <a-table-column key="fare" title="票价(元)" data-index="fare" :width="isMobile?100:'auto'">
            <template slot-scope="fare">
              <a-statistic v-if="!isMobile" :precision="2" :value="fare"/>
              <h3 v-else style="margin: 0">{{Number(fare).toFixed(2)}}</h3>
            </template>
          </a-table-column>
          <a-table-column key="buy" title="选座购票" :width="isMobile?100:'auto'">
            <template slot-scope="text,record">
              <a-button type="danger" @click="buyMovie(record.id)" :size="isMobile?'small':'default'">立即购买</a-button>
            </template>
          </a-table-column>
        </a-table>
    </div>
  </section>
</template>

<script>
import pageTitle from '@/directive/page-title'
import { fetchMovieDetail, fetchScheduleDataByMovieId, updateMovieLike } from '@/api/movie'
import { mapState } from 'vuex'

export default {
  name: 'MovieDetail',
  data () {
    return {
      movieInfo: {},
      scheduleData: [],
      textCollapse: true,
      loading: true,
      dateIndex: 0,
      isLike: false,
      isSeen: false
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id
    }),
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
    this.movieInfo = await fetchMovieDetail(this.userId || 0, this.id)
    this.isLike = this.movieInfo.islike !== 0
    this.loading = false
    this.scheduleData = await fetchScheduleDataByMovieId(this.id)
    console.log(this.scheduleData)
  },
  methods: {
    buyMovie (scheduleId) {
      if (this.userId) {
        this.$router.push({
          name: 'movieBuy',
          query: {
            id: this.id,
            scheduleId: scheduleId
          },
          params: {
            title: this.movieInfo.name || ''
          }
        })
      } else {
        this.$message.warning('请先登录')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    },
    renderPlayTime (time) {
      return this.$options.filters.dateformat(time, '预计HH:mm散场')
    },
    rowKey (record) {
      return record.id
    },
    clickLike () {
      updateMovieLike(this.userId, this.id, this.isLike)
      this.isLike = !this.isLike
    },
    updateWatchStatus () {
      this.isSeen = !this.isSeen
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
    overflow: hidden;

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
  .nav-wrap{
    //overflow-x: scroll;
    //overflow-y: hidden;
    white-space: nowrap;
    // 内容超出范围时，滚动条自动显示
    overflow: auto;
    // 指定PC端的样式
    //@media screen and (min-width: @mobile-screen-width){
    //  // 隐藏滚动条
    //  &::-webkit-scrollbar {
    //    display: none;
    //  }
    //}
    .movie-nav{
      overflow: auto;
    }
  }
}

.textCollapse {
  .textOverflowMulti()
}
// 设置表格单元格样式，通过/deep/实现
.sch-table{
  & /deep/ .ant-table-row-cell-break-word{
    @media (max-width: @mobile-screen-width) {
      padding: 8px;
    }
  }
}
</style>
