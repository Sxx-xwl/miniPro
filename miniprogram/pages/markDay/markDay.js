//全局变量  
const app = getApp()
let that = ''
const util = require('../../../utils/util.jstils/util.js');
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  //页面的初始数据
  data: {
    list: [],
    nextTime: '',
    markDate: '',
    openid: '',
  },
  //生命周期函数--监听页面加载
  onLoad(options) {
    that = this
    that.setData({
      openid: app.globalData.openid,
    })
    //刷新页面
    wx.startPullDownRefresh()
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh() {
    that = this
    that.showMarkDayLsit()
  },
  //生命周期函数函数
  onShow() {
    // console.log('刷新？')
    //刷新页面
    wx.startPullDownRefresh()
  },
  //删除所选纪念日
  onClose(event) {
    that = this
    console.log('event,', event.detail.name)
    if (that.data.openid != 'oZLHV4n8chsAEruzEztUEUaCXB_Q' && that.data.openid != 'oZLHV4lqw6nzzt_1Z7I1A8PgR8-s') {
      Dialog.confirm({
          context: this,
          title: '??????',
          message: '你怎么可以随便删别人的东西？出去！',
        })
        .then((res) => {
          wx.showToast({
            title: '下次不许了奥！',
          })
        })
        .catch((err) => {
          wx.showToast({
            title: '再来告家长了奥',
            icon: 'error'
          })
        })
    } else {
      Dialog.confirm({
          context: this,
          title: '这可是删除奥！',
          message: '这个内容真的没有用了吗？',
        })
        .then((res) => {
          console.log('删除了', res)
          wx.cloud.callFunction({
            name: "deleteMarkDay",
            data: {
              _id: event.detail.name,
              updateTime: util.formatTime(new Date()),
            },
            success: res => {
              console.log('MD Del result', res)
              wx.startPullDownRefresh()
              wx.showToast({
                title: '大哥已经删了',
              })
            },
            fail: res => {
              console.error('MD Add result', res)
            }
          })
        })
        .catch((err) => {
          console.error('不删了', err)
        })
    }

  },
  //添加新纪念日
  addMarkDay(e) {
    that = this
    if (app.globalData.openid != 'oZLHV4n8chsAEruzEztUEUaCXB_Q' && app.globalData.openid != 'oZLHV4lqw6nzzt_1Z7I1A8PgR8-s') {
      wx.showToast({
        title: '自己用脑袋记！',
        icon: 'error'
      })
    } else {
      wx.navigateTo({
        url: '/pages/addmarkDay/addmarkDay',
      })
    }
  },
  //显示纪念日列表
  showMarkDayLsit() {
    let that = this
    that.setData({
      openid: app.globalData.openid,
    })
    console.log('openid', that.data.openid)
    wx.cloud.callFunction({
      name: "selectMarkDay",
      success: res => {
        console.log('纪念日请求成功', res)
        that.setData({
          list: res.result.data
        })
        //停止刷新动画
        wx.stopPullDownRefresh()
          .then(res => {
            console.log('刷新停止成功')
          })
          .catch(err => {
            console.log('刷新停止失败')
          })
      },
      fail: err => {
        console.error('纪念日请求失败', err)
      }
    })
  },
  //计时函数1  1000ms(1s)刷新一次 
  getnextTime() {
    that = this
    // console.log('tag')
    that.data.timer = setInterval(() => {
      that.setData({
        nextTime: util.getTimeDifference(that.data.markDate)
      })
    }, 1000);
    console.log('nextTime', that.data.nextTime)
    console.log('markDate', that.data.markDate)
  },
})