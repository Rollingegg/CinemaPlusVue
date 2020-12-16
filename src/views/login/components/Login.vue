<template>
  <div class="login">
    <a-form @submit.prevent="doLogin" :form="form">
      <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;" :activeKey="activeKey"
              @change="handleTabsChange">
        <a-tab-pane tab="账户密码登录" key="1">
          <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon
                   style="margin-bottom: 24px;"></a-alert>
          <a-form-item>
            <a-input ref="username" size="large"  v-decorator="['name',{rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]">
              <a-icon slot="prefix" type="user"></a-icon>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input ref="password" size="large" type="password" v-decorator="['password',{rules: [{ required: true, message: '请输入密码', whitespace: true}]}]">
              <a-icon slot="prefix" type="lock"></a-icon>
            </a-input>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane tab="手机号登录" key="2">
          <a-form-item>
            <a-input size="large">
              <a-icon slot="prefix" type="mobile"></a-icon>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-row :gutter="8" style="margin: 0 -4px">
              <a-col :span="16">
                <a-input size="large">
                  <a-icon slot="prefix" type="mail"></a-icon>
                </a-input>
              </a-col>
              <a-col :span="8" style="padding-left: 4px">
                <a-button style="width: 100%" class="captcha-button" size="large" @click="getCaptcha">获取验证码</a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>
      <a-form-item>
        <a-button :loading="loading" style="width: 100%; margin-top: 4px" size="large" htmlType="submit" type="primary">
          登录
        </a-button>
      </a-form-item>
      <div>
        <router-link to="/" style="float: left">游客登陆</router-link>
        <a style="float: right" @click="register">注册账户</a>
      </div>
    </a-form>
  </div>
</template>

<script>
import db from '@/utils/localstorage'

export default {
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  name: 'SignIn',
  data () {
    return {
      loading: false,
      error: '',
      activeKey: '1',
      redirect: undefined,
      otherQuery: {}
    }
  },
  computed: {
    systemName () {
      return 'Random Theatre'
    },
    copyright () {
      return this.$store.state.copyright
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created () {
    db.clear()
  },
  mounted () {
    if (this.form.username === '') {
      this.$refs.username.focus()
    } else if (this.form.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    doLogin () {
      if (this.activeKey === '1') {
        // 用户名密码登录
        this.form.validateFields(['name', 'password'], (errors, values) => {
          if (!errors) {
            this.loading = true
            const name = this.form.getFieldValue('name')
            const password = this.form.getFieldValue('password')
            this.$store.dispatch('user/login', {
              username: name,
              password: password
            }).then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            }).catch((e) => {
              console.error(e)
              setTimeout(() => {
                this.loading = false
              }, 500)
            })
          }
        })
      }
      if (this.activeKey === '2') {
        // 手机验证码登录
        this.$message.warning('暂未开发')
      }
    },
    register () {
      this.$emit('register', 'Register')
    },
    getCaptcha () {
      this.$message.warning('暂未开发')
    },
    handleTabsChange (val) {
      this.activeKey = val
    },
    getOtherQuery (query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="less" scoped>
  .login {
    .icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }
  }
</style>
