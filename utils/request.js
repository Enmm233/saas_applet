const app = getApp();
var active = {
	'active': app.globalData.active
};
var rootDocment = app.globalData.rootUrl; //主接口
var globalUrl = ["login"]
if (wx.getStorageSync("token")) {
	var header = {
		'Accept': 'application/json',
		'content-type': 'application/json', //
		'Authorization': wx.getStorageSync("token"),
	}
}

// 解决多次弹框
function showLogin() {
	wx.showModal({
		title: '将获您的账号、密码、等登录信息。',
		content: '是否同意授权去登录/注册？',
		showCancel: true, //是否显示取消按钮
		cancelText: "拒绝授权", //默认是“取消”
		cancelColor: '#f55637', //取消文字的颜色
		confirmText: "同意登录", //默认是“确定”
		confirmColor: '#54CF1F', //确定文字的颜色
		success: function(res) {
			if (res.cancel) {
				//点击取消,默认隐藏弹框
				wx.switchTab({
					url: '/pages/index/index/index',
				});
			} else {
				//点击确定
				wx.navigateTo({
					url: '/pages/account/login/index',
				});
			}
		},
		fail: function(res) {}, //接口调用失败的回调函数
		complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
	});
}
/***
 * uri: 请求地址
 * datas:请求参数
 * success:请求成功的返回值
 * fail:请求失败的返回值
 */
//get请求带加载
function getRequest(url, datas, success) {
	wx.showLoading({
		title: '加载中',
		duration: 2000,
		mask: true,
		success: function(res) {
			wx.request({
				url: rootDocment + url,
				method: 'GET',
				header: {
					'Accept': 'application/json',
					'content-type': 'application/json', //
					'Authorization': wx.getStorageSync("token"),
				},
				data: Object.assign(datas, active),
				success: res => {
					success(res)
					if (res.header.Authorization != undefined) {
						wx.setStorageSync("token", res.header.Authorization)
					}
					if (res.data.code == 400) {
						wx.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 2000,
							success: function() {

							}
						})
					}
					if (res.data.code == 401) {
						wx.navigateTo({
							url: '/pages/account/login/index',
						});
						return;
						wx.showModal({
							title: '将获您的账号、密码、等登录信息。',
							content: '是否同意授权去登录/注册？',
							showCancel: true, //是否显示取消按钮
							cancelText: "拒绝授权", //默认是“取消”
							cancelColor: '#f55637', //取消文字的颜色
							confirmText: "同意登录", //默认是“确定”
							confirmColor: '#54CF1F', //确定文字的颜色
							success: function(res) {
								if (res.cancel) {
									//点击取消,默认隐藏弹框
									wx.switchTab({
										url: '/pages/index/index/index',
									});
								} else {
									//点击确定
									wx.navigateTo({
										url: '/pages/account/login/index',
									});
								}
							},
							fail: function(res) {}, //接口调用失败的回调函数
							complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
						})
					}
					// if (res.data.code == 403) {
					//   wx.showToast({
					//     title: '账号已禁用',
					//     icon: 'none',
					//     duration: 2000,
					//     success: function () {
					//       wx.navigateTo({
					//         url: '../../login/login/login',
					//       })
					//     }
					//   })
					// }
					if (res.data.code == 408) {
						wx.navigateTo({
							url: '/pages/forbidden/forbidden',
						});
						wx.showToast({
							title: '抱歉，您的服务已到期，请联系《菜东家》工作人员续费！',
							icon: 'none',
							duration: 2000,
						})
					}
					wx.hideLoading();
				},
				fail: res => {
					wx.showModal({
						title: '网络错误',
						content: '网络出错，请刷新重试',
						showCancel: false
					})
				},

			})
		},
		fail: function(res) {},
		complete: function(res) {},
	})


}

