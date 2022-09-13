//全局变量  
const app = getApp()
let name = ''
let price = ''
let that = ''
const util = require('../../utils/util');

Page({

  //页面的初始数据
  data: {
    userName: '',
    portrait: '',
    openid: '',
    list: [],
    comments: '',
  },
  //生命周期函数--监听页面加载
  onLoad(options) {
    that = this
    //刷新页面
    wx.startPullDownRefresh()
  },
  //监听用户下拉动作
  onPullDownRefresh() {
    that = this
    console.log('刷新了一下！')
    that.showCommentsLsit()
  },
  //获取用户输入的留言
  getComments(e) {
    name = e.detail.value
    console.log('name', name)
  },
  //获取用户的信息
  getUserInfo(e) {
    price = e.detail.value
    console.log('price', price)
  },
  //留言内容获取
  onChange(event) {
    that = this
    let comments = event.detail
    that.setData({
      comments: comments
    })
  },
  //添加新留言
  addComments(e) {
    that = this
    //获取反馈的内容
    let comments = that.data.comments
    if (!comments.replace(/\s+/g, '').length != 0) {
      wx.showToast({
        title: '你倒是说啊！',
        icon: 'error'
      })
      return
    }
    that.setData({
      userName: app.globalData.userInfo.nickName,
      portrait: app.globalData.userInfo.avatarUrl,
      openid: app.globalData.openid
    })
    //将内容添加到数据库
    wx.cloud.callFunction({
      name: "addUserCom",
      data: {
        _openid: that.data.openid,
        userName: that.data.userName,
        portrait: that.data.portrait,
        comments: comments,
        updateTime: util.formatTime(new Date()),
        submitTime: util.formatTime(new Date())
      },
      success: res => {
        console.log('Com Add result', res)
        that.setData({
          comments: ''
        })
        wx.showToast({
          title: '行，大家都知道了！',
        })
      },
      fail: res => {
        console.error('Com Add result', res)
      }
    })
  },
  //显示留言列表
  showCommentsLsit() {
    that = this
    wx.cloud.database().collection("wxUser-Feedback")
      //倒序
      .orderBy('submitTime', 'desc')
      .get()
      .then(res => {
        console.log('反馈请求成功', res)
        that.setData({
          list: res.data
        })
        //停止刷新动画
        wx.stopPullDownRefresh()
          .then(res => {
            console.log('刷新停止成功')
          })
          .catch(err => {
            console.log('刷新停止失败')
          })
      })
      .catch(err => {
        console.error('反馈请求失败', err)
      })
  },
})