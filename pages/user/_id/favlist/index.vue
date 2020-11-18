
<template>
  <userPage>
    <div id="page-fav" slot="list" class="wrapper">
      <div class="col-full">
        <div class="fav-sidenav">
          <div class="nav-container fav-container">
            <div class="favlist-title">
              <p>我的创建</p>
              <!-- <i class="icon icon-arrow arrow-transform" /> -->
            </div>
            <div style="display: block">
              <div
                id="fav-createdList-container"
                class="be-scrollbar fav-list-container ps"
              >
                <div class="nav-title nav-add" @click="createFavModal = true">
                  <i class="el-icon-circle-plus fav-add-icon" />
                  <span class="text">新建收藏夹</span>
                </div>
                <!-- <div fid="61280084" class="fav-item cur">
                  <span class="iconfont icon-bodan" /><a
                    href="/94919784/favlist?fid=61280084"
                    class="text router-link-exact-active router-link-active"
                    title="默认收藏夹"
                  >默认收藏夹</a><span class="num">14</span>
                  <div class="be-dropdown">
                    <div class="be-dropdown-trigger">
                      <i title="更多操作" class="iconfont icon-ic_more" />
                    </div>
                    <ul
                      class="be-dropdown-menu menu-align-"
                      style="
                        left: 164px;
                        top: 459px;
                        transform-origin: center top;
                        display: none;
                      "
                    >
                      <li class="be-dropdown-item">
                        编辑信息
                      </li>
                    </ul>
                  </div>
                </div> -->
                <ul class="fav-list">
                  <li
                    v-for="(item, i) in favListData"
                    :key="i"
                    class="fav-item"
                    :class="$route.query.fid === item.id && 'cur'"
                    @click="favPost(item.id)"
                  >
                    <router-link
                      :to="{
                        name: 'user-id-favlist',
                        params: { id: $route.params.id },
                        query: { fid: item.id },
                      }"
                      class="text"
                      :title="item.name"
                    >
                      <svg-icon
                        v-if="Number(item.status) === 0"
                        icon-class="fav"
                        class="fav-icon"
                      />
                      <svg-icon v-else icon-class="fav-lock" class="fav-icon" />
                      {{ item.name }}
                    </router-link>
                    <span class="num">{{ item.count }}</span>
                    <el-dropdown @command="handleCommand">
                      <div class="fav-more">
                        <svg-icon icon-class="fav-more" class="fav-more-icon" />
                      </div>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="{ key: 'edit', val: item }">
                          编辑
                        </el-dropdown-item>
                        <el-dropdown-item
                          :command="{ key: 'delete', val: item }"
                        >
                          删除
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="fav-main section">
          <div v-if="!isEmpty(favPostData)" class="favList-info">
            <div class="favInfo-box">
              <div class="favInfo-details">
                <p class="fav-name">{{ favPostData.info.name || "" }}</p>
                <p class="fav-brief">{{ favPostData.info.brief || "" }}</p>
                <div class="fav-meta">
                  <span
                    class="fav-up-name"
                  >创建者：{{
                    favPostData.info.nickname ||
                      favPostData.info.username ||
                      ""
                  }}</span>
                </div>
                <div class="fav-meta">
                  <span>{{ favPostData.count || 0 }}个内容</span><span class="dot">·</span><span>{{
                    favPostData.info.status === 0 ? "公开" : "私密" || ""
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <ul v-if="!isEmpty(favPostData)" class="fav-post-list">
            <li v-for="(item, i) in favPostData.list" :key="i">
              <router-link :to="{ name: 'p-id', params: { id: item.pid } }">
                <p class="fav-title">{{ item.title }}</p>
                <div class="fav-content">
                  <div v-if="item.cover" class="fav-cover">
                    <img
                      :src="postCover(item.cover)"
                      alt="cover"
                      aria-label="cover"
                    >
                  </div>
                  <p class="fav-shortcontent">{{ item.short_content }}</p>
                </div>
                <p class="fav-time">收藏于：{{ time(item.create_time) }}</p>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <createFav v-model="createFavModal" />
      <editFav v-model="editFavModal" :form="editFavPropsFrom" />
    </div>
  </userPage>
</template>

<script>
import userPage from '@/components/user/user_page.vue'
// import userPagination from '@/components/user/user_pagination.vue'
// import articleCardListNew from '@/components/article_card_list_new/index.vue'
import { extractChar } from '@/utils/reg'
import { mapGetters } from 'vuex'
import createFav from '@/components/fav/create'
import editFav from '@/components/fav/edit'
import { isEmpty } from 'lodash'
import { isNDaysAgo } from '@/utils/momentFun'

export default {
  components: {
    userPage,
    // userPagination,
    // articleCardListNew,
    createFav,
    editFav,
  },
  head() {
    return {
      title: `${this.userData.nickname || this.userData.username}的个人主页`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${this.userData.introduction}`,
        },
        /* <!--  Meta for Twitter Card --> */
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          property: 'twitter:card',
          content: 'summary',
        },
        {
          hid: 'twitter:site',
          name: 'twitter:site',
          property: 'twitter:site',
          content: '@Andoromeda',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          property: 'twitter:title',
          content: `${
            this.userData.nickname || this.userData.username
          }的个人主页`,
        },
        {
          hid: 'twitter:description',
          name: 'description',
          property: 'twitter:description',
          content: `${this.userData.introduction}`,
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          property: 'twitter:url',
          content: `${process.env.VUE_APP_PC_URL}/user/${this.$route.params.id}`,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          property: 'twitter:image',
          content: this.$API.getImg(this.userData.avatar),
        },
        /* <!--  Meta for OpenGraph --> */
        {
          hid: 'og:site_name',
          name: 'og:site_name',
          property: 'og:site_name',
          content: '瞬MATATAKI',
        },
        {
          hid: 'og:title',
          name: 'og:title',
          property: 'og:title',
          content: `${
            this.userData.nickname || this.userData.username
          }的个人主页`,
        },
        {
          hid: 'og:type',
          name: 'og:type',
          property: 'og:type',
          content: 'article',
        },
        {
          hid: 'og:url',
          name: 'og:url',
          property: 'og:url',
          content: `${process.env.VUE_APP_PC_URL}/user/${this.$route.params.id}`,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          property: 'og:image',
          content: this.$API.getImg(this.userData.avatar),
        },
        {
          hid: 'og:description',
          name: 'description',
          property: 'og:description',
          content: `${this.userData.introduction}`,
        },
        /* end */
      ],
    }
  },
  data() {
    return {
      createFavModal: false, // 创建收藏夹
      editFavModal: false, // 编辑收藏夹
      editFavPropsFrom: Object.create(null), // 编辑收藏夹数据
      favListData: [],
      favPostData: Object.create(null),
    }
  },
  computed: {
    ...mapGetters(['isMe']),
  },
  async asyncData({ $axios, route, req }) {
    // 获取cookie token
    let accessToekn = ''
    // 请检查您是否在服务器端
    if (process.server) {
      const cookie = req && req.headers.cookie ? req.headers.cookie : ''
      const token = extractChar(cookie, 'ACCESS_TOKEN=', ';')
      accessToekn = token ? token[0] : ''
    }
    const res = await $axios({
      url: `/user/${route.params.id}`,
      methods: 'get',
      headers: { 'x-access-token': accessToekn },
    })
    if (res.code === 0) {
      return {
        userData: res.data || Object.create(null),
      }
    } else {
      console.error(res.message)
    }
  },
  created() {
    if (process.browser) {
      this.setWeChatShare()
    }
  },
  mounted() {
    this.favList()
  },
  methods: {
    isEmpty(a) {
      return isEmpty(a)
    },
    // 文章封面
    postCover(src) {
      return src ? this.$ossProcess(src) : ''
    },
    // 收藏时间
    time(t) {
      if (!t) return ''
      const time = this.moment(t)
      return isNDaysAgo(2, time)
        ? time.format('YYYY-MM-DD HH:mm')
        : time.fromNow()
    },
    // 设置微信分享
    setWeChatShare() {
      this.$wechatShare({
        title: `${this.userData.nickname || this.userData.username}的个人主页`,
        desc: this.userData.introduction || '暂无',
        imgUrl: this.userData.avatar
          ? this.$ossProcess(this.userData.avatar)
          : '',
      })
    },
    // 获取自己的收藏夹列表
    async favList() {
      const userId = this.$route.params.id
      if (!userId) {
        return
      }
      const params = {
        userId: userId,
      }
      const res = await this.$utils.factoryRequest(this.$API.favList(params))
      if (res) {
        console.log('res', res)
        this.favListData = res.data.list
        if (res.data.list.length) {
          this.favPost(res.data.list[0].id)
        }
      } else {
        //
      }
    },
    // 获取自己的收藏夹列表
    async favPost(fid) {
      const userId = this.$route.params.id
      if (!userId) {
        return
      }
      const params = {
        userId: userId,
        fid: fid,
      }
      const res = await this.$utils.factoryRequest(this.$API.favPost(params))
      if (res) {
        console.log('res', res)
        this.favPostData = res.data
      } else {
        //
      }
    },
    // 收藏夹多选操作
    async handleCommand(command) {
      console.log('comm', command)
      // 删除
      if (command.key === 'delete') {
        const res = await this.$utils.factoryRequest(
          this.$API.favDelete({ fid: command.val.id })
        )
        if (res) {
          console.log('res', res)
          this.favList()
        } else {
          //
        }
      } else if (command.key === 'edit') {
        // 编辑
        this.editFavPropsFrom = {
          fid: command.val.id,
          name: command.val.name,
          brief: command.val.brief,
          status: Number(command.val.status) === 0,
        }
        this.editFavModal = true
      }
    },
  },
}
</script>

<style scoped>
.pagination {
  padding: 40px 5px;
}
.view-all {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>

<style lang="less" scoped>
.wrapper {
  width: 1100px;
  margin: 0 auto 60px;
  position: relative;
  .col-full {
    // min-height: 500px;
    background: #fff;
    box-shadow: 0 0 0 1px #eee;
    border-radius: 4px;
    padding: 0;
    .clearfix();
  }
}

// common
.fav-sidenav {
  .favlist-title,
  .watch-later {
    height: 54px;
    padding-left: 19px;
    line-height: 54px;
    font-size: 14px;
    color: #99a2aa;
  }
  .text {
    display: inline-block;
    line-height: 44px;
    width: 86px;
    margin-right: 5px;
    font-size: 14px;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
}
#page-fav .fav-sidenav .fav-item.cur .be-dropdown-trigger .icon-ic_more,
#page-fav .fav-sidenav .fav-item.cur .iconfont,
#page-fav .fav-sidenav .fav-item.cur .num,
#page-fav .fav-sidenav .fav-item.cur .text {
  color: #fff;
}
#page-fav {
  .fav-sidenav {
    position: relative;
    float: left;
    width: 180px;
    margin-right: -1px;
    font-size: 14px;
    color: #222;
    border-right: 1px solid #eee;
    box-sizing: border-box;

    .favlist-title {
      padding-right: 11px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -ms-flex-align: center;
      align-items: center;
      cursor: pointer;
    }

    .fav-list-container {
      position: relative;
      max-height: 420px;
      margin-bottom: 10px;
      overflow: auto;
      overflow-anchor: none;
      touch-action: auto;
    }
    .nav-title.nav-add {
      cursor: pointer;
    }
    .nav-title {
      position: relative;
      height: 44px;
      padding-left: 20px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      .text {
        display: block;
        line-height: 24px;
        color: #222;
      }
    }

    .fav-item {
      position: relative;
      padding-left: 20px;
      transition: background-color 0.3s ease;
      white-space: nowrap;
      font-size: 0;
      overflow: hidden;
      display: flex;
      align-items: center;
      &:hover {
        background-color: #f4f5f7;
        .num {
          display: none;
        }
        .fav-more {
          display: flex;
        }
      }
      a {
        color: inherit;
        text-decoration: none;
        transition: color 0.2s ease, background-color 0.2s ease;
      }

      &.cur {
        background-color: #542DE0;
        .fav-more-icon,
        .fav-icon {
          color: #fff;
        }
      }
    }
    .num {
      display: inline-block;
      width: 32px;
      font-size: 12px;
      color: #99a2aa;
      vertical-align: middle;
      text-align: center;
    }

    .fav-add-icon {
      width: 30px;
      height: 30px;
      color: #999;
      font-size: 22px;
      line-height: 30px;
    }
    .fav-more-icon {
      color: #999;
    }
    .fav-icon {
      color: #999;
      font-size: 22px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
}

.nav-container {
  border-bottom: 1px solid #eee;
}

#page-fav {
  .fav-main {
    float: left;
    width: 920px;
    min-height: 600px;
    border-left: 1px solid #eee;
    .favList-info {
      padding: 20px 0;
      margin: 0 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #e5e9ef;
    }
  }
}

.favInfo-box .favInfo-details .fav-name {
  display: block;
  font-size: 14px;
  color: #212121;
  line-height: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0;
  margin: 0;
  font-weight: bold;
}
.favInfo-box .favInfo-details .fav-brief {
  display: inline-block;
  font-size: 12px;
  vertical-align: middle;
  color: #99a2aa;
  padding: 0;
  margin: 6px 0 14px;
}
#page-fav .fav-main .fav-meta span {
  display: inline-block;
  font-size: 12px;
  vertical-align: middle;
  color: #99a2aa;
}
#page-fav .fav-main .fav-meta .dot {
  margin: 0 8px;
}

.fav-post-list {
  margin: 20px 20px 50px;
  li {
    word-break: break-word;
    margin: 0 0 20px;
    a {
      color: #222;
    }
    .fav-title {
      font-size: 16px;
      padding: 0;
      margin: 0;
      font-weight: bold;
    }
    .fav-content {
      display: flex;
      align-items: flex-start;
      margin: 4px 0 2px;
      .fav-cover {
        display: inline-block;
        max-width: 200px;
        max-height: 100px;
        overflow: hidden;
        margin-right: 4px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .fav-shortcontent {
        font-size: 14px;
        display: inline-block;
        padding: 0;
        margin: 0;
        word-break: break-word;
        color: #999;
      }
    }
    .fav-time {
      color: #999;
      padding: 0;
      margin: 0;
      font-size: 12px;
    }
  }
}

.fav-more {
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 10px;
}
</style>