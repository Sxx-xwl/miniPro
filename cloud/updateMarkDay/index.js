// 云函数入口文件
const cloud = require('wx-server-sdk')
//云函数初始化
cloud.init({})
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  
  return await db.collection('markDay')
  .where(_.and([{
    markDate: _.lte(event.time)
  }, {
    state: "1"
  }]))
  .update({
    data: {
      state: '0',
    }
  })
    
}