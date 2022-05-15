// index.js
// const app = getApp()
// const { envList } = require('../../.eslintrc.js');

Page({
  data: {
    showUploadTip: false,
    powerList: [{
      title: '不知不觉我们相识就100天了！',
      tip: '我真的很喜欢你！嘿嘿（悄悄告诉你后面的箭头能点！）',
      showItem: false,
      item: [{
        title: 'see see！',
        page: 'seesee'
      },
       {
        title: 'b b',
        page: 'bb'
      },
    ]
    }, {
      title: '这里也是一个广告位2000',
      tip: '最近疫情原因。俺们发展慢了（这些都不行了 没解锁呢！）',
      showItem: false,
      item: [{
        title: '创建集合',
        page: 'createCollection'
      }, {
        title: '更新记录',
        page: 'updateRecord'
      }, {
        title: '查询记录',
        page: 'selectRecord'
      }, {
        title: '聚合操作',
        page: 'sumRecord'
      }]
    }, {
      title: '广告位3000',
      tip: '后面的数字都是编号',
      showItem: false,
      item: [{
        title: '上传文件',
        page: 'uploadFile'
      }]
    }, {
      title: '由于栏位有限，先暂定这几个4000',
      tip: '有什么想法可以联络客服',
      showItem: false,
      item: [{
        title: '部署服务',
        page: 'deployService'
      }]
    }],
    haveCreateCollection: false
  },

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList);
    } else {
      this.setData({
        powerList
      });
    }
  },

  // onChangeShowEnvChoose() {
  //   wx.showActionSheet({
  //     itemList: this.data.envList.map(i => i.alias),
  //     success: (res) => {
  //       this.onChangeSelectedEnv(res.tapIndex);
  //     },
  //     fail (res) {
  //       console.log(res.errMsg);
  //     }
  //   });
  // },

  // onChangeSelectedEnv(index) {
  //   if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
  //     return;
  //   }
  //   const powerList = this.data.powerList;
  //   powerList.forEach(i => {
  //     i.showItem = false;
  //   });
  //   this.setData({
  //     selectedEnv: this.data.envList[index],
  //     powerList,
  //     haveCreateCollection: false
  //   });
  // },

  jumpPage(e) {
    console.log(e.currentTarget.dataset.page)
    wx.navigateTo({
      url:`/pages/prime/${e.currentTarget.dataset.page}/index`,
    });
  },

  // onClickDatabase(powerList) {
  //   wx.showLoading({
  //     title: '',
  //   });
  //   wx.cloud.callFunction({
  //     name: 'quickstartFunctions',
  //     config: {
  //       env: this.data.selectedEnv.envId
  //     },
  //     data: {
  //       type: 'createCollection'
  //     }
  //   }).then((resp) => {
  //     if (resp.result.success) {
  //       this.setData({
  //         haveCreateCollection: true
  //       });
  //     }
  //     this.setData({
  //       powerList
  //     });
  //     wx.hideLoading();
  //   }).catch((e) => {
  //     console.log(e);
  //     this.setData({
  //       showUploadTip: true
  //     });
  //     wx.hideLoading();
  //   });
  // }
});
