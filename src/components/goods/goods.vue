<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{current: currentIndex === index}" @click="selectMenu(index)">
          <span class="text border-1px">
            <span v-show="item.type > 0" class="icon icontext" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="food-list" :key="index" ref="foodList">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food,$event)" v-for="(food,index) in item.foods" :key="index" class="food-item border-1px">
                  <div class="icon">
                      <img :src="food.icon"  width="57" height="57" alt="">
                  </div>
                  <div class="content">
                      <h2 class="name">{{food.name}}</h2>
                      <p class="desc">{{food.description}}</p>
                      <div class="count">
                          <span>月售{{food.sellCount}}份</span>
                          <span>好评率{{food.rating}}%</span>
                      </div>
                      <div class="price">
                        <span class="now">￥{{food.price}}</span>
                        <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                      </div>
                      <div class="cartcontrol-wrapper">
                          <!-- 点击添加购物车 -->
                        <v-cartcontrol @add="addFood" :food="food"></v-cartcontrol>
                      </div>
                  </div>
              </li>
            </ul>
          </li>
        </ul>
    </div>
    <v-shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></v-shopcart>
    <v-food @add="addFood" :food="selectedFood" ref="food"></v-food>
  </div>
</template>
<script>
import axios from 'axios';
import BScroll from 'better-scroll';
import Shopcart from '@/components/shopcart/Shopcart';
import cartcontrol from '@/components/cartcontrol/cartcontrol';
import shopcart from '@/components/shopcart/shopcart';
import food from '@/components/food/food';

const ERR_OK = 0;

export default {
    name: 'goods',
    props: {
        seller: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data() {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            selectedFood: {},
            scrollIndex: 0
        };
    },
    components: {
        shopcart: Shopcart,
        'v-cartcontrol': cartcontrol,
        'v-shopcart': shopcart,
        'v-food': food
    },
    computed: {
        /* 判断当前index在哪 */
        currentIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];
                let a = this.scrollY + 10;
                if (!height2 || (a >= height1 && a <= height2)) {
                    return i;
                }
            }
            return 0;
        },
        selectFoods() {
            let foods = [];
            /* 如果不存在就 新建一个count */
            this.goods.forEach(good => {
                good.foods.forEach(food => {
                    if (food.count > 0) {
                        foods.push(food);
                    }
                });
            });
            return foods;
        }
    },
    methods: {
        /*  scrollToElement(el, time, offsetX, offsetY, easing)
            参数：
            {DOM | String} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
            {Number} time 滚动动画执行的时长（单位 ms）
            {Number | Boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
            {Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
            {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
            返回值：无
            作用：滚动到指定的目标元素。
            https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/api.html#scrollbyx-y-time-easing
        */
        selectMenu(index) {
            let foodList = this.$refs.foodList;
            let obj = foodList[index];
            this.foodsScroll.scrollToElement(obj, 300);
        },
        /* probeType 为
           1 会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
           2 会在屏幕滑动的过程中实时的派发 scroll 事件；
           3 不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
             如果没有设置该值，其默认值为 0，即不派发 scroll 事件。
        */
        /* better-scroll 默认会阻止浏览器的原生 click 事件。
               当设置为 true，better-scroll 会派发一个 click 事件，
               我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。
        */
        /* 初始化滚动条数据 */
        _initScroll() {
            this.menusScroll = new BScroll(this.$refs.menuWrapper, {
                click: true
            });
            this.foodsScroll = new BScroll(this.$refs.foodWrapper, {
                probeType: 3,
                click: true
            });
            /* 监听一个scroll事件 */
            this.foodsScroll.on('scroll', pos => {
                this.scrollY = Math.abs(Math.round(pos.y));
                // console.log(this.scrollY);
            });
        },
        /* 计算加载后数据的总高度 */
        _calculateheight() {
            let foodList = this.$refs.foodList;
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodList.length; i++) {
                let item = foodList[i];
                height += item.clientHeight;
                this.listHeight.push(height);
                console.log(this.listHeight);
            }
        },
        _drop(target) {
            /* 父调子方法 */
            this.$refs.shopcart.drop(target);
        },
        addFood(target) {
            console.log('子调goods父的组件addFood');
            this._drop(target);
        },
        selectFood(food, event) {
            /* better-scroll 默认会阻止浏览器的原生 click 事件。
               当设置为 true，better-scroll 会派发一个 click 事件，
               我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。
             */
            // if (!event._construce) {}
            this.selectedFood = food;
            this.$refs.food.show();
        }
    },
    created() {
        this.classMap = [
            'decrease',
            'discount',
            'special',
            'invoice',
            'guarantee'
        ];
        axios
            .get('https://easy-mock.com/mock/5a2c0caf5cc9df286973e8d2/goods')
            .then(res => {
                if (res.data.errno === ERR_OK) {
                    this.goods = res.data.data;
                    console.log(this.goods);
                    /* 页面加载完毕之后 */
                    this.$nextTick(() => {
                        this._initScroll();
                        this._calculateheight();
                    });
                }
            });
    },
    mounted() {
        console.log(this.goods);
    }
};
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/mixin'
.goods
    position:absolute
    display: flex
    width: 100%
    top: 174px
    bottom: 46px
    overflow: hidden
    .menu-wrapper
        flex: 0 0 80px
        width:80px
        background-color: #f3f5f7
        font-size: 0
        .menu-item
            display: table
            padding: 0 12px
            width: 56px
            height: 54px
            line-height:14px
            font-size: 0px
            &.current
                position: relative
                margin-top: -1px
                background-color: #fff
                font-weight: 700px
                z-index: 1
                .text
                    border-none()
            .text
                font-size: 12px
                vertical-align: middle
                display: table-cell
                width: 56px
                line-height: 14px
                font-weight:200
                border-1px(rgba(7,17,27,0.1))
                .icon
                    display: inline-block
                    vertical-align: top
                    margin-right: 2px
                    width: 16px
                    height: 16px
                    background-size: 16px 16px
                    background-repeat: no-repeat
                    &.decrease
                        bg-image('decrease_3')
                    &.discount
                        bg-image('discount_3')
                    &.guarantee
                        bg-image('guarantee_3')
                    &.invoice
                        bg-image('invoice_3')
                    &.special
                        bg-image('special_3')
    .foods-wrapper
        flex: 1
        .title
            padding-left: 14px
            height: 26px
            line-height: 26px
            border-left: 4px solid #d9dded
            font-size: 12px
            color: rgb(147,153,159)
            background-color: #f3f5f7
        .food-item
            margin: 18px
            padding-bottom: 18px
            display: flex
            border-1px(rgba(7,17,27,0.1))
            &:last-child
                border-none()
                margin-bottom:0
            .icon
                flex:0 0 57px
                margin-right: 10px
            .content
                flex: 1
                .name
                    margin: 2px 0 8px 0
                    height: 14px
                    line-height: 14px
                    font-size: 14px
                    color: rgb(7,17,27)
                .desc, .extra
                    line-hright: 10px
                    font-size: 10px
                    color: rgb(147,153,27)
                .desc
                    margin-bottom:8px
                    line-height: 12px
                .extra
                .count
                    margin-right: 12px
                .price
                    font-size: 0
                    font-weight: 400
                    line-height: 24px
                    .now
                        margin-right: 8px
                        font-size: 14px
                        color: rgb(240,20,20)
                    .old
                        text-decoration: line-through
                        font-size: 10px
                        color: rgb(147,153,159)
                .cartcontrol-wrapper
                    position:absolute
                    right 0
                    bottom: 12px
</style>
