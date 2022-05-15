const app = getApp()
const _ = wx.cloud.database().command
let that = ''
const util = require('../../utils/util');
Page({
  data: {
    openid: '',
    backgroundImg: app.getImgSrc('index.jpg'),
    list: '',
  },
  //生命周期函数--监听页面加载
  onLoad(options) {
    that = this
    let time = util.formatTime(new Date())
    that.updateMarkDay(time)
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
        // that.addUserInfo(user.nickName, user.avatarUrl)
        app.globalData.userName = user.nickName
        app.globalData.portrait = user.avatarUrl
        // console.log("全局用户姓名", app.globalData.userName) 
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
    if(that.data.openid=="oZLHV4n8chsAEruzEztUEUaCXB_Q")
    {
      wx.cloud.database().collection('wxUser')
      .where({
        _openid: "oZLHV4lqw6nzzt_1Z7I1A8PgR8-s"
      })
      .get()
      .then(res =>{
        // console.log("女朋友信息：",res.data[0].times)
        app.globalData.shetimes = res.data[0].times;
        // console.log("女朋友信息：",res.data[0].updateTime)
        app.globalData.shetime = res.data[0].updateTime;
      })
    }
    //云函数的调用
    wx.cloud.callFunction({
      name: "selectUserInfo",
      data: {
        _openid: app.globalData.openid
      },
      success(res) {
        // console.log('数据类型：',typeof app.globalData.openid)
        //result 用户数据
        console.log('用户数据', res)
        let result = res.result.data[0];
        if (result != null) {
          // console.log(result.userName,result.portrait)
          //查到了 更新一下吧
          app.globalData.times = result.times + 1;
          that.updateUserInfo(app.globalData.userName, app.globalData.portrait, app.globalData.times)
        } else {
          // console.log(false)
          //没查到 添加一个吧
          that.addUserInfo(app.globalData.userName, app.globalData.portrait, app.globalData.times)
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
  addUserInfo(userName, portrait, times) {
    //console.log('1')
    console.log(userName, ' ', portrait)
    wx.cloud.callFunction({
      name: "addUserInfo",
      data: {
        _openid: app.globalData.openid,
        userName: userName,
        portrait: portrait,
        updateTime: util.formatTime(new Date()),
        submitTime: util.formatTime(new Date()),
        times: times
      },
      complete: res => {
        console.log('callFunction Add result', res)
      }
    })

  },
  //更新微信用户信息
  updateUserInfo(userName, portrait, times) {
    that = this
    console.log(userName, ' ', portrait)
    wx.cloud.callFunction({
      name: "updateUserInfo",
      data: {
        _openid: app.globalData.openid,
        userName: userName,
        portrait: portrait,
        updateTime: util.formatTime(new Date()),
        times: times
      },
      complete: res => {
        console.log('callFunction update result', res)
        console.log('callFunction update ', res.result.stats)
        if (app.globalData.openid == 'oZLHV4lqw6nzzt_1Z7I1A8PgR8-s') {
          wx.showToast({
            title: '来啦来啦？大哥爱你！',
            icon: 'none'
          })
        } else if (app.globalData.openid == 'oZLHV4n8chsAEruzEztUEUaCXB_Q') {
          wx.showToast({
            title: '又有bug了？？',
            icon: 'none'
          })
        } else if (app.globalData.openid == 'oZLHV4vgHB0kIHRdwybT0lECiBQ0') {
          wx.showToast({
            title: '专业英语过了么？',
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
  //更新纪念日列表标签
  updateMarkDay(time) {
    wx.cloud.callFunction({
      name: "updateMarkDay",
      data: {
        time: time
      },
      success: res => {
        console.log('纪念日修改成功', res)
      },
      fail: err => {
        console.error('纪念日修改失败', err)
      }
    })
  },
})