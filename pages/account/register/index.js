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
  onLoad: function(options) {
    console.log(JSON.stringify(options))
    var that = this;
    that.setData({
      identifying:options.identifying
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.captcha()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  loginUrl() {
    wx.navigateTo({
      url: '/pages/account/login/index',
    })
  },
  verifyResult(){
   
      this.setData({
        slidervalue:true
      });
    
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
          photoCode: data.data.number
        })
        wx.setStorageSync("laravel_session", res.header["Set-Cookie"])
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
      mobile,slidervalue,photoCode
    } = this.data;
    if (!mobile) {
      Toast('手机号不能为空');
      return;
    }
    if (!slidervalue) {
      Toast('请拖动滑块验证');
      return;
    }
    if(!(/^1[3456789]\d{9}$/.test(mobile))){ 
      Toast("手机号码有误，请重填");  
      return; 
  } 
    var obj = { appid: appid, mobile: mobile, timeStamp: timeStamp, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var random_str = md5.hexMD5(app.globalData.appsecret + that.data.photoCode);
    let params = Object.assign({ sign: sign, secret_str: random_str, active: 2 }, obj)

    wx.request({
      url: app.globalData.rootUrl + "sendCode",
      method: 'POST',
      header: {
        'cookie': wx.getStorageSync("laravel_session"),
        'Authorization': wx.getStorageSync("token")
      },
      data: params,
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
  //注册
  register(e) {
    let {
      nickname,
      mobile,
      password,
      confirm_pwd,
      photoVal,
      verify_code
    } = e.detail.value;
    if (!nickname) {
      Toast('单位名称不能为空');
      return;
    }
    if (!mobile) {
      Toast('手机号不能为空');
      return;
    }
    if (!password) {
      Toast('密码不能为空');
      return;
    }
    if (password.match(' ')) {
      Toast('密码请不要输入空格');
      return;
    }
    if (password.length < 6) {
      Toast('请设置六位及以上的密码');
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
      nickname: nickname.replace(' ',''),
      mobile: mobile,
      password: password,
      confirm_pwd: confirm_pwd,
      verify_code: verify_code,
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    if(this.data.identifying){
      obj.openid = this.data.identifying
    }
    let params = Object.assign({
      sign: sign,
    }, obj)
    
    wx.request({
      url: app.globalData.rootUrl + "register",
      method: 'POST',
      data: params,
      header: {
        'cookie': wx.getStorageSync("laravel_session"),
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync("token"),
      },
      success: function(res) {
        if (res.data.code == 200) {
          rs.showToast('注册成功', "success", (res) => {
            wx.navigateTo({
              url: '../login/index',
            })
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
  },
 
})