(function (w) {
  "use strict";

  w.NEWSANTARA_ADS_CONFIG = {
    enabled: false,

    // ===== 閸忋劌鐪獮鍐插酱閸欏倹鏆?=====
    gamNetworkCode: "22170096573",
    adsenseClient: "ca-pub-REPLACE_CLIENT_ID",

    // ===== 楠炲灝鎲℃担宥夊帳缂?=====
    // network 閸欘垶鈧绱癵am / adsense / mgid / off
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
        network: "gam",
        gamPath: "/22170096573/hc1.newsantara_home_banner_mid",
        sizes: [[300, 250]],
        adsenseSlot: "REPLACE_ADSENSE_SLOT_2",
        mgidSiteId: "REPLACE_MGID_SITE_ID",
        mgidWidgetId: "REPLACE_MGID_WIDGET_2"
      },

      "home-banner-bottom": {
        enabled: true,
        network: "gam",
        gamPath: "/22170096573/hc1.newsantara_home_banner_bottom",
        sizes: [[300, 250]]
      },

      "article-banner-top": {
        enabled: true,
        network: "gam",
        gamPath: "/22170096573/hc1.newsantara_detail_banner_top",
        sizes: [[300, 250]],
        adsenseSlot: "REPLACE_ADSENSE_SLOT_3",
        mgidSiteId: "REPLACE_MGID_SITE_ID",
        mgidWidgetId: "REPLACE_MGID_WIDGET_3"
      },

      "site-anchor": {
        enabled: true,
        network: "gam",
        gamPath: "/22170096573/hc1.newsantara_home_anchor"
      },

      "site-interstitial": {
        enabled: true,
        network: "gam",
        gamPath: "/22170096573/hc1.newsantara_home_inter"
      }
    }
  };
})(window);
