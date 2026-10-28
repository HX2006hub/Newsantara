(function (w) {
  "use strict";
  w.NEWSANTARA_ADS_CONFIG = {
    enabled: true,

    // 手动选择每个广告位的 network：gam / adsense / mgid / off
    // GAM 网络代码与各广告平台参数尚未填写时，不发送广告请求。
    gamNetworkCode: "REPLACE_GAM_NETWORK_CODE",
    adsenseClient: "ca-pub-REPLACE_CLIENT_ID",

    placements: {
      "home-banner-mid-1": {
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/home-banner-1",
        adsenseSlot: "REPLACE_ADSENSE_SLOT_1",
        mgidSiteId: "REPLACE_MGID_SITE_ID",
        mgidWidgetId: "REPLACE_MGID_WIDGET_1"
      },
      "home-banner-mid-2": {
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/home-banner-2",
        adsenseSlot: "REPLACE_ADSENSE_SLOT_2",
        mgidSiteId: "REPLACE_MGID_SITE_ID",
        mgidWidgetId: "REPLACE_MGID_WIDGET_2"
      },
      "article-banner-top": {
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/article-banner-1",
        adsenseSlot: "REPLACE_ADSENSE_SLOT_3",
        mgidSiteId: "REPLACE_MGID_SITE_ID",
        mgidWidgetId: "REPLACE_MGID_WIDGET_3"
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