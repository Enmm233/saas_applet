// pages/user/userInfo/userInfo.js
// pages/user/index/index.js
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
    imgRemote: app.globalData.imgRemote,
    memberInfo:'',
  },

  selectImg () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //res.tempFilePaths 返回图片本地文件路径列表
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          imgPath: tempFilePaths[0]
        })
        // console.log(that.data.imgPath)
        that.getUserInfo()
      }
    })

  },

  getUserInfo(){
    var that = this;
    var image = that.data.imgPath;
    wx.navigateTo({
      url: '../tailor/tailor?image='+ image
    });
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
  memberInfo() {
    var that = this
    var appid = app.globalData.appid;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid, timeStamp: timeStamp, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = { appid: appid, timeStamp: timeStamp, sign: sign, }
    rs.getRequests("memberInfo", data, (res) => {
      if (res.data.code == 200) {
        var reg = /^(\d{3})\d*(\d{4})$/;
        that.setData({
          nickname:res.data.data.info.nickname,
          memberInfoData: res.data.data,
          phone:res.data.data.info.mobileNumber
        })
      }
    })
  },
   //获取单位名称
   bindnickname(e) {
    var that = this;
    that.setData({
      nickname: e.detail.value
    })
  },
    //点击确认修改单位名称
    updateName() {
      var that = this
      var appid = app.globalData.appid;
      var nickname = that.data.nickname;
      if(nickname.match(' ')){
        rs.showToast('请不要输入非法字符', "none", (res) => {});
        return;
      }
      var timeStamp = Math.round(new Date().getTime() / 1000);
      var obj = { appid: appid, nickname: nickname, timeStamp: timeStamp, }
      var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
      var data = { appid: appid, nickname: nickname, timeStamp: timeStamp, sign: sign, }
      rs.postRequests("updateName", data, (res) => {
        if (res.data.code == 200) {
          rs.showToast('修改成功', "success", (res) => {
            var nickname = "memberInfoData.info.nickname";
            that.setData({
              [nickname]: that.data.nickname,
              // unitModal: false
            })
          })
          setTimeout(()=>{wx.switchTab({
            url: '/pages/user/index/index',
          })},1000)
        }else{
          Toast(res.data.msg)
        }
      })
    },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.memberInfo();
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
  bindmobile(){
    wx.navigateTo({
      url: '../binding/binding',
    })
  }
})