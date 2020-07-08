<template>
  <div>
    <div v-loading="loading" class="card-container">
      <el-table
        :data="pointLog.list"
        :expand-row-keys="expands"
        class="hole-ticket-hide-expand-button hold-table"
        style="width: 100%"
        row-key="token_id"
        @sort-change="sortChange"
      >
        <el-table-column prop="total_supply" label="Fan票" width="180">
          <template slot-scope="scope">
            <div class="hold">
              <router-link :to="{name: 'token-id', params: {id: scope.row.token_id}}" class="fl ac hold-z-index" target="_blank">
                <c-token-popover :token-id="Number(scope.row.token_id)">
                  <avatar :src="cover(scope.row.logo)" style="margin-right: 10px; min-width: 30px;" />
                </c-token-popover>
                <span class="scope">{{ scope.row.symbol }}</span>
              </router-link>
              <div class="hold-bc" :style="{'width': setHoldBc(scope.row.amount)}" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="持有"
          prop="total_supply"
          sortable="custom"
          width="180"
        >
          <template slot-scope="scope">
            <span class="scope hold-z-index">{{ tokenAmount(scope.row.amount, scope.row.decimals) }}</span>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <tokensDetail
              v-if="expands[0] === scope.row.token_id"
              :id="scope.row.token_id"
            />
          </template>
        </el-table-column>
        <el-table-column label="现价" width="180">
          <template>
            <span class="scope hold-z-index">{{ randomNow() }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label=""
          align="right"
        >
          <template slot="header">
            <el-input
              size="small"
              placeholder="输入关键字搜索"
              suffix-icon="el-icon-search"
              style="max-width: 240px;"
            />
          </template>
          <template slot-scope="scope">
            <div class="invite-block btn">
              <!-- <router-link :to="{name: 'tokens-id', params: {id: scope.row.token_id}}"> -->
              <el-button
                type="text"
                class="info-button"
                size="small"
                @click="foldingClick(scope.row.token_id)"
              >
                <span
                  v-if="expands[0] !== scope.row.token_id"
                  class="expand-button"
                >
                  展开明细
                  <i class="el-icon-d-arrow-right i-spin-z90" />
                </span>
                <span
                  v-else
                  class="expand-button"
                >
                  收起明细
                  <i class="el-icon-d-arrow-right i-spin-f90" />
                </span>
              </el-button>
              <!-- </router-link> -->
              <el-button
                class="info-button"
                style="margin: 0 10px;"
                size="small"
                @click="showGift(scope.row.symbol, scope.row.token_id, tokenAmount(scope.row.amount, scope.row.decimals), scope.row.decimals )"
              >
                {{ $t('gift') }}
              </el-button>

              <el-dropdown size="small">
                <el-button size="small">
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <router-link class="token-more-link" :to="{name: 'exchange', hash: '#swap', query: { output: scope.row.symbol }}" target="_blank">
                      更多
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link class="token-more-link" :to="{name: 'exchange', hash: '#swap', query: { output: scope.row.symbol }}" target="_blank">
                      进入主页
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link class="token-more-link" :to="{name: 'exchange', hash: '#swap', query: { output: scope.row.symbol }}" target="_blank">
                      添加流动性
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link class="token-more-link" :to="{name: 'exchange', hash: '#swap', query: { output: scope.row.symbol }}" target="_blank">
                      历史交易记录
                    </router-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>


      <ul class="hold-list">
        <li class="hold-header">
          <span>Fan票</span>
          <span @click="sortChangeM">持仓量<i class="el-icon-d-caret" /></span>
        </li>
        <li v-for="(item, index) in pointLog.list" :key="index">
          <div class="item">
            <router-link :to="{name: 'token-id', params: {id: item.token_id}}" class="fl ac item-name">
              <avatar :src="cover(item.logo)" />
              <span>{{ item.symbol }}</span>
            </router-link>

            <span class="item-amount">{{ tokenAmount(item.amount, item.decimals) }}</span>

            <div class="item-btn">
              <span class="item-more" @click="foldingClick(item.token_id)">
                <!-- {{ expands[0] !== item.token_id ? '展开明细' : '收起明细' }} -->
                <i class="el-icon-d-arrow-right item-more-icon" :class="expands[0] !== item.token_id && 'active'" />
              </span>
              <el-button
                style="margin: 0 4px;"
                size="mini"
                @click="showGift(item.symbol, item.token_id, tokenAmount(item.amount, item.decimals), item.decimals )"
              >
                {{ $t('gift') }}
              </el-button>
              <router-link :to="{name: 'exchange', hash: '#swap', query: { output: item.symbol }}">
                <el-button
                  type="primary"
                  size="mini"
                >
                  {{ $t('transaction') }}
                </el-button>
              </router-link>
            </div>
          </div>
          <tokensDetail
            v-if="expands[0] === item.token_id"
            :id="item.token_id"
          />
        </li>
      </ul>
    </div>
    <user-pagination
      v-show="!loading"
      :reload="reload"
      :current-page="currentPage"
      :params="pointLog.params"
      :api-url="pointLog.apiUrl"
      :page-size="pointLog.params.pagesize"
      :total="total"
      :need-access-token="true"
      class="pagination"
      @paginationData="paginationData"
      @togglePage="togglePage"
    />
    <TransferDialog v-model="giftDialog" :form2="form" />
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import userPagination from '@/components/user/user_pagination.vue'
import { xssFilter } from '@/utils/xss'
import avatar from '@/common/components/avatar'
import { precision } from '@/utils/precisionConversion'
import tokensDetail from '@/components/tokens_detail/index.vue'
import TransferDialog from '@/components/TransferDialog'

export default {
  components: {
    userPagination,
    tokensDetail,
    avatar,
    TransferDialog
  },
  data() {
    const validateToken = (rule, value, callback) => {
      if (!value) {
        callback('发送数量不能为空')
      } else if (!(/^[0-9]+(\.[0-9]{1,4})?$/.test(value))) {
        callback(new Error('发送的数量小数不能超过4位'))
      } else if (Number(value) < this.form.min) {
        callback(new Error('发送数量不能少于0.0001'))
      } else if (Number(value) > this.form.max) {
        callback(new Error(`发送数量不能大于${this.form.max || 99999999}`))
      } else {
        callback()
      }
    }
    return {
      isPublishCoins: true,
      pointLog: {
        params: {
          pagesize: 10,
          order: 0
        },
        apiUrl: 'tokenTokenList',
        list: [],
      },
      currentPage: Number(this.$route.query.tokensPage) || 1,
      loading: false, // 加载数据
      transferLoading: false,
      total: 0,
      reload: 0,
      assets: {
      },
      viewStatus: 0, // 0 1
      amount: 0,
      giftDialog: false,
      form: {
        tokenname: '',
        username: '',
        useravatar: '',
        userId: '',
        tokenId: '',
        tokens: '',
        min: 0.0001,
        max: 99999999, // 默认最大
        balance: 0
      },
      rules: {
        tokens: [
          { validator: validateToken, trigger: ['blur', 'change'] }
        ]
      },
      expands: [],
      searchUserList: [], // 搜索结果
      toUserInfo: null, // 转让的对象
      historyUser: [] // 历史转让用户
    }
  },
  computed: {
    searchUserName() {
      return this.form.username
    }
  },
  watch: {
    searchUserName() {
      this.searchUser()
    },
  },
  methods: {
    createTime(time) {
      return this.moment(time).format('MMMDo HH:mm')
    },
    cover(cover) {
      return cover ? this.$ossProcess(cover) : ''
    },
    tokenAmount(amount, decimals) {
      const tokenamount = precision(amount, 'CNY', decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    paginationData(res) {
      // console.log(res)
      this.pointLog.list = res.data.list
      this.assets = res.data
      this.total = res.data.count || 0
      this.amount = res.data.amount || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.pointLog.list = []
      this.currentPage = i
      const query = { ...this.$route.query }
      query.tokensPage = i
      this.$router.push({
        query
      })
    },
    closeUser(e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      this.toUserInfo = null
      this.searchUserList = []
      return false
    },
    showGift(symbol, tokenId, amount, decimals) {
      // console.log(Math.floor(Number(amount)))
      this.form.tokenname = symbol
      this.form.tokenId = tokenId
      this.form.decimals = decimals
      this.form.max = Number(amount)
      this.form.balance = Number(amount)
      this.giftDialog = true
    },
    // 搜索用户
    searchUser: debounce(function () {
      const searchName = this.form.username.trim()
      if (!searchName) {
        this.searchUserList = []
        return
      }

      this.toUserInfo = null

      const params = {
        word: searchName,
        pagesize: 10
      }

      this.$API.search('user', params).then(res => {
        if (res.code === 0) {
          this.searchUserList = res.data.list
          if (res.data.list.length === 0) {
            // 没有结果
            this.$message({ showClose: true, message: '没有搜索结果', type: 'warning'})
          }
        } else {
          // 失败
          this.$message({ showClose: true, message: res.message, type: 'warning'})
        }
      }).catch(err => {
        // 出错
        console.log(err)
        this.searchUserList = []
      })
    }, 300),
    foldingClick(id) {
      if (this.expands.length === 0 || this.expands[0] !== id) this.expands = [id]
      else this.expands = []
    },
    continueUser(val) {
      this.toUserInfo = val
    },
    searchUserAvatar(src) {
      return src ? this.$ossProcess(src, { h: 60 }) : ''
    },
    searchUserTitle(html) {
      return html ? xssFilter(html) : ''
    },
    // 获取常用用户列表
    historyUserFunc(type) {
      this.$API.historyUser({
        type
      }).then(res => {
        if (res.code === 0) {
          this.historyUser = res.data.slice(0, 10)
        } else {
          console.log(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    sortChange(sort) {
      console.log('sort', sort)
      switch(sort.order) {
        case 'ascending':
          this.pointLog.params.order = 1
          break
        case 'descending':
          this.pointLog.params.order = 2
          break
        default:
          this.pointLog.params.order = 0
      }
      this.togglePage(1)
    },
    // 移动端排序
    sortChangeM() {
      let order = this.pointLog.params.order
      this.pointLog.params.order = (++order) % 3
      this.reload = Date.now()
    },
    randomNow() {
      let now = (Math.random() * 10 + 1).toFixed(4)
      let percentage = ''
      percentage = Math.random() < 0.5 ? '+' : '-'
      percentage += Math.floor(Math.random() * 100 + 1)
      percentage += '%'
      return `${now}(${percentage})`
    },
    // 设置持有 token 的背景条
    setHoldBc(data) {
      try {
        let val = parseInt(data)

        let list = this.pointLog.list.map(i => i.amount)
        let max = Math.max(...list)
        let percentage = Math.floor(max / 100) // 按照最大的值计算 刻度

        // 默认 10px
        let widthVal = '10px'

        if (val <= 1) { // 最小 1 ==== 0.0001
          widthVal = '10px'
        } else if (val >= max) { // 最大
          widthVal = '320px'
        } else {
          // 按照刻度求百分比 向下取值 向上可能99.6 => 100%
          let valPercentage = Math.floor(val / percentage)
          // 根据百分比计算宽度
          let bcWidth = (320 * (valPercentage / 100) )

          // 最小不能少于 10, 如果太小 按照 10 展示
          widthVal = (bcWidth < 10 ? 10 : bcWidth ) + 'px'
        }
        return widthVal
      } catch (e) {
        console.log(e)
        return '10px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.line {
  height: 1px;
  background-color: #DBDBDB;
  margin: 20px 0 0;
}

.invite-block.btn {
  display: flex;
  justify-content: flex-end;
}
.invite-block.author{
  display: flex;
  align-items: center;
}
.username {
  // margin-left: 10px;
  font-size: 16px;
  color:#333;
  flex: 1;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.scope {
  font-size: 16px;
  color:#333;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}

.point {
  font-size: 16px;
  font-weight: bold;
  color:rgba(251,104,119,1);
}
.invite-des {
  font-size:14px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:20px;
  margin: 0 10px 20px;
}
.pagination {
  margin-top: 40px;
}
.gift-form {
  margin: 0 40px 0 20px;
  .tokenname {
    padding: 0;
    margin: 0;
  }
}

.expand-button {
  font-size: 14px;
  font-weight:400;
  color:rgba(84,45,224,1);
  .i-spin {
    &-z90 {
      transform: rotate(90deg)
    }
    &-f90 {
      transform: rotate(-90deg)
    }
  }
}
.expand-card {
    background-color: #F1F1F1;
}
.balance {
  padding: 0;
  margin: 0 0 40px 70px;
  font-size: 14px;
  font-weight: 400;
  color: #777777;
  word-spacing: 1px;
  a {
    font-size: 14px;
    color: #542de0;
    cursor: pointer;
  }
}
.form-button {
  display: flex;
  justify-content: flex-end;
  button {
    padding-left: 40px;
    padding-right: 40px;
  }
}

.transfer—search__list {
  position: absolute;
  left: 0;
  right: 0;
  top: 32px;
  background: #fff;
  border: 1px solid #B2B2B2;
  border-top: none;
  border-radius: 0 0 8px 8px;
  z-index: 1;
  padding: 4px 0 0 0;
  &__avatar {
    margin-right: 10px;
    flex: 0 0 30px;
  }
  & > div {
    width: 100%;
    margin: 0;
    padding: 5px 20px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    &:hover {
      background: #f1f1f1;
    }
    span {
      font-size:14px;
      font-weight:400;
      color:rgba(178,178,178,1);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}

.search-user {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  &-avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    flex: 0 0 40px;
  }
  span {
    font-size:14px;
    font-weight:400;
    color:rgba(178,178,178,1);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .gift-ful {
    cursor: pointer;
    position: absolute;
    top: -2px;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 20px;
  }
}

// history user
.history-user__tag {
  cursor: pointer;
  margin: 0 10px 0 0;
}

// result transition
.result-enter-active,
.result-leave-active {
  transition: opacity .2s;
}
.result-enter,
.result-leave-to {
  opacity: 0
}

.hold-header {
  span {
    font-size: 14px;
    color: #909399;
    margin-right: 40px;
    &:nth-last-child(1) {
      margin-right: 0;
    }
  }
}

.hold-list {
  display: none;
  margin-top: 20px;
  li {
    list-style: none;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
  }
  .item-name {
    color: #333;
    span {
      font-size: 12px;
      margin-left: 4px;
    }
  }
  .item-amount {
    color: #333;
    font-size: 12px;
  }
  .item-btn {
    display: flex;
    align-items: center;
  }
  .item-more {
    font-size: 12px;
    color: #542de0;
    padding: 0 4px 0 4px;
    .item-more-icon {
      transform: rotate(-90deg);
      &.active {
        transform: rotate(90deg);
      }
    }
  }
}


.token-more-link {
  display: block;
  text-decoration: none;
  color: #333;
}




.transfer-dialog /deep/ .el-dialog {
  width: 600px !important;
}
@media screen and (max-width: 768px) {
  .hold-table {
    display: none;
  }
  .hold-list {
    display: block;
  }
}

@media screen and (max-width: 640px) {
  .transfer-dialog /deep/ .el-dialog {
    width: 90% !important;
  }
}

</style>

<style lang="less" scoped>
.hold-z-index {
  position: relative;
  z-index: 2;
}
.hold {
  position: relative;
  padding: 8px;
  .hold-bc {
    position: absolute;
    left: -10px;
    top: 0;
    bottom: 0;
    max-width: 320px;
    // height: 46px;
    background-color: #EBE6FF;
    z-index: 1;
    border-radius: 8px;
  }
}

/deep/ .hold-table {
  .el-table__row .cell {
    overflow: initial;
  }
}


/deep/ .hole-ticket-hide-expand-button {
  .el-table__body-wrapper .el-table__body .el-table__row .el-table__expand-column .cell {
    display: none;
  }
  .el-table__expanded-cell {
    padding: 0;
    background-color: #F1F1F1;
    &:hover {
      background-color: #F1F1F1!important;
    }
  }
}
</style>