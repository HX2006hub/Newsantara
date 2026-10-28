(function (w) {
  "use strict";

  w.NEWSANTARA_ADS_CONFIG = {
    enabled: true,

    // ===== 全局平台参数 =====
    gamNetworkCode: "22170096573",
    adsenseClient: "ca-pub-REPLACE_CLIENT_ID",

    // ===== 广告位配置 =====
    // network 可选：gam / adsense / mgid / off
    placements: {
      "home-banner-mid-1": {
        enabled: true,
        network: "gam",
        gamPath: "/22170096573/hc1.newsantara_home_banner_top",
        sizes: [[300, 250]],
        adsenseSlot: "REPLACE_ADSENSE_SLOT_1",
        mgidSiteId: "REPLACE_MGID_SITE_ID",
        mgidWidgetId: "REPLACE_MGID_WIDGET_1"
      },

      "home-banner-mid-2": {
        enabled: true,
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/home-banner-2",
        sizes: [[300, 250], [336, 280], [728, 90], [320, 100]],
        adsenseSlot: "REPLACE_ADSENSE_SLOT_2",
        mgidSiteId: "REPLACE_MGID_SITE_ID",
        mgidWidgetId: "REPLACE_MGID_WIDGET_2"
      },

      "article-banner-top": {
        enabled: true,
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/article-banner-1",
        sizes: [[300, 250], [336, 280], [728, 90], [320, 100]],
        adsenseSlot: "REPLACE_ADSENSE_SLOT_3",
        mgidSiteId: "REPLACE_MGID_SITE_ID",
        mgidWidgetId: "REPLACE_MGID_WIDGET_3"
      },

      "site-anchor": {
        enabled: true,
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/anchor"
      },

      "site-interstitial": {
        enabled: true,
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/interstitial"
      }
    }
  };
})(window);
