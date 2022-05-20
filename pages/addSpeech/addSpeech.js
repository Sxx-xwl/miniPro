//全局变量  
const app = getApp()
let that = ''
const util = require('../../utils/util');
const _ = wx.cloud.database().command
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  //页面的初始数据
  data: {
    mark: '',
    openid: '',
    speechItemList: [],
    trueSpeechItemList: [],
    text: '',
    tempFilePaths: [],
    display: true,
  },
  //生命周期函数--监听页面加载
  onLoad(options) {
    that = this
    console.log('你选择了', options.id)
    that.setData({
      mark: options.id,
      openid: app.globalData.openid
    })
    console.log('你选择了', that.data.mark)
    //刷新页面
    wx.startPullDownRefresh()
  },
  //生命周期函数函数
  onShow() {
    // console.log('刷新？')
    //刷新页面
    wx.startPullDownRefresh()
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh() {
    that = this
    that.speechItemList()
    that.trueSpeechItemList()
  },
  //通过id查找内容
  trueSpeechItemList() {
    that = this
    wx.cloud.database().collection('speechItemList')
      .where({
        mark: that.data.mark
      })
      .get()
      .then(res => {
        console.log('流水账内容请求成功', res.data)
        that.setData({
          trueSpeechItemList: res.data
        })
        //停止刷新动画
        wx.stopPullDownRefresh()
          .then(res => {
            console.log('刷新停止成功')
            console.log('内容:', that.data.trueSpeechItemList)
          })
          .catch(err => {
            console.log('刷新停止失败')
          })
      })
      .catch(err => {
        console.error('流水账内容请求失败', err)
      })
  },
  //通过id查找内容 state=1
  speechItemList() {
    that = this
    wx.cloud.database().collection('speechItemList')
      //条件查询
      .where(_.and([{
        mark: that.data.mark
      }, {
        state: 1
      }]))
      .get()
      .then(res => {
        console.log('流水账内容请求成功', res.data)
        that.setData({
          speechItemList: res.data
        })
        //停止刷新动画
        wx.stopPullDownRefresh()
          .then(res => {
            console.log('刷新停止成功')
            console.log('内容:', that.data.speechItemList)
          })
          .catch(err => {
            console.log('刷新停止失败')
          })
      })
      .catch(err => {
        console.error('流水账内容请求失败', err)
      })
  },
  //获取记录内容
  getText(event) {
    that = this
    // event.detail 为当前输入的值
    // console.log(event.detail);
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
  uploadFile(filePath, fileName) {
    that = this

    let text = that.data.text
    let mark = that.data.mark

    console.log(filePath)
    wx.cloud.uploadFile({
      cloudPath: 'speechItemImg/' + new Date().getTime() + fileName, //文件存储后的名字
      filePath: filePath, // 文件路径
    }).then(res => {
      // get resource ID
      console.log('上传成功', res.fileID)
      //将内容添加到数据库
      console.log('将添加的id：', app.globalData.openid)
      wx.cloud.callFunction({
        name: "addSpeechItemList",
        data: {
          openid: app.globalData.openid,
          userName: app.globalData.userName,
          text: text,
          num: that.data.speechItemList.length,
          mark: that.data.mark,
          cloudPath: res.fileID,
          updateTime: util.formatTime(new Date()),
          state: 1,
          submitTime: util.formatTime(new Date())
        },
        success: res => {
          console.log('SIL Add result', res)
          wx.showToast({
            title: 'OK 交给我！',
          })
          that.speechItemList()
          //清空输入框
          that.setData({
            text: '',
          })
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
  //添加流水账
  addbtn(e) {
    that = this
    let text = that.data.text
    let tempFilePaths = that.data.tempFilePaths[0]
    let len = that.data.trueSpeechItemList.length
    if (!text.replace(/\s+/g, '').length != 0) {
      wx.showToast({
        title: '先写内容哦！',
        icon: 'error'
      })
    } else if (!tempFilePaths) {
      wx.showToast({
        title: '传个配图！',
        icon: 'error'
      })
    } else {
      console.log('text', text)
      that.uploadFile(tempFilePaths, len + '.png')
      console.log('愿望上传了')
    }
  },
  //不想写了
  show() {
    that = this
    that.setData({
      display: true
    })
  },
  //想写了
  notShow() {
    that = this
    that.setData({
      display: false
    })
  },
  //预览图片
  previewImage: function (e) {
    that = this
    // console.log(e);
    var current = e.currentTarget.dataset.src;
    // console.log(current);
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: [current], // 需要预览的图片http链接列表
    })
  },
  //修改内容
  updateItem(e) {
    that = this
    var current = e.currentTarget.dataset.id;
    var currentID;
    wx.cloud.database().collection('speechItemList')
      .where({
        _id: current,
      })
      .get()
      .then(res => {
        // console.log('找到了', res.data[0].openid )  
        currentID = res.data[0].openid
        if (currentID == app.globalData.myOpenid && app.globalData.openid == app.globalData.sheOpenid) {
          wx.showToast({
            title: '不可以使坏哦！',
            icon: 'error'
          })
          return;
        }
        Dialog.confirm({
          title: '修改内容',
          message: '真的要修改这里的内容么？',
        })
        .then(() => {
          // console.log(1)
          that.update(current)
        })
        .catch(() => {
          // console.log(2)
        });
        // console.log("current:",currentID)
      })
  },
  //修改
  update(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/updateSpeech/updateSpeech?id=' + e,
    })
  },
})