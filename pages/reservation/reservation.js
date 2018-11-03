// pages/reservation/reservation.js
var util = require('../../utils/util.js');
var timejs = require('../../utils/time.js');
var address = require('../../utils/district.js');
var animation;
const app = getApp();
const ApiHost = getApp().globalData.ApiHost;
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    caniuse: false,

    //顶端订单一二控制
    tabs: ["订单一", "订单二"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    //用户身份相关 0是车主 1是乘客
    driverOrPassenger: "身份选择",
    identity: 1,

    origin: "",
    originId: 0,
    destination: "",
    destinationId: 0,
    money: "",
    /* radioItems: [
         { name: '订单1', value: '0', checked: true},
         { name: '订单2', value: '1' }
     ],*/

    //备注相关
    // 最大字符数
    maxTextLen: 30,
    // 默认长度
    textLen: 0,
    //备注内容
    remarks: "",

    //发布行程控制相关
    opacity: 0.4,
    isAgree: false,
    isReleaseDisabled: true,

    //地址选择器相关
    isOrigin: true,
    addressMenuIsShow: false,
    value: [0, 0],
    districts: [],
    locations: [],
    district: '',
    location: '',

    origin1: "aa",
    destination1: "bb",
    time1: "hh:mm",
    money1: "￥10.00",

    //时间选择器相关
    appointment: "今天 15:00",
    timevalue: [0, 0, 0],
    days: ["今天", "明天", "后天"],
    hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
    minutes: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
    timeSelRange: [],

    currentdate: {},
    currenttime: {},
/*    immediately: true,
    chooseweek: ['本周', '下周'],
    weekindex: 0,
    chooseday: [],
    dayindex: 0,
    thisweek: [],
    nextweek: [],
    starttime: {},*/

    
  },

  //设置心理价位
  setMoney: function(e) {
    this.setData({
      money: e.detail.value
    })
  },

  //订单一和订单二切换控制
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  //用户身份选择
  setDriverOrPassenger: function(e) {
    if (e.detail.value) {
      this.setData({
        driverOrPassenger: "我是车主",
        identity: 0
      })
    } else
      this.setData({
        driverOrPassenger: "我是乘客",
        identity: 1
      })
  },

  //相关条款同意，允许发布行程
  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    })
    if (this.data.isAgree) {
      this.setData({
        isReleaseDisabled: false,
        opacity: 1
      })
    } else {
      this.setData({
        isReleaseDisabled: true,
        opacity: 0.4
      })
    }
  },

//-----------------时间选择器------------------------------------------
  //时间选择器联动
  bindTimeColumnChange: function(e) {
    var hourRange = [];
    var minRange = [];
    var timeRange = [];
    var curTime = this.data.currenttime;
    var curHours = parseInt(curTime.slice(0, 2));
    var curMinutes = parseInt(curTime.slice(3, 5));
    console.log(e.detail);
    timeRange.push(this.data.days);
    //日期选择今天，重设小时和分钟
    if (e.detail.column == 0 && e.detail.value == 0) {
      for (var i = 0; i < this.data.hours.length; i++)
        if (parseInt(this.data.hours[i]) >= curHours)
          hourRange.push(this.data.hours[i]);
      for (var i = 0; i < this.data.minutes.length; i++)
        if (parseInt(this.data.minutes[i]) > curMinutes)
          minRange.push(this.data.minutes[i]);

      if (minRange.length == 0) {
        hourRange = hourRange.slice(1, hourRange.length);
        if (hourRange.length == 0) {
          //23:55-23:59时将第二天当作今天处理
          hourRange = this.data.hours;
        }
        minRange = this.data.minutes;
      }
      timeRange.push(hourRange);
      timeRange.push(minRange);

      this.setData({
        timeSelRange: timeRange,
        timevalue: [0, 0, 0]
      });
    } else if (e.detail.column == 1 && e.detail.value == 0 && this.data.timevalue[0] == 0) {
      //小时选择最小小时，日期为今天时，重设分钟
      for (var i = 0; i < this.data.minutes.length; i++)
        if (parseInt(this.data.minutes[i]) > curMinutes)
          minRange.push(this.data.minutes[i]);
      if (minRange.length == 0) {
        minRange = this.data.minutes;
      }
      timeRange.push(this.data.timeSelRange[1]);
      timeRange.push(minRange);
      this.setData({
        timeSelRange: timeRange,
        timevalue: [this.data.timevalue[0], 0, 0]
      })
    } else if (e.detail.column == 0) {
      //日期选择明天或后天
      timeRange.push(this.data.hours);
      timeRange.push(this.data.minutes);
      this.setData({
        timeSelRange: timeRange,
        timevalue: [e.detail.value, 0, 0]
      })
    } else if (e.detail.column == 1) {
      //小时选择其他小时
      timeRange.push(this.data.timeSelRange[1]);
      timeRange.push(this.data.minutes);
      this.setData({
        timeSelRange: timeRange,
        timevalue: [this.data.timevalue[0], e.detail.value, 0]
      })
    }
  },

  //时间选择器时间确定，更新至显示
  bindTimeChange: function(e) {
    console.log(e.detail);
    var appointment;
    appointment = this.data.timeSelRange[0][e.detail.value[0]] + " " + this.data.timeSelRange[1][e.detail.value[1]] + ":" + this.data.timeSelRange[2][e.detail.value[2]];
    this.setData({
      appointment: appointment
    })
  },

  bindTimeCancel: function(e) {
    this.setData({
      timevalue: [0, 0, 0]
    })
  },

