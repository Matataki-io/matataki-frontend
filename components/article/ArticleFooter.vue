<template>
  <div class="decoration">
    <p class="is-original">
      {{ $t('p.publishMatataki') }},  <el-tooltip
        v-if="license"
        placement="bottom"
      >
        <div slot="content">
          点击可查看本文的授权许可详情
        </div>
        <span class="cc-license">本文使用
          <a
            :href="license.url"
            class="license-statement"
            rel="noopener"
            target="_blank"
          >知识共享 {{ license.chinese }} 4.0</a>
          协议
        </span>
      </el-tooltip>
      <template v-if="isOriginal">
        {{ $t('p.publishMatatakOriginal') }}
      </template>
    </p>
    <p class="statement">
      {{ $t('p.publishMatatakiUser', [article.nickname || article.username]) }}
    </p>
  </div>
</template>

<script>
import { convertLicenseToChinese, licenseDetailLink } from '@/utils/creative_commons'

export default {
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    isOriginal() {
      return Boolean(this.article.is_original)
    },
    license() {
      if (!this.article.cc_license) return null
      const { cc_license: ccLicense } = this.article
      const chineseLicense = convertLicenseToChinese(ccLicense)
      const url = licenseDetailLink(ccLicense)
      return { eng: ccLicense, chinese: chineseLicense, url }
    }
  }
}
</script>

<style scoped lang="less">
.decoration {
  .statement {
    font-size:14px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height: 1.5;
    padding: 0;
    margin: 10px 0 0;
  }
  .is-original {
    padding: 0;
    margin: 40px 0 0;
    font-size:14px;
    color: #B2B2B2;
    line-height:16px;
  }
  .license-statement {
    color: #333
  }
  .license-statement:active {
    color: #333
  }
}

</style>
