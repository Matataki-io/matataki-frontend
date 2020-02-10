<template>
  <div class="user-main">
    <h2 class="tag-title">
      持有的流动金
    </h2>

    <div v-loading="loading" class="card-container buycoins">
      <div class="line" />

      <el-table
        :data="pointLog.list"
        :expand-row-keys="expands"
        class="hide-expand-button"
        style="width: 100%"
        row-key="token_id"
      >
        <el-table-column
          prop="total_supply"
          label="Fan票"
        >
          <template slot-scope="scope">
            <router-link :to="{name: 'token-id', params: {id: scope.row.token_id}}" class="fl ac">
              <avatar :src="cover(scope.row.logo)" size="30px" style="margin-right: 10px;" />
              <span class="scope">{{ scope.row.symbol }}({{ scope.row.name }})</span>
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
          prop="total_supply"
          label="我的流动金Token"
        >
          <template slot-scope="scope">
            <span class="scope">{{ liquidity(scope.row.liquidity_balance, scope.row.decimals) }} ({{ percent(scope.row.liquidity_balance, scope.row.total_supply) }})</span>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <holdliquidityDetail v-if="expands[0] === scope.row.token_id" :id="scope.row.token_id" />
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label=""
          width="220"
        >
          <template slot-scope="scope">
            <div class="invite-block btn">
              <el-button @click="foldingClick(scope.row.token_id)" type="text" class="info-button" size="small" style="margin-right: 10px;">
                <span v-if="expands[0] !== scope.row.token_id" class="expand-button">
                  展开明细
                  <i class="el-icon-d-arrow-right i-spin-z90" />
                </span>
                <span v-else class="expand-button">
                  收起明细
                  <i class="el-icon-d-arrow-right i-spin-f90" />
                </span>
              </el-button>
              <router-link :to="{name: 'exchange', hash: '#swap', query: { output: scope.row.symbol }}">
                <el-button type="primary" class="info-button" size="small">
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
    <!-- TODO: 发布后再无修改立即删除 -->
    <!-- <el-dialog
      :visible.sync="giftDialog"
      :before-close="giftDialogClose"
      title="赠送Fan票"
      width="600px"
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
        <el-form-item label="发送数量" prop="tokens">
          <el-input
            v-model="form.tokens"
            :max="form.max"
            :min="form.min"
            placeholder="请输入内容"
            size="small"
            clearable
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
    </el-dialog> -->
  </div>
</template>

<script>
import moment from 'moment'
import userPagination from '@/components/user/user_pagination.vue'
import avatar from '@/components/avatar/index.vue'
import { precision, toPrecision } from '@/utils/precisionConversion'
import holdliquidityDetail from '@/components/holdliquidity_detail/index.vue'

export default {
  components: {
    userPagination,
    avatar,
    holdliquidityDetail
  },
  data() {
    const validateToken = (rule, value, callback) => {
      if (Number(value) < this.form.min) {
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
          pagesize: 10
        },
        apiUrl: 'liquidityLogs',
        list: []
      },
      currentPage: Number(this.$route.query.holdPage) || 1,
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
        min: 0.0001,
        max: 99999999 // 默认最大
      },
      rules: {
        tokens: [
          { validator: validateToken, trigger: 'blur' }
        ]
      },
      expands: []
    }
  },
  methods: {
    createTime(time) {
      return moment(time).format('MMMDo HH:mm')
    },
    cover(cover) {
      return cover ? this.$API.getImg(cover) : ''
    },
    percent(balance, total) {
      if (balance === 0 || total === 0) {
        return '0%'
      }
      return ((parseFloat(balance) / parseFloat(total)) * 100).toFixed(2) + '%'
    },
    liquidity(balance, decimals = 4) {
      return this.$utils.fromDecimal(balance, 4)
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
      query.holdPage = i
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
    // TODO: 发布后再无修改立即删除
    // showGift(symbol, tokenId, amount, decimals) {
    //   // console.log(Math.floor(Number(amount)))
    //   this.form.tokenname = symbol
    //   this.form.tokenId = tokenId
    //   this.form.decimals = decimals
    //   this.form.max = Number(amount)
    //   this.giftDialog = true
    // },
    async searchUser() {
      if (!this.form.username.trim()) return this.$message.warning('用户名不能为空')
      this.transferLoading = true
      await this.$API.searchUsername(this.form.username.trim())
        .then(res => {
          if (res.code === 0) {
            // console.log(res)
            this.form.useravatar = res.data.avatar ? this.$API.getImg(res.data.avatar) : ''
            this.form.userId = res.data.id
          } else return this.$message.warning(res.message)
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.transferLoading = false
        })
    },
    foldingClick(id) {
      if (this.expands.length === 0 || this.expands[0] !== id) this.expands = [id]
      else this.expands = []
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
.user-main {
  background-color: #fff;
  padding: 20px;
  border-radius: @br10;
  box-sizing: border-box;
  margin-bottom: 120px;
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
