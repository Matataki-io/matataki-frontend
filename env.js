module.exports = {
  development: {
    NODE: 'development',
    NODE_ENV: 'development',
    VUE_APP_API: 'https://apitest.mttk.net',
    VUE_APP_MATATAKIAUTH_API: 'https://auth.matataki.io/apitest',
    VUE_APP_MATATAKI_CACHE: 'https://cache.ayaka.moe/matatakitest',
    VUE_APP_DEVELOPER: 'https://developer.matataki.io',
    VUE_APP_DEVELOPER_API: 'https://developer.matataki.io/api',
    VUE_APP_URL: 'https://test.matataki.io',
    VUE_APP_SIGNATURE_CONTRACT: 'dragonquest2',
    VUE_APP_SCRIPT_HASH: '36df9722fc0ff5fa3979f2a844a012cabe1d4c56',
    VUE_APP_GITHUB_CLIENT_ID: '889e6eafa77e2e87a08c',
    VUE_APP_VNT_CONTRACT: '0xa5955423c3d3535206dd303359ed5f83b226d03a',
    ssImgAddress: 'https://ssimg.frontenduse.top',
    VUE_APP_PC_URL: 'http://localhost:8080',
    WX_SHARE_HOST: 'https://sstest.frontenduse.top',
    VUE_APP_HCAPTCHA_SITE_KEY: 'add3227a-649b-4e14-b286-d6c917f9b775',
    TELEGRAM_IV_RHASH: '71acceb5462fa6',
    TELEGRAM_BOT_NAME: 'matataki_testing_bot',
    TELEGRAM_BOT_ROOT_NAME: 'matataki_test_mobile_bot',
    TELEGRAM_BOT_IN_WX: 'matataki_test_wx_bot',
    TELEGRAM_FANDOM_BOT: 'matataki_testing_bot',
    TWITTER_APP_KEY: 'LdQ6moi0sfGzsPBtVMxjPhbeq',
    FANDOM_SERVER_API: 'https://fanpiao-bot-data.web.app',
    VUE_APP_WX_URL: 'http://localhost:8080',
    VUE_APP_DOMAIN_IO: 'matataki.io', // 前端用来判断在 io 还是非 io
    // VUE_APP_DOMAIN_IO: 'localhost', // 前端用来判断在 io 还是非 io
    VUE_APP_DOMAIN_CN: 'matataki.cn', // 前端用来判断在 cn 还是非 cn
    VUE_APP_ETHERSCAN: 'https://rinkeby.etherscan.io',
    VUE_APP_BSCSCAN: 'https://testnet.bscscan.com',
  },
  testing: {
    NODE: 'testing',
    NODE_ENV: 'testing',
    VUE_APP_API: 'https://apitest.mttk.net',
    VUE_APP_URL: 'https://test.matataki.io',
    VUE_APP_MATATAKIAUTH_API: 'https://auth.matataki.io/apitest',
    VUE_APP_MATATAKI_CACHE: 'https://cache.ayaka.moe/matatakitest',
    VUE_APP_DEVELOPER: 'https://developer.matataki.io',
    VUE_APP_DEVELOPER_API: 'https://developer.matataki.io/api',
    VUE_APP_SIGNATURE_CONTRACT: 'dragonquest2',
    VUE_APP_SCRIPT_HASH: '36df9722fc0ff5fa3979f2a844a012cabe1d4c56',
    VUE_APP_GITHUB_CLIENT_ID: '889e6eafa77e2e87a08c',
    VUE_APP_VNT_CONTRACT: '0xa5955423c3d3535206dd303359ed5f83b226d03a',
    VUE_APP_HCAPTCHA_SITE_KEY: 'add3227a-649b-4e14-b286-d6c917f9b775',
    ssImgAddress: 'https://ssimg.frontenduse.top',
    VUE_APP_PC_URL: 'https://test.matataki.io',
    WX_SHARE_HOST: 'https://sstest.frontenduse.top',
    TELEGRAM_IV_RHASH: '71acceb5462fa6',
    TELEGRAM_BOT_NAME: 'matataki_testing_bot',
    TELEGRAM_BOT_ROOT_NAME: 'matataki_test_mobile_bot',
    TELEGRAM_BOT_IN_WX: 'matataki_test_wx_bot',
    TELEGRAM_FANDOM_BOT: 'matataki_testing_bot',
    TWITTER_APP_KEY: 'LdQ6moi0sfGzsPBtVMxjPhbeq',
    FANDOM_SERVER_API: 'https://fanpiao-bot-data.web.app',
    VUE_APP_WX_URL: 'https://sstest.frontenduse.top',
    VUE_APP_DOMAIN_IO: 'matataki.io',
    VUE_APP_DOMAIN_CN: 'matataki.cn',
    VUE_APP_ETHERSCAN: 'https://rinkeby.etherscan.io',
    VUE_APP_BSCSCAN: 'https://testnet.bscscan.com',
  },
  release: {
    NODE: 'production',
    NODE_ENV: 'production',
    VUE_APP_API: 'https://api.mttk.net',
    VUE_APP_URL: 'https://matataki.io',
    VUE_APP_MATATAKIAUTH_API: 'https://auth.matataki.io/api',
    VUE_APP_MATATAKI_CACHE: 'https://cache.ayaka.moe/matataki',
    VUE_APP_DEVELOPER: 'https://developer.matataki.io',
    VUE_APP_DEVELOPER_API: 'https://developer.matataki.io/api',
    VUE_APP_SIGNATURE_CONTRACT: 'signature.bp',
    VUE_APP_SCRIPT_HASH: '36df9722fc0ff5fa3979f2a844a012cabe1d4c56',
    VUE_APP_GITHUB_CLIENT_ID: '21cc5341ef03f40cd5a4',
    // @todo: change them when go to mainnet
    VUE_APP_HCAPTCHA_SITE_KEY: 'add3227a-649b-4e14-b286-d6c917f9b775',
    VUE_APP_VNT_CONTRACT: '0xa5955423c3d3535206dd303359ed5f83b226d03a',
    ssImgAddress: 'https://ssimg.frontenduse.top',
    VUE_APP_PC_URL: 'https://www.matataki.io',
    WX_SHARE_HOST: 'https://smartsignature.frontenduse.top',
    TELEGRAM_IV_RHASH: '6937cb5e3b86c1',
    TELEGRAM_BOT_NAME: 'matataki_prod_pc_bot',
    TELEGRAM_BOT_ROOT_NAME: 'matataki_prod_mobile_bot',
    TELEGRAM_BOT_IN_WX: 'matataki_prod_wx_bot',
    TELEGRAM_FANDOM_BOT: 'matatakibot',
    TWITTER_APP_KEY: 'vvaFC5N3pYhkF2HsKQFFaLGct',
    FANDOM_SERVER_API: 'https://fanpiao-bot-data-prod.web.app',
    VUE_APP_WX_URL: 'https://smartsignature.frontenduse.top',
    VUE_APP_DOMAIN_IO: 'matataki.io',
    VUE_APP_DOMAIN_CN: 'matataki.cn',
    VUE_APP_ETHERSCAN: 'https://rinkeby.etherscan.io',
    VUE_APP_BSCSCAN: 'https://bscscan.com',
  },
  production: {
    NODE: 'production',
    NODE_ENV: 'production',
    VUE_APP_API: 'https://api.mttk.net',
    VUE_APP_URL: 'https://matataki.io',
    VUE_APP_MATATAKIAUTH_API: 'https://auth.matataki.io/api',
    VUE_APP_MATATAKI_CACHE: 'https://cache.ayaka.moe/matataki',
    VUE_APP_DEVELOPER: 'https://developer.matataki.io',
    // @todo: change them when go to mainnet
    VUE_APP_HCAPTCHA_SITE_KEY: 'add3227a-649b-4e14-b286-d6c917f9b775',
    VUE_APP_DEVELOPER_API: 'https://developer.matataki.io/api',
    VUE_APP_SIGNATURE_CONTRACT: 'signature.bp',
    VUE_APP_SCRIPT_HASH: '36df9722fc0ff5fa3979f2a844a012cabe1d4c56',
    VUE_APP_GITHUB_CLIENT_ID: '21cc5341ef03f40cd5a4',
    VUE_APP_VNT_CONTRACT: '0xa5955423c3d3535206dd303359ed5f83b226d03a',
    ssImgAddress: 'https://ssimg.frontenduse.top',
    VUE_APP_PC_URL: 'https://www.matataki.io',
    WX_SHARE_HOST: 'https://smartsignature.frontenduse.top',
    TELEGRAM_IV_RHASH: '6937cb5e3b86c1',
    TELEGRAM_BOT_NAME: 'matataki_prod_pc_bot',
    TELEGRAM_BOT_ROOT_NAME: 'matataki_prod_mobile_bot',
    TELEGRAM_BOT_IN_WX: 'matataki_prod_wx_bot',
    TELEGRAM_FANDOM_BOT: 'matatakibot',
    TWITTER_APP_KEY: 'vvaFC5N3pYhkF2HsKQFFaLGct',
    FANDOM_SERVER_API: 'https://fanpiao-bot-data-prod.web.app',
    VUE_APP_WX_URL: 'https://smartsignature.frontenduse.top',
    VUE_APP_DOMAIN_IO: 'matataki.io',
    VUE_APP_DOMAIN_CN: 'matataki.cn',
    VUE_APP_ETHERSCAN: 'https://rinkeby.etherscan.io',
    VUE_APP_BSCSCAN: 'https://bscscan.com',
  }
}
