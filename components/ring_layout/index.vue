<template>
  <div class="ring">
    <g-header />
    <div class="ring-logo">
      <router-link :to="{name: 'token-id', params: { id: $route.params.id }}">
        <img v-if="logo" :src="logoSrc" :alt="symbol">
      </router-link>
    </div>
    <router-link :to="{name: 'token-id', params: { id: $route.params.id }}">
      <p class="ring-logo-title">
        <i class="el-icon-arrow-right disappear" />
        {{ symbol }}{{ name ? (name) : '' }}
        <i class="el-icon-arrow-right" />
      </p>
    </router-link>

    <div class="ring-head">
      <div class="ring-title">
        <router-link v-for="(tag, index) in tagList" :key="index" :to="{name: tag.url, params: { id: $route.params.id }}" :class="$route.name === tag.url && 'active'">
          {{ tag.label }}
        </router-link>
        <!-- <router-link :to="{name: 'ring'}">只看创始人</router-link> -->
      </div>
      <slot name="sort" />
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  data() {
    return {
      logo: '',
      symbol: '',
      name: '',
      tagList: [
        {
          label: '全部内容',
          url: 'ring-id'
        },
        {
          label: '只看创始人',
          url: 'ring-id-founder'
        }
      ]
    }
  },
  computed: {
    logoSrc() {
      return this.logo ? this.$API.getImg(this.logo) : ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { id } = this.$route.params
      if (!id) return this.$router.go(-1)
      this.$API.minetokenId(id).then(res => {
        if (res.code === 0 && res.data.token) {
          this.logo = res.data.token.logo
          this.symbol = res.data.token.symbol
          this.name = res.data.token.name
        } else {
          console.log('获取fan票信息失败')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ring {
  background-color: #F7F7F7;
  padding-top: 60px;
  min-height: 100%;
  &-logo {
    width: 128px;
    height: 128px;
    border-radius: 10px;
    background-color: #f1f1f1;
    border: 1px solid #f1f1f1;
    box-sizing: border-box;
    overflow: hidden;
    margin: 40px auto 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-logo-title {
    margin: 10px 0 40px;
    text-align: center;
    font-size:20px;
    font-weight:600;
    color:rgba(0,0,0,1);
    line-height:28px;
    i {
      font-weight:600;
      &.disappear {
        color: #00000000;
      }
    }
  }

  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    max-width: 800px;
    margin: 10px auto 20px;
    .ring-title {
      display: flex;
      align-items: center;
      a {
        color:rgba(178,178,178,1);
        font-size:20px;
        font-weight:600;
        line-height:28px;
        &:nth-child(1) {
          margin-right: 20px;
        }
        &.active {
          color: #000;
        }
      }
    }
  }
}
</style>
