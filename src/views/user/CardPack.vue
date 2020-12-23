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
        <div class="card-container" v-if="!isVip&&!isBuying">
          <div class="no-card">
            <img src="@/assets/img/no-card.png" alt="暂无会员卡">
            <div style="margin-bottom: 20px">暂无影城会员卡</div>
            <a-button type="danger" :block="isMobile" @click="startBuyVip"><a-icon type="plus-circle" theme="filled"/>立即开通</a-button>
          </div>
        </div>
        <div class="card-container" v-else-if="!isVip&&isBuying">
          <h1>热销中的会员卡</h1>
          <div :style="vipCardStyleObj(item.type)"
               class="vip-card"
               v-for="(item, index) in vipInfoList" :key="index">
            <div class="vip-card-name" @click="openPayModal(item.type)">
              <a-avatar :src="vipIcon" :size="40"/>
              <div>
                <h2>{{ item.type }}</h2>
                <p>购票{{ item.discount | discountFormat }}</p>
              </div>
            </div>
            <div class="vip-card-footer">
              <div class="card-desc">
                <a-tooltip title="充值策略，使用银行卡购买会员卡后即可享受">
                  <a-icon type="question-circle"/>
                </a-tooltip>
                {{ item.description }}
              </div>
              <div class="card-status">售价：￥{{ item.price }}</div>
            </div>
          </div>
        </div>
        <div class="card-container" v-else>
          <div :style="vipCardStyleObj(vipInfo.type)"
               class="vip-card">
            <div class="vip-card-name" @click="openPayModal(vipInfo.type)">
              <a-avatar :src="vipIcon" :size="40"/>
              <div>
                <h2>{{ vipInfo.type }}</h2>
                <p>购票{{ vipInfo.discount | discountFormat }}</p>
              </div>
            </div>
            <div class="vip-card-footer">
              <div class="card-desc">
                <a-tooltip title="充值策略，使用银行卡购买会员卡后即可享受">
                  <a-icon type="question-circle"/>
                </a-tooltip>
                {{ vipInfo.description }}
              </div>
              <div class="card-status">余额：￥{{ vipInfo.balance | fixedNumber }}</div>
            </div>
          </div>
        </div>
        <a-modal
          :title="modalTitle"
          :visible="modalVisible"
          ok-text="确认支付"
          cancel-text="取消"
          @ok="submitPayment"
          @cancel="handleCancel"
        >
          <a-form-model
            :model="form"
            ref="payForm"
            :rules="payFormRules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="银行卡号"
                               prop="card">
              <a-input
                allow-clear
                ref="card"
                placeholder="银行卡号：123123123"
                v-model="form.card"/>
            </a-form-model-item>
            <a-form-model-item label="支付密码"
                               prop="password">
              <a-input-password
                allow-clear
                placeholder="银行卡密码：123123"
                ref="password"
                v-model="form.password"/>
            </a-form-model-item>
            <a-form-model-item label="充值金额"
                               prop="amount"
                               v-if="isVip">
              <a-input-number placeholder="充值金额"
                              v-model="form.amount"/>
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </a-tab-pane>
      <a-tab-pane key="2" tab="优惠券">
        <div class="card-container">
          <div v-if="coupons.length>0" class="coupon-list">
            <div class="coupon-wrapper"
                 v-for="(item,index) in coupons" :key="index">
              <div class="coupon">
                <div class="coupon-left">
                  <div style="font-size: 24px;font-weight: 600"><span
                    style="font-size: 32px; font-weight: 800">{{ item.discountAmount }}</span>元
                  </div>
                  <div style="font-size: 20px">代金券</div>
                  <div style="font-size: 20px">满<b>{{ item.targetAmount }}</b>可用</div>
                </div>
                <div class="coupon-right">
                  <div>
                    <h1>{{ item.name }}</h1>
                    <p>{{ item.description }}</p>
                  </div>
                  <div class="range-status">有效期 {{ item.startTime | dateformat }} 至 {{ item.endTime | dateformat }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="no-card" v-else>
            <img src="@/assets/img/no-coupon.png" alt="暂无优惠券">
            <div style="margin: 20px 0">你还没有优惠券~</div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import vipIcon from '@/assets/img/vip.png'

export default {
  name: 'CardPack',
  data () {
    return {
      backIcon: <a-icon type="link"/>,
      isBuying: false,
      vipIcon,
      modalVisible: false,
      buyType: '', // 会员卡种类
      form: {
        card: '',
        password: ''
      },
      payFormRules: {
        card: [
          {
            required: true,
            message: '请输入您的银行卡号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入您的密码',
            trigger: 'blur'
          }
        ]
      },
      labelCol: {
        md: { span: 4 },
        sm: { span: 6 }
      },
      wrapperCol: {
        md: { span: 20 },
        sm: { span: 18 }
      }
    }
  },
  computed: {
    ...mapState({
      vipInfoList: state => state.user.vipCardInfoList,
      isVip: state => state.user.isVip,
      vipInfo: state => state.user.memberCardInfo,
      coupons: state => state.user.coupons
    }),
    isMobile () {
      return this.$store.state.device === 'mobile'
    },
    modalTitle () {
      return !this.isVip ? '购买会员卡' : '充值会员卡'
    }
  },
  filters: {
    discountFormat (discount) {
      if (discount === 1) {
        return '不打折'
      } else {
        return `${String(discount).split('.')[1]}折`
      }
    }
  },
  mounted () {
    this.fetchVipInfo()
    this.fetchCoupons()
  },
  methods: {
    ...mapActions('user', {
      becomeVip: 'buyVipCard',
      charge: 'chargeVipCard',
      fetchVipInfo: 'updateVipInfo',
      fetchCoupons: 'fetchCoupons'
    }),
    startBuyVip () {
      this.isBuying = true
    },
    vipCardStyleObj (type) {
      const colors = ['#0063B1', '#333', '#fadb14']
      const typeDict = {
        普通卡: 0,
        黑铁卡: 1,
        铂金卡: 2
      }
      return {
        backgroundColor: colors[typeDict[type]]
      }
    },
    openPayModal (type) {
      this.buyType = type
      this.modalVisible = true
    },
    async submitPayment () {
      this.$refs.payForm.validate(async valid => {
        if (valid) {
          if (this.form.card === '123123123' && this.form.password === '123123') {
            try {
              if (!this.isVip) {
                await this.becomeVip(this.buyType)
              } else {
                await this.charge(this.form.amount)
              }
              this.$message.success('支付成功')
            } catch (e) {
              this.$message.error('支付失败')
            }
          } else {
            this.$message.error('银行卡密码错误，请重新输入')
          }
          this.modalVisible = false
        } else {
          return false
        }
      })
    },
    handleCancel () {
      this.modalVisible = false
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/style/variables";
@import "~@/assets/style/utils";

.card-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .no-card {
    text-align: center;
  }

  .vip-card {
    border-radius: @img-radius;
    color: #fff;
    background-size: 100%;
    width: 50%;
    height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: @base-interval;
    @media (max-width: @mobile-screen-width) {
      width: 340px;
    }

    &-name {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80%;
      cursor: pointer;

      div {
        height: calc(@base-interval * 2);
        line-height: @base-interval;
        padding-left: @base-interval;

        h2 {
          margin: 0;
          color: #fff;
          .textOverflow()
        }

        p {
          opacity: .8;
          margin: 0;
        }
      }
    }

    &-footer {
      box-sizing: border-box;
      background-color: rgba(0, 0, 0, 0.08);
      border-radius: 0 0 @img-radius @img-radius;
      display: flex;
      justify-content: space-between;
      padding: 0 @base-interval;
    }
  }
}

.coupon-list {
  width: 100%;
  .coupon-wrapper {
    margin-bottom: @base-interval;
    border-radius: @img-radius;
    border: 1px solid @base-border-color;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .09);

    .coupon {
      display: flex;
      width: 100%;

      &-left {
        background-color: @primary-color;
        padding: @base-interval 0;
        flex-basis: 108px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        border-radius: @img-radius 0 0 @img-radius;
      }
      &-right{
        padding: 10px 0 0 @base-interval;
        border-left: 1px dashed @primary-color;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        @media (max-width: @mobile-screen-width) {
          padding-left: 10px;
        }
        .range-status{
          border-top: 1px solid @base-border-color;
          text-align: right;
          align-self: flex-end;
          width: 100%;
          padding-right: @base-interval;
          @media (max-width: @mobile-screen-width) {
            padding-right: 4px;
          }
        }
      }
    }
  }
}
</style>
