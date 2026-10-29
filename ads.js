(function (w, d) {
  "use strict";

  if (w.__newsantaraAdsEngineV2) return;
  w.__newsantaraAdsEngineV2 = true;

  var C = w.NEWSANTARA_ADS_CONFIG;
  var R = w.ADS_PLACEMENTS;
  var GPT_URL = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  var ADSENSE_URL = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  var MGID_URL = "https://jsc.mgid.com/site/";

  var seen = new WeakSet();
  var gptReady = false;
  var gptInitQueued = false;
  var observer = null;
  var gptSlots = [];

  function pageName() {
    var p = w.location.pathname.toLowerCase();
    return p.indexOf("article.html") >= 0 ||
      p === "/article" || p.indexOf("/article/") === 0
      ? "article" : "home";
  }

  function pageItems() {
    if (!R) return [];
    return (R[pageName()] || []).concat(R.global || [], pageName() === "home" ? (R.homeGlobal || []) : []);
  }

  function validValue(value) {
    return !!value && !/REPLACE|YOUR_|X{3,}/i.test(String(value));
  }

  function configFor(item) {
    return C && C.placements ? C.placements[item.key] : null;
  }

  function isValid(item) {
    if (!C || C.enabled !== true) return false;

    var c = configFor(item);
    if (!c || c.enabled === false) return false;

    var network = c.network;
    if (!network || network === "off") return false;

    if (item.type !== "banner" && network !== "gam") return false;

    if (network === "gam") {
      return /^\d+$/.test(String(C.gamNetworkCode || "")) &&
        validValue(c.gamPath) &&
        c.gamPath.indexOf("/" + C.gamNetworkCode + "/") === 0;
    }

    if (network === "adsense") {
      return item.type === "banner" &&
        /^ca-pub-\d+$/.test(String(C.adsenseClient || "")) &&
        /^\d+$/.test(String(c.adsenseSlot || ""));
    }

    if (network === "mgid") {
      return item.type === "banner" &&
        /^\d+$/.test(String(c.mgidSiteId || "")) &&
        /^\d+$/.test(String(c.mgidWidgetId || ""));
    }

    return false;
  }

  function setStatus(el, value) {
    if (el) el.setAttribute("data-ad-status", value);
  }

  function show(el) {
    if (!el) return;
    var wrap = el.closest(".ad-placement-wrap");
    if (wrap) wrap.style.display = "";
    el.style.display = "";
  }

  function hide(el, reason) {
    if (!el) return;
    var wrap = el.closest(".ad-placement-wrap") || el;
    wrap.style.display = "none";
    setStatus(el, reason || "off");
  }

  function loadScript(id, src, callback) {
    var existing = d.getElementById(id);

    if (existing) {
      if (existing.dataset.loaded === "true") {
        callback();
      } else {
        existing.addEventListener("load", callback, { once: true });
      }
      return;
    }

    var script = d.createElement("script");
    script.id = id;
    script.async = true;
    script.src = src;

    script.onload = function () {
      script.dataset.loaded = "true";
      callback();
    };

    script.onerror = function () {
      d.querySelectorAll("[data-ad-status='loading']").forEach(function (el) {
        setStatus(el, "load-error");
      });
    };

    d.head.appendChild(script);
  }

  function defineGAMBanner(item, el) {
    if (!el || seen.has(el)) return;

    var c = configFor(item);
    if (!c || !isValid(item)) {
      hide(el, "not-configured");
      return;
    }

    if (!el.id) el.id = "newsantara-gpt-" + item.key;

    seen.add(el);
    show(el);
    setStatus(el, "loading");

    var slot = w.googletag.defineSlot(
      c.gamPath,
       (c.sizes || [[300,250],[336,280],[728,90],[320,100]]) ,
      el.id
    );

    if (!slot) {
      setStatus(el, "slot-unsupported");
      return;
    }

    slot.addService(w.googletag.pubads());
    gptSlots.push({ slot: slot, element: el, type: "banner" });
  }

  function defineGAMOutOfPage(item) {
    var c = configFor(item);
    if (!c || !isValid(item)) return;

    var format = item.type === "anchor"
      ? w.googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR
      : w.googletag.enums.OutOfPageFormat.INTERSTITIAL;

    var slot = w.googletag.defineOutOfPageSlot(c.gamPath, format);
    if (!slot) return;

    slot.addService(w.googletag.pubads());
    gptSlots.push({ slot: slot, element: null, type: item.type });
  }

  function startGAM(items) {
    if (gptInitQueued || !items.length) return;
    gptInitQueued = true;

    w.googletag = w.googletag || { cmd: [] };

    loadScript("newsantara-gpt-js", GPT_URL, function () {});

    w.googletag.cmd.push(function () {
      items.forEach(function (item) {
        if (item.type === "banner") {
          d.querySelectorAll(item.selector).forEach(function (el) {
            defineGAMBanner(item, el);
          });
        } else {
          defineGAMOutOfPage(item);
        }
      });

      if (!gptSlots.length) return;

      w.googletag.pubads().enableSingleRequest();
      w.googletag.enableServices();
      gptReady = true;

      gptSlots.forEach(function (entry) {
        if (entry.type === "banner") {
          w.googletag.display(entry.element.id);
          setStatus(entry.element, "requested");
        } else {
          w.googletag.display(entry.slot);
        }
      });

      gptSlots = [];
    });
  }

  function renderDynamicGAM(item, el) {
    if (!el || seen.has(el) || !isValid(item)) return;
    if (!gptInitQueued) return;

    // 鍏堟爣璁帮紝閬垮厤 MutationObserver 閲嶅鎺掗槦銆?
    seen.add(el);
    if (!el.id) el.id = "newsantara-gpt-" + item.key;

    w.googletag.cmd.push(function () {
      var c = configFor(item);
      if (!c || !isValid(item)) {
        hide(el, "not-configured");
        return;
      }

      var slot = w.googletag.defineSlot(
        c.gamPath,
         (c.sizes || [[300,250],[336,280],[728,90],[320,100]]) ,
        el.id
      );

      if (!slot) {
        setStatus(el, "slot-unsupported");
        return;
      }

      slot.addService(w.googletag.pubads());
      show(el);
      setStatus(el, "loading");
      w.googletag.display(el.id);
      setStatus(el, "requested");
    });
  }

  function renderAdSense(item, el) {
    if (!el || seen.has(el)) return;
    seen.add(el);

    var c = configFor(item);
    show(el);
    setStatus(el, "loading");

    var ins = d.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.style.minHeight = "100px";
    ins.setAttribute("data-ad-client", C.adsenseClient);
    ins.setAttribute("data-ad-slot", c.adsenseSlot);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");
    el.appendChild(ins);

    loadScript(
      "newsantara-adsense-js",
      ADSENSE_URL + "?client=" + encodeURIComponent(C.adsenseClient),
      function () {
        try {
          (w.adsbygoogle = w.adsbygoogle || []).push({});
          setStatus(el, "requested");
        } catch (e) {
          setStatus(el, "render-error");
        }
      }
    );
  }

  function renderMGID(item, el) {
    if (!el || seen.has(el)) return;
    seen.add(el);

    var c = configFor(item);
    show(el);
    setStatus(el, "loading");

    var widget = d.createElement("div");
    widget.setAttribute("data-type", "_mgwidget");
    widget.setAttribute("data-widget-id", c.mgidWidgetId);
    el.appendChild(widget);

    loadScript(
      "newsantara-mgid-" + c.mgidSiteId,
      MGID_URL + c.mgidSiteId + ".js",
      function () {
        w._mgq = w._mgq || [];
        w._mgq.push(["_mgc.load"]);
        setStatus(el, "requested");
      }
    );
  }

  function renderBanner(item, el) {
    if (!isValid(item)) {
      hide(el, "off");
      return;
    }

    var c = configFor(item);

    if (c.network === "gam") {
      show(el);
      setStatus(el, "loading");
      return;
    }

    if (c.network === "adsense") renderAdSense(item, el);
    if (c.network === "mgid") renderMGID(item, el);
  }

  function init() {
    var items = pageItems();
    var gamItems = items.filter(function (item) {
      return isValid(item) && configFor(item).network === "gam";
    });

    // 鏈敞鍐岀殑鏃у鍣ㄤ繚鐣欏湪 HTML 涓紝浣嗛殣钘忓苟娓呴櫎绌虹櫧銆?
    d.querySelectorAll("[data-ad-slot]").forEach(function (el) {
      var item = items.find(function (candidate) {
        return candidate.selector && el.matches(candidate.selector);
      });

      if (!item) hide(el, "unregistered");
    });

    items.forEach(function (item) {
      if (item.type !== "banner") return;

      d.querySelectorAll(item.selector).forEach(function (el) {
        if (!isValid(item)) hide(el, "off");
        else renderBanner(item, el);
      });
    });

    startGAM(gamItems);

    if (!observer && d.body) {
      observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType !== 1) return;

            items.forEach(function (item) {
              if (item.type !== "banner" || !item.selector) return;

              var elements = [];
              if (node.matches && node.matches(item.selector)) elements.push(node);
              if (node.querySelectorAll) {
                elements = elements.concat(
                  Array.from(node.querySelectorAll(item.selector))
                );
              }

              elements.forEach(function (el) {
                if (!isValid(item)) {
                  hide(el, "off");
                  return;
                }

                var c = configFor(item);
                if (c.network === "gam") renderDynamicGAM(item, el);
                else renderBanner(item, el);
              });
            });
          });
        });
      });

      observer.observe(d.body, { childList: true, subtree: true });
    }
  }

  function boot() {
    init();
  }

  boot();
})(window, document);