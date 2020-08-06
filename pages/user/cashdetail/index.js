// pages/user/cashdetail/index.js
import Toast from '@vant/weapp/toast/toast';
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js')
let app = getApp();
let {
  appid,
  appsecret,
  prefix
} = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prefix:prefix,
    id: 252,
    detailList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {
      id
    } = options;
    this.setData({
      id: id
    })
    this.list()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  list() {
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var {
      id
    } = this.data;
    var obj = {
      appid: appid,
      id: id,
      timeStamp: timeStamp,
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var params = Object.assign({
      sign: sign
    }, obj)

    rs.getRequests("couponsDetails", params, (res) => {
      if(res.data.code==200){
        this.setData({
          detailList:res.data.data
        })
      }
    })
  }
})