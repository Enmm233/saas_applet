// pages/shopcart/preay/index.js
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
let app = getApp();
let {
  appid,
  appsecret,
  imgRemote,
  prefix
} = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    list: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.temOrder();
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
  temOrder() {
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let obj = {
      appid: appid,
      timeStamp: timeStamp,
      id: this.data.id
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign,
    }, obj)
    rs.getRequests("temOrderMsg", params, (res) => {
      let {
        data
      } = res;

      if (data.code == 200) {
        this.setData({
          list: data.data
        })
      } else {
        Toast(data.msg)
      }

    })
  },
  cancel() {
    wx.switchTab({
      url: '/pages/shopcart/index/index',
    })
  },
  confirm() {
    let {
      id
    } = this.data;
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let obj = {
      appid: appid,
      timeStamp: timeStamp,
      oid: this.data.id,
      type: 'mini'
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign,
    }, obj)
    rs.postRequests("payTemOrder", params, (res) => {
      if (res.data.code == 200) {
        if (res.data.data.payType == 1) {
          Toast('支付成功');
          setTimeout(() => {
            app.globalData.aData.pageClassify = false;
            wx.switchTab({
              url: '/pages/order/index/index',
            })
          }, 1000)
        }
        if (res.data.data.payType == 2) {
         
          let {wxParams}=res.data.data;
          wx.requestPayment({
            timeStamp: wxParams.timeStamp,
            nonceStr: wxParams.nonceStr,
            package: wxParams.package,
            signType: wxParams.signType,
            paySign: wxParams.paySign,
            success: function(res) {
              Toast('支付成功');
              setTimeout(() => {
                app.globalData.aData.pageClassify = false;
                wx.switchTab({
                  url: '/pages/order/index/index',
                })
              }, 1000)
            }

          })
        }
      }else{
        Toast(res.data.msg)
      }
    })
  }
})