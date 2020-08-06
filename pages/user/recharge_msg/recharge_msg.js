// pages/user/recharge_msg/recharge_msg.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      orderId: options.orderId
    })
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
    var that = this;
    that.placeRecharge()
  },
  /**
   * 页面跳转
   */
  //首页
  index() {

    wx.switchTab({
      url: '../../index/index/index',
    })
  },
  /**
   * 充值信息
   */
  placeRecharge() {
    var that = this
    var appid = app.globalData.appid;
    var id = that.data.orderId;
    var type = 'mini';
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = {
      appid: appid,
      id: id,
      type: type,
      timeStamp: timeStamp,
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = {
      appid: appid,
      id: id,
      type: 'mini',
      timeStamp: timeStamp,
      sign: sign,
    }
    rs.postRequests("placeRecharge", data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          placeRecharge: res.data.data
        })
      }else if (res.data.code == 406) {
        rs.showToast('请先绑定微信', "none", (res) => {})
      }else{
        Toast(res.data.msg)
      }
    })
  },
  querenchongzhi() {
    var that = this
    wx.requestPayment({
      timeStamp: that.data.placeRecharge.wxParams.timeStamp,
      nonceStr: that.data.placeRecharge.wxParams.nonceStr,
      package: that.data.placeRecharge.wxParams.package,
      signType: that.data.placeRecharge.wxParams.signType,
      paySign: that.data.placeRecharge.wxParams.paySign,
      success: function (res) {
        rs.showToast('充值成功', "success", (res) => {
          wx.navigateTo({
            url: '../index/index'
          });
        })
      },

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