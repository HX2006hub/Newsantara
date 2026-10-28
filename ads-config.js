(function (window, document) {
    "use strict";

    if (window.__nextPixelAdsConfigInitialized) return;
    window.__nextPixelAdsConfigInitialized = true;

    var SETTINGS = {

        // Replace these placeholders only when the real account IDs are available.
        adsenseClient: "ca-pub-XXXXXXXXXXXXXXXX",
        mgidSiteId: "1115341",

        // Configure each placement independently.
        // Set network in ads-placements.js to "adsense", "mgid", or "off".
        placements: {
            "home-banner-mid-1": {
                adsenseSlot: "XXXXXXXXXX",
                mgidWidgetId: "2099579"
            },
            "home-banner-mid-2": {
                adsenseSlot: "XXXXXXXXXX",
                mgidWidgetId: "2099582"
            },
            "home-banner-bottom": {
                adsenseSlot: "XXXXXXXXXX",
                mgidWidgetId: "2099585"
            },
            "article-banner-top": {
                adsenseSlot: "XXXXXXXXXX",
                mgidWidgetId: "2099587"
            },
            "article-banner-mid": {
                adsenseSlot: "XXXXXXXXXX",
                mgidWidgetId: "XXXXXXX"
            },
            "category-native-top": {
                adsenseSlot: "XXXXXXXXXX",
                mgidWidgetId: "2099752"
            },
            "category-banner-bottom": {
                adsenseSlot: "XXXXXXXXXX",
                mgidWidgetId: "XXXXXXX"
            }
        }
    };

    var state = {
        page: "home",
        initialized: false,
        placements: {}
    };

    function currentPage() {
        var path = window.location.pathname.toLowerCase();

        if (path === "/article" ||
            path.indexOf("/article/") === 0 ||
            path.indexOf("article.html") !== -1) return "article";

        if (path === "/category" ||
            path.indexOf("/category/") === 0 ||
            path.indexOf("category.html") !== -1) return "category";

        return "home";
    }

    function isPlaceholder(value) {
        return !value || /X{3,}/i.test(String(value));
    }

    function getPlatformSettings(placement) {
        return SETTINGS.placements[placement.key] || {};
    }

    function setStatus(slot, status, disabled) {
        slot.setAttribute("data-ad-status", status);
        slot.setAttribute("data-ad-disabled", disabled ? "true" : "false");

        if (disabled) {
            slot.classList.add("ad-hidden");
            slot.classList.remove("ad-visible");
        }
    }

    function loadScriptOnce(id, src, callback) {
        var existing = document.getElementById(id);

        if (existing) {
            if (existing.getAttribute("data-loaded") === "true") {
                if (callback) callback();
            } else if (callback) {
                existing._nextPixelCallbacks =
                    existing._nextPixelCallbacks || [];
                existing._nextPixelCallbacks.push(callback);
            }
            return;
        }

        var script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.async = true;
        script._nextPixelCallbacks = callback ? [callback] : [];

        script.onload = function () {
            if (script.src.indexOf("mgid") !== -1) console.info("[MGID-DEBUG] script-loaded", script.src);
            script.setAttribute("data-loaded", "true");
            var callbacks = script._nextPixelCallbacks || [];
            script._nextPixelCallbacks = [];

            callbacks.forEach(function (fn) {
                try {
                    fn();
                } catch (error) {
                    console.error("MGID閸掓繂顫愰崠鏍с亼鐠?", error);
                }
            });
        };

        script.onerror = function () {
            if (script.src.indexOf("mgid") !== -1) console.error("[MGID-DEBUG] script-error", script.src);
            document.querySelectorAll('[data-ad-status="loading"]').forEach(function (slot) {
                slot.setAttribute("data-ad-status", "load-error");
            });
        };

        document.head.appendChild(script);
    }
    function renderAdSense(slot, placement, config) {
        if (isPlaceholder(SETTINGS.adsenseClient) ||
            isPlaceholder(config.adsenseSlot)) {
            setStatus(slot, "unconfigured", true);
            return;
        }

        if (slot.querySelector("ins.adsbygoogle")) {
            setStatus(slot, "rendered", false);
            return;
        }

        var ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        ins.style.display = "block";
        ins.style.width = "100%";
        ins.setAttribute("data-ad-client", SETTINGS.adsenseClient);
        ins.setAttribute("data-ad-slot", config.adsenseSlot);
        ins.setAttribute("data-ad-format", "auto");
        ins.setAttribute("data-full-width-responsive", "true");

        slot.appendChild(ins);
        setStatus(slot, "loading", false);

        loadScriptOnce(
            "nextpixel-adsense-sdk",
            "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
                encodeURIComponent(SETTINGS.adsenseClient),
            function () {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    slot.setAttribute("data-ad-status", "requested");
                } catch (error) {
                    slot.setAttribute("data-ad-status", "render-error");
                }
            }
        );
    }

    function loadMGIDScript(callback) {
        var src = "https://jsc.mgid.com/site/" +
            encodeURIComponent(SETTINGS.mgidSiteId) + ".js";
        var existing = document.querySelector('script[src*="jsc.mgid.com/site/"]');

        function finish(script, failed) {
            if (!script || script.getAttribute("data-nextpixel-finished") === "true") return;
            script.setAttribute("data-nextpixel-finished", "true");
            script.setAttribute("data-nextpixel-loaded", failed ? "false" : "true");
            var callbacks = script._nextPixelMGIDCallbacks || [];
            script._nextPixelMGIDCallbacks = [];
            callbacks.forEach(function (fn) {
                try { fn(failed ? new Error("MGID script failed to load") : null); }
                catch (error) { console.error("[MGID] initialization callback failed", error); }
            });
        }

        if (existing) {
            if (existing.getAttribute("data-nextpixel-loaded") === "true") {
                if (callback) callback(null);
                return;
            }
            if (existing.getAttribute("data-nextpixel-loaded") === "false") {
                if (callback) callback(new Error("MGID script failed to load"));
                return;
            }
            existing._nextPixelMGIDCallbacks = existing._nextPixelMGIDCallbacks || [];
            if (callback) existing._nextPixelMGIDCallbacks.push(callback);
            if (existing.getAttribute("data-nextpixel-listeners") !== "true") {
                existing.setAttribute("data-nextpixel-listeners", "true");
                existing.addEventListener("load", function () { finish(existing, false); }, { once: true });
                existing.addEventListener("error", function () { finish(existing, true); }, { once: true });
                if (existing.readyState === "loaded" || existing.readyState === "complete") {
                    finish(existing, false);
                }
            }
            return;
        }

        var script = document.createElement("script");
        script.src = src;
        script.async = true;
        script._nextPixelMGIDCallbacks = callback ? [callback] : [];
        script.addEventListener("load", function () { finish(script, false); }, { once: true });
        script.addEventListener("error", function () { finish(script, true); }, { once: true });
        script.setAttribute("data-nextpixel-listeners", "true");
        document.head.appendChild(script);
    }

    function renderMGIDWidgets(pagePlacements) {
        var active = [];

        pagePlacements.forEach(function (placement) {
            if (placement.network !== "mgid") return;

            var slot = document.querySelector(placement.selector);
            if (!slot) return;

            var config = getPlatformSettings(placement);

            if (!placement.enabled) {
                setStatus(slot, "disabled", true);
                state.placements[placement.key].status = "disabled";
                return;
            }

            if (isPlaceholder(SETTINGS.mgidSiteId) ||
                isPlaceholder(config.mgidWidgetId)) {
                setStatus(slot, "unconfigured", true);
                state.placements[placement.key].status = "unconfigured";
                return;
            }

            active.push({ placement: placement, slot: slot, config: config });
        });

        if (!active.length) return;

        window._mgq = window._mgq || [];
        loadMGIDScript();

        active.forEach(function (item) {
            var widget = item.slot.querySelector('[data-type="_mgwidget"]');

            if (!widget) {
                widget = document.createElement("div");
                widget.setAttribute("data-type", "_mgwidget");
                item.slot.appendChild(widget);
            }

            widget.setAttribute("data-widget-id", item.config.mgidWidgetId);
            widget.setAttribute("data-nextpixel-requested", "true");

            setStatus(item.slot, "requested", false);
            state.placements[item.placement.key].status = "requested";
        });

        // Match Finance: enqueue once after all widgets exist.
        window._mgq.push(["_mgc.load"]);

        function checkMGIDFill() {
            var retry = false;

            active.forEach(function (item) {
                var widget = item.slot.querySelector('[data-type="_mgwidget"]');
                if (!widget) {
                    retry = true;
                    return;
                }

                if (widget.querySelector("iframe")) {
                    item.slot.style.height = "auto";
                    item.slot.style.overflow = "visible";
                    item.slot.classList.add("ad-visible");
                    item.slot.classList.remove("ad-hidden");
                    item.slot.setAttribute("data-ad-status", "filled");
                    state.placements[item.placement.key].status = "filled";
                } else {
                    retry = true;
                }
            });

            if (retry) {
                window._mgq = window._mgq || [];
                window._mgq.push(["_mgc.load"]);
            }
        }

        [1500, 4000, 8000, 15000].forEach(function (delay) {
            window.setTimeout(checkMGIDFill, delay);
        });
    }

    function renderAll() {
        state.page = currentPage();

        var pagePlacements = window.ADS_PLACEMENTS &&
            window.ADS_PLACEMENTS[state.page];

        if (!Array.isArray(pagePlacements)) return;

        pagePlacements.forEach(function (placement) {
            var slot = document.querySelector(placement.selector);
            if (!slot) return;

            slot.setAttribute("data-ad-placement", placement.key);
            state.placements[placement.key] = {
                network: placement.network,
                status: "pending"
            };

            if (!placement.enabled ||
                placement.network === "off") {
                setStatus(slot, "disabled", true);
                state.placements[placement.key].status = "disabled";
                return;
            }

            if (placement.network === "mgid") return;

            var config = getPlatformSettings(placement);

            if (placement.network === "adsense") {
                renderAdSense(slot, placement, config);
            } else {
                setStatus(slot, "invalid-network", true);
            }

            state.placements[placement.key].status =
                slot.getAttribute("data-ad-status");
        });

        // Widget loading is initialized per placement in renderMGID.
        renderMGIDWidgets(pagePlacements);
        state.initialized = true;
    }

    function renderOneMGID(placementKey) {
        state.page = currentPage();
        var pagePlacements = window.ADS_PLACEMENTS &&
            window.ADS_PLACEMENTS[state.page];
        if (!Array.isArray(pagePlacements)) return;

        var placement = pagePlacements.find(function (item) {
            return item.key === placementKey;
        });
        if (!placement || placement.network !== "mgid") return;

        var slot = document.querySelector(placement.selector);
        if (!slot) return;

        slot.setAttribute("data-ad-placement", placement.key);
        state.placements[placement.key] = {
            network: placement.network,
            status: "pending"
        };
        renderMGIDWidgets([placement]);
    }
    window.AdConfig = {
        renderAll: renderAll,
        renderOneMGID: renderOneMGID,
        getStatus: function () {
            return {
                page: state.page,
                initialized: state.initialized,
                placements: state.placements
            };
        }
    };

    function init() {
        renderAll();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})(window, document);




