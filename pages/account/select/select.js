// pages/account/select/select.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.stringify(options))
    var that = this;
    that.setData({
      identifying:options.identifying
    })
  },
  //创建新账号
  create_account(){
    var that = this;
    var data = that.data.identifying;
    wx.navigateTo({
      url: '../register/index?identifying=' + data
    })
  },
  //绑定已有账号
  binding_account(){
    var that = this;
    var data = that.data.identifying;
    wx.navigateTo({
      url: '../binding/binding?identifying=' + data
    })
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