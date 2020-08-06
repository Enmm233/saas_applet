// pages/user/account/account.js
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
    childInfo: [],
    show:false,

  },
  getaccount() {
    wx.navigateTo({
      url: '../account_to_edit/account_to_edit'
    });
  },
  addaccount() {
    wx.navigateTo({
      url: '../account_to_add/account_to_add'
    });
  },
  childInfo() {
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
    rs.getRequests("childInfo", data, (res) => {
      if (res.data.code == 200) {
        if(res.data.data != ''){
          that.setData({
            childInfo: res.data.data,
            show:false
          })
        }else{
          that.setData({
            childInfo: res.data.data,
            show:true
          })
        }
        
        console.log(that.data.childInfo)
      }
    })
  },
  //编辑子账号
  editChild(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../account_to_edit/account_to_edit?select_zid=' + that.data.childInfo[index].zid,
    });
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
    that.childInfo()
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