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
