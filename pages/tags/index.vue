<template>
  <div class="tags">
    <!-- header -->
    <g-header />

    <div class="tags-main">
      <!-- banner -->
      <div class="tags-banner">
        <img src="@/assets/img/tags_banner.png" alt="banner">
        <p>个<span>/</span>性<span>/</span>化<span>/</span>自<span>/</span>定<span>/</span>义<span>/</span>标<span>/</span>签</p>
      </div>
      <div class="tags-head">
        <div class="tags-text">
          <span class="tags-title" :class="mode === 'hot' && 'active'" @click="toggleTag('hot')">最热</span>
          <span class="tags-title" :class="mode === 'new' && 'active'" @click="toggleTag('new')">最新</span>
        </div>
        <el-input
          v-model="tagSearchVal"
          placeholder="请输入内容"
          clearable
          class="tags-search"
        />
      </div>
      <div class="tag-table">
        <el-table :data="tagsData" style="width: 100%" @row-click="rowClick">
          <el-table-column label="标签名称">
            <template slot-scope="scope">
              # {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column
            prop="num"
            label="数量"
            width="100"
          />
        </el-table>
        <user-pagination
          v-show="!pull.loading"
          :current-page="pull.currentPage"
          :params="pull.params"
          :api-url="pull.apiUrl"
          :page-size="pull.params.pagesize || 20"
          :total="pull.total"
          :reload="pull.reload"
          class="pagination"
          @paginationData="paginationDataTags"
          @togglePage="togglePageTags"
        />
      </div>
    </div>
  </div>
</template>
<script>
import userPagination from '@/components/user/user_pagination.vue'

export default {
  components: {
    userPagination,
  },
  data() {
    return {
      tagSearchVal: '',
      tagsData: [],
      mode: 'hot',
      pull: {
        loading: false,
        currentPage: 1,
        total: 0,
        reload: 0,
        params: {
          pagesize: 20,
        },
        apiUrl: 'tagsHottest',
        list: []
      }
    }
  },
  methods: {
    paginationDataTags(res) {
      // console.log('res', res)
      this.pull.list = res.data.list
      this.tagsData = res.data.list
      this.pull.total = res.data.count || 0
      this.loading = false
    },
    togglePageTags(i) {
      this.loading = true
      this.pull.list = []
      this.tagsData = []
      this.pull.currentPage = i
    },
    // 单击行
    rowClick(row) {
      this.$router.push({name: 'tags-id', params: { id: row.id }, query: { name: row.name }})
    },
    // 切换tag
    toggleTag(val) {
      if (val === 'hot') {
        this.pull.apiUrl = 'tagsHottest'
      } else if (val === 'new') {
        this.pull.apiUrl = 'tagsLatest'
      } else {
        this.pull.apiUrl = 'tagsHottest'
      }
      this.pull.currentPage = 1
      this.pull.total = 0
      this.pull.reload = Date.now()
      this.mode = val

    }
  }
}
</script>
<style lang="less" scoped>
.tags {
  .minHeight();
}

.tags-main {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 10px;
  box-sizing: border-box;
}

.tags-banner {
  height: 160px;
  margin-top: 40px;
  margin-bottom: 40px;
  background-color: #eaeaea;
  position: relative;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    font-weight: 400;
    color: rgba(84, 45, 224, 1);
    line-height: 22px;
    letter-spacing: 10px;
    white-space: nowrap;
    padding: 0;
    margin: 0;
    span {
      color: #b2b2b2;
    }
  }
}
.tags-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tags-title {
  font-size: 20px;
  font-weight: 600;
  color: rgba(178, 178, 178, 1);
  line-height: 28px;
  padding: 0;
  margin: 0 40px 0 0;
  cursor: pointer;
  &:nth-last-child(1) {
    margin-right: 0;
  }
  &.active {
    color: #000000;
  }
}
.tags-text {
  flex: 1;
}
.tags-search {
  max-width: 160px;
}
.tag-table {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 20px;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style> 