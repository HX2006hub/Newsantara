(function (window, document) {
    "use strict";

    if (window.__nextPixelAdLayoutInitialized) return;
    window.__nextPixelAdLayoutInitialized = true;

    var style = document.createElement("style");
    style.setAttribute("data-nextpixel-ad-layout", "true");
    style.textContent =
        'div[data-ad-slot],div.ad-slot{' +
        'height:auto;min-height:0;overflow:visible;transition:height .3s ease}' +
        'div[data-ad-slot].ad-visible,div.ad-slot.ad-visible{' +
        'height:auto;overflow:visible}' +
        '';
    document.head.appendChild(style);

    function isFilled(slot) {
        if (slot.querySelector("iframe")) return true;

        var ins = slot.querySelector("ins.adsbygoogle");
        if (ins && ins.getBoundingClientRect().height > 10) return true;

        var widget = slot.querySelector('[data-type="_mgwidget"]');
        if (!widget) return false;
        if (widget.querySelector("iframe")) return true;

        var candidates = widget.querySelectorAll("img,video,a,[class],[id]");
        for (var i = 0; i < candidates.length; i++) {
            var rect = candidates[i].getBoundingClientRect();
            if (rect.width > 50 && rect.height > 50) return true;
        }
        return false;
    }

    function refreshSlot(slot) {
        if (!slot) return;

        if (slot.getAttribute("data-ad-disabled") === "true") {
            slot.style.height = "0";
            slot.style.overflow = "hidden";
            slot.classList.add("ad-hidden");
            slot.classList.remove("ad-visible");
            return;
        }

        // Do not collapse or clip an ad slot while MGID is loading.
        slot.style.height = "auto";
        slot.style.overflow = "visible";
        slot.classList.remove("ad-hidden");

        if (isFilled(slot)) {
            slot.classList.add("ad-visible");
            slot.setAttribute("data-ad-status", "filled");
        }
    }

    function init() {
        document.querySelectorAll("div[data-ad-slot],div.ad-slot")
            .forEach(function (slot) {
                if (slot.getAttribute("data-ad-layout-init") === "true") {
                    refreshSlot(slot);
                    return;
                }

                slot.setAttribute("data-ad-layout-init", "true");

                var observer = new MutationObserver(function () {
                    refreshSlot(slot);
                });

                observer.observe(slot, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: [
                        "data-ad-disabled",
                        "data-ad-status"
                    ]
                });

                slot.addEventListener("load", function () {
                    refreshSlot(slot);
                }, true);

                refreshSlot(slot);
            });

        [1500, 4000, 8000, 15000].forEach(function (delay) {
            window.setTimeout(function () {
                document.querySelectorAll("div[data-ad-slot],div.ad-slot")
                    .forEach(refreshSlot);
            }, delay);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})(window, document);