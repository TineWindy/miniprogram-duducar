// pages/personalinfo/personalinfo.js
const app = getApp()
const ApiHost = getApp().globalData.ApiHost
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    list: [],
    genderValue: 0,
    //性别单选
    array: [{
      index: 0,
      title: '男'
    },
    {
      index: 1,
      title: '女'
    }
    ]
  },

  //性别选择
  bindArrayChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      genderValue: e.detail.value
    })
  },

  //信息上传
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.request({
      url: ApiHost + "/User/infosubmit/",
      method: 'POST',
      data: e.detail.value,
      dataType: JSON,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // 对数据进行 JSON 序列化
        'Session': app.globalData.Session
      },
      success: (res) => {
        var resData = res.data.replace(/'/g, '"');
        //console.log("res.data:" + resData);
        var resJson = JSON.parse(resData)
        if (resJson.error) {
          wx.showToast({
            title: resJson.info,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(
            function(){
              var currentPages = getCurrentPages();
              if (currentPages[currentPages.length - 2].route == "pages/reservation/reservation") {
                wx.navigateBack({ delta: 1 });
              }
            },
            2500
          )
          //添加成功，若从reservation页面跳转过来，则自动跳转回去
          
        }
      },
      fail: (res) => {
        //提醒用户提交失败
      }
    })
  },

  bindGetUserInfo: function (event) {
    console.log(event.detail.userInfo)
    //使用
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: function (res) {
              var code = res.code; //登录凭证
              if (code) {
                //2、调用获取用户信息接口
                wx.getUserInfo({

                })
              } else {
                console.log('获取用户登录态失败！' + r.errMsg)
              }
            },
            fail: function () {
              console.log('登陆失败')
            }
          })
        } else {
          console.log('获取用户信息失败')
        }
      }
    })
  },

  onLoad: function (res) {
    // 查看是否授权    
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称       
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  //-----------------------请求用户信息------------------------
    var that = this;
    //检查是否已完善信息
    wx.request({
      url: ApiHost + "/User/info/",
      method: 'GET',
      data: '',
      dataType: JSON,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // 对数据进行 JSON 序列化
        'Session': app.globalData.Session
      },
      success: (res) => {
        var resData = res.data.replace(/'/g, '"');
        //console.log("res.data:" + resData);
        var resJson = JSON.parse(resData)
        if (!resJson.error) {
          that.setData({
            name: resJson.data.name,
            schoolid: resJson.data.schoolid,
            genderValue: parseInt(resJson.data.gender),
            telephone: resJson.data.telephone,
            dorm: resJson.data.dorm
          })
        }
      },
      fail: (res) => {
      }
    })
  },

})