<template>
  <div>
    <el-dropdown
      trigger="click"
      @command="handleMoreAction"
    >
      <div class="more-setting">
        <svg-icon
          class="more-icon-setting"
          icon-class="setting"
        />
        <span class="more-text-setting">设置</span>
      </div>
      <el-dropdown-menu
        slot="dropdown"
        class="user-dorpdown"
      >
        <el-dropdown-item command="transfer">
          {{ $t('transfer') }}
        </el-dropdown-item>
        <el-dropdown-item command="del">
          {{ $t('delete') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 文章转让 -->
    <article-transfer
      v-model="transferModal"
      :article-id="Number(id)"
      from="share"
    />
  </div>
</template>

<script>
import articleTransfer from '@/components/articleTransfer'

export default {
  components: {
    articleTransfer
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      opr: false,
      transferModal: false // 转让modal
    }
  },
  methods: {
    // 下拉菜单 指令
    handleMoreAction(command) {
      this[command]()
    },
    // 删除
    del() {
      // 删除方法
      const delFunc = async (id) => {
        if (!id) return
        try {
          const res = await this.$API.delArticle({ id })
          if (res.code === 0) {
            this.$message({ showClose: true, duration: 2000, message: '删除成功' })
            this.$router.push('/sharehall')
          }
          else this.$message({ showClose: true, message: res.message, type: 'error' })
        } catch (error) {
          return console.error(error)
        }
      }
      this.$confirm('该分享已上传至 IPFS 永久保存, 本次操作仅删除瞬MATATAKI中的显示。', this.$t('promptTitle'), {
        distinguishCancelAndClose: true,
        customClass: 'message-box__mobile',
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel')
      })
        .then(() => {
          delFunc(this.id)
        })
        .catch(() => {})
    },
    transfer() {
      this.transferModal = true
    },
  }
}
</script>

<style lang="less" scoped>
.more-setting {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
  box-sizing: border-box;
  user-select: none;
}
.more-icon-setting {
  font-size: 18px;
  color: #989898;
  transform: rotate(90deg);
}
</style>