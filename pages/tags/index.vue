<template>
  <div class="tags">
    <div class="tags-main">
      <!-- banner -->
      <div class="tags-banner">
        <img src="@/assets/img/tags_banner.png" alt="banner">
        <p>个<span>/</span>性<span>/</span>化<span>/</span>自<span>/</span>定<span>/</span>义<span>/</span>标<span>/</span>签</p>
      </div>
      <div class="tags-head">
        <div class="tags-text">
          <span
            v-show="searchResultShow"
            class="tags-title"
            :class="mode === 'hot' && 'active'"
            @click="toggleTag('hot')"
          >最热</span>
          <span
            v-show="searchResultShow"
            class="tags-title"
            :class="mode === 'new' && 'active'"
            @click="toggleTag('new')"
          >最新</span>
          <svg-icon
            v-show="!searchResultShow"
            icon-class="arrow"
            class="head-arrow"
            @click="backAll"
          />
        </div>
        <el-autocomplete
          v-model="tagSearchVal"
          class="tags-search"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入搜索内容"
          @select="handleSelect"
          @keyup.enter.native="searchTag"
        />
      </div>
      <div v-loading="loading" class="tag-table">
        <el-table :data="tagsData" style="width: 100%" @row-click="rowClick">
          <el-table-column label="标签名称">
            <template slot-scope="scope">
              <span class="tag-icon">#</span> <span class="tag-name">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="num"
            label="数量"
            width="100"
          >
            <template slot-scope="scope">
              <span class="tag-num">{{ scope.row.num }}</span>
            </template>
          </el-table-column>
        </el-table>
        <user-pagination
          v-show="searchResultShow && !pull.loading"
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
import { filterOutHtmlTags } from '@/utils/xss'

export default {
  components: {
    userPagination,
  },
  data() {
    return {
      loading: false,
      tagSearchVal: '',
      tagsData: [],
      searchResultShow: true,
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
      },
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
    },
    // 自动搜索
    async querySearchAsync(queryString, cb) {
      if (queryString.trim()) {
        const res = await this.$utils.factoryRequest(this.$API.search('tag', { 
          word:  this.tagSearchVal,
          pagesize: 5
        }))

        if (!res) {
          cb([])
          return
        }

        const list = res.data.list.map(i => {
          return {
            value: filterOutHtmlTags(i.name),
            address: i.id
          }
        })
        cb(list)
      } else {
        cb([])
      }
    },
    // 备选项选择
    handleSelect(item) {
      if (item && item.address) {
        this.searchTags(item.value)
      }
    },
    // 搜索标签
    async searchTags(word) {
      this.loading = true
      this.searchResultShow = false

      const res = await this.$utils.factoryRequest(this.$API.search('tag', { 
        word:  word,
        pagesize: 9999,
      }))
      if (res) {
        this.tagsData = res.data.list.map(i => {
          return {
            name: filterOutHtmlTags(i.name),
            num: i.num,
            id: i.id
          }
        })
      } else {
        this.tagsData = []
      }
      this.loading = false
    },
    // 重置
    reset() {
      this.searchResultShow = true
      this.tagsData = []
      this.tagSearchVal = ''
      this.toggleTag(this.mode)
    },
    // 搜索tag enter event
    searchTag() {
      if (this.tagSearchVal.trim()) {
        this.searchTags(this.tagSearchVal)
      } else {
        this.reset()
      }
    },
    // 返回到所有
    backAll() {
      this.reset()
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
  border-radius: 10px;

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
.head-arrow {
  transform: rotate(180deg);
  cursor: pointer;
  color: #333;
  font-size: 16px;
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
.tag-name {
  color: #333;
}
.tag-icon {
  color: #b3b3b3;
}
.tag-num {
  color: rgb(179, 179, 179);
}

.pagination {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style> 