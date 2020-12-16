<template>
  <footer class="app-footer">
    <div class="copyright">
      Copyright
      <a-icon type="copyright"/>
      <span v-html="copyright"></span>
      All Rights Reserved
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FootBar',
  props: ['copyright']
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables.less";

.app-footer {
  padding: @base-interval;
  text-align: center;
  background-color: @footer-background-color;

  .copyright {
    color: rgba(0, 0, 0, .45);
  }
}
</style>
