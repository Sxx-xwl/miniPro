const app = getApp()
let that = ''
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
  data: {
    feedback: '',
    userName: '',
    portrait: '',
    openid: '',
    times: 0,
    time: '',
    isNull: 'https://thirdwx.qlogo.cn/mmopen/vi_32/ib7ymR5sdB4FwLDRL1YtwibwzezwTpxxFPOsmSfcJicZZNwxiaia8sbz41OsXNXTcicyMrPl21XcYLLzYNxVh859DbjA/132',
  },
  //生命周期函数--监听页面加载
  onLoad(options) {
    that = this
    that.setData({
      userName: app.globalData.userName,
      portrait: app.globalData.portrait,
      openid: app.globalData.openid,
      times: app.globalData.shetimes,
      time: app.globalData.shetime,
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
    Toast.loading({
      message: '我把这话告诉他',
      forbidClick: true,
    });
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
        Toast.clear();
        wx.showToast({
          title: '好的，大哥收到！',
        })
      },
      fail: res => {
        console.log('FB Add result', res)
      }
    })
  },
})