// pages/order/index/index.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prefix: app.globalData.prefix,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id:options.orderId
    })
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.orderInfo()
    app.globalData.aData.show = true;
  },
  /**
   * 客服电话
   */
  phone(){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.orderInfo.tel
    })
  },
    /**
   * 订单详情
   */
  orderInfo() {
    var that = this;
    var appid = app.globalData.appid;
    var id = that.data.id;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid,id:id, timeStamp: timeStamp, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = { appid: appid, timeStamp: timeStamp, sign: sign, id: id, }
    rs.getRequests("orderInfo", data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          orderInfo:res.data.data,
        })
        console.log(res.data.data)
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})