// components/steper/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    plus() {
      this.triggerEvent('plus');
    },
    minus(){
      this.triggerEvent('minus');
    },
    focus() {
      this.triggerEvent('focus');
    }
  }
})