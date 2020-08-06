// pages/shopcart/shoplist/index.js
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
		countPrice: '',
		activity_type: '',
		countPrice: '',
		gift: '',
		show: true,
		showRemark: false,
		remark: '',
		keyIndex: '',
		is_look: '',
		logo: '',
		shuiyin: '',
		shop: [],
		item_default: '',
		count: ''
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
		this.getCountNum();
		this.openCart();
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
	shopcartUrl() {
		wx.navigateBack({
			delta: 1
		})
	},
	getCountNum() {
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			appid: appid,
			timeStamp: timeStamp
		};
		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign
		}, obj)
		rs.getRequests("getCountNum", params, (res) => {
			let {
				data
			} = res;
			if (data.code == 200) {
				let {
					countPrice,
					activity_type
				} = data.data;
				this.setData({
					countPrice: countPrice,
					activity_type: activity_type
				});
			}
		})
	},
	openCart() {
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			appid: appid,
			timeStamp: timeStamp
		};
		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign
		}, obj)
		rs.getRequests("openCart", params, (res) => {
			let {
				data
			} = res;
			if (data.code == 200) {
				let {
					shuiyin,
					logo,
					is_look,
					shop,
					item_default,
					activity_rule
				} = data.data;
				let count = 0;
				for (let i of shop) {
					count += i.count
					this.setData({
						count: count
					})
				}
				this.setData({
					logo: logo,
					shuiyin: shuiyin,
					shop: shop,
					item_default: item_default
				});
				for (let i of activity_rule) {
					if (this.data.countPrice >= i.price) {
						this.setData({
							gift: i
						});
						return;
					}

				}
			} else {
				Toast(res.msg)
			}
		})
	},
	// 删除单个
	deleteSign(e) {
		Dialog.confirm({
			title: '',
			message: '确定删除该商品吗？'
		}).then(() => {
			// on confirm
			let {
				list
			} = e.currentTarget.dataset;
			let [item, first, second] = [list[0], list[1], list[2]];

			let timeStamp = Math.round(new Date().getTime() / 1000);
			let itemId, attrId = 0;
			if (item.attr.length == 0) {
				itemId = item.id
			} else {
				itemId = item.attr.item_id;
				attrId = item.attr.id;
			}
			let obj = {
				appid: appid,
				timeStamp: timeStamp,
				item_id: itemId,
				attr_id: attrId
			};

			let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
			let params = Object.assign({
				sign: sign,
			}, obj)
			rs.postRequests('deleteCart', params, (res) => {
				let data = res.data;
				if (data.code == 200) {

					let {
						shop
					} = this.data;
					Toast('成功删除商品')

					shop[first].list.splice(second, 1);
					shop[first].count -= 1;
					this.setData({
						shop: shop
					})
					let count = 0;
					for (let i of shop) {
						count += i.count
						this.setData({
							count: count
						})
					}
					if (res.data.data.countNum == 0)
						setTimeout(() => {
							wx.switchTab({
								url: '/pages/index/index/index',
							}, 1000)
						})
				} else {
					Toast(data.msg)
				}
			})
		}).catch(() => {
			// on cancel
		});
	},
	// 清空所有
	clearAll() {
		Dialog.confirm({
			title: '',
			message: '确定清空购物车吗？'
		}).then(() => {
			// on confirm
			let {
				shop
			} = this.data;
			let keys = [];
			for (let i of shop) {
				i.list.forEach(v => {
					keys.push(v.cart_id)
				})
			}
			let timeStamp = Math.round(new Date().getTime() / 1000);
			let obj = {
				appid: appid,
				timeStamp: timeStamp,
			};

			let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
			let params = Object.assign({
				sign: sign,
				keys: keys
			}, obj)
			rs.postRequests('deleteByUserIds', params, (res) => {
				let data = res.data;
				if (data.code == 200) {
					Toast('成功清空所有商品')
					setTimeout(() => {
						// wx.navigateBack({})
						wx.switchTab({
							url: '/pages/index/index/index',
						})
					}, 1000)
				} else {
					Toast(data.msg)
				}
			})
		}).catch(() => {
			// on cancel
		});
	},
	addCart(event, url, num, message = "成功加入购物车") {
		let {
			item
		} = event.currentTarget.dataset
		let [first, second] = [item[2], item[3]]
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let itemId, attrId = 0;
		if (item[0].attr.length == 0) {
			itemId = item[0].id;
		} else {
			itemId = item[0].attr.item_id;
			attrId = item[0].attr.id;
		}
		let obj = {
			appid: appid,
			timeStamp: timeStamp,
			item_id: itemId,
			attr_id: attrId,
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
				let shop = this.data.shop;
				shop[first].list[second].cart_num = num;
				this.setData({
					shop: shop,
					show: true
				})
				if (num <= 0) {
					shop[first].list.splice(second, 1);
					shop[first].count -= 1;

					this.setData({
						shop: shop
					})
					let count = 0;
					for (let i of shop) {
						count += i.count
						this.setData({
							count: count
						})
					}
				}
			} else if (data.code == 407 || data.code == 406) {
				Toast('购买数量不能超过活动数量');
				if(this.data.shop[first].list[second].attr != ''){
					var nums = this.data.shop[first].list[second].attr.activity_num;
				}else{
					var nums = this.data.shop[first].list[second].activity_num;
				}
				let shop = this.data.shop;
				shop[first].list[second].cart_num = nums;
				this.setData({
					shop: shop,
					show: true
				})
				if (nums <= 0) {
					shop[first].list.splice(second, 1);
					shop[first].count -= 1;
					this.setData({
						shop: shop
					})
					let count = 0;
					for (let i of shop) {
						count += i.count
						this.setData({
							count: count
						})
					}
				}
			} else {
				Toast(res.data.msg)
			}
		})
	},
	plus(event) {
		let {
			item
		} = event.currentTarget.dataset;
		let num = item[1]
		num += 1;
		this.addCart(event, 'changeNum', num)
	},
	minus(event) {
		let {
			item
		} = event.currentTarget.dataset;
		let num = item[1]
		num -= 1;
		if (num == 0) {
			this.addCart(event, 'deleteCart', num, '成功删除商品')
		} else {
			this.addCart(event, 'changeNum', num)
		}
	},
	keyFocus(e) {
		wx.hideKeyboard();
		this.setData({
			show: false,
			keyIndex: e
		})
	},
	enterKey(e) {
		let {
			val
		} = e.detail;
		let {
			item
		} = this.data.keyIndex.currentTarget.dataset;

		let [info, index] = [item[0], item[1]];
		if (val == 0) {
			Toast('购买数量不能为零');
			return;
		}
		if (info.is_float == 1 && !Number.isInteger(Number(val))) {
			Toast('购买数量不能为小数');
			return;
		}
		this.addCart(this.data.keyIndex, 'changeNum', parseFloat(val))
	},
	addRemark(e) {
		let {
			item
		} = e.currentTarget.dataset;
		let [first, second] = [item[2], item[3]];
		let shop = this.data.shop;
		this.setData({
			showRemark: true,
			keyIndex: item,
			remark: shop[first].list[second].remark
		})
	},
	changeRemark(e) {
		let {
			value
		} = e.detail;
		this.setData({
			remark: value
		})
	},
	confirmRemark() {
		let {
			keyIndex,
			remark,
			shop,
		} = this.data;

		let [first, second] = [keyIndex[2], keyIndex[3]];
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let itemId, attrId = 0;
		if (keyIndex[0].attr.length == 0) {
			itemId = keyIndex[0].id;
		} else {
			itemId = keyIndex[0].attr.item_id;
			attrId = keyIndex[0].attr.id;
		}
		let obj = {
			appid: appid,
			timeStamp: timeStamp,
			item_id: itemId,
			attr_id: attrId,
			remark: remark
		};

		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign,
			remark: remark
		}, obj)
		rs.postRequests('itemRemark', params, (res) => {
			let data = res.data;
			if (data.code == 200) {
				Toast('修改备注成功');
				let shop = this.data.shop;
				shop[first].list[second].remark = remark;
				this.setData({
					shop: shop
				});
			} else if (res.data.code == 400) {
				Toast('添加备注失败，请删除特殊字符，例如空格...')
			} else {
				Toast(res.data.msg)
			}
		})

	}
})
