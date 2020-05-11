<template>
  <div class="ipfs">
    <el-dialog
      :title="historyDialogTitle"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <span>文章的历史记录</span>
      <el-table
        :data="articleIpfsInfomation"
        height="400"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="#"
          width="70"
        />
        <el-table-column
          prop="htmlHash"
          label="IPFS Hash"
          width="460"
        />
        <el-table-column
          prop="datetime"
          label="创建于"
        />
      </el-table>
    </el-dialog>
    <el-popover
      placement="top"
      trigger="hover"
      class="components-ipfs_all"
      width="370"
    >
      <div class="components-ipfs_all">
        <p class="ipfs_all__title">
          {{ $t('ipfsHash.link') }}
          <span style="float: right;">
            <el-button type="text" @click="dialogVisible = true">历史记录</el-button>
          </span>
        </p>
        <div
          v-if="hash"
          class="ipfs_all__address"
        >
          <p>
            IPFS Hash: {{ hash }}
          </p>
          <svg-icon
            icon-class="copy"
            class="icon"
            @click="copy(hash)"
          />
        </div>
        <p
          v-else
          class="ipfs_all__not"
        >
          {{ $t('not') }}
        </p>
        <p class="ipfs_all__title">
          {{ $t('ipfsHash.publicNode') }}
        </p>
        <template v-if="hash">
          <div
            v-for="(item, index) in link"
            :key="index"
            class="ipfs_all__link"
          >
            <a
              :href="item + hash"
              target="_blank"
            >
              {{ item }}{{ hash }}
            </a>
            <svg-icon
              icon-class="arrow"
              class="icon"
            />
          </div>
        </template>
        <p
          v-else
          class="ipfs_all__not"
        >
          {{ $t('not') }}
        </p>
        <p class="ipfs_all__description">
          {{ $t('ipfsHash.slogan') }}
        </p>
      </div>
      <svg-icon
        slot="reference"
        icon-class="ipfs"
        class="ipfs_all__icon"
      />
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    articleIpfsArray: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      link: [
        'https://ipfs.smartsignature.io/ipfs/',
        'https://ipfs.io/ipfs/',
        'https://ipfs.infura.io/ipfs/'
      ]
    }
  },
  computed: {
    hash() {
      return this.articleIpfsArray.length !== 0 ? this.articleIpfsArray[0].htmlHash : ''
    },
    articleIpfsInfomation() {
      return this.articleIpfsArray
        .slice() // clone array so no side effect on the original array
        .sort((a,b) => (b.id - a.id))
        .map(item => {
          const datetime = new Date(item.createdAt).toLocaleString()
          return { ...item, datetime }
        })
    },
    historyDialogTitle() {
      return 'IPFS Hash 历史记录'
    }
  },
  methods: {
    copy(val) {
      this.$copyText(val).then(
        () => this.$message.success(this.$t('success.copy')),
        () => this.$message.error(this.$t('error.copy'))
      )
    }
  }
}
</script>

<style lang="less" scoped>

.components-ipfs_all {
  .ipfs_all__icon {
    font-size: 20px;
    cursor: pointer;
  }
  .ipfs_all__title {
    padding: 0;
    margin: 0 0 10px;
    font-size:14px;
    font-weight:bold;
    color:rgba(0,0,0,1);
    line-height:20px;
  }
  .ipfs_all__address {
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    p {
      padding: 0;
      margin: 0;
      font-size:12px;
      color:@purpleDark;
      line-height:17px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .icon {
      margin: 0 0 0 4px;
    }
  }

  .ipfs_all__link {
    display: flex;
    align-items: center;
    margin: 0 0 10px 0;
    a {
      padding: 0;
      margin: 0;
      display: block;
      font-size: 12px;
      color: #b2b2b2;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      &:hover {
        color: #a09f9f;
      }
    }
    .icon {
      color:@purpleDark;
      margin-left: 4px;
      font-size: 12px;
    }
  }

  .ipfs_all__description {
    padding: 0;
    margin: 0;
    font-size:12px;
    color:rgba(178,178,178,1);
    line-height:17px;
  }
  .ipfs_all__not {
    margin: 0 0 10px;
    font-size:14px;
    color:rgba(178,178,178,1);
    line-height:17px;
  }
}
// .ipfs-tip {
//   font-size:12px;
//   font-weight:400;
//   color:rgba(178,178,178,1);
//   line-height:14px;
//   margin-bottom: 10px;
// }

// .ipfs-link {
//   font-size:12px;
//   font-weight: bold;
//   color: @purpleDark;
//   line-height:14px;
// }
</style>
