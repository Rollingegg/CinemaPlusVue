<template>
  <div class="consumption-body">
    <a-page-header
      title="我的消费记录"
      sub-title="查看我的电影票订单与会员卡充值记录"
      @back="() => null"
      :backIcon="backIcon"
    />
    <a-tabs default-active-key="1"
            size="large"
            @change="handleClick"
            :tabBarGutter="15"
            :tabBarStyle="{textAlign: 'center'}">
      <a-tab-pane key="1" tab="全部订单">
      </a-tab-pane>
      <a-tab-pane key="2" tab="电影票订单">
      </a-tab-pane>
      <a-tab-pane key="3" tab="会员卡订单">
      </a-tab-pane>
    </a-tabs>
    <div class="consumption-list-container">
      <a-list item-layout="horizontal" :data-source="consumptionList">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-skeleton :loading="loading" active avatar>
            <consumption-card :consumption-info="item"></consumption-card>
          </a-skeleton>
        </a-list-item>
      </a-list>
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
      backIcon: <a-icon type="link"/>,
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
    async handleClick (key) {
      // console.log('s ', e)
      if (key === '1') {
        await this.fetchAllConsumptions()
      } else if (key === '2') {
        await this.fetchAllConsumptions()
        this.consumptionList = this.consumptionList.filter(item => item.type === 0)
      } else if (key === '3') {
        await this.fetchAllConsumptions()
        this.consumptionList = this.consumptionList.filter(item => item.type === 1)
      }
    },
    async fetchAllConsumptions () {
      try {
        this.loading = true
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
  //padding: 0px 0px 0px 100px;
  display: flex;
  justify-content: center;
  // border-radius: @base-interval;
  // border: 1px solid @base-border-color;
}
</style>
