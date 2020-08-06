// pages/index/index/index.js
const md5 = require('../../../utils/md5.js');
const rs = require('../../../utils/request.js');
import Toast from '@vant/weapp/toast/toast';
let app = getApp();
let {
  appid,
  appsecret,
  prefix,
  imgRemote,classId
} = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartInfo: [],
    showInfo: [],
    token: wx.getStorageSync("token"),
    activeIndex: 0,
    page: 1,
    num: 10,
    show: false,
    time: '',
    timeData: {},
    prefix: prefix,
    imgRemote:imgRemote,
    indexAd: {},
    navone: [],
    navtwo: [],
    phone: '',
    itemList: [],
    shuiyin: '',
    is_look: '',
    item_default: '',
    list: '',
    logo: '',
    is_detail:'',
    loading: true,
    showTop: true
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
    this.indexAd();
    this.limitList();
    if(getApp().globalData.isFresh){ 
      this.setData({
        page:1
      })
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      }
      this.indexItem();}
   
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
  onChange(e) {
    this.setData({
      timeData: e.detail
    });
  },
  //首页轮播图
  indexAd() {
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let obj = {
      appid: appid,
      timeStamp: timeStamp
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign
    }, obj)
    rs.getRequests("indexAd", params, (res) => {
      let data = res.data;
      if (data.code == 200) {
        let nav = data.data.nav;
        this.setData({
          indexAd: data.data,
          nav:nav,
          phone: data.data.phone

        })
      }
    })
  },
  // 为你推荐
  indexItem() {
	  this.setData({
		  token:wx.getStorageSync("token")
	  })
 
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let obj = {
      appid: appid,
      timeStamp: timeStamp
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      page: 1,
      sign: sign,
      num: this.data.num
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
        this.setData({
          shuiyin: shuiyin,
          is_look: is_look,
          item_default: item_default,
          list: list,
          logo: logo,
          is_detail:is_detail
        })
        if(data.total<=10){
          this.setData({
            loading:false
          })
        }else{
          this.setData({
            loading:true
          })
        }
      }

    })
  },
  //限时抢购
  limitList() {
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let obj = {
      appid: appid,
      timeStamp: timeStamp
    };
    let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
    let params = Object.assign({
      sign: sign
    }, obj)
    rs.getRequests("panicBuyIndex", params, (res) => {
      let data = res.data;
      if (data.code == 200) {
        let {
          itemList
        } = data.data;
        this.setData({
          itemList: data.data,
          time: Math.abs(data.data.timeRemain * 1000)
        })
      }

    })
  },
  bannerUrl(e) {
    let {
      herf
    } = e.currentTarget.dataset;
  },
  showCart(e) {
    let {
      item,
      showinfo
    } = e.currentTarget.dataset;
    this.setData({
      show: true,
      cartInfos: item
    })
  },
  navUrl(e) {
    let {
      id,
      cate_id,
      status
    } = e.currentTarget.dataset.item;
    if (status == 0) {
      Toast('该栏目已下架');
      return;
    }
    switch (id) {
      case 1:
        wx.navigateTo({
          url: '/pages/index/collect/index',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/index/newback/index',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/index/recommed/index',
        })
        break;
      case 4:
        wx.makePhoneCall({
          phoneNumber: this.data.phone,
        })
        break;
      case 5:
        wx.switchTab({
          url: '/pages/classify/index/index',
        })
        break;
      case 6:
        wx.switchTab({
          url: '/pages/shopcart/index/index',
        })
        break;
      case 7:
        wx.switchTab({
          url: '/pages/order/index/index',
        })
        break;
      case 8:
        wx.switchTab({
          url: '/pages/user/index/index',
        })
        break;
      default:
      app.globalData.classId=cate_id;
    
        wx.switchTab({
          url: "/pages/classify/index/index",
        });
      
        break;
    }

  },
  limitListUrl() {
    wx.navigateTo({
      url: `/pages/index/limitactive/index`,
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
  pageUrl(e) {
   let {url}=e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/index/enterprise/index?url=${url}`,
    })
  }
})