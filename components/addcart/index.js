// components/addcart.js
import Toast from '@vant/weapp/toast/toast';
const md5 = require('../../utils/md5.js');
const rs = require('../../utils/request.js');
let app = getApp();
let {
	appid,
	appsecret,
	prefix,
	imgRemote
} = app.globalData;
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		show: {
			type: Boolean,
			value: false
		},
		cartInfo: {
			type: Object
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		activeIndex: 0,
		imgRemote: imgRemote,
		select: '',
		token: wx.getStorageSync("token"),
		num: 1
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onClose() {
			this.setData({
				show: false,
				activeIndex: 0,
				select: '',
				num: 1
			})
		},
		//  选择规格
		selectSpec(e) {
			let {
				item
			} = e.currentTarget.dataset;
			this.setData({
				activeIndex: item[1],
				select: item[0]
			})
		},
		onChange(event) {
			this.setData({
				num: event.detail
			})
		},
		submit() {

			let info = this.properties.cartInfo[0];
			let timeStamp = Math.round(new Date().getTime() / 1000);
			let obj = {
				appid: appid,
				timeStamp: timeStamp
			};
			let newobj = {};
			let {
				num
			} = this.data;
			if (info.attr.length == 0) {
				newobj = Object.assign({
					item_id: info.id,
					attr_id: 0,
					item_num: num,
				}, obj)
			} else {
				let select = '';
				if (!this.data.select) {
					select = info.attr[0]
				} else {
					select = this.data.select;
				}
				newobj = Object.assign({
					item_id: select.item_id,
					attr_id: select.id,
					item_num: num,
				}, obj)
			}
			let sign = md5.hexMD5(rs.objKeySort(newobj) + appsecret);
			let params = Object.assign({
				sign: sign
			}, newobj);

			rs.postRequests("firstChangeNum", params, (res) => {
				if (res.data.code == 200) {
					Toast('成功加入购物车');
					let pages = getCurrentPages();
					console.log(pages[0])
					if (pages[0].route == 'pages/shopcart/index/index') {
						pages[0].onShow();
					}
				} else if (res.data.code == 407 || res.data.code == 406) {
					Toast("购买数量不能超过活动数量")
				} else {
					Toast(res.data.msg)
				}
				this.setData({
					show: false,
					activeIndex: 0,
					select: '',
					num: 1
				})
			})
		}
	}
})
