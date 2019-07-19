# Smart Signature Front End
Sign it if you mean it. Let's Buidl! 🏄

- Live Demo: 🙋👉 [Production](https://smartsignature.io/) | [Staging](https://staging.smartsignature.io) | [Testing](https://testing.smartsignature.io)

- Other Resources: [Backend Repo](https://github.com/smart-signature/smart-signature-backend) | [Backend Doc](https://github.com/smart-signature/smart-signature-backend/blob/master/doc.md) | [Contract](https://github.com/smart-signature/smart-signature-EOS-contract) | [Documentation about Project](https://shimo.im/docs/UOYT3DqklCYBbzny) | [Whitepaper (Draft)](https://hackmd.io/Q3KNkxjgSwKRJ5cfBL2I4g)

Newcomes are encouraged to checkout our [good first issue](https://github.com/smart-signature/smart-signature-future/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) first. In order to be involved, you must to create your own branch and send pull request to the test branch. [Don't trust, verify](https://www.reddit.com/r/Bitcoin/comments/5ezw5o/dont_trust_verify/). 

新人请从 [good first issue](https://github.com/smart-signature/smart-signature-future/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) 开始。

为了能够合并，你需要创建自己的分支并将 Pull Request 发送到 `testing` 分支。[無徵，不信](https://zh.wikisource.org/zh/%E7%A6%AE%E8%A8%98/%E4%B8%AD%E5%BA%B8)。


## 为什么前端在线预览没有更新？

前端在线预览是实时依据 `testing` 分支实时部署更新的，没有人工干预。

* 如果用的是 testing 版本，可能是浏览器缓存问题。建议清空缓存或在本地 serve。

* 如果用的是 Production 或 Staging 版本，为了加载性能、节省流量、提升用户首屏体验，使用了 [Service Worker (服務工作線程)](https://developers.google.cn/web/fundamentals/primers/service-workers/?hl=zh-tw)。部分支持 Service Worker 的浏览器 **会使用你上一次访问网站的缓存**，所以**可能会出现没有更新的感觉**。

### 如何知道网站是否在更新并使用最新版本？
对于不支持 Service Worker 的浏览器，你使用的应该是最新的版本。（不排除你用的是浏览器给的历史缓存，建议使用 Konami 秘籍查看版本信息？）

对于支持 Service Worker 的浏览器，在 Production 或 Staging 版本下，浏览器像打开 App 一样**立刻加载**上一次你使用的版本缓存，然后后台会**自动检测更新**。更新成功后，如下图所示，点击刷新按钮即可使用最新版本。

![](https://ws3.sinaimg.cn/large/006tKfTcgy1g1d2zjjptqj30gk0hyt96.jpg)


## Project setup
```
npm install # 直接 `yarn` 也行，推荐使用 yarn，速度更快
npm run serve # Compiles and hot-reloads for development
npm run build-dev # Compiles for development
npm run build-prod # Compiles and minifies for production
npm run lint  # Lints and fixes files
```

## Libs we love
- [Zarm UI](https://zhongantecheng.github.io/zarm-vue/#/documents/quick-start)
- [Dfuse](https://www.dfuse.io/en)
- [IPFS telegra.ph clone](https://github.com/alexstep/ipfs-telegra.ph)


## 术语统一
- 投资（tip）、赞助（sponsor）、支持（support）、投资（invest）：转账给作者的行为。
- 分享（share）、复制（copy）：生成与我相关联的分享链接，并将链接分享到社交网站的行为。

## 開發前先讀一讀
- https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Using_promises#%E5%9C%A8%E8%88%8A%E6%9C%89_API_%E4%B8%8A%E5%BB%BA%E7%AB%8B_Promise