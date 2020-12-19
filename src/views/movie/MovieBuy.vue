<template>
  <section v-page-title :data-title="movieTitle">
    <a-breadcrumb>
      <a-breadcrumb-item>
        <router-link to="/movies">电影</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ movieTitle }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-steps :current="current">
      <a-step v-for="(item,index) in steps" :key="index" :title="item" />
    </a-steps>
    <div class="step-content" v-show="current===0">
      选座{{`scheduleId=${scheduleId}`}}
    </div>
    <div class="step-content" v-show="current===1">
      确认订单
    </div>
    <div class="step-content" v-show="current===2">
      支付成功
    </div>
  </section>
</template>

<script>
import pageTitle from '@/directive/page-title'

export default {
  name: 'MovieBuy',
  data () {
    return {
      current: 0,
      steps: ['选座', '确认订单，支付', '支付成功']
    }
  },
  directives: {
    pageTitle
  },
  props: {
    movieId: Number,
    movieTitle: String,
    scheduleId: Number
  }
}
</script>

<style scoped>

</style>
