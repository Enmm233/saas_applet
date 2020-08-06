// components/keyBoard/index.js
import Toast from '@vant/weapp/toast/toast';
let app = getApp();
let {
  prefix,
} = app.globalData;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isHidden: {
      type: Boolean,
      value: true
    },
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    val: '',
    count:1,
    prefix: prefix,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    montage(e) {
      let str = this.data.val;
       let count=this.data.count;
      var reg = /^\d+$|^\d*\.\d+$/g;
      if(str == '' && e.currentTarget.dataset.num == '.'){
        Toast('请先输入数字');
        return;
      }
     
      if (e.currentTarget.dataset.num == '.'&&count==1){
      
        str += e.currentTarget.dataset.num
        this.setData({
          val: str,
          count:2
        })
      
       
      }
      if (e.currentTarget.dataset.num != '.') {
        str += e.currentTarget.dataset.num
        this.setData({
          val: str
        })}
       
      
      
    },
    delete() {
      let str = this.data.val;
      let newstr = str.substring(0, str.length - 1);
        if(newstr.indexOf('.')<0){
          this.setData({
           count:1
          })
        }
      this.setData({
        val: newstr
      })
    },
    clean() {
      this.setData({
        val: "", count: 1
      })
    },
    cancel() {
      this.setData({
        isHidden: true,
        val: "",
        count:1
      })
    },
    confirm(){
      this.triggerEvent('enterKey',{
        val:this.data.val
      });
      this.setData({
        val: "", count: 1
      })
    }
  }
})