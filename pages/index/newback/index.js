// pages/index/newback/index.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
import Toast from '@vant/weapp/toast/toast';
let app = getApp();
let {
  appid,
  appsecret,
  imgRemote,
  rootUrl,
  prefix
} = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontLength:0,
    imgRemote: imgRemote,
    rootUrl: rootUrl,
    prefix: prefix,
    status:false,
    img: []
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
  /**
   * 新品反馈
   */

  uploadImg() {
    var that = this
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var media_id = res.tempFilePaths;
  
        var feed = "feed";
        var timeStamp = Math.round(new Date().getTime() / 1000);
        var obj = {
          appid: appid,
          type: feed,
          timeStamp: timeStamp,
        }
        var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
        for (var i = 0; i < media_id.length; i++) {
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
            filePath: media_id[i],
            success: function(res) {
              var img = JSON.parse(res.data);

              that.setData({
                img: that.data.img.concat(img.data)
              })
            },
          })
        }

      }

    })
  },
  deletePhoto(e) {
    let {
      item
    } = e.currentTarget.dataset;
    let {
      img
    } = this.data;
    img.splice(item, 1);
    this.setData({
      img:img
    })
  },
  feedBack(e) {
    var that = this
    var appid = app.globalData.appid;
    var img = that.data.img;
    let path=[];
    for(let i of img){
           path.push(i.path)
    }
    var {contents}= e.detail.value;
    let content = contents.replace(' ', '');
    let contentRe=content.trimEnd();

    var timeStamp = Math.round(new Date().getTime() / 1000);

    var obj = {
      appid: appid,
      contents: contentRe,
      timeStamp: timeStamp,
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = {
      appid: appid,
      contents: contentRe,
      img: path,
      timeStamp: timeStamp,
      sign: sign,
    }
    rs.postRequests("feedBack", data, (res) => {
      if (res.data.code == 200) {
        
         Toast('提交成功');
         setTimeout(()=>{
           wx.switchTab({
             url: '/pages/index/index/index',
           })
         },1000)
        
      }else{
         Toast(res.data.msg)
      }
    })
  },
  showPhoneKey(){
    console.log(this.data.status)
   this.setData({
     status:true
   })
  },
  getLength(e){
    console.log(e)
    this.setData({
      fontLength:e.detail.cursor
    })
  }
})