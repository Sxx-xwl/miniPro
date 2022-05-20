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
    tempFilePaths: [],
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
    // event.detail 为当前输入的值
    // console.log(event.detail
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
    let tempFilePaths = that.data.tempFilePaths[0]
    let len = that.data.list.length
    if (!comments.replace(/\s+/g, '').length != 0 && tempFilePaths.length == 0) {
      wx.showToast({
        title: '你倒是说啊！',
        icon: 'error'
      })
      return
    }
    that.setData({
      userName: app.globalData.userName,
      portrait: app.globalData.uportrait,
      openid: app.globalData.openid
    })
    //将内容添加到数据库
    that.uploadFile(tempFilePaths, len + '.png')
    console.log('留言上传了')
    // console.log(app.globalData.userInfo.nickName,app.globalData.userInfo.avatarUrl)
    // wx.cloud.callFunction({
    //   name: "addUserCom",
    //   data: {
    //     _openid: that.data.openid,
    //     userName: that.data.userName,
    //     portrait: that.data.portrait,
    //     comments: comments,
    //     updateTime: util.formatTime(new Date()),
    //     submitTime: util.formatTime(new Date())
    //   },
    //   success: res => {
    //     console.log('Com Add result', res)
    //     that.setData({
    //       comments: ''
    //     })
    //     wx.showToast({
    //       title: '行，大家都知道了！',
    //     })
    //   },
    //   fail: res => {
    //     console.error('Com Add result', res)
    //   }
    // })
  },
  //显示留言列表
  showCommentsLsit() {
    let that = this
    wx.cloud.callFunction({
      name: "selectUserCom",
      success: res => {
        console.log('留言请求成功', res.result)
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
        console.error('留言请求失败', err)
      }
    })
  },
  //上传图片
  chooseImg(event) {
    //上传到云存储
    wx.chooseImage({
      count: 1, //选择的图片数量
      sizeType: ['compressed'],
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
    let comments = that.data.comments
    if(filePath==null || filePath.length==0){
      wx.cloud.callFunction({
        name: "addUserCom",
        data: {
          _openid: app.globalData.openid,
          userName: app.globalData.userName,
          portrait: app.globalData.portrait,
          comments: comments,
          cloudPath: '',
          updateTime: util.formatTime(new Date()),
          state: 1,
          submitTime: util.formatTime(new Date())
        },
        success: res => {
          console.log('Com Add result', res)
          that.setData({
            comments: '',
            tempFilePaths: [],
          })
          wx.showToast({
            title: '行，大家都知道了！',
          })
        },
        fail: res => {
          console.error('Com Add result', res)
        }
      })
    }else{
      console.log(filePath)
      wx.cloud.uploadFile({
        cloudPath: 'commentsImg/' + new Date().getTime() + fileName, //文件存储后的名字
        filePath: filePath, // 文件路径
      }).then(res => {
        // get resource ID
        console.log('上传成功', res.fileID)
        //将内容添加到数据库
        console.log('将添加的id：', app.globalData.openid)
        wx.cloud.callFunction({
          name: "addUserCom",
          data: {
            _openid: app.globalData.openid,
            userName: app.globalData.userName,
            portrait: app.globalData.portrait,
            comments: comments,
            cloudPath: res.fileID,
            updateTime: util.formatTime(new Date()),
            state: 1,
            submitTime: util.formatTime(new Date())
          },
          success: res => {
            console.log('Com Add result', res)
            that.setData({
              comments: '',
              tempFilePaths: [],
            })
            wx.showToast({
              title: '行，大家都知道了！',
            })
          },
          fail: res => {
            console.error('Com Add result', res)
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
    }
  },
})