// pages/index/search/index.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
import Toast from '@vant/weapp/toast/toast';
let app = getApp();
let {
	appid,
	appsecret,
	prefix,
	imgRemote
} = app.globalData;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		token: wx.getStorageSync('token'),
		prefix: prefix,
		imgRemote: imgRemote,
		searchKeys: [],
		list: [],
		val: '',
		keywords: true,
		showShop: false,
		bitmap: false,
		show: true,
		logo: '',
		item_default: '',
		is_look: '',
		shuiyin: '',
		language: false,
		start: true,
		is_detail:''
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
		this.searchKey()
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {
		this.setData({
			list: [],
			keywords: true,
			bitmap: false,
			show: true,
			val: ''
		})
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
	backPage() {
		wx.navigateBack({
			delta: 1
		})
	},
	detailUrl(e) {
		if(this.data.is_detail==0){
			return;
		}
		let {
			id
		} = e.currentTarget.dataset;
		wx.navigateTo({
			url: `/pages/index/shopdetail/index?id=${id}`,
		})
	},
	searchKey() {
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			appid: appid,
			timeStamp: timeStamp
		};
		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign
		}, obj)
		rs.getRequests("getSearchData", params, (res) => {
			let data = res.data;
			if (data.code == 200) {
				this.setData({
					searchKeys: data.data
				})
			} else {
				Toast(res.msg)
			}
		})
	},
	buyNum(event) {
		this.setData({
			val: event.detail.value
		});
	},
	list() {
		let {
			val
		} = this.data;
		let content = val.replace(' ', '');
		let contentRe = content.trimEnd();
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			appid: appid,
			timeStamp: timeStamp,
			keyword: contentRe
		};
		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign
		}, obj)
		rs.getRequest("getSearchItem", params, (res) => {
			let data = res.data;
			let {
				list,
				logo,
				is_look,
				item_default,
				shuiyin,
				is_detail
			} = data.data;
			if (data.code == 200) {
				this.setData({
					list: list,
					is_look: is_look,
					logo: logo,
					shuiyin: shuiyin,
					item_default: item_default,
					is_detail:is_detail
				});
				if (data.data.length != 0) {
					this.setData({
						keywords: false,
						showShop: true,
					})
				} else {
					this.setData({
						keywords: false,
						bitmap: true
					})
				}
			} else {
				Toast(data.msg)
			}
		})

	},
	getVal(e) {
		let {
			word
		} = e.currentTarget.dataset;
		this.setData({
			val: word,
			keywords: false
		})
		this.list();
	},
	getFocus() {
		this.setData({
			val: '',
			keywords: true,
			showShop: false,
			bitmap: false
		})
	},
	addCart(item, url = "changeNum", num = 1, message = "成功加入购物车") {
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			appid: appid,
			timeStamp: timeStamp,
			item_id: item[0].id,
			attr_id: 0,
			item_num: num
		};

		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign,
		}, obj)
		rs.postRequests(url, params, (res) => {
			let data = res.data;
			if (data.code == 200) {
				Toast(message);
				let list = this.data.list;
				list[item[1]].cart_num = num;
				this.setData({
					list: list,
					statu: true,
					show: true
				})
			} else if (data.code == 407 || data.code == 406) {
				Toast('购买数量不能超过活动数量');
				var nums = this.data.list[item[1]].activity_num;
				this.data.list[item[1]].cart_num = nums;
				let list = this.data.list;
				this.setData({
					list: list
				})

			} else {
				Toast(res.data.msg)
			}
		})
	},
	addcart(event) {
		let {
			item
		} = event.currentTarget.dataset;

		this.addCart(item)
	},
	plus(event) {
		let {
			item
		} = event.currentTarget.dataset;
		let list = this.data.list;
		list[item[1]].cart_num += 1;
		let num = list[item[1]].cart_num;
		this.addCart(item, 'changeNum', num)
	},
	minus(event) {
		let {
			item
		} = event.currentTarget.dataset;
		let list = this.data.list;

		list[item[1]].cart_num -= 1;
		let num = list[item[1]].cart_num;

		if (num == 0) {
			this.addCart(item, 'deleteCart', num, '成功删除商品')
		} else {
			this.addCart(item, 'changeNum', num)
		}
	},
	keyFocus(e) {
		wx.hideKeyboard();
		this.setData({
			show: false,
			keyIndex: e.currentTarget.dataset
		})
	},
	enterKey(e) {
		let {
			val
		} = e.detail;
		let {
			item
		} = this.data.keyIndex;
		let [info, index] = [item[0], item[1]];
		if (val == 0) {
			Toast('购买数量不能为零');
			return;
		}

		if (info.is_float == 1 && !Number.isInteger(Number(val))) {
			Toast('购买数量不能为小数');
			return;
		}
		// if (val > info.activity_num) {
		//   Toast('购买数量不能超过剩余数量');
		//   return;
		// }
		this.addCart(item, 'changeNum', parseFloat(val))
	},
	showCart(e) {
		let {
			item
		} = e.currentTarget.dataset;
		this.setData({
			cart: true,
			cartInfos: item,
		})
	},

	onClose() {
		this.setData({
			language: false,
			start: true
		})
	},
	speech() {
		let that = this;
		this.setData({
			language: true,
			start: true
		})
		const recorderManager = wx.getRecorderManager();

		const options = {
			duration: 3000, //指定录音的时长，单位 ms
			sampleRate: 16000, //采样率
			numberOfChannels: 1, //录音通道数
			encodeBitRate: 96000, //编码码率
			format: 'mp3', //音频格式，有效值 aac/mp3
			frameSize: 50, //指定帧大小，单位 KB
		}

		recorderManager.start(options)

		recorderManager.onStop((res) => {
			var timeStamp = Math.round(new Date().getTime() / 1000);
			var obj = {
				appid: appid,
				timeStamp: timeStamp,
			}
			let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
			var audio = res.tempFilePath;
			wx.uploadFile({
				url: app.globalData.rootUrl + "voiceSearch",
				filePath: audio,
				method: 'POST',
				name: 'audio',
				header: {
					'content-type': 'multipart/form-data',
				},
				formData: {
					appid: appid,
					timeStamp: timeStamp,
					audio: audio,
					sign: sign,
				},
				success: function(reg) {
					console.log(JSON.parse(reg.data))
					var reg = JSON.parse(reg.data)

					if (reg.code == 200) {

						that.setData({
							val: reg.data.message.replace(/。/g, ''),
							language: false
						})
						// console.log(that.data.val)
						that.list();
					}
					if (reg.code == 500) {
						// console.log(45)
						that.setData({
							start: false
						})
					}
				},
				fail: function() {
					console.log("语音识别失败");
				}
			})
		});
	},
	//語音接口
	voiceInterface(audio) {
		let that = this;
		var timeStamp = Math.round(new Date().getTime() / 1000);
		var obj = {
			appid: appid,
			timeStamp: timeStamp,
		}
		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		// var audio = res.tempFilePath

		wx.uploadFile({
			url: app.globalData.rootUrl + "voiceSearch",
			filePath: audio,
			method: 'POST',
			name: 'audio',
			header: {
				'content-type': 'multipart/form-data',
			},
			formData: {
				appid: appid,
				timeStamp: timeStamp,
				audio: audio,
				sign: sign,
			},
			success: (reg) => {
				var reg = JSON.parse(reg.data);

			},
			fail: function() {
				// console.log("语音识别失败");
			}
		})
	},
	retry() {
		this.speech();
	}
})
