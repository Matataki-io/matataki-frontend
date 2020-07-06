<template>
  <div>
    <!-- 持有的fan票 -->
    <holdTicket />
    <!-- 流动金 -->
    <holdliquidity />
  </div>
</template>

<script>
import holdliquidity from '@/components/holdliquidity/index.vue'
import holdTicket from '@/components/hold_ticket.vue'
export default {
  components: {
    holdliquidity,
    holdTicket
  }
}
</script>