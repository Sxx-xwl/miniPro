// app.js
let configIndexConfig = require('./config/indexConfig').configIndex;
let that = ''
App({
  onLaunch() {
    that = this
    //云开发初始化
    console.log('小程序开始启动了！')
    wx.cloud.init({
      env: '《你的云开发环境id》'
    })
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
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
  },
  //获取图片路径
  getImgSrc(str) {
    return configIndexConfig.imageSrc + str;
  },
  //全局变量
  globalData: {
    userInfo: null,
    openid: null,
    userName: '',
    portrait: '',
    wishIcon: '',
  },
  // 通过云函数获取用户 openid，支持回调或 Promise
  getUserOpenIdViaCloud() {
    return wx.cloud.callFunction({
      name: 'getOpenId',
      data: {}
    }).then(res => {
      this.globalData.openid = res.result.openid
      if (res.result.openid == '《你自己的openid》') {
        this.globalData.wishIcon = 'cloud://《你的云开发环境id》.636c-《你的云开发环境id》-1309895057/图标/礼物0.png'
      } else if (res.result.openid == '《另一半的openid》') {
        this.globalData.wishIcon = 'cloud://《你的云开发环境id》.636c-《你的云开发环境id》-1309895057/图标/礼物1.png'
      }
      return res.result.openid
    })
  },

})