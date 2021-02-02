<template>
  <el-popover
    placement="top-start"
    trigger="hover"
  >
    <div class="foreignuser">
      <p>
        {{ $t('from-Matataki-user') }}：
      </p>
      <userPlatformCard
        :card="card"
      />
    </div>
    <slot slot="reference" />
  </el-popover>
</template>

<script>
import userPlatformCard from '@/components/user/user_platform_card'

export default {
  components: {
    userPlatformCard
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.foreignuser {
  width: 350px;
  p {
    margin: 0;
  }
}

@media screen and (max-width: 413px) {
  .foreignuser {
    width: 250px;
  }
}
</style>
