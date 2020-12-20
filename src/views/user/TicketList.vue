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
            style="padding: 0 2px;">
      <a-tab-pane key="1" tab="未生效" :disabled="disables[0]">
        <tickets-container :tickets-list="effectiveTickets"
                           :loading="loading"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="已失效" :disabled="disables[1]">
        <tickets-container :tickets-list="notUseTickets"
                           :loading="loading"/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="全 部" :disabled="disables[2]">
        <tickets-container :tickets-list="effectiveTickets.concat(notUseTickets).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())"
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
      this.defaultActive = '2'
    }
    this.loading = false
  }
}
</script>

<style scoped>

</style>
