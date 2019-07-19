<template>
  <div class="home" @click="addShow = false">
    <div class="head">
      <link rel="icon" type="image/png" sizes="32x32" href="./img/Andoromeda logo@2x.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="./img/Andoromeda logo.png" />
      <div class="add">
        <Button class="publish" @click.stop="addShow = !addShow">
          <Icon
            class="publish-icon"
            type="md-add"
            size="24"
            style="margin-top: -8px;margin-left: -12px;;line-height: 16px;"
          />
        </Button>
        <div v-show="addShow" class="add-menu">
          <a href="javascript:void(0);">搬运</a>
          <a
            href="javascript:void(0);"
            @click="$router.push({ name: 'Publish', params: { id: 'create' } })"
            >创作</a
          >
        </div>
      </div>
      <div class="titles">
        <h1 class="title">-SmartSignature-</h1>
        <h2 class="subtitle">投资好文，分享有收益！</h2>
        <Button class="title-button" @click="$router.push({ name: 'About' })">规则介绍</Button>
        <a href="https://t.me/smartsignature_io" target="_blank">
          <Button class="title-button">加入电报</Button>
        </a>
      </div>
      <MyBanner />
      <div class="head-bc"></div>
    </div>
    <ArticleRankings ref="ArticleRankings" />
  </div>
</template>

<script>
import MyBanner from './MyBanner.vue'
import ArticleRankings from './ArticlesRankings.vue'

export default {
  name: 'Home',
  components: { ArticleRankings, MyBanner },
  data() {
    return {
      visible1: false,
      actions1: [
        {
          text: 'English',
          onClick: () => console.log('action 1')
        },
        {
          text: '简体中文',
          onClick: () => console.log('action 2')
        },
        {
          text: '日本語',
          onClick: () => console.log('action 3')
        },
        {
          theme: 'error',
          text: '取消',
          onClick: () => console.log('action -1')
        }
      ],
      addShow: false // 显示新增菜单
    }
  },
  created() {
    document.title = '首页 - SmartSignature'
  },
  methods: {
    cancelCb(reason, event) {
      console.log(reason, event)
    }
  }
}
</script>

<style scoped lang="less">
.home {
  min-height: 100%;
}
.head {
  color: #fff;
  padding-top: 10px;
  text-align: center;
  align-items: center;
  vertical-align: middle;
  position: relative;
  &-bc {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 55px;
    left: 0;
    z-index: -1;
    background: #478970;
  }
}
.titles {
  margin: 40px auto 24px;
}
h1.title {
  font-size: 32px;
  /* padding-top: 101px; */
  font-weight: normal;
  width: 100%;
  color: rgba(255, 255, 255, 1);
  line-height: 27px;
  letter-spacing: 2px;
}
h2.subtitle {
  font-size: 16px;
  font-weight: 300;
  color: rgba(255, 255, 255, 1);
  line-height: 18px;
  letter-spacing: 1px;
  margin-top: 6px;
  margin: 6px 0 18px;
}
.title-button {
  margin: 0 4px;
  border-radius: 3px;
  border: none;
}
button.publish {
  background: #478970;
  color: rgb(255, 255, 255);
  float: right;
  width: 27px;
  height: 27px;
  margin-right: 14px;
}
.MyBanner {
  margin-top: 28px;
}

/* 添加 */
.add {
  position: relative;
}
.add::after {
  display: block;
  content: '';
  width: 0;
  height: 0;
  clear: both;
}
.add .add-menu {
  position: absolute;
  top: 40px;
  right: 14px;
  background-color: RGBA(52, 98, 83, 1);
  border-radius: 3px;
}
.add .add-menu::after {
  display: block;
  content: '';
  width: 0;
  height: 0;
  position: absolute;
  top: -14px;
  right: 14px;
  border-width: 7px;
  border-style: solid;
  border-color: transparent transparent RGBA(52, 98, 83, 1) transparent;
}
.add .add-menu a {
  display: block;
  padding: 8px 12px;
  margin: 0 12px;
  text-decoration: none;
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  letter-spacing: 1px;
}
.add .add-menu a:nth-of-type(1) {
  border-bottom: 1px solid rgba(133, 255, 223, 0.18);
}
</style>
