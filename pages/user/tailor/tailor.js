// pages/user/userInfo/userInfo.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'',
    url:'',
    width:250,//宽度
    height: 250//高度
  },
  cropperload(e){
      // console.log("cropper初始化完成");
  },
  loadimage(e){
      // console.log("图片加载完成",e.detail);
      this.setData({
             url:e.detail.url,
      });
      //重置图片角度、缩放、位置
      this.cropper.imgReset();
      wx.hideLoading({})
  },
  clickcut(e) {
      // console.log(e.detail);
      //点击裁剪框阅览图片
      wx.previewImage({
          current: e.detail.url, // 当前显示图片的http链接
          urls: [e.detail.url] // 需要预览的图片http链接列表
      })
      wx.hideLoading({})
      this.setData({
            url:e.detail.url,
      });
  },
  queding(){
    var that = this;
    if(that.data.url){
      if(that.data.url != ''){
        var media_id = that.data.url;
        var appid = app.globalData.appid;
        var feed = "avatars";
        // console.log(appid)
        var timeStamp = Math.round(new Date().getTime() / 1000);
        var obj = { appid: appid, type: feed, timeStamp: timeStamp, }
        var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
        // console.log(app.globalData.rootUrl + "uploadImg")
        console.log(12)
        wx.uploadFile({
          method: 'POST',
          url: app.globalData.rootUrl + "uploadImg", //此处换上你的接口地址
          name: 'img',
          header: {
          'Accept': 'application/json',
          'content-type': 'application/json', //
          'Authorization': wx.getStorageSync("token"),
          },
          formData: {
          appid: appid,
          timeStamp: timeStamp,
          type: feed,
          img: media_id,
          sign: sign,
          },
          filePath: media_id,
          success: function(res) {
            // console.log(res);
            // return
            var img = JSON.parse(res.data);
            that.setData({
              // img: that.data.img.concat(img.data.path)
              img: img.data.path
            })
            that.uploadAvatar()
          },
          })
      }else{
        Toast("请选择图片")
      }
    }else{
      Toast("请点击图片确认裁剪")
    }
    
    
  },
  //确认更换头像
  uploadAvatar() {
    var that = this
    var appid = app.globalData.appid;
    var img = that.data.img
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = { appid: appid, img: img, timeStamp: timeStamp, }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = { appid: appid, img: img, timeStamp: timeStamp, sign: sign }
    rs.postRequests("uploadAvatar", data, (res) => {
      if (res.data.code == 200) {
        rs.showToast('更换头像成功', "success", (res) => {
          wx.navigateBack({})
        })

      }
    })
  },
  quxiao(){
    wx.navigateBack({})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取到image-cropper对象
    this.cropper = this.selectComponent("#image-cropper");
    // 开始裁剪
    this.setData({
        src:options.image,
    });
    // wx.showLoading({
    //     title: '加载中'
    // })
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

  }
})