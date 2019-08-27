<template>
  <div class="article-ipfs">
    <p>本文内容已上传星际文件存储系统「IPFS」，永久保存，不可删除。</p>
    <div class="ipfs-hash">
      <svg-icon
        class="copy-hash"
        icon-class="copy"
        @click="copyText(getCopyIpfsHash)"
      />
      <n-link class="ipfs" target="_blank" :to="{name: 'ipfs-hash', params: {hash: hash}}">
        IPFS Hash: {{ hash || 'Loading...' }}
      </n-link>
    </div>
    <img class="ipfs-img" src="@/assets/img/ipfs.png" alt="ipfs">
  </div>
</template>

<script>
import { precision } from '@/utils/precisionConversion'
export default {
  components: {},
  props: {
    hash: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    getCopyIpfsHash() {
      return `${this.hash}`
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
.article-ipfs {
  height:94px;
  background:rgba(241,241,241,1);
  border-radius:6px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 20px 0 0;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  p {
    padding: 0;
    margin: 0 0 6px;
    font-size:16px;
    color:rgba(178,178,178,1);
  }
}
.ipfs-img {
  position: absolute;
  width: 124px;
  right: 0;
  bottom: 0;
}
.ipfs-hash {
  margin: 6px 0 0;
  font-size: 14px;
  color: #B2B2B2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .copy-hash {
    width: 18px;
    cursor: pointer;
    vertical-align: middle;
      color:rgba(28,156,254,1);
    .ipfs {
      font-size:16px;
      color:rgba(28,156,254,1);
    }
  }
}
</style>
