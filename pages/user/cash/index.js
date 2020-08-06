// pages/user/cash/index.js
import Toast from '@vant/weapp/toast/toast';
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js')
let app = getApp();
let {
  appid,
  appsecret,
  prefix
} = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectColor:'black',
    prefix: prefix,
    list: [],
    bitmap: false,
    loading: false,
    active: 0,
    orderType: 2,
    page: 1,
    num: 10,
    title: [{
        name: '正常',
        id: '2'
      },
      {
        name: '未开始',
        id: '1'
      },
      {
        name: '已使用',
        id: '3'
      },
      {
        name: '已过期',
        id: '4'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.couponsList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
     wx.setStorageSync('juan',this.data.list)
     console.log(this.data.list)
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
    var that = this;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var {
      num,
      page,
      orderType
    } = that.data;
    var obj = {
      appid: appid,
      timeStamp: timeStamp,
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = {
      appid: appid,
      num: num,
      page: page + 1,
      timeStamp: timeStamp,
      type: orderType,
      sign: sign
    }
    rs.getRequests("couponsList", data, (res) => {
      let {
        data
      } = res
      if (data.code == 200) {
        let list = this.data.list;
        if (res.data.data.list == '') {
          this.setData({
            loading: false
          })
        } else {
          this.setData({
            list: list.concat(res.data.data.list),
            page: page + 1,
            loading: true
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  couponsList() {
    var that = this;
   if(this.data.page!=1){
    
     this.setData({
       list:wx.getStorageSync('juan')
     })
     return;
   }
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var {
      num,
      page,
      orderType
    } = that.data;
    var obj = {
      appid: appid,
      timeStamp: timeStamp,
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = {
      appid: appid,
      num: num,
      page: page,
      timeStamp: timeStamp,
      type: orderType,
      sign: sign
    }
    rs.getRequests("couponsList", data, (res) => {
      let {
        data
      } = res
      if (data.code == 200) {
        let list = data.data.list;
        this.setData({
          list: list
        })
        if(list.length==10){
          this.setData({
            loading:true
          })
        }else{
          this.setData({
            loading: false
          })
        }
      }
    })
  },
  t(e) {
    this.setData({height:2})
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    }
    this.setData({
      orderType: this.data.title[e.detail.index].id,
      page: 1,
      selectColor:'#009A44',
      list: []
    })

    this.couponsList();
  },
  cashdetailUrl(e){
    let {id}=e.currentTarget.dataset;
    wx.navigateTo({
      url: `../cashdetail/index?id=${id}`,
    })
  }
})