// pages/user/index/index.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prefix: app.globalData.prefix,
    imgRemote: app.globalData.imgRemote,
    memberInfo: '',
    activeIndex: 4,
  },
      /**
 *绑定微信
 */
bindWeChat(e) {
  var that = this
  console.log(e)
  if (e.detail.userInfo) {
    // console.log('授权')
    wx.login({
      success: function (res) {
        console.log(res.code)
        that.setData({
          code: res.code
        })
        that.bindWeChata()
      },
    })
  } else {
    console.log('没有授权')
  }
},
bindWeChata() {
  var that = this
  var appid = app.globalData.appid;
  var code = that.data.code;
  var timeStamp = Math.round(new Date().getTime() / 1000);
  var obj = { appid: appid, code: code, timeStamp: timeStamp, }
  var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
  var data = { appid: appid, code: code, type: "mini", timeStamp: timeStamp, sign: sign, }
  rs.postRequests("bindWeChat", data, (res) => {
    if (res.data.code == 200) {
      rs.showToast('绑定微信成功', "success", (res) => {
      })
      wx.setStorageSync('is_miniBind', 1)
      that.setData({
        is_miniBind: wx.getStorageSync("is_miniBind"),
      })
    }else{
      rs.showToast(res.data.msg, "none", (res) => { })
    }
  })
},
  getUserInfo(event) {

    if (!this.data.token) {
      this.login()
    } else {
      var data = event.currentTarget.dataset.item;
      if (data == "个人信息") {
        console.log(this.data.is_bind)
        if(this.data.is_bind == 0){
          wx.navigateTo({
            url: '../binding/binding'
          });
          return
        }else {
          wx.navigateTo({
            url: '../userInfo/userInfo'
          });
          return
        }
      } 
      if (data == "现金劵") {
        wx.navigateTo({
          url: '../cash/index'
        });
        return
      }
      if (data == "推荐") {
        wx.navigateTo({
          url: '../../index/recommed/index'
        });
        return
      }
      if (data == "地址") {
        wx.navigateTo({
          url: '../address/address'
        });
        return
      }
      if (data == "修改密码") {
        wx.navigateTo({
          url: '../forget/forget'
        });
        return
      }
      if (data == "账号管理") {
        wx.navigateTo({
          url: '../account/account'
        });
        return
      }
      if (data == "开具发票") {
        wx.navigateTo({
          url: '../invoice/invoice'
        });
        return
      }
      if (data == "账单记录") {
        wx.navigateTo({
          url: '../bill_list/bill_list'
        });
        return
      }
      if (data == "购买记录") {
        wx.navigateTo({
          url: '../purchase_record/purchase_record'
        });
        return
      }
      if (data == "充值") {
        wx.navigateTo({
          url: '../recharge/recharge'
        });
        return
      }
      if (data == "退出登录") {
        Dialog.confirm({
          title: '提示',
          message: '是否退出登录'
        }).then(() => {
          // on confirm
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
        rs.getRequests("logout", data, (res) => {
          if (res.data.code == 200) {
            Toast('退出成功');
            wx.clearStorage({
              success: function (reg) {
                wx.navigateTo({
                  url: '/pages/account/login/index'
                })
              }
            })
          }
        })
        }).catch(() => {
          // on cancel
        });
      }
    }



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(wx.getStorageSync("is_child"))
 

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //没有登录

  login() {
    wx.showModal({
      title: '将获您的账号、密码、等登录信息。',
      content: '是否同意授权去登录/注册？',
      showCancel: true, //是否显示取消按钮
      cancelText: "拒绝授权", //默认是“取消”
      cancelColor: '#f55637', //取消文字的颜色
      confirmText: "同意登录", //默认是“确定”
      confirmColor: '#54CF1F', //确定文字的颜色
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
          // wx.reLaunch({
          //   url: '../../tabPage/index/index',
          // });
        } else {
          //点击确定
          wx.navigateTo({
            url: '../../account/login/index'
          });
        }
      },
      fail: function (res) {}, //接口调用失败的回调函数
      complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
    });
  },
  memberInfo() {
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
  
    rs.getRequests("memberInfo", data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          memberInfoData: res.data.data,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.memberInfo();
    //隐藏系统tabbar
    // wx.hideTabBar();
    that.setData({
      is_miniBind: wx.getStorageSync("is_miniBind"),
      is_child: wx.getStorageSync("is_child"),
      token: wx.getStorageSync("token")
    })
    // console.log(that.data.is_miniBind)
    // console.log(that.data.is_child)

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