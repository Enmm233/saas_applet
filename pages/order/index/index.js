// pages/order/index/index.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 3,
    prefix: app.globalData.prefix,
    imgRemote: app.globalData.imgRemote,
    list: ['待审核', '备货中', '配送中', '已收货', '已取消'],
    title: "全部订单",
    columns: '',
    columnId: '',
    select_zid: '',
    show: false,
    map: false,
    isPopup: false,
    default: false,
    user_name: '当前账号',
    status: '全部',
    tabtxt: '',
    type: 1,
    page: 1,
    loadTxt: '加载中...',
    count:1,
  },
  // 全部状态遮罩
  showIsPopup() {
    this.setData({
      isPopup: true
    });
  },
  onIsClose() {
    this.setData({
      isPopup: false
    });
  },
  toRouter(e) {
    console.log(e.currentTarget.id)
    var type = e.currentTarget.id;
    this.setData({
      type: type,
      status: '全部',
      page: 1
    });
    if (type == 1) {
      this.setData({
        title: "全部订单"
      });
    } else if (type == 2) {
      this.setData({
        title: "未支付"
      });
    }
    this.orderLista()
    this.onIsClose()
  },

  // 子账号遮罩
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onConfirm(event) {
    var that = this;
    const {
      picker,
      value,
      index
    } = event.detail;
    var idList = that.data.columnId
    that.setData({
      show: false,
      user_name: value,
      select_zid: idList[index],
      page: 1
    });
    that.orderLista()
  },
  onCancel() {
    this.setData({
      show: false
    });
  },


  // 选择状态
  tabs(event) {
    var that = this;
    that.setData({
      status: event.target.dataset.index,
      tabtxt: event.target.dataset.item,
      page: 1
    });
    // console.log(that.data.status)
    that.orderLista()
  },
  // //回到顶部
  goTop() { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 跳转到订单详情
  goodsitem(e) {
    var orderId = e.currentTarget.id
    wx.navigateTo({
      url: '../orderdetail/orderdetail?orderId=' + orderId,
    })
  },
  orderLista() {
    var that = this;

    that.setData({
      orderList: [],
      default: false,
    })
    var select_zid = that.data.select_zid;
    if (that.data.status != "全部") {
      var status = that.data.status + 1;
    } else {
      var status = '';
    }
    var appid = app.globalData.appid;
    var page = 1;
    var type = that.data.type;
    var num = 10
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = {
      appid: appid,
      page: page,
      timeStamp: timeStamp,
      type: type
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = {
      appid: appid,
      page: page,
      timeStamp: timeStamp,
      num: num,
      sign: sign,
      type: type,
      select_zid: select_zid,
      status: status,
    }
    rs.getRequest("orderList", data, (res) => {
      if (res.data.code == 200) {

        if (res.data.data.list.length > 0) {
          if (res.data.data.list.length <= 9) {
            that.setData({
              loadTxt: '到底了'
            })
          } else {
            that.setData({
              loadTxt: '加载中...'
            })
          }
          that.setData({
            is_look: res.data.data.is_look,
            orderInfo: res.data.data,
            orderList: res.data.data.list,
          })
          // console.log(that.data.orderInfo)
        } else {
          that.setData({
            default: true,
            loadTxt: ''
          })
        }
      }
    })
  },
  /**
   * 获取子账号信息
   */
  childInfo() {
    var that = this;
    var appid = app.globalData.appid;
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
    }
    rs.getRequests("childInfo", data, (res) => {
      if (res.data.code == 200) {
        var childInfo = res.data.data;
        var arr = ["当前账号"];
        var num = [""];
        for (var i = 0; i < childInfo.length; i++) {
          arr.push(childInfo[i].nickname)
          num.push(childInfo[i].zid)
        }
        var columnss = that.data.columns;
        var columnsId = that.data.columnId;
        // if (childInfo != '') {
          that.setData({
            columns: arr,
            columnId: num,
          })
        // }
      }
    })
  },
  //初始订单请求
  orderList() {
    var that = this;
    that.setData({
      default: false,
    })
    var appid = app.globalData.appid;
    var page = 1;
    var type = that.data.type;
    if (that.data.status != "全部") {
      var status = that.data.status + 1;
    } else {
      var status = '';
    }
    var num = 10;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = {
      appid: appid,
      page: page,
      timeStamp: timeStamp,
      type: type
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = {
      appid: appid,
      page: page,
      timeStamp: timeStamp,
      num: num,
      sign: sign,
      type: type,
      status: status,
    }
    rs.getRequest("orderList", data, (res) => {
      if (res.data.code == 200) {
        if (res.data.data.list.length > 0) {
          if (res.data.data.list.length <= 9) {
            that.setData({
              loadTxt: '到底了'
            })
          } else {
            that.setData({
              loadTxt: '加载中...'
            })
          }
          that.setData({
            is_look: res.data.data.is_look,
            orderInfo: res.data.data,
            orderList: res.data.data.list,
          })
          // console.log(that.data.orderInfo)
        } else {
          that.setData({
            default: true,
            loadTxt: ''
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.aData.show = false;
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
    var that = this;

    if(!wx.getStorageSync("token")){
      rs.showLogin();
    }else{
      that.setData({
        is_child: wx.getStorageSync("is_child"),
        is_miniBind: wx.getStorageSync("is_miniBind"),
      })
      console.log(app.globalData.aData.show)
      let aShow = app.globalData.aData.show;
      if (aShow == false) {
        that.orderList() //订单列表
        that.goTop()
        that.setData({
          user_name: '当前账号',
          select_zid:'',
          type: 1,
          status: '全部',
        })
      }
      if (wx.getStorageSync("is_child") == 0) {
          that.childInfo();
         //用户信息
      }
    }


    
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log(this.data.map)
    if (this.data.map == true) {
      app.globalData.aData.show = true;
     
    } else {
      app.globalData.aData.show = false;
      this.setData({
        // user_name: '当前账号',
        select_zid: '',
        type: 1,
        status: '全部',
      })
    }
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
    //订单列表流加载
    var that = this;

    if (that.data.status != "全部") {
      var status = that.data.status + 1;
    } else {
      var status = '';
    }
    var appid = app.globalData.appid;
    var page = that.data.page;
    var type = that.data.type;
    var num = 10
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = {
      appid: appid,
      page: page + 1,
      timeStamp: timeStamp,
      type: type
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = {
      appid: appid,
      page: page + 1,
      timeStamp: timeStamp,
      num: num,
      sign: sign,
      type: type,
      status: status
    }
    if (wx.getStorageSync("is_child") == 0) {
      data.select_zid = that.data.select_zid;
    }
    rs.getRequest("orderList", data, (res) => {
      if (res.data.code == 200) {
        if (res.data.data.list != '') {
          var orderList = that.data.orderList;
          that.setData({
            is_look: res.data.data.is_look,
            orderList: orderList.concat(res.data.data.list),
            page: page + 1,
            loadTxt: '加载中...'
          })
        } else {
          that.setData({
            loadTxt: '到底了'
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
  /**
   * 页面跳转
   */
  //支付
  play(e) {
    var oid = e.currentTarget.id
    wx.navigateTo({
      url: '../play/play?oid=' + oid,
    })
  },
  /**
   *绑定微信
   */
  bindWeChat(e) {
    var that = this
    if (e.detail.userInfo) {
      console.log('shouquan')
      wx.login({
        success: function(res) {
          console.log(res.code)
          that.setData({
            code: res.code
          })
          that.bindWeChata()
        },
      })
    } else {
      console.log('没有授权')
    }
  },
  bindWeChata() {
    var that = this
    var appid = app.globalData.appid;
    var code = that.data.code;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = {
      appid: appid,
      code: code,
      timeStamp: timeStamp,
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = {
      appid: appid,
      code: code,
      type: "mini",
      timeStamp: timeStamp,
      sign: sign,
    }
    rs.postRequests("bindWeChat", data, (res) => {
      if (res.data.code == 200) {
        rs.showToast('绑定微信成功', "success", (res) => {})
        wx.setStorageSync('is_miniBind', 1)
        that.setData({
          is_miniBind: wx.getStorageSync("is_miniBind"),
        })
      }else{
        rs.showToast(res.data.msg, "none", (res) => { })
      }
    })
  },
  /**
   * 取消订单
   */
  cancelOrder(e) {
    Dialog.confirm({
      title: '提示',
      message: '是否取消订单'
    }).then(() => {
      var that = this
      var id = e.currentTarget.id;
      var appid = app.globalData.appid;
      var orderindex = e.currentTarget.dataset.orderindex;
      var timeStamp = Math.round(new Date().getTime() / 1000);
      var obj = {
        appid: appid,
        id: id,
        timeStamp: timeStamp,
      }
      var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
      var data = {
        appid: appid,
        timeStamp: timeStamp,
        id: id,
        sign: sign,
      }
      rs.getRequests("cancelOrder", data, (res) => {
        if (res.data.code == 200) {
          rs.showToast('取消订单成功', "success", (reg) => {
            var orderList = this.data.orderList;
            orderList.splice(orderindex, 1)
            that.setData({
              orderList: orderList
            })
            if (orderList.length <= 0) {
              that.orderLista()
            }
          })
        }else {
          rs.showToast(res.data.msg, "none", (reg) => {})
        }
      })
    }).catch(() => {
      // on cancel
    });
  },
  /**
   * 再来一单
   */
  oneMoreTime(e) {
    Dialog.confirm({
      title: '提示',
      message: '是否再来一单'
    }).then(() => {
      var that = this
      var id = e.currentTarget.id;
      var appid = app.globalData.appid;
      var timeStamp = Math.round(new Date().getTime() / 1000);
      var obj = {
        appid: appid,
        id: id,
        timeStamp: timeStamp,
      }
      var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
      var data = {
        appid: appid,
        timeStamp: timeStamp,
        id: id,
        sign: sign,
      }
      rs.getRequests("oneMoreTime", data, (res) => {
        if (res.data.code == 200) {
          rs.showToast('再来一单成功', "success", (reg) => {
            wx.switchTab({
              url: '../../shopcart/index/index'
            })
          })
        } else {
          rs.showToast(res.data.msg, "none", (reg) => { })
        }
        // if (res.data.code == 102) {
        //   rs.showToast('有下架商品', "success", (reg) => {
        //     wx.switchTab({
        //       url: '../../shopcart/index/index'
        //     })
        //   })
        // }
      })
    }).catch(() => {
      // on cancel
    });
  },

  /**
   * 确认收货
   */
  receiveOrder(e) {
    Dialog.confirm({
      title: '提示',
      message: '是否确认收货'
    }).then(() => {
      var that = this
      var id = e.currentTarget.id;
      var orderindex = e.currentTarget.dataset.orderindex;
      var appid = app.globalData.appid;
      var timeStamp = Math.round(new Date().getTime() / 1000);
      var obj = {
        appid: appid,
        id: id,
        timeStamp: timeStamp,
      }
      var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
      var data = {
        appid: appid,
        timeStamp: timeStamp,
        id: id,
        sign: sign,
      }
      rs.getRequests("receiveOrder", data, (res) => {
        if (res.data.code == 200) {

          rs.showToast('确认收货成功', "success", (reg) => {
            var orderList = this.data.orderList;
            orderList.splice(orderindex, 1)
            that.setData({
              orderList: orderList
            })
            if (orderList.length <= 0) {
              that.orderLista()
            }

          })
        } else {
          rs.showToast(res.data.msg, "none", (reg) => { })
        }
      })
    }).catch(() => {
      // on cancel
    });
  },
  /**
   * 查看物流
   */
  ckwl(e) {
    var that = this;

    var id = e.currentTarget.id;
    let {count}=that.data;
    that.setData({
      count:count+1
    });
  console.log(count)
    if (id <= 0) {
      rs.showToast('无物流信息', "none", (reg) => {})
      return;
    }
    if(count!=1){return}
    var orderindex = e.currentTarget.dataset.orderindex;
    var appid = app.globalData.appid;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    var obj = {
      appid: appid,
      id: id,
      timeStamp: timeStamp,
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = {
      appid: appid,
      timeStamp: timeStamp,
      id: id,
      sign: sign,
    }
    rs.postRequests("carPosition", data, (res) => {
     
      if (res.data.code == 200) {
        // app.globalData.aData.show = true;
        setTimeout(()=>{  that.setData({
          count:1
        })},1000)
      
        if (res.data.data != '') {
          var latitude = res.data.data.latitude
          var longitude = res.data.data.longitude
          if (res.data.data.latitude == '' || res.data.data.longitude == '') {
            rs.showToast('无物流信息', "none", (reg) => {})
          } else {
            wx.getLocation({
              type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
              success: function(res) {
                that.setData({
                  map: true
                })
                // success
                wx.openLocation({
                  latitude: latitude, // 纬度，范围为-90~90，负数表示南纬
                  longitude: longitude, // 经度，范围为-180~180，负数表示西经
                  scale: 18, // 缩放比例
                })
              }
            })
          }
        } else {
          rs.showToast('无物流信息', "none", (reg) => {})
        }
      }
    })
  }

})