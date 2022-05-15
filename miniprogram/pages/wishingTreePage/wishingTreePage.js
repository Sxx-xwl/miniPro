// pages/wishingTreePage/wishingTreePage.js
var app = getApp();
let that = '';
const util = require('../../../utils/util.js');
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notifyotify/notify';

Page({
  //页面的初始数据
  data: {
    choose: 0,
    wishList: [],
    wishList1: [],
    treeImg: app.getImgSrc('圣诞树.png'),
    complete: app.getImgSrc('礼物.png'),
    wishPoolImg: app.getImgSrc('心愿单.png'),
    wishPoolImg1: app.getImgSrc('心愿单1.png'),
    wishImg: app.getImgSrc('心愿.png'),
    wishImg1: app.getImgSrc('心愿1.png'),
    wishlocal: [
      [12, 40, 1],
      [20, 39, -5],
      [23, 25, 7],
      [25, 53, -3],
      [28, 35, 0],
      [32, 20, 7],
      [32, 49, 1],
      [37, 33, -6],
      [38, 60, 5],
      [40, 17, -2],
      [43, 48, -8],
      [44, 28, 2],
      [49, 13, 7],
      [49, 59, -4],
      [50, 40, 7],
      [53, 26, 0],
      [55, 72, 4],
      [58, 10, 2],
      [58, 40, 5],
      [60, 24, -2],
      [60, 56, -4],
    ],
    show: false,
    show1: false,
    show2: false,
    nameValue: '',
    priceValue: '',
    fileList: [],
    tempFilePaths: [],
    wishIcon: '',
    selectId: '',
    selectName: '',
    selectPrice: '',
    selectImg: '',
    openId: '',
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    that = this
    //刷新页面
    // wx.startPullDownRefresh()
    that.showWisgLsit()
    // 主要通知
    Notify({
      type: 'primary',
      message: '点按礼物查看，长按礼物可以查看或者删除，点击树干添加愿望！',
      duration: 6000,
    });
  },
  //添加愿望
  addbtn(e) {
    that = this
    that.setData({
      wishIcon: app.globalData.wishIcon,
    })
    let nameValue = that.data.nameValue
    let priceValue = that.data.priceValue
    let tempFilePaths = that.data.tempFilePaths

    if (!nameValue.replace(/\s+/g, '').length != 0) {
      wx.showToast({
        title: '大胆填名称！',
        icon: 'error'
      })
    } else if (!priceValue.replace(/\s+/g, '').length != 0) {
      wx.showToast({
        title: '放心写价格！',
        icon: 'error'
      })
    } else if (!tempFilePaths.replace(/\s+/g, '').length != 0) {
      wx.showToast({
        title: '传个图片！',
        icon: 'error'
      })
    } else {
      // console.log('nameValue', nameValue)
      // console.log('priceValue', priceValue)
      that.uploadFile(tempFilePaths[0], nameValue + '.png')
      console.log('愿望上传了')
    }
  },
  //获取名称输入框的值
  onChange1(event) {
    that = this

    // event.detail 为当前输入的值
    // console.log(event.detail);
    let nameValue = event.detail
    that.setData({
      nameValue: nameValue
    })
  },
  //获取价格输入框的值
  onChange2(event) {
    that = this

    // event.detail 为当前输入的值
    let priceValue = event.detail
    that.setData({
      priceValue: priceValue
    })
  },
  //展示弹出层
  showPopup() {
    that = this
    if (app.globalData.openid != 'oZLHV4lqw6nzzt_1Z7I1A8PgR8-s' && app.globalData.openid != 'oZLHV4n8chsAEruzEztUEUaCXB_Q') {
      wx.showToast({
        title: '你没权限添加哦',
        icon: 'error',
      })
    } else {
      that.setData({
        show: true
      });
    }
  },
  //隐藏弹出层
  onClose() {
    this.setData({
      show: false
    });
  },
  //上传图片
  chooseImg(event) {
    let nameValue = that.data.nameValue
    let priceValue = that.data.priceValue

    if (nameValue == '' || nameValue == null) {
      wx.showToast({
        title: '大胆填名称！',
        icon: 'error'
      })
      console.log('未命名')
      return
    } else if (priceValue == '' || priceValue == null) {
      wx.showToast({
        title: '放心写价格！',
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
    let nameValue = that.data.nameValue
    let priceValue = that.data.priceValue
    let wishIcon = that.data.wishIcon
    console.log(filePath)
    wx.cloud.uploadFile({
      cloudPath: fileName, //文件存储后的名字
      filePath: filePath, // 文件路径
    }).then(res => {
      // get resource ID
      console.log('上传成功', res.fileID)
      //将内容添加到数据库
      console.log('将添加的id：', app.globalData.openid)
      wx.cloud.callFunction({
        name: "addWishList",
        data: {
          id: app.globalData.openid,
          userName: app.globalData.userName,
          nameValue: nameValue,
          priceValue: priceValue,
          cloudPath: res.fileID,
          updateTime: util.formatTime(new Date()),
          wishIcon: wishIcon,
          state: 1,
          submitTime: util.formatTime(new Date())
        },
        success: res => {
          console.log('WL Add result', res)
          wx.showToast({
            title: 'OK 静候佳音！',
          })
          that.showWisgLsit()
          //清空输入框
          that.setData({
            nameValue: '',
            priceValue: '',
            tempFilePaths: '',
          })
        },
        fail: res => {
          console.error('WL Add result', res)
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
  //获取愿望列表
  showWisgLsit() {
    that = this
    wx.cloud.callFunction({
      name: "selectWishList",
      success: res => {
        console.log('愿望请求成功', res.result.data)
        that.setData({
          wishList: res.result.data,
          openId: app.globalData.openid,
        })
        console.log('openid:', that.data.openId)
      },
      fail: err => {
        console.error('愿望请求失败', err)
      }
    })
  },
  //获取已实现愿望列表
  showWisgLsit1() {
    that = this
    wx.cloud.database().collection('wishList')
      .where({
        state: 0
      })
      .get({
        success(res) {
          console.log('这些已经实现了', res.data)
          that.setData({
            wishList1: res.data
          })
          // console.log('data：', that.data.selectName)
        }
      });
  },
  //显示实现愿望窗口
  onClickShow(e) {
    that = this
    if (app.globalData.openid != 'oZLHV4lqw6nzzt_1Z7I1A8PgR8-s' && app.globalData.openid != 'oZLHV4n8chsAEruzEztUEUaCXB_Q') {
      wx.showToast({
        title: '你没权限查看哦',
        icon: 'error',
      })
    } else {
      that.setData({
        show1: true,
        selectId: e.currentTarget.dataset.id
      });
      // console.log('你点的是:', that.data.selectId)
      wx.cloud.database().collection('wishList')
        .where({
          _id: that.data.selectId
        })
        .get({
          success(res) {
            console.log('查到了', res)
            that.setData({
              selectName: res.data[0].nameValue,
              selectPrice: res.data[0].priceValue,
              selectImg: res.data[0].cloudPath,
            })
            console.log('data：', that.data.selectName)
          }
        });
    }
  },
  //隐藏窗口
  onClickHide() {
    this.setData({
      show1: false,
      show2: false
    });
  },
  //显示删除愿望窗口
  showDelete(e) {
    // console.log('b1')
    that = this
    console.log('我的权限：',app.globalData.openid)
    if (app.globalData.openid != 'oZLHV4lqw6nzzt_1Z7I1A8PgR8-s' && app.globalData.openid != 'oZLHV4n8chsAEruzEztUEUaCXB_Q') {
      wx.showToast({
        title: '你没权限删除哦',
        icon: 'error',
      })
    } else {
      that.setData({
        show2: true,
        selectId: e.currentTarget.dataset.id
      });
      // console.log('你点的是:', that.data.selectId)
      wx.cloud.database().collection('wishList')
        .where({
          _id: that.data.selectId
        })
        .get({
          success(res) {
            console.log('查到了', res)
            that.setData({
              selectName: res.data[0].nameValue,
              selectPrice: res.data[0].priceValue,
              selectImg: res.data[0].cloudPath,
            })
            console.log('data：', that.data.selectName)
          }
        });
    }
  },
  //实现愿望
  check() {
    that = this
    console.log("1")
    Dialog.confirm({
        context: this,
        title: '实现愿望',
        message: '这个愿望已经实现了是吗？',
      })
      .then((res) => {

        wx.cloud.callFunction({
          name: "updateWishList",
          data: {
            selectId: that.data.selectId,
            state: 0,
            updateTime: util.formatTime(new Date())
          },
          success: res => {
            console.log('愿望实现成功', res.result)
            that.setData({
              wishList: res.result.data
            })
            that.showWisgLsit()
            wx.showToast({
              title: '太好咯！',
            })
            that.onClickHide()
          },
          fail: err => {
            console.error('愿望实现失败', err)
          }
        })
      })
      .catch((err) => {
        wx.showToast({
          title: '会实现的！',
          icon: 'success'
        })
      })
  },
  //删除愿望
  delete() {
    that = this
    console.log("delete")
    Dialog.confirm({
        context: this,
        title: '删除愿望',
        message: '这个愿望不想要了是吗？',
      })
      .then((res) => {
        wx.cloud.callFunction({
          name: "updateWishList",
          data: {
            selectId: that.data.selectId,
            state: 2,
            updateTime: util.formatTime(new Date())
          },
          success: res => {
            console.log('愿望删除成功', res.result)
            that.setData({
              wishList: res.result.data
            })
            that.showWisgLsit()
            wx.showToast({
              title: '许个新的吧！',
            })
            that.onClickHide()
          },
          fail: err => {
            console.error('愿望实现失败', err)
          }
        })
      })
      .catch((err) => {
        wx.showToast({
          title: '会实现的！',
          icon: 'success'
        })
      })
  },
  //底部心愿按钮
  addWish() {
    that = this
    that.setData({
      choose: 0
    })
  },
  //底部已实现按钮
  completeWish() {
    that = this
    if (app.globalData.openid != 'oZLHV4lqw6nzzt_1Z7I1A8PgR8-s' && app.globalData.openid != 'oZLHV4n8chsAEruzEztUEUaCXB_Q') {
      wx.showToast({
        title: '这可不能看哦',
        icon: 'error',
      })
    } else {
      that.showWisgLsit1()
      that.setData({
        choose: 1
      })
    }
  },
})