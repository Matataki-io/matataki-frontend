<template>
  <div class="container-padding">
    <router-link
      v-for="(tag, index) in tags"
      :key="index"
      :class="$route.name === tag.url && 'active'"
      :to="{name: tag.url, params: {id: $route.params.id, displayAngle }}"
      replace
    >
      {{ tag.label }}
    </router-link>
  </div>
</template>
<script>

export default {
  components: {
  },
  props: {
    displayAngle: {
      type: String,
      default: 'client'
    }
  },
  data() {
    return {
      tags: [
        {
          label: '详情',
          url: 'token-id'
        },
        {
          label: '圈子',
          url: 'token-id-circle'
        }
      ]
    }
  },
  computed: {
  },
  watch: {
  },
  // created() {},
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.container-padding {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding-top: 40px;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  a {
    font-size: 20px;
    font-weight: 600;
    color: #B2B2B2;
    line-height: 28px;
    margin-right: 40px;
    &.active {
      color: black;
    }
    &:last-child{
      margin-right: 0;
    }
  }
}

// <600
@media screen and (max-width: 600px) {
  .container-padding a {
    font-size: 18px;
  }
}
</style>
