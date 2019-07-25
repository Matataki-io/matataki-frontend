<template>
  <div class="main">
    <img class="TitleImage" src="https://pic4.zhimg.com/696bec301f40b92640a01732136463e3_1200x500.jpg" alt="详解代理自动配置 PAC">
    <article>
      <header class="Post-Header">
        <h1 class="Post-Title">
          详解代理自动配置 PAC
        </h1>
        <div class="Post-Author">
          <div class="AuthorInfo">
            <img class="Avatar" width="38" height="38" src="https://pic3.zhimg.com/d0619db8314bf89a2f909627475cc774_xs.jpg" alt="Barret李靖">
            <div class="AuthorInfo-content">
              <span class="UserLink AuthorInfo-name">Barret李靖</span>
              <span class="Post-Time">发布于50分钟前</span>
              <span class="View-Num">2412</span>
            </div>
          </div>
        </div>
        <div class="Post-RichTextContainer">
          <div class="Post-RichText">
            <p>最近一直在做跨域中华局域网的工作，了解了很多代理知识和基础概念，很零散，也很细碎。希望通过一段时间的学习，能够自由地穿梭在国际互联网和中华局域网之间。后续会写一系列文章记录我了解到的知识点，本文要说的是我们平时接触比较多的 PAC，全名为 proxy auto-config。</p>
            <h3>什么是 PAC</h3>
          </div>
        </div>
      </header>
    </article>
  </div>
</template>

<script>
export default {
  components: {
  }
}
</script>

<style lang="less" scoped>
.main {
  .minHeight();
}
@width: 690px;
.TitleImage {
  display: block;
  margin: 16px auto 0;
  width: @width;
}
.Avatar {
  background: #fff;
  border-radius: 50%;
  vertical-align: top;
}
.Post-Header {
  overflow: hidden;
  width: @width;
  margin: 0 auto;
}
.Post-RichTextContainer {
  width: @width;
  margin: 0 auto;
}
.Post-RichText {
  margin-top: 20px;
}
.Post-Title {
  font-weight: 600;
  font-synthesis: style;
  font-size: 24px;
  line-height: 1.22;
  margin: 24px 0;
  word-wrap: break-word;
}
.Post-Author {
  display: flex;
  align-items: center;
  .AuthorInfo {
    flex: 1 1;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
}
.AuthorInfo-content {
  flex: 1 1;
  margin-left: 14px;
  overflow: hidden;
}
.Post-Time, .View-Num {
  .info-font();
}
</style>
