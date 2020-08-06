// pages/user/account_to_edit/account_to_edit.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
const util = require('../../../utils/util.js');
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    childInfo: '',

  },
  onChange({detail}) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      checked: detail
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      select_zid: options.select_zid
    })
    console.log(that.data.select_zid)
  },
  memberAddressInfo() {
    var that = this;
    var select_zid = that.data.select_zid;
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
      select_zid: select_zid
    }
    rs.getRequests("memberAddressInfo", data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          childInfo: res.data.data,
          status: res.data.data.status
        })
        if (that.data.status == 0) {
          that.setData({
            checked: false
          })
        } else if (that.data.status == 1) {
          that.setData({
            checked: true
          })
        }
        console.log(that.data.childInfo)
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
        var address = "childInfo.address"
        var arr = util.qqMapToBMap(res.latitude, res.longitude)
        that.setData({
          hasLocation: true,
          longitude: arr.lng, //经度
          latitude: arr.lat,   //纬度
          [address]: res.address //地址
        })
      },
    })
  },
  editChild(e) {
    var that = this
    var appid = app.globalData.appid;
    var zid = that.data.select_zid;
    if (that.data.checked == false) {
      var status = 0;
    } else if (that.data.checked == true) {
      var status = 1;
    }
    var nickname = e.detail.value.nickname;
    var contact = e.detail.value.contact;
    var mobile = e.detail.value.mobile;
    var password = e.detail.value.password;
    var address = e.detail.value.address;
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    var details = e.detail.value.details;
    if(details.match(' ')||nickname.match(' ')||contact.match(' ')||password.match(' ')){
      rs.showToast("请不要输入非法字符", "none", (res) => { })
      return ;
    }
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = {
      address: address,
      appid: appid,
      contact: contact,
      mobile: mobile,
      nickname: nickname,
      password: password,
      status: status,
      timeStamp: timeStamp,
      zid: zid,
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

    var data = {
      address: address,
      appid: appid,
      contact: contact,
      mobile: mobile,
      nickname: nickname,
      password: password,
      status: status,
      zid: zid,
      timeStamp: timeStamp,
      sign: sign,
      longitude: longitude,
      latitude: latitude,
      details: details
    }
    rs.postRequests("editChild", data, (res) => {
      if (res.data.code == 200) {
        rs.showToast('修改成功','success',(reg)=>{
          wx.navigateBack({})
        })
      }
      if (res.data.code == 400) {
        rs.showToast(res.data.msg, "none", (reg) => {})
      }
    })
  },
  /**
   * 删除子账号
   */
  delChild() {
    Dialog.confirm({
      title: '提示',
      message: '是否删除该账号',
    })
      .then(() => {
        var that = this
        var appid = app.globalData.appid;
        var select_zid = that.data.select_zid;
        var timeStamp = Math.round(new Date().getTime() / 1000);
        var obj = {
          appid: appid,
          select_zid: select_zid,
          timeStamp: timeStamp,
        }
        var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
        var data = {
          appid: appid,
          timeStamp: timeStamp,
          select_zid: select_zid,
          sign: sign,
        }
        rs.getRequests("delChild", data, (res) => {
          if (res.data.code == 101) {
            rs.showToast('该账号已产生数据，无法删除', 'none', (res) => { })
          }
          if (res.data.code == 200) {
            rs.showToast('删除成功', 'success', (res) => {
              wx.navigateBack({})
            })
          }
        })
      })
      .catch(() => {
        // on cancel
      });
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    that.memberAddressInfo()
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