//-----------------备注字数限制------------------------------------------
  getWords(e) {
    let page = this;
    // 设置最大字符串长度(为-1时,则不限制)
    let maxTextLen = page.data.maxTextLen;
    // 文本长度
    let textLen = e.detail.value.length;

    page.setData({
      maxTextLen: maxTextLen,
      textLen: textLen,
      remarks: e.detail.value
    });
  },

//-----------------地址选择器------------------------------------------
  // 点击所在地区弹出选择框
  selectDistrict: function(e) {
    var that = this
    console.log(e)
    if (e.currentTarget.id == "ORIGIN") {
      that.setData({
        isOrigin: true
      })
    } else {
      that.setData({
        isOrigin: false
      })
    }
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function(isShow) {
    console.log(isShow)
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  locCancel: function(e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  locSure: function(e) {
    var that = this
    var location = that.data.location
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的地址信息显示到输入框
    var areaInfo = that.data.districts[value[0]].name + ',' + that.data.locations[value[1]].name
    if (that.data.isOrigin == true)
      that.setData({
        origin: areaInfo,
        originId: that.data.locations[value[1]].id
      })
    else
      that.setData({
        destination: areaInfo,
        destinationId: that.data.locations[value[1]].id
      })
  },
  hideAddrSelected: function(e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理学部-区域联动逻辑
  locChange: function(e) {
    console.log(e)
    var value = e.detail.value
    var districts = this.data.districts
    var locations = this.data.locations
    var districtNum = value[0]
    var locationNum = value[1]
    if (this.data.value[0] != districtNum) {
      var id = districts[districtNum].id
      this.setData({
        value: [districtNum, 0],
        locations: address.locations[id]
      })
    } else {
      this.setData({
        value: [districtNum, locationNum]
      })
    }
    console.log(this.data)
  },
//--------------------------------------------------------------------------

  //更新当前时间
  updatecurrenttime() {
    var currentT = util.formatTime(new Date())
    this.setData({
      currentdate: currentT.slice(0, 10),
      date: currentT.slice(0, 10),
      currenttime: currentT.slice(11, 16),
      time: currentT.slice(11, 16),
      starttime: currentT.slice(11, 16)
    })
  },

//-----------------发布行程------------------------------------------
  //发布行程确认，弹出模态框
  releaseScheduleConfirm: function(ele) {
    var that = this;
    //向后台请求，检查用户信息是否完整
    wx.request({
      url: ApiHost + '/User/info/',
      method: 'GET',
      data: {},
      dataType: JSON,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // 对数据进行 JSON 序列化
        'Session': app.globalData.Session
      },
      success: (res) => {
        var resData = res.data.replace(/'/g, '"');
        console.log("res.data:" + resData);
        var resJson = JSON.parse(resData);

        if(!resJson.error_code){
          //用户信息已完善，弹出确认框
          if (!resJson.data.infocompleted){
            wx.showModal({
              title: '确认行程',
              //content: '路线：从' + this.data.origin + '去' + this.data.destination + '\r\n日期：' + this.data.date + '\r\n时间：' + this.data.time + '\r\n预估金额：' + this.data.money,
              content: '路线：从' + this.data.origin + '去' + this.data.destination + '\r\n时间：' + this.data.appointment + '\r\n预估金额：' + this.data.money,
              confirmText: "确认",
              cancelText: "取消",
              success: function (res) {
                if (res.confirm) {
                  //发布行程，上传后台
                  that.releaseSchedule(ele);
                } else {
                  //console.log('发布行程：用户点击辅助操作')
                }
              }
            });
          }else{
          //用户信息未完善，跳转个人信息页面
            wx.showModal({
              title: "请先完善个人信息",
              content: "",
              confirmText: "同意",
              cancelText: "拒绝",
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../personalinfo/personalinfo',
                  })          
                } else {
                }
              }
            });
          }
        }else{
          wx.showToast({
            title: resJson.info,
            icon: 'none',
            duration: 2000
          });
        }
      },
    })

    
  },

  reservationSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    console.log("formId:" + e.detail.formId);
    var that = this;
    that.releaseScheduleConfirm(e);
  },

  //发布行程，将订单数据上传至后台
  releaseSchedule: function(e) {
    var that = this;
    //数据预处理
    let curDate = that.data.currentdate.replace(/\//g, '-');
    let appointtime = that.data.appointment.slice(3, 8);
    let dateObj = {}, starttime = "";
    
    //设置日期
    if(that.data.timevalue[0] == 0){
      //时间选择今天
      starttime = curDate + "_" + appointtime;
    } else if (that.data.timevalue[0] == 1){
      //时间选择明天
      dateObj = timejs.dateLater(curDate, 1);
      starttime = dateObj.year + "-" + dateObj.month + "-" + dateObj.day + "_" + appointtime;
    } else if (that.data.timevalue[0] == 2){
      //时间选择后天
      dateObj = timejs.dateLater(curDate, 2);
      starttime = dateObj.year + "-" + dateObj.month + "-" + dateObj.day + "_" + appointtime;
    }
    
    console.log({
      startplace: parseInt(that.data.originId),
      endplace: parseInt(that.data.destinationId),
      starttime: starttime,
      fare: parseFloat(that.data.money),
      identity: that.data.identity,
    });
    if (that.data.caniuse) {
      wx.request({
        url: ApiHost + '/Order/create/',
        method: 'POST',
        data: {
          startplace: that.data.origin,
          endplace: that.data.destination,
          starttime: that.data.appointment,
          fare: that.data.money,
          identity: that.data.identity,
        },
        dataType: JSON,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded', // 对数据进行 JSON 序列化
          'Session': app.globalData.Session
        },
        success: (res) =>{
          var resData = res.data.replace(/'/g, '"');
          //console.log("res.data:" + resData);
          var resJson = JSON.parse(resData);
          if(!resJson.error){
            var orderId = parseInt(resJson.data.orderid);
          }
        }
      });
    } else {
      wx.showModal({
        title: '您当前未登陆或认证',
        content: '该功能仅登陆且认证后可使用！',
        showCancel: false,
        confirmColor: '#007aff',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //初始化选择日期
    var date = util.formatTime(new Date()).slice(0, 10).split("/");;
    var toweek = new Date(date[0], date[1] - 1, date[2]).getDay(); //今天周几
    var show_day = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    var thisweek = [];
    thisweek.push('今天')
    for (var i = toweek; i < show_day.length; i++) {
      thisweek.push(show_day[i])
    }
    this.setData({
      thisweek: thisweek,
      nextweek: show_day,
      chooseday: thisweek
    })

    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });



    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示文理学部
    var id = address.districts[0].id
    this.setData({
      districts: address.districts,
      locations: address.locations[id]
    })
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
    this.setData({
      // caniuse: app.globalData.userinfoexist && app.globalData.userdetailinfoexist && (app.globalData.useridentity == 1 || (app.globalData.useridentity == 0 && app.globalData.userusercertificated)),
      caniuse: true
    })
    this.updatecurrenttime();

    //更新时间选择器范围
    var hourRange = [];
    var minRange = [];
    var timeRange = [];
    var curTime = this.data.currenttime;
    var curHours = parseInt(curTime.slice(0, 2));
    var curMinutes = parseInt(curTime.slice(3, 5));
    timeRange.push(this.data.days);
    //日期选择今天，重设小时和分钟
    for (var i = 0; i < this.data.hours.length; i++)
      if (parseInt(this.data.hours[i]) >= curHours)
        hourRange.push(this.data.hours[i]);
    for (var i = 0; i < this.data.minutes.length; i++)
      if (parseInt(this.data.minutes[i]) > curMinutes)
        minRange.push(this.data.minutes[i]);

    if (minRange.length == 0) {
      hourRange = hourRange.slice(1, hourRange.length);
      if (hourRange.length == 0) {
        //23:55-23:59时将第二天当作今天处理
        hourRange = this.data.hours;
      }
      minRange = this.data.minutes;
    }
    timeRange.push(hourRange);
    timeRange.push(minRange);

    this.setData({
      timeSelRange: timeRange
    });

    var appointment;
    appointment = this.data.timeSelRange[0][0] + " " + this.data.timeSelRange[1][0] + ":" + this.data.timeSelRange[2][0];
    this.setData({
      appointment: appointment
    })
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

  }
})