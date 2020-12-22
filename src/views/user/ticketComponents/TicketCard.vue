<template>
  <div :id="idProp.concat(this.ticket.id)">
    <div class="ticket-card" :class="ifNoUseTicketClass" >
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
    </div>
  </div>
</template>

<script>
import { removeWatermark, setWaterMark } from '@/utils/watermark'

export default {
  name: 'TicketCard',
  data: function () {
    return {}
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
  destroyed () {
    window.onresize = null
    if (this.ifNoUseTicketClass.noUseTicketClass) {
      removeWatermark(this.idProp + this.ticket.id)
    }
  },
  watch: {
    /*    waterMarkOpacity (newValue, oldValue) {
      console.log('props', newValue)
    } */
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
}
</style>
