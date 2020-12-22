<template>
  <div>
    <a-page-header
      title="我的电影票"
      sub-title="查看我已经购买的电影票"
      @back="() => null"
      :backIcon="backIcon"
    />
    <a-tabs :default-active-key="defaultActive"
            size="large"
            :tabBarGutter="15"
            :tabBarStyle="{textAlign: 'center'}"
            style="padding: 0 2px;"
            @change="onPaneChange">
      <a-tab-pane key="1" tab="全 部" :disabled="disables[2]">
        <tickets-container :tickets-list="effectiveTickets.concat(notUseTickets).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())"
                           idProp="1-"
                           :waterMarkOpacity="waterMarkOpacity[0]"
                           :loading="loading"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="未生效" :disabled="disables[0]">
        <tickets-container :tickets-list="effectiveTickets"
                           idProp="2-"
                           :waterMarkOpacity="waterMarkOpacity[1]"
                           :loading="loading"/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="已失效" :disabled="disables[1]">
        <tickets-container :tickets-list="notUseTickets"
                           idProp="3-"
                           :waterMarkOpacity="waterMarkOpacity[2]"
                           :loading="loading"/>
      </a-tab-pane>
    </a-tabs>
    <a-back-top/>
  </div>
</template>

<script>
import { fetchTickets } from '@/api/tickets'
import db from '@/utils/localstorage'
import TicketsContainer from './ticketComponents/TicketsContainer'

export default {
  name: 'TicketList',
  components: { TicketsContainer },
  data () {
    return {
      backIcon: <a-icon type="link"/>,
      effectiveTickets: [],
      notUseTickets: [],
      disables: [false, false, false],
      defaultActive: '1',
      waterMarkOpacity: [0.3, 0, 0],
      loading: true
    }
  },
  async mounted () {
    const userid = db.get('USER_ID')
    const t = await fetchTickets(userid)
    if (t.length === 0) {
      this.disables = [true, true, true]
    }
    this.notUseTickets = t.filter(ticket => ticket.state === '已失效' || new Date(ticket.schedule.endTime) < Date.now()).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    if (this.notUseTickets.length === 0) {
      this.disables[1] = true
    }

    this.effectiveTickets = t.filter(ticket => !this.notUseTickets.includes(ticket)).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    if (this.effectiveTickets.length === 0) {
      this.disables[0] = true
    }
    this.loading = false
  },
  methods: {
    onPaneChange (activeKey) {
      this.waterMarkOpacity = [0, 0, 0]
      this.waterMarkOpacity[Number.parseInt(activeKey) - 1] = 0.3
    }
  }
}
</script>
