// pages/index/shopdetail/index.js
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
		id: "",
		prefix: prefix,
		imgRemote: imgRemote,
		arrow: true,
		position: false,
		wares: [],
		collect: 0,
		kind: 0,
		val: 1,
		timeData: '',
		recommend: [],
		keyBoard: true
	},
	onPageScroll(e) {
		//参数e会返回滚动条滚动的高度
		// console.log(e)

		if (e.scrollTop > 0) {
			this.setData({
				position: true
			})
		} else {
			this.setData({
				position: false
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.setData({
			id: options.id
			// id: 1758
		});
		this.getItem();
		this.itemRecommend()
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
          getApp().globalData.isFresh=false;
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
	onChange(e) {
		this.setData({
			timeData: e.detail
		});
	},
	showArrow() {
		let {
			arrow
		} = this.data;
		this.setData({
			arrow: !arrow
		})

	},
	collect() {
		let {
			id,
			collect
		} = this.data;
		let status;
		if (collect == 2) {
			status = 1
		} else {
			status = 2
		}
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
				this.setData({
					collect: status
				})
				if (collect == 2) {
					Toast('取消收藏')
				} else {
					Toast('收藏成功')
				}
			} else {
				Toast(res.msg)
			}
		})
	},
	selectSpecs(e) {
		let index = e.currentTarget.dataset.kind;
		this.setData({
			kind: index
		})
	},
	getItem() {
		let {
			id
		} = this.data;
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			id: id,
			appid: appid,
			timeStamp: timeStamp
		};
		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign
		}, obj)
		rs.getRequests("getItemById", params, (res) => {
			let data = res.data;
			if (data.code == 200) {
				let infos = data.data.info.replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img$1 class="pho"');
				this.setData({
					info: infos,
					wares: data.data,
					collect: data.data.collect_status
				})
			} else {
				Toast(res.msg)
			}
		})
	},
	itemRecommend() {
		let {
			id,
			collect
		} = this.data;
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			id: id,
			appid: appid,
			timeStamp: timeStamp
		};
		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign
		}, obj)
		rs.getRequests("itemRecommend", params, (res) => {
			let data = res.data;
			if (data.code == 200) {
				this.setData({
					recommend: data.data
				})
			} else {
				Toast(res.data.msg)
			}
		})
	},
	detailUrl(e) {
		let {
			id
		} = e.currentTarget.dataset;
		wx.navigateTo({
			url: `./index?id=${id}`,
		})
	},
	buyNum(event) {
		let val = parseFloat(event.detail);
		this.setData({
			val: val
		});

	},
	addCart(cartUrl) {
		let timeStamp = Math.round(new Date().getTime() / 1000);
		let {
			wares,
			val,
			kind
		} = this.data;
		let id, attrid;
		if (wares.attr.length == 0) {
			id = wares.id;
			attrid = 0
		} else {
			id = wares.attr[kind].item_id;
			attrid = wares.attr[kind].id;
		}
		let obj = {
			appid: appid,
			timeStamp: timeStamp,
			item_id: id,
			attr_id: attrid,
			item_num: val
		};

		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign,
		}, obj)
		rs.postRequests('firstChangeNum', params, (res) => {
			let data = res.data;
			if (data.code == 200) {
				//缓存分类数据
				let classify = wx.getStorageSync('classify');
				let newClassify = [];
				for (let i of classify) {
					if (i.id == wares.id) {
						i.cart_num += parseFloat(val);
					}
					newClassify.push(i);
					wx.setStorageSync('classify', newClassify)
				}
				// 收藏
				let collect = wx.getStorageSync('collect');
				let newCollect = [];
				for (let i of collect) {
					if (i.id == wares.id) {
						i.cart_num += parseFloat(val);
					}
					newCollect.push(i);
					wx.setStorageSync('collect', newCollect)
				}
				// 推荐
				let recomed = wx.getStorageSync('recomed');
				let newrecomed = [];
				for (let i of collect) {
					if (i.id == wares.id) {
						i.cart_num += parseFloat(val);
					}
					newrecomed.push(i);
					wx.setStorageSync('recomed', newrecomed)
				}
				Toast('加入购物车成功');
				setTimeout(() => {
					if (cartUrl == true) {
						wx.switchTab({
							url: '/pages/shopcart/index/index',
						})
					}
				}, 500)

			} else if (data.code == 407 || data.code == 406) {
				Toast('购买数量不能超过活动数量');
				this.setData({
					val: 1
				})
			} else {
				Toast(res.data.msg)
			}
		})
	},
	buyNow() {
		this.addCart(true)
	},
	// 显示键盘
	showKey() {
		wx.hideKeyboard()
		this.setData({
			keyBoard: false
		})
	},
	enterKey(e) {
		let {
			wares,
			kind
		} = this.data;
		let {
			val
		} = e.detail;
		if (val == 0) {
			Toast('购买数量不能为零');
			return;
		}
		if (wares.is_float == 1 && !Number.isInteger(Number(val))) {
			Toast('购买数量不能为小数');
			return;
		}
		// if (wares.attr.length == 0) {
		//   if (wares.is_activity == 1) {
		//     if (val > wares.activity_num) {
		//       Toast('购买数量不能大于剩余数量');
		//       return;
		//     }
		//   }
		// } else {
		//   if (wares.attr[kind].is_activity == 1) {
		//     if (val > wares.attr[kind].activity_num) {
		//       Toast('购买数量不能大于剩余数量');
		//       return;
		//     }
		//   }
		// }

		this.setData({
			val: val,
			keyBoard: true
		})
	},
	back() {
		wx.navigateBack({
			delta: 1
		})
	}
})
