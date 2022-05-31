// pages/speech/speech.js
//全局变量  
const app = getApp()
let that = ''
const util = require('../../utils/util.js');
const _ = wx.cloud.database().command
Page({

  //页面的初始数据
  data: {
    openid: '',
    fileList: [],
    tempFilePaths: [],
    speechImgList: [],
    speechName: '',
    screenStartTime: '',
    screenEndTime: '',
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    minDate: new Date('2022-01-1 00:00:00').getTime(), // 时间选择的起始时间
    // startDateStamp: app.getTimeStamp(), // 设置默认时间为当前时间戳，该方法在app.js中定义了，方法就是js获取当前时间戳，不会请百度。
    indexList: []
  },
  //生命周期函数--监听页面加载
  onLoad(options) {
    that = this
    that.setData({
      openid: app.globalData.openid
    })
    that.onPullDownRefresh()
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh() {
    that = this
    console.log('刷新了一下！')
    that.showSpeechImgLsit()
  },
  //添加流水账界面
  addSpeech(e) {
    // console.log(e.currentTarget.dataset.id)
    that = this
    if (app.globalData.openid != 'oZLHV4n8chsAEruzEztUEUaCXB_Q' && app.globalData.openid != 'oZLHV4lqw6nzzt_1Z7I1A8PgR8-s') {
      wx.showToast({
        title: '这东西见不得人',
        icon: 'error'
      })
    } else {
      wx.navigateTo({
        url: '/pages/addSpeech/addSpeech?id=' + e.currentTarget.dataset.id,
      })
    }
  },
  //显示流水账列表
  showSpeechImgLsit() {
    that = this
    wx.cloud.callFunction({
      name: "selectSpeech",
      // data: {
      //   _openid: app.globalData.openid
      // },
      success(res) {
        console.log('流水账请求成功', res.result.data)
        that.setData({
          speechImgList: res.result.data
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
      fail(err) {
        console.error('流水账请求失败', err)
      }
    })
  },
  //上传图片
  chooseImg(event) {
    that = this
    // console.log('event', event)
    if (app.globalData.openid != 'oZLHV4n8chsAEruzEztUEUaCXB_Q' && app.globalData.openid != 'oZLHV4lqw6nzzt_1Z7I1A8PgR8-s') {
      wx.showToast({
        title: '你别写！',
        icon: 'error'
      })
    } else {
      //上传到云存储
      wx.chooseImage({
        count: 1, //选择的图片数量
        sizeType: ['original'],
        sourceType: ['album', 'camera'], //设置图片来源
        success(res) {
          console.log(res)
          //tempFilePaths可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths[0]
          const speechName = (Math.random() * 1000).toFixed(0) + '_' + new Date().getTime()
          that.setData({
            tempFilePaths: tempFilePaths,
            speechName: speechName
          })
          // console.log('图片name：', that.data.speechName)
          console.log('图片临时路径：', that.data.tempFilePaths)
          that.uploadFile(tempFilePaths, speechName + '.png')
          console.log('愿望上传了')
        },
        fail(err) {
          console.error('选择图片失败', err)
        }
      })
    }
  },
  //上传文件的第二步：直接上传到云存储
  uploadFile(filePath, fileName) {
    console.log(filePath)
    wx.cloud.uploadFile({
      cloudPath: 'speechImg/' + fileName, //文件存储后的名字
      filePath: filePath, // 文件路径
    }).then(res => {
      // get resource ID
      console.log('上传成功', res.fileID)
      //将内容添加到数据库
      console.log('将添加的id：', app.globalData.openid)
      wx.cloud.callFunction({
        name: "addSpeechImgList",
        data: {
          id: app.globalData.openid,
          userName: app.globalData.userName,
          imgName: fileName, //容器名称
          cloudPath: res.fileID,
          updateTime: util.formatTime(new Date()),
          showTime: util.formatTime(new Date()).split(' ')[0],
          state: '1', //展示
          submitTime: util.formatTime(new Date())
        },
        success: res => {
          console.log('SIL Add result', res)
          wx.showToast({
            title: 'OK 可以写东西了！',
          })
          that.showSpeechImgLsit()
        },
        fail: res => {
          console.error('SIL Add result', res)
        }
      })
    }).catch(error => {
      // handle error
      console.error('上传失败', error)
      wx.showToast({
        icon: "error",
        title: '上传失败！',
      })
    })
  },
  //筛选功能
  onChange(event) {
    that = this
    // console.log('页面',event.detail.name)
    let num = event.detail.name
    if (num == 0) {
      that.showSpeechImgLsit()
    } else if (num == 1) {
      console.log('页面', num)
      that.showLastList()
    } else if (num == 2) {
      console.log('页面', num)
      that.showReList()
    }
  },
  //显示倒叙列表 _openid
  showReList() {
    that = this
    wx.cloud.callFunction({
      name: "selectSpeechOrder",
      // data: {
      //   _openid: app.globalData.openid
      // },
      success(res) {
        console.log('流水账请求成功', res.result.data)
        that.setData({
          speechImgList: res.result.data
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
      fail(err) {
        console.error('流水账请求失败', err)
      }
    })
  },
  //显示筛选后的列表 year mon
  screenTime(event) {
    that = this
    // console.log('时间1：', event)
    // console.log('时间2：', new Date())
    this.setData({
      currentDate: event.detail,
      screenStartTime: util.formatTimeTwo(event.detail / 1000, 'Y/M/D h:m:s'),
      screenEndTime: util.formatTimeThree(event.detail / 1000, 'Y/M/D h:m:s'),
      // screenEndTime: util.formatTimeTwo(event.detail/1000 + 2678400, 'Y/M/D h:m:s'),
    });
    // console.log('时间1：', that.data.screenStartTime)
    // console.log('时间2：', that.data.screenEndTime)
    wx.cloud.callFunction({
      name: "selectSpeechByTime",
      data: {
        screenStartTime: that.data.screenStartTime,
        screenEndTime: that.data.screenEndTime
      },
      success(res) {
        console.log('流水账时间筛选请求成功', res.result.data)
        if ( res.result.data.length == 0) {
          wx.showToast({
            title: '这个月没有哦！',
            icon: 'error'
          })
        } else {
          wx.showToast({
            title: '查询完毕！',
          })
        }
        that.setData({
          speechImgList:  res.result.data,
        })
        that.selectComponent('#item').toggle();
        //停止刷新动画
        wx.stopPullDownRefresh()
          .then(res => {
            console.log('刷新停止成功')
          })
          .catch(err => {
            console.log('刷新停止失败')
          })
      },
      fail(err) {
        console.error('流水账请求失败', err)
      }
    })
  },
  //近一个月内容
  showLastList() {
    that = this
    this.setData({
      screenStartTime: util.formatTimefour(new Date() / 1000, 'Y/M/D h:m:s'),
      screenEndTime: util.formatTimeTwo(new Date() / 1000, 'Y/M/D h:m:s'),
    });
    wx.cloud.callFunction({
      name: "selectSpeechByTime",
      data: {
        screenStartTime: that.data.screenStartTime,
        screenEndTime: that.data.screenEndTime
      },
      success(res) {
        console.log('流水账时间筛选请求成功', res)
        if (res.result.data.length == 0) {
          wx.showToast({
            title: '这个月没有哦！',
            icon: 'error'
          })
        } else {
          wx.showToast({
            title: '查询完毕！',
          })
        }
        that.setData({
          speechImgList: res.result.data,
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
      fail(err) {
        console.error('流水账请求失败', err)
      }
    })
  },
  //取消筛选
  closeTime() {
    this.selectComponent('#item').toggle();
  },
})