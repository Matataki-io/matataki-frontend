import moment from 'moment'

// 判断是否为空数组
export const isEmptyArray = arr => Array.isArray(arr) && arr.length !== 0
// 睡眠方法 可以不用在setTimeout里面写逻辑
export const sleep = time => new Promise(resolve => setTimeout(resolve, time))

// 是 N 天前
export const isNDaysAgo = (n, time) => {
  const nowTime = moment()
    .subtract(n, 'days')
    .format('YYYY-MM-DD')
  const timeFormat = moment(time).format('YYYY-MM-DD')
  return moment(nowTime).isAfter(timeFormat)
}

export const isNull = v => v === '' || v === null || v === undefined
