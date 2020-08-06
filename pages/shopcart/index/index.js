// pages/shopcart/index/index.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
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
    hiddenText: true,
    is_child: '',
    on_delivery: '',
    activity_type: '',
    countNum: '',
    discount: '',
    juaninfo: '不使用',
    juan: false,
    juanPrice: 0,
    juans: ['不使用'],
    couponsList: [{
      id: ''
    }],
    coupId: '',
    token: wx.getStorageSync("token"),
    loading: true,
    prefix: prefix,
    imgRemote: imgRemote,
    activeIndex: 2,
    countPrice: '',
    totalPrice: '',
    activePrice: '',
    strInfo: '',
    cartInfos: '',
    showCart: false,
    address: '',
    contact: '',
    phone: '',
    fare: '',
    logo: '',
    shuiyin: '',
    is_look: '',
    is_juans:false,
    item_default: '',
    is_detail:'',
    list: '',
    page: 1,
    num: 10,
    addInfos: '',
    childCount: '当前账号',
    select_zid: '',
    remark: '',
    user: [],
    columns: ['当前账号'],
    showCount: false,
    date: '',
    timearea: '不限',
    timeId: '',
    timeQuan: ['不限'],
    timeQuantum: false,
    delivery_time_list: [],
    currentDate: new Date().getTime() + 24 * 3600 * 1000,
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return `${value}日`;
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
    if (!wx.getStorageSync('token')) {
      rs.showLogin()
    } else {
      if (wx.getStorageSync("is_child") != 1) {
        this.childInfo();
      }
      this.addInfo();
    }
    let time = this.data.currentDate;
    var date = new Date();
    date.setTime(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    this.setData({
      date: `${year}-${month}-${day}`
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      childCount:'当前账号',
        columns: ['当前账号'],
        timearea:'不限',
        timeQuan: ['不限'],
        juaninfo: '不使用',
        juans: ['不使用'],
        remark:'',
        juanPrice:0,
        coupId: '',
      currentDate: new Date().getTime() + 24 * 3600 * 1000,
        couponsList: [{
          id: ''
        }],
      });
      wx.setStorageSync('cartList', this.data.list)
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
    var num = that.data.num
    var page = that.data.page;
    var obj = {
      appid: appid,
      timeStamp: timeStamp,
    }
    var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
    var data = {
      appid: appid,
      num: num,
      page: page + 1,
      timeStamp: timeStamp,
      sign: sign
    }
    rs.getRequests("indexItem", data, (res) => {
      if (res.data.code = 200) {
        var list = that.data.list
        if (res.data.data != '') {
          that.setData({
            list: list.concat(res.data.data.list),
            page: page + 1,
            loading: true
          })
        } else {
          that.setData({
            loading: false,
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
  freshen(){
    console.log(456)
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
  addressUrl() {
    wx.navigateTo({
      url: '/pages/user/address/address?select_zid=' + this.data.select_zid,
    })
  },
  showCount() {
    this.setData({
      showCount: true
    })
  },
  showTime() {
    this.setData({
      showTime: true
    })
  },
  selectTime(value) {
    let time = new Date();
    time.setTime(value.detail);
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day;
    }
    this.setData({
      date: `${year}-${month}-${day}`,
      showTime: false
    })
  },
  showCart(e) {
    let {
      item,
      showinfo
    } = e.currentTarget.dataset;
    this.setData({
      showCart: true,
      cartInfos: item
    })
  },
  shoplistUrl() {
    wx.navigateTo({
      url: '/pages/shopcart/shoplist/index'
    })
  },
  //获取备注
  getRemark(e) {
    this.setData({
      remark: e.detail.value,
    })
  },
  // 子账号
  childInfo() {
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let obj = {
      appid: appid,
      timeStamp: timeStamp
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign
    }, obj)
    rs.getRequests("childInfo", params, (res) => {
      let data = res.data;
      if (data.code == 200) {
        let arr = this.data.columns
        for (let i of data.data) {
          arr.push(i.nickname)
        }
        this.setData({
          user: data.data,
          columns: arr
        })
      }
    })
  },
  indexItem() {
    let {
      page,
      num
    } = this.data;
    if (page != 1) {
      this.setData({
        list: wx.getStorageSync('cartList'),
      })
      return;
    }
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let obj = {
      appid: appid,
      timeStamp: timeStamp
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      page: page,
      sign: sign,
      num: num
    }, obj)
    rs.getRequests("indexItem", params, (res) => {
      let data = res.data;
      if (data.code == 200) {
        
        let {
          shuiyin,
          is_look,
          item_default,
          list,
          logo,is_detail
        } = data.data;
        if(list.length<10){
          this.setData({
            loading:false
          })
        }else{
          this.setData({
            loading:true
          }) 
        }
        this.setData({
          shuiyin: shuiyin,
          is_look: is_look,
          item_default: item_default,
          list: list,
          logo: logo,
          is_detail:is_detail
        })
      }

    })
  },
  addInfo() {
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let obj = {
      appid: appid,
      timeStamp: timeStamp
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign
    }, obj)
    rs.getRequests("addInfo", params, (res) => {
      let {
        data
      } = res;
      if (data.code == 200) {
        let addInfos = data.data;
        if (addInfos.countNum == 0) {
          this.indexItem();
        }
        let {
          address,
          phone,
          contact
        } = addInfos.userInfo;
        let {
          countPrice,
          fare,
          countNum,
          discount,
          activity_type
        } = addInfos;
        let {
          timeQuan,
          delivery_time_list
        } = this.data;
        for (let i of data.data.delivery_time_list) {
          timeQuan.push(i.delivery_time_info);
        }

        let totalPrice = parseFloat(countPrice) + parseFloat(fare) - discount;
        let activePrice = parseFloat(countPrice) + parseFloat(fare);
        let rule = data.data.activity_rule;
        if (activity_type == 2 && countPrice > rule[0].price) {
          countNum = countNum + 1;
        }
        this.setData({
          totalPrice: totalPrice.toFixed(2),
          activePrice: activePrice.toFixed(2),
          countNum: countNum,
          discount: discount,
          activity_type: activity_type,
          addInfos: addInfos,
          fare: fare,
          timeQuan: timeQuan,
          delivery_time_list: data.data.delivery_time_list,
          address: address,
          phone: phone,
          contact: contact,
          countPrice: countPrice,
        })
        // 现金券
        if (data.data.couponsList.length != 0) {
          this.data.couponsList.push(...data.data.couponsList)
          let nrr = []
          for (let i of data.data.couponsList) {
            nrr.push(`${i.coupons_title}(余额${i.residue}元)`)
          }
          let juans = this.data.juans
          this.setData({
            juans: juans.concat(nrr),
            couponsList: this.data.couponsList
          })

        }
        //  满减
        let length = rule.length - 1;
        if (activity_type != 1) {
          return;
        }
        if (rule[length].price < countPrice) {
          let strInfo = `已享受满<span class='red-font'>${rule[length].price}</span>元减<span class='red-font'>${rule[length].reduce}</span>元`;
          this.setData({
            strInfo: strInfo
          })
        } else {
          for (let v of rule) {
            if (countPrice < v.price) {
              let strInfo = `再满<span class="red-font">${v.price - countPrice}</span>元减<span class='red-font'>${v.reduce}</span>元`;
              this.setData({
                strInfo: strInfo
              })
              return;
            }
          }
        }

      }
    })
  },
  classUrl() {
    wx.switchTab({
      url: '/pages/classify/index/index',
    })
  },
  showTimeQuan() {
    this.setData({
      timeQuantum: true
    })
  },
  onConfirm(val) {
    let {
      value
    } = val.detail;
    let {
      user
    } = this.data;
    this.setData({
      childCount: value,
      showCount: false
    })
    for (let i of user) {

      if (i.nickname == value) {
        this.setData({
          select_zid: i.zid,
          contact: i.contact,
          phone: i.mobile,
          address: i.address
        });
        return;
      } else {
        let {
          address,
          phone,
          contact
        } = this.data.addInfos.userInfo;
        this.setData({
          select_zid: '',
          address: address,
          phone: phone,
          contact: contact
        });
      }
    }
  },
  onCancel() {
    this.setData({
      showCount: false,
      showTime: false
    })
  },
  cancelQuan() {
    this.setData({
      timeQuantum: false
    })
  },
  confirmQuan(v) {
    let {
      value
    } = v.detail
    this.setData({
      timearea: value,
      timeQuantum: false
    })

    for (let i of this.data.delivery_time_list) {
      if (value == i.delivery_time_info) {
        this.setData({
          timeId: i.delivery_time_id,
        })
        return;
      } else {
        this.setData({
          timeId: '',
        })
      }
    }

  },
  //确认下单
  confirmOrder() {
    let {phone,contact,address}=this.data;
   if(!phone||!contact||!address){
     Toast('请先完善信息');
    wx.navigateTo({
      url: '/pages/user/address/address',
    })
    return
   }
    this.setData({
      hiddenText: false
    })
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let {
      date
    } = this.data;
    let obj = {
      appid: appid,
      timeStamp: timeStamp,
      send_time: date
    };

    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign,
    }, obj)
    rs.getRequests("testOrder", params, (res) => {
      let code = res.data.code;
      let data = res.data.data;
      if (data.on_delivery == 1) {
        switch (code) {
          case 101:
            Dialog.confirm({
              message: '直接下单？',
              title: '提示',

            }).then(action => {
              //确认的回调
              this.order();
            }).catch(() => {
              this.setData({
                hiddenText: true
              })
            });
            break;
          case 300:
            Dialog.confirm({
              message: '信用金即将用完，请及时结账（可以直接下单）？',
              title: '提示',
            }).then(action => {
              //确认的回调
              this.order();
            }).catch(() => {
              this.setData({
                hiddenText: true
              })
            })
            break;
          case 301:
            Dialog.confirm({
              message: '信用金即将用完，请及时结账（可以合并订单）？',
              title: '提示',
            }).then(action => {
              this.mergeOrder();
            }).catch(err => {
              //取消的回调
              Dialog.confirm({
                message: '直接下单？',
                title: '提示',
              }).then(action => {
                this.order();
              }).catch(() => {
                this.setData({
                  hiddenText: true
                })
              });
            });
            break;

          case 500:
            Toast({
              message: '信用金已用完，不能下单',
              duration: 1200
            });
            break;

          case 200:
            Dialog.confirm({
              message: '可以合并订单？',
              title: '提示',
            }).then(action => {
              //确认的回调
              this.mergeOrder();
            }).catch(err => {
              //取消的回调
              Dialog.confirm({
                message: '直接下单？',
                title: '提示',
              }).then(action => {
                //确认的回调
                this.order();
              }).catch(() => {
                this.setData({
                  hiddenText: true
                })
              });

            });
            break;
        }
      } else {
        Dialog.confirm({
          message: '确定下单？',
          title: '提示',
        }).then(action => {
          //确认的回调
          this.order();
        }).catch(() => {
          this.setData({
            hiddenText: true
          })
        });
      }
    })
  },
  // 合拼下单
  mergeOrder() {
    this.setData({
      hiddenText: true
    })
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let {
      date
    } = this.data;
    let obj = {
      appid: appid,
      timeStamp: timeStamp,
      send_time: date,
      way: 3
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign,
      coupons_member_id: this.data.addInfos.on_delivery == 0 ? this.data.coupId : 0,
    }, obj)
    re.postRequests('mergeOrder', params, (res) => {
      if (res.data.code != 200) {
        Toast({
          message: res.data.msg,
          duration: 1000
        })
      } else {
        Toast({
          message: '合拼订单成功',
          duration: 1000
        })
        wx.switchTab({
          url: '/pages/order/index/index',
        })
      }
    })
  },
  // 直接下单
  order() {
    this.setData({
      hiddenText: true
    })
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let {
      date,
      timearea,
      timeId,
      remark
    } = this.data;
    let obj = {
      appid: appid,
      timeStamp: timeStamp,
      send_time: date,
      way: 3
    };
    let timeInfo = '';
    if (timearea == "不限") {
     console.log(timearea)
      timeInfo = '';
       timeId=""
    } else {
      timeInfo = timearea;
    }
    let select_zid;
    if(this.data.childCount=='当前账号'){
      select_zid=''
    }else{
      select_zid=this.data.select_zid
    }
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      delivery_time_id: timeId,
      delivery_time_info: timeInfo,
      sign: sign,
      remark: remark,
      coupons_member_id: this.data.addInfos.on_delivery == 0 ? this.data.coupId : 0,
      select_zid: select_zid
    }, obj);

    rs.postRequests('addOrder', params, (res) => {
      let data = res.data;

      if (data.code == 104) {
        Toast({ 
          message: '超出下单时间，不能下单',
          duration: 1200
        });
        return false;
      } else if (data.code == 200) {
        if (data.data.on_delivery == 0) {
          let id = data.data.orderId;
          wx.navigateTo({
            url: `/pages/shopcart/preay/index?id=${id}`,
          })
          this.setData({
            juaninfo:'不使用',
            coupId: '',
            juanPrice: 0,
          })
          return;
        }
        Toast({
          message: '下单成功',
          duration: 1000
        })
        this.setData({
          remark:''
        })
        wx.switchTab({
          url: '/pages/order/index/index',
        })
      } else if (data.code == 500) {
        Toast({
          message: '服务器内部错误,请稍候再试',
          duration: 1000
        })
      } else {
        Toast({
          message: data.msg,
          duration: 1000
        })
      }
    })
  },
  cancelJuan() {
    this.setData({
      juan: false
    })
  },
  confirmJuan(e) {
    let {
      value,
      index
    } = e.detail;

    let {
      id
    } = this.data.couponsList[index];

    if (index == 0) {
      this.setData({
        juaninfo:'不使用',
        coupId: '',
        juanPrice: 0,
      })

    } else {
      this.setData({
        coupId: id,
        juanPrice: 0,
      })
      let timeStamp = Math.round(new Date().getTime() / 1000);
      let {
        date
      } = this.data;
      let obj = {
        appid: appid,
        timeStamp: timeStamp,
        id: this.data.coupId
      };

      let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
      let params = Object.assign({
        sign: sign,
      }, obj)
      rs.getRequests("useCouponsPrice", params, (res) => {
        if (res.data.code == 200) {
          this.setData({
            juaninfo: value,
            juanPrice: res.data.data.couponsPrice,
            is_juans:true
          })
        }else{
          Toast(res.data.msg)
        }
      })
    }
    this.setData({
      juan: false
    })
  },
  showJuan() {
    if(this.data.juans.length <= 1){
      Toast("暂时没有可用的优惠券")
    }else{
      this.setData({
        juan: true
      })
    }
   
  }

})