<template>
  <time>{{ time }}</time>
</template>
<script>
import moment from 'moment'
import { isNDaysAgo } from '@/utils/momentFun'
export default {
  name: 'NotificationTime',
  props: {
    timestamp: { type: Number, required: true }
  },
  computed: {
    time() {
      const time = moment.unix(this.timestamp)
      return isNDaysAgo(60, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    }
  }
}
</script>
