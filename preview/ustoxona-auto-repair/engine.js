/* Template engine for generated mockups (генератор/). Based on макеты/_сборка/engine.js,
   plus: SITE.langs (any of en/es/ru, switch cycles through them), Russian UI texts,
   reviews/areas/gallery/rating blocks are skipped when empty.
   Do not edit per client: all business data lives in SITE inside index.html.
   Differences from примеры/engine.js:
   - years, license, hours, email are optional (shown only when filled in);
   - reviewCount is shown next to the rating;
   - no "free estimate" promise in the default texts;
   - SITE.preview = true turns on the watermark, the "free preview" bar and copy protection.
     After payment set preview: false and the site is clean. */
(function () {
  "use strict";

  var UI = {
    call: { en: "Call now", es: "Llamar", ru: "Позвонить" },
    whatsapp: { en: "WhatsApp", es: "WhatsApp", ru: "WhatsApp" },
    services: { en: "What we do", es: "Lo que hacemos", ru: "Что мы делаем" },
    gallery: { en: "Recent work", es: "Trabajos recientes", ru: "Наши работы" },
    reviews: { en: "What customers say", es: "Lo que dicen los clientes", ru: "Отзывы клиентов" },
    areas: { en: "Where we work", es: "Dónde trabajamos", ru: "Где работаем" },
    areasNote: { en: "Not on the list? Call us, we probably cover you.", es: "¿No ve su zona? Llámenos, seguramente llegamos.", ru: "Вашего района нет в списке? Позвоните, скорее всего, приедем." },
    formTitle: { en: "Request an estimate", es: "Pida un presupuesto", ru: "Оставить заявку" },
    formNote: { en: "Tell us about the job and we'll get back to you.", es: "Cuéntenos del trabajo y le respondemos.", ru: "Расскажите, что нужно, и мы вам перезвоним." },
    fName: { en: "Your name", es: "Su nombre", ru: "Ваше имя" },
    fPhone: { en: "Phone", es: "Teléfono", ru: "Телефон" },
    fService: { en: "What do you need?", es: "¿Qué necesita?", ru: "Что нужно?" },
    fDetails: { en: "Details (size, address, timing)", es: "Detalles (tamaño, dirección, fechas)", ru: "Подробности (адрес, сроки)" },
    fSend: { en: "Send request", es: "Enviar solicitud", ru: "Отправить" },
    fSent: { en: "Request sent. This is a preview, so nothing was delivered yet. On the live site it goes straight to your phone.", es: "Solicitud enviada. Esto es una vista previa: en el sitio real llega directo a su teléfono.", ru: "Заявка отправлена. Это предпросмотр, поэтому она никуда не ушла. На настоящем сайте заявка сразу приходит вам на телефон." },
    fError: { en: "Add your name and a 10-digit phone number.", es: "Escriba su nombre y un teléfono de 10 dígitos.", ru: "Укажите имя и телефон из 10 цифр." },
    years: { en: "years in business", es: "años de experiencia", ru: "лет работы" },
    rating: { en: "on Google", es: "en Google", ru: "в Google" },
    reviewsWord: { en: "reviews", es: "reseñas", ru: "отзывов" },
    galleryNote: { en: "Sample photos. Your own project photos go here.", es: "Fotos de muestra. Aquí van las fotos de sus propios trabajos.", ru: "Фото для примера. Здесь будут фото ваших работ." },
    pvBar: { en: "Free preview made for {name} · Not live yet", es: "Vista previa gratuita para {name} · Aún no publicada", ru: "Бесплатный макет для {name} · Ещё не опубликован" },
    pvMark: { en: "PREVIEW · CREW SITES", es: "PREVIEW · CREW SITES", ru: "PREVIEW · CREW SITES" },
    hours: { en: "Hours", es: "Horario", ru: "Часы работы" },
    rights: { en: "All rights reserved.", es: "Todos los derechos reservados.", ru: "Все права защищены." },
    waText: { en: "Hi! I'd like an estimate.", es: "¡Hola! Quisiera un presupuesto.", ru: "Здравствуйте! Хочу узнать стоимость." }
  };
  /* Name of each language on the switch button. SITE.langs lists the languages of this site,
     the first one is the default unless SITE.defaultLang says otherwise. */
  var LANG_NAMES = { en: "English", es: "Español", ru: "Русский" };

  var site = window.SITE;
  var langs = site.langs && site.langs.length ? site.langs : ["en", "es"];
  var lang = pickLang();

  function pickLang() {
    var fromUrl = new URLSearchParams(location.search).get("lang");
    if (langs.indexOf(fromUrl) !== -1) return fromUrl;
    try {
      var saved = localStorage.getItem("site-lang:" + site.name);
      if (langs.indexOf(saved) !== -1) return saved;
    } catch (e) { /* storage blocked: use default */ }
    return langs.indexOf(site.defaultLang) !== -1 ? site.defaultLang : langs[0];
  }
  function nextLang() { return langs[(langs.indexOf(lang) + 1) % langs.length]; }

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
        '<nav class="head-actions">' + (langs.length > 1 ? '<button class="lang" type="button" data-lang-toggle>' + esc(LANG_NAMES[nextLang()] || nextLang()) + "</button>" : "") +
        '<a class="head-call" href="' + tel() + '">' + ICON_PHONE + "<span>" + esc(site.phone) + "</span></a></nav></div></header>";
    },
    hero: function () {
      var h = site.hero;
      return '<section class="hero hero-' + esc(site.heroStyle || "split") + '" id="top">' +
        '<div class="hero-media"><img src="' + esc(h.image) + '" alt="' + esc(t(h.imageAlt)) + '" fetchpriority="high"></div>' +
        '<div class="wrap hero-body"><p class="hero-kicker">' + esc(t(site.tagline)) + "</p>" +
        "<h1>" + esc(t(h.title)) + "</h1>" +
        '<p class="hero-sub">' + esc(t(h.subtitle)) + "</p>" + buttons("hero-btns") +
        '<ul class="proof">' + (site.rating ? "<li><b>" + esc(site.rating) + " " + stars(site.rating) + "</b> " +
        (site.reviewCount ? esc(site.reviewCount) + " " + esc(ui("reviewsWord")) + " " : "") + esc(ui("rating")) + "</li>" : "") +
        (site.years ? "<li><b>" + esc(site.years) + "</b> " + esc(ui("years")) + "</li>" : "") +
        (site.license ? "<li>" + esc(t(site.license)) + "</li>" : "") + "</ul></div></section>";
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
      if (!site.gallery || !site.gallery.length) return "";
      return '<section class="gallery" id="work"><div class="wrap"><h2>' + esc(ui("gallery")) + "</h2>" +
        '<div class="gallery-grid">' + site.gallery.map(function (g) {
          return '<figure><img src="' + esc(g.src) + '" alt="' + esc(t(g.caption)) + '" loading="lazy">' +
            "<figcaption>" + esc(t(g.caption)) + "</figcaption></figure>";
        }).join("") + "</div>" +
        (site.preview ? '<p class="pv-gallery-note">' + esc(ui("galleryNote")) + "</p>" : "") + "</div></section>";
    },
    reviews: function () {
      if (!site.reviews || !site.reviews.length) return "";
      return '<section class="reviews" id="reviews"><div class="wrap"><h2>' + esc(ui("reviews")) + "</h2>" +
        '<div class="review-list">' + site.reviews.map(function (r) {
          return '<blockquote class="review"><div class="stars" aria-label="' + (r.stars || 5) + ' stars">' + stars(r.stars) + "</div>" +
            "<p>" + esc(t(r.text)) + "</p><footer>" + esc(t(r.name)) + (r.area ? ", " + esc(r.area) : "") + "</footer></blockquote>";
        }).join("") + "</div></div></section>";
    },
    areas: function () {
      if (!site.areas || !site.areas.length) return "";
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
        (site.hours ? "<p>" + esc(ui("hours")) + ": " + esc(t(site.hours)) + "</p>" : "") +
        '<p class="fine">© ' + new Date().getFullYear() + " " + esc(site.name) + ". " + esc(ui("rights")) + "</p></div></footer>" +
        '<div class="mobile-bar">' + buttons("", true) + "</div>";
    }
  };

  function applyColors() {
    var root = document.documentElement;
    Object.keys(site.colors || {}).forEach(function (k) { root.style.setProperty("--" + k, site.colors[k]); });
  }

  function bind() {
    var toggle = document.querySelector("[data-lang-toggle]");
    if (toggle) toggle.addEventListener("click", function () {
      lang = nextLang();
      try { localStorage.setItem("site-lang:" + site.name, lang); } catch (e) { /* storage blocked */ }
      render();
    });
    var form = document.querySelector("[data-estimate]");
    if (form) form.addEventListener("submit", function (e) {
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
    if (site.preview) updatePreviewBar();
  }

  /* ---------- Preview watermark (SITE.preview = true) ----------
     Several independent layers, so deleting one element does not remove it:
     1) body background (visible in light gaps), 2) body::after overlay (pseudo-element,
     cannot be deleted as a node), 3) two extra overlay nodes with an offset pattern,
     4) a top bar. A MutationObserver puts back anything that gets removed.
     All overlays use pointer-events:none, so buttons and the form keep working.
     This is a deterrent, not real protection. */
  var PV_STYLE_ID = "pv-style";
  var PV_TILE_W = 600;
  var PV_TILE_H = 340;

  function tileUrl() {
    var text = esc(ui("pvMark"));
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + PV_TILE_W + '" height="' + PV_TILE_H + '">' +
      '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" ' +
      'transform="rotate(-28 ' + PV_TILE_W / 2 + " " + PV_TILE_H / 2 + ')" ' +
      'font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" letter-spacing="3" ' +
      'fill="rgba(25,25,25,0.16)" stroke="rgba(255,255,255,0.28)" stroke-width="1">' + text + "</text></svg>";
    return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
  }

  function previewCss() {
    var tile = tileUrl();
    var half = PV_TILE_W / 2 + "px " + PV_TILE_H / 2 + "px";
    var layer = "position:fixed!important;inset:0!important;pointer-events:none!important;z-index:2147483000!important;" +
      "display:block!important;opacity:1!important;visibility:visible!important;background-image:" + tile + "!important;background-repeat:repeat!important;";
    return "body.pv{background-image:" + tile + ";background-repeat:repeat;}body.pv #app{position:relative;}" +
      "body.pv::after{content:'';" + layer + "}" +
      ".pv-layer{" + layer + "}" +
      ".pv-layer.pv-b{background-position:" + half + "!important;}" +
      "body.pv,body.pv *{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important;}" +
      "body.pv input,body.pv textarea,body.pv select{-webkit-user-select:text!important;user-select:text!important;}" +
      "body.pv img{-webkit-user-drag:none;}" +
      ".pv-bar{position:relative;z-index:25;background:#141C24;color:#fff;font:600 13px/1.35 Arial,Helvetica,sans-serif;" +
      "text-align:center;padding:9px 14px;letter-spacing:.01em;}" +
      ".pv-bar b{color:#FF8A5B;font-weight:700;}" +
      ".pv-gallery-note{margin:14px 0 0;font-size:14px;opacity:.75;font-style:italic;}" +
      "@media print{body.pv #app{display:none!important;}body.pv::before{content:'Preview. Not for use.';display:block;font:700 28px Arial;padding:40px;}}";
  }

  function ensureStyle() {
    var style = document.getElementById(PV_STYLE_ID);
    if (style && style.textContent) return;
    if (style) style.remove();
    style = document.createElement("style");
    style.id = PV_STYLE_ID;
    style.textContent = previewCss();
    document.head.appendChild(style);
  }

  function ensureNode(cls, parent, before) {
    var node = parent.querySelector(":scope > ." + cls.split(" ").join("."));
    if (node) {
      if (node.getAttribute("style")) node.removeAttribute("style");
      return node;
    }
    node = document.createElement("div");
    node.className = cls;
    node.setAttribute("aria-hidden", "true");
    parent.insertBefore(node, before || null);
    return node;
  }

  function updatePreviewBar() {
    var bar = ensureNode("pv-bar", document.body, document.body.firstChild);
    var html = esc(ui("pvBar")).replace("{name}", "<b>" + esc(site.name) + "</b>");
    // compare against a stored key, not innerHTML (the browser re-serializes entities)
    if (bar.getAttribute("data-k") === html && bar.textContent) return;
    bar.innerHTML = html;
    bar.setAttribute("data-k", html);
  }

  function ensurePreview() {
    ensureStyle();
    if (!document.body.classList.contains("pv")) document.body.classList.add("pv");
    updatePreviewBar();
    ensureNode("pv-layer pv-a", document.body);
    ensureNode("pv-layer pv-b", document.documentElement);
  }

  function blockCopy(e) {
    var tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    e.preventDefault();
  }

  function startPreview() {
    ensurePreview();
    ["contextmenu", "copy", "cut", "dragstart", "selectstart"].forEach(function (type) {
      document.addEventListener(type, blockCopy, true);
    });
    document.addEventListener("keydown", function (e) {
      var key = (e.key || "").toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (key === "s" || key === "u" || key === "p")) e.preventDefault();
    }, true);
    var busy = false;
    new MutationObserver(function () {
      if (busy) return;
      busy = true;
      ensurePreview();
      busy = false;
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
  }

  applyColors();
  render();
  if (site.preview) startPreview();
})();
