// pages/user/recharge_list/recharge_list.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    loading:false
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
   * 账单列表
   */
  rechargeList() {
    var that = this;
    var appid = app.globalData.appid;
    var page = 1;
    var num = 15
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid, timeStamp: timeStamp, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = { appid: appid, timeStamp: timeStamp, sign: sign, page: 1, num: 15 }
    rs.getRequest("rechargeList", data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          rechargeList: res.data.data
        })
        if(res.data.data.length==15){
          that.setData({
            loading:true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.rechargeList()
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
    var that = this;
    var appid = app.globalData.appid;
    var page = that.data.page;
    var num = 15
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid, timeStamp: timeStamp, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = { appid: appid, timeStamp: timeStamp, sign: sign, page:page+ 1, num: 15 }
    rs.getRequest("rechargeList", data, (res) => {
      if (res.data.code == 200) {
        var rechargeList = that.data.rechargeList
        that.setData({
          rechargeList: rechargeList.concat(res.data.data),
          page:page+1
        })
        if (res.data.data.length) {
          that.setData({
            loading: true
          })
        } else {
          that.setData({
            loading: false
          })
       }}
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})