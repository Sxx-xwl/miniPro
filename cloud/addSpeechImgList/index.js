// 云函数入口文件
const cloud = require('wx-server-sdk')
//云函数初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  
  return await db.collection('speechImgList')
  .add({
    data:{
      id: event.id,
      userName: event.userName,
      cloudPath: event.cloudPath,
      imgName: event.imgName,
      state: event.state,
      updateTime: event.updateTime,
      submitTime: event.submitTime,
      showTime: event.showTime,
    }
  })
}
