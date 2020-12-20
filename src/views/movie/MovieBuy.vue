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
    <div class="step-content" v-if="current===0">
      <a-row :gutter="32" type="flex">
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
          <a-divider dashed/>
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
          <a-divider dashed/>
          <a-button type="primary" :disabled="canSubmitOrder" @click="submitOrder">确认下单</a-button>
        </a-col>
      </a-row>
    </div>
    <div class="step-content" v-else-if="current===1">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>电影</th>
              <th>影厅/场次</th>
              <th>票数/座位</th>
              <th>单价(元)</th>
              <th>总价(元)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{scheduleInfo.movieName}}</td>
              <td>
                <div>{{ scheduleInfo.hallName }}</div>
                <div>{{ scheduleInfo.startTime | dateformat('MM月DD日 hh:mm') }}场</div>
              </td>
              <td>
                <div>{{selectedSeats.length}}张</div>
                <a-tag color="green" v-for="(seat,index) in selectedSeats" :key="index">
                  {{ `${seat[0] + 1}排${seat[1] + 1}座` }}
                </a-tag>
              </td>
              <td>{{ Number(scheduleInfo.fare).toFixed(2) }}</td>
              <td>
                <strong>{{ Number(orderInfo.total).toFixed(2) }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <a-divider dashed/>
      <div class="order-wrapper">
        <div class="coupon-selection">
          <span>优惠券：</span>
          <a-select default-value="none" style="width: 150px">
            <a-select-option value="none">不使用优惠券</a-select-option>
            <a-select-option v-for="(coupon,i) in orderInfo.coupons" :key="i" :value="coupon">{{`满${coupon.targetAmount}减${coupon.discountAmount}`}}</a-select-option>
          </a-select>
        </div>
        <div>
          <div>总金额：￥{{ Number(orderInfo.total).toFixed(2) }}</div>
          <div>优惠金额：无</div>
        </div>
      </div>
      <a-divider dashed/>
      <div class="order-footer">
        <div>实付款：<b style="font-size: 20px; color: #0063B1">￥{{actualTotal}}</b></div>
        <a-button type="primary" @click="openPayModal">立即付款</a-button>
      </div>
      <a-modal
        title="付款"
        :visible="modalVisible"
        :confirm-loading="confirmLoading"
        ok-text="确认"
        cancel-text="取消"
        @ok="submitPayment"
        @cancel="handleCancel"
      >
        <a-tabs type="card">
          <a-tab-pane key="1" tab="银行卡支付">
            银行卡
          </a-tab-pane>
        </a-tabs>
      </a-modal>
    </div>
    <div class="step-content" v-else-if="current===2">
      支付成功
    </div>
  </section>
</template>

<script>
import pageTitle from '@/directive/page-title'
import { mapState } from 'vuex'
import SeatIcon from '@/components/icon/SeatIcon'
import { fetchSeatInfoByScheduleIdAndUserId, lockSeat } from '@/api/movie'
import { fetchVipInfo } from '@/api/user'

export default {
  name: 'MovieBuy',
  components: { SeatIcon },
  data () {
    return {
      current: 0,
      steps: ['选座', '确认订单，支付', '支付成功'],
      seatInfo: [],
      scheduleInfo: {},
      selectedSeats: [],
      orderInfo: {},
      vipInfo: {},
      actualTotal: 0,
      modalVisible: false,
      confirmLoading: false
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
    document.title = this.scheduleInfo.movieName
    for (let i = 0; i < seats.length; i++) {
      for (let j = 0; j < seats[0].length; j++) {
        if (seats[i][j] === 3) {
          this.selectedSeats.push([i, j])
        }
      }
    }
    this.sortSelectedSeats()
  },
  methods: {
    /**
     * 点击选座的响应方法
     * @param i 排
     * @param j 座
     */
    selectSeat (i, j) {
      if (Number(this.seatInfo[i][j]) === 1) {
        // 使用变异方法监听数组某一项的变化
        this.$set(this.seatInfo[i], j, 3)
        // 选中座位
        this.selectedSeats.push([i, j])
      } else if (Number(this.seatInfo[i][j]) === 3) {
        this.$set(this.seatInfo[i], j, 1)
        // 取消选中
        this.selectedSeats = this.selectedSeats.filter(value => value[0] !== i || value[1] !== j)
      }
      this.sortSelectedSeats()
    },
    sortSelectedSeats () {
      // 选中座位排序
      this.selectedSeats.sort(function (x, y) {
        const res = x[0] - y[0]
        return res === 0 ? x[1] - y[1] : res
      })
    },
    seatClassObject (i, j) {
      return {
        'seat-default': Number(this.seatInfo[i][j]) === 1 || Number(this.seatInfo[i][j]) === 3,
        'seat-lock': Number(this.seatInfo[i][j]) === 2,
        'seat-choose': Number(this.seatInfo[i][j]) === 3,
        'seat-invisible': Number(this.seatInfo[i][j]) === 0
      }
    },
    async submitOrder () {
      const selectedSeatsVo = []
      this.selectedSeats.forEach(seat => {
        selectedSeatsVo.push({ columnIndex: seat[1], rowIndex: seat[0] })
      })
      this.orderInfo = await lockSeat(this.userId, this.scheduleId, selectedSeatsVo)
      this.current = 1
      this.actualTotal = this.orderInfo.total
      try {
        this.vipInfo = await fetchVipInfo(this.userId)
      } catch (e) {
        console.log(e)
      }
    },
    openPayModal () {
      this.modalVisible = true
    },
    async submitPayment () {
      this.confirmLoading = true
      await setTimeout(() => {
        this.modalVisible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel () {
      this.modalVisible = false
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
  .table-wrapper{
    zoom: 1;
    table{
      width: 100%;
      text-align: center;
      border-radius: 4px 4px 0 0;
      border-collapse: separate;
      border-spacing: 0;
      thead{
        tr{
          th{
            color: @heading-color;
            font-weight: 500;
            background: #fafafa;
            border-bottom: 1px solid #e8e8e8;
            transition: background .3s ease;
            padding: 16px;
            @media (max-width: @mobile-screen-width) {
              padding: 8px;
            }
          }
        }
      }
      tbody{
        tr{
          td{
            padding: 16px;
            @media (max-width: @mobile-screen-width) {
              padding: 8px;
            }
          }
        }
      }
    }
  }
  .order-wrapper{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .order-footer{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
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
