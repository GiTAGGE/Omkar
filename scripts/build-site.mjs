import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { syncImagesFromUploads } from "./sync-images-from-uploads.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
const site = path.join(root, "site");
const CONTACT = JSON.parse(fs.readFileSync(path.join(site, "data", "site-contact.json"), "utf8"));
const DOMAIN = CONTACT.domain;
const HUB_LABEL = `${CONTACT.hubCity} (${CONTACT.hubCityAlt})`;

const routes = JSON.parse(fs.readFileSync(path.join(site, "data", "routes.json"), "utf8"));
const services = JSON.parse(fs.readFileSync(path.join(site, "data", "services.json"), "utf8"));
const fleetImages = JSON.parse(fs.readFileSync(path.join(site, "data", "fleet-images.json"), "utf8"));

function serviceBodyText(text) {
  return String(text).replace(/\{phone\}/g, CONTACT.phoneDisplay);
}

const BRAND = "Omkareshwar Travels";

const homeSeo = {
  title: "Taxi Service in Hubli | Cab Service in Hubballi | Omkareshwar",
  description:
    "Book taxi service in Hubli & cab service in Hubballi — outstation, airport & local trips. Sedan, Innova & Tempo Traveller. Fast WhatsApp quotes & same-day cabs.",
  keywords:
    "taxi service in Hubli, cab service in Hubli, taxi service Hubballi, cab service Hubballi, Hubli taxi booking, Hubballi cab service, outstation cab Hubli, local taxi Hubli, Omkareshwar Travels"
};

/** Per-route meta tuned for “Hubli to X taxi/cab” searches — overrides optional fields on routes.json */
const routeMetaBySlug = {
  dandeli: {
    title: "Hubli to Dandeli Taxi & Cab | Rafting Trip from Hubballi",
    description:
      "Hubli to Dandeli taxi & cab (~85 km). River rafting, Kali River & Western Ghats weekends. Book sedan, Innova or Traveller — WhatsApp fare quote."
  },
  gokarna: {
    title: "Hubli to Gokarna Taxi & Cab | Beach & Temple from Hubballi",
    description:
      "Hubli to Gokarna taxi & cab for beaches & Mahabaleshwar Temple. Round trip or one-way from Hubballi. AC cab packages — enquire on WhatsApp."
  },
  murudeshwar: {
    title: "Hubli to Murudeshwar Taxi & Cab | Coastal Temple Tour",
    description:
      "Book Hubli to Murudeshwar taxi & cab from Hubballi. Shiva statue, sea views & darshan trips. Family sedan to group Traveller — get a quote today."
  },
  goa: {
    title: "Hubli to Goa Taxi & Cab | Outstation Cab to North & South Goa",
    description:
      "Hubli to Goa taxi & cab — popular outstation from Hubballi (~160 km). Beaches, airports & holidays. Clear one-way & round-trip fares on WhatsApp."
  },
  hospet: {
    title: "Hubli to Hospet Taxi & Cab | Hampi Gateway from Hubballi",
    description:
      "Hubli to Hospet taxi & cab for Hampi stays & heritage tours. Railway-friendly drops, group travel. Book Hubballi outstation cab on WhatsApp."
  },
  hampi: {
    title: "Hubli to Hampi Taxi & Cab | UNESCO Heritage Tour",
    description:
      "Hubli to Hampi taxi & cab for ruins, temples & boulder landscapes. 2–3 day tours from Hubballi. Innova & Traveller for families — WhatsApp quote."
  },
  belagavi: {
    title: "Hubli to Belagavi Taxi & Cab | IXG Airport Transfer",
    description:
      "Hubli to Belagavi (Belgaum) taxi & cab — business, family & Belagavi airport (IXG) drops. ~2 hr from Hubballi. Book cab service on WhatsApp."
  },
  coorg: {
    title: "Hubli to Coorg Taxi & Cab | Madikeri Hill Station Trip",
    description:
      "Hubli to Coorg taxi & cab for coffee country & waterfalls. Multi-day family tours from Hubballi. SUV & Innova for ghats — request fare on WhatsApp."
  },
  udupi: {
    title: "Hubli to Udupi Taxi & Cab | Krishna Temple & Malpe",
    description:
      "Hubli to Udupi taxi & cab for temple darshan & Malpe Beach. Pilgrimage plus coast from Hubballi. Sedan to Traveller — WhatsApp booking."
  },
  "jog-falls": {
    title: "Hubli to Jog Falls Taxi & Cab | Waterfall Day Trip",
    description:
      "Hubli to Jog Falls taxi & cab for monsoon views & Sharavathi valley. Day trip or overnight from Hubballi. AC cab quote on WhatsApp."
  }
};

function routeSeo(route) {
  const custom = routeMetaBySlug[route.slug];
  const title = custom?.title
    ? `${custom.title} | ${BRAND}`
    : `Hubli to ${route.name} Taxi & Cab | Hubballi Outstation | ${BRAND}`;
  const description =
    custom?.description ||
    `Book Hubli to ${route.name} taxi & cab from Hubballi. ${route.tagline}. ${route.distanceFromHubli}, ${route.idealDuration}. WhatsApp quote — sedan, Innova & Traveller.`;
  const keywords = route.metaKeywords
    ? `${route.metaKeywords}, Hubli to ${route.name} cab, ${route.name} taxi Hubballi`
    : `Hubli to ${route.name} taxi, Hubli to ${route.name} cab, Hubballi ${route.name} outstation`;
  return { title, description, keywords };
}

const taxiServicesHubSeo = {
  title: "Taxi & Cab Services in Hubli Hubballi | Outstation & Airport",
  description:
    "Explore every Hubli taxi & cab service — outstation, airport, local rental, one-way, round trip, Innova & Tempo Traveller. Pick your trip type & book on WhatsApp.",
  keywords:
    "taxi services Hubli, cab services Hubballi, Hubli taxi booking, Hubballi cab rental, outstation taxi Hubli, airport cab Hubballi"
};

function syncSiteConfig() {
  const js = `/** Auto-synced from site/data/site-contact.json on build — edit that file or phone/WhatsApp here. */
window.OT_SITE = ${JSON.stringify(CONTACT, null, 2)};
`;
  fs.writeFileSync(path.join(site, "assets", "js", "site-config.js"), js, "utf8");
}
syncSiteConfig();
const imageSync = syncImagesFromUploads();
if (imageSync.copied.length) {
  console.log("Synced", imageSync.copied.length, "image(s) from site/assets/images/uploads/");
}

