<template>
  <div class="consumption-card">
    <div class="consumption-card-poster-wrapper">
      <img v-if="consumptionInfo.type===0" v-bind:src="consumptionInfo.posterUrl" class="image">
      <img v-else-if="consumptionInfo.type===1"
           src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608623950622&di=e8482bf6df12cf494cf16f7ae64f7d9a&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_water_img%2F19%2F02%2F23%2F04919114a0420d7d35e19ed8314c9a10.jpg"
           class="image">
    </div>
    <div class="consumption-card-info">
      <h3 class="consumption-title">{{ consumptionInfo.movieName }}</h3>
      <div style="display: block">
        <p class="consumption-info">影院：新街口RandomTheatre（德基广场店）</p>
        <p v-if="consumptionInfo.type===0" class="consumption-info">场次：{{ consumptionInfo.movieTime | dateFormat }}</p>
        <p v-if="consumptionInfo.type===0" class="consumption-info">数量：<span>{{ consumptionInfo.ticketNum }}</span>张</p>
      </div>
    </div>
    <div class="consumption-afford-box">
      <div class="consumption-price" style="color: #222222">支付日期：<span>{{ consumptionInfo.time | dateFormat }}</span>
      </div>
      <div class="consumption-price-box">
        <div class="consumption-price" style="color: #666666">总价：<span>{{ consumptionInfo.total.toFixed(2) }}</span>
        </div>
        <div class="consumption-price" style="color: #222222">实付：<span>{{ consumptionInfo.pay.toFixed(2) }}</span></div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/utils/format-date'

export default {
  name: 'ConsumptionCard',
  computed: {},
  props: {
    consumptionInfo: Object
  },
  filters: {
    dateFormat (time) {
      return formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>
<style scoped lang="less">
@import "~@/assets/style/variables";
@import "~@/assets/style/utils";

.consumption-card {
  padding: @base-interval;
  display: flex;
  border-radius: @base-interval;
  border: 1px solid @base-border-color;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .09);
  align-items: flex-end;
  @media (max-width: @mobile-screen-width) {
    border-radius: 0;
    border: none;
    box-shadow: none;
  }
  //width: 800px;
  //&:hover {
  //  border-color: rgba(0, 0, 0, .09);
  //}

  &-poster-wrapper {
    flex-shrink: 0;
    height: @consumption-card-height;
    width: @consumption-card-width;

    img {
      border-radius: @consumption-card-pic-interval;
      height: 100%;
      width: 100%;

    }
  }

  &-info {
    height: @consumption-card-height;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: @base-interval;
    margin-right: 50px;
    @media (max-width: @mobile-screen-width) {
      margin-right: 0;
      padding-left: 8px;
    }
  }
}

.consumption-title {
  //font-size: 16px;
  margin-bottom: 8px;
  @media (max-width: @mobile-screen-width) {
    margin-bottom: 4px;
  }
  //color: #222222;
}

.consumption-info {
  font-size: 12px;
  margin-bottom: 0;
  //color: #666666;
}

.consumption-afford-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.consumption-price {
  font-size: 14px;
  margin: 0 10px 0 0;
  //width: 300px;
}

.consumption-price-box {
  display: flex;
  align-items: flex-end;
}
</style>
