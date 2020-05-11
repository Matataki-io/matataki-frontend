<template>
  <div class="history">
    <p>
      请选择预览节点：
      <el-radio v-model="historyPreviewSelect" label="mttk">
        Matataki
      </el-radio>
      <el-radio v-model="historyPreviewSelect" label="infura">
        Infura
      </el-radio>
      <el-radio v-model="historyPreviewSelect" label="ipfs">
        IPFS官方
      </el-radio>
    </p>
    <el-table
      :data="articleIpfsInfomation"
      height="400"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="#" width="70" />
      <el-table-column prop="htmlHash" label="IPFS Hash" width="460" />
      <el-table-column prop="datetime" label="创建于" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="copy(scope.row.htmlHash)">
            复制
          </el-button>
          <a :href="scope.row.preview" target="_blank">
            <el-button type="text" size="small">
              查看
            </el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>
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
      historyPreviewSelect: 'mttk',
      ipfsNodeMap: {
        mttk: 'https://ipfs.mttk.net/ipfs/',
        ipfs: 'https://ipfs.io/ipfs/',
        infura: 'https://ipfs.infura.io/ipfs/'
      }
    }
  },
  computed: {
    articleIpfsInfomation() {
      return this.articleIpfsArray
        .slice() // clone array so no side effect on the original array
        .sort((a, b) => b.id - a.id)
        .map(item => {
          const datetime = new Date(item.createdAt).toLocaleString()
          const preview = `${this.selectedNode}${item.htmlHash}`
          return { ...item, datetime, preview }
        })
    },
    selectedNode() {
      return this.ipfsNodeMap[this.historyPreviewSelect]
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
