<template>
    <div>
        <div class="shopcart">
            <div class="content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{highlight: totalCount >0}">
                            <!-- 购物车小车 -->
                            <i class="icon-shopping_cart" :class="{highlight: totalCount>0}"></i>
                        </div>
                        <!--购物车右上角购买数量 -->
                        <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
                    </div>
                    <div class="price" :class="{ highlight:totalPrice > 0 }">￥{{totalPrice}}</div>
                    <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
                </div>
                <div class="content-right">
                    <div class="pay" :class="{enough: totalPrice >= minPrice}" @click.stop.prevent="pay">{{payDesc}}</div>
                </div>

                <!-- 动画小球部分 -->
                <div class="ball-container">
                    <div v-for="(ball,index) in balls" :key="index">
                        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
                            <div v-show="ball.show" class="ball">
                                <div class="inner inner-hook"></div>
                            </div>
                        </transition>
                    </div>
                </div>
                <!-- 购物车页面 -->
                <transition name="fold">
                    <div class="shopcart-list" v-show="listShow">
                        <div class="list-header">
                            <h1 class="title">购物车</h1>
                            <div class="empty" @click="empty">清空</div>
                        </div>
                        <div class="list-content" ref="listContent">
                            <ul>
                                <li class="food" v-for="(foodItem,index) in selectFoods" :key="index">
                                    <span class="name">{{foodItem.name}}</span>
                                    <div class="price">
                                        <span>￥{{foodItem.price * foodItem.count}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <v-cartcontrol @add="addFood" :food="foodItem"></v-cartcontrol>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <!-- 购物车列表显示后背景虚化页面 -->
        <transition name="fade">
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import cartcontrol from '@/components/cartcontrol/cartcontrol';
export default {
    props: {
        selectFoods: {
            type: Array,
            default: function () {
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
    components: {
        'v-cartcontrol': cartcontrol
    },
    data () {
        return {
            balls: [
                { show: false },
                { show: false },
                { show: false },
                { show: false },
                { show: false }
            ],
            dropBalls: [],
            fold: true
        };
    },
    computed: {
        totalPrice () {
            console.log('我是shopcart购物车组件中的totalPrice');
            let total = 0;
            this.selectFoods.forEach(food => {
                total += food.price * food.count;
            });
            return total;
        },
        /* 计算订单总个数 */
        totalCount () {
            console.log('我是shopcart购物车组件中的totalCount');
            let count = 0;
            this.selectFoods.forEach(food => {
                count += food.count;
            });
            return count;
        },
        payDesc () {
            console.log('我是shopcart购物车组件中的payDesc');
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}起送`;
            } else if (this.totalPrice < this.minPrice) {
                let differenceValue = this.minPrice - this.totalPrice;
                return `还差￥${differenceValue}元起送`;
            } else {
                return '去结算';
            }
        },
        listShow () {
            console.log('我是shopcart购物车组件中的listShow');
            return this.listShow1();
        }
    },
    methods: {
        listShow1 () {
            /* 没点单 fold为true */
            if (!this.totalCount) {
                this.fold = true;
                return false;
            }
            let show = !this.fold;
            if (show) {
                this.$nextTick(() => {
                    // alert('show' + show);
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.listContent, {
                            click: true
                        });
                    } else {
                        /* 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。 */
                        this.scroll.refresh();
                    }
                });
            }
            return show;
        },
        toggleList () {
            if (!this.totalCount) {
                return false;
            } else {
                this.fold = !this.fold;
            }
        },
        pay () {
            if (this.totalPrice < this.minPrice) {
                return false;
            } else {
                window.alert(`请支付${this.totalPrice}元`);
            }
        },
        empty () {
            this.selectFoods.forEach(food => {
                food.count = 0;
            });
        },
        hideList () {
            this.fold = true;
        },
        drop (el) {
            for (let i = 0; i < this.balls.length; i++) {
                let ball = this.balls[i];
                if (!ball.show) {
                    ball.show = true;
                    // 将点击的小球Dom存入ball数组中
                    ball.el = el;
                    this.dropBalls.push(ball);
                    // console.log(this.dropBalls.length);
                    return;
                }
            }
        },
        beforeDrop (el) {
            let count = this.balls.length;
            while (count--) {
                let ball = this.balls[count];
                if (ball.show) {
                    /* 获取小球的相对于视口的位移(小球高度) */
                    let rect = ball.el.getBoundingClientRect();
                    let x = rect.left - 32;
                    let y = -(window.innerHeight - rect.top - 22);
                    el.style.display = '';
                    el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
                    el.style.transform = `translate3d(0, ${y}px, 0)`
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                    inner.style.transform = `translate3d(${x}px,0,0)`;
                    console.log('beforeDrop');
                }
            }
        },
        // dropping (el, done) {
        dropping (el) {
            /* eslint-disable no-unused-vars */
            let rf = el.offsetHeight; // 浏览器重绘
            this.$nextTick(() => {
                el.style.webkitTransform = 'translate3d(0, 0, 0)'
                el.style.transform = 'translate3d(0, 0, 0)'
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d(0, 0, 0)'
                inner.style.transform = 'translate3d(0, 0, 0)'
                // el.addEventListener('transitionend', done);
            });
        },
        afterDrop (el) {
            /* shift 删除数组
            shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
            如果数组是空的，那么 shift() 方法将不进行任何操作，返回 undefined 值。
            */
            let ball = this.dropBalls.shift();
            if (ball) {
                ball.show = false;
                el.style.display = 'none';
            }
        },
        addFood (target) {
            console.log('子调shopcart父的组件addFood');
            this.drop(target);
        }
    }
};
</script>
<style lang="stylus">
// @import '../../common/stylus/mixin.styl'
// .shopcart
//     position: fixed
//     left: 0
//     bottom: 0
//     z-index: 4
//     width: 100%
//     height: 48px
//     .content
//         display: flex
//         background-color: #141d27
//         color: rgba(255, 255, 255, 0.4)
//         .content-left
//             flex: 1
//             font-size: 0
//             .logo-wrapper
//                 position: relative
//                 top: -10px
//                 margin: 0 12px
//                 padding: 6px
//                 display: inline-block
//                 vertical-align: top
//                 width: 56px
//                 height: 56px
//                 box-sizing: border-box
//                 border-radius: 50%
//                 background-color: #141d27
//                 text-align: center
//                 .logo
//                     width: 100%
//                     height: 100%
//                     border-radius: 50%
//                     background-color: #2b343c
//                     &.highlight
//                         background-color: rgb(0, 160, 220)
//                     .icon-shopping_cart
//                         line-height: 44px
//                         color: #80858a
//                         font-size: 24px
//                         &.highlight
//                             color: #fff
//                 .num
//                     position: absolute
//                     top: 0
//                     right: 0
//                     width: 24px
//                     height: 16px
//                     line-height: 16px
//                     text-align: center
//                     border-radius: 16px
//                     font-size: 9px
//                     font-weight: 700
//                     color: #ffffff
//                     background-color: rgb(240, 20, 20)
//                     box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
//             .price
//                 margin-top: 12px
//                 padding-right: 12px
//                 display: inline-block
//                 vertical-align: top
//                 line-height: 24px
//                 box-sizing: border-box
//                 border-right: 1px solid rgba(255, 255, 255, 0.1)
//                 font-size: 16px
//                 font-weight: 700
//                 &.highlight
//                     color:#fff
//             .desc
//                 margin: 12px 0 0 12px
//                 display: inline-block
//                 vertical-align: top
//                 line-height: 24px
//                 font-size: 10px
//         .content-right
//             flex: 0 0 105px
//             width: 105px
//             .pay
//                 height: 48px
//                 line-height: 48px
//                 text-align: center
//                 font-size: 12px
//                 font-weight: 700
//                 background-color: #2b333b
//                 &.enough
//                     color: #ffffff
//                     background-color: #00b43c
//     .ball-container
//         .ball
//             position: fixed
//             left: 32px
//             bottom: 22px
//             z-index: 1
//             transition：all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
//             .inner
//                 width: 16px
//                 height: 16px
//                 border-radius: 50%
//                 background: rgb(0, 160, 220)
//                 transition: all 0.4s linear
//     .shopcart-list
//         position: absolute
//         top: 0
//         left: 0
//         z-index: -1
//         width: 100%
//         transform: translate3d(0, -100%, 0)
//         &.fold-enter-active, &.fold-leave-active
//             transition: all 0.5s
//         &.fold-enter, &.fold-leave-active
//             transform: translate3d(0, 0, 0)
//         .list-header
//             padding: 0 18px
//             height: 40px
//             line-height: 40px
//             background-color: #f3f5f7
//             border-bottom: 1px solid rgba(7, 17, 27, 0.1)
//             .title
//                 float: left
//                 font-size: 14px
//                 color: rgb(7, 17, 27)
//             .empty
//                 float: right
//                 font-size: 12px
//                 color rgb(0, 160, 220)
//         .list-content
//             padding: 0 18px
//             max-height: 200px
//             background-color: #fff
//             overflow: hidden
//             .food
//                 position: relative
//                 padding: 12px 0
//                 box-sizing: border-box
//                 border-1px(rgba(7, 17, 27, 0.1))
//                 border-none()
//                 .name
//                     line-height: 14px
//                     font-size: 14px
//                     color: rgb(7, 17, 27)
//                 .price
//                     position: absolute
//                     right: 90px
//                     bottom: 12px
//                     line-height: 24px
//                     font-size: 14px
//                     font-weight: 700
//                     color: rgb(240, 20, 20)
//                 .cartcontrol-wrapper
//                     position: absolute
//                     right: 0
//                     bottom: 6px
// .list-mask
//     position: fixed
//     left: 0
//     top: 0
//     width: 100%
//     height: 100%
//     backdrop-filter: blur(10px)
//     // filter: blur(10px)
//     z-index: 3
//     opacity: 1
//     background: rgba(7, 17, 27, 0.6)
//     &.fade-enter-active, &.fade-leave-active
//         transition: all 0.5s
//     &.fade-enter, &.fade-leave-active
//         opacity: 0
//         background: rgba(7, 17, 27, 0)
@import '../../common/stylus/mixin.styl'
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 4
    width 100%
    height 48px
    .content
      display flex
      background-color #141d27
      color rgba(255, 255, 255, 0.4)
      .content-left
        flex 1
        font-size: 0
        .logo-wrapper
          position relative
          top -10px
          margin 0 12px
          padding 6px
          display inline-block
          vertical-align top
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background-color #141d27
          text-align center
          .logo
            width 100%
            height 100%
            border-radius 50%
            background-color #2b343c
            &.highlight
              background-color rgb(0, 160, 220)
            .icon-shopping_cart
              line-height 44px
              color #80858a
              font-size: 24px
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background-color rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          margin-top 12px
          padding-right 12px
          display inline-block
          vertical-align top
          line-height 24px
          box-sizing border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size 16px
          font-weight 700
          &.highlight
            color #fff
        .desc
          margin 12px 0 0 12px
          display inline-block
          vertical-align top
          line-height 24px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          background-color #2b333b
          &.enough
            color #fff
            background-color #00b43c
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 1
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        padding 0 18px
        height 40px
        line-height 40px
        background-color #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        padding 0 18px
        max-height 217px
        background-color #fff
        overflow hidden
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height 14px
            font-size 14px
            color rgb(7, 17, 27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px

  .list-mask
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    backdrop-filter: blur(10px)
    z-index 3
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
