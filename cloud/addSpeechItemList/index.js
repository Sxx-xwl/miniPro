// 云函数入口文件
const cloud = require('wx-server-sdk')
//云函数初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  
  return await db.collection('speechItemList')
  .add({
    data:{
      userName: event.userName,
      cloudPath: event.cloudPath,
      text: event.text,
      state: event.state,
      mark: event.mark,
      num: event.num,
      updateTime: event.updateTime,
      submitTime: event.submitTime,
      openid: event.openid,
    }
  })
}
