<template>
    <div class="cartcontrol">
      <transition name="move">
        <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart">
          <i class="icon-remove_circle_outline"></i>
        </div>
      </transition>
      <div class="cart-count" v-show="food.count > 0 ">{{ food.count }}</div>
      <div class="cart-add" @click.stop.prevent="addCart">
        <i class="icon-add_circle"></i>
      </div>
    </div>
</template>
<script>
import Vue from 'vue';
export default {
    name: 'cartcontrol',
    props: {
        food: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    methods: {
        addCart() {
            if (!this.food.count) {
                Vue.set(this.food, 'count', 1);
            } else if (this.food.count > 0) {
                this.food.count++;
            } else {
                this.food.count = 0;
            }
            console.log(event);
            console.log(event.target);
            this.$emit('add', event.target);
        },
        decreaseCart() {
            this.food.count--;
        }
    }
};
</script>
<style lang="stylus" scoped>
.cartcontrol
  font-size: 0
  .cart-decrease
    display: inline-block
    padding: 6px
    opacity: 1
    .icon-remove_circle_outline
      display:inline-block
      line-height: 24px
      font-size: 10px
      color: rgb(0,160,220)
  &.move-enter-active, &.move-leave-active
  &.move-enter, &.move-leave-active
    opacity: 0
  .cart-count
    vertical-align: top
    display: inline-block
    padding-top: 6px
    width: 12px
    line-height: 24px
    text-align: center
    font-size: 10px
    color:rgb(147,153,159)
  .cart-add
    display: inline-block
    padding: 6px
    .icon-add_circle
      line-height: 24px
      font-size: 24px
      color: rgb(0,160,220)
</style>
