// pages/user/address/address.js
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
    addressInfo:'',
    select_zid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        // console.log(options)
        if(options.select_zid){
          this.setData({
            select_zid:options.select_zid
          })
        }
        
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    that.addressInfo()
    
  },
 /**
   * 进入收货地址
   */
  addressInfo() {
    var that = this;
    var appid = app.globalData.appid;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid, timeStamp: timeStamp, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = { appid: appid, timeStamp: timeStamp, sign: sign,select_zid:that.data.select_zid }
    rs.getRequests("memberAddressInfo", data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          addressInfo: res.data.data
        })
      }else{
        Toast(res.data.msg)
      }
    })
  },
  /**
 * 选择地图位置
 */
  chooseLocation: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        var address = "addressInfo.address"
          var arr = util.qqMapToBMap(res.latitude, res.longitude)
          that.setData({
            hasLocation: true,
            longitude: arr.lng, //经度
            latitude: arr.lat,   //纬度
            [address]: res.address  //地址
          })
      },
    })
  },
   /**
   * 保存收货信息
   */
  updateAddress(e) {
    var that = this
    var appid = app.globalData.appid;
    var contact = e.detail.value.contact;
    if(contact.match(' ')){
      Toast('请不要输入非法字符');
      return;
    }
    var mobile = e.detail.value.phone;
    
    var address = e.detail.value.address;
    var longitude = that.data.longitude;
    var latitude = that.data.latitude
    let addressFormate = e.detail.value.details;
    let details=addressFormate.replace(' ','');
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var sign = md5.hexMD5('address=' + address + '&appid=' + appid + '&contact=' + contact + '&mobile=' + mobile + '&timeStamp=' + timeStamp + app.globalData.appsecret);
    var data = { appid: appid, contact: contact, mobile: mobile, address: address, timeStamp: timeStamp, sign: sign, longitude: longitude, latitude: latitude, details: details }
    rs.postRequests("updateAddress", data, (res) => {
      if (res.data.code == 200) {
        rs.showToast('保存成功', "success", (res) => {
          wx.navigateBack({})
        })
      }else{
       
        Toast(res.data.msg)
      }
    })
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