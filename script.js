const SITE_CONTENT = {
  contact: {
    whatsapp: "573043535455",
    email: "trabixgranizados@gmail.com",
  },
  messages: {
    "retail-order":
      "Hola Trabix, quiero hacer un pedido retail. Quiero confirmar sabores, promo activa y disponibilidad.",
    "retail-coverage":
      "Hola Trabix, quiero comprar retail y necesito confirmar cobertura para mi pedido.",
    "mayoristas-quote":
      "Hola Trabix, quiero cotizar granizados para cantidad, evento o reventa. Quiero revisar disponibilidad y cobertura.",
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
      detail: "Base visible para la ruta de credibilidad y para emprender con Trabix.",
    },
    {
      value: "Eventos",
      label: "activaciones y celebraciones privadas",
      detail: "Producto pensado para fiestas, movimiento rápido y lectura clara del formato.",
    },
    {
      value: "Vida nocturna",
      label: "bares, discotecas y puntos con alta rotacion",
      detail: "La marca entra bien donde importa la visibilidad inmediata del producto.",
    },
    {
      value: "Establecimientos",
      label: "puntos aliados y vitrinas de impulso",
      detail: "Llegan donde un granizado tradicional suele ser más difícil de operar.",
    },
  ],
  coverage: [
    {
      title: "Armenia",
      summary: "Cobertura fuerte para retail, eventos, aliados y movimiento de marca.",
      detail: "Es la base principal de operación y la plaza con respuesta más directa.",
    },
    {
      title: "Quindío",
      summary: "Se confirma por WhatsApp según pedido, ruta y disponibilidad.",
      detail: "Retail sujeto a validación; mayoristas y aliados se evalúan caso a caso.",
    },
    {
      title: "Otras ciudades",
      summary: "Enfoque prioritario en compras por volumen o expansión con aliados.",
      detail: "La conversación se ordena según cantidad, logística y tipo de oportunidad.",
    },
  ],
  retailPricing: [
    {
      title: "Con licor",
      value: "Primer granizado $8.000",
      subtitle: "Segundo a mitad de precio",
      notes: [
        "Ejemplos visibles: 3 por $20.000 y 4 por $24.000.",
        "La promo aplica por tipo de producto, no por sabor.",
      ],
    },
    {
      title: "Sin licor",
      value: "$7.000 cada uno",
      subtitle: "Compra clara para antojo, fiestas y venta rápida",
      notes: [
        "Ideal para público general y pedidos sencillos.",
        "Mismo formato 266 ml / 9 oz con lectura inmediata.",
      ],
    },
  ],
  retailPromo: {
    title: "Promo activa retail",
    value: "Con licor: primer granizado $8.000, segundo a mitad de precio.",
    summary: "Mantén este bloque actualizado cuando cambie la promo vigente.",
    bullets: [
      "3 por $20.000",
      "4 por $24.000",
      "Consulta disponibilidad y cobertura por WhatsApp",
    ],
  },
  retailProducts: [
    {
      kind: "con-licor",
      name: "Smirnoff Lulo",
      description: "Fresco, cítrico y listo para una venta de impulso en noche o fiesta.",
      image: "/site-assets/products/smirnoff-lulo.png",
      wordmark: "/site-assets/flavor_design/Smirnoff lulo.png",
      flavorClass: "flavor-smirnoff-lulo",
    },
    {
      kind: "con-licor",
      name: "Bon Bon Bum Fresa Champaña",
      description: "Dulce, brillante y muy fuerte para una compra por antojo visual.",
      image: "/site-assets/products/bonbonbum-fresa-champagne.png",
      wordmark: "/site-assets/flavor_design/Bonbonbum Fresa Champaña.PNG",
      flavorClass: "flavor-bonbonbum-fresa",
    },
    {
      kind: "con-licor",
      name: "Manzana Verde Tequila",
      description: "Ácida, reconocible y fácil de recomendar en una primera compra.",
      image: "/site-assets/products/manzana-verde-tequila.png",
      wordmark: "/site-assets/flavor_design/Manzana Verde Tequila.PNG",
      flavorClass: "flavor-manzana-verde-tequila",
    },
    {
      kind: "con-licor",
      name: "Uva Vodka",
      description: "Color intenso y look directo para destacar en barra o vitrina.",
      image: "/site-assets/products/uva-vodka.png",
      wordmark: "/site-assets/flavor_design/Uva vodka.png",
      flavorClass: "flavor-uva-vodka",
    },
    {
      kind: "con-licor",
      name: "Bon Bon Bum Whiskey",
      description: "Una opción atrevida para quien quiere variar sin perder lectura fácil.",
      image: "/site-assets/products/bonbonbum-whiskey.png",
      wordmark: "/site-assets/flavor_design/Bonbonbum Whiskey.PNG",
      flavorClass: "flavor-bonbonbum-whiskey",
    },
    {
      kind: "con-licor",
      name: "Maracumango Ron Blanco",
      description: "Tropical, alegre y útil para grupos, calor y venta rápida.",
      image: "/site-assets/products/maracumango-ron-blanco.png",
      wordmark: "/site-assets/flavor_design/Maracumango Ron Blanco.PNG",
      flavorClass: "flavor-maracumango-ron",
    },
    {
      kind: "con-licor",
      name: "Blueberry Vodka",
      description: "Azul eléctrico, muy visible y perfecto para antojo inmediato.",
      image: "/site-assets/products/blueberry-vodka.png",
      wordmark: "/site-assets/flavor_design/Blueberry Vodka.PNG",
      flavorClass: "flavor-blueberry-vodka",
    },
    {
      kind: "sin-licor",
      name: "Blueberry",
      description: "Color fuerte y lectura sencilla para público general.",
      image: "/site-assets/products/blueberry.png",
      wordmark: "/site-assets/flavor_design/Blueberry.PNG",
      flavorClass: "flavor-blueberry",
    },
    {
      kind: "sin-licor",
      name: "Bon Bon Bum",
      description: "Sabor reconocible y amable para retail, fiestas y compra casual.",
      image: "/site-assets/products/bonbonbum.png",
      wordmark: "/site-assets/flavor_design/Bonbonbum.PNG",
      flavorClass: "flavor-bonbonbum",
    },
    {
      kind: "sin-licor",
      name: "Manzana Verde",
      description: "Refrescante y fácil de mover entre clientes que quieren algo clásico.",
      image: "/site-assets/products/manzana-verde.png",
      wordmark: "/site-assets/flavor_design/Manzana Verde.PNG",
      flavorClass: "flavor-manzana-verde",
    },
    {
      kind: "sin-licor",
      name: "Maracumango",
      description: "Perfil tropical para clima caliente y venta sin fricción.",
      image: "/site-assets/products/maracumango.png",
      wordmark: "/site-assets/flavor_design/Maracumango.PNG",
      flavorClass: "flavor-maracumango",
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
  partnerMetrics: [
    {
      value: "60%",
      label: "de las ganancias para el aliado",
    },
    {
      value: "Hasta 280%",
      label: "de rentabilidad sobre la inversión",
    },
    {
      value: "$20.000",
      label: "como punto de entrada para empezar",
    },
  ],
  partnerExample: {
    headline:
      "Si empiezas con $100.000, puedes terminar recuperando tus $100.000 y generar hasta $280.000 de ganancia, para un total de hasta $380.000.",
    detail:
      "Trabix puede apoyar con parte del dinero inicial para separar producto y ayudarte a arrancar más fácil.",
  },
};

const yearNode = document.querySelector("#year");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const partnerForm = document.querySelector("#partner-form");
const formNote = document.querySelector("#form-note");
const mailPreview = document.querySelector("#mail-preview");
const mailPreviewSubject = document.querySelector("#mail-preview-subject");
const mailPreviewBody = document.querySelector("#mail-preview-body");
const mailPreviewLink = document.querySelector("#mail-preview-link");
const copyMailButton = document.querySelector("#copy-mail");

function buildWhatsAppLink(message) {
  return `https://wa.me/${SITE_CONTENT.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

function buildMailLink(subject, body) {
  return `mailto:${SITE_CONTENT.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function setYear() {
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
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

    node.setAttribute("href", buildMailLink(item.subject, item.body));
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
          <small>${item.detail}</small>
        </article>
      `
    )
    .join("");
}

function renderCoverage(id) {
  const container = document.querySelector(id);

  if (!container) {
    return;
  }

  container.innerHTML = SITE_CONTENT.coverage
    .map(
      (item) => `
        <article class="coverage-card glass-card">
          <strong>${item.title}</strong>
          <span>${item.summary}</span>
          <small>${item.detail}</small>
        </article>
      `
    )
    .join("");
}

function renderRetailPricing() {
  const pricingMarkup = SITE_CONTENT.retailPricing
    .map(
      (item) => `
        <article class="pricing-card glass-card">
          <p class="mini-label">${item.title}</p>
          <strong>${item.value}</strong>
          <span>${item.subtitle}</span>
          <ul>
            ${item.notes.map((note) => `<li>${note}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");

  const promoMarkup = `
      <p class="mini-label">${SITE_CONTENT.retailPromo.title}</p>
      <strong>${SITE_CONTENT.retailPromo.value}</strong>
      <span>${SITE_CONTENT.retailPromo.summary}</span>
      <ul>
        ${SITE_CONTENT.retailPromo.bullets.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
  document.querySelectorAll("#retail-pricing-grid, #home-retail-pricing").forEach((container) => {
    container.innerHTML = pricingMarkup;
  });

  document.querySelectorAll("#retail-promo-card, #home-retail-promo").forEach((container) => {
    container.innerHTML = promoMarkup;
  });
}

function renderRetailProducts() {
  const container = document.querySelector("#retail-products");

  if (!container) {
    return;
  }

  container.innerHTML = SITE_CONTENT.retailProducts
    .map((item) => {
      const tagClass = item.kind === "con-licor" ? "tag-alcohol" : "tag-soft";
      const tagLabel = item.kind === "con-licor" ? "Con licor" : "Sin licor";
      const priceLabel = item.kind === "con-licor" ? "Desde $8.000" : "$7.000 c/u";
      const wordmark = `<img class="product-wordmark" src="${encodeURI(item.wordmark)}" alt="${item.name}" />`;

      return `
        <article class="product-card ${item.flavorClass}" data-kind="${item.kind}" data-reveal>
          ${wordmark}
          <img class="product-pack" src="${item.image}" alt="Granizado ${item.name}" />
          <div class="product-copy">
            <span class="product-tag ${tagClass}">${tagLabel}</span>
            <strong class="product-price">${priceLabel}</strong>
            <p>${item.description}</p>
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

  const headerCells = SITE_CONTENT.wholesalePricing[0].tiers
    .map((item) => `<th scope="col">${item.range}</th>`)
    .join("");

  const rows = SITE_CONTENT.wholesalePricing
    .map(
      (line) => `
        <tr>
          <td><strong>${line.line}</strong></td>
          ${line.tiers.map((item) => `<td>${item.price}</td>`).join("")}
        </tr>
      `
    )
    .join("");

  container.innerHTML = `
    <table class="pricing-table">
      <thead>
        <tr>
          <th scope="col">Linea</th>
          ${headerCells}
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function renderPartnerMetrics() {
  const metricsContainer = document.querySelector("#partner-metrics");
  const exampleContainer = document.querySelector("#partner-example");

  if (metricsContainer) {
    metricsContainer.innerHTML = SITE_CONTENT.partnerMetrics
      .map(
        (item) => `
          <article class="ally-metric glass-card">
            <strong>${item.value}</strong>
            <span>${item.label}</span>
          </article>
        `
      )
      .join("");
  }

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

function buildPartnerEmail(form) {
  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const amount = String(formData.get("amount") || "").trim();
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

async function copyEmailPreview(subject, body) {
  if (!navigator.clipboard?.writeText) {
    return false;
  }

  await navigator.clipboard.writeText(`Asunto: ${subject}\n\n${body}`);
  return true;
}

function initPartnerForm() {
  if (!partnerForm || !formNote) {
    return;
  }

  partnerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { subject, body, mailLink } = buildPartnerEmail(partnerForm);

    if (mailPreview && mailPreviewSubject && mailPreviewBody && mailPreviewLink) {
      mailPreview.hidden = false;
      mailPreviewSubject.value = subject;
      mailPreviewBody.value = body;
      mailPreviewLink.href = mailLink;
    }

    try {
      const copied = await copyEmailPreview(subject, body);
      formNote.textContent = copied
        ? "Abrimos tu correo y también copiamos el mensaje al portapapeles."
        : "Abrimos tu correo y dejamos el mensaje visible para copiarlo manualmente.";
    } catch {
      formNote.textContent =
        "Abrimos tu correo y dejamos el mensaje visible para copiarlo manualmente.";
    }

    window.location.href = mailLink;
  });

  if (!copyMailButton || !mailPreviewSubject || !mailPreviewBody) {
    return;
  }

  copyMailButton.addEventListener("click", async () => {
    try {
      const copied = await copyEmailPreview(mailPreviewSubject.value, mailPreviewBody.value);
      formNote.textContent = copied
        ? "Mensaje copiado. Ya puedes pegarlo en tu correo."
        : "No se pudo copiar automáticamente. Usa el respaldo visible.";
    } catch {
      formNote.textContent = "No se pudo copiar automáticamente. Usa el respaldo visible.";
    }
  });
}

function init() {
  setYear();
  bindContactLinks();
  renderProofGrid("#home-proof-grid");
  renderProofGrid("#allies-proof-grid");
  renderCoverage("#home-coverage-grid");
  renderCoverage("#retail-coverage-grid");
  renderCoverage("#volume-coverage-grid");
  renderRetailPricing();
  renderRetailProducts();
  renderWholesalePricing();
  renderPartnerMetrics();
  initFilter();
  initReveal();
  initPartnerForm();
}

init();
