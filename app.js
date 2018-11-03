//app.js
App({
  globalData: {
    ApiHost: 'http://10.133.151.208:8050',
    userInfo: null,
    useridentity: -1, //标识用户身份 0为车主 1为乘客
    usercertificated: false, //若用户为车主 则车主是否认证
    userdetailinfoexist: false, //用户基本信息是否存在  即姓名等信息
    userinfoexist: false, //用户信息是否存在 即openid
    userid: {}, //用id唯一标识用户方便数据库信息的读取
    Session: ''
  },

  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    /*  wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

      }
    })
*/
    var mylogin = {
      success: function(res) {
        jsoncode = res.code;
        //console.log("JSONCODE:" + jsoncode)
        wx.request({
          url: 'http://10.133.151.208:8050/User/login/?code=' + jsoncode,
          success: function(res) {
            var resData = res.data.replace(/'/g, '"');
            //console.log("res.data:" + resData);
            var resJson = JSON.parse(resData)
            //console.log("Session:" + resJson.data.session);
            //session写入本地缓存
            try {
              wx.setStorageSync("session", resJson.data.session)
            } catch (e) {
              console.log("setStorage session failed")
            }
          }
        })
      }
    }

    var jsoncode = '';
    var that = this;
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        console.log("checkSession success");
        try {
          var value = wx.getStorageSync('session')
          //console.log(value);
          if (value) {
            that.globalData.Session = value;
            console.log("write app session success")
          } else {
            //本地缓存无session
            console.log("getStorage session failed")
            wx.login(mylogin);
          }
        } catch (e) {
          console.log("write app session failed")
          //console.log(e)
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        console.log("checkSession failed");
        //wx.login() //重新登录
        wx.login(mylogin);

      }
    })






    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.userinfoexist = true
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: res => {
              this.globalData.userinfoexist = false
            }
          })
        }
      }
    })
  }

})