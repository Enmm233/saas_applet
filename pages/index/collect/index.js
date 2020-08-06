// pages/index/collect/index.js
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
		prefix: prefix,
		imgRemote: imgRemote,
		is_look: '',
		item_default: '',
		list: '',
		logo: '',
		shuiyin: '',
		page: 1,
		num: 10,
		id: '',
		bitmap: false,
		show: true,
		cart: false,
		cartInfos: '',
		showLoad: false,
		is_detail:''
	},
	collect(e) {
		let {
			id,
			index
		} = e.currentTarget.dataset;
		// console.log(e.currentTarget.dataset)
		// return;
		let status = 1;
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			item_id: id,
			appid: appid,
			timeStamp: timeStamp,
			status: status
		};
		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign
		}, obj)
		rs.getRequests("changeCollect", params, (res) => {
			let data = res.data;
			if (data.code == 200) {
				Toast('取消收藏')
				var arr = this.data.list;
				arr.splice(index, 1)
				this.setData({
					list: arr,
				})
			} else {
				Toast(res.msg)
			}
		})
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
		this.collectList()
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {
		wx.setStorageSync('collect', this.data.list)
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
		let {
			page,
			num,
			list
		} = this.data;
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			appid: appid,
			timeStamp: timeStamp
		};
		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign,
			page: page + 1,
			num: num
		}, obj)
		rs.getRequests("getIndexSelect", params, (res) => {
			let data = res.data;
			if (res.data.data != '') {
				this.setData({
					list: list.concat(res.data.data.list),
					page: page + 1,
					showLoad: true
				})
				if (res.data.data.list.length == 0) {
					this.setData({
						showLoad: false
					})
				}
			} else {
				Toast(res.msg)
			}
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},
	back() {
		wx.navigateBack()
	},
	clearCollect() {
		if (this.data.list.length == 0) {
			Toast('暂时无清空的商品');
			return;
		}
		Dialog.confirm({
			title: '',
			message: '确定将收藏商品全部清空吗？'
		}).then(() => {
			// on confirm
			let timeStamp = Math.round(new Date().getTime() / 1000);
			let obj = {
				appid: appid,
				timeStamp: timeStamp
			};
			let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
			let params = Object.assign({
				sign: sign
			}, obj)
			rs.getRequests("deleteCollect", params, (res) => {
				let data = res.data;
				if (data.code == 200) {
					Toast('成功清空收藏列表');
					setTimeout(() => {
						wx.switchTab({
							url: '/pages/index/index/index',
						})
					}, 1000)
					this.setData({
						bitmap: true,
						list: ''
					})
				} else {
					Toast(res.data.msg)
				}
			})
		}).catch(() => {
			// on cancel
		});

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
	collectList() {
		let {
			page,
			num,is_detail
		} = this.data;
		if (page != 1) {
			this.setData({
				list: wx.getStorageSync('collect')
			});
			return;
		}
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			appid: appid,
			timeStamp: timeStamp
		};
		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign,
			page: page,
			num: num
		}, obj)
		rs.getRequests("getIndexSelect", params, (res) => {
			let data = res.data;
			if (data.code == 200) {
				let {
					is_look,
					item_default,
					list,
					logo,
					shuiyin,is_detail
				} = data.data;

				if (list.length < 10 && list.length > 0) {
					this.setData({
						showLoad: false
					})
				} else {
					this.setData({
						showLoad: true
					})
				}
				this.setData({
					is_look: is_look,
					item_default: item_default,
					list: list,
					logo: logo,
					is_detail:is_detail,
					shuiyin: shuiyin
				})
			} else {
				Toast(res.msg)
			}
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
	}
})
