//全局变量  
const app = getApp()
let that = ''
const util = require('../../utils/util');

Page({

  //页面的初始数据
  data: {
    list: [],
    markText: '',
    markDate: '',
    state: '',
    openid: '',
  },
  //生命周期函数--监听页面加载
  onLoad(options) {
    that = this
    that.setData({
      openid: app.globalData.openid
    })
    //刷新页面
    // wx.startPullDownRefresh()
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh() {

  },
  //页面上拉触底事件的处理函数
  onReachBottom() {

  },
  //添加新纪念日
  createDay(e) {
    that = this
    //获取内容
    let markText = that.data.markText
    let markDate = that.data.markDate
    if (!markText.replace(/\s+/g, '').length != 0) {
      wx.showToast({
        title: '啥日子啊？',
        icon: 'error'
      })
      return
    }
    if (!markDate.replace(/\s+/g, '').length != 0) {
      wx.showToast({
        title: '请在右下选日期',
        icon: 'error'
      })
      return
    }
    console.log('state', that.data.state)
    //将内容添加到数据库
    wx.cloud.callFunction({
      name: "addMarkDay",
      data: {
        _openid: app.globalData.openid,
        userName: app.globalData.userName,
        markText: that.data.markText,
        markDate: that.data.markDate,
        state: that.data.state,
        updateTime: util.formatTime(new Date()),
        submitTime: util.formatTime(new Date())
      },
      success: res => {
        console.log('MD Add result', res)
        wx.navigateBack({ //跳转到前一个页面
          success: function () {
          }
        })
        wx.showToast({
          title: 'OK 大哥帮你记住了！',
        })
      },
      fail: res => {
        console.error('MD Add result', res)
      }
    })
  },
  // 获取日期
  selectDateSecondChange(e) {
    that = this
    let target = new Date(e.detail.value).getTime()
    let now = new Date().getTime()
    if (target < now) {
      that.setData({
        markDate: e.detail.value,
        state: "0",
      })
      console.log('之前的日子', that.data.state)
    } else {
      that.setData({
        markDate: e.detail.value,
        state: "1",
      })
      console.log('以后的日子', that.data.state)
    }
  },
  //获取纪念日名称
  onChange(event) {
    that = this
    // event.detail 为当前输入的值
    console.log(event.detail);
    that.setData({
      markText: event.detail
    })
  },
})