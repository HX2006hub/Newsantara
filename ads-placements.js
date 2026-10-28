(function (w) {
  "use strict";
  w.ADS_PLACEMENTS = {
    home: [
      { key: "home-banner-mid-1", type: "banner", selector: '[data-ad-slot="banner-mid-1"]' },
      { key: "home-banner-mid-2", type: "banner", selector: '[data-ad-slot="banner-mid-2"]' },
      { key: "home-banner-bottom", type: "banner", selector: '[data-ad-slot="banner-bottom"]' }
    ],
    article: [
      { key: "article-banner-top", type: "banner", selector: '[data-ad-slot="article-banner-top"]' }
    ],
    homeGlobal: [
      { key: "site-anchor", type: "anchor" },
      { key: "site-interstitial", type: "interstitial" }
    ]
  };
})(window);