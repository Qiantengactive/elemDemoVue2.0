<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <!-- seler传值 -->
        <img :src="seller.avatar" width="64" height="64">
      </div>
      <div class="content">
        <!-- 粥品香坊回笼观 -->
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <!-- 蜂鸟专送  -->
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!-- 减在线支付满28减5 -->
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{ seller.supports[0].description }}</span>
        </div>
        <!-- 右边5个点击事件 -->
        <div v-if="seller.supports" class="support-count" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
    </div>
    <!-- 公告栏 -->
    <div class="bullentin-wrapper">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <!--背景图-->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <!-- 优惠信息长栏 -->
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li v-for="(item,index) in seller.supports" :key="item.type" class="support-item">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <!-- 优惠信息长栏 -->
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close">
          <i class="icon-close" @click="hiddenDetail"></i>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import Star from '@/components/star/star'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    star: Star
  },
  data () {
    return {
      // classMap: [],
      detailShow: false
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    showDetail () {
      this.detailShow = true
    },
    hiddenDetail () {
      this.detailShow = false
    }
  }
}
</script>
<style lang="stylus">
@import '../../common/stylus/mixin'
.header
  position: relative
  color: #fff
  background-color: rgba(7, 17, 27, 0.5)
  overflow: hidden
  .content-wrapper
    position: relative
    padding: 24px 12px 18px 24px
    font-size: 0
    .avatar
      display: inline-block
      vertical-align: top
      img
        border-radius: 2px
    .content
      font-weight: 200
      display: inline-block
      margin-left: 16px
      .title
        margin: 2px 0 8px 0
        .brand
          display: inline-block
          vertical-align: top
          width: 30px
          height: 18px
          bg-image('brand')
          background-size: 30px 18px
          background-repeat: no-repeat
        .name
          margin-left: 2px
          font-size: 16px
          color: rgb(255, 255, 255)
          line-height: 18px
      .description
        margin-bottom: 10px
        line-height: 12px
        font-size: 12px
      .support
        .icon
          display: inline-block
          vertical-align: top
          margin-right: 4px
          width: 12px
          height: 12px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_1')
          &.discount
            bg-image('discount_1')
          &.special
            bg-image('special_1')
          &.invoice
            bg-image('invoice_1')
          &.guarantee
            bg-image('guarantee_1')
        .text
          line-height: 12px
          font-size: 10px
    .support-count
      position: absolute
      right: 12px
      bottom: 14px
      padding: 0 8px
      height: 24px
      line-height: 24px
      border-radius: 14px
      background-color: rgba(0, 0, 0, 0.2)
      text-align: center
      color: #ffffff
      .count
        vertical-align: middle
        font-size: 10px
      i
        vertical-align: middle
        margin-left: 2px
        font-size: 10px
  .bullentin-wrapper
    position: relative
    height: 28px
    line-height: 28px
    padding: 0 22px 0 12px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    background-color: rgba(7, 17, 27, 0.2)
    font-size: 0
    .bulletin-title
      display: inline-block
      vertical-align: top
      margin-top: 8px
      width: 22px
      height: 12px
      bg-image('bulletin')
      background-size: 22px 12px
      background-repeat: no-repeat
    .bulletin-text
      vertical-align: top
      margin: 0 4px
      font-size: 10px
    i
      position: absolute
      font-size: 10px
      right: 12px
      top: 8px
  .background
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    filter: blur(10px)
    z-index: -1
  .detail
    position: fixed
    top: 0
    left: 0
    z-index: 5
    width: 100%
    height: 100%
    overflow: auto
    opacity: 1
    background-color: rgba(7, 17, 27, 0.8)
    opacity: 1
    backdrop-filter: blur(10px)
    // xx-enter: 进入过渡的开始状态。在元素被插入时生效，在下一个帧移除。
    // xx-enter-active: 进入过渡的结束状态。在元素被插入时生效，在 transition/animation 完成之后移除。
    // xx-leave: 离开过渡的开始状态。在离开过渡被触发时生效，在下一个帧移除。
    // xx-leave-active: 离开过渡的结束状态。在离开过渡被触发时生效，在 transition/animation 完成之后移除。
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.3s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
    .detail-wrapper
      width: 100%
      min-height: 100%
      line-height: 28px
      .detail-main
        padding-top: 64px
        padding-bottom: 64px
        .name
          line-height: 16px
          text-align: center
          font-size: 16px
          font-weight: 700
        .star-wrapper
          margin-top: 18px
          padding: 2px 0
          text-align: center
        .title
          display: flex
          width: 80%
          margin: 30px auto 24px auto
          .line
            flex: 1px
            position: relative
            top: -12px
            border-bottom: 1px solid rgba(255, 255, 255, 0.2)
          .text
            padding: 0 12px
            font-size: 14px
            font-weight: 700
        .supports
          width: 80%
          margin: 0 auto
          .support-item
            padding: 0 12px
            margin-bottom: 12px
            font-size: 0
            &:last-child
              margin-bottom: 0
            .icon
              display: inline-block
              vertical-align: top
              margin-right: 4px
              width: 16px
              height: 16px
              background-size: 16px 16px
              background-repeat: no-repeat
              &.decrease
                bg-image('decrease_2')
              &.discount
                bg-image('decrease_2')
              &.guarantee
                bg-image('guarantee_2')
              &.invoice
                bg-image('invoice_2')
              &.special
                bg-image('special_2')
            .text
              line-height: 16px
              font-size: 12px
        .bulletin
          margin: 0 auto
          width: 80%
          .content
            padding: 0 12px
            line-height: 24px
            font-size: 12px
    .detail-close
      position: relative
      width: 32px
      height: 32px
      margin: -64px auto 0 auto
      clear: both
      font-size: 32px
</style>