const routeCopy = {
  dandeli: {
    intro:
      "Dandeli pairs Kali River adventure with calm Western Ghats forests — ideal for families and friend groups who want rafting, nature walks, and a comfortable road trip from Hubballi (Hubli).",
    highlights: [
      "White-water rafting and coracle rides on the Kali River",
      "Dandeli Wildlife Sanctuary and birding trails",
      "Jungle camps, homestays, and riverside resorts",
      "Easy weekend circuit with Goa or Gokarna"
    ],
    faq: [
      {
        q: "How long should we plan for Dandeli?",
        a: "Most guests enjoy 2–3 days to combine rafting, sanctuary visits, and travel time from North Karnataka."
      },
      {
        q: "Which vehicle works best?",
        a: "Sedans suit couples and small families; SUVs and Tempo Travellers are better for groups with luggage and camping gear."
      }
    ]
  },
  gokarna: {
    intro:
      "Gokarna blends temple devotion with uncrowded beaches. Travel with Omkareshwar Travels for punctual drops to Om Beach, Kudle, and Mahabaleshwar Temple — with flexible return plans.",
    highlights: [
      "Mahabaleshwar Temple and beach hopping",
      "Om Beach, Kudle, and Half Moon Bay viewpoints",
      "Coastal drives via Karwar or Murudeshwar",
      "Ideal long weekend from Hubballi"
    ],
    faq: [
      {
        q: "Can we do Gokarna as a day trip?",
        a: "A same-day return is possible but tiring. We recommend at least one night on the coast for a relaxed experience."
      },
      {
        q: "Do you offer round-trip packages?",
        a: "Yes — share your pickup city, nights, and beaches on your list; we quote sedan, SUV, or traveller options."
      }
    ]
  },
  murudeshwar: {
    intro:
      "Murudeshwar’s towering Shiva statue and sea-facing temple make it one of Karnataka’s most photogenic spiritual stops. We arrange comfortable cabs for darshan, Netrani viewpoints, and coastal extensions.",
    highlights: [
      "Murudeshwar Temple and Raja Gopura views",
      "Statue Park and Arabian Sea promenade",
      "Day trips from Udupi, Gokarna, or Hubballi",
      "Combine with Jog Falls or Coorg on longer tours"
    ],
    faq: [
      {
        q: "Best time to visit Murudeshwar?",
        a: "October–February offers pleasant sea breeze; early morning darshan avoids midday heat."
      },
      {
        q: "Parking and timing?",
        a: "We coordinate drop timing with your puja schedule and help plan returns the same evening or next day."
      }
    ]
  },
  goa: {
    intro:
      "From Hubballi (Hubli), Goa is one of our busiest routes for beaches, weddings, and airport transfers. Book clear one-way or round-trip cabs with transparent fare discussions before you travel.",
    highlights: [
      "North Goa beaches and nightlife hubs",
      "South Goa’s quieter resorts and churches",
      "Dabolim (GOI) and Mopa (GOX) airport transfers",
      "Multi-day family holidays with SUV or traveller"
    ],
    faq: [
      {
        q: "Hubli to Goa travel time?",
        a: "Typically 3–4 hours depending on border traffic and whether you are headed to North or South Goa."
      },
      {
        q: "Inter-state permits?",
        a: "We confirm permit and driver details when you share dates, vehicle type, and exact pickup/drop pins."
      }
    ]
  },
  hospet: {
    intro:
      "Hospet is the practical base for Hampi, Tungabhadra Dam, and heritage circuits. Our outstation taxis from Hubballi keep your group together with AC comfort on well-travelled NH routes.",
    highlights: [
      "Gateway stays for Hampi UNESCO sites",
      "Tungabhadra Dam and sunset viewpoints",
      "Business and student group transfers",
      "Connect to Badami, Aihole, and Pattadakal tours"
    ],
    faq: [
      {
        q: "Should we stay in Hospet or Hampi?",
        a: "Hospet has more hotels and rail links; Hampi side is closer to monuments. We drop you at either based on your booking."
      },
      {
        q: "Ideal vehicle for 6–8 guests?",
        a: "Innova or similar MUV is popular; larger groups choose Tempo Traveller with luggage space."
      }
    ]
  },
  hampi: {
    intro:
      "Hampi’s boulder-strewn ruins deserve unhurried exploration. Plan temple circuits, Matanga Hill sunrise, and riverside coracle rides with a dedicated cab and driver who knows local timings.",
    highlights: [
      "Virupaksha Temple, Vittala Complex, and Stone Chariot",
      "Matanga Hill sunrise and Hemakuta views",
      "Coracle ride on Tungabhadra",
      "Photography-friendly boulder landscapes"
    ],
    faq: [
      {
        q: "How many days in Hampi?",
        a: "2 full days cover major monuments; add a day for Anegundi and countryside rides."
      },
      {
        q: "Can the cab wait at sites?",
        a: "Local sightseeing packages can include waiting time — mention this in your WhatsApp enquiry."
      }
    ]
  },
  belagavi: {
    intro:
      "Belagavi (Belgaum) is a frequent outstation trip from Hubballi — for IXG airport drops, family visits, and business travel. We run comfortable one-way and round-trip cabs with clear pricing on WhatsApp.",
    highlights: [
      "Hubballi to Belagavi same-day returns",
      "Belagavi Airport (IXG) connections from Hubli",
      "Corporate and wedding guest transfers",
      "Continue to Goa or Maharashtra border routes"
    ],
    faq: [
      {
        q: "Hubli to Belagavi travel time?",
        a: "Usually about 2 hours via NH48, depending on traffic near Khanapur and city entry points."
      },
      {
        q: "Can you drop at IXG airport?",
        a: "Yes — share flight time and terminal; we plan pickup from Hubballi accordingly."
      }
    ]
  },
  coorg: {
    intro:
      "Coorg (Kodagu) is mist, coffee estates, and waterfalls. Drive to Madikeri, Abbey Falls, and Dubare Elephant Camp with vehicles suited to ghat roads and monsoon travel.",
    highlights: [
      "Madikeri Fort, Raja’s Seat, and Abbey Falls",
      "Coffee estate stays and plantation walks",
      "Dubare, Nisargadhama, and Talacauvery trips",
      "Multi-day family tours from Hubballi"
    ],
    faq: [
      {
        q: "Monsoon travel to Coorg?",
        a: "Ghats are lush but wet — SUVs with experienced drivers are recommended June–September."
      },
      {
        q: "Suggested duration?",
        a: "3–4 days let you cover Madikeri, Kushalnagar, and one relaxed estate day."
      }
    ]
  },
  udupi: {
    intro:
      "Udupi delivers Krishna Temple serenity, Malpe Beach sunsets, and famous vegetarian cuisine. Perfect for pilgrimage-plus-beach itineraries with Murudeshwar or Mangaluru add-ons.",
    highlights: [
      "Sri Krishna Temple and darshan timings",
      "Malpe Beach, St. Mary’s Island boat trips",
      "Coastal food stops and market visits",
      "Links to Kollur, Murudeshwar, and Gokarna"
    ],
    faq: [
      {
        q: "Temple dress code?",
        a: "Traditional modest attire is expected; we plan arrival buffers for security and darshan queues."
      },
      {
        q: "Combine Udupi with Murudeshwar?",
        a: "Very popular 2-day loop — ask for a combined quote on WhatsApp."
      }
    ]
  },
  "jog-falls": {
    intro:
      "Jog Falls roars best in monsoon and post-monsoon months. Visit Sharavathi valley viewpoints, Linganamakki surroundings, and Sagara town with safe, weather-aware scheduling.",
    highlights: [
      "Raja, Roarer, Rocket, and Rani falls viewpoints",
      "Monsoon photography and nature drives",
      "Pair with Shimoga, Sringeri, or coastal routes",
      "Day trip or overnight from Hubballi"
    ],
    faq: [
      {
        q: "When is water flow strongest?",
        a: "July–October usually shows the fullest cascade; we advise road conditions before monsoon drives."
      },
      {
        q: "Is same-day return feasible?",
        a: "Yes from Hubballi with an early start; overnight near Sagara is easier for families."
      }
    ]
  }
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pathPrefix(depth) {
  return depth === 0 ? "/" : "../".repeat(depth);
}

function pageRoot(depth) {
  return depth === 0 ? "/" : "../".repeat(depth);
}

function scrollLink(depth, sectionId, label, className = "") {
  const cls = className ? ` class="${className}"` : "";
  return `<a href="${pageRoot(depth)}" data-scroll-target="${sectionId}"${cls}>${label}</a>`;
}

function homeLink(depth, label, className = "") {
  const cls = className ? ` class="${className}"` : "";
  const scroll = depth === 0 ? ' data-scroll-target="home"' : "";
  return `<a href="${pageRoot(depth)}"${scroll}${cls}>${label}</a>`;
}

function brandLink(depth) {
  const scroll = depth === 0 ? ' data-scroll-target="home"' : "";
  return `<a class="brand" href="${pageRoot(depth)}"${scroll} aria-label="Omkareshwar Travels home"><span class="mark">O</span><span class="brandname">OMKARESHWAR<small>TRAVELS</small></span></a>`;
}

function bookingButton(label, className) {
  return `<button type="button" class="${className}" data-scroll-target="booking">${label}</button>`;
}

function assetPrefix(depth) {
  return (depth === 0 ? "/" : "../".repeat(depth)) + "assets";
}

function imagePath(depth, relativeFile) {
  return `${assetPrefix(depth)}/images/${relativeFile}`;
}

function destCardImage(slug, depth) {
  return imagePath(depth, `destinations/${slug}/card.jpg`);
}

function destHeroImage(slug, depth) {
  return imagePath(depth, `destinations/${slug}/hero.jpg`);
}

function absoluteImage(relativeFile) {
  return DOMAIN + "/assets/images/" + relativeFile;
}

function googleAnalyticsHead() {
  const id = CONTACT.googleAnalyticsId;
  if (!id) return "";
  return `<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(id)}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag("js", new Date());
gtag("config", "${esc(id)}");
</script>
`;
}

function head({ title, description, keywords, canonical, depth = 0, jsonLd = [], ogImage }) {
  const ap = assetPrefix(depth);
  const ld = jsonLd
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
${googleAnalyticsHead()}<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="keywords" content="${esc(keywords)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Omkareshwar Travels">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ""}
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<link rel="preconnect" href="https://wa.me">
<link rel="dns-prefetch" href="https://wa.me">
<link rel="stylesheet" href="${ap}/css/styles.css">
<link rel="icon" href="${ap}/img/logo-mark.svg" type="image/svg+xml">
${ld}
</head>`;
}

function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: CONTACT.businessName,
    description: homeSeo.description,
    url: DOMAIN,
    logo: DOMAIN + "/assets/img/logo-mark.svg",
    image: DOMAIN + "/assets/img/logo-mark.svg",
    telephone: CONTACT.phoneTel,
    email: CONTACT.email,
    priceRange: "₹₹",
    areaServed: ["Karnataka", "Goa", "Hubballi", "Hubli", "Dharwad", "Belagavi"],
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.streetAddress,
      addressLocality: CONTACT.address.addressLocality,
      addressRegion: CONTACT.address.addressRegion,
      postalCode: CONTACT.address.postalCode,
      addressCountry: CONTACT.address.addressCountry
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 15.3647,
      longitude: 75.124
    },
    sameAs: [DOMAIN]
  };
}

function topBar() {
  return `<div class="top"><div class="wrap"><span>HUBBALLI (HUBLI) · OUTSTATION & LOCAL TAXIS</span><span><a class="tel-top" href="tel:${CONTACT.phoneTel}" data-phone>${esc(CONTACT.phoneDisplay)}</a> · <a class="tel-top" href="mailto:${CONTACT.email}" data-email>${esc(CONTACT.email)}</a></span></div></div>`;
}

function conversionStrip() {
  return `<div class="convertbar"><div class="wrap convertgrid">
 <div><strong>Instant WhatsApp quotes</strong><small>Share route & dates — fast reply</small></div>
 <div><strong>Hubli / Hubballi pickups</strong><small>Railway, bus stand & city</small></div>
 <div><strong>AC fleet</strong><small>Sedan · SUV · Innova · Traveller</small></div>
 <div>${scrollLink(0, "booking", "BOOK ON WHATSAPP ↗", "btn gold")}</div>
</div></div>`;
}

function nav(depth) {
  return `<header class="nav">
 <div class="wrap navinner">
  ${brandLink(depth)}
  <nav class="links" id="navLinks">
   ${homeLink(depth, "Home")}
   ${scrollLink(depth, "fleet", "Our Fleet")}
   ${scrollLink(depth, "services", "Services")}
   ${scrollLink(depth, "destinations", "Destinations")}
   ${scrollLink(depth, "about", "About Us")}
  </nav>
  ${scrollLink(depth, "booking", "BOOK YOUR RIDE ↗", "btn gold navcta")}
  <button class="menu" id="menuBtn" aria-label="Toggle navigation" aria-expanded="false">☰</button>
 </div>
</header>`;
}

function bookingForm(prefillTo = "", depth = 0, defaultFrom = CONTACT.hubCity, defaultTrip = "One Way", defaultVehicle = "") {
  const tripOptions = ["One Way", "Round Trip", "Local Rental"];
  const activeTrip = tripOptions.includes(defaultTrip) ? defaultTrip : "One Way";
  const tabs = tripOptions
    .map(
      (t) =>
        `<button type="button" class="tab${t === activeTrip ? " active" : ""}" data-trip="${t}">${t}</button>`
    )
    .join("");
  const phTo =
    prefillTo
      ? esc(prefillTo)
      : activeTrip === "Local Rental"
        ? "e.g. Local sightseeing"
        : "e.g. Goa, Hampi, Gokarna";
  const fromVal = defaultFrom ? ` value="${esc(defaultFrom)}"` : "";
  const vehicleOptions = [
    "No preference — suggest a vehicle",
    "Hatchback / Sedan (Dzire / Etios)",
    "SUV / MUV",
    "Innova / Premium MUV",
    "Tempo Traveller",
    "Mini Bus / Bus"
  ];
  const vehicleSelect = vehicleOptions
    .map((opt) => {
      const sel = defaultVehicle && opt.includes(defaultVehicle) ? " selected" : "";
      return `<option${sel}>${esc(opt)}</option>`;
    })
    .join("");
  return `<div class="booking" id="booking"><h2>Where can we take you?</h2><p class="sub">Share your trip details — we reply quickly on WhatsApp.</p>
  <div class="tabs" role="group" aria-label="Trip type">${tabs}</div>
  <form id="bookingForm"><input type="hidden" id="tripType" value="${esc(activeTrip)}"><div class="fields">
   <div class="field"><label for="from">PICKUP CITY</label><input id="from" name="pickup" placeholder="e.g. Hubballi"${fromVal} required autocomplete="address-level2"></div>
   <div class="field"><label for="to">DESTINATION</label><input id="to" name="destination" placeholder="${phTo}" value="${prefillTo ? esc(prefillTo) : ""}" required autocomplete="address-level2"></div>
   <div class="field"><label for="date">TRAVEL DATE</label><input type="date" id="date" name="date" required></div>
   <div class="field"><label for="passengers">PASSENGERS</label><select id="passengers" name="passengers"><option>1–3 passengers</option><option>4–6 passengers</option><option>7–12 passengers</option><option>13+ passengers</option></select></div>
   <div class="field full"><label for="vehicle">PREFERRED VEHICLE</label><select id="vehicle" name="vehicle">${vehicleSelect}</select></div>
  </div><button class="btn gold" type="submit">SEND QUOTE ON WHATSAPP &nbsp; ↗</button><p class="tiny">Instant WhatsApp enquiry · No payment required on this step</p><div class="notice" id="formResult" role="status" aria-live="polite"></div>
 </form>
 </div>`;
}

function footer(depth) {
  const p = depth === 0 ? "" : "../".repeat(depth);
  const routeLinks = routes
    .slice(0, 6)
    .map((r) => `<a href="${p}routes/${r.slug}/">${r.name}</a>`)
    .join("");
  const serviceLinks = services
    .slice(0, 6)
    .map((s) => `<a href="${p}${s.slug}/">${esc(s.shortName)}</a>`)
    .join("");
  const taxiHubLink = `<a href="${p}taxi-services/">All taxi services ↗</a>`;
  return `<footer id="contact"><div class="wrap"><div class="footgrid">
 <div>${brandLink(depth)}<p style="margin-top:15px;max-width:260px">Comfortable outstation cabs, local rentals, and airport transfers across Karnataka & Goa — planned around your schedule.</p></div>
 <div><h4>EXPLORE</h4>${scrollLink(depth, "fleet", "Our Fleet")}<a href="${p}taxi-services/">Taxi Services</a>${scrollLink(depth, "destinations", "Tour Destinations")}${scrollLink(depth, "about", "About Us")}</div>
 <div><h4>TAXI SERVICES</h4>${serviceLinks}${taxiHubLink}</div>
 <div><h4>POPULAR ROUTES</h4>${routeLinks}${scrollLink(depth, "destinations", "View all routes ↗")}</div>
 <div><h4>GET IN TOUCH</h4><a href="tel:${CONTACT.phoneTel}" data-phone>${esc(CONTACT.phoneDisplay)}</a><a href="mailto:${CONTACT.email}" data-email>${esc(CONTACT.email)}</a><p>Based in ${esc(HUB_LABEL)}</p>${scrollLink(depth, "booking", "Send a trip enquiry ↗")}</div>
</div><div class="copyright"><span>© <span id="year"></span> Omkareshwar Travels</span><span><a href="${p}privacy-policy/">Privacy Policy</a> &nbsp; · &nbsp; <a href="${p}terms/">Terms & Conditions</a></span></div></div>
<div class="site-note">Outstation & local taxis · ${esc(HUB_LABEL)} · Karnataka & Goa · Call or WhatsApp for same-day quotes</div></footer>`;
}

function floatActions(waText) {
  return `<div class="floatactions" aria-label="Quick contact">
<a class="floatcall" href="tel:${CONTACT.phoneTel}" data-phone>✆ &nbsp; CALL NOW</a>
<a class="floatwa" data-whatsapp-link data-wa-text="${esc(waText)}" href="https://wa.me/${CONTACT.whatsapp}" rel="noopener">WhatsApp &nbsp; ↗</a>
</div>`;
}

function relatedRoutes(currentSlug, depth) {
  const p = depth === 0 ? "" : "../".repeat(depth);
  const picks = routes.filter((r) => r.slug !== currentSlug).slice(0, 4);
  const links = picks
    .map((r) => `<a href="${p}routes/${r.slug}/">${esc(r.name)} taxi ↗</a>`)
    .join("");
  return `<div class="related-routes"><div class="eyebrow">MORE ROUTES FROM HUBLI</div><h2 class="related-title">Popular outstation cabs</h2><div class="related-links">${links}</div></div>`;
}

function seoHubSection() {
  const serviceLinks = services
    .map((s) => `<a href="/${s.slug}/">${esc(s.shortName)} Hubli</a>`)
    .join("");
  const routeLinks = routes
    .map((r) => `<a href="/routes/${r.slug}/">Hubli to ${esc(r.name)} taxi</a>`)
    .join("");
  return `<section class="seo-hub" aria-label="Service areas"><div class="wrap"><h2>Taxi & cab service in Hubballi (Hubli)</h2><p>Book <strong>taxi service in Hubli</strong> and <strong>cab service in Hubballi</strong> for <a href="/outstation-cab/">outstation trips</a>, <a href="/airport-taxi/">airport transfers</a>, <a href="/local-taxi-hubli/">local city rental</a>, one-way drops, and family round trips. WhatsApp <a href="mailto:${CONTACT.email}" data-email>${esc(CONTACT.email)}</a> or call <a href="tel:${CONTACT.phoneTel}" data-phone>${esc(CONTACT.phoneDisplay)}</a> for a quick quote.</p><div class="seo-links seo-links-services">${serviceLinks}</div><div class="seo-links">${routeLinks}</div></div></section>`;
}

function scripts(depth) {
  const ap = assetPrefix(depth);
  return `<script src="${ap}/js/site-config.js" defer></script><script src="${ap}/js/main.js" defer></script><script src="${ap}/js/analytics.js" defer></script>`;
}

function homePage() {
  const featured = routes.slice(0, 3);
  const allDestCards = routes
    .map(
      (r, i) =>
        `<a href="/routes/${r.slug}/" class="dest"><img src="${destCardImage(r.slug, 0)}" alt="${esc(r.name)} taxi from Hubli Hubballi" width="800" height="600" loading="lazy" decoding="async"><div class="destinfo"><small>${esc(r.category)}</small><h3>${esc(r.name)}</h3><span>${esc(r.tagline)} ↗</span></div></a>`
    )
    .join("\n");

  const { title, description, keywords } = homeSeo;

  return `${head({
    title,
    description,
    keywords,
    canonical: DOMAIN + "/",
    depth: 0,
    ogImage: absoluteImage("home/hero.jpg"),
    jsonLd: [
      businessJsonLd(),
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Omkareshwar Travels",
        url: DOMAIN,
        potentialAction: {
          "@type": "SearchAction",
          target: DOMAIN + "/routes/{search_term_string}/",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  })}
<body>
${topBar(0)}
${nav(0)}
<main>
<section class="hero" id="home" style="--hero-image:url('${imagePath(0, "home/hero.jpg")}')"><div class="wrap heroGrid">
 <div><div class="eyebrow">TAXI & CAB SERVICE IN HUBLI · HUBBALLI</div><h1>Taxi & cab service in Hubli.<br><em>Your journey, our commitment.</em></h1><p class="herop">Trusted cab service in Hubballi for outstation trips to Goa, Hampi & the coast, airport transfers, and local rentals — clear WhatsApp quotes, same-day taxis when available, and drivers who know Karnataka roads.</p><div class="herobuttons">${scrollLink(0, "booking", "Plan Your Journey ↗", "btn gold")}<a class="btn outline" data-whatsapp-link data-wa-text="Hello Omkareshwar Travels, I need taxi or cab service in Hubli." href="https://wa.me/${CONTACT.whatsapp}">Chat on WhatsApp</a><a href="tel:${CONTACT.phoneTel}" class="btn outline" data-phone>Call Now</a></div><div class="micro"><span>Taxi service Hubballi</span><span>Cab service in Hubli</span><span>Fast WhatsApp quotes</span></div></div>
 ${bookingForm("", 0, CONTACT.hubCity)}
</div></section>
${conversionStrip()}
<div class="trustbar"><div class="wrap trustgrid">
 <div class="trust"><span class="trusticon">◇</span><div><strong>Comfortable Rides</strong><small>AC fleet & experienced drivers</small></div></div>
 <div class="trust"><span class="trusticon">◎</span><div><strong>Flexible Journeys</strong><small>One-way, round trip & local</small></div></div>
 <div class="trust"><span class="trusticon">↗</span><div><strong>Clear Quotations</strong><small>Discuss before you confirm</small></div></div>
 <div class="trust"><span class="trusticon">✧</span><div><strong>Personal Service</strong><small>Call or WhatsApp anytime</small></div></div>
</div></div>
<section id="fleet"><div class="wrap"><div class="sectionhead"><div><div class="eyebrow">TRAVEL YOUR WAY</div><h2>Find your perfect ride.</h2></div><p>From quick city journeys to group adventures, choose a vehicle that suits your people and your plans.</p></div>
<div class="fleet">
 <article class="car"><div class="carimg"><img src="${imagePath(0, fleetImages.sedan.file)}" alt="${esc(fleetImages.sedan.alt)}" width="960" height="640" loading="lazy" decoding="async"><span class="tag">EVERYDAY COMFORT</span></div><div class="carbody"><h3>Sedan</h3><div class="muted">Dzire / Etios class — ideal for couples & small families</div><div class="specs"><span>♙ 1–4 people</span><span>✓ City & outstation</span></div><div class="carfoot"><strong>Request a quote</strong><button type="button" data-vehicle="Hatchback / Sedan">SELECT ↗</button></div></div></article>
 <article class="car"><div class="carimg"><img src="${imagePath(0, fleetImages.suv.file)}" alt="${esc(fleetImages.suv.alt)}" width="800" height="533" loading="lazy" decoding="async"><span class="tag">FAMILY FAVOURITE</span></div><div class="carbody"><h3>SUV / MUV</h3><div class="muted">Innova / Ertiga class — extra room for family and luggage</div><div class="specs"><span>♙ 4–7 people</span><span>✓ Road trips</span></div><div class="carfoot"><strong>Request a quote</strong><button type="button" data-vehicle="SUV / MUV">SELECT ↗</button></div></div></article>
 <article class="car"><div class="carimg"><img src="${imagePath(0, fleetImages.traveller.file)}" alt="${esc(fleetImages.traveller.alt)}" width="960" height="640" loading="lazy" decoding="async"><span class="tag">GROUP JOURNEYS</span></div><div class="carbody"><h3>Tempo Traveller</h3><div class="muted">Force Traveller — 12 to 17 seater group tours</div><div class="specs"><span>♙ Group seating</span><span>✓ Tours & events</span></div><div class="carfoot"><strong>Request a quote</strong><button type="button" data-vehicle="Tempo Traveller">SELECT ↗</button></div></div></article>
</div><p class="muted" style="margin-top:14px">Vehicle models, seating, and availability are confirmed when you enquire. Fleet photos show typical Dzire-class sedans and Tempo Traveller vans used on Karnataka routes.</p>
</div></section>
<section class="services" id="services"><div class="wrap"><div class="sectionhead"><div><div class="eyebrow">MADE FOR YOUR PLANS</div><h2>One travel partner. Many journeys.</h2></div><p>Whether you know exactly where you're going or need help planning, start with the trip you have in mind.</p></div>
<div class="servicegrid">
 <a class="service servicelink" href="/outstation-cab/"><div class="si">↗</div><h3>Outstation Cabs</h3><p>Intercity rides for business, family visits, and spontaneous getaways.</p><span class="servicemore">Learn more ↗</span></a>
 <a class="service servicelink" href="/local-taxi-hubli/"><div class="si">◷</div><h3>Local Rentals</h3><p>Flexible local travel for errands, meetings, sightseeing, and events.</p><span class="servicemore">Learn more ↗</span></a>
 <a class="service servicelink" href="/airport-taxi/"><div class="si">✈</div><h3>Airport Transfers</h3><p>Hubballi (HBX), Belagavi (IXG), Goa (GOI/GOX), and connection pickups aligned to your flight.</p><span class="servicemore">Learn more ↗</span></a>
 <a class="service servicelink" href="/tempo-traveller-rental/"><div class="si">⌖</div><h3>Temple & Group Tours</h3><p>Bring family and friends together for meaningful journeys and holidays.</p><span class="servicemore">Learn more ↗</span></a>
</div><p class="muted" style="margin-top:14px;text-align:center"><a href="/taxi-services/">View all taxi services in Hubballi ↗</a> · <a href="/one-way-cab/">One way</a> · <a href="/round-trip-taxi/">Round trip</a> · <a href="/innova-cab-hubli/">Innova cab</a></p></div></section>
<section id="destinations"><div class="wrap"><div class="sectionhead"><div><div class="eyebrow">GET INSPIRED</div><h2>Every road has a story.</h2></div><p>Top Karnataka & Goa routes from Hubballi (Hubli) — tap a destination for travel tips and instant WhatsApp quotes.</p></div>
<div class="destgrid routes-all">
${allDestCards}
</div></div></section>
<section class="about" id="about"><div class="wrap aboutgrid"><div class="aboutpic"><img src="${imagePath(0, "home/about.jpg")}" alt="Scenic open road and landscape" width="1000" height="667" loading="lazy" decoding="async"><div class="aboutbadge">The journey should feel as good as the destination.<span>THE OMKARESHWAR APPROACH</span></div></div>
<div class="aboutcopy"><div class="eyebrow">A MORE PERSONAL WAY TO TRAVEL</div><h2>Good journeys start with good planning.</h2><p>Based in <strong>Hubballi (Hubli)</strong>, we specialise in outstation taxis to Goa, coastal Karnataka, Hampi, Coorg, Belagavi, and adventure hubs like Dandeli — with sedans, SUVs, Innova, and Tempo Travellers.</p><p>Share your route and dates on WhatsApp at <a href="mailto:${CONTACT.email}" data-email>${esc(CONTACT.email)}</a> or call us directly. We discuss vehicle options, driver details, and transparent pricing before you confirm.</p><div class="points"><div class="point">Hubli railway & city pickups</div><div class="point">Goa & coastal route expertise</div><div class="point">Corporate & family group travel</div><div class="point">Airport & railway transfers</div></div>${scrollLink(0, "booking", "LET'S PLAN YOUR TRIP ↗", "btn gold")}</div>
</div></section>
<section class="reviews"><div class="wrap"><div class="sectionhead"><div><div class="eyebrow">TRAVEL WITH CONFIDENCE</div><h2>Your trust matters.</h2></div><p>High-intent travel needs clear communication — we focus on punctual pickups, safe driving, and honest quotations.</p></div>
<div class="reviewgrid">
 <article class="review"><div class="stars">★★★★★</div><blockquote>“The best journeys are the ones where you can relax and enjoy the ride.”</blockquote><strong>What we aim for</strong><small>Comfort and peace of mind</small></article>
 <article class="review"><div class="stars">★★★★★</div><blockquote>“A good trip starts when your travel plans are understood from the beginning.”</blockquote><strong>Our approach</strong><small>Clear, personalised planning</small></article>
 <article class="review"><div class="stars">★★★★★</div><blockquote>“From a short ride to a longer getaway, every detail deserves attention.”</blockquote><strong>Our promise</strong><small>Service built around your trip</small></article>
</div></div></section>
${seoHubSection()}
<div class="cta"><div class="wrap ctainner"><div><h2>Your next journey starts here.</h2><p>Call now or send your route on WhatsApp — we respond quickly with vehicle options and fares.</p></div><div class="ctabtns">${scrollLink(0, "booking", "GET A QUOTE ↗", "btn darkbtn")}<a href="tel:${CONTACT.phoneTel}" class="btn lightbtn" data-phone>CALL US</a></div></div></div>
</main>
${footer(0)}
${floatActions("Hello Omkareshwar Travels, I would like a taxi quote.")}
${scripts(0)}
</body></html>`;
}

function routePage(route) {
  const copy = routeCopy[route.slug] || { intro: "", highlights: [], faq: [] };
  const url = `${DOMAIN}/routes/${route.slug}/`;
  const { title, description, keywords } = routeSeo(route);
  const highlights = copy.highlights.map((h) => `<li>${esc(h)}</li>`).join("");
  const faqHtml = copy.faq
    .map((f) => `<article><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></article>`)
    .join("");
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${route.name} outstation taxi`,
    provider: { "@type": "TravelAgency", name: "Omkareshwar Travels", url: DOMAIN },
    areaServed: "Karnataka, India",
    description: copy.intro,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      url
    }
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: DOMAIN + "/" },
      { "@type": "ListItem", position: 2, name: route.name, item: url }
    ]
  };

  return `${head({
    title,
    description,
    keywords,
    canonical: url,
    depth: 2,
    ogImage: absoluteImage(`destinations/${route.slug}/hero.jpg`),
    jsonLd: [businessJsonLd(), breadcrumb, serviceLd, faqLd]
  })}
<body>
${topBar()}
${nav(2)}
<main>
<section class="hero" style="--hero-image:url('${destHeroImage(route.slug, 2)}')"><div class="wrap heroGrid route-hero-grid">
 <div>
  <p class="breadcrumb"><a href="../../">Home</a> / <a href="../../" data-scroll-target="destinations">Routes</a> / ${esc(route.name)}</p>
  <div class="eyebrow">${esc(route.category)}</div>
  <h1>Hubli to ${esc(route.name)} taxi & cab<br><em>from Hubballi</em></h1>
  <p class="herop">${esc(copy.intro)}</p>
  <div class="herobuttons">${bookingButton(`Get ${esc(route.name)} Quote ↗`, "btn gold")}<a class="btn outline" data-whatsapp-link data-wa-text="Hello, I need a Hubli to ${route.name} taxi." href="https://wa.me/${CONTACT.whatsapp}">WhatsApp</a><a href="tel:${CONTACT.phoneTel}" class="btn outline" data-phone>Call Now</a></div>
  <div class="route-meta">
   <div><strong>From Hubballi</strong><span>${esc(route.distanceFromHubli)}</span></div>
   <div><strong>Ideal stay</strong><span>${esc(route.idealDuration)}</span></div>
   <div><strong>Best season</strong><span>${esc(route.bestSeason)}</span></div>
   <div><strong>Enquiry</strong><span>WhatsApp or phone</span></div>
  </div>
 </div>
</div></section>
<section class="route-body"><div class="wrap route-columns">
 <div>
  <h2>Why travel to ${esc(route.name)} with us?</h2>
  <p>${esc(copy.intro)}</p>
  <h3>Highlights on this route</h3>
  <ul>${highlights}</ul>
  <h3>Vehicle options</h3>
  <p>Choose a hatchback or sedan for couples, SUV or Innova for families, or a Tempo Traveller for temple groups and college trips. Mention luggage, child seats, and AC preferences in your WhatsApp message for an accurate quote.</p>
  <div class="route-faq" style="margin-top:24px">
   <div class="eyebrow">FAQ</div>
   <h2 style="font:500 24px Georgia,serif;margin:8px 0 16px">Common questions</h2>
   ${faqHtml}
  </div>
 </div>
 <aside class="route-sidebar">${bookingForm(route.name, 2, CONTACT.hubCity)}</aside>
</div></section>
<section class="route-related"><div class="wrap">${relatedRoutes(route.slug, 2)}</div></section>
<div class="cta"><div class="wrap ctainner"><div><h2>Ready for ${esc(route.name)}?</h2><p>Share pickup in Hubli, travel dates, and group size — we reply on WhatsApp with fare options.</p></div><div class="ctabtns">${bookingButton("WHATSAPP QUOTE ↗", "btn darkbtn")}<a href="tel:${CONTACT.phoneTel}" class="btn lightbtn" data-phone>CALL</a></div></div></div>
</main>
${footer(2)}
${floatActions(`Hello, I need a taxi to ${route.name}.`)}
${scripts(2)}
</body></html>`;
}

