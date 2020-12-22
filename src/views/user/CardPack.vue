<template>
<div>
  <a-page-header
    title="我的卡包"
    sub-title="查看我的会员卡和优惠券"
    @back="() => null"
    :backIcon="backIcon"
  />
  <a-tabs default-active-key="1"
          size="large"
          :tabBarGutter="15"
          :tabBarStyle="{textAlign: 'center'}">
    <a-tab-pane key="1" tab="会员卡">
      <h1>我的会员卡</h1>
    </a-tab-pane>
    <a-tab-pane key="2" tab="优惠券">
      <h1>我的优惠券</h1>
    </a-tab-pane>
  </a-tabs>
</div>
</template>

<script>
export default {
  name: 'CardPack',
  data () {
    return {
      backIcon: <a-icon type="link"/>
    }
  }
}
</script>

<style scoped>

</style>
