//全局变量  
const app = getApp()
let name = ''
let price = ''
let that = ''
const util = require('../../utils/util.js');

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
  //显示留言列表
  showCommentsLsit() {
    that = this
    wx.cloud.database().collection("wxUser")
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