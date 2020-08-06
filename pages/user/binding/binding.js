// pages/user/binding/binding.js
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
    second: 60,
    btnValue: '获取验证码',
    btnDisabled: false,
    slidervalue:false,
    photoCode:''
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
   * 获取验证码
   */
  //电话号码
  phone(e) {
    var that = this;
    that.setData({
      mobile: e.detail.value
    })
  },
  //安全验证
  code(e) {
    var that = this;
    that.setData({
      code: e.detail.value
    })
  },
  //滑動驗證
  verifyResult(){
    this.setData({
      slidervalue:true
    })
    var that = this;
    var appid = app.globalData.appid;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid, timeStamp: timeStamp }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = { appid: appid, timeStamp: timeStamp, sign: sign, }
    rs.getRequests("random", data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          photoCode: res.data.data.number,
        })
        wx.setStorageSync("laravel_session", res.header["Set-Cookie"])
      }
    })
  },
  sendCode() {
    var that = this;
    var appid = app.globalData.appid;
    let {mobile}=that.data;
    if(!mobile){
      rs.showToast('请输入手机号', "none", (res) => { })
      return;
    }else{
      // var mobile = that.data.mobile.replace(/\s+/g, "");
      if(!that.data.slidervalue){
        Toast('请拖动滑块验证');
        return;
      }
    }
    if(!(/^1[3456789]\d{9}$/.test(mobile))){ 
      Toast("手机号码有误，请重填");  
      return; 
  } 
    if(that.data.btnValue!='获取验证码'){
      return;
    }
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid:appid, mobile: mobile, timeStamp: timeStamp, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var random_str = md5.hexMD5(app.globalData.appsecret + that.data.photoCode);
    let params = Object.assign({ sign: sign, secret_str: random_str,active:2},obj)

    wx.request({
      url: app.globalData.rootUrl + "sendCode",
      method: 'POST',
      header: {
        'cookie': wx.getStorageSync("laravel_session"),
        'Authorization': wx.getStorageSync("token")
      },
      data:params,
      success: function (res) {
        if (res.data.code == 200) {
          Toast('验证码已发送到你手机中，请注意查收');
          that.timer();
          that.setData({
            photoCode: res.data.data.random_str
          })
          return;
        }
        if (res.data.code == 404) {
          rs.showToast('用户不存在', "none", (res) => { })
        }
        if (res.data.code == 500) {
          rs.showToast('操作失败', "none", (res) => { })
        }
        rs.showToast(res.data.msg, "none", (res) => { })
      },
    })
  },

  bindPhone(e) {
    var that = this;
    var appid = app.globalData.appid;
    if(!e.detail.value.mobile){
      rs.showToast('请输入手机号', "none", (res) => { });
      return;
    }else{
      var mobile = e.detail.value.mobile.replace(/\s+/g, "");
      if(!e.detail.value.verify_code){
        rs.showToast('请输入验证码', "none", (res) => { });
        return;
      }else{
        var verify_code = e.detail.value.verify_code.replace(/\s+/g, "");;
      }
    }
    var timeStamp = Math.round(new Date().getTime() / 1000);
    let joinSign = { appid: app.globalData.appid, timeStamp: timeStamp}
    var obj = { appid: app.globalData.appid, mobile: mobile, verify_code: verify_code, timeStamp: timeStamp }
    var sign = md5.hexMD5(rs.objKeySort(joinSign) + app.globalData.appsecret);
  
    wx.request({
      url: app.globalData.rootUrl + "bindMobile",
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync("token"),
        'cookie': wx.getStorageSync("laravel_session")
      },
      data: {
        appid: app.globalData.appid,
        mobile: mobile,
        code: verify_code,
        timeStamp: timeStamp,
        sign: sign,
      },
      success: function (res) {
        if (res.data.code == 200) {
          rs.showToast('绑定成功', "none", (res) => {
            wx.navigateTo({
              url: '/pages/account/login/index',
            })
           })
        }else{
          rs.showToast(res.data.msg, "none", (res) => {
        
            })
        }
      },
    })
  },

  // 验证码倒计时

  timer() {
    
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + '秒',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '获取验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
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