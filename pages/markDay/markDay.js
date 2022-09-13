//全局变量  
const app = getApp()
let that = ''
const util = require('../../utils/util');
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const _ = wx.cloud.database().command
let interval = null;

Page({

  //页面的初始数据
  data: {
    list: [],
    nextTime: '',
    markDate: '',
    openid: '',
    active: 0,
    time: '',
    name: '',
    show: false,
    timer: '',
    isSequence: ''
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
    //刷新页面
    wx.startPullDownRefresh()
  },
  //筛选功能
  onChange(event) {
    that = this
    let num = event.detail.name
    if (num == 0) {
      that.showMarkDayLsit()
    } else if (num == 1) {
      console.log('页面', num)
      let e = '《你自己的openid》'
      that.showPartMarkDayList1(e)
    } else if (num == 2) {
      console.log('页面', num)
      let e = '《另一半的openid》'
      that.showPartMarkDayList1(e)
    } else if (num == 3) {
      console.log('页面', num)
      let e = '1'
      that.showPartMarkDayList2(e)
    } else if (num == 4) {
      console.log('页面', num)
      let e = '0'
      that.showPartMarkDayList2(e)
    }
  },
  //删除所选纪念日
  onClose(event) {
    that = this
    console.log('event,', event.detail.name)
    if (that.data.openid != '《另一半的openid》' && that.data.openid != '《你自己的openid》') {
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
              updateTime: util.formatTime(new Date())
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
    if (app.globalData.openid != '《另一半的openid》' && app.globalData.openid != '《你自己的openid》') {
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
  //显示筛选后的列表 state
  showPartMarkDayList2(num) {
    that = this
    // console.log('num',num)
    wx.cloud.database().collection("markDay")
      //倒序
      .orderBy('markDate', 'desc')
      //条件查询
      .where({
        state: num
      })
      .get()
      .then(res => {
        console.log('条件查询成功', res.data)
        that.setData({
          list: res.data
        })
      })
  },
  //显示筛选后的列表 _openid
  showPartMarkDayList1(num) {
    that = this
    console.log('num', num)
    wx.cloud.database().collection("markDay")
      //倒序
      .orderBy('markDate', 'desc')
      //条件查询
      .where({
          _openid: num
        },
        (_.or([{
          state: "0"
        }, {
          state: "1"
        }])))
      .get()
      .then(res => {
        console.log('条件查询成功', res.data)
        that.setData({
          list: res.data
        })
      })
  },
  //显示细节
  showDetail(e) {
    that = this
    console.log(e.currentTarget.dataset.id)
    that.setData({
      show: true,
      name: e.currentTarget.dataset.name
    })
    Toast.loading({
      message: '我算算哈...',
      forbidClick: true,
    });
    let targetTime = e.currentTarget.dataset.id
    //计算现在与目标时间的差值(毫秒)
    let time1 = new Date(targetTime).getTime();
    let time2 = new Date().getTime();
    let mss = time1 - time2;
    // console.log('时间戳',time1)
    if (mss > 0) {
      that.setData({
        isSequence: false
      })
      //倒计时函数  1000ms(1s)刷新一次 
      interval = setInterval(() => {
        that.setData({
          time: util.getTimeDifferenceRe(targetTime)
        })
        Toast.clear();
      }, 1000);
    } else {
      that.setData({
        isSequence: true
      })
      //计时函数1  1000ms(1s)刷新一次 
      interval = setInterval(() => {
        that.setData({
          time: util.getTimeDifference(targetTime)
        })
        Toast.clear();
      }, 1000);
    }
  },
  //隐藏细节
  onClickHide() {
    this.setData({
      show: false,
      time: '',
    });
    clearInterval(interval);
  },
})