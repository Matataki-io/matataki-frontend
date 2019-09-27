<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="account" />

      <div v-loading="loading" class="card-container buycoins">
        <div class="line" />

        <el-table
          :data="pointLog.list"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            :label="$t('user.username')"
          >
            <template slot-scope="scope">
              <n-link class="invite-block author" :to="{name: 'user-id', params: {id: scope.row.uid}}">
                <avatar :src="cover(scope.row.avatar)" size="30px" />
                <span class="username">{{ scope.row.nickname || scope.row.username }}</span>
              </n-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="total_supply"
            :label="$t('user.tokenName')"
          >
            <template slot-scope="scope">
              <span class="scope">{{ scope.row.symbol }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="total_supply"
            :label="$t('user.positionCoins')"
          >
            <template slot-scope="scope">
              <span class="scope">{{ tokenAmount(scope.row.amount, scope.row.decimals) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label=""
            width="160"
          >
            <template>
              <div class="invite-block btn">
                <el-button class="info-button" style="margin-right: 10px;" size="small" @click="giftDialog = true">
                  {{ $t('gift') }}
                </el-button>
                <router-link :to="{name: 'exchange'}">
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
        :current-page="currentPage"
        :params="pointLog.params"
        :api-url="pointLog.apiUrl"
        :page-size="10"
        :total="total"
        :need-access-token="true"
        class="pagination"
        @paginationData="paginationData"
        @togglePage="togglePage"
      />
      <el-dialog
        title="提示"
        :visible.sync="giftDialog"
        width="600px"
        :before-close="giftDialogClose"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="60px" class="gift-form">
          <el-form-item label="币名" prop="tokenname">
            <p class="tokenname">
              {{ form.tokenname }}
            </p>
          </el-form-item>
          <el-form-item label="用户" prop="name">
            <el-input v-model="form.username" placeholder="请输入内容" size="medium">
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </el-form-item>
          <el-form-item label="数量" prop="name">
            <el-input-number
              v-model="form.tokens"
              size="small"
              :min="1"
              :max="10"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="submitForm('form')">
              确定
            </el-button>
            <el-button size="small" @click="formClose">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </template>
    <template slot="info">
      <userInfo :is-setting="true" />
    </template>
  </userLayout>
</template>

<script>
import moment from 'moment'
import userPagination from '@/components/user/user_pagination.vue'
import avatar from '@/components/avatar/index.vue'
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import { precision } from '@/utils/precisionConversion'

export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    userPagination,
    avatar
  },
  data() {
    return {
      isPublishCoins: true,
      pointLog: {
        params: {
          pagesize: 10
        },
        apiUrl: 'tokenTokenList',
        list: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0,
      assets: {
      },
      viewStatus: 0, // 0 1
      amount: 0,
      giftDialog: false,
      form: {
        tokenname: 'XTD',
        username: '',
        userId: '',
        tokens: 1,
        max: 99999999 // 默认最大
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ]
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
      this.$router.push({
        query: {
          page: i
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    formEmpty() {
      this.form.tokenname = ''
      this.form.username = ''
      this.form.userId = ''
      this.form.tokennumber = 1
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
  margin-left: 10px;
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
