// pages/user/recharge/recharge.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,

  },
  recharge(){
    console.log("45")
    this.setData({
      show: false
    })
  },

    /**
   * 页面跳转
   */
  //充值
  enterKey(e) {
    console.log("4512")
    var that = this;
    that.setData({
      show: true
    });
    var appid = app.globalData.appid;
    var price = e.detail.val;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid, price: price,  timeStamp: timeStamp, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = { appid: appid, price: price, type: "mini", timeStamp: timeStamp, sign: sign, }
    rs.postRequests("createRecharge", data, (res) => {
      if (res.data.code == 200) {
        wx.navigateTo({
          url: '../recharge_msg/recharge_msg?orderId=' +res.data.data.orderId,
        })
      }else{
        rs.showToast(res.data.msg, 'none', (res) => { })
      }
      // if (res.data.code == 400) {
      //   rs.showToast('请输入正确金额', 'none', (res) => { })
      // }
      // if (res.data.code == 404){
      //   rs.showToast('未找到用户', 'none', (res) => { })
      // }
      // if (res.data.code == 500) {
      //   rs.showToast('充值失败', 'none', (res) => { })
      // }
    }) 
  },
  
  recharge_list(){
    wx.navigateTo({
      url: '../recharge_list/recharge_list'
    });
  },
    /**
 *绑定微信
 */
bindWeChat(e) {
  var that = this;

  if (e.detail.userInfo) {
    console.log('shouquan')
    wx.login({
      success: function (res) {
        console.log(res.code)
        that.setData({
          code: res.code
        })
        that.bindWeChata()
      },
    })
  } else {
    console.log('没有授权')
  }
},
bindWeChata() {
  var that = this
  var appid = app.globalData.appid;
  var code = that.data.code;
  var timeStamp = Math.round(new Date().getTime() / 1000);
  var obj = { appid: appid, code: code, timeStamp: timeStamp, }
  var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
  var data = { appid: appid, code: code, type: "mini", timeStamp: timeStamp, sign: sign, }
  rs.postRequests("bindWeChat", data, (res) => {
    if (res.data.code == 200) {
      rs.showToast('绑定微信成功', "success", (res) => {
      })
      wx.setStorageSync('is_miniBind', 1)
      that.setData({
        is_miniBind: wx.getStorageSync("is_miniBind"),
      })
    } else {
      rs.showToast(res.data.msg, "none", (res) => {
      })}
  })
},
  memberInfo() {
    var that = this
    var appid = app.globalData.appid;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = {
      appid: appid,
      timeStamp: timeStamp,
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = {
      appid: appid,
      timeStamp: timeStamp,
      sign: sign,
    }
    rs.getRequests("memberInfo", data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          memberInfoData: res.data.data,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    that.setData({
      is_miniBind: wx.getStorageSync("is_miniBind"),
    })
    that.memberInfo()
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