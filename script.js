const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const productCards = Array.from(document.querySelectorAll(".product-card"));
const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));
const partnerForm = document.querySelector("#partner-form");
const formNote = document.querySelector("#form-note");
const mailPreview = document.querySelector("#mail-preview");
const mailPreviewSubject = document.querySelector("#mail-preview-subject");
const mailPreviewBody = document.querySelector("#mail-preview-body");
const mailPreviewLink = document.querySelector("#mail-preview-link");
const copyMailButton = document.querySelector("#copy-mail");
const yearNode = document.querySelector("#year");
const bodyPage = document.body.dataset.page;
const navLinks = Array.from(document.querySelectorAll("[data-nav]"));

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (bodyPage) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === bodyPage);
  });
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

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

function buildPartnerEmail(form) {
  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const business = String(formData.get("business") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const subjectName = name || "Nuevo contacto";
  const subject = `Quiero ser parte de Trabix - ${subjectName}`;
  const lines = [
    "Hola Trabix,",
    "",
    `Mi nombre es: ${name || "No informado"}`,
    `Negocio o proyecto: ${business || "No informado"}`,
    `Ciudad: ${city || "No informada"}`,
    "",
    "Quiero ser parte del negocio y esta es mi idea:",
    message || "Sin mensaje adicional.",
  ];
  const body = lines.join("\n");
  const mailtoLink =
    "mailto:trabixgranizados@gmail.com" +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  return { subject, body, mailtoLink };
}

async function copyEmailPreview(subject, body) {
  if (!navigator.clipboard?.writeText) {
    return false;
  }

  await navigator.clipboard.writeText(`Asunto: ${subject}\n\n${body}`);
  return true;
}

if (partnerForm && formNote) {
  partnerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { subject, body, mailtoLink } = buildPartnerEmail(partnerForm);

    if (mailPreview && mailPreviewSubject && mailPreviewBody && mailPreviewLink) {
      mailPreview.hidden = false;
      mailPreviewSubject.value = subject;
      mailPreviewBody.value = body;
      mailPreviewLink.href = mailtoLink;
    }

    try {
      const copied = await copyEmailPreview(subject, body);
      formNote.textContent = copied
        ? "Abrimos tu correo y tambien copiamos el mensaje al portapapeles."
        : "Abrimos tu correo y dejamos el mensaje visible por si necesitas copiarlo.";
    } catch {
      formNote.textContent = "Abrimos tu correo y dejamos el mensaje visible por si necesitas copiarlo.";
    }

    window.location.href = mailtoLink;
  });
}

if (copyMailButton && mailPreviewSubject && mailPreviewBody && formNote) {
  copyMailButton.addEventListener("click", async () => {
    try {
      const copied = await copyEmailPreview(mailPreviewSubject.value, mailPreviewBody.value);
      formNote.textContent = copied
        ? "Mensaje copiado. Ya puedes pegarlo en tu correo."
        : "No pudimos copiar automaticamente. Usa el texto visible como respaldo.";
    } catch {
      formNote.textContent = "No pudimos copiar automaticamente. Usa el texto visible como respaldo.";
    }
  });
}
