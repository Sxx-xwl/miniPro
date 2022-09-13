// pages/updateSpeech/updateSpeech.js
//全局变量  
const app = getApp()
let that = ''
const util = require('../../utils/util');

Page({

  //页面的初始数据
  data: {
    openid: '',
    id: '',
    speechItemList: [],
    text: '',
    tempFilePaths: [],
    cloudPath: '',
    display: true,
  },
  //生命周期函数--监听页面加载
  onLoad(options) {
    that = this
    console.log('跳转修改：', options)
    that.setData({
      openid: app.globalData.openid,
      id: options.id,
    })
    that.speechItemList(options.id)
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh() {
    that = this
    console.log('刷新了一下！')
    that.speechItemList()
  },
  //通过id查找内容
  speechItemList(id) {
    that = this
    wx.cloud.database().collection('speechItemList')
      .where({
        _id: id
      })
      .get()
      .then(res => {
        console.log('选择更新的流水账内容请求成功', res.data[0])
        that.setData({
          text: res.data[0].text,
          cloudPath: res.data[0].cloudPath,
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
        console.error('选择更新的流水账内容请求失败', err)
      })
  },
  //获取记录内容
  getText(event) {
    that = this
    that.setData({
      text: event.detail
    })
  },
  //上传图片
  chooseImg(event) {
    let text = that.data.text

    if (!text.replace(/\s+/g, '').length != 0) {
      wx.showToast({
        title: '先写内容哦！',
        icon: 'error'
      })
      return
    }
    //上传到云存储
    wx.chooseImage({
      count: 1, //选择的图片数量
      sizeType: ['original'],
      sourceType: ['album', 'camera'], //设置图片来源
      success(res) {
        //tempFilePaths可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          tempFilePaths: tempFilePaths
        })
        console.log('图片临时路径：', tempFilePaths)
      }
    })
  },
  //上传文件的第二步：直接上传到云存储
  uploadFile1(filePath, fileName) {
    let text = that.data.text
    let id = that.data.id
    console.log(filePath)
    wx.cloud.uploadFile({
      cloudPath: 'speechItemImg/' + new Date().getTime() + fileName, //文件存储后的名字
      filePath: filePath, // 文件路径
    }).then(res => {
      // get resource ID
      wx.hideLoading()
      console.log('上传成功', res.fileID)
      //将内容添加到数据库
      // console.log('将添加的id：', app.globalData.openid)
      wx.cloud.callFunction({
        name: "updateSpeechItem",
        data: {
          id: id,
          text: text,
          state: 1,
          cloudPath: res.fileID,
          updateTime: util.formatTime(new Date()),
        },
        success: res => {
          console.log('SIL update result', res)
          wx.showToast({
            title: 'OK 应该是修改完了！',
          })
          that.speechItemList()
          wx.navigateBack({ //跳转到前一个页面
            success: function () {}
          })
        },
        fail: res => {
          console.error('SIL update result', res)
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
  //上传文件的第二步：直接上传到云存储  无图片
  uploadFile2() {
    let text = that.data.text
    let id = that.data.id
    let cloudPath = that.data.cloudPath
    //将内容添加到数据库
    wx.cloud.callFunction({
      name: "updateSpeechItem",
      data: {
        id: id,
        text: text,
        state: 1,
        cloudPath: cloudPath,
        updateTime: util.formatTime(new Date()),
      },
      success: res => {
        wx.hideLoading()
        console.log('SIL update result', res)
        wx.showToast({
          title: 'OK 应该是修改完了！',
        })
        that.speechItemList()
        wx.navigateBack({ //跳转到前一个页面
          success: function () {}
        })
      },
      fail: res => {
        console.error('SIL update result', res)
      }
    })
  },
  //修改内容
  updatebtn(e) {
    that = this
    let text = that.data.text
    let tempFilePaths = that.data.tempFilePaths[0]
    let len = that.data.speechItemList.length
    if (!text.replace(/\s+/g, '').length != 0) {
      wx.showToast({
        title: '先写内容哦！',
        icon: 'error'
      })
    } else if (!tempFilePaths) {
      console.log('text', text)
      that.uploadFile2()
      console.log('愿望上传了')
      wx.showLoading({
        title: '正在上传',
      });
    } else {
      console.log('text', text)
      that.uploadFile1(tempFilePaths, len + '.png')
      console.log('愿望上传了')
      wx.showLoading({
        title: '正在上传',
      });
    }
  },
  //删除内容
  deletebtn() {
    let text = that.data.text
    let id = that.data.id
    let cloudPath = that.data.cloudPath
    //将内容添加到数据库
    wx.cloud.callFunction({
      name: "updateSpeechItem",
      data: {
        id: id,
        text: text,
        state: 2,
        cloudPath: cloudPath,
        updateTime: util.formatTime(new Date()),
      },
      success: res => {
        wx.hideLoading()
        console.log('SIL delete result', res)
        wx.showToast({
          title: 'OK 进垃圾桶！',
        })
        that.speechItemList()
        wx.navigateBack({ //跳转到前一个页面
          success: function () {}
        })
      },
      fail: res => {
        console.error('SIL delete result', res)
      }
    })
  },
})