function popularRoutesBlock(service, depth) {
  const p = depth === 0 ? "" : "../".repeat(depth);
  const picks = (service.popularRoutes || [])
    .map((slug) => routes.find((r) => r.slug === slug))
    .filter(Boolean);
  if (!picks.length) return "";
  const links = picks
    .map((r) => `<a href="${p}routes/${r.slug}/">Hubli to ${esc(r.name)} taxi ↗</a>`)
    .join("");
  return `<div class="related-routes"><div class="eyebrow">POPULAR ROUTES</div><h2 class="related-title">Book with this service</h2><div class="related-links">${links}</div></div>`;
}

function otherServicesBlock(currentSlug, depth) {
  const p = depth === 0 ? "" : "../".repeat(depth);
  const picks = services.filter((s) => s.slug !== currentSlug).slice(0, 5);
  const links = picks.map((s) => `<a href="${p}${s.slug}/">${esc(s.shortName)} ↗</a>`).join("");
  return `<div class="related-routes" style="margin-top:24px"><div class="eyebrow">MORE SERVICES</div><h2 class="related-title">Other taxi options</h2><div class="related-links">${links}<a href="${p}taxi-services/">All services ↗</a></div></div>`;
}

function serviceDefaultVehicle(service) {
  if (service.slug === "innova-cab-hubli") return "Innova";
  if (service.slug === "tempo-traveller-rental") return "Tempo Traveller";
  return "";
}

