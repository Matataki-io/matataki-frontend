<template>
    <div class="share-main">
      <svg-icon class="icon" icon-class="quotation_marks" />
      <svg-icon class="icon" icon-class="quotation_marks" />
    <p>视差滚动是一种效果，其中背景图像的滚动速度比前景中的元素慢，从而产生了页面深度的错觉。
网站通常将其用于信息页面，您在前景页面中有一些文本，而在背景图像中的图像滚动得更慢，从而为用户创造了更有趣的体验。
https://www.mockplus.com/blog/post/parallax-scrolling-websites提供了一些具有视差滚动功能的网页示例。
使用React，可以使用位于https://github.com/apertureless/vue-parallax的V ue-Parallaxy库创建视差滚动效果，该方法既快速又简单。
在本文中，我们将制作一个应用程序，差滚动是一种效果，其中背景图像的滚动速度比前景中的元素慢，从而产生了页面深度的错觉。
网站通常将其用于信息页面，您在前景页面中有一些文本，而在背景图像中的图像滚动得更慢，从而为用户创造了更有趣的体验。
https://www.mockplus.com/blog/post/parallax-scrolling-websites提供了一些具有视差滚动功能的网页示例。
使用React，可以使用位于https://github.com/apertureless/vue-parallax的V ue-Parallaxy库创建视差滚动效果，该方法既快速又简单。
在本文中，我们将制作一个应用程序，差滚动是一种效果，其中背景图像的滚动速度比前景中的元素慢，从而产生了页面深度的错觉。
网站通常将其用于信息页面，您在前景页面中有一些文本，而在背景图像中的图像滚动得更慢，从而为用户创造了更有趣的体验。
https://www.mockplus.com/blog/post/parallax-scrolling-websites提供了一些具有视差滚动功能的网页示例。
使用React，可以使用位于https://github.com/apertureless/vue-parallax的V ue-Parallaxy库创建视差滚动效果，该方法既快速又简单。
在本文中，我们将制作一个应用程序，在后台显示图像列表，并在前景显示标签文本。这些图像将由PID API提供。您可以在PID中注册API密钥。
要启动项目，我们通过运行以下命令创建项目：</p>
  </div>
</template>

<style lang="less" scoped>
.share-main {
  margin: 0 20px;
  padding: 0 20px 140px 20px;
  position: relative;
  .icon {
    position: absolute;
    color: @purpleDark;
    font-size: 14px;
    &:nth-child(1) {
      left: 0;
      top: 0;
    }
    &:nth-child(2) {
      bottom: 0;
      right: 0;
      transform: rotate(-180deg);
    }
  }
  p {
    font-size:14px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:20px;
    padding: 0;
    margin: 0;
    word-break: break-all;
  }
}
</style>