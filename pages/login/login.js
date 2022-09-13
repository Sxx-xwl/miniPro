const app = getApp()
let that = ''
const util = require('../../utils/util');
Page({
  data: {
    openid: '',
    backgroundImg: app.getImgSrc('index.jpg'),
  },
  //生命周期函数--监听页面加载
  onLoad(options) {
    that = this
  },
  //获取微信用户信息
  getUserInfo() {
    that = this
    console.log('点击获取用户信息')
    wx.getUserProfile({
      desc: '用于完善个人信息',
      success(res) {
        let user = res.userInfo
        console.log('获取到的用户信息:', user)
        app.globalData.userInfo = user
        console.log("全局用户信息", app.globalData.userInfo)
        app.globalData.userName = user.nickName
        app.globalData.portrait = user.avatarUrl
        that.selectUserInfo()
      },
    })
  },
  //通过openid查找用户信息
  selectUserInfo() {
    that = this
    that.setData({
      openid: app.globalData.openid
    })
    //云函数的调用
    wx.cloud.callFunction({
      name: "selectUserInfo",
      data: {
        _openid: app.globalData.openid
      },
      success(res) {
        console.log('用户数据', res)
        let result = res.result.data[0];
        if (result != null) {
          //查到了 更新一下吧
          that.updateUserInfo(app.globalData.userName, app.globalData.portrait)
        } else {
          //没查到 添加一个吧
          that.addUserInfo(app.globalData.userName, app.globalData.portrait)
        }
        console.log("云函数调用成功", res)
        wx.switchTab({
          url: '../index/index'
        });
      },
      fail(err) {
        console.error("云函数调用失败", err);
      }
    })
  },
  //存储微信用户信息
  addUserInfo(userName, portrait) {
    console.log(userName, ' ', portrait)
    wx.cloud.callFunction({
      name: "addUserInfo",
      data: {
        _openid: app.globalData.openid,
        userName: userName,
        portrait: portrait,
        updateTime: util.formatTime(new Date()),
        submitTime: util.formatTime(new Date())
      },
      complete: res => {
        console.log('callFunction Add result', res)
      }
    })

  },
  //更新微信用户信息
  updateUserInfo(userName, portrait) {
    that = this
    console.log(userName, ' ', portrait)
    wx.cloud.callFunction({
      name: "updateUserInfo",
      data: {
        _openid: app.globalData.openid,
        userName: userName,
        portrait: portrait,
        updateTime: util.formatTime(new Date()),
      },
      complete: res => {
        console.log('callFunction update result', res)
        console.log('callFunction update ', res.result.stats)
        if (app.globalData.openid == '《你自己的openid》') {
          wx.showToast({
            title: '来啦来啦？大哥爱你！',
            icon: 'none'
          })
        } else if (app.globalData.openid == '《另一半的openid》') {
          wx.showToast({
            title: '又有bug了？？',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '欢迎提供bug',
            icon: 'none'
          })
        }
      }
    })
  },
})