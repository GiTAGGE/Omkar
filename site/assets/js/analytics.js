/**
 * GA4 + Google Ads events (single gtag, both configs in <head>):
 * - whatsapp_button_click — direct WhatsApp links (hero, float bar, outline buttons)
 * - whatsapp_form_submit — booking form → opens WhatsApp with trip details
 * - phone_call — tel: / call links
 * IDs: site/data/site-contact.json → OT_SITE.googleAnalyticsId / googleAdsId
 */
(() => {
  const cfg = window.OT_SITE || {};

  function gtagEvent(name, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, params);
  }

  function placement(el) {
    if (!el || !el.closest) return "unknown";
    if (el.classList.contains("floatwa")) return "float_whatsapp";
    if (el.classList.contains("floatcall")) return "float_call";
    if (el.classList.contains("tel-top")) return "top_bar";
    if (el.closest("#booking")) return "booking_section";
    if (el.closest(".hero")) return "hero";
    if (el.closest("footer")) return "footer";
    if (el.closest(".cta")) return "cta";
    if (el.closest(".nav")) return "header";
    return "page";
  }

  function pagePath() {
    return location.pathname || "/";
  }

  function whatsAppAnchorFromTarget(target) {
    const el = target.closest?.("a");
    if (!el) return null;
    const href = el.getAttribute("href") || "";
    if (el.hasAttribute("data-whatsapp-link") || href.includes("wa.me")) return el;
    return null;
  }

  function phoneAnchorFromTarget(target) {
    const el = target.closest?.("a");
    if (!el) return null;
    const href = el.getAttribute("href") || "";
    if (href.startsWith("tel:") || el.hasAttribute("data-phone")) return el;
    return null;
  }

  function init() {
    if (!cfg.googleAnalyticsId && !cfg.googleAdsId) return;

    document.addEventListener(
      "click",
      (e) => {
        const wa = whatsAppAnchorFromTarget(e.target);
        if (wa) {
          gtagEvent("whatsapp_button_click", {
            event_category: "conversion",
            event_label: placement(wa),
            placement: placement(wa),
            page_path: pagePath(),
            method: "button",
            link_text: (wa.textContent || "").trim().slice(0, 80)
          });
          return;
        }

        const tel = phoneAnchorFromTarget(e.target);
        if (tel) {
          gtagEvent("phone_call", {
            event_category: "conversion",
            event_label: placement(tel),
            placement: placement(tel),
            page_path: pagePath(),
            link_text: (tel.textContent || "").trim().slice(0, 80)
          });
        }
      },
      true
    );

    const form = document.getElementById("bookingForm");
    if (form) {
      form.addEventListener("submit", () => {
        gtagEvent("whatsapp_form_submit", {
          event_category: "conversion",
          event_label: "booking_form",
          placement: "booking_form_submit",
          page_path: pagePath(),
          method: "quote_form"
        });
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
