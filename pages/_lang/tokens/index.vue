<template>
  <userLayout :need-frame="false">
    <template slot="main">
      <div class="tokens-main">
        <h2 class="tag-title">
          {{ $t('user.buycoins') }}
        </h2>

        <div v-loading="loading" class="card-container buycoins">
          <div class="line" />

          <el-table
            :data="pointLog.list"
            style="width: 100%"
          >
            <el-table-column
              prop="total_supply"
              label="Fan票"
            >
              <template slot-scope="scope">
                <router-link :to="{name: 'token-id', params: {id: scope.row.token_id}}" class="fl ac">
                  <avatar :src="cover(scope.row.logo)" size="30px" style="margin-right: 10px;" />
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
              label="创始人"
            >
              <template slot-scope="scope">
                <n-link :to="{name: 'user-id', params: {id: scope.row.uid}}" class="invite-block author">
                  <!-- <avatar :src="cover(scope.row.avatar)" size="30px" /> -->
                  <span class="username">{{ scope.row.nickname || scope.row.username }}</span>
                </n-link>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('user.positionCoins')"
              prop="total_supply"
            >
              <template slot-scope="scope">
                <span class="scope">{{ tokenAmount(scope.row.amount, scope.row.decimals) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="create_time"
              label=""
              width="220"
            >
              <template slot-scope="scope">
                <div class="invite-block btn">
                  <router-link :to="{name: 'tokens-id', params: {id: scope.row.token_id}}">
                    <el-button class="info-button" size="small">
                      {{ $t('detail') }}
                    </el-button>
                  </router-link>
                  <el-button
                    @click="showGift(scope.row.symbol, scope.row.token_id, tokenAmount(scope.row.amount, scope.row.decimals), scope.row.decimals )"
                    class="info-button"
                    style="margin: 0 10px;"
                    size="small"
                  >
                    {{ $t('gift') }}
                  </el-button>
                  <router-link :to="{name: 'exchange', hash: '#swap', query: { output: scope.row.symbol }}">
                    <el-button class="info-button" size="small">
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
          @paginationData="paginationData"
          @togglePage="togglePage"
          class="pagination"
        />
        <el-dialog
          :visible.sync="giftDialog"
          :before-close="giftDialogClose"
          title="赠送Fan票"
          width="600px"
        >
          <el-form
            ref="form"
            v-loading="transferLoading"
            :model="form"
            label-width="70px"
            class="gift-form"
          >
            <el-form-item label="Fan票">
              <p class="tokenname">
                {{ form.tokenname }}
              </p>
            </el-form-item>
            <el-form-item label="接受对象">
              <el-input v-model="form.username" @keyup.enter.native="searchUser" placeholder="请输入赠送的对象" size="medium">
                <el-button slot="append" @click="searchUser" icon="el-icon-search" />
              </el-input>
            </el-form-item>
            <el-form-item v-if="form.userId" label="" prop="">
              <div class="avatar-content">
                <avatar :src="form.useravatar" class="gift-avatar" size="60px" />
                <div @click="closeUser" class="gift-ful">
                  <i class="el-icon-close" />
                </div>
              </div>
            </el-form-item>
            <el-form-item label="发送数量" prop="">
              <el-input-number
                v-model="form.tokens"
                :min="1"
                :max="form.max"
                size="small"
              />
            </el-form-item>
            <el-form-item>
              <el-button @click="submitForm('form')" type="primary" size="small">
                确定
              </el-button>
              <el-button @click="formClose" size="small">
                取消
              </el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
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
import userPagination from '@/components/user/user_pagination.vue'
import avatar from '@/components/avatar/index.vue'
import userLayout from '@/components/user/user_layout.vue'
import myAccountNav from '@/components/my_account/my_account_nav.vue'
import { precision, toPrecision } from '@/utils/precisionConversion'
import holdliquidity from '@/components/holdliquidity/index.vue'

export default {
  components: {
    userLayout,
    myAccountNav,
    userPagination,
    holdliquidity,
    avatar
  },
  data() {
    return {
      isPublishCoins: true,
      pointLog: {
        params: {
          pagesize: 4
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
        tokens: 1,
        max: 99999999 // 默认最大
      }
    }
  },
  methods: {
    createTime(time) {
      return moment(time).format('MMMDo HH:mm')
    },
    cover(cover) {
      return cover ? this.$API.getImg(cover) : ''
    },
    tokenAmount(amount, decimals) {
      const tokenamount = precision(amount, 'CNY', decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    paginationData(res) {
      console.log(res)
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
      this.transferLoading = true
      const data = {
        tokenId: this.form.tokenId,
        to: this.form.userId,
        amount: toPrecision(this.form.tokens, 'CNY', this.form.decimals)
      }
      this.$API.transferMinetoken(data)
        .then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
            this.reload = Date.now()
          } else {
            this.$message.error(res.message)
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
          if (this.form.userId && this.form.tokenId) this.transferMinetoken()
          else {
            this.$message.warning('请选择用户')
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
      this.form.tokens = 1
      this.form.max = 99999999
      this.$refs.form.resetFields()
    },
    giftDialogClose(done) {
      this.formEmpty()
      done()
    },
    formClose() {
      this.giftDialog = false
      this.formEmpty()
    },
    closeUser() {
      this.form.userId = ''
      this.form.useravatar = ''
    },
    showGift(symbol, tokenId, amount, decimals) {
      // console.log(Math.floor(Number(amount)))
      this.form.tokenname = symbol
      this.form.tokenId = tokenId
      this.form.decimals = decimals
      this.form.max = Math.floor(Number(amount))
      this.giftDialog = true
    },
    async searchUser() {
      if (!this.form.username.trim()) return this.$message.warning('用户名不能为空')
      this.transferLoading = true
      await this.$API.searchUsername(this.form.username.trim())
        .then(res => {
          if (res.code === 0) {
            console.log(res)
            this.form.useravatar = res.data.avatar ? this.$API.getImg(res.data.avatar) : ''
            this.form.userId = res.data.id
          } else return this.$message.warning(res.message)
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.transferLoading = false
        })
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
}
.scope {
  font-size: 16px;
  color:#333;
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
.gift-avatar {
  border: 1px solid #ececec;
}
.avatar-content {
  width: 60px;
  height: 60px;
  // overflow: hidden;
  border-radius: 50%;
  position: relative;
  // &:hover .gift-ful {
  //   display: flex;
  // }
  .gift-ful {
    cursor: pointer;
    position: absolute;
    top: -4px;
    right: -16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 20px;
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
</style>
