<template>
  <div class="token-card">
    <p class="title">
      {{ $t('please-choose-one-of-the-card-styles') }}
    </p>
    <div class="token-content">
      <div
        :class="shareCardCheckedOne && 'active'"
        class="share"
        @click="shareCardCheckedOne = true"
      >
        <div
          ref="tokenCardOne"
        >
          <tokenShareCard
            :minetoken-token="minetokenToken"
            :minetoken-user="minetokenUser"
            :card-style="1"
          />
        </div>
      </div>
      <div
        :class="!shareCardCheckedOne && 'active'"
        class="share"
        @click="shareCardCheckedOne = false"
      >
        <div
          ref="tokenCardTwo"
        >
          <tokenShareCard
            :minetoken-token="minetokenToken"
            :minetoken-user="minetokenUser"

            :card-style="2"
          />
        </div>
      </div>
    </div>
    <el-button
      class="save"
      type="primary"
      @click="save"
    >
      {{ $t('save') }}
    </el-button>
  </div>
</template>
<script>
import tokenShareCard from './token_share_card'

export default {
  components: {
    tokenShareCard
  },
  props: {
    minetokenToken: {
      type: Object,
      required: true
    },
    minetokenUser: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      shareCardCheckedOne: true
    }
  },
  created() {
  },
  methods: {
    save() {
      if (this.shareCardCheckedOne) this.toCanvas('tokenCardOne')
      else this.toCanvas('tokenCardTwo')
    },
    saveLocal(canvas) {
      const linkTag = document.querySelector('#downloadImg')
      if (linkTag) {
        linkTag.href = canvas.toDataURL()
        linkTag.click()
      } else {
        const link = document.createElement('a')
        link.id = 'downloadImg'
        link.href = canvas.toDataURL()
        link.setAttribute('download', `${
          this.minetokenToken.symbol
        }.png`)
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
      }
    },
    toCanvas(name) {
      const loading = this.$loading({
        text: `${this.$t('p.createImg')}...`
      })
      const dom = this.$refs[name]
      // eslint-disable-next-line no-undef
      html2canvas(dom, {
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        width: dom.clientWidth,
        height: dom.clientHeight
      }).then(canvas => {
        this.saveLocal(canvas)
      }).catch((error) => {
        console.log(error)
        this.$message(this.$t('p.createFail'))
      }).finally(() => {
        loading.close()
      })
    },
    toggleShareCard() {
      this.shareCardCheckedOne = !this.shareCardCheckedOne
    },
  }
}
</script>

<style scoped lang="less">

.title {
  font-size:16px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:22px;
  text-align: center;
  padding: 0;
  margin: 40px 0 20px;
}
.token-content {
  display: flex;
  justify-content: space-around;
  margin: 0 0 40px;
}
.share {
  width: 360px;
  // height: 600px;
  cursor: pointer;
  transition: border .3s;
  box-sizing: border-box;
  border: 2px solid #f1f1f1;
  &.active {
    border: 2px solid @purpleDark;
  }
}
.check {
  margin: 10px 0 0;
}
.save {
  width: 300px;
  display: block;
  margin: 0 auto 20px;
}
</style>
