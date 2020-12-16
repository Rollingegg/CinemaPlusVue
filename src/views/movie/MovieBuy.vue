<template>
  <div>
    <h1>选座并下单</h1>
    <a-steps :current="current">
      <a-step v-for="(item,index) in steps" :key="index" :title="item" />
    </a-steps>
    <div class="step-content" v-show="current===0">
      选座
    </div>
    <div class="step-content" v-show="current===1">
      确认订单
    </div>
    <div class="step-content" v-show="current===2">
      支付成功
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieBuy',
  data () {
    return {
      current: 0,
      steps: ['选座', '确认订单，支付', '支付成功']
    }
  },
  props: {
    movieId: Number
  }
}
</script>

<style scoped>

</style>
