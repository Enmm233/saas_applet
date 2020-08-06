// pages/classify/index/index.js
import Toast from '@vant/weapp/toast/toast';
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
let app = getApp();
let {
	appid,
	appsecret,
	prefix,
	imgRemote,
	classId
} = app.globalData;
Page({

	/** 页面的初始数据
	 */
	data: {
		token: wx.getStorageSync('token'),
		activetitle: 0,
		loading: false,
		prefix: prefix,
		imgRemote: imgRemote,
		activeIndex: 1,
		num: 10,
		page: 1,
		show: true,
		cartInfos: '',
		keyIndex: '',
		showInfo: '',
		specId: '',
		classname: false,
		firstCate: [],
		secondCate: [],
		firstId: '',
		secondId: 0,
		secondIndex: 0,
		logo: '',
		shuiyin: '',
		item_default: '',
		is_look: '',
		is_detail:'',
		list: [],
		cart: false,
		bitmap: false,
		textInfo:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		this.setData({
			firstId: getApp().globalData.classId
		})
		// if (!wx.getStorageSync('token')) {
		//   rs.showLogin()
		// } else {
		let pageClassify = app.globalData.aData.pageClassify;
		if (pageClassify == false) {
			this.data.page = 1;
		}
		this.mpItem()
		// }

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {
		getApp().globalData.classId = this.data.firstId;
		this.setData({
			firstId: getApp().globalData.classId
		})
		wx.setStorageSync('classify', this.data.list)

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
		var that = this;
		var timeStamp = Math.round(new Date().getTime() / 1000);
		var {
			num,
			page,
			list,
			secondId
		} = that.data;
		var obj = {
			appid: appid,
			timeStamp: timeStamp,
		}
		var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
		var data = {
			appid: appid,
			num: num,
			page: page + 1,
			secondId: secondId,
			timeStamp: timeStamp,
			sign: sign
		}
		rs.getRequests("mpItemList", data, (res) => {
			if (res.data.code == 200) {

				if (res.data.data.list.length != 0) {

					that.setData({
						list: list.concat(res.data.data.list),
						page: page + 1,
						loading: true
					})
				} else {

				 let title=`上滑或点击进入<span class='red-font'>${that.data.secondCate[that.data.secondIndex+1].name}</span>`;
					that.setData({
						page: page,
						loading: false,
						showText: true,
						textInfo:title
					})
				}
			}
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},
	nextSecond(){
		if(this.data.textInfo=='没有更多呢'){
			return;
		}
		let id=this.data.secondCate[this.data.secondIndex+1].id;
		this.setData({
			page: 1,
			list:[],
			secondId:id,
			secondIndex: this.data.secondIndex+1
		})
		this.mpItem();
	},
	// 分类接口
	mpItem() {

		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			appid: appid,
			timeStamp: timeStamp
		};
		let {
			firstId,
			secondId,
			page,
			num,
		} = this.data;

		if (page != 1) {
			this.setData({
				list: wx.getStorageSync('classify')
			});
			return;
		}
		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign,
			firstId: firstId,
			secondId: secondId,
			page: page,
			num: num
		}, obj)
		rs.getRequest("mpItemList", params, (res) => {
			let data = res.data;
			if (data.code == 200) {
				let {
					is_look,
					firstCate,
					item_default,
					list,
					logo,
					secondCate,
					shuiyin,is_detail
				} = data.data;
		
				let newSecond=[];
				for(let i of secondCate){
					i.name=i.name.replace(/\s+/g,'');
					newSecond.push(i);
				}
		
				if (list.length<10) {
					this.setData({
						textInfo:'没有更多呢',
						loading:false,
					})
				} else {
					this.setData({
						loading:true,
					})
				}
				if (!firstId) {
					firstId = firstCate[0].id;
				}
				if (firstId) {
					data.data.firstCate.map((e, index) => {
						if (firstId == e.id) {
							this.setData({
								activetitle: index
							})
						}
					})
				}
				if (list.length < 10) {
					this.setData({
						loading: false
					})
				} else {
					this.setData({
						loading: true
					})
				}
				this.setData({

					firstId: firstId,
					is_look: is_look,
					firstCate: firstCate,
					item_default: item_default,
					list: list,
					logo: logo,
					shuiyin: shuiyin,
					is_detail:is_detail,
					secondCate: newSecond
				})
			} else {
				Toast(res.msg)
			}
		})
	},
	firstCates(e) {
		this.setData({
			list:[]
		});
		// return;
		let index = e.detail.index;
		let state = this.data.firstCate[index];
		// if (wx.pageScrollTo) {
		// 	wx.pageScrollTo({
		// 		scrollTop: 0,
		// 	})
		// }

		let firstid = state.id;

		this.setData({
			firstId: getApp().globalData.classId
		})
		this.setData({
			page: 1,
			firstId: firstid,
			secondIndex: 0,
			secondId: 0
		})
		this.mpItem()

	},
	// 一级分类
	firstCate(event) {
	
		// if (wx.pageScrollTo) {
		// 	wx.pageScrollTo({
		// 		scrollTop: 0,
		// 	})
		// }
	
		// let {
		//   firstid
		// } = event.currentTarget.dataset;
		let {
			firstid
		} = event.id;
		this.setData({
			firstId: getApp().globalData.classId
		})
		this.setData({
			page: 1,
			firstId: firstid,
			secondIndex: 0,
			secondId: 0,

		})
		this.mpItem()
	},
	// 二级分类
	secondCate(event) {
		// if (wx.pageScrollTo) {
		// 	wx.pageScrollTo({
		// 		scrollTop: 0,
		// 	})
		// }
	
		let {
			secondid
		} = event.currentTarget.dataset;
		this.setData({
			page: 1,
			list:[],
			secondId: secondid[0].id,
			secondIndex: secondid[0].index
		})
		
		this.mpItem();
	},
	// 显示全部分类
	showAll() {
		this.setData({
			classname: true
		})
	},
	cancel() {
		this.setData({
			classname: false
		})
	},
	// 显示购物车
	showCart(e) {
		let {
			item
		} = e.currentTarget.dataset;
		this.setData({
			cart: true,
			cartInfos: item,
		})
	},
	// 加入购物车
	addcart(e, url = "changeNum", num = 1, message = "成功加入购物车") {
		let {
			item
		} = e.currentTarget.dataset;
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
				this.data.list[item[1]].cart_num = num;
				let list = this.data.list;
				this.setData({
					list: list
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
	plus(event) {
		let {
			item
		} = event.currentTarget.dataset;
		let list = this.data.list;
		list[item[1]].cart_num += 1;
		let num = list[item[1]].cart_num;
		this.setData({
			list: list
		});
		this.addcart(event, 'changeNum', num)
	},
	minus(event) {
		let {
			item
		} = event.currentTarget.dataset;
		this.data.list[item[1]].cart_num -= 1;
		let num = this.data.list[item[1]].cart_num;
		let list = this.data.list;
		this.setData({
			list: list
		});
		if (num == 0) {
			this.addcart(event, 'deleteCart', num, '成功删除商品')
		} else {
			this.addcart(event, 'changeNum', num)
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
		this.data.list[index].cart_num = parseFloat(val);
		let list = this.data.list;

		let timeStamp = Math.round(new Date().getTime() / 1000);
		let obj = {
			appid: appid,
			timeStamp: timeStamp,
			item_id: info.id,
			attr_id: 0,
			item_num: val
		};

		let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
		let params = Object.assign({
			sign: sign,
		}, obj)
		rs.postRequests('changeNum', params, (res) => {
			let data = res.data;
			if (data.code == 200) {
				Toast('成功加入购物车');
				this.setData({
					list: list,
					show: true
				});
			} else if (data.code == 407 || data.code == 406) {
				Toast('购买数量不能超过活动数量');
			} else {
				Toast(data.msg)
			}
		})
	},
	detailUrl(e) {
		console.log(this.data.is_detail)
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
	cancel() {
		this.setData({
			classname: false
		})
	},
	selectSpec(e) {
		let {
			firstid
		} = e.currentTarget.dataset;

		this.setData({
			specId: firstid
		})
	},
	determine() {
		if (!this.data.specId) {
			Toast('请先选择分类')
			return;
		}
		this.setData({
			firstId: this.data.specId,
			classname: false
		})

		this.data.firstCate.map((e, index) => {
			if (this.data.firstId == e.id) {
				this.setData({
					activetitle: index
				})
			}
		})
		this.mpItem();
		this.setData({
			specId: '',
		})
	}
})
