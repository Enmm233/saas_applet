//app.js
App({
  onLaunch: function () {
    wx.onError((rs)=>{console.log(rs)});
     
    //隐藏系统tabbar
    wx.hideTabBar();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {

      }
    })
  },
  globalData: {
    classId: '',
    isFresh:true,
    rootUrl: 'https://load.caidj.cn/mobileOrder/', //主接口地址
    imgRemote: 'https://load.caidj.cn',
    prefix: "../../../images/", //  本地图片路径
    appid: '1',
    active: '2',
    appsecret: 'StJfzJcXmya6k6Ar',
    aData: {
      show: true,
      pageClassify:true
    }
  }
})