//get请求
function getRequests(url, datas, success) {
	wx.request({
		url: rootDocment + url,
		method: 'GET',
		header: {
			'Accept': 'application/json',
			'content-type': 'application/json',
			'Authorization': wx.getStorageSync("token"),
		},
		data: Object.assign(datas, active),
		success: res => {
			success(res)
			if (res.header.Authorization != undefined) {
				wx.setStorageSync("token", res.header.Authorization)
			}
			// if (res.data.code == 400) {
			//   wx.showToast({
			//     title: res.data.msg,
			//     icon: 'none',
			//     duration: 2000,
			//     success: function () {

			//     }
			//   })
			// }
			if (res.data.code == 401) {
				wx.navigateTo({
					url: '/pages/account/login/index',
				});
				return;
				wx.showModal({
					title: '将获您的账号、密码、等登录信息。',
					content: '是否同意授权去登录/注册？',
					showCancel: true, //是否显示取消按钮
					cancelText: "拒绝授权", //默认是“取消”
					cancelColor: '#f55637', //取消文字的颜色
					confirmText: "同意登录", //默认是“确定”
					confirmColor: '#54CF1F', //确定文字的颜色
					success: function(res) {
						if (res.cancel) {
							//点击取消,默认隐藏弹框
							wx.switchTab({
								url: '/pages/index/index/index',
							});
						} else {
							//点击确定
							wx.navigateTo({
								url: '/pages/account/login/index',
							});
						}
					},
					fail: function(res) {}, //接口调用失败的回调函数
					complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
				})
			}
			// if (res.data.code == 403) {
			//   wx.showToast({
			//     title: '账号已禁用',
			//     icon: 'none',
			//     duration: 2000,
			//     success: function () {
			//       wx.navigateTo({
			//         url: '../../login/login/login',
			//       })
			//     }
			//   })
			// }
			if (res.data.code == 408) {
				wx.navigateTo({
					url: '/pages/forbidden/forbidden',
				});
			  wx.showToast({
			    title: '抱歉，您的服务已到期，请联系《菜东家》工作人员续费！',
			    icon: 'none',
			    duration: 2000,
			  })
			}
		},
		fail: res => {
			wx.showModal({
				title: '网络错误',
				content: '网络出错，请刷新重试',
				showCancel: false
			})
		},

	})
}



/***
 * 
 * uri: 请求地址
 * datas:请求参数
 * success:请求成功的返回值
 * fail:请求失败的返回值
 */
