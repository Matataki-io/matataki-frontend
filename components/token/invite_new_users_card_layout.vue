<template>
  <div class="token-card">
    <div class="token-content">
      <div
        class="share active"
      >
        <div
          ref="inviteCard"
        >
          <div>
            <!-- home -->
            <section class="home">
              <!-- background -->
              <img
                class="home-background__left"
                src="@/assets/img/index/top.png"
                alt="matataki home background"
              >
              <img
                class="home-background__right"
                src="@/assets/img/index/bottom.png"
                alt="matataki home background"
              >
              <!-- logo -->
              <img class="home-logo" src="@/assets/img/index/logo.png" alt="logo">
              <img class="home-sumary1" src="@/assets/img/index/invite_slogan1.png" alt="sumary">
              <img class="home-sumary2" src="@/assets/img/index/invite_slogan2.png" alt="sumary">
              <img class="home-sumary3" src="@/assets/img/index/invite_slogan3.png" alt="sumary">
              <!-- btn -->
              <qrcode :value="link" :options="{ width: '74' }" class="code" />
              <p class="qrcode-text">
                {{ $t('scanIt') }}<br>
                {{ $t('inviteReward.enter')}}
              </p>
              <div class="invite-synopsis">
                {{ $t('inviteReward.title') }}<br>
                {{ $t('inviteReward.text1') }}<br>
                {{ $t('inviteReward.text2') }}<br>
                {{ $t('inviteReward.text3') }}<br>
                {{ $t('inviteReward.text4') }}<br>
                {{ $t('inviteReward.text5') }}<br>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <el-button @click="save" class="save" type="primary">
      {{ $t('save') }}
    </el-button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  components: {
    qrcode: VueQrcode
  },
  props: {
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['currentUserInfo']),
    link() {
      if (process.browser && this.currentUserInfo && this.currentUserInfo.id) return `${window.location.origin}?referral=${this.currentUserInfo.id}`
      return ''
    }
  },
  watch: {
  },
  mounted() {
    console.log(document.querySelector('.p-share').offsetLeft)
    console.log(document.querySelector('.p-share').offsetTop)
  },
  methods: {
    save() {
      this.toCanvas('inviteCard')
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
        link.setAttribute('download', `${'邀请有奖'}.png`)
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
    }
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
  margin: 20px 0 40px;
}
.share {
  width: 375px;
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

.home {
  // height: 1078px;
  background-color: #fff;
  position: relative;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 812px;

  .home-background__left,
  .home-background__right {
    position: absolute;
    // height: 100%;
    width: 100%;
    user-select: none;
  }

  .home-background__left {
    top: 0;
    left: 0;
    right: 0;
  }

  .home-background__right {
    left: 0;
    right: 0;
    bottom: 0;
  }

  &-logo {
    width: 65px;
    margin: 0 auto;
    display: block;
    z-index: 9;
    user-select: none;
    margin-top: 135px;
    margin-bottom: 7px;
  }

  &-sumary1 {
    width: 173px;
    margin: 0 auto;
    display: block;
    z-index: 9;
    user-select: none;
    margin-bottom: 30px;
  }
  &-sumary2 {
    width: 262px;
    margin: 0 auto;
    display: block;
    z-index: 9;
    user-select: none;
    margin-bottom: 10px;
  }
  &-sumary3 {
    width: 262px;
    margin: 0 auto;
    display: block;
    z-index: 9;
    user-select: none;
    margin-bottom: 30px;
  }
  .qrcode-text {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    margin-top: 0px;
    margin-bottom: 33px;
    line-height:20px;
  }
  .invite-synopsis {
    font-size: 8px;
    font-weight: 600;
    line-height:20px;
    position: relative;
  }
}
</style>
