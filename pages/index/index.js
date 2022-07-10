let that = '';
const util = require('../../utils/util.js');
var app = getApp();
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    acquaintanceTime: "2021/11/30 00:00:00 GMT+0800",
    togetherTime: "2022/04/03 20:00:00 GMT+0800",
    timeAcquaintance: '',
    timeTogether: '',
    topImage: app.getImgSrc('首页顶部圆图.jpg'),
    showTime: false,
    imageList: '',
    wishCount: '',
    markDayCount: '',
    speechCount: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取当前时间
    // let time = util.formatTime(new Date());
    that.timeAcquaintance();
    that.timeTogether();
    that.getimageList();
    // that.setData({
    //   wishCount: options.wishCount,
    //   markDayCount: options.markDayCount,
    //   speechCount: options.speechCount,
    // })
    that.searchState(options.wishCount, options.markDayCount, options.speechCount);
  },
  //计时函数1  1000ms(1s)刷新一次 
  timeAcquaintance() {
    that = this
    // console.log('tag')
    that.data.timer = setInterval(() => {
      that.setData({
        timeAcquaintance: util.getTimeDifference(that.data.acquaintanceTime)
      })
    }, 1000);
    // console.log('timeAcquaintance',that.data.timeAcquaintance)
  },
  //计时函数2  1000ms(1s)刷新一次 
  timeTogether() {
    that = this
    // console.log('tag')
    that.data.timer = setInterval(() => {
      that.setData({
        timeTogether: util.getTimeDifference(that.data.togetherTime)
      })
    }, 1000);
  },
  //点击顶部图片事件
  topImageClick() {
    wx.showToast({
      title: '咋的？不服啊？',
      icon: 'error'
    })
  },
  //显示隐藏信息
  showTime(event) {
    that = this
    // console.log(event.currentTarget.dataset.hidden)
    // 自定义加载图标
    if (app.globalData.openid != 'oZLHV4n8chsAEruzEztUEUaCXB_Q' && app.globalData.openid != 'oZLHV4lqw6nzzt_1Z7I1A8PgR8-s') {
      wx.showToast({
        title: '这秘密你不能看',
        icon: 'error'
      })
    } else {
      Toast({
        message: '你发现秘密了！',
        icon: 'like-o',
      });
      let hidden = event.currentTarget.dataset.hidden
      that.setData({
        showTime: hidden
      })
    }
  },
  //获取轮播图
  getimageList() {
    that = this
    // console.log('getimageList')
    wx.cloud.database().collection('imageList')
      .get()
      .then(res => {
        console.log('获取数据成功', res.data)
        that.setData({
          imageList: res.data
        })
        // console.log("里面的数据",that.data.imageList[0].image)
      })
      .catch(err => {
        console.error('获取数据失败')
      })
  },
  //轮播图片点击事件
  imageListClick() {
    wx.showToast({
      title: '哎哎哎！扒拉可以！别乱点！',
      icon: 'none'
    })
  },
  //监听用户下拉动作
  onPullDownRefresh() {
    that = this
    //刷新页面
    console.log('刷新了一下')
    that.pullDownRefresh()
  },
  //下拉反馈通知
  pullDownRefresh() {
    //停止刷新
    wx.showToast({
      title: '你搁这找啥呢？？？',
    })
    wx.stopPullDownRefresh()
    console.log('停止了刷新')
  },
  //查询是否更新了
  searchState() {
    let w = app.globalData.newwishCount
    let m = app.globalData.newmarkDayCount
    let s = app.globalData.newspeechCount
    if (w != app.globalData.wishCount || m != app.globalData.markDayCount || s != app.globalData.speechCount) {
      if (w != app.globalData.wishCount) {
        app.globalData.wishShow = true
      }
      if (m != app.globalData.markDayCount) {
        app.globalData.markDayShow = true
      }
      if (s != app.globalData.speechCount) {
        app.globalData.speechShow = true
      }
      //消息提示
      wx.showTabBarRedDot({
        // index 是导航栏的索引 就是在第几个导航上显示
        index: 1,
      })
    } else {
      //取消消息提示
      wx.hideTabBarRedDot({
        // index 是导航栏的索引 就是在第几个导航上显示
        index: 1,
      })
    }
  },
});