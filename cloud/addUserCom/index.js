// 云函数入口文件
const cloud = require('wx-server-sdk')
//云函数初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  
  return await db.collection('wxUser-Comments')
  .add({
    data:{
      _openid: event._openid,
      userName: event.userName,
      portrait: event.portrait,
      comments: event.comments,
      submitTime: event.submitTime,
      updateTime: event.updateTime
    }
  })

}