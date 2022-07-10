// app.js
let userConfig = require('./config/userConfig.js');
let configIndexConfig = require('./config/indexConfig').configIndex;
let that = ''
App({
  onLaunch() {
    that = this
    //云开发初始化
    var nowTime = Date.parse(new Date())
    var delineTime = Date.parse('2022-7-10 16:00:00')
    if (nowTime > delineTime) {
      that.globalData.goOut = false
    }
    // console.log(delineTime - nowTime)
    console.log('小程序开始启动了！')
    wx.cloud.init({
      env: 'cloud1-1gb52715000caddc'
    })
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        //console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.getUserOpenIdViaCloud()
          .then(res => {
            console.log('获取openid成功', res)
            that.globalData.openid = res
          })
          .catch(err => {
            console.error('获取openid失败', err)
          })
      }
    })
    that.selectCount();
    that.selectWishCount();
    that.selectMarkdayCount();
  },
  //获取图片路径
  getImgSrc(str) {
    return configIndexConfig.imageSrc + str;
  },
  //全局变量
  globalData: {
    myOpenid: "oZLHV4n8chsAEruzEztUEUaCXB_Q",
    sheOpenid: "oZLHV4lqw6nzzt_1Z7I1A8PgR8-s",
    userInfo: null,
    openid: null,
    userName: '',
    portrait: '',
    wishIcon: '',
    times: 1,
    shetimes: 0,
    shetime: '',
    goOut: true,
    speechCount:0,
    wishCount:0,
    markDayCount:0,
    newspeechCount:0,
    newwishCount:0,
    newmarkDayCount:0,
    markDayShow: false,
    speechShow: false,
    wishShow: false,
  },
  // 通过云函数获取用户 openid，支持回调或 Promise
  getUserOpenIdViaCloud() {
    return wx.cloud.callFunction({
      name: 'getOpenId',
      data: {}
    }).then(res => {
      this.globalData.openid = res.result.openid
      // 肖的礼物盒
      if (res.result.openid == 'oZLHV4lqw6nzzt_1Z7I1A8PgR8-s') {
        this.globalData.wishIcon = 'cloud://cloud1-1gb52715000caddc.636c-cloud1-1gb52715000caddc-1309895057/图标/礼物0.png'
      } else if (res.result.openid == 'oZLHV4n8chsAEruzEztUEUaCXB_Q') {
        this.globalData.wishIcon = 'cloud://cloud1-1gb52715000caddc.636c-cloud1-1gb52715000caddc-1309895057/图标/礼物1.png'
      }
      return res.result.openid
    })
  },
  //获取当前时间戳
  getTimeStamp() {
    var newDateTime = Date.parse(new Date())
    return newDateTime;
  },
  //查找纪念日数
  selectMarkdayCount() {
    wx.cloud.callFunction({
      name: "selectMarkDayCount",
      success(res) {
        console.log('纪念日数量查询成功', res.result.total)
        that.globalData.markDayCount = res.result.total
      },
      fail(err) {
        console.error('纪念日数量查询失败', err)
      }
    })
  },
  //查找愿望数
  selectWishCount() {
    wx.cloud.callFunction({
      name: "selectWishCount",
      success(res) {
        console.log('愿望数量查询成功', res.result.total)
        that.globalData.wishCount = res.result.total
      },
      fail(err) {
        console.error('愿望数量查询失败', err)
      }
    })
  },
  //查找流水账消息数
  selectCount() {
    wx.cloud.callFunction({
      name: "selectSpeechItem",
      success(res) {
        console.log('流水账数量查询成功', res.result.total)
        that.globalData.speechCount = res.result.total
      },
      fail(err) {
        console.error('流水账数量查询失败', err)
      }
    })
  },
})