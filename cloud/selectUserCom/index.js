// 云函数入口文件
const cloud = require('wx-server-sdk')
//云函数初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    return await db.collection("wxUser-Comments")
      //倒序
      .orderBy('submitTime', 'desc')
      .get({
        success: function (res) {
          return res
        }
      });
  } catch (e) {
    console.error(e);
  }
}