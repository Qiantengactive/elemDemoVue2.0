<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="acatar">
        <!-- seler传值 -->
        <img :src="seller.avatar" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Star from '@/components/Star/Star'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    // star: Star
  },
  data () {
    return {
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
</style>
