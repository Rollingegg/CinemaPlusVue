<template>
  <div class="consumption-body">
    <div><h1>我的消费记录</h1></div>
    <div class="consumption-content">
      <div class="consumption-menu">
        <a-menu style="width: 256px" mode="vertical" @click="handleClick" :default-selected-keys="['1']">
          <a-menu-item key="1">
            全部订单
          </a-menu-item>
          <a-menu-item key="2">
            电影票订单
          </a-menu-item>
          <a-menu-item key="3">
            会员卡订单
          </a-menu-item>
        </a-menu>
      </div>
      <div class="consumption-list-container">
        <a-list item-layout="horizontal" :data-source="consumptionList">
          <a-list-item slot="renderItem" slot-scope="item">
            <consumption-card :consumption-info="item"></consumption-card>
          </a-list-item>
        </a-list>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchConsumptions, fetchConsumptionDetail } from '@/api/consumption'
import db from '@/utils/localstorage'
import ConsumptionCard from '@/components/ConsumptionCard'

export default {
  name: 'ConsumptionRecord',
  components: { ConsumptionCard },
  data () {
    return {
      consumptionList: null,
      loading: true,
      consumptionDetail: null,
      defaultActiveKey: ['1'],
      defaultSelectedKeys: ['1']
    }
  },
  async mounted () {
    await this.fetchAllConsumptions()
  },
  methods: {
    async handleClick (e) {
      console.log('s ', e)
      if (e.key === '1') {
        await this.fetchAllConsumptions()
      } else if (e.key === '2') {
        await this.fetchAllConsumptions()
        this.consumptionList = this.consumptionList.filter(item => item.type === 0)
      } else if (e.key === '3') {
        await this.fetchAllConsumptions()
        this.consumptionList = this.consumptionList.filter(item => item.type === 1)
      }
    },
    async fetchAllConsumptions () {
      try {
        this.consumptionList = await fetchConsumptions(db.get('USER_ID'))
        if (this.consumptionList === null) {
          this.$message.error('获取消费记录列表失败，请检查网络连接')
        } else if (this.consumptionList.length === 0) {
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    async fetchOneConsumptionDetail (consumptionId) {
      try {
        this.consumptionDetail = await fetchConsumptionDetail(consumptionId)
        if (this.consumptionDetail === null) {
          this.$message.error('获取电影列表失败，请检查网络连接')
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables";
@import "~@/assets/style/utils";

.consumption-content {
  padding: 20px 0px;
  display: flex;
  flex-direction: row;
  // border-radius: @base-interval;
  // border: 1px solid @base-border-color;
}

.consumption-list-container {
  padding: 0px 0px 0px 100px;
  right: 0px;
  display: flex;
  // border-radius: @base-interval;
  // border: 1px solid @base-border-color;
}
</style>
