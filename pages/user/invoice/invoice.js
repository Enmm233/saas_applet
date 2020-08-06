// pages/user/invoice/invoice.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    billInfo:'',
    types:''
  },
  onClick(event) {
    var index = event.detail.index;
    var that = this;
    that.setData({
      indexx:event.detail.index
    })
    if(index==0){
      that.setData({
        types:1,
      })
    }else if(index==1){
      that.setData({
        types: 2,
      })
    }
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
   * 发票信息
   */
  billInfo() {
    var that = this
    var appid = app.globalData.appid;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid, timeStamp: timeStamp, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = { appid: appid, timeStamp: timeStamp, sign: sign, }
    rs.getRequests("billInfo", data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          billInfo: res.data.data,
          types:res.data.data.type
        })
        if (that.data.billInfo.type==1){
          that.setData({
            indexx:0
          })
        } else if (that.data.billInfo.type == 2){
          that.setData({
            indexx:1
          })
        }
      }
    })
  },
  //提交发票
  handleBill(e) {
    var that = this
    var appid = app.globalData.appid;
    var header = e.detail.value.header;
    var number = e.detail.value.number;
    var content = e.detail.value.content;
    var price = e.detail.value.price;
    if(header.match(' ')||number.match(' ')||content.match(' ')){
      rs.showToast('请不要输入非法字符', 'none', (reg) => { })
      return;
    }
    var type = that.data.types;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid, content: content, header: header, number: number, price: price, timeStamp: timeStamp, type: type, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = { appid: appid, content: content, header: header, number: number, price: price, timeStamp: timeStamp, sign: sign, type: type, }
    rs.postRequests("handleBill", data, (res) => {
      if (res.data.code == 200) {
        rs.showToast('提交成功', 'success', (reg) => {
          wx.navigateBack({})
        })
      }else{
        rs.showToast(res.data.msg, 'none', (reg) => {
       
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.billInfo();
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