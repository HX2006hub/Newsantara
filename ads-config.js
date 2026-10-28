(function (w) {
  "use strict";

  w.NEWSANTARA_ADS_CONFIG = {
    enabled: true,

    // Google Ad Manager GPT 标准配置
    // 获取真实 Network Code 后替换占位符
    gamNetworkCode: "REPLACE_GAM_NETWORK_CODE",

    // 未配置真实参数前，所有广告位保持关闭
    placements: {
      "home-banner-mid-1": {
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/home-banner-1",
        sizes: [[300, 250], [336, 280], [728, 90], [320, 100]]
      },
      "home-banner-mid-2": {
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/home-banner-2",
        sizes: [[300, 250], [336, 280], [728, 90], [320, 100]]
      },
      "article-banner-top": {
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/article-banner-1",
        sizes: [[300, 250], [336, 280], [728, 90], [320, 100]]
      },
      "site-anchor": {
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/anchor"
      },
      "site-interstitial": {
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/interstitial"
      }
    }
  };
})(window);