function servicePage(service) {
  const depth = 1;
  const url = `${DOMAIN}/${service.slug}/`;
  const body = serviceBodyText(service.body);
  const highlights = (service.highlights || []).map((h) => `<li>${esc(h)}</li>`).join("");
  const faq = service.faq || [];
  const faqHtml = faq
    .map((f) => `<article><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></article>`)
    .join("");
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.h1,
    provider: { "@type": "TravelAgency", name: "Omkareshwar Travels", url: DOMAIN },
    areaServed: { "@type": "City", name: "Hubballi" },
    description: service.intro,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      url
    }
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: DOMAIN + "/" },
      { "@type": "ListItem", position: 2, name: "Taxi Services", item: DOMAIN + "/taxi-services/" },
      { "@type": "ListItem", position: 3, name: service.shortName, item: url }
    ]
  };
  const waText = `Hello Omkareshwar Travels, I need ${service.shortName} from Hubli.`;
  const defaultVehicle = serviceDefaultVehicle(service);

  return `${head({
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.metaKeywords,
    canonical: url,
    depth,
    ogImage: absoluteImage(service.heroImage),
    jsonLd: [businessJsonLd(), breadcrumb, serviceLd, faqLd]
  })}
<body>
${topBar()}
${nav(depth)}
<main>
<section class="hero" style="--hero-image:url('${imagePath(depth, service.heroImage)}')"><div class="wrap heroGrid route-hero-grid">
 <div>
  <p class="breadcrumb"><a href="../">Home</a> / <a href="../taxi-services/">Taxi Services</a> / ${esc(service.shortName)}</p>
  <div class="eyebrow">${esc(service.eyebrow)}</div>
  <h1>${esc(service.h1)}<br><em>${esc(service.h1Em)}</em></h1>
  <p class="herop">${esc(service.intro)}</p>
  <div class="herobuttons">${bookingButton(`Book ${esc(service.shortName)} ↗`, "btn gold")}<a class="btn outline" data-whatsapp-link data-wa-text="${esc(waText)}" href="https://wa.me/${CONTACT.whatsapp}">WhatsApp</a><a href="tel:${CONTACT.phoneTel}" class="btn outline" data-phone>Call ${esc(CONTACT.phoneDisplay)}</a></div>
  <div class="route-meta">
   <div><strong>Based in</strong><span>${esc(HUB_LABEL)}</span></div>
   <div><strong>Quote</strong><span>WhatsApp or phone</span></div>
   <div><strong>Fleet</strong><span>Sedan · SUV · Innova · Traveller</span></div>
   <div><strong>Service</strong><span>${esc(service.shortName)}</span></div>
  </div>
 </div>
</div></section>
<section class="route-body"><div class="wrap route-columns">
 <div>
  <h2>${esc(service.shortName)} from Hubballi — what you get</h2>
  <p>${esc(body)}</p>
  <h3>Why book with Omkareshwar Travels</h3>
  <ul>${highlights}</ul>
  <p>Call <a href="tel:${CONTACT.phoneTel}" data-phone>${esc(CONTACT.phoneDisplay)}</a> or send your pickup, destination, date, and passenger count on WhatsApp for a clear fare before you travel.</p>
  <div class="route-faq" style="margin-top:24px">
   <div class="eyebrow">FAQ</div>
   <h2 style="font:500 24px Georgia,serif;margin:8px 0 16px">Common questions</h2>
   ${faqHtml}
  </div>
  ${otherServicesBlock(service.slug, depth)}
 </div>
 <aside class="route-sidebar">${bookingForm("", depth, CONTACT.hubCity, service.defaultTrip, defaultVehicle)}</aside>
</div></section>
<section class="route-related"><div class="wrap">${popularRoutesBlock(service, depth)}</div></section>
<div class="cta"><div class="wrap ctainner"><div><h2>Book ${esc(service.shortName)} today</h2><p>High-intent travel deserves a fast reply — share your trip on WhatsApp and we confirm vehicle and pricing.</p></div><div class="ctabtns">${bookingButton("GET QUOTE ↗", "btn darkbtn")}<a href="tel:${CONTACT.phoneTel}" class="btn lightbtn" data-phone>CALL NOW</a></div></div></div>
</main>
${footer(depth)}
${floatActions(waText)}
${scripts(depth)}
</body></html>`;
}

