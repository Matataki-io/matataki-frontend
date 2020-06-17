<template>
  <time>{{ time }}</time>
</template>
<script>
import { isNDaysAgo } from '@/utils/momentFun'
export default {
  name: 'NotificationTime',
  props: {
    timestamp: { type: Number, required: true }
  },
  computed: {
    time() {
      const time = this.moment.unix(this.timestamp)
      return isNDaysAgo(60, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    }
  }
}
</script>
