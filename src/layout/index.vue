<template>
  <section id="app-container">
    <header class="fixed-header">
      <nav-bar/>
    </header>

    <main class="app-main" :class="{'mobile':isMobile}">
      <div class="main-content">
        <transition name="fade-transform" mode="out-in">
          <router-view/>
        </transition>
      </div>
    </main>

    <foot-bar :copyright="copyright"/>
  </section>
</template>

<script>
import NavBar from '@/layout/components/NavBar'
import ResizeMixin from './mixin/ResizeHandler'
import FootBar from '@/layout/components/FootBar'

export default {
  name: 'Layout',
  mixins: [ResizeMixin],
  computed: {
    isMobile () {
      return this.$store.state.device === 'mobile'
    },
    copyright () {
      return this.$store.state.copyright
    }
  },
  components: {
    FootBar,
    NavBar
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables.less";
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: 100%;
}
.app-main {
  /* 60= navbar  60  */
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: @main-background-color;
  padding: 0 calc(@navbar-height - @base-interval);
  .main-content{
    padding: @base-interval;
    @media (max-width: 768px){
      padding: @base-interval 0;
    }
  }
}
.fixed-header+.app-main{
  padding-top: @navbar-height;
}
.mobile{
  padding: 0 @mobile-interval;
}
/* fade-transform */

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