//POST请求带加载中
function postRequest(url, datas, success) {
	wx.showLoading({
		title: '加载中',
		mask: true,
		success: function(res) {
			wx.request({
				url: rootDocment + url,
				method: 'POST',
				header: {
					'Accept': 'application/json',
					'content-type': 'application/json', //
					'Authorization': wx.getStorageSync("token"),
				},
				data: Object.assign(datas, active),
				success: res => {
					success(res)
					if (res.header.Authorization != undefined) {
						wx.setStorageSync("token", res.header.Authorization)
					}
					if (res.data.code == 400) {
						wx.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 2000,
							success: function() {

							}
						})
					}
					if (res.data.code == 401) {
						wx.navigateTo({
							url: '/pages/account/login/index',
						});
						return;
						wx.showModal({
							title: '将获您的账号、密码、等登录信息。',
							content: '是否同意授权去登录/注册？',
							showCancel: true, //是否显示取消按钮
							cancelText: "拒绝授权", //默认是“取消”
							cancelColor: '#f55637', //取消文字的颜色
							confirmText: "同意登录", //默认是“确定”
							confirmColor: '#54CF1F', //确定文字的颜色
							success: function(res) {
								if (res.cancel) {
									//点击取消,默认隐藏弹框
									wx.switchTab({
										url: '/pages/index/index/index',
									});
								} else {
									//点击确定
									wx.navigateTo({
										url: '/pages/account/login/index',
									});
								}
							},
							fail: function(res) {}, //接口调用失败的回调函数
							complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
						})
					}
					if (res.data.code == 403) {
						wx.showToast({
							title: '账号已禁用',
							icon: 'none',
							duration: 2000,
							success: function() {
								wx.navigateTo({
									url: '../../login/login/login',
								})
							}
						})
					}
					if (res.data.code == 408) {
						wx.navigateTo({
							url: '/pages/forbidden/forbidden',
						});
						wx.showToast({
							title: '抱歉，您的服务已到期，请联系《菜东家》工作人员续费！',
							icon: 'none',
							duration: 2000,
						})
					}
					wx.hideLoading();
				},
				fail: res => {
					wx.showModal({
						title: '网络错误',
						content: '网络出错，请刷新重试',
						showCancel: false
					})
				},

			})
		},
		fail: function(res) {},
		complete: function(res) {},
	})

}
//POST请求不带加载中
function postRequests(url, datas, success) {
	wx.request({
		url: rootDocment + url,
		method: 'POST',
		header: {
			'Accept': 'application/json',
			'content-type': 'application/json', //
			'Authorization': wx.getStorageSync("token"),
		},
		data: Object.assign(datas, active),
		success: res => {
			success(res)
			if (res.header.Authorization != undefined) {
				wx.setStorageSync("token", res.header.Authorization)
			}
			// if (res.data.code == 400) {
			//   wx.showToast({
			//     title: res.data.msg,
			//     icon: 'none',
			//     duration: 2000,
			//     success: function () {

			//     }
			//   })
			// }
			if (res.data.code == 401) {

				wx.navigateTo({
								url: '/pages/account/login/index',
							});
							return;
				wx.showModal({
					title: '将获您的账号、密码、等登录信息。',
					content: '是否同意授权去登录/注册？',
					showCancel: true, //是否显示取消按钮
					cancelText: "拒绝授权", //默认是“取消”
					cancelColor: '#f55637', //取消文字的颜色
					confirmText: "同意登录", //默认是“确定”
					confirmColor: '#54CF1F', //确定文字的颜色
					success: function(res) {
						if (res.cancel) {
							//点击取消,默认隐藏弹框
							wx.switchTab({
								url: '/pages/index/index/index',
							});
						} else {
							//点击确定
							wx.navigateTo({
								url: '/pages/account/login/index',
							});
						}
					},
					fail: function(res) {}, //接口调用失败的回调函数
					complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
				})
			}
			// if (res.data.code == 403) {
			//   wx.showToast({
			//     title: '账号已禁用',
			//     icon: 'none',
			//     duration: 2000,
			//     success: function () {
			//       for (var i = 0; i < globalUrl.length; i++) {
			//         if (url == globalUrl[i]) {
			//           break;
			//         } else {
			//           wx.navigateTo({
			//             url: '../../login/login/login',
			//           })
			//         }
			//       }
			//     }
			//   })
			// }
			if (res.data.code == 408) {
				wx.navigateTo({
					url: '/pages/forbidden/forbidden',
				});
			  wx.showToast({
			    title: '抱歉，您的服务已到期，请联系《菜东家》工作人员续费！',
			    icon: 'none',
			    duration: 2000,
			  })
			}
		},
		fail: res => {
			wx.showModal({
				title: '网络错误',
				content: '网络出错，请刷新重试',
				showCancel: false
			})
		},

	})
}

/***
 * content: 提示文字
 * confirm:点击确认的回调函数
 * cancel:点击取消的回调函数
 * fail:请求失败的返回值
 */
//提示showModal
function showModal(content, confirm, cancel) {
	wx.showModal({
		title: '提示',
		content: content,
		showCancel: true,
		success(res) {
			if (res.confirm) {
				confirm(confirm)
			} else if (res.cancel) {
				cancel(cancel)
			}
		},
	})
}


function showModals(content) {
	wx.showModal({
		title: '提示',
		content: content,
		showCancel: false,
		confirmColor: '#54d63e',
		success(res) {},
	})
}
/***
 * title: 提示文字
 * icon:提示图标
 * success:返回成功的回调函数
 */
//showToast提示
function showToast(title, icon, success) {
	wx.showToast({
		title: title,
		icon: icon,
		duration:2000,
		mask: true,
		success: function(res) {
			success(res)
		},
		fail: function(res) {},

	})
}

function objKeySort(obj) { //排序的函数
	var newkey = Object.keys(obj).sort();
	//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
	var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
	var sz = '';
	for (var i = 0; i < newkey.length; i++) { //遍历newkey数组
		newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
	}
	Object.keys(newObj).forEach(function(key) {
		sz += '&' + key + '=' + newObj[key]
	});
	return sz.substr(1); //返回排好序的新对象
}



module.exports = {
	getRequest: getRequest,
	getRequests: getRequests,
	postRequest: postRequest,
	postRequests: postRequests,
	header: header, //请求头部
	showModal: showModal, //showmodal提示
	showModals: showModals, //showmodal提示没有确认取消
	showToast: showToast, //showToast提示
	showLogin: showLogin,
	objKeySort: objKeySort //加密排序
}
