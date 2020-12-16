<template>
  <section class="container">
    <main class="content">
      <div class="top">
        <div class="header">
          <img alt="logo" class="logo" src="@/assets/logo.png"/>
        </div>
        <div class="desc"></div>
      </div>
      <component :is="componentName" @register="handleRegister" class="main-content"></component>
    </main>
    <foot-bar :copyright="copyright"/>
  </section>
</template>

<script>
import Login from './components/Login'
import Register from './components/Register'
import FootBar from '@/layout/components/FootBar'

export default {
  name: 'Login',
  components: {
    FootBar,
    Login,
    Register
  },
  data () {
    return {
      componentName: 'Login'
    }
  },
  computed: {
    copyright () {
      return this.$store.state.copyright
    }
  },
  methods: {
    handleRegister (val) {
      this.componentName = val
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: #f0f2f5 url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg') no-repeat center 110px;
  background-size: 100%;

  .content {
    padding: 80px 0 32px;
    flex: 1;
    @media (min-width: 768px) {
      padding: 116px 0 10px;
    }

    .top {
      text-align: center;

      .header {
        height: 50px;
        line-height: 50px;

        a {
          text-decoration: none;
        }

        .logo {
          height: 50px;
        }

        .title {
          font-size: 28px;
          color: rgba(0, 0, 0, .85);
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 6px;
        }
      }

      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, .45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .main-content {
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
