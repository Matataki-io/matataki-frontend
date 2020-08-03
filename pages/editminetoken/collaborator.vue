<template>
  <settingLayout>
    <div class="colla-add">
      <searchUsers
        v-model="userData"
        placeholder="输入对方昵称"
      />
      <el-button
        type="primary"
        size="small"
        @click="addCollaborator"
      >
        添加
      </el-button>
    </div>
    <div class="colla-member">
      <h4 class="colla-member-title">
        已添加的协作者（{{ collaborators.length }}/20）
      </h4>
      <div v-loading="loading" class="colla-member-list">
        <div
          v-for="(colla, index) in collaborators"
          :key="index"
          class="colla-member-card"
        >
          <router-link :to="{ name: 'user-id', params: { id: colla.user_id } }">
            <c-user-popover :user-id="Number(colla.user_id)">
              <c-avatar :src="getAvatar(colla.avatar)" />
            </c-user-popover>
            <p class="colla-member-card-name" :class="!(colla.nickname || colla.username) && 'logout'">
              {{ colla.nickname || colla.username || $t('error.accountHasBeenLoggedOut') }}
            </p>
          </router-link>
          <el-popover
            v-model="colla.detelePopover"
            placement="top"
            width="160"
            class="colla-member-card-button"
          >
            <p>确定要移除协作者么？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="colla.detelePopover = false">
                取消
              </el-button>
              <el-button type="primary" size="mini" @click="deleteClick(colla)">
                确定
              </el-button>
            </div>
            <el-button
              slot="reference"
              type="text"
            >
              移除
            </el-button>
          </el-popover>
        </div>
        <div v-if="collaborators.length === 0 && !loading" class="no-data">
          暂无协作者
        </div>
      </div>
      <el-divider class="colla-splitline" />
      <p class="colla-help">
        什么是协作者：<br>
        协作者可以在发布文章的时候，设置使用你的Fan票为解锁条件
      </p>
    </div>
  </settingLayout>
</template>

<script>
import settingLayout from '@/components/token/setting_layout.vue'
import searchUsers from '@/components/user/search_users.vue'

export default {
  components: {
    settingLayout,
    searchUsers
  },
  data() {
    return {
      showInput: false,
      loading: true,
      collaborators: [],
      userData: null,
      userId: 0
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.getCollaborators()
  },
  methods: {
    async getCollaborators() {
      this.loading = true
      try {
        const res = await this.$API.getCollaborators()
        if (res.code === 0) {
          this.collaborators = []
          res.data.forEach(colla => {
            this.collaborators.push({
              ...colla,
              detelePopover: false
            })
          })
        }
        else this.$message.error(res.message)
      }
      catch (e) {
        console.error(e)
        this.$message.error(this.$t('error.fail'))
      }
      this.loading = false
    },
    async addCollaborator() {
      if (!this.userData || !this.userData.id) {
        this.$message.warning('未选择要添加的用户')
        return
      }
      const id = this.userData.id
      this.userData = null
      this.loading = true
      try {
        const res = await this.$API.setCollaborator(id)
        this.$message({
          type: res.code === 0 ? 'success' : 'error',
          message: res.message
        })
        this.getCollaborators()
      }
      catch (e) {
        console.error(e)
        this.$message.error(this.$t('error.fail'))
        this.loading = false
      }
    },
    deleteClick(colla) {
      colla.detelePopover = false,
      this.deleteCollaborator(colla.user_id)
    },
    async deleteCollaborator(id) {
      this.loading = true
      try {
        const res = await this.$API.deleteCollaborator(id)
        this.$message({
          type: res.code === 0 ? 'success' : 'error',
          message: res.message
        })
        this.getCollaborators()
      }
      catch (e) {
        console.error(e)
        this.$message.error(this.$t('error.fail'))
        this.loading = false
      }
    },
    getAvatar(url) {
      return url ? this.$ossProcess(url, { h: 30 }) : ''
    },
  }
}
</script>

<style lang="less" scoped>
.colla-add {
  display: flex;
  max-width: 340px;
  button {
    margin-left: 20px;
    height: 40px;
    width: 120px;
  }
}
.colla-member {
  &-title {
    font-size: 16px;
    font-weight: 400;
    color: black;
    line-height: 22px;
  }
  &-list {
    min-height: 300px;
    max-width: 325px;
    .no-data {
      color: #b2b2b2;
      font-size: 14px;
    }
  }
  &-card {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 5px;
    border-radius: 5px;
    &:hover {
      background: #ededed;
    }
    a {
      display: flex;
      flex: 1;
      align-items: center;
    }
    &-name {
      flex: 1;
      margin: 0 0 0 10px;
      font-size: 16px;
      font-weight: 400;
      color: black;
      line-height: 22px;
      height: 22px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
      &.logout {
        color: #b2b2b2;
      }
    }
    &-button {
      margin-left: 10px;
    }
  }
}
.colla-splitline {
  max-width: 500px;
}
.colla-help {
  font-size: 14px;
  font-weight: 400;
  color: black;
  line-height: 30px;
}
</style>
