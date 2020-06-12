<template>
  <userLayout :need-frame="false">
    <template slot="main">
      <div class="tokens-main">
        <h2 class="tag-title">
          {{ $t('user.buycoins') }}
        </h2>

        <div
          v-loading="loading"
          class="card-container buycoins"
        >
          <div class="line" />

          <el-table
            :data="pointLog.list"
            :expand-row-keys="expands"
            class="hide-expand-button"
            style="width: 100%"
            row-key="token_id"
            @sort-change="sortChange"
          >
            <el-table-column
              prop="total_supply"
              label="Fan票"
            >
              <template slot-scope="scope">
                <router-link
                  :to="{name: 'token-id', params: {id: scope.row.token_id}}"
                  class="fl ac"
                >
                  <avatar
                    :src="cover(scope.row.logo)"
                    style="margin-right: 10px; min-width: 30px;"
                  />
                  <span class="scope">{{ scope.row.symbol }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="total_supply"
              label="名称"
            >
              <template slot-scope="scope">
                <router-link :to="{name: 'token-id', params: {id: scope.row.token_id}}">
                  <span class="scope">{{ scope.row.name }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              :label="$t('token.founder')"
            >
              <template slot-scope="scope">
                <n-link
                  :to="{name: 'user-id', params: {id: scope.row.uid}}"
                  class="invite-block author"
                >
                  <!-- <avatar :src="cover(scope.row.avatar)" /> -->
                  <span class="username">{{ scope.row.nickname || scope.row.username }}</span>
                </n-link>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('user.positionCoins')"
              prop="total_supply"
              sortable="custom"
            >
              <template slot-scope="scope">
                <span class="scope">{{ tokenAmount(scope.row.amount, scope.row.decimals) }}</span>
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
            <el-table-column
              prop="create_time"
              label=""
              width="220"
            >
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
                  <router-link :to="{name: 'exchange', hash: '#swap', query: { output: scope.row.symbol }}">
                    <el-button
                      type="primary"
                      class="info-button"
                      size="small"
                    >
                      {{ $t('transaction') }}
                    </el-button>
                  </router-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
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
        <m-dialog
          v-model="giftDialog"
          width="600px"
          title="赠送Fan票"
          class="transfer-dialog"
        >
          <el-form
            ref="form"
            v-loading="transferLoading"
            :model="form"
            :rules="rules"
            label-width="70px"
            class="gift-form"
          >
            <el-form-item label="Fan票">
              <p class="tokenname">
                {{ form.tokenname }}
              </p>
            </el-form-item>
            <el-form-item label="接受对象">
              <el-input
                v-model="form.username"
                placeholder="请输入赠送的对象"
                size="small"
                style="z-index: 2;"
              />
              <!-- 常用候选对象列表 -->
              <template v-if="historyUser.length !== 0">
                <el-tag
                  v-for="item in historyUser"
                  :key="item.id"
                  type="info"
                  class="history-user__tag"
                  @click="continueUser(item)"
                >
                  {{
                    (item.nickname || item.username).length > 20
                      ? `${(item.nickname || item.username).slice(0, 20)}...`
                      : item.nickname || item.username
                  }}
                </el-tag>
              </template>
              <!-- 搜索结果 -->
              <div
                v-if="searchUserList.length !== 0 && $utils.isNull(toUserInfo)"
                class="transfer—search__list"
              >
                <div
                  v-for="item in searchUserList"
                  :key="item.id"
                  @click="continueUser(item)"
                >
                  <avatar
                    :src="searchUserAvatar(item.avatar)"
                    class="transfer—search__list__avatar"
                  />
                  <span
                    class="search-result__tag "
                    v-html="searchUserTitle(item.nickname || item.username)"
                  />
                </div>
              </div>
            </el-form-item>
            <!-- 结果 -->
            <transition name="result">
              <el-form-item
                v-if="!$utils.isNull(toUserInfo)"
                label=""
                prop=""
              >
                <router-link
                  :to="{name: 'user-id', params: {id: toUserInfo.id}}"
                  class="search-user"
                  target="_blank"
                >
                  <avatar
                    :src="searchUserAvatar(toUserInfo.avatar)"
                    class="search-user-avatar"
                  />
                  <span
                    class="search-result__tag "
                    v-html="searchUserTitle(toUserInfo.nickname || toUserInfo.username)"
                  />
                  <div
                    class="gift-ful"
                    @click="closeUser"
                  >
                    <i class="el-icon-close" />
                  </div>
                </router-link>
              </el-form-item>
            </transition>
            <el-form-item
              label="发送数量"
              prop="tokens"
            >
              <el-input
                v-model="form.tokens"
                :max="form.max"
                :min="form.min"
                placeholder="请输入数量"
                size="small"
                clearable
              />
            </el-form-item>
            <p
              v-if="form.balance"
              class="balance"
            >
              余额&nbsp;{{ form.balance }}&nbsp;
              <a
                href="javascript:;"
                @click="form.tokens = form.balance"
              >全部转入</a>
            </p>
            <el-form-item>
              <div class="form-button">
                <el-button
                  :disabled="$utils.isNull(toUserInfo)"
                  type="primary"
                  size="small"
                  @click="submitForm('form')"
                >
                  确定
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </m-dialog>
      </div>
      <!-- 流动金 -->
      <holdliquidity />
    </template>
    <template slot="nav">
      <myAccountNav />
    </template>
  </userLayout>
</template>

<script>
import moment from 'moment'
import debounce from 'lodash/debounce'
import userPagination from '@/components/user/user_pagination.vue'
import { xssFilter } from '@/utils/xss'
import avatar from '@/common/components/avatar'
import userLayout from '@/components/user/user_layout.vue'
import myAccountNav from '@/components/my_account/my_account_nav.vue'
import { precision, toPrecision } from '@/utils/precisionConversion'
import holdliquidity from '@/components/holdliquidity/index.vue'
import tokensDetail from '@/components/tokens_detail/index.vue'

export default {
  components: {
    userLayout,
    myAccountNav,
    userPagination,
    holdliquidity,
    tokensDetail,
    avatar
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
        list: []
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
    giftDialog(newVal) {
      if (newVal) {
        this.historyUserFunc('token')
      } else {
        this.formEmpty()
      }
    },
    searchUserName() {
      this.searchUser()
    }
  },
  methods: {
    createTime(time) {
      return moment(time).format('MMMDo HH:mm')
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
    transferMinetoken() {
      const toUserInfo = this.toUserInfo
      if (this.$utils.isNull(toUserInfo)) return

      const toId = this.$utils.isNull(toUserInfo) ? -1 : toUserInfo.id
      this.transferLoading = true

      const data = {
        tokenId: this.form.tokenId,
        to: toId,
        amount: toPrecision(this.form.tokens, 'CNY', this.form.decimals)
      }
      this.$API.transferMinetoken(data)
        .then(res => {
          if (res.code === 0) {
            this.$message({ showClose: true, message: res.message, type: 'success'})
            this.reload = Date.now()

            // 不知道怎么拿到更新后的tab数据 就暂时先加减吧...
            const toAmount = toPrecision(this.form.tokens, 'CNY', this.form.decimals)
            const currentAmount = toPrecision(this.form.balance, 'CNY', this.form.decimals)
            const endAmount = precision(currentAmount - toAmount, 'CNY', this.form.decimals)
            this.form.balance = Number(endAmount)
            this.form.max = Number(endAmount)
          } else {
            this.$message({ showClose: true, message: res.message, type: 'error' })
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('赠送token失败')
        }).finally(() => {
          this.transferLoading = false
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.$utils.isNull(this.toUserInfo)) {
            this.$message.warning('请选择用户')
          } else {
            this.transferMinetoken()
          }
        } else return false
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    formEmpty() {
      this.form.tokenname = ''
      this.form.username = ''
      this.form.useravatar = ''
      this.form.userId = ''
      this.form.tokenId = ''
      this.form.decimals = ''
      this.form.tokens = ''
      this.form.max = 99999999
      this.form.balance = 0
      this.$refs.form.resetFields()

      this.searchUserList = [] // 搜索结果
      this.toUserInfo = null
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
            this.$message.warning('没有搜索结果')
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

.tokens-main {
  background-color: #fff;
  padding: 20px;
  border-radius: @br10;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.tag-title {
  font-weight: bold;
  font-size: 20px;
  padding-left: 10px;
  margin: 0;
}
.expand-button {
  font-size: 14px;
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
</style>

<style lang="less">
.buycoins {
  .el-table th>.cell {
    font-size: 16px !important;
    font-weight: 400 !important;
  }
  .el-table td, .el-table th.is-leaf {
    border-bottom: none;
  }
  .el-table::before {
    height: 0;
  }
}
.hide-expand-button {
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
