<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link class="link" to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link class="link" to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link class="link" to="/seller">商家</router-link>
      </div>
    </div>
    <div class="content">
      <router-view :seller="seller"></router-view>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import heade from './components/heade/heade'
import { urlParse } from '@/common/js/util'
const ERR_OK = 0
export default {
  name: 'App',
  data () {
    return {
      seller: {
        // 只执行一次
        id: (() => {
          let queryParam = urlParse()
          return queryParam.id
        })()
      }
    }
  },
  components: {
    'v-header': heade
  },
  created () {
    axios
      .get('https://easy-mock.com/mock/5a2c0caf5cc9df286973e8d2/seller')
      .then(res => {
        if (res.data.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, res.data.data)
          console.log(this.seller)
        }
      })
  }
}
</script>

<style lang="stylus">
// css导入
@import './common/stylus/mixin.styl'
#app
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > .link
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
