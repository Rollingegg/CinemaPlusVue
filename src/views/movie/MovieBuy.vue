<template>
  <section v-page-title :data-title="movieTitle">
    <a-breadcrumb>
      <a-breadcrumb-item>
        <router-link to="/movies">电影</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ movieTitle }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-steps :current="current">
      <a-step v-for="(item,index) in steps" :key="index" :title="item"/>
    </a-steps>
    <div class="step-content" v-show="current===0">
      <a-row :gutter="32" type="flex" justify="center">
        <a-col :md="12" class="seat-container">
          <h2>{{ scheduleInfo.hallName }}<span
            v-if="seatInfo.length>0">{{ `(${seatInfo.length}*${seatInfo[0].length})` }}</span></h2>
          <div v-for="(col,i) in seatInfo" :key="i">
            <seat-icon v-for="(status,j) in col"
                       :key="j"
                       @click.native="selectSeat(i,j)"
                       class="seat"
                       :class="seatClassObject(i,j)"/>
          </div>
        </a-col>
        <a-col :md="12">
          <div class="movie-info">
            <img v-lazy="scheduleInfo.url" :alt="scheduleInfo.movieName"/>
            <div>
              <h2>{{ scheduleInfo.movieName }}</h2>
              <ul>
                <li>主演：<span>{{ scheduleInfo.actors }}</span></li>
                <li>类型：<span>{{ scheduleInfo.category }}</span></li>
                <li>时长：<span>{{ scheduleInfo.length }}分钟</span></li>
                <li>票价：<span>{{ Number(scheduleInfo.fare).toFixed(2) }}元/张</span></li>
              </ul>
            </div>
          </div>
          <a-divider/>
          <ul>
            <li>影厅：<span>{{ scheduleInfo.hallName }}</span></li>
            <li>场次：<span>{{ scheduleInfo.startTime | dateformat('MM月DD日 hh:mm') }}场</span></li>
            <li>座位：
              <span v-if="canSubmitOrder">还未选择座位</span>
              <a-tag color="green" v-for="(seat,index) in selectedSeats" :key="index">
                {{ `${seat[0] + 1}排${seat[1] + 1}座` }}
              </a-tag>
            </li>
          </ul>
          <a-divider/>
          <a-button type="primary" :disabled="canSubmitOrder">确认下单</a-button>
        </a-col>
      </a-row>
    </div>
    <div class="step-content" v-show="current===1">
      确认订单
    </div>
    <div class="step-content" v-show="current===2">
      支付成功
    </div>
  </section>
</template>

<script>
import pageTitle from '@/directive/page-title'
import { mapState } from 'vuex'
import SeatIcon from '@/components/icon/SeatIcon'
import { fetchSeatInfoByScheduleIdAndUserId } from '@/api/movie'

export default {
  name: 'MovieBuy',
  components: { SeatIcon },
  data () {
    return {
      current: 0,
      steps: ['选座', '确认订单，支付', '支付成功'],
      seatInfo: [],
      scheduleInfo: {},
      selectedSeats: []
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id
    }),
    canSubmitOrder () {
      return this.selectedSeats.length === 0
    }
  },
  directives: {
    pageTitle
  },
  props: {
    movieId: Number,
    movieTitle: String,
    scheduleId: Number
  },
  async mounted () {
    const { scheduleItem, seats } = await fetchSeatInfoByScheduleIdAndUserId(this.scheduleId, this.userId)
    this.scheduleInfo = scheduleItem
    this.scheduleInfo.url = 'https://p1.meituan.net/moviemachine/56d4089f70bce77395597e0b5b6ff3a12891795.jpg'
    this.scheduleInfo.actors = '张三/李四/王五'
    this.scheduleInfo.category = '悬疑/爱情'
    this.scheduleInfo.length = 120
    this.seatInfo = seats
    console.log(scheduleItem, seats)
  },
  methods: {
    selectSeat (i, j) {
      if (Number(this.seatInfo[i][j]) === 1) {
        // 使用变异方法监听数组某一项的变化
        this.$set(this.seatInfo[i], j, 3)
        console.log(this.seatInfo)
        this.selectedSeats.push([i, j])
      } else if (Number(this.seatInfo[i][j]) === 3) {
        this.$set(this.seatInfo[i], j, 1)
        this.selectedSeats.push([i, j])
      }
    },
    seatClassObject (i, j) {
      return {
        'seat-default': Number(this.seatInfo[i][j]) === 1 || Number(this.seatInfo[i][j]) === 3,
        'seat-lock': Number(this.seatInfo[i][j]) === 2,
        'seat-choose': Number(this.seatInfo[i][j]) === 3,
        'seat-invisible': Number(this.seatInfo[i][j]) === 0
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables";

.step-content {
  margin-top: @base-interval;
  @media (max-width: @mobile-screen-width) {
    margin-top: 0;
  }

  .seat-container {
    border-right: 1px solid @base-border-color;
    @media (max-width: @mobile-screen-width) {
      border: none;
    }

    h2 {
      span {
        color: @text-color-secondary;
      }
    }
  }

  .movie-info {
    display: flex;
    align-items: center;

    img {
      width: 90px;
      height: 120px;
      border-radius: 2px;
    }

    div {
      padding-left: @base-interval;
    }
  }
}

ul {
  padding: 0;
  margin: 0;
  list-style: none;

  li {
    span {
      color: @text-color-secondary;
    }
  }
}

.seat {
  font-size: 32px;
  margin: 5px;
  @media (max-width: @mobile-screen-width) {
    font-size: 24px;
    margin: 2px;
  }
}

.seat-default {
  cursor: pointer;
}

.seat-choose {
  color: #0063B1;
}

.seat-lock {
  color: #f5222d;
}

.seat-invisible {
  display: none;
}
</style>
