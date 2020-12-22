<template>
  <div class="tickets-container">
    <a-skeleton :loading="loading" active>
      <ul>
        <li v-for="(ticket,index) in ticketsList.slice((current-1)*pageSize,current*pageSize)" :key="index">
          <ticket-card :ticket="ticket" :idProp="idProp"/>
        </li>
      </ul>
    </a-skeleton>

    <div class="pagination-container">
      <a-pagination
        v-model="current"
        hideOnsinglePage
        :pageSize="pageSize"
        :total="ticketsList.length"
        show-size-changer
        @showSizeChange="onShowSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { removeWatermark, setWaterMark } from '@/utils/watermark'
import TicketCard from './TicketCard'

export default {
  name: 'TicketsContainer',
  props: {
    ticketsList: {
      type: Array
    },
    loading: {
      type: Boolean
    },
    idProp: {
      type: String
    },
    waterMarkOpacity: {
      type: Number
    }
  },
  components: {
    TicketCard
  },
  data () {
    return {
      current: 1,
      pageSize: 10
    }
  },
  watch: {
    waterMarkOpacity (newValue) {
      if (newValue === 0) {
        this.ticketsList.filter(t => this.ifNoUseTicket(t))
          .map(t => this.idProp.concat(t.id))
          .forEach(id => removeWatermark(id))
      } else {
        this.ticketsList.filter(t => this.ifNoUseTicket(t))
          .map(t => this.idProp.concat(t.id))
          .forEach(id => setWaterMark('已失效', '无效票', id, this.isMobile))
      }
    }
  },
  methods: {
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
    },
    ifNoUseTicket (ticket) {
      return ticket.state === '已失效' || new Date(ticket.schedule.endTime) < Date.now()
    }
  },
  computed: {
    isMobile () {
      return this.$store.state.device === 'mobile'
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables";

.tickets-container {
  ul {
    list-style: none;
    padding-left: 0;

    li {
      padding: @base-interval 0;

      @media (max-width: 768px) {
        border-bottom: 1px solid @base-border-color;
        padding: 8px 0;
        &:last-child {
          border: none;
        }
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
  }
}
</style>
