// componets/footer/footer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeIndex:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   tabars:[ {
      pagePath:'pages/index/index/index',
       inactive:'../../images/index_gray.png',
       active:'../../images/index_green.png',
       title:'首页'
     },{
       pagePath:'pages/classify/index/index',
       inactive:'../../images/classify_gray.png',
       active: '../../images/classify_green.png',
       title: '分类'
     },{
       pagePath: 'pages/shopcart/index/index',
       inactive: '../../images/shopcart_gray.png',
       active: '../../images/shopcart_green.png',
       title: '购物车'
     }, {
       pagePath: 'pages/order/index/index',
       inactive: '../../images/order_gray.png',
       active: '../../images/order_green.png',
       title: '订单'
     }, {
       pagePath: 'pages/user/index/index',
       inactive: '../../images/user_gray.png',
       active: '../../images/user_green.png',
       title: '我的'
     }
   ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabBarUrl(e){
     const data= e.currentTarget.dataset;
       getApp().globalData.isFresh=true;
      wx.switchTab({
        url: `/${data.path}`,
      })
   }
  }
})