function taxiServicesHubPage() {
  const depth = 1;
  const url = `${DOMAIN}/taxi-services/`;
  const { title, description, keywords } = taxiServicesHubSeo;
  const cards = services
    .map(
      (s) =>
        `<a class="dest service-hub-card" href="../${s.slug}/"><img src="${imagePath(depth, s.heroImage)}" alt="${esc(s.shortName)} in Hubballi" width="800" height="600" loading="lazy" decoding="async"><div class="destinfo"><small>${esc(s.eyebrow)}</small><h3>${esc(s.shortName)}</h3><span>${esc(s.intro.slice(0, 90))}… ↗</span></div></a>`
    )
    .join("\n");
  return `${head({
    title: `${title} | ${BRAND}`,
    description,
    keywords,
    canonical: url,
    depth,
    ogImage: absoluteImage("home/hero.jpg"),
    jsonLd: [
      businessJsonLd(),
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: DOMAIN + "/" },
          { "@type": "ListItem", position: 2, name: "Taxi Services", item: url }
        ]
      }
    ]
  })}
<body>
${topBar()}
${nav(depth)}
<main>
<section class="hero" style="--hero-image:url('${imagePath(depth, "home/hero.jpg")}')"><div class="wrap heroGrid route-hero-grid">
 <div>
  <p class="breadcrumb"><a href="../">Home</a> / Taxi Services</p>
  <div class="eyebrow">TAXI & CAB SERVICE IN HUBLI · HUBBALLI</div>
  <h1>Taxi & cab services<br><em>in Hubballi</em></h1>
  <p class="herop">Choose the cab service you need — outstation, airport, local hourly rental, one-way drops, family round trips, Innova, or Tempo Traveller — then book with a fast WhatsApp quote.</p>
  <div class="herobuttons">${bookingButton("Request a quote ↗", "btn gold")}<a class="btn outline" data-whatsapp-link data-wa-text="Hello, I need a taxi from Hubli." href="https://wa.me/${CONTACT.whatsapp}">WhatsApp</a></div>
 </div>
</div></section>
<section id="destinations"><div class="wrap"><div class="sectionhead"><div><div class="eyebrow">CHOOSE YOUR SERVICE</div><h2>Book the trip type you need.</h2></div><p>Each page explains fares, FAQs, and popular routes — then you enquire on WhatsApp in one tap.</p></div>
<div class="destgrid routes-all">
${cards}
</div></div></section>
${seoHubSection().replace(/href="\//g, 'href="../')}
<div class="cta"><div class="wrap ctainner"><div><h2>Not sure which service fits?</h2><p>Message your pickup and destination — we suggest the right cab and trip type.</p></div><div class="ctabtns">${bookingButton("WHATSAPP QUOTE ↗", "btn darkbtn")}<a href="tel:${CONTACT.phoneTel}" class="btn lightbtn" data-phone>CALL</a></div></div></div>
</main>
${footer(depth)}
${floatActions("Hello Omkareshwar Travels, I need a taxi from Hubli.")}
${scripts(depth)}
</body></html>`;
}

