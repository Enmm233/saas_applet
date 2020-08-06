// pages/account/register/index.js
import Toast from '@vant/weapp/toast/toast';
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js')
let app = getApp();
let {
  appid,
  appsecret
} = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    mobile: '',
    photoCode: '',
    str: '获取验证码',
    second: 60,
    btn: false,
    slidervalue:false,
    resbtn: false
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

  },
  loginUrl() {
    wx.navigateTo({
      url: '/pages/account/login/index',
    })
  },
  verifyResult(){
   
   this.setData({
     slidervalue:true
   })
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let obj = {
      appid: appid,
      timeStamp: timeStamp
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign
    }, obj)
    rs.getRequests("random", params, (res) => {
      let data = res.data;
      if (data.code == 200) {
        this.setData({
          photoCode: data.data.number,
          slidervalue:100
        })
        wx.setStorageSync("laravel_session", res.header["Set-Cookie"]);
      } else {
        Toast(data.msg);
      }
    })
  },
  phone(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  strCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  getverify() {
    this.setData({
      resbtn: true
    })
  },

  timer() {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            str: second + '秒',
            btn: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              str: '获取验证码',
              btn: false
            })
            resolve(setTimer)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  // 获取短信验证码
  getMessage() {
    let that = this;
    if (this.data.str != "获取验证码") {
      return;
    }
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let {
      mobile,photoCode,
      code,slidervalue
    } = this.data;
    if (!mobile) {
      Toast('手机号不能为空');
      return;
    }
    if (!slidervalue) {
      Toast('请拖动滑块验证');
      return;
    }


    let obj = {
      appid: appid,
      mobile: mobile,
      timeStamp: timeStamp
    };
    var random_str = md5.hexMD5(appsecret + photoCode);
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign,
      secret_str: random_str
    }, obj)
    wx.request({
      url: app.globalData.rootUrl + "sendCodeNot",
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'cookie': wx.getStorageSync("laravel_session")
      },
      data: params,
      success: function (res) {
        if (res.data.code == 200) {
          that.timer();
          that.setData({
            photoCode: res.data.data.random_str
          })
          Toast('验证码已发送到你手机中，请注意查收');
        } else if (res.code == 400) {
          Toast('请更换图片验证码')
        } else {
          Toast(res.data.msg)
        }
      },
    })
  },
  //忘记密码
  forget(e) {
    let {
      mobile,
      password,
      confirm_pwd,
      photoVal,
      verify_code
    } = e.detail.value;
    if (!mobile) {
      Toast('手机号不能为空');
      return;
    }
    if (!password) {
      Toast('密码不能为空');
      return;
    }
    if (password.length < 6) {
      Toast('请设置六位及以上的密码');
      return;
    }
    if(password.match(' ')){
      Toast('请不要输入空格');
      return;
    }
    if (password != confirm_pwd) {
      Toast('请确保密码一致');
      return;
    }
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let obj = {
      appid: appid,
      timeStamp: timeStamp,
      mobile: mobile,
      password: password,
      confirm_pwd: confirm_pwd,
      verify_code: verify_code
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign
    }, obj)
    wx.request({
      url: app.globalData.rootUrl + "forgetPassword",
      method: 'POST',
      data: params,
      header: {
        'content-type': 'application/json', // 默认值
        'cookie': wx.getStorageSync("laravel_session")
      },
      success: function (res) {
        if (res.data.code == 200) {
          Toast('提交成功')
          wx.navigateTo({
            url: '../login/index',
          })
        } else {
          Toast(res.data.msg)
        }
      }
    })
  },
  treatyUrl() {
    wx.navigateTo({
      url: '../treaty/index',
    })
  }
})