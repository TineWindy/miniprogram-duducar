// pages/select/select.js
//获取应用实例
var app = getApp();
Page({
  data: {
    animationData: {},
    cardInfoList: [{
      cardUrl: 'http://wx4.sinaimg.cn/large/997cfcd5gy1fwfwwfzlq7j20yi1pct98.jpg',
      cardInfo: {
        cardTitle: '订单1',
        cardS: ['JOJO1'],
        to:['to'],
        cardD: ['JOJO2'],
        text: ["预定时间："],
        time:['1:30'],
        text2: ['预估价格:'],
        price:['99']
      }
    }, {
        cardUrl: 'http://wx4.sinaimg.cn/large/997cfcd5gy1fwfwwfzlq7j20yi1pct98.jpg',
      cardInfo: {
        cardTitle: '订单2',
        cardS: ['JOJO2'],
        to: ['to'],
        cardD:['JOJO3'],
        text: ["预定时间："],
        time: ['9:30'],
        text2: ['预估价格:'],
        price: ['99']
      }
    }, {
        cardUrl: 'http://wx4.sinaimg.cn/large/997cfcd5gy1fwfwwfzlq7j20yi1pct98.jpg',
      cardInfo: {
        cardTitle: '订单3',
        cardS: ['JOJO3'],
        to: ['to'],
        cardD: ['JOJO4'],
        text:["预定时间："],
        time: ['11:30'],
        text2:['预估价格:'],
        price: ['99']
      }
    }]
  },
  //事件处理函数
  slidethis: function (e) {
    console.log(e);
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'cubic-bezier(.8,.2,.1,0.8)',
    });
    var self = this;
    this.animation = animation;
    this.animation.translateY(-420).rotate(-5).translateX(0).step();
    this.animation.translateY(62).translateX(25).rotate(0).step();
    this.setData({
      animationData: this.animation.export()
    });
    setTimeout(function () {
      var cardInfoList = self.data.cardInfoList;
      var slidethis = self.data.cardInfoList.shift();
      self.data.cardInfoList.push(slidethis);
      self.setData({
        cardInfoList: self.data.cardInfoList,
        animationData: {}
      });
    }, 350);
  },
  buythis: function (e) {
    console.log(e);
    app.buyDetail = this.data.cardInfoList[e.target.id];
    wx.navigateTo({
      url: '../detailinfo/detailinfo'
    });
  },
  onLoad: function () {
    console.log('onLoad');
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    });
  }
})
