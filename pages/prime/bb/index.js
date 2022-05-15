const texts = [
  '2021年11月底，我们相识！',
  '十二月份下旬见了第一次面，',
  '那一次见面之后我确定就喜欢你了。月底你又来找了我，',
  '好啊！这一下就彻底把我栓牢了！',
  '认识你到现在，我觉得对你已经算是了解一些了，',
  '你真的无敌特别好！很棒的傻狗！嘿嘿！',
  '我记得我对你说过的话！不会给你画饼的！',
  '我也记得你和我说过的话，嘿嘿',
  '还有你给我的那封信，我真的能看一遍哭一遍！',
  '很荣幸认识你！肖伟丽。',
  '相识100天快乐！我们会有更多的100天！',
  '认识你真的是我最最最快乐的事情了！'
]

Page({
  onShareAppMessage() {
    return {
      title: 'text',
      path: 'pages/getMiniProgramCode/index'
    }
  },

  data: {
    theme: 'light',
    text: '',
    canAdd: true,
    canRemove: false
  },
  extraLine: [],

  add() {
    this.extraLine.push(texts[this.extraLine.length % 12])
    this.setData({
      text: this.extraLine.join('\n'),
      canAdd: this.extraLine.length < 12,
      canRemove: this.extraLine.length > 0
    })
    setTimeout(() => {
      this.setData({
        scrollTop: 99999
      })
    }, 0)
  },
  remove() {
    if (this.extraLine.length > 0) {
      this.extraLine.pop()
      this.setData({
        text: this.extraLine.join('\n'),
        canAdd: this.extraLine.length < 12,
        canRemove: this.extraLine.length > 0,
      })
    }
    setTimeout(() => {
      this.setData({
        scrollTop: 99999
      })
    }, 0)
  },
  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }
  }
})
