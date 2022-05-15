const app = getApp()
let that = ''
const util = require('../../miniprogram/utils/util.js.js');

Page({
  data: {
    feedback: '',
    userName: '',
    portrait: '',
  },
  //生命周期函数--监听页面加载
  onLoad(options) {
    that = this
    that.setData({
      userName: app.globalData.userName,
      portrait: app.globalData.portrait,
    })
  },
  //反馈内容获取
  onChange(event) {
    that = this
    // event.detail 为当前输入的值
    // console.log(event.detail)
    let feedback = event.detail
    that.setData({
      feedback: feedback
    })
  },
  //提交反馈内容
  submitFB() {
    that = this
    //获取反馈的内容
    let feedbackValue = that.data.feedback
    if (!feedbackValue.replace(/\s+/g, '').length != 0) {
      wx.showToast({
        title: '你这是反馈啥呢！',
        icon: 'error'
      })
      return
    }
    console.log(feedbackValue)
    //将内容添加到数据库
    wx.cloud.callFunction({
      name: "addUserFB",
      data: {
        _openid: app.globalData.openid,
        userName: app.globalData.userName,
        portrait: app.globalData.portrait,
        feedback: feedbackValue,
        updateTime: util.formatTime(new Date()),
        submitTime: util.formatTime(new Date())
      },
      success: res => {
        console.log('FB Add result', res)
        that.setData({
          feedback: ''
        })
        wx.showToast({
          title: '好的，大哥收到！',
        })
      },
      fail: res => {
        console.log('FB Add result', res)
      }
    })
  }
})