<template>
  <div :id="idProp.concat(this.ticket.id)">
    <div class="ticket-card" :class="ifNoUseTicketClass">
      <div class="ticket-card-poster-wrapper">
        <img v-lazy="ticket.movie.posterUrl" :alt="ticket.movie.name"/>
      </div>

      <div class="ticket-card-info">
        <div class="ticket-card-info-title">
          <div>
            <div class="ticket-title">{{ ticket.movie.name }}</div>
            <div v-if="!isMobile">
              <a-tag v-if="ticket.movie.status===1" color="rgba(0, 0, 0, 0.25)">已下架</a-tag>
              <a-tag v-else color="#f5222d">热映中</a-tag>
            </div>
          </div>
        </div>
        <div class="ticket-card-info-description" v-if="!isMobile">
          {{ ticket.movie.description }}
        </div>
        <div class="ticket-card-info-item">单价：<span>￥{{ ticket.schedule.fare }}</span></div>
        <div class="ticket-card-info-item">购票时间：<span>{{ ticket.time }}</span></div>
        <div class="ticket-card-info-item">观影日期：<span>{{ ticket.schedule.startTime.substring(0, 10) }}</span></div>
        <div class="ticket-card-info-item">预计时间日期：<span>从 {{
            ticket.schedule.startTime.substring(11)
          }} 到 {{ ticket.schedule.endTime.substring(11) }}</span></div>
        <div class="ticket-card-info-item">影厅：<span>{{ ticket.schedule.hallName }}</span></div>
        <div class="ticket-card-info-item">座位：<span>{{ ticket.seatsStr.replace(/\s+/g, ", ") }}</span></div>
      </div>

      <div class="ticket-card-button">
        <a-button shape="round"
                  type='primary'
                  :size="isMobile?'default':'large'"
                  @click="() => (this.modalVisible = true)">
          查看完整信息
        </a-button>
      </div>

      <a-modal
        v-model="modalVisible"
        title="电影票信息详情"
        centered
        :footer="null"
        @ok="() => (this.modalVisible = false)">
        <a-collapse activeKey="1">
          <a-collapse-panel key="1" header="票详细信息">
            <a-descriptions
              bordered>
              <a-descriptions-item label="电影名">
                {{ ticket.movie.name }}
              </a-descriptions-item>
              <a-descriptions-item label="购票时间">
                {{ ticket.time }}
              </a-descriptions-item>
              <a-descriptions-item label="状态">
                {{ this.ifNoUseTicketClass.noUseTicketClass ? '已失效' : '有 效' }}
              </a-descriptions-item>
              <a-descriptions-item label="座位">
                <span v-html="this.replaceStr(ticket.seatsStr)"/>
              </a-descriptions-item>
            </a-descriptions>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="排片详细信息">
            <a-descriptions
              bordered>
              <a-descriptions-item label="电影名">
                {{ ticket.schedule.movieName }}
              </a-descriptions-item>
              <a-descriptions-item label="影厅">
                {{ ticket.schedule.hallName }}
              </a-descriptions-item>
              <a-descriptions-item label="票价">
                ￥{{ ticket.schedule.fare }}
              </a-descriptions-item>
              <a-descriptions-item label="开始时间">
                {{ ticket.schedule.startTime }}
              </a-descriptions-item>
              <a-descriptions-item label="预计结束时间">
                {{ ticket.schedule.endTime }}
              </a-descriptions-item>
            </a-descriptions>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="电影详细信息">
            <a-descriptions
              bordered>
              <a-descriptions-item label="电影名">
                {{ ticket.movie.name }}
              </a-descriptions-item>
              <a-descriptions-item label="喜欢人数">
                {{ ticket.movie.likeCount === null ? "暂无" : ticket.movie.likeCount }}
              </a-descriptions-item>
              <a-descriptions-item label="导演">
                {{ ticket.movie.director }}
              </a-descriptions-item>
              <a-descriptions-item label="演员">
                {{ ticket.movie.starring }}
              </a-descriptions-item>
              <a-descriptions-item label="类型">
                {{ ticket.movie.type }}
              </a-descriptions-item>
              <a-descriptions-item label="国家">
                {{ ticket.movie.country === null ? "暂无" : ticket.movie.country }}
              </a-descriptions-item>
              <a-descriptions-item label="描述" :span="3">
                {{ ticket.movie.description }}
              </a-descriptions-item>
            </a-descriptions>
          </a-collapse-panel>
        </a-collapse>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { removeWatermark, setWaterMark } from '@/utils/watermark'

export default {
  name: 'TicketCard',
  data: function () {
    return {
      modalVisible: false
    }
  },
  props: {
    ticket: {
      type: Object
    },
    idProp: {
      type: String
    }
  },
  mounted () {
    if (this.ifNoUseTicketClass.noUseTicketClass) {
      setWaterMark('已失效', '无效票', this.idProp + this.ticket.id, this.isMobile)
    }
  },
  methods: {
    replaceStr (seats) {
      return seats.replace(/\s+/g, '<br />')
    }
  },
  destroyed () {
    window.onresize = null
    if (this.ifNoUseTicketClass.noUseTicketClass) {
      removeWatermark(this.idProp + this.ticket.id)
    }
  },
  computed: {
    isMobile () {
      return this.$store.state.device === 'mobile'
    },
    ifNoUseTicketClass () {
      return {
        noUseTicketClass: this.ticket.state === '已失效' || new Date(this.ticket.schedule.endTime) < Date.now()
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables";
@import "~@/assets/style/utils";

.noUseTicketClass {
  -webkit-filter: blur(0.75px) grayscale(.25) opacity(80%);
}

.ticket-card {
  display: flex;
  border-radius: @base-interval;
  border: 1px solid @base-border-color;
  align-items: center;
  @media (max-width: @mobile-screen-width) {
    border-radius: 0;
    border: none;
  }

  &:hover {
    border-color: rgba(0, 0, 0, 0.09);
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

        .ticket-title {
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
      .textOverflowMulti(2)
    }

    &-item {
      padding-top: calc(@base-interval / 5);
      white-space: nowrap;
      overflow: hidden;
      font-size: @movie-info-item-font-size;
      @media (max-width: @mobile-screen-width) {
        padding-top: 2px;
        font-size: @base-font-size;
      }

      span {
        color: @heading-color;
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
