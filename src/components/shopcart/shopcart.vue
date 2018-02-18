<template>
<div class="shopcart">
  <div class="content" @click="toggleList">
    <div class="content-left">
      <div class="logo-wrapper">
        <div class="logo">
          <!-- 购物车小车 -->
          <i class="icon-shopping_cart"></i>
        </div>
        <!--购物车右上角购买数量 -->
        <div class="num" v-show="totalPrice > 0">{{totalPrice}}</div>
      </div>
      <div class="price" :class="{ highlight:totalPrice > 0 }">￥{{totalPrice}}</div>
      <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
    </div>
    <div class="content-right">
      <div class="pay" :class="{enough: totalPrice >= minPrice}" @click.stop.prevent="pay">{{payDesc}}</div>
    </div>
    <div class="ball-container">
      <div v-for="(ball,index) in balls" :key="index">
        <div v-show="ball.show" class="ball">
          <div class="inner inner-hook"></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
    props: {
        selectFoods: {
            type: Array,
            default: function() {
                return [];
            }
        },
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            balls: [],
            fold: true
        };
    },
    computed: {
        totalPrice() {
            let total = 0;
            this.selectFoods.forEach(food => {
                total += food.price * food.count;
            });
            return total;
        },
        payDesc() {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}起送`;
            } else if (this.totalPrice < this.minPrice) {
                let differenceValue = this.minPrice - this.totalPrice;
                return `还差￥${differenceValue}元起送`;
            } else {
                return '去结算';
            }
        }
    },
    methods: {
        toggleList() {
            if (!this.totalCount) {
                return false;
            } else {
                this.fold = !this.fold;
            }
        },
        pay() {
            if (this.totalPrice < this.minPrice) {
                return false;
            } else {
                window.alert(`请支付${this.totalPrice}元`);
            }
        },
        empty() {
            this.selectFoods.forEach(food => {
                food.count = 0;
            });
        },
        hideList() {
            this.fold = true;
        }
    }
};
</script>
<style lang="stylus">
@import '../../common/stylus/mixin.styl';
.shopcart
  position: fixed
  left: 0
  bottom: 0
  z-index: 4
  width: 100%
  height: 48px
  .content
    display: flex
    background-color: #141d27
    color: rgba(255,255,255,0.4)
    .content-left
      flex:1
      font-size: 0
      .logo-wrapper
        position: relative
        top: -10px
        margin: 0 12px
        padding: 6px
        display: inline-block
        vertical-align: top
        width: 56px
        height: 56px
        box-sizing: border-box
        border-radius: 50%
        background-color: #141d27
        text-align: center
        .logo
          width: 100%
          height: 100%
          border-radius: #2b343c
          &.highlight
            background-color: rgb(0,160,220)
          .icon-shopping_cart
            line-height: 44px
            color: #80858a
            font-size: 24px
            &.highlight
              color:#fff
        .num
          position: absolute
          top: 0
          right:0
          width: 24px
          height: 16px
          line-height: 16px
          text-align: center
          border-radius: 16px
          font-size: 9px
          font-weight: 700
          color: #ffffff
          background-color:rgb(240,20,20)
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
      .price
        margin-top: 12px
        padding-right: 12px
        display: inline-block
        vertical-align: top
        line-height: 24px
        box-sizing: border-box
        border-right: 1px solid rgba(255,255,255,0.1)
        font-size: 16px
        font-weight: 700
      .desc
        margin: 12px 0 0 12px
        display: inline-block
        vertical-align: top
        line-height: 24px
        font-size: 12px
    .content-right
      flex: 0 0 105px
      width: 105px
      .pay
        height: 48px
        line-height: 48px
        text-align: center
        font-size: 12px
        font-weight: 700
        background-color: #2b333b
        &.enough
          color: #ffffff
          background-color: #00b43c
</style>