function legalPage(kind) {
  const isPrivacy = kind === "privacy";
  const slug = isPrivacy ? "privacy-policy" : "terms";
  const url = DOMAIN + "/" + slug + "/";
  const title = isPrivacy ? `Privacy Policy | ${BRAND}` : `Terms & Conditions | ${BRAND}`;
  const description = isPrivacy
    ? `How ${BRAND} uses contact and trip details you share for Hubli & Hubballi taxi and cab bookings on omkareshwartravels.com.`
    : `Booking terms for ${BRAND} taxi & cab service in Hubballi — fares, cancellations, and outstation travel from Hubli.`;
  const body = isPrivacy
    ? `<h1>Privacy Policy</h1><p>Omkareshwar Travels ("we") collects contact details and trip information you submit via phone, WhatsApp, or forms on omkareshwartravels.com solely to provide quotations and taxi services.</p><h2>Data we collect</h2><p>Name, phone number, pickup and drop locations, travel dates, and passenger counts.</p><h2>How we use data</h2><p>To respond to enquiries, assign drivers, and improve service. We do not sell personal data.</p><h2>Retention</h2><p>Trip records are kept as required for operations and applicable law.</p><h2>Contact</h2><p><a href="mailto:${CONTACT.email}">${esc(CONTACT.email)}</a></p>`
    : `<h1>Terms & Conditions</h1><p>By booking with Omkareshwar Travels you agree to these terms. Fares are discussed before confirmation; tolls, parking, and state permits may be additional unless included in writing.</p><h2>Bookings</h2><p>Advance confirmation may require a deposit for outstation and multi-day trips.</p><h2>Cancellations</h2><p>Cancellation charges depend on notice period and vehicle allocation — we communicate these when you confirm.</p><h2>Liability</h2><p>We operate with licensed drivers and maintained vehicles; passengers must follow safety guidance during travel.</p><h2>Contact</h2><p><a href="mailto:${CONTACT.email}">${esc(CONTACT.email)}</a></p>`;
  return `${head({
    title,
    description,
    keywords: isPrivacy ? "Omkareshwar Travels privacy, Hubli taxi data policy" : "Omkareshwar Travels terms, Hubballi cab booking terms",
    canonical: url,
    depth: 1,
    jsonLd: [businessJsonLd()]
  })}
<body>
${topBar()}
${nav(1)}
<main><section><div class="wrap legal">${body}<p><a href="../">← Back to home</a></p></div></section></main>
${footer(1)}
${floatActions("Hello Omkareshwar Travels.")}
${scripts(1)}
</body></html>`;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if (ent.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

// clean dist
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

copyDir(path.join(site, "assets"), path.join(dist, "assets"));

write(path.join(dist, "index.html"), homePage());

for (const route of routes) {
  write(path.join(dist, "routes", route.slug, "index.html"), routePage(route));
}

for (const service of services) {
  write(path.join(dist, service.slug, "index.html"), servicePage(service));
}

write(path.join(dist, "taxi-services", "index.html"), taxiServicesHubPage());

write(path.join(dist, "privacy-policy", "index.html"), legalPage("privacy"));
write(path.join(dist, "terms", "index.html"), legalPage("terms"));

const urls = [
  { loc: DOMAIN + "/", priority: "1.0" },
  { loc: DOMAIN + "/taxi-services/", priority: "0.92" },
  ...services.map((s) => ({ loc: `${DOMAIN}/${s.slug}/`, priority: "0.95" })),
  ...routes.map((r) => ({ loc: `${DOMAIN}/routes/${r.slug}/`, priority: "0.9" })),
  { loc: DOMAIN + "/privacy-policy/", priority: "0.3" },
  { loc: DOMAIN + "/terms/", priority: "0.3" }
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url><loc>${u.loc}</loc><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`
  )
  .join("\n")}
</urlset>`;
write(path.join(dist, "sitemap.xml"), sitemap);

write(
  path.join(dist, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
`
);

// simple SVG logo for schema
write(
  path.join(dist, "assets", "img", "logo-mark.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#17221e" stroke="#d9b66f"/><text x="50" y="58" text-anchor="middle" fill="#d9b66f" font-family="Georgia,serif" font-size="42">O</text></svg>`
);

console.log("Built", dist, "—", routes.length, "routes,", services.length, "services");
