<template>
  <div class="article-info">
    <div class="ipfs-hash">
      <img
        src="@/assets/img/icon_copy.svg"
        class="copy-hash"
        alt="hash"
        @click="copyText(getCopyIpfsHash)"
      >
      <n-link target="_blank" :to="{name: 'ipfs-hash', params: {hash: article.hash}}">
        IPFS Hash: {{ article.hash || 'Loading...' }}
      </n-link>
    </div>

    <div class="decoration">
      <a
        data-pocket-label="pocket"
        data-pocket-count="horizontal"
        class="pocket-btn"
        data-lang="en"
      />

      <span class="is-original">
        本文发布于智能签名
        <template v-if="isOriginal">
          未经授权禁止转载
        </template>
      </span>
    </div>
  </div>
</template>

<script>
import { precision } from '@/utils/precisionConversion'
export default {
  components: {},
  props: {
    article: {
      type: Object,
      default: () => ({
      })
    }
  },
  data() {
    return {}
  },
  computed: {
    getCopyIpfsHash() {
      return `${this.article.hash}`
    },
    isOriginal() {
      return Boolean(this.article.is_original)
    }
  },
  methods: {
    // 复制hash
    copyText(getCopyIpfsHash) {
      this.$copyText(getCopyIpfsHash).then(
        () => {
          this.$message.success('复制成功')
        },
        () => {
          this.$message.error('复制失败')
        }
      )
    }
  }
}
</script>

<style scoped lang="less">
.ipfs-hash {
  background-color: #F1F1F1;
  border-radius: 16px;
  padding: 15px 16px;
  margin: 0;
  font-size: 14px;
  color: #B2B2B2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .copy-hash {
    width: 16px;
    margin-right: 2px;
    cursor: pointer;
    line-height: 38px;
    vertical-align: middle;
  }
}
.decoration {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  // align-items: center;
  .is-original {
    font-size:14px;
    font-weight:300;
    color: #B2B2B2;
    line-height:16px;
  }
}
</style>
