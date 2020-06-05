import moment from 'moment'

/* eslint-disable no-undef */
// 是 N 天前
export const isNDaysAgo = (n, time) => {
  const nowTime = moment()
    .subtract(n, 'days')
    .format('YYYY-MM-DD')
  const timeFormat = moment(time).format('YYYY-MM-DD')
  return moment(nowTime).isAfter(timeFormat)
}


export const isThisYear = (_date) => {
  const firstDayOfYear = new Date('1/1/' + new Date().getFullYear())
  const thisYear = moment(firstDayOfYear).format('YYYY-MM-DD')
  const date = moment(_date).format('YYYY-MM-DD')
  return moment(date).isAfter(thisYear)
}
