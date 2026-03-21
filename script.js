const SITE_CONTENT = {
  contact: {
    whatsapp: "573043535455",
    email: "trabixgranizados@gmail.com",
  },
  socialLinks: {
    instagram: "https://www.instagram.com/trabix_granizados/",
    tiktok: "https://www.tiktok.com/@trabix_granizados",
  },
  messages: {
    "retail-order":
      "Hola, me gustaría obtener más información",
    "retail-coverage":
      "Hola, me gustaría obtener más información",
    "mayoristas-quote":
      "Hola, me gustaría obtener más información sobre mayoristas"
  },
  mailLinks: {
    "emprende-intro": {
      subject: "Quiero emprender con Trabix",
      body: [
        "Hola Trabix,",
        "",
        "Quiero conocer la ruta Emprende con Trabix.",
        "Me interesa revisar como funciona el apoyo de arranque y el primer paso para vender.",
      ].join("\n"),
    },
  },
  socialProof: [
    {
      value: "11 aliados",
      label: "actualmente y creciendo",
    },
    {
      value: "Eventos",
      label: "Producto pensado para fiestas, cumpleaños, movimiento rápido.",
    },
    {
      value: "Vida nocturna",
      label: "bares, discotecas y puntos con alto flujo de personas",
    },
  ],
  retailProducts: [
    {
      kind: "con-licor",
      name: "Smirnoff Lulo",
      image: "/site-assets/products/smirnoff-lulo.png",
      labelGradient: "linear-gradient(135deg,#ffffff,#e0e0e0)",
      labelColor: "#0b0b0b",
    },
    {
      kind: "con-licor",
      name: "Bon Bon Bum Fresa Champaña",
      image: "/site-assets/products/bonbonbum-fresa-champagne.png",
      labelGradient: "linear-gradient(135deg,#ff9a8b,#ff6a88)",
      labelColor: "#1d031b",
    },
    {
      kind: "con-licor",
      name: "Manzana Verde Tequila",
      image: "/site-assets/products/manzana-verde-tequila.png",
      labelGradient: "linear-gradient(135deg,#a8ff78,#78ffd6)",
      labelColor: "#02211a",
    },
    {
      kind: "con-licor",
      name: "Uva Vodka",
      image: "/site-assets/products/uva-vodka.png",
      labelGradient: "linear-gradient(135deg,#a855f7,#6d28d9)",
      labelColor: "#f8f5ff",
    },
    {
      kind: "con-licor",
      name: "Bon Bon Bum Whiskey",
      image: "/site-assets/products/bonbonbum-whiskey.png",
      labelGradient: "linear-gradient(135deg,#ff5f6d,#f64f59)",
      labelColor: "#1b0303",
    },
    {
      kind: "con-licor",
      name: "Maracumango Ron Blanco",
      image: "/site-assets/products/maracumango-ron-blanco.png",
      labelGradient: "linear-gradient(135deg,#ffe066,#f6c343)",
      labelColor: "#1f1200",
    },
    {
      kind: "con-licor",
      name: "Blueberry Vodka",
      image: "/site-assets/products/blueberry-vodka.png",
      labelGradient: "linear-gradient(135deg,#3b82f6,#1e3a8a)",
      labelColor: "#fefefe",
    },
    {
      kind: "sin-licor",
      name: "Blueberry",
      image: "/site-assets/products/blueberry.png",
      labelGradient: "linear-gradient(135deg,#2563eb,#1d4ed8)",
      labelColor: "#fefefe",
    },
    {
      kind: "sin-licor",
      name: "Bon Bon Bum",
      image: "/site-assets/products/bonbonbum.png",
      labelGradient: "linear-gradient(135deg,#ff5f6d,#ffc371)",
      labelColor: "#1f0b00",
    },
    {
      kind: "sin-licor",
      name: "Manzana Verde",
      image: "/site-assets/products/manzana-verde.png",
      labelGradient: "linear-gradient(135deg,#11998e,#38ef7d)",
      labelColor: "#041a0c",
    },
    {
      kind: "sin-licor",
      name: "Maracumango",
      image: "/site-assets/products/maracumango.png",
      labelGradient: "linear-gradient(135deg,#f46b45,#eea849)",
      labelColor: "#2b0a00",
    },
  ],
  wholesalePricing: [
    {
      line: "Con licor",
      tiers: [
        { range: "20-49 u", price: "$4.900" },
        { range: "50-99 u", price: "$4.700" },
        { range: "100+ u", price: "$4.500" },
      ],
    },
    {
      line: "Sin licor",
      tiers: [
        { range: "20-49 u", price: "$4.800" },
        { range: "50-99 u", price: "$4.500" },
        { range: "100+ u", price: "$4.200" },
      ],
    },
  ],
  partnerExample: {
    headline:
      "Si empiezas con $100.000, puedes recaudar un ingreso bruto de hasta $380.000.",
    detail:
      "Y lo mejor de todo, no lo harás solo, tendrás ayuda total logística y financiera para visualizar el dinero que generas, accedes a un grupo de whatsapp con los aliados donde manejamos temas como el fondo de recompensas, tienes acceso a una app donde se hará el proceso de logística completo, entre otras ventajas.",
  },
};

const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const partnerForm = document.querySelector("#partner-form");
const siteHeader = document.querySelector(".site-header");

const FORM_FIELD_LIMITS = {
  name: 20,
  city: 15,
  phone: 15,
  amount: 20,
};

function buildWhatsAppLink(message) {
  return `https://wa.me/${SITE_CONTENT.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

function buildMailLink(subject, body) {
  return `mailto:${SITE_CONTENT.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildGmailLink(subject, body) {
  const base = "https://mail.google.com/mail/";
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    tf: "1",
    to: SITE_CONTENT.contact.email,
    su: subject,
    body,
  });

  return `${base}?${params.toString()}`;
}

