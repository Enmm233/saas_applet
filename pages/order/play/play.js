// pages/order/play/play.js
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
   * 支付信息
   */
  payOrder() {
    var that = this
    var appid = app.globalData.appid;
    var oid = that.data.oid;
    var type = 'mini';
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid, oid: oid, type: type, timeStamp: timeStamp, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = { appid: appid, oid: oid, type: 'mini', timeStamp: timeStamp, sign: sign, }
    rs.postRequests("payOrder", data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          payOrder: res.data.data
        })
      }
      if (res.data.code == 406) {
        rs.showToast('请先绑定微信', "none", (res) => { })
      }
      if (res.data.code == 500) {
      
          rs.showToast('微信appid和mch_id不匹配，请联系后台人员重新设置', "none", (res) => { })
   
    
      }
    })
  },
  querenchongzhi() {
    var that = this
    wx.requestPayment({
      appId: that.data.payOrder.wxParams.appId,
      timeStamp: that.data.payOrder.wxParams.timeStamp,
      nonceStr: that.data.payOrder.wxParams.nonceStr,
      package: that.data.payOrder.wxParams.package,
      signType: that.data.payOrder.wxParams.signType,
      paySign: that.data.payOrder.wxParams.paySign,
      success: function (res) {
        Toast('支付成功')
        setTimeout(() => {
          wx.switchTab({
            url: '../index/index',
          })
        }, 1000)
      },
      complete(res){
        // console.log(res)
      }
    })
  }, 
  goPay() {
    var that = this
    var appid = app.globalData.appid;
    var oid = that.data.oid;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid, id: oid, timeStamp: timeStamp, }
    console.log(obj)
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);

    var data = { appid: appid, id: oid, timeStamp: timeStamp, sign: sign, }
    rs.postRequests("balancePay", data, (res) => {
      if (res.data.code == 200) {
        Toast('支付成功')
        setTimeout(() => {
          wx.switchTab({
            url: '../index/index',
          })
        }, 1000)
      }
      if (res.data.code == 400) {
        rs.showToast(res.data.msg, "none", (res) => { })
      }
      if (res.data.code == 500) {
        rs.showToast('网络错误', "none", (res) => { })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      oid: options.oid
    })
    // console.log(that.data.oid)
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
    that.payOrder()
  },
  /**
   * 页面跳转
   */
  //返回订单
  order() {
     wx.navigateBack({})
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