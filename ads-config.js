(function (w) {
  "use strict";

  w.NEWSANTARA_ADS_CONFIG = {
    enabled: true,

    // GAM Network Code：确认后台真实编号后替换
    gamNetworkCode: "REPLACE_GAM_NETWORK_CODE",

    // AdSense Client ID：确认后替换
    adsenseClient: "ca-pub-REPLACE_CLIENT_ID",

    placements: {
      "home-banner-mid-1": {
        enabled: true,
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/home-banner-1",
        adsenseSlot: "REPLACE_ADSENSE_SLOT_1",
        mgidSiteId: "REPLACE_MGID_SITE_ID",
        mgidWidgetId: "REPLACE_MGID_WIDGET_1"
      },
      "home-banner-mid-2": {
        enabled: true,
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/home-banner-2",
        adsenseSlot: "REPLACE_ADSENSE_SLOT_2",
        mgidSiteId: "REPLACE_MGID_SITE_ID",
        mgidWidgetId: "REPLACE_MGID_WIDGET_2"
      },
      "article-banner-top": {
        enabled: true,
        network: "off",
        gamPath: "/REPLACE_GAM_NETWORK_CODE/Newsantara/article-banner-1",
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
