// pages/user/purchase_detail/purchase_detail.js
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
		data: '',
		moneyListInfo:'',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.data.data = JSON.parse(options.id);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},
	recordDetail() {
		var that = this;
		var appid = app.globalData.appid;
		var data = that.data.data;
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
			item_id:data.item_id,
			attr_id:data.attr_id,
			start:data.date[0],
			end:data.date[1],
		}
		rs.getRequests("buyRecordDetail", data, (res) => {
			if (res.data.code == 200) {
				that.setData({
					moneyListInfo: res.data.data
				})
				console.log(that.data.moneyListInfo)
			}
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		var that = this;
		that.recordDetail()
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

	}
})
