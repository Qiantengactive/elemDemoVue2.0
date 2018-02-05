<template>
  <div id="app">
    <v-header></v-header>
    <div class="tab">
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
      content
    </div>
  </div>
</template>

<script>
import axios from "axios";
import heade from "./components/heade/heade";
const ERR_OK = 0;
export default {
    name: "App",
    data() {
        return {
          
        };
    },
    components: {
        "v-header": heade
    },
    created() {
        axios
            .get("https://easy-mock.com/mock/5a2c0caf5cc9df286973e8d2/seller")
            .then(res => {
              if(res.data.errno=== ERR_OK){

                  console.log(res);
              }
            });
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" >
#app {
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-1px(rgba(7, 17, 27, 0.1));

    .tab-item {
      flex: 1;
      text-align: center;
    }
  }
}
</style>
