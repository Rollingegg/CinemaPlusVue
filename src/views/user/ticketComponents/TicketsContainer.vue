<template>
  <div class="tickets-container">
    <a-skeleton :loading="loading" active>
      <ul>
        <li v-for="(ticket,index) in ticketsList.slice((current-1)*pageSize,current*pageSize)" :key="index">
          <ticket-card :ticket="ticket"/>
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
import TicketCard from './TicketCard'
export default {
  name: 'TicketsContainer',
  props: {
    ticketsList: {
      type: Array
    },
    loading: {
      type: Boolean
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
    current (val) {
      console.log('current', val)
    }
  },
  methods: {
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
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