function enforceFormLimits(form) {
  if (!form) {
    return { values: {} };
  }

  const values = {};
  const formData = new FormData(form);

  Object.entries(FORM_FIELD_LIMITS).forEach(([field, limit]) => {
    const rawValue = String(formData.get(field) || "").trim();
    const truncated =
      rawValue.length > limit ? rawValue.slice(0, limit).trim() : rawValue;

    values[field] = truncated;

    const fieldInput = form.elements[field];
    if (fieldInput) {
      fieldInput.value = truncated;
    }
  });

  return { values };
}

function bindContactLinks() {
  document.querySelectorAll("[data-whatsapp-link]").forEach((node) => {
    const key = node.getAttribute("data-whatsapp-link");
    const message = SITE_CONTENT.messages[key];

    if (!message) {
      return;
    }

    node.setAttribute("href", buildWhatsAppLink(message));
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noreferrer");
  });

  document.querySelectorAll("[data-mail-link]").forEach((node) => {
    const key = node.getAttribute("data-mail-link");
    const item = SITE_CONTENT.mailLinks[key];

    if (!item) {
      return;
    }

    const mailLink = buildMailLink(item.subject, item.body);
    node.setAttribute("href", mailLink);
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noreferrer");

    node.addEventListener("click", (event) => {
      event.preventDefault();
      const gmailLink = buildGmailLink(item.subject, item.body);
      const opened = window.open(gmailLink, "_blank", "noopener");
      if (!opened) {
        window.location.href = mailLink;
      }
    });
  });
}

function bindSocialLinks() {
  document.querySelectorAll("[data-social-link]").forEach((node) => {
    const key = node.getAttribute("data-social-link");
    const href = SITE_CONTENT.socialLinks[key];

    if (!href) {
      return;
    }

    node.setAttribute("href", href);
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noreferrer");
  });
}

function renderProofGrid(id) {
  const container = document.querySelector(id);

  if (!container) {
    return;
  }

  container.innerHTML = SITE_CONTENT.socialProof
    .map(
      (item) => `
        <article class="proof-card glass-card">
          <strong>${item.value}</strong>
          <span>${item.label}</span>
        </article>
      `
    )
    .join("");
}

function renderRetailProducts() {
  const container = document.querySelector("#retail-products");

  if (!container) {
    return;
  }

  container.innerHTML = SITE_CONTENT.retailProducts
    .map((item) => {
      const tagLabel = item.kind === "con-licor" ? "Con licor" : "Sin licor";
      const labelStyle = `--label-bg:${item.labelGradient}; --label-color:${item.labelColor}; --product-image:url('${item.image}');`;

      return `
        <article class="product-card" data-kind="${item.kind}" data-reveal style="${labelStyle}">
          <div class="product-media">
            <img class="product-pack" src="${item.image}" alt="Granizado ${item.name}" />
            <span class="product-tag">${tagLabel}</span>
            <span class="product-name">${item.name}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderWholesalePricing() {
  const container = document.querySelector("#wholesale-pricing-table");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="wholesale-list">
      ${SITE_CONTENT.wholesalePricing
        .map(
          (line) => `
            <article class="wholesale-line glass-card">
              <header>
                <strong>${line.line}</strong>
                <span>Precio unitario</span>
              </header>
              <ul>
                ${line.tiers
                  .map(
                    (tier) => `
                      <li>
                        <span>${tier.range}</span>
                        <strong>${tier.price}</strong>
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderPartnerExample() {
  const exampleContainer = document.querySelector("#partner-example");

  if (exampleContainer) {
    exampleContainer.innerHTML = `
      <strong class="example-value">${SITE_CONTENT.partnerExample.headline}</strong>
      <small>${SITE_CONTENT.partnerExample.detail}</small>
    `;
  }
}

function initFilter() {
  const productCards = Array.from(document.querySelectorAll(".product-card"));

  if (!filterButtons.length || !productCards.length) {
    return;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      productCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.kind === filter;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });
}

function initReveal() {
  const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));

  if (!revealNodes.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -32px 0px",
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function buildPartnerEmail(values) {
  const name = String(values.name || "").trim();
  const city = String(values.city || "").trim();
  const phone = String(values.phone || "").trim();
  const amount = String(values.amount || "").trim();
  const subject = `Emprende con Trabix - ${name || "Nuevo contacto"}`;
  const body = [
    "Hola Trabix,",
    "",
    `Nombre: ${name || "No informado"}`,
    `Ciudad: ${city || "No informada"}`,
    `Telefono de contacto: ${phone || "No informado"}`,
    `Monto disponible para comenzar: ${amount || "No informado"}`,
  ].join("\n");

  return {
    subject,
    body,
    mailLink: buildMailLink(subject, body),
  };
}

function initPartnerForm() {
  if (!partnerForm) {
    return;
  }

  partnerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const { values } = enforceFormLimits(partnerForm);
    const { subject, body, mailLink } = buildPartnerEmail(values);

    const gmailLink = buildGmailLink(subject, body);
    const opened = window.open(gmailLink, "_blank", "noopener");

    if (!opened) {
      window.location.href = mailLink;
    }
  });
}

function initHeaderScrollState() {
  if (!siteHeader) {
    return;
  }

  const syncHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 72);
  };

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });
}

function init() {
  bindContactLinks();
  bindSocialLinks();
  renderProofGrid("#allies-proof-grid");
  renderRetailProducts();
  renderWholesalePricing();
  renderPartnerExample();
  initFilter();
  initReveal();
  initPartnerForm();
  initHeaderScrollState();
}

init();
