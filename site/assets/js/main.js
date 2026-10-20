(() => {
  const cfg = window.OT_SITE || {};
  const menu = document.getElementById("menuBtn");
  const nav = document.getElementById("navLinks");

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: "smooth", block: id === "booking" ? "center" : "start" });
    return true;
  }

  function stripHashFromUrl() {
    if (!location.hash) return null;
    const id = location.hash.slice(1);
    history.replaceState(null, "", location.pathname + location.search);
    return id;
  }

  const hashTarget = stripHashFromUrl();
  const pendingScroll = sessionStorage.getItem("otScroll");

  document.querySelectorAll("[data-scroll-target]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const id = el.getAttribute("data-scroll-target");
      if (!id) return;
      if (scrollToSection(id)) {
        if (el.tagName === "A") e.preventDefault();
        return;
      }
      if (el.tagName === "A") sessionStorage.setItem("otScroll", id);
    });
  });

  const scrollOnLoad = hashTarget || pendingScroll;
  if (scrollOnLoad) {
    sessionStorage.removeItem("otScroll");
    window.addEventListener("load", () => {
      setTimeout(() => scrollToSection(scrollOnLoad), 50);
    });
  }

  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.textContent = open ? "✕" : "☰";
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
        menu.textContent = "☰";
      })
    );
  }

  const trip = document.getElementById("tripType");
  const result = document.getElementById("formResult");
  if (trip) {
    document.querySelectorAll("[data-trip]").forEach((b) =>
      b.addEventListener("click", () => {
        document.querySelectorAll("[data-trip]").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        trip.value = b.dataset.trip;
        const to = document.getElementById("to");
        if (to) {
          to.placeholder = trip.value === "Local Rental" ? "e.g. Local sightseeing" : "e.g. Bengaluru";
        }
        result?.classList.remove("show");
      })
    );
  }

  document.querySelectorAll("[data-vehicle]").forEach((b) =>
    b.addEventListener("click", () => {
      const vehicle = document.getElementById("vehicle");
      if (vehicle) vehicle.value = b.dataset.vehicle;
      scrollToSection("booking");
      setTimeout(() => document.getElementById("from")?.focus({ preventScroll: true }), 400);
    })
  );

  document.querySelectorAll("[data-settrip]").forEach((a) =>
    a.addEventListener("click", () => {
      const v = a.dataset.settrip;
      document.querySelectorAll("[data-trip]").forEach((b) =>
        b.classList.toggle("active", b.dataset.trip === v)
      );
      if (trip) trip.value = v;
      if (!scrollToSection("booking")) sessionStorage.setItem("otScroll", "booking");
    })
  );

  const date = document.getElementById("date");
  if (date) {
    const today = new Date();
    date.min = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  document.querySelectorAll("[data-phone]").forEach((el) => {
    if (cfg.phoneTel && el.tagName === "A") {
      el.setAttribute("href", "tel:" + String(cfg.phoneTel).replace(/\s/g, ""));
    }
    if (cfg.phoneDisplay) el.textContent = cfg.phoneDisplay;
  });

  document.querySelectorAll("[data-email]").forEach((el) => {
    if (!cfg.email) return;
    if (el.tagName === "A") el.setAttribute("href", "mailto:" + cfg.email);
    if (!el.textContent?.includes("@") || el.dataset.emailText === "replace") el.textContent = cfg.email;
  });

  document.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
    if (cfg.whatsapp) {
      const base = "https://wa.me/" + cfg.whatsapp;
      el.setAttribute("href", base + (el.dataset.waText ? "?text=" + encodeURIComponent(el.dataset.waText) : ""));
    } else {
      el.setAttribute("href", "/");
      el.setAttribute("data-scroll-target", "booking");
    }
  });

  const form = document.getElementById("bookingForm");
  if (form && trip) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const pickup = document.getElementById("from")?.value.trim() || "";
      const destination = document.getElementById("to")?.value.trim() || "";
      const travelDate = date?.value || "";
      const passengers = document.getElementById("passengers")?.value || "";
      const vehicle = document.getElementById("vehicle")?.value || "";
      const lines = [
        "Hello Omkareshwar Travels,",
        "I would like a trip quote:",
        "",
        "Trip type: " + trip.value,
        "Pickup: " + pickup,
        "Destination: " + destination,
        "Travel date: " + travelDate,
        "Passengers: " + passengers,
        "Vehicle: " + vehicle,
        "",
        "Sent from " + (cfg.domain || "omkareshwartravels.com")
      ];
      const text = lines.join("\n");
      if (!cfg.whatsapp) {
        if (result) {
          result.classList.add("show");
          result.textContent = "WhatsApp number is not configured yet. Please call us or update site-config.js.";
          result.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        return;
      }
      window.open("https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  }
})();
