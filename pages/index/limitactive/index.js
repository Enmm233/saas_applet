// pages/index/limitactive/index.js
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
		prefix: prefix,
		imgRemote: imgRemote,
		activeIndex: 0,
		statu: true,
		showTop: false,
		goodsList: [],
		activeList: [],
		pbId: '',
		activeId: '',
		logo: '',
		is_look: '',
		item_default: '',
		shuiyin: '',
		timeData: '',
		keyIndex: ''
	},
	onPageScroll(e) {
		//参数e会返回滚动条滚动的高度
		// console.log(e)
		let screenHeight = wx.getSystemInfoSync().windowHeight;
		if (e.scrollTop >= screenHeight) {
			this.setData({
				showTop: true
			})
		} else {
			this.setData({
				showTop: false
			})
		}
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
		this.panicBuylist();
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
	showChecked(event) {
		let {
			item
		} = event.currentTarget.dataset;

		this.setData({
			activeIndex: item[0],
			pbId: item[1]
		});
		this.panicBuylist()
	},
	keyFocus(e) {
		this.setData({
			statu: false,
			keyIndex: e.currentTarget.dataset
		})
	},
	onChange(e) {
		this.setData({
			timeData: e.detail
		});
	},
	indexUrl() {
		wx.switchTab({
			url: "../index/index"
		})
	},
	panicBuylist() {
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			appid: appid,
			timeStamp: timeStamp
		};
		let {
			pbId
		} = this.data;
		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign,
			pbId: pbId
		}, obj)
		rs.getRequest("panicBuyList", params, (res) => {
			let data = res.data;
			if (data.code == 200) {
				let {
					goodsList,
					activeList,
					is_look,
					item_default,
					logo,
					shuiyin
				} = data.data;
				this.setData({
					goodsList: goodsList,
					activeList: activeList,
					is_look: is_look,
					item_default: item_default,
					shuiyin: shuiyin,
					logo: logo
				})
			}

		})
	},
	addCart(item, url = "changeNum", num = 1, message = "成功加入购物车") {

		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			appid: appid,
			timeStamp: timeStamp,
			item_id: item[0].item_id,
			attr_id: item[0].attr_id,
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
				let list = this.data.goodsList;
				list[item[1]].cart_num = num;
				this.setData({
					goodsList: list,
					statu: true
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
				Toast(res.msg)
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
		let list = this.data.goodsList;
		list[item[1]].cart_num += 1;
		let num = list[item[1]].cart_num;
		this.addCart(item, 'changeNum', num)
	},
	minus(event) {


		let {
			item
		} = event.currentTarget.dataset;
		console.log(this.data.goodsList[item[1]])
		this.data.goodsList[item[1]].cart_num -= 1;
		let num = this.data.goodsList[item[1]].cart_num;
		let list = this.data.goodsList;
		this.setData({
			goodsList: list
		});
		if (num == 0) {
			this.addCart(item, 'deleteCart', num, '成功删除商品')
		} else {
			this.addCart(item, 'changeNum', num)
		}
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
		if (val > info.activity_num) {
			Toast('购买数量不能超过剩余数量');
			return;
		}
		this.addCart(item, 'changeNum', parseFloat(val))
	},
	detailUrl(e) {
		let {
			id
		} = e.currentTarget.dataset;
		wx.navigateTo({
			url: '/pages/index/shopdetail/index?id=' + id,
		})
	}
})
