<template>
  <div>
    <!-- head tab 切换 -->
    <headTab :sort-value="sortValue" @change="val => sortValue = val" />

    <!-- 数据统计 -->
    <div class="c-card dashboard-container">
      <h4 class="db-title">
        {{ $t("dashboard.statistics") }}
      </h4>
      <transition name="fade">
        <div ref="toggle" class="db-toggle" :class="typeToggleSwitch && 'showAll'">
          <div
            v-for="(item, index) in typeToggle"
            :key="index"
            class="db-t-block"
            :class="item.token_id == typeToggleVal && 'active'"
            @click="toggleType(item.token_id)"
          >
            <p class="db-t-b-title">
              {{ item.symbol }}&nbsp;<span>{{ $t("dashboard.today") }}<span>+{{ amount(item.now, item.decimals) || 0 }}</span></span>
            </p>
            <client-only>
              <span 
                v-if="amount(item.amount, item.decimals) < 1"
                class="db-t-b-number"
              >{{ amount(item.amount, item.decimals) }}</span>
              <ICountUp
                v-show="amount(item.amount, item.decimals) >= 1"
                :delay="delay"
                :end-val="amount(item.amount, item.decimals)"
                :options="CountUpOptions"
                class="db-t-b-number"
              />
            </client-only>
          </div>
        </div>
      </transition>
      <section v-if="showToggleSwitch" class="toggle">
        <span @click="typeToggleSwitchClick">
          {{ typeToggleSwitch ? $t("dashboard.collapseAll") : $t("dashboard.expandAll") }}
          <i class="el-icon-d-arrow-right icon" :class="typeToggleSwitch && 'active'" />
        </span>
      </section>
    </div>

    <!-- 来源稿件 -->
    <div class="c-card dashboard-container">
      <h4 class="db-title">
        {{ $t("dashboard.sourceManuscript") }}
      </h4>
      <tab
        class="db-mt10"
        :tab="tabListArticleType"
        :value="tabListArticleVal"
        @change="tabListArticleChange"
      />
      <client-only>
        <el-table
          v-show="$utils.clientWidth() >= 768"
          class="db-mt20 table-list"
          :data="pull.list"
          style="width: 100%"
        >
          <el-table-column :label="$t('rank')" width="80">
            <template slot-scope="scope">
              <span class="table-text" :class="getRankClass(rank(scope.$index, pull.currentPage, pull.params.pagesize))">{{ rank(scope.$index, pull.currentPage, pull.params.pagesize) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('title')">
            <template slot-scope="scope">
              <span class="table-text" :class="getRankClass(rank(scope.$index, pull.currentPage, pull.params.pagesize))">
                <n-link target="_blank" :to="{name: 'p-id', params: { id: scope.row.post_id }}">
                  {{ scope.row.post_title }}
                </n-link>
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('releaseTime')" width="200">
            <template slot-scope="scope">
              <span class="table-text" :class="getRankClass(rank(scope.$index, pull.currentPage, pull.params.pagesize))">{{ time(scope.row.create_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('dashboard.paymentAmount')" width="100">
            <template slot-scope="scope">
              <span class="table-text" :class="getRankClass(rank(scope.$index, pull.currentPage, pull.params.pagesize))">{{ amount(scope.row.amount , scope.row.decimals ) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-show="$utils.clientWidth() < 768"
          class="db-mt20 table-list"
          :data="pull.list"
          style="width: 100%"
        >
          <el-table-column :label="$t('rank')" width="50">
            <template slot-scope="scope">
              <span class="table-text" :class="getRankClass(rank(scope.$index, pull.currentPage, pull.params.pagesize))">{{ rank(scope.$index, pull.currentPage, pull.params.pagesize) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('title')">
            <template slot-scope="scope">
              <span class="table-text" :class="getRankClass(rank(scope.$index, pull.currentPage, pull.params.pagesize))">
                <n-link target="_blank" :to="{name: 'p-id', params: { id: scope.row.post_id }}">
                  {{ scope.row.post_title }}
                </n-link>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </client-only>
      <c-user-pagination
        :url-replace="tabListArticleVal"
        :current-page="pull.currentPage"
        :params="pull.params"
        :api-url="pull.apiUrl"
        :page-size="pull.params.pagesize"
        :total="pull.total"
        :reload="pull.reload"
        :need-access-token="true"
        class="pagination"
        @paginationData="paginationData"
        @togglePage="togglePage"
      />
    </div>
    
    <!-- 收益流水 -->
    <div class="c-card dashboard-container">
      <div class="fl ac jsb">
        <h4 class="db-title">
          {{ $t("dashboard.revenueStream") }}
        </h4>
        <el-select
          v-model="flowValue"
          :placeholder="$t('dashboard.pleaseChoose')"
          size="small"
        >
          <el-option
            v-for="item in flowOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <client-only>
        <el-table
          class="db-mt20 table-list"
          :data="pullFlow.list"
          style="width: 100%"
        >
          <el-table-column :label="$t('dashboard.serialNumber')" width="50">
            <template slot-scope="scope">
              <span class="table-text">{{ rank(scope.$index, pullFlow.currentPage, pullFlow.params.pagesize) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('dashboard.detail')">
            <template slot-scope="scope">
              <span class="table-text">
                <n-link target="_blank" :to="{name: 'user-id', params: { id: scope.row.user_id }}">
                  {{ scope.row.nickname || scope.row.username }}
                </n-link>
                {{ $t('dashboard.in') }}
                <n-link target="_blank" :to="{name: 'p-id', params: { id: scope.row.post_id }}">
                  「{{ scope.row.post_title }}」
                </n-link>
                {{ scope.row.type === 'reward' ? $t('dashboard.rewarded') : scope.row.type === 'sale' ? $t('dashboard.paid') : $t('dashboard.consumed') }}
                {{ amount(scope.row.amount , scope.row.decimals) }}
                <n-link v-if="scope.row.token_id !== 0" target="_blank" :to="{name: 'token-id', params: { id: scope.row.token_id }}">
                  {{ scope.row.symbol }}
                </n-link>
                <template v-else>{{ scope.row.symbol }}</template>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="$utils.clientWidth() >= 768"
            :label="$t('time')"
            width="200"
          >
            <template slot-scope="scope">
              <span class="table-text">{{ time(scope.row.create_time) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </client-only>
      <c-user-pagination
        :current-page="pullFlow.currentPage"
        :params="pullFlow.params"
        :api-url="pullFlow.apiUrl"
        :page-size="pullFlow.params.pagesize"
        :total="pullFlow.total"
        :reload="pullFlow.reload"
        :need-access-token="true"
        class="pagination"
        @paginationData="paginationDataFlow"
        @togglePage="togglePageFlow"
      />
    </div>
  </div>
</template>

<script>
import headTab from '@/components/dashboard/dashboard_head_tab'
import tab from '@/components/dashboard/dashboard_tab'
import { precision } from '@/utils/precisionConversion'
import debounce from 'lodash/debounce'

let ICountUp = null
if (process.client) {
  ICountUp = require('vue-countup-v2')
}

export default {
  components: {
    headTab,
    tab,
    ICountUp
  },
  data() {
    return {
      sortValue: '30', // 天数排序
      typeToggleVal: 0,
      typeToggle: [],
      typeToggleSwitch: false,
      tabListArticleVal: 'reward',
      tabListArticleType: [
        {
          value: 'reward',
          label: this.$t('reward'),
        },
        {
          value: 'sale',
          label: this.$t('pay'),
        }
      ],
      flowOptions: [{
        value: 'follow',
        label: this.$t('dashboard.followFilter'),
      }, {
        value: 'notFollow',
        label: this.$t('dashboard.notFollowFilter'),
      }],
      flowValue: 'follow',
      delay: 1000,
      CountUpOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: ''
      },
      // 分页数据
      pull: {
        params: {},
        apiUrl: 'dbIncomeSourceType',
        list: [],
        currentPage:1,
        total: 0,
        loading: false,
        reload: 0
      },
      // 分页数据
      pullFlow: {
        params: {},
        apiUrl: 'dbIncomeHistory',
        list: [],
        currentPage:1,
        total: 0,
        loading: false,
        reload: 0
      },
    }
  },
  computed: {
    showToggleSwitch() {
      if (process.browser) {
        try {
          let width = document.body.clientWidth || document.documentElement.clientWidth
          if (width > 768) { // 一行 四个 大于八个显示
            return this.typeToggle.length > 8
          } else if (width <= 768) { // 一行两个、三个 大于六个显示
            return this.typeToggle.length > 6
          } else { // 不在范围内
            return false
          }
        } catch (e) {
          console.log(e)
          return false
        }
      } else {
        return this.typeToggle.length > 8
      }
    }
  },
  watch: {
    // 天数切换
    sortValue(val) {
      this.getData(val)
    },
    // 类别切换
    tabListArticleVal() {
      if (this.pull.currentPage === 1) {
        this.pull.reload = Date.now()
      } else {
        this.pull.currentPage = 1
      }
    },
  },
  created() {
    if (process.browser) {
      this.getData(this.sortValue)
    }
  },
  methods: {
    // 获取数据
    async getData(days) {
      let dataCountParams = null
      if (days !== 'all') {
        dataCountParams = {
          days
        }
      }
      const dataCountResult = await this.$utils.factoryRequest(this.$API.dbIncomeSum(dataCountParams))
      if (dataCountResult) {
        this.typeToggle = dataCountResult.data

        if (dataCountResult.data.length >= 1) {
          
          // 设置第一个块聚焦
          this.typeToggleVal = dataCountResult.data[0].token_id

          this.getArticleList(dataCountResult.data[0].token_id)
          this.getFlowList(dataCountResult.data[0].token_id)
        }
      }
      // 今日数据
      const nowDataCountResult = await this.$utils.factoryRequest(this.$API.dbIncomeSum({
        days: 1
      }))
      if (nowDataCountResult) {
        let list = nowDataCountResult.data
        for (let i = 0, len = list.length; i < len; i++) {
          for (let j = 0, len = this.typeToggle.length; j < len; j++) {
            if (list[i].token_id === this.typeToggle[j].token_id && list[i].symbol === this.typeToggle[j].symbol) {
              this.typeToggle[j].now = list[i].amount
            } else {
              this.typeToggle[j].now = 0
            }
          }
        }
      }
    },
    // 获取来源稿件
    getArticleList(tokenId) {
      this.pull.list.length = 0
      this.pull.params = {} // 不进行请求
      this.pull.currentPage = 1
      setTimeout(() => { // 加入宏任务等分页组件判断完
        this.pull.params = {
          tokenId,
          days: this.sortValue === 'all' ? '' : this.sortValue,
          pagesize: 10
        }
      }, 25)
    },
    // 收益流水
    getFlowList(tokenId) {
      this.pullFlow.list.length = 0
      this.pullFlow.params = {} // 不进行请求
      this.pullFlow.currentPage = 1
      setTimeout(() => {  // 加入宏任务等分页组件判断完
        this.pullFlow.params = {
          tokenId,
          days: this.sortValue === 'all' ? '' : this.sortValue,
          pagesize: 20
        }
      }, 25)
    },
    // 切换数据统计模块
    toggleType(tokenId) {

      // 切换块
      this.typeToggleVal = tokenId

      this.getArticleList(tokenId)

      // 跟随切换
      if (this.flowValue === 'follow') {
        this.getFlowList(tokenId)
      }
    },
    // tab切换
    tabListArticleChange: debounce(function(label) {
      this.tabListArticleVal = label
    }, 300),
    // 精度格式化
    amount(amount, decimals) {
      return precision(amount, 'CNY', decimals)
    },
    // 返回排名
    getRankClass(rank) {
      let list = {
        1: 'one',
        2: 'two',
        3: 'three'
      }
      return list[rank] || ''
    },
    time(time) {
      return time ? this.moment(time).format('YYYY-MM-DD HH:mm') : ''
    },
    // index rank
    rank(index, page, pagesize) {
      const indexFunc = (index, page, pagesize) => {
        let limit = (page - 1) * pagesize
        return (index + limit) + 1
      }
      return indexFunc(index, page, pagesize)
    },
    paginationData(res) {
      // console.log('res', res)
      this.pull.list = res.data.list
      this.pull.total = res.data.count || 0
      this.pull.loading = false
    },
    togglePage(i) {
      this.pull.loading = true
      this.pull.currentPage = i
      this.pull.list.length = 0
    },
    paginationDataFlow(res) {
      // console.log('res', res)
      this.pullFlow.list = res.data.list
      this.pullFlow.total = res.data.count || 0
      this.pullFlow.loading = false
    },
    togglePageFlow(i) {
      this.pullFlow.loading = true
      this.pullFlow.currentPage = i
      this.pullFlow.list.length = 0
    },
    // 数据统计展开和收回切换
    typeToggleSwitchClick() {

      try {
        this.$refs.toggle.scrollTop = 0
      } catch (e) {
        console.log(e)
      }

      this.typeToggleSwitch = !this.typeToggleSwitch
    },
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>

<style lang="less" scoped>
.toggle {
  text-align: center;
  margin-top: 20px;
  span {
    font-size: 14px;
    color: #333;
    cursor: pointer;
    .icon {
      transform: rotate(90deg);
      &.active {
        transform: rotate(-90deg);
      }
    }
  }
}
.db-toggle {
  max-height: 302px;
  transition: all .3s ease;
  overflow: hidden;
}
.showAll {
  max-height: 594px !important;
  overflow: auto !important;
}
</style>