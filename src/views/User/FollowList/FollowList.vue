<template>
  <div class="mw draftbox">
    <BaseHeader :pageinfo="{ title: '' }" :has-bottom-border-line="true" />
    <!-- tabs.less -->
    <div class="tabs">
      <div
        v-for="(item, index) in tabsData"
        :key="index"
        class="tabs-item"
        :class="activeIndex === index && 'active'"
        @click="toggleTabs(index)"
      >
        {{ item.label }}
      </div>
    </div>

    <BasePull
      v-for="(item, index) in tabsData"
      v-show="activeIndex === index"
      :key="index"
      class="draftbox-list"
      :loading-text="item.loadingText"
      :params="item.params"
      :api-url="item.apiUrl"
      :active-index="activeIndex"
      :auto-request-time="item.autoRequestTime"
      :need-access-token="true"
      :now-index="index"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      @getListData="getListData"
    >
      <list
        v-for="(itemList, indexList) in item.articles"
        :key="indexList"
        :list="itemList"
        :index="index"
        :index-list="indexList"
        :owner-id="id"
        @followOrUnfollowUser="followOrUnfollowUser"
      />
    </BasePull>
    <BaseModalForSignIn
      :show-modal="showSignInModal"
      @changeInfo="stats => (showSignInModal = stats)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { error } from 'util'
import list from './list.vue'

export default {
  name: 'DeaftBox',
  components: { list },
  props: ['id', 'listtype'],
  data() {
    return {
      tabsData: [
        {
          label: '关注',
          params: { uid: this.id },
          apiUrl: 'followsList',
          articles: [],
          loadingText: '没有关注',
          autoRequestTime: 0
        },
        {
          label: '粉丝',
          params: { uid: this.id },
          apiUrl: 'fansList',
          articles: [],
          loadingText: '没有粉丝',
          autoRequestTime: 0
        }
      ],
      activeIndex: 0,
      activeIndexName: this.listtype,
      showSignInModal: false
    }
  },
  computed: {
    ...mapGetters(['isLogined'])
  },
  created() {
    if (this.activeIndexName === '关注') this.activeIndex = 0
    else if (this.activeIndexName === '粉丝') this.activeIndex = 1
    else this.activeIndex = 0
  },
  methods: {
    toggleTabs(i) {
      this.activeIndex = i

      // 判断是否自动刷新请求数据
      if (this.tabsData[i].autoRequestTime === 0 && this.tabsData[i].articles.length === 0)
        this.tabsData[i].autoRequestTime = Date.now()
    },
    getListData(res) {
      this.tabsData[res.index].articles = res.list
    },
    async followOrUnfollowUser({ id, type, index, indexList }) {
      // console.log(id, type, index, indexList);
      if (!this.isLogined) {
        this.showSignInModal = true
        return
      }
      const message = type === 1 ? '关注' : '取消关注'
      try {
        let res = null
        if (type === 1) res = await this.$backendAPI.follow({ id })
        else res = await this.$backendAPI.unfollow({ id })
        if (res.status === 200 && res.data.code === 0) {
          this.$toast.success({ duration: 1000, message: `${message}成功` })
          this.followed = type === 1
          let isFollow = this.tabsData[index].articles[indexList].is_follow
          this.tabsData[index].articles[indexList].is_follow = !isFollow
        } else {
          throw error(`${message}失败`)
        }
        this.$toast.success({ duration: 1000, message: `${message}成功` })
        this.followed = type === 1
      } catch (error) {
        this.$toast.fail({ duration: 1000, message: `${message}失败` })
        this.showSignInModal = this.$errorHandling.isNoToken(error)
      }
    }
  }
}
</script>
<style scoped lang="less">
.draftbox {
  padding-bottom: 20px;
  padding-top: 45px;
}
.draftbox-list {
  margin: 10px 0 0;
}
</style>
