let that = '';
const util = require('../../miniprogram/utils/util.js.js');
var app = getApp();
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast/toast/toast';

Page({
  data: {
    acquaintanceTime: "2021/11/30 00:00:00 GMT+0800",
    togetherTime: "2022/04/03 20:00:00 GMT+0800",
    timeAcquaintance: '',
    timeTogether: '',
    topImage: app.getImgSrc('首页顶部圆图.jpg'),
    showTime: false,
    imageList: '',
  },
  onLoad() {
    that = this
    //获取当前时间
    // let time = util.formatTime(new Date());
    that.timeAcquaintance();
    that.timeTogether();
    that.getimageList();
    // console.log('list111', that.data.imageList)
  },
  /*onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },
  collapseChange(event) {
    that = this
    console.log(event.currentTarget.dataset)
    let activeNames = event.currentTarget.dataset
  },
  //底部导航栏高亮
  tabberChange(event) {
    that = this
    console.log(event)
    let active = event.currentTarget.dataset.name
    that.setData({
      active: active
    })
  },*/
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
    Toast({
      message: '你发现秘密了！',
      icon: 'like-o',
    });
    let hidden = event.currentTarget.dataset.hidden
    that.setData({
      showTime: hidden
    })
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
  pullDownRefresh(){
    //停止刷新
    wx.showToast({
      title: '你搁这找啥呢？？？',
    })
    wx.stopPullDownRefresh()
    console.log('停止了刷新')
  }
});