/**
 * GA4 events for Google Ads — whatsapp_click & phone_call.
 * Measurement ID: site/data/site-contact.json → OT_SITE.googleAnalyticsId
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

  function bindWhatsApp(el) {
    el.addEventListener("click", () => {
      gtagEvent("whatsapp_click", {
        event_category: "conversion",
        event_label: placement(el),
        placement: placement(el),
        page_path: pagePath(),
        link_text: (el.textContent || "").trim().slice(0, 80)
      });
    });
  }

  function bindPhone(el) {
    if (el.tagName !== "A") return;
    el.addEventListener("click", () => {
      gtagEvent("phone_call", {
        event_category: "conversion",
        event_label: placement(el),
        placement: placement(el),
        page_path: pagePath(),
        link_text: (el.textContent || "").trim().slice(0, 80)
      });
    });
  }

  function init() {
    if (!cfg.googleAnalyticsId) return;

    document.querySelectorAll("[data-whatsapp-link]").forEach(bindWhatsApp);

    document.querySelectorAll("a[href^='tel:'], a[data-phone]").forEach((el) => {
      if (el.getAttribute("href")?.startsWith("tel:") || el.hasAttribute("data-phone")) bindPhone(el);
    });

    const form = document.getElementById("bookingForm");
    if (form) {
      form.addEventListener("submit", () => {
        gtagEvent("whatsapp_click", {
          event_category: "conversion",
          event_label: "booking_form_submit",
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
