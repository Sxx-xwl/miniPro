// 云函数入口文件
const cloud = require('wx-server-sdk')
//云函数初始化
cloud.init({})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  
  return await db.collection('speechItemList')
  .where({
    _id: event.id
  })
  .update({
    data: {
      state: event.state,
      text: event.text,
      cloudPath: event.cloudPath,
      updateTime: event.updateTime,
    }
  })
    
}