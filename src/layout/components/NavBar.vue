<template>
  <div :class="{'navbar-mobile': isMobile}" class="navbar">
    <div role="banner" class="logo-container">
      <router-link to="/home">
        <img src="@/assets/logo-mobile.png" alt="logo" class="logo-mobile" v-if="isMobile">
        <img src="@/assets/logo.png" alt="logo" class="logo" v-else>
      </router-link>
    </div>

    <div class="search-container">
      <a-input-search class="search" placeholder="寻找中意影片" size="large" enter-button @search="onSearch"/>
    </div>

    <div class="menu" role="navigation">
      <template v-if="!isMobile">
        <router-link to="/home" class="menu-item menu-item-title hover-effect">首页</router-link>
        <router-link to="/movies" class="menu-item menu-item-title hover-effect">电影</router-link>
      </template>
      <a-dropdown class="menu-item hover-effect" placement="bottomCenter" :trigger="['hover','click']">
        <div class="avatar-wrapper">
          <img :src="avatar" alt="user-avatar" class="user-avatar">
          <a-icon style="margin-left: 3px; font-size: 16px" type="down"></a-icon>
        </div>
        <a-menu slot="overlay" v-if="isLogin">
          <a-menu-item>
            <router-link to="/user/tickets">我的影票</router-link>
          </a-menu-item>
          <a-menu-item>
            <router-link to="/user/coupons">我的卡包</router-link>
          </a-menu-item>
          <a-menu-item>
            <router-link to="/user/history">历史记录</router-link>
          </a-menu-item>
          <a-menu-divider/>
          <a-menu-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </a-menu-item>
        </a-menu>
        <a-menu slot="overlay" v-else>
          <a-menu-item @click.native="login">
            <span style="display: block">登录/注册</span>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NavBar',
  computed: {
    ...mapState({
      avatar: state => state.user.avatar,
      userName: state => state.user.name
    }),
    isMobile () {
      return this.$store.state.device === 'mobile'
    },
    isLogin () {
      return !Object.is(this.userName, undefined) && this.userName !== null
    },
    current () {
      return this.$route.name
    }
  },
  mounted () {
    // console.log(this.avatar)
  },
  methods: {
    onSearch () {
      console.log('search')
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      await this.login()
    },
    async login () {
      await this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables.less";

.navbar {
  padding: 0 @navbar-height;
  height: @navbar-height;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  display: flex;
  position: relative;

  .hover-effect {
    transition: background .3s;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .logo-container {
    display: flex;
    align-items: center;
    margin-right: 12px;

    .logo {
      height: @navbar-height;
      border-style: none;
    }

    .logo-mobile {
      height: 48px;
      border-style: none;
    }
  }

  .search-container {
    max-width: @search-box-length;
    line-height: @navbar-height;
    display: flex;
    align-items: center;
  }

  .menu {
    display: flex;
    align-items: center;
    margin-left: auto;

    .menu-item {
      display: flex;
      align-items: center;
      padding: 0 8px;
    }

    .menu-item-title {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: @menu-item-font-size;
      color: @menu-item-font-color;
    }

    .avatar-wrapper {
      cursor: pointer;
      display: flex;
      align-items: center;

      .user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 10px;
      }

      span {
        margin-left: 5px
      }
    }
  }
}

// 优先级与class的定义先后有关
.navbar-mobile {
  padding: 0 @mobile-interval;
}
</style>
