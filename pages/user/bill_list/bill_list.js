// pages/user/bill_list/bill_list.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
const util = require('../../../utils/util.js');
import Toast from '@vant/weapp/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prefix: app.globalData.prefix,
    date: '请选择日期',
    show: false,
    page: 1,
    loading:false,
    // defaulTxt: '上拉加载更多...',
    isdefault: true,
    show: false,
    currentDate: new Date().getTime(),
    minDate: null,
    maxDate:null,
    defaultDate:[]
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    let month = date.getMonth() + 1;
    if(month<10){
      month='0'+month;
    }
    let day=date.getDate();
    if(day<10){
      day='0'+day;
    }
    return `${date.getFullYear()}-${month}-${day}`;
  },
  onConfirm(e){
    const [start, end] = e.detail;
    this.setData({
      date: `${this.formatDate(start)},${this.formatDate(end)}`,
      show:false
    })
    console.log(this.data.date)
    this.moneyList()
  },
  onInput(event) {
    var that = this;
    var date = util.js_date_time(event.detail)
    that.setData({
      show: false,
      date: date
    });
    that.moneyList()
  },
  skip(event) {
    var data = event.currentTarget.id;
    wx.navigateTo({
      url: '../bill_detail/bill_detail?id=' + data,
    })
  },
  /**
   * 账单列表
   */
  moneyList() {
    var that = this;
    var time = that.data.date;
    if (time == "请选择日期") {
      time = '';
    } else {
      time = that.data.date
    }
    var appid = app.globalData.appid;
    var page = 1;
    var num = 10
    var date = time;
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
      page: 1,
      date_str: date,
      num: 10,
      
    }
    that.setData({
      moneyList: ''
    })
    rs.getRequest("moneyListPaginate", data, (res) => {
      if (res.data.code == 200) {
        if (res.data.data.list != '') {
          that.setData({
            moneyList: res.data.data.list,
            isdefault: true
          })
          console.log(res.data.data.list.length)
          if (res.data.data.list.length < 10) {
            that.setData({
             loading:false
            })
          }else{
            that.setData({
              loading: true
            })
          }
        } else {
          that.setData({
            isdefault: false
          })
        }

      }else{
        Toast(res.data.msg)
      }
    })
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
    var that = this;
    let time=new Date().getTime;
    let date=new Date();
    let year=date.getFullYear();
    let month=date.getMonth();
    let defaultDate = `${year}-${month + 1}-${date.getDate()}`
    that.setData({
      minDate: new Date(year,month-3).getTime(),
      maxDate: new Date(year,month+3).getTime(),
      defaultDate:[defaultDate]
    })
    that.moneyList()
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
    var that = this;
    var time = that.data.date;
    if (time == "请选择日期") {
      time = '';
    } else {
      time = that.data.date
    }
    var appid = app.globalData.appid;
    var page = that.data.page;
    var num = 10;
    var date = time;
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
      page: page + 1,
      date: date,
      num: 10
    }
    rs.getRequest("moneyList", data, (res) => {
      if (res.data.code == 200) {
        var moneyList = that.data.moneyList;
        if (res.data.data!= '') {
          that.setData({
            moneyList: moneyList.concat(res.data.data.list),
            page: page + 1,
            loading:true
          })
        }else{
              that.setData({
                loading:false
              })
        }





      }
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})