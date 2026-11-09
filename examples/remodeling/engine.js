/* Template engine — the same file in every example folder.
   Do not edit per client: all business data lives in SITE inside index.html. */
(function () {
  "use strict";

  var UI = {
    call: { en: "Call now", es: "Llamar" },
    whatsapp: { en: "WhatsApp", es: "WhatsApp" },
    services: { en: "What we do", es: "Lo que hacemos" },
    gallery: { en: "Recent work", es: "Trabajos recientes" },
    reviews: { en: "What customers say", es: "Lo que dicen los clientes" },
    areas: { en: "Where we work", es: "Dónde trabajamos" },
    areasNote: { en: "Not on the list? Call us, we probably cover you.", es: "¿No ve su zona? Llámenos, seguramente llegamos." },
    formTitle: { en: "Get a free estimate", es: "Pida un presupuesto gratis" },
    formNote: { en: "Tell us about the job. We reply the same day.", es: "Cuéntenos del trabajo. Respondemos el mismo día." },
    fName: { en: "Your name", es: "Su nombre" },
    fPhone: { en: "Phone", es: "Teléfono" },
    fService: { en: "What do you need?", es: "¿Qué necesita?" },
    fDetails: { en: "Details (size, address, timing)", es: "Detalles (tamaño, dirección, fechas)" },
    fSend: { en: "Send request", es: "Enviar solicitud" },
    fSent: { en: "Request sent. This is a preview, so nothing was delivered yet. On the live site it goes straight to your phone.", es: "Solicitud enviada. Esto es una vista previa: en el sitio real llega directo a su teléfono." },
    fError: { en: "Add your name and a 10-digit phone number.", es: "Escriba su nombre y un teléfono de 10 dígitos." },
    years: { en: "years in business", es: "años de experiencia" },
    rating: { en: "on Google", es: "en Google" },
    hours: { en: "Hours", es: "Horario" },
    rights: { en: "All rights reserved.", es: "Todos los derechos reservados." },
    lang: { en: "Español", es: "English" },
    waText: { en: "Hi! I'd like a free estimate.", es: "¡Hola! Quiero un presupuesto gratis." }
  };

  var site = window.SITE;
  var lang = pickLang();

  function pickLang() {
    var fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl === "en" || fromUrl === "es") return fromUrl;
    try {
      var saved = localStorage.getItem("site-lang");
      if (saved === "en" || saved === "es") return saved;
    } catch (e) { /* storage blocked: use default */ }
    return site.defaultLang || "en";
  }

  function t(value) {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    return value[lang] || value.en || "";
  }
  function ui(key) { return t((site.ui && site.ui[key]) || UI[key]); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function digits(s) { return String(s).replace(/\D/g, ""); }
  function tel() { var d = digits(site.phone); return "tel:+" + (d.length === 10 ? "1" + d : d); }
  function wa() { return "https://wa.me/" + digits(site.whatsapp) + "?text=" + encodeURIComponent(ui("waText")); }
  function stars(n) { return "★★★★★".slice(0, Math.round(n || 5)); }

  var ICON_PHONE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"/></svg>';
  var ICON_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>';

  function buttons(extraClass, short) {
    return '<div class="btns ' + (extraClass || "") + '">' +
      '<a class="btn btn-call" href="' + tel() + '">' + ICON_PHONE + "<span>" + esc(ui("call")) + (short ? "" : " " + esc(site.phone)) + "</span></a>" +
      '<a class="btn btn-wa" href="' + wa() + '" target="_blank" rel="noopener">' + ICON_WA + "<span>" + esc(ui("whatsapp")) + "</span></a></div>";
  }

  var SECTIONS = {
    header: function () {
      return '<header class="site-header"><div class="wrap">' +
        '<a class="logo" href="#top">' + esc(site.name) + "</a>" +
        '<nav class="head-actions"><button class="lang" type="button" data-lang-toggle>' + esc(ui("lang")) + "</button>" +
        '<a class="head-call" href="' + tel() + '">' + ICON_PHONE + "<span>" + esc(site.phone) + "</span></a></nav></div></header>";
    },
    hero: function () {
      var h = site.hero;
      return '<section class="hero hero-' + esc(site.heroStyle || "split") + '" id="top">' +
        '<div class="hero-media"><img src="' + esc(h.image) + '" alt="' + esc(t(h.imageAlt)) + '" fetchpriority="high"></div>' +
        '<div class="wrap hero-body"><p class="hero-kicker">' + esc(t(site.tagline)) + "</p>" +
        "<h1>" + esc(t(h.title)) + "</h1>" +
        '<p class="hero-sub">' + esc(t(h.subtitle)) + "</p>" + buttons("hero-btns") +
        '<ul class="proof"><li><b>' + esc(site.rating) + " " + stars(site.rating) + "</b> " + esc(ui("rating")) + "</li>" +
        "<li><b>" + esc(site.years) + "</b> " + esc(ui("years")) + "</li>" +
        "<li>" + esc(t(site.license)) + "</li></ul></div></section>";
    },
    services: function () {
      return '<section class="services" id="services"><div class="wrap"><h2>' + esc(ui("services")) + "</h2>" +
        '<div class="service-list">' + site.services.map(function (s) {
          return '<article class="service"' + (s.color ? ' style="--chip:' + esc(s.color) + '"' : "") + ">" +
            (s.chipName ? '<span class="chip-name">' + esc(t(s.chipName)) + "</span>" : "") +
            "<h3>" + esc(t(s.name)) + "</h3><p>" + esc(t(s.text)) + "</p></article>";
        }).join("") + "</div></div></section>";
    },
    gallery: function () {
      return '<section class="gallery" id="work"><div class="wrap"><h2>' + esc(ui("gallery")) + "</h2>" +
        '<div class="gallery-grid">' + site.gallery.map(function (g) {
          return '<figure><img src="' + esc(g.src) + '" alt="' + esc(t(g.caption)) + '" loading="lazy">' +
            "<figcaption>" + esc(t(g.caption)) + "</figcaption></figure>";
        }).join("") + "</div></div></section>";
    },
    reviews: function () {
      return '<section class="reviews" id="reviews"><div class="wrap"><h2>' + esc(ui("reviews")) + "</h2>" +
        '<div class="review-list">' + site.reviews.map(function (r) {
          return '<blockquote class="review"><div class="stars" aria-label="' + (r.stars || 5) + ' stars">' + stars(r.stars) + "</div>" +
            "<p>" + esc(t(r.text)) + "</p><footer>" + esc(r.name) + (r.area ? ", " + esc(r.area) : "") + "</footer></blockquote>";
        }).join("") + "</div></div></section>";
    },
    areas: function () {
      return '<section class="areas" id="areas"><div class="wrap"><h2>' + esc(ui("areas")) + "</h2>" +
        '<ul class="area-list">' + site.areas.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>" +
        '<p class="areas-note">' + esc(ui("areasNote")) + "</p></div></section>";
    },
    estimate: function () {
      var opts = site.services.map(function (s) { return "<option>" + esc(t(s.name)) + "</option>"; }).join("");
      return '<section class="estimate" id="estimate"><div class="wrap estimate-inner">' +
        '<div class="estimate-copy"><h2>' + esc(ui("formTitle")) + "</h2><p>" + esc(ui("formNote")) + "</p>" + buttons() + "</div>" +
        '<form class="estimate-form" novalidate data-estimate>' +
        "<label>" + esc(ui("fName")) + '<input name="name" autocomplete="name" required></label>' +
        "<label>" + esc(ui("fPhone")) + '<input name="phone" type="tel" autocomplete="tel" required></label>' +
        "<label>" + esc(ui("fService")) + '<select name="service">' + opts + "</select></label>" +
        "<label>" + esc(ui("fDetails")) + '<textarea name="details" rows="3"></textarea></label>' +
        '<button class="btn btn-send" type="submit">' + esc(ui("fSend")) + "</button>" +
        '<p class="form-status" role="status" hidden></p></form></div></section>';
    },
    footer: function () {
      return '<footer class="site-footer"><div class="wrap">' +
        '<p class="logo">' + esc(site.name) + "</p>" +
        "<p>" + esc(site.city) + '<br><a href="' + tel() + '">' + esc(site.phone) + "</a>" +
        (site.email ? '<br><a href="mailto:' + esc(site.email) + '">' + esc(site.email) + "</a>" : "") + "</p>" +
        "<p>" + esc(ui("hours")) + ": " + esc(t(site.hours)) + "</p>" +
        '<p class="fine">© ' + new Date().getFullYear() + " " + esc(site.name) + ". " + esc(ui("rights")) + "</p></div></footer>" +
        '<div class="mobile-bar">' + buttons("", true) + "</div>";
    }
  };

  function applyColors() {
    var root = document.documentElement;
    Object.keys(site.colors || {}).forEach(function (k) { root.style.setProperty("--" + k, site.colors[k]); });
  }

  function bind() {
    document.querySelector("[data-lang-toggle]").addEventListener("click", function () {
      lang = lang === "en" ? "es" : "en";
      try { localStorage.setItem("site-lang", lang); } catch (e) { /* storage blocked */ }
      render();
    });
    var form = document.querySelector("[data-estimate]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var missing = !form.elements.name.value.trim() || digits(form.elements.phone.value).length < 10;
      status.hidden = false;
      status.className = "form-status " + (missing ? "is-error" : "is-ok");
      status.textContent = ui(missing ? "fError" : "fSent");
    });
  }

  function render() {
    document.documentElement.lang = lang;
    document.title = site.name + " | " + t(site.tagline);
    var order = site.sections || ["header", "hero", "services", "gallery", "reviews", "areas", "estimate", "footer"];
    document.getElementById("app").innerHTML = order.map(function (k) { return SECTIONS[k](); }).join("");
    bind();
  }

  applyColors();
  render();
})();
