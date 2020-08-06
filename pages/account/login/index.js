// pages/account/login/index.js
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
    logo: '',
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
    this.indexAd();
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
  indexAd() {
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let obj = {
      appid: appid,
      timeStamp: timeStamp
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign
    }, obj)
    rs.getRequests("indexAd", params, (res) => {
      let data = res.data;
      if (data.code == 200) {
        this.setData({
          logo: data.data.logo
        })
      }
    })
  },
  login(e) {
    let {
      mobile,
      pwd
    } = e.detail.value;
    let timeStamp = Math.round(new Date().getTime() / 1000);
    if (!mobile) {
      Toast('手机号码不能为空，请输入手机号');
      return;
    }
    if (!pwd) {
      Toast('密码不能为空，请输入密码');
      return;
    }
    if (pwd.length < 6) {
      Toast('密码不能少于六位');
      return;
    }
    let obj = {
      mobile: mobile,
      password: pwd,
      appid: appid,
      timeStamp: timeStamp
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign
    }, obj)
    rs.postRequests("login", params, (res) => {
      let data = res.data;
      if (data.code == 200) {
        Toast('登录成功，将跳转到首页');
        wx.setStorageSync("token", data.data.token);
        wx.setStorageSync("is_child", data.data.is_child);
        wx.setStorageSync("is_miniBind", data.data.is_miniBind);
        wx.switchTab({
          url: '/pages/index/index/index'
        })
      } else {
        Toast(data.msg)
      }

    })
  },

  bindWeChat(e) {
    var that = this
    console.log(e)
    if (e.detail.userInfo) {
      var encryptedData = e.detail.encryptedData
      var iv = e.detail.iv;
      console.log('授权')
      wx.login({
        success: function (res) {
          console.log(res)
          if (res.code != '') {
            let timeStamp = Math.round(new Date().getTime() / 1000);
            let obj = {
              appid: appid,
              timeStamp: timeStamp,
              code: res.code
            };
            let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
            let params = Object.assign({
              type: 'mini',
              sign: sign,
              code: res.code,
              encryptedData: encryptedData,
              iv: iv
            }, obj);
            rs.postRequests('wxLogin', params, (res) => {
              let data = res.data;
              if (data.code == 200) {
                Toast('登录成功，将跳转到首页');
                wx.setStorageSync("token", data.data.token);
                wx.setStorageSync("is_child", data.data.is_child);
                wx.setStorageSync("is_miniBind", data.data.is_miniBind);
                wx.switchTab({
                  url: '/pages/index/index/index'
                })
              } else if(data.code == 201) {
                wx.navigateTo({
                  url: '../select/select?identifying='+data.data.identifying
                })
              }else{
                Toast(data.msg);
              }
              
            })
          }
        },
      })
    } else {
      console.log('没有授权')
    }
  },


  // 微信登录
  // weixinLogin() {

  //   wx.login({
  //     success(res) {
  //       if (res.code) {

  //         //获取用户信息
  //         wx.getUserInfo({
  //           success: function (res) {


  //           }
  //         })



  //       }
  //     }
  //   })
  // },
  registerUrl() {
    wx.navigateTo({
      url: '../register/index'
    })
  },
  treatyUrl() {
    wx.navigateTo({
      url: '../treaty/index'
    })
  },
  forgetUrl() {
    wx.navigateTo({
      url: '../forget/index'
    })
  }
})