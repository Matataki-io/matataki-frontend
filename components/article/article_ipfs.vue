<template>
  <div class="article-ipfs">
    <p>
      {{ $t('p.ipfsTitle') }}
      <el-tooltip
        :content="$t('p.ipfsContent')"
        class="item"
        effect="dark"
        placement="top-start"
      >
        <svg-icon
          class="help-icon"
          icon-class="help"
        />
      </el-tooltip>
    </p>
    <div
      v-if="isHide"
      class="ipfs-hash"
    >
      <router-link
        :to="{name: 'ipfs-hash', params: {hash: hash}}"
        class="ipfs"
        target="_blank"
      >
        IPFS Hash: {{ hash || 'Loading...' }}
      </router-link>
      <svg-icon
        class="copy-hash"
        icon-class="copy"
        @click="copyText(getCopyIpfsHash)"
      />
    </div>
    <img
      class="ipfs-img"
      src="@/assets/img/ipfs.png"
      alt="ipfs"
    >
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    hash: {
      type: String,
      required: true
    },
    isHide: {
      type: Boolean,
      required: false
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
          this.$message({
            showClose: true,
            message: this.$t('success.copy'),
            type: 'success'
          })
        },
        () => {
          this.$message({ showClose: true, message: this.$t('error.copy'), type: 'error' })
        }
      )
    }
  }
}
</script>

<style scoped lang="less">
.article-ipfs {
  background:rgba(241,241,241,1);
  border-radius:6px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 20px 0 0;
  padding: 20px 140px 20px 20px;
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
  height: 50px;
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
      color:@purpleDark;
    .ipfs {
      font-size:16px;
      color:@purpleDark;
    }
  }
}
.help-icon {
  color: #b2b2b2;
  cursor: pointer;
}
</style>
