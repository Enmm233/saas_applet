// pages/user/account_to_add/account_to_add.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
const util = require('../../../utils/util.js');
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
    /**
 * 选择地图位置
 */
chooseLocation: function (e) {
  var that = this
  wx.chooseLocation({
    success: function (res) {
      var arr = util.qqMapToBMap(res.latitude, res.longitude)
      that.setData({
        hasLocation: true,
        longitude: arr.lng, //经度
        latitude: arr.lat,   //纬度
        address: res.address  //地址
      })
    },
  })
},
  addChild(e) {
    var that = this
    var appid = app.globalData.appid;
    var nickname = e.detail.value.nickname;
    var contact = e.detail.value.contact;
    var mobile = e.detail.value.mobile;
    var password = e.detail.value.password;
    var address = e.detail.value.address;
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    var details = e.detail.value.details;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = {
      address: address,
      appid: appid,
      contact: contact,
      mobile: mobile,
      nickname: nickname,
      password: password,
      timeStamp: timeStamp,
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    if (nickname == "") {
      rs.showToast("名称不能为空", "none", (res) => {})
      return false;
    }
    if (contact == "") {
      rs.showToast("联系人不能为空", "none", (res) => {})
      return false;
    }
    if (mobile == "") {
      rs.showToast("手机号不能为空", "none", (res) => {})
      return false;
    }
    if (password.length < 6) {
      rs.showToast("密码不能小于六位数", "none", (res) => {})
      return false;
    }

    var data = {
      address: address,
      appid: appid,
      contact: contact,
      mobile: mobile,
      nickname: nickname,
      password: password,
      timeStamp: timeStamp,
      sign: sign,
      longitude: longitude,
      latitude: latitude,
      details: details
    }
    rs.postRequests("addChild", data, (res) => {
      if (res.data.code == 200) {
        wx.navigateBack({})
      }else{
        Toast(res.data.msg)
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