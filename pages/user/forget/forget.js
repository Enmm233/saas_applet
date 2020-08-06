// pages/user/forget/forget.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  forgetPassword(e){
    var appid = app.globalData.appid;
    var old_pwd = e.detail.value.old;
    var password = e.detail.value.new1;
    var password_confirmation = e.detail.value.new2;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid, old_pwd: old_pwd, password: password, password_confirmation: password_confirmation, timeStamp: timeStamp, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    if (old_pwd == "") {
      rs.showToast("原始密码不能为空", "none", (res) => { })
      return false;
    }
    if (password.length < 6) {
      rs.showToast("密码不能小于六位数", "none", (res) => { })
      return false;
    }
    if(password.match(' ')){
      rs.showToast("密码不能含有空格", "none", (res) => { })
      return false;
    }
    if (password_confirmation != password) {
      rs.showToast("密码不一致", "none", (res) => { })
      return false;
    }
    var data = { appid: appid, old_pwd: old_pwd, password: password, password_confirmation: password_confirmation, timeStamp: timeStamp, sign: sign, }
    rs.postRequests("modifyPassword", data, (res) => {
      if (res.data.code == 200) {
       
          wx.reLaunch({
            url: '/pages/account/login/index',
          })
       
      }
      if(res.data.code == 400){
        rs.showToast(res.data.msg,'none',(reg)=>{})
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