<template>
  <el-popover
    placement="bottom-start"
    width="260"
    trigger="click"
  >
    <!-- Button -->
    <template slot="reference">
      <span>
        <slot>
          🔗
        </slot>
      </span>
    </template>

    <!-- 内容 -->
    <div class="link">
      <el-input v-model="shareInput" placeholder="输入链接，包含http(s)://" />
    </div>
  </el-popover>
</template>

<script>
import { mapGetters } from 'vuex'
import { debounce } from 'lodash'

export default {
  props: {
    shareLinkList: { // 分享链接数组
      type: Array,
      required: true
    }
  },
  data() {
    return {
      shareInput: ''
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined'])
  },
  watch: {
    shareInput(newVal) {
      if (newVal) {
        this.searchLink(newVal.trim())
      }
    }
  },
  methods: {
    searchLink: debounce(async function(link) {
      console.log(link)

      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return
      }

      // 检测url格式
      const Reg = /[a-zA-z]+:\/\/[^\s]*/g
      if (!Reg.test(link)) {
        this.$message({ message: '请输入正确的 Url', type: 'warning' })
        return
      }

      // 检测是否存在了
      let shareLinkFind = this.shareLinkList.find(i => i.url === link)
      if (shareLinkFind) {
        this.$message({ message: 'Url 已经导入过了～', type: 'warning' })
        return
      }

      try {
        const res = await this.$API.extractRefTitle({ url: link })
        // const res = {'code':0,'message':'成功','data':{'ref_sign_id':0,'title':'哔哩哔哩 (゜-゜)つロ 干杯~-bilibili','summary':'bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。','cover':''}}
        // console.log('res', res)
        if (res.code === 0) {
          this.$emit('pushItem', {
            data: {
              ...res.data,
              url: link
            }
          })
          this.shareInput = ''
        } else {
          throw new Error(res)
        }
      } catch (e) {
        console.log('e', e.toString())
        this.$message({ message: '检测失败！', type: 'error' })
      }
    }, 300)
  }
}
</script>