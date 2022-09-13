//格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//计算时间差  dateTime 目标时间
function getTimeDifference(dateTime) {
  //计算现在与目标时间的差值(毫秒)
  let time1 = new Date(dateTime).getTime();
  let time2 = new Date().getTime();
  let mss = time2 - time1;

  //格式化时间差为 天时分秒
  let days = parseInt(mss / (1000 * 60 * 60 * 24));
  let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minute = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = parseInt((mss % (1000 * 60)) / (1000));

  return days + '天' + hours + '小时' + minute + '分' + seconds + '秒啦！'
}
//计算时间差  dateTime 目标时间 倒计时
function getTimeDifferenceRe(dateTime) {
  //计算现在与目标时间的差值(毫秒)
  let time1 = new Date(dateTime).getTime();
  let time2 = new Date().getTime();
  let mss = time1 - time2;

  //格式化时间差为 天时分秒
  let days = parseInt(mss / (1000 * 60 * 60 * 24));
  let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minute = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = parseInt((mss % (1000 * 60)) / (1000));

  return days + '天' + hours + '小时' + minute + '分' + seconds + '秒啦！'
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  getTimeDifference,
  getTimeDifferenceRe,
}