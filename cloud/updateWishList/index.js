// 云函数入口文件
const cloud = require('wx-server-sdk')
//云函数初始化
cloud.init({})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  
  return await db.collection('wishList')
  .where({
    _id: event.selectId
  })
  .update({
    data: {
      state: event.state,
      updateTime: event.updateTime,
    }
  })
    
}