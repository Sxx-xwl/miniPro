//全局变量  
const app = getApp()
let that = ''
const util = require('../../miniprogram/utils/util.js.js');

Page({

  //页面的初始数据
  data: {
    wishImg:app.getImgSrc('许愿.png'),
    dayImg:app.getImgSrc('纪念日.png'),
    primeImg:app.getImgSrc('最初版.png'),
    userListImg:app.getImgSrc('用户列表.png'),
    feedbackImg:app.getImgSrc('反馈留言.png'),
    endImg:app.getImgSrc('敬请期待.png'),
    openid: '',
  },
  //生命周期函数--监听页面加载
  onLoad(options) {
    that = this
    // console.log('用户权限',app.globalData.openid)
    that.setData({
      openid: app.globalData.openid
    })
    // console.log('openid---',that.data.openid)
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh() {

  },
  //纪念日页面跳转
  markDay(e){
    that = this
    console.log('To markDay success:', e)
    wx.navigateTo({
      url: '/pages/markDay/markDay',
    })
  },
  //许愿树页面跳转
  wishingTree(e){
    that = this
    console.log('To wishingTree success:', e)
    wx.navigateTo({
      url: '/pages/wishingTreePage/wishingTreePage',
    })
  },
  //最初版跳转
  prime(){
    that = this
    console.log(1)
    wx.navigateTo({
      url: '/pages/prime/prime',
    })
  },
  //用户列表跳转
  userList(){
    that = this
    console.log(2)
    wx.navigateTo({
      url: '/pages/userList/userList',
    })
  },
  //反馈留言跳转
  feedback(){
    that = this
    console.log(3)
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
  },
  //敬请期待
  end(){
    that = this
    // console.log(4)
    wx.showToast({
      title: '待研发！可以在`我的`反馈界面提供你的想法和建议！',
      icon: 'none',
    })
